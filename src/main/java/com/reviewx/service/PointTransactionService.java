package com.reviewx.service;

import com.reviewx.entity.*;
import com.reviewx.exception.PointTransactionException;
import com.reviewx.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PointTransactionService {

    private final PointTransactionRepository pointTransactionRepository;
    private final UserRepository userRepository;
    private final CampaignRepository campaignRepository;
    private final ReviewRepository reviewRepository;

    // 최대 재시도 횟수 (낙관적 락 충돌 시)
    private static final int MAX_RETRY_ATTEMPTS = 3;
    
    // 거래 타임아웃 (분)
    private static final int TRANSACTION_TIMEOUT_MINUTES = 30;

    /**
     * 포인트 충전 (파트너)
     */
    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class)
    public PointTransaction chargePoints(Long userId, Integer amount, 
                                       PointTransaction.PaymentMethod paymentMethod,
                                       String paymentKey, String orderId) {
        log.info("Charging {} points to user {}", amount, userId);
        
        validateAmount(amount);
        
        // 중복 결제 확인
        if (paymentKey != null) {
            Optional<PointTransaction> existing = pointTransactionRepository.findByPaymentKeyOrOrderId(paymentKey, orderId);
            if (existing.isPresent()) {
                throw PointTransactionException.duplicatePayment(paymentKey);
            }
        }
        
        User user = getUserById(userId);
        
        if (!user.isPartner()) {
            throw new PointTransactionException(PointTransactionException.ErrorCode.INSUFFICIENT_PERMISSIONS,
                "파트너만 포인트를 충전할 수 있습니다");
        }
        
        return processTransactionWithRetry(() -> {
            // 사용자 재조회 (낙관적 락)
            User freshUser = userRepository.findById(userId)
                .orElseThrow(() -> PointTransactionException.userNotFound(userId));
            
            // 거래 내역 생성
            PointTransaction transaction = PointTransaction.charge(freshUser, amount, paymentMethod, paymentKey, orderId);
            
            // 사용자 잔액 업데이트
            freshUser.addPoint(amount);
            
            // 잔액 일관성 검증
            validateBalanceConsistency(transaction);
            
            // 저장
            userRepository.save(freshUser);
            PointTransaction savedTransaction = pointTransactionRepository.save(transaction);
            
            log.info("Points charged successfully: {} points to user {}, transaction {}", 
                amount, userId, savedTransaction.getId());
            
            return savedTransaction;
        });
    }

    /**
     * 캠페인 등록 비용 차감 (파트너)
     */
    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class)
    public PointTransaction deductCampaignCost(Long partnerId, Long campaignId, Integer cost) {
        log.info("Deducting campaign cost: {} points from partner {}", cost, partnerId);
        
        validateAmount(cost);
        
        User partner = getUserById(partnerId);
        Campaign campaign = getCampaignById(campaignId);
        
        if (!partner.isPartner()) {
            throw new PointTransactionException(PointTransactionException.ErrorCode.INSUFFICIENT_PERMISSIONS,
                "파트너만 캠페인 비용을 결제할 수 있습니다");
        }
        
        // 캠페인 소유자 검증
        if (!campaign.getPartner().getId().equals(partnerId)) {
            throw new PointTransactionException(PointTransactionException.ErrorCode.INSUFFICIENT_PERMISSIONS,
                "본인의 캠페인만 결제할 수 있습니다");
        }
        
        return processTransactionWithRetry(() -> {
            // 사용자 재조회 (낙관적 락)
            User freshPartner = userRepository.findById(partnerId)
                .orElseThrow(() -> PointTransactionException.userNotFound(partnerId));
            
            // 잔액 확인
            if (freshPartner.getPointBalance() < cost) {
                throw PointTransactionException.insufficientBalance(freshPartner.getPointBalance(), cost);
            }
            
            // 거래 내역 생성
            PointTransaction transaction = PointTransaction.campaignPayment(freshPartner, campaign, cost);
            
            // 사용자 잔액 업데이트
            if (!freshPartner.deductPoint(cost)) {
                throw PointTransactionException.insufficientBalance(freshPartner.getPointBalance(), cost);
            }
            
            // 잔액 일관성 검증
            validateBalanceConsistency(transaction);
            
            // 저장
            userRepository.save(freshPartner);
            PointTransaction savedTransaction = pointTransactionRepository.save(transaction);
            
            log.info("Campaign cost deducted successfully: {} points from partner {}, transaction {}", 
                cost, partnerId, savedTransaction.getId());
            
            return savedTransaction;
        });
    }

    /**
     * 리뷰 보상 지급 (리뷰어)
     */
    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class)
    public PointTransaction payReviewReward(Long reviewerId, Long reviewId, Integer rewardPoint) {
        log.info("Processing review reward payment: {} points to reviewer {}", rewardPoint, reviewerId);
        
        validateAmount(rewardPoint);
        
        User reviewer = getUserById(reviewerId);
        Review review = getReviewById(reviewId);
        
        if (!reviewer.isReviewer()) {
            throw new PointTransactionException(PointTransactionException.ErrorCode.INSUFFICIENT_PERMISSIONS,
                "리뷰어만 리워드를 받을 수 있습니다");
        }
        
        // 리뷰 소유자 검증
        if (!review.getReviewer().getId().equals(reviewerId)) {
            throw new PointTransactionException(PointTransactionException.ErrorCode.INSUFFICIENT_PERMISSIONS,
                "본인의 리뷰에 대해서만 보상을 받을 수 있습니다");
        }
        
        // 중복 보상 확인
        Optional<PointTransaction> existingReward = pointTransactionRepository.findByReviewId(reviewId);
        if (existingReward.isPresent()) {
            throw PointTransactionException.reviewAlreadyRewarded(reviewId);
        }
        
        return processTransactionWithRetry(() -> {
            // 사용자 재조회 (낙관적 락)
            User freshReviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> PointTransactionException.userNotFound(reviewerId));
            
            // 거래 내역 생성
            PointTransaction transaction = PointTransaction.reviewReward(freshReviewer, review, rewardPoint);
            
            // 사용자 잔액 업데이트
            freshReviewer.addPoint(rewardPoint);
            
            // 잔액 일관성 검증
            validateBalanceConsistency(transaction);
            
            // 저장
            userRepository.save(freshReviewer);
            PointTransaction savedTransaction = pointTransactionRepository.save(transaction);
            
            log.info("Review reward paid successfully: {} points to reviewer {}, transaction {}", 
                rewardPoint, reviewerId, savedTransaction.getId());
            
            return savedTransaction;
        });
    }

    /**
     * 포인트 출금 신청 (리뷰어)
     */
    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class)
    public PointTransaction requestWithdrawal(Long userId, Integer amount) {
        log.info("Processing withdrawal request: {} points from user {}", amount, userId);
        
        validateAmount(amount);
        
        User user = getUserById(userId);
        
        if (!user.isReviewer()) {
            throw new PointTransactionException(PointTransactionException.ErrorCode.INSUFFICIENT_PERMISSIONS,
                "리뷰어만 출금을 신청할 수 있습니다");
        }
        
        // 최소 출금 금액 확인 (예: 1,000 포인트)
        if (amount < 1000) {
            throw new PointTransactionException(PointTransactionException.ErrorCode.WITHDRAWAL_NOT_ALLOWED,
                "최소 출금 금액은 1,000 포인트입니다");
        }
        
        return processTransactionWithRetry(() -> {
            // 사용자 재조회 (낙관적 락)
            User freshUser = userRepository.findById(userId)
                .orElseThrow(() -> PointTransactionException.userNotFound(userId));
            
            // 잔액 확인
            if (freshUser.getPointBalance() < amount) {
                throw PointTransactionException.insufficientBalance(freshUser.getPointBalance(), amount);
            }
            
            // 거래 내역 생성 (대기 상태로)
            PointTransaction transaction = PointTransaction.withdrawal(freshUser, amount);
            transaction.setStatus(PointTransaction.TransactionStatus.PENDING);
            transaction.setProcessedAt(null); // 아직 처리되지 않음
            
            // 사용자 잔액 차감 및 출금 대기 금액 설정
            if (!freshUser.deductPoint(amount)) {
                throw PointTransactionException.insufficientBalance(freshUser.getPointBalance(), amount);
            }
            freshUser.setPendingWithdrawal(freshUser.getPendingWithdrawal() + amount);
            
            // 잔액 일관성 검증 (대기 상태이므로 별도 검증)
            if (transaction.getBalanceAfter() != freshUser.getPointBalance()) {
                throw PointTransactionException.balanceMismatch(transaction.getBalanceAfter(), freshUser.getPointBalance());
            }
            
            // 저장
            userRepository.save(freshUser);
            PointTransaction savedTransaction = pointTransactionRepository.save(transaction);
            
            log.info("Withdrawal requested successfully: {} points from user {}, transaction {}", 
                amount, userId, savedTransaction.getId());
            
            return savedTransaction;
        });
    }

    /**
     * 출금 완료 처리 (관리자)
     */
    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class)
    public PointTransaction completeWithdrawal(Long transactionId, Long adminId) {
        log.info("Completing withdrawal transaction: {}", transactionId);
        
        PointTransaction transaction = getTransactionById(transactionId);
        User admin = getUserById(adminId);
        
        if (!admin.isAdmin()) {
            throw new PointTransactionException(PointTransactionException.ErrorCode.INSUFFICIENT_PERMISSIONS,
                "관리자만 출금을 완료할 수 있습니다");
        }
        
        if (transaction.getTransactionType() != PointTransaction.TransactionType.WITHDRAWAL) {
            throw new PointTransactionException(PointTransactionException.ErrorCode.INVALID_TRANSACTION_STATUS,
                "출금 거래가 아닙니다");
        }
        
        if (transaction.getStatus() != PointTransaction.TransactionStatus.PENDING) {
            throw new PointTransactionException(PointTransactionException.ErrorCode.TRANSACTION_ALREADY_PROCESSED,
                "이미 처리된 거래입니다: " + transaction.getStatus());
        }
        
        return processTransactionWithRetry(() -> {
            // 거래 및 사용자 재조회
            PointTransaction freshTransaction = pointTransactionRepository.findById(transactionId)
                .orElseThrow(() -> PointTransactionException.transactionNotFound(transactionId));
            
            User user = freshTransaction.getUser();
            User freshUser = userRepository.findById(user.getId())
                .orElseThrow(() -> PointTransactionException.userNotFound(user.getId()));
            
            // 출금 대기 금액 차감
            freshUser.setPendingWithdrawal(Math.max(0, freshUser.getPendingWithdrawal() - freshTransaction.getAmount()));
            
            // 거래 완료 처리
            freshTransaction.complete();
            freshTransaction.processBy(admin, "출금 완료 처리");
            
            // 저장
            userRepository.save(freshUser);
            PointTransaction savedTransaction = pointTransactionRepository.save(freshTransaction);
            
            log.info("Withdrawal completed successfully: transaction {}", transactionId);
            
            return savedTransaction;
        });
    }

    /**
     * 출금 취소 (관리자 또는 사용자)
     */
    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class)
    public PointTransaction cancelWithdrawal(Long transactionId, Long requesterId, String reason) {
        log.info("Cancelling withdrawal transaction: {}", transactionId);
        
        PointTransaction transaction = getTransactionById(transactionId);
        User requester = getUserById(requesterId);
        
        // 권한 확인 (본인 또는 관리자)
        if (!transaction.getUser().getId().equals(requesterId) && !requester.isAdmin()) {
            throw new PointTransactionException(PointTransactionException.ErrorCode.INSUFFICIENT_PERMISSIONS,
                "본인의 출금 또는 관리자만 취소할 수 있습니다");
        }
        
        if (transaction.getTransactionType() != PointTransaction.TransactionType.WITHDRAWAL) {
            throw new PointTransactionException(PointTransactionException.ErrorCode.INVALID_TRANSACTION_STATUS,
                "출금 거래가 아닙니다");
        }
        
        if (transaction.getStatus() != PointTransaction.TransactionStatus.PENDING) {
            throw new PointTransactionException(PointTransactionException.ErrorCode.INVALID_TRANSACTION_STATUS,
                "취소할 수 없는 상태입니다: " + transaction.getStatus());
        }
        
        return processTransactionWithRetry(() -> {
            // 거래 및 사용자 재조회
            PointTransaction freshTransaction = pointTransactionRepository.findById(transactionId)
                .orElseThrow(() -> PointTransactionException.transactionNotFound(transactionId));
            
            User user = freshTransaction.getUser();
            User freshUser = userRepository.findById(user.getId())
                .orElseThrow(() -> PointTransactionException.userNotFound(user.getId()));
            
            // 포인트 복구 및 출금 대기 금액 차감
            freshUser.addPoint(freshTransaction.getAmount());
            freshUser.setPendingWithdrawal(Math.max(0, freshUser.getPendingWithdrawal() - freshTransaction.getAmount()));
            
            // 거래 취소 처리
            freshTransaction.cancel();
            if (requester.isAdmin()) {
                freshTransaction.processBy(requester, "관리자 출금 취소: " + reason);
            }
            
            // 저장
            userRepository.save(freshUser);
            PointTransaction savedTransaction = pointTransactionRepository.save(freshTransaction);
            
            log.info("Withdrawal cancelled successfully: transaction {}", transactionId);
            
            return savedTransaction;
        });
    }

    /**
     * 관리자 수동 조정
     */
    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class)
    public PointTransaction adminAdjustment(Long userId, Integer amount, String reason, Long adminId) {
        log.info("Admin adjustment: {} points for user {}, reason: {}", amount, userId, reason);
        
        if (amount == null || amount == 0) {
            throw PointTransactionException.invalidAmount(amount);
        }
        
        User user = getUserById(userId);
        User admin = getUserById(adminId);
        
        if (!admin.isAdmin()) {
            throw new PointTransactionException(PointTransactionException.ErrorCode.INSUFFICIENT_PERMISSIONS,
                "관리자만 수동 조정할 수 있습니다");
        }
        
        // 차감인 경우 잔액 확인
        if (amount < 0 && user.getPointBalance() < Math.abs(amount)) {
            throw PointTransactionException.insufficientBalance(user.getPointBalance(), Math.abs(amount));
        }
        
        return processTransactionWithRetry(() -> {
            // 사용자 재조회 (낙관적 락)
            User freshUser = userRepository.findById(userId)
                .orElseThrow(() -> PointTransactionException.userNotFound(userId));
            
            // 거래 내역 생성
            PointTransaction transaction = PointTransaction.adminAdjustment(freshUser, Math.abs(amount), reason, admin);
            
            // 사용자 잔액 업데이트
            if (amount > 0) {
                freshUser.addPoint(amount);
            } else {
                if (!freshUser.deductPoint(Math.abs(amount))) {
                    throw PointTransactionException.insufficientBalance(freshUser.getPointBalance(), Math.abs(amount));
                }
            }
            
            // 잔액 일관성 검증
            validateBalanceConsistency(transaction);
            
            // 저장
            userRepository.save(freshUser);
            PointTransaction savedTransaction = pointTransactionRepository.save(transaction);
            
            log.info("Admin adjustment completed: {} points for user {}, transaction {}", 
                amount, userId, savedTransaction.getId());
            
            return savedTransaction;
        });
    }

    /**
     * 캠페인 환불 처리
     */
    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class)
    public PointTransaction refundCampaign(Long partnerId, Long campaignId, Integer refundAmount, String reason) {
        log.info("Processing campaign refund: {} points to partner {}", refundAmount, partnerId);
        
        validateAmount(refundAmount);
        
        User partner = getUserById(partnerId);
        Campaign campaign = getCampaignById(campaignId);
        
        if (!partner.isPartner()) {
            throw new PointTransactionException(PointTransactionException.ErrorCode.INSUFFICIENT_PERMISSIONS,
                "파트너만 캠페인 환불을 받을 수 있습니다");
        }
        
        if (!campaign.getPartner().getId().equals(partnerId)) {
            throw new PointTransactionException(PointTransactionException.ErrorCode.INSUFFICIENT_PERMISSIONS,
                "본인의 캠페인만 환불받을 수 있습니다");
        }
        
        return processTransactionWithRetry(() -> {
            // 사용자 재조회 (낙관적 락)
            User freshPartner = userRepository.findById(partnerId)
                .orElseThrow(() -> PointTransactionException.userNotFound(partnerId));
            
            // 거래 내역 생성
            PointTransaction transaction = PointTransaction.campaignRefund(freshPartner, campaign, refundAmount);
            transaction.setDescription(transaction.getDescription() + " - " + reason);
            
            // 사용자 잔액 업데이트
            freshPartner.addPoint(refundAmount);
            
            // 잔액 일관성 검증
            validateBalanceConsistency(transaction);
            
            // 저장
            userRepository.save(freshPartner);
            PointTransaction savedTransaction = pointTransactionRepository.save(transaction);
            
            log.info("Campaign refund processed successfully: {} points to partner {}, transaction {}", 
                refundAmount, partnerId, savedTransaction.getId());
            
            return savedTransaction;
        });
    }

    /**
     * 사용자별 거래 내역 조회
     */
    public Page<PointTransaction> getUserTransactions(Long userId, Pageable pageable) {
        User user = getUserById(userId);
        return pointTransactionRepository.findByUser(user, pageable);
    }

    /**
     * 캠페인별 거래 내역 조회
     */
    public List<PointTransaction> getCampaignTransactions(Long campaignId) {
        return pointTransactionRepository.findByCampaignId(campaignId);
    }

    /**
     * 거래 내역 상세 조회
     */
    public PointTransaction getTransactionDetail(Long transactionId, Long userId) {
        PointTransaction transaction = getTransactionById(transactionId);
        
        // 권한 확인 (본인의 거래만 조회 가능)
        if (!transaction.getUser().getId().equals(userId)) {
            throw new PointTransactionException(PointTransactionException.ErrorCode.INSUFFICIENT_PERMISSIONS,
                "본인의 거래 내역만 조회할 수 있습니다");
        }
        
        return transaction;
    }

    /**
     * 사용자 포인트 잔액 검증
     */
    public boolean verifyUserBalance(Long userId) {
        User user = getUserById(userId);
        Integer calculatedBalance = pointTransactionRepository.calculateUserPointBalance(user);
        Integer userBalance = user.getPointBalance();
        
        boolean isValid = calculatedBalance.equals(userBalance);
        
        if (!isValid) {
            log.error("Balance mismatch for user {}: calculated={}, user={}", 
                userId, calculatedBalance, userBalance);
        }
        
        return isValid;
    }

    /**
     * 타임아웃된 거래 정리 (스케줄러에서 호출)
     */
    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class)
    public void cleanupTimeoutTransactions() {
        LocalDateTime timeoutDate = LocalDateTime.now().minusMinutes(TRANSACTION_TIMEOUT_MINUTES);
        List<PointTransaction> timeoutTransactions = pointTransactionRepository.findTimeoutTransactions(timeoutDate);
        
        for (PointTransaction transaction : timeoutTransactions) {
            try {
                if (transaction.getTransactionType() == PointTransaction.TransactionType.WITHDRAWAL) {
                    // 출금 거래는 포인트를 복구하고 대기 금액 차감
                    User user = transaction.getUser();
                    user.addPoint(transaction.getAmount());
                    user.setPendingWithdrawal(Math.max(0, user.getPendingWithdrawal() - transaction.getAmount()));
                    userRepository.save(user);
                }
                
                transaction.fail();
                pointTransactionRepository.save(transaction);
                
                log.info("Timeout transaction cleaned up: {}", transaction.getId());
            } catch (Exception e) {
                log.error("Failed to cleanup timeout transaction: {}", transaction.getId(), e);
            }
        }
    }

    // === Private Helper Methods ===
    
    private User getUserById(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> PointTransactionException.userNotFound(userId));
    }
    
    private Campaign getCampaignById(Long campaignId) {
        return campaignRepository.findById(campaignId)
            .orElseThrow(() -> PointTransactionException.campaignNotFound(campaignId));
    }
    
    private Review getReviewById(Long reviewId) {
        return reviewRepository.findById(reviewId)
            .orElseThrow(() -> PointTransactionException.reviewNotFound(reviewId));
    }
    
    private PointTransaction getTransactionById(Long transactionId) {
        return pointTransactionRepository.findById(transactionId)
            .orElseThrow(() -> PointTransactionException.transactionNotFound(transactionId));
    }
    
    private void validateAmount(Integer amount) {
        if (amount == null || amount <= 0) {
            throw PointTransactionException.invalidAmount(amount);
        }
    }
    
    private void validateBalanceConsistency(PointTransaction transaction) {
        Integer expectedBalance = transaction.getBalanceAfter();
        Integer actualBalance = transaction.getUser().getPointBalance();
        
        if (!expectedBalance.equals(actualBalance)) {
            throw PointTransactionException.balanceMismatch(expectedBalance, actualBalance);
        }
    }
    
    private PointTransaction processTransactionWithRetry(TransactionProcessor processor) {
        int attempts = 0;
        while (attempts < MAX_RETRY_ATTEMPTS) {
            try {
                return processor.process();
            } catch (ObjectOptimisticLockingFailureException e) {
                attempts++;
                if (attempts >= MAX_RETRY_ATTEMPTS) {
                    log.error("Max retry attempts reached for transaction processing", e);
                    throw new PointTransactionException(PointTransactionException.ErrorCode.CONCURRENCY_ERROR, 
                        "동시 처리 오류로 인해 거래를 완료할 수 없습니다", e);
                }
                log.warn("Optimistic lock failure, retrying... attempt {}/{}", attempts, MAX_RETRY_ATTEMPTS);
                try {
                    Thread.sleep(100 * attempts); // 백오프
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new PointTransactionException(PointTransactionException.ErrorCode.SYSTEM_ERROR, 
                        "거래 처리가 중단되었습니다", ie);
                }
            } catch (PointTransactionException e) {
                throw e;
            } catch (Exception e) {
                log.error("Transaction processing failed", e);
                throw new PointTransactionException(PointTransactionException.ErrorCode.SYSTEM_ERROR, 
                    "거래 처리 중 오류가 발생했습니다", e);
            }
        }
        throw new PointTransactionException(PointTransactionException.ErrorCode.SYSTEM_ERROR, 
            "거래 처리를 완료할 수 없습니다");
    }
    
    @FunctionalInterface
    private interface TransactionProcessor {
        PointTransaction process() throws Exception;
    }
}