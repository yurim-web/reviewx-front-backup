package com.reviewx.service;

import com.reviewx.dto.withdrawal.WithdrawalListRequest;
import com.reviewx.entity.PointTransaction;
import com.reviewx.entity.User;
import com.reviewx.entity.Withdrawal;
import com.reviewx.exception.BusinessException;
import com.reviewx.exception.ErrorCode;
import com.reviewx.repository.UserRepository;
import com.reviewx.repository.WithdrawalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WithdrawalService {

    private final WithdrawalRepository withdrawalRepository;
    private final UserRepository userRepository;
    private final PointTransactionService pointTransactionService;

    // 정책 상수
    private static final int MIN_WITHDRAWAL_AMOUNT = 5000; // 최소 출금 금액
    private static final int MAX_WITHDRAWAL_AMOUNT = 1000000; // 최대 출금 금액
    private static final int DAILY_WITHDRAWAL_LIMIT = 3; // 일일 출금 신청 제한
    private static final int PROCESSING_DELAY_DAYS = 3; // 처리 지연 기준일

    /**
     * 출금 신청
     */
    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class)
    public Withdrawal requestWithdrawal(Long userId, Integer amount, String bankName,
                                      String accountNumber, String accountHolder) {
        log.info("Processing withdrawal request: userId={}, amount={}", userId, amount);

        // 사용자 조회
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "사용자를 찾을 수 없습니다."));

        // 리뷰어 권한 확인
        if (!user.isReviewer()) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_PERMISSIONS, "리뷰어만 출금을 신청할 수 있습니다.");
        }

        // 출금 정책 검증
        validateWithdrawalRequest(user, amount);

        // 일일 출금 제한 확인
        validateDailyWithdrawalLimit(user);

        // 사용자 계좌 정보 업데이트 (다르면 업데이트)
        updateUserBankAccount(user, bankName, accountNumber, accountHolder);

        // 출금 생성
        Withdrawal withdrawal = Withdrawal.createRequest(user, amount);

        // 포인트 차감 (PointTransactionService 사용)
        PointTransaction pointTransaction = pointTransactionService.requestWithdrawal(userId, amount);
        withdrawal.linkPointTransaction(pointTransaction);

        // 저장
        Withdrawal savedWithdrawal = withdrawalRepository.save(withdrawal);

        log.info("Withdrawal requested successfully: withdrawalId={}, amount={}",
            savedWithdrawal.getId(), amount);

        return savedWithdrawal;
    }

    /**
     * 내 출금 신청 목록 조회
     */
    public Page<Withdrawal> getMyWithdrawals(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "사용자를 찾을 수 없습니다."));

        return withdrawalRepository.findByUserOrderByRequestedAtDesc(user, pageable);
    }

    /**
     * 출금 신청 상세 조회
     */
    public Withdrawal getWithdrawalDetail(Long withdrawalId, Long userId) {
        Withdrawal withdrawal = withdrawalRepository.findById(withdrawalId)
            .orElseThrow(() -> new BusinessException(ErrorCode.WITHDRAWAL_NOT_FOUND, "출금 내역을 찾을 수 없습니다."));

        // 본인의 출금 내역인지 확인
        if (!withdrawal.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_PERMISSIONS, "본인의 출금 내역만 조회할 수 있습니다.");
        }

        return withdrawal;
    }

    /**
     * 출금 신청 취소 (사용자)
     */
    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class)
    public Withdrawal cancelWithdrawal(Long withdrawalId, Long userId) {
        log.info("Processing withdrawal cancellation: withdrawalId={}, userId={}", withdrawalId, userId);

        Withdrawal withdrawal = withdrawalRepository.findById(withdrawalId)
            .orElseThrow(() -> new BusinessException(ErrorCode.WITHDRAWAL_NOT_FOUND, "출금 내역을 찾을 수 없습니다."));

        // 본인의 출금 내역인지 확인
        if (!withdrawal.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_PERMISSIONS, "본인의 출금 내역만 취소할 수 있습니다.");
        }

        // 취소 가능한 상태인지 확인
        if (!withdrawal.isCancellable()) {
            throw new BusinessException(ErrorCode.INVALID_WITHDRAWAL_STATUS,
                "취소할 수 없는 상태입니다: " + withdrawal.getStatusDisplayText());
        }

        // 출금 취소
        withdrawal.cancel();

        // 포인트 복구 (PointTransactionService 사용)
        if (withdrawal.getPointTransaction() != null) {
            pointTransactionService.cancelWithdrawal(
                withdrawal.getPointTransaction().getId(), userId, "사용자 출금 취소");
        }

        Withdrawal savedWithdrawal = withdrawalRepository.save(withdrawal);

        log.info("Withdrawal cancelled successfully: withdrawalId={}", withdrawalId);

        return savedWithdrawal;
    }

    /**
     * 출금 가능 금액 조회
     */
    public Integer getAvailableWithdrawalAmount(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "사용자를 찾을 수 없습니다."));

        return user.getPointBalance(); // 현재 포인트 잔액이 출금 가능 금액
    }

    /**
     * 사용자 출금 통계 조회
     */
    public WithdrawalStats getUserWithdrawalStats(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "사용자를 찾을 수 없습니다."));

        Integer totalWithdrawn = withdrawalRepository.getTotalWithdrawnAmountByUser(user);
        Long withdrawalCount = withdrawalRepository.getWithdrawalCountByUser(user);
        Integer pendingAmount = withdrawalRepository.getPendingWithdrawalAmountByUser(user);

        return WithdrawalStats.builder()
            .totalWithdrawn(totalWithdrawn != null ? totalWithdrawn : 0)
            .withdrawalCount(withdrawalCount != null ? withdrawalCount : 0L)
            .pendingAmount(pendingAmount != null ? pendingAmount : 0)
            .availableAmount(user.getPointBalance())
            .build();
    }

    // === 관리자용 메서드 ===

    /**
     * 모든 출금 신청 조회 (관리자용)
     */
    public Page<Withdrawal> getAllWithdrawals(Pageable pageable) {
        return withdrawalRepository.findAllByOrderByRequestedAtDesc(pageable);
    }

    /**
     * 상태별 출금 신청 조회 (관리자용)
     */
    public Page<Withdrawal> getWithdrawalsByStatus(Withdrawal.WithdrawalStatus status, Pageable pageable) {
        return withdrawalRepository.findByStatusOrderByRequestedAtDesc(status, pageable);
    }

    /**
     * 조건별 출금 신청 검색 (관리자용)
     */
    public Page<Withdrawal> searchWithdrawals(WithdrawalListRequest request, Pageable pageable) {
        Withdrawal.WithdrawalStatus status = request.getStatus() != null ?
            Withdrawal.WithdrawalStatus.valueOf(request.getStatus()) : null;

        LocalDateTime startDate = request.getStartDate() != null ?
            request.getStartDate().atStartOfDay() : null;
        LocalDateTime endDate = request.getEndDate() != null ?
            request.getEndDate().plusDays(1).atStartOfDay() : null;

        return withdrawalRepository.findWithdrawalsWithFilters(
            status, startDate, endDate, request.getMinAmount(), request.getMaxAmount(),
            request.getKeyword(), pageable);
    }

    /**
     * 처리 지연 출금 조회
     */
    public List<Withdrawal> getDelayedWithdrawals() {
        LocalDateTime delayThreshold = LocalDateTime.now().minusDays(PROCESSING_DELAY_DAYS);
        return withdrawalRepository.findDelayedWithdrawals(delayThreshold);
    }

    // === Private Helper Methods ===

    /**
     * 출금 신청 유효성 검증
     */
    private void validateWithdrawalRequest(User user, Integer amount) {
        // 금액 검증
        if (amount == null || amount < MIN_WITHDRAWAL_AMOUNT) {
            throw new BusinessException(ErrorCode.INVALID_WITHDRAWAL_AMOUNT,
                String.format("최소 출금 금액은 %,d P 입니다.", MIN_WITHDRAWAL_AMOUNT));
        }

        if (amount > MAX_WITHDRAWAL_AMOUNT) {
            throw new BusinessException(ErrorCode.INVALID_WITHDRAWAL_AMOUNT,
                String.format("최대 출금 금액은 %,d P 입니다.", MAX_WITHDRAWAL_AMOUNT));
        }

        // 잔액 검증
        if (user.getPointBalance() < amount) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_BALANCE,
                String.format("보유 포인트가 부족합니다. (보유: %,d P, 신청: %,d P)",
                    user.getPointBalance(), amount));
        }

        // 대기 중인 출금이 있는지 확인
        List<Withdrawal> pendingWithdrawals = withdrawalRepository.findPendingWithdrawalsByUser(user);
        if (!pendingWithdrawals.isEmpty()) {
            throw new BusinessException(ErrorCode.PENDING_WITHDRAWAL_EXISTS,
                "처리 중인 출금 신청이 있습니다. 완료 후 다시 신청해주세요.");
        }
    }

    /**
     * 일일 출금 제한 확인
     */
    private void validateDailyWithdrawalLimit(User user) {
        LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
        Long todayCount = withdrawalRepository.countRecentWithdrawalsByUser(user, startOfDay);

        if (todayCount >= DAILY_WITHDRAWAL_LIMIT) {
            throw new BusinessException(ErrorCode.DAILY_WITHDRAWAL_LIMIT_EXCEEDED,
                String.format("일일 출금 신청 한도를 초과했습니다. (일일 한도: %d회)", DAILY_WITHDRAWAL_LIMIT));
        }
    }

    /**
     * 사용자 계좌 정보 업데이트
     */
    private void updateUserBankAccount(User user, String bankName, String accountNumber, String accountHolder) {
        boolean needUpdate = false;

        if (!bankName.equals(user.getBankName())) {
            user.setBankName(bankName);
            needUpdate = true;
        }
        if (!accountNumber.equals(user.getAccountNumber())) {
            user.setAccountNumber(accountNumber);
            needUpdate = true;
        }
        if (!accountHolder.equals(user.getAccountHolder())) {
            user.setAccountHolder(accountHolder);
            needUpdate = true;
        }

        if (needUpdate) {
            userRepository.save(user);
            log.info("User bank account updated: userId={}", user.getId());
        }
    }

    /**
     * 출금 통계 데이터 클래스
     */
    @lombok.Builder
    @lombok.Data
    public static class WithdrawalStats {
        private Integer totalWithdrawn;
        private Long withdrawalCount;
        private Integer pendingAmount;
        private Integer availableAmount;

        public String getFormattedTotalWithdrawn() {
            return String.format("%,d원", totalWithdrawn);
        }

        public String getFormattedPendingAmount() {
            return String.format("%,d P", pendingAmount);
        }

        public String getFormattedAvailableAmount() {
            return String.format("%,d P", availableAmount);
        }
    }
}