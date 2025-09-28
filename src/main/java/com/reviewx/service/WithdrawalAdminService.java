package com.reviewx.service;

import com.reviewx.dto.admin.WithdrawalStatsResponse;
import com.reviewx.entity.User;
import com.reviewx.entity.Withdrawal;
import com.reviewx.exception.BusinessException;
import com.reviewx.exception.ErrorCode;
import com.reviewx.repository.UserRepository;
import com.reviewx.repository.WithdrawalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WithdrawalAdminService {

    private final WithdrawalRepository withdrawalRepository;
    private final UserRepository userRepository;
    private final PointTransactionService pointTransactionService;

    /**
     * 출금 신청 승인
     */
    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class)
    public Withdrawal approveWithdrawal(Long withdrawalId, Long adminId, String note,
                                      String bankTransactionId, String bankReferenceNumber) {
        log.info("Processing withdrawal approval: withdrawalId={}, adminId={}", withdrawalId, adminId);

        Withdrawal withdrawal = withdrawalRepository.findById(withdrawalId)
            .orElseThrow(() -> new BusinessException(ErrorCode.WITHDRAWAL_NOT_FOUND, "출금 내역을 찾을 수 없습니다."));

        User admin = userRepository.findById(adminId)
            .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "관리자를 찾을 수 없습니다."));

        // 관리자 권한 확인
        if (!admin.isAdmin()) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_PERMISSIONS, "관리자만 출금을 승인할 수 있습니다.");
        }

        // 승인 가능한 상태인지 확인
        if (!withdrawal.isPending() && !withdrawal.isUnderReview()) {
            throw new BusinessException(ErrorCode.INVALID_WITHDRAWAL_STATUS,
                "승인할 수 없는 상태입니다: " + withdrawal.getStatusDisplayText());
        }

        // 출금 승인 처리
        withdrawal.approve(admin, note);

        // 은행 거래 정보 설정 (있는 경우)
        if (bankTransactionId != null || bankReferenceNumber != null) {
            withdrawal.setBankTransactionId(bankTransactionId);
            withdrawal.setBankReferenceNumber(bankReferenceNumber);
        }

        // 포인트 거래 완료 처리 (PointTransactionService 사용)
        if (withdrawal.getPointTransaction() != null) {
            pointTransactionService.completeWithdrawal(
                withdrawal.getPointTransaction().getId(), adminId);
        }

        Withdrawal savedWithdrawal = withdrawalRepository.save(withdrawal);

        log.info("Withdrawal approved successfully: withdrawalId={}, adminId={}", withdrawalId, adminId);

        return savedWithdrawal;
    }

    /**
     * 출금 신청 반려
     */
    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class)
    public Withdrawal rejectWithdrawal(Long withdrawalId, Long adminId, String rejectionReason, String adminNote) {
        log.info("Processing withdrawal rejection: withdrawalId={}, adminId={}", withdrawalId, adminId);

        Withdrawal withdrawal = withdrawalRepository.findById(withdrawalId)
            .orElseThrow(() -> new BusinessException(ErrorCode.WITHDRAWAL_NOT_FOUND, "출금 내역을 찾을 수 없습니다."));

        User admin = userRepository.findById(adminId)
            .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "관리자를 찾을 수 없습니다."));

        // 관리자 권한 확인
        if (!admin.isAdmin()) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_PERMISSIONS, "관리자만 출금을 반려할 수 있습니다.");
        }

        // 반려 가능한 상태인지 확인
        if (!withdrawal.isPending() && !withdrawal.isUnderReview() && !withdrawal.isApproved()) {
            throw new BusinessException(ErrorCode.INVALID_WITHDRAWAL_STATUS,
                "반려할 수 없는 상태입니다: " + withdrawal.getStatusDisplayText());
        }

        // 출금 반려 처리
        withdrawal.reject(admin, rejectionReason);
        if (adminNote != null && !adminNote.trim().isEmpty()) {
            withdrawal.setAdminNote(adminNote);
        }

        // 포인트 복구 처리 (PointTransactionService 사용)
        if (withdrawal.getPointTransaction() != null) {
            pointTransactionService.cancelWithdrawal(
                withdrawal.getPointTransaction().getId(), adminId, "관리자 반려: " + rejectionReason);
        }

        Withdrawal savedWithdrawal = withdrawalRepository.save(withdrawal);

        log.info("Withdrawal rejected successfully: withdrawalId={}, adminId={}, reason={}",
            withdrawalId, adminId, rejectionReason);

        return savedWithdrawal;
    }

    /**
     * 출금 완료 처리 (실제 송금 완료 후)
     */
    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class)
    public Withdrawal completeWithdrawal(Long withdrawalId, Long adminId,
                                       String bankTransactionId, String bankReferenceNumber) {
        log.info("Processing withdrawal completion: withdrawalId={}, adminId={}", withdrawalId, adminId);

        Withdrawal withdrawal = withdrawalRepository.findById(withdrawalId)
            .orElseThrow(() -> new BusinessException(ErrorCode.WITHDRAWAL_NOT_FOUND, "출금 내역을 찾을 수 없습니다."));

        User admin = userRepository.findById(adminId)
            .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "관리자를 찾을 수 없습니다."));

        // 관리자 권한 확인
        if (!admin.isAdmin()) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_PERMISSIONS, "관리자만 출금을 완료할 수 있습니다.");
        }

        // 완료 처리 가능한 상태인지 확인
        if (!withdrawal.isApproved() && !withdrawal.getStatus().equals(Withdrawal.WithdrawalStatus.PROCESSING)) {
            throw new BusinessException(ErrorCode.INVALID_WITHDRAWAL_STATUS,
                "완료 처리할 수 없는 상태입니다: " + withdrawal.getStatusDisplayText());
        }

        // 출금 완료 처리
        withdrawal.complete(bankTransactionId, bankReferenceNumber);

        Withdrawal savedWithdrawal = withdrawalRepository.save(withdrawal);

        log.info("Withdrawal completed successfully: withdrawalId={}, adminId={}", withdrawalId, adminId);

        return savedWithdrawal;
    }

    /**
     * 출금 실패 처리 (송금 실패 시)
     */
    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class)
    public Withdrawal failWithdrawal(Long withdrawalId, Long adminId,
                                   String responseCode, String responseMessage) {
        log.info("Processing withdrawal failure: withdrawalId={}, adminId={}", withdrawalId, adminId);

        Withdrawal withdrawal = withdrawalRepository.findById(withdrawalId)
            .orElseThrow(() -> new BusinessException(ErrorCode.WITHDRAWAL_NOT_FOUND, "출금 내역을 찾을 수 없습니다."));

        User admin = userRepository.findById(adminId)
            .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "관리자를 찾을 수 없습니다."));

        // 관리자 권한 확인
        if (!admin.isAdmin()) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_PERMISSIONS, "관리자만 출금을 실패 처리할 수 있습니다.");
        }

        // 실패 처리 가능한 상태인지 확인
        if (!withdrawal.isApproved() && !withdrawal.getStatus().equals(Withdrawal.WithdrawalStatus.PROCESSING)) {
            throw new BusinessException(ErrorCode.INVALID_WITHDRAWAL_STATUS,
                "실패 처리할 수 없는 상태입니다: " + withdrawal.getStatusDisplayText());
        }

        // 출금 실패 처리
        withdrawal.fail(responseCode, responseMessage);

        // 포인트 복구 처리 (실패 시)
        if (withdrawal.getPointTransaction() != null) {
            pointTransactionService.cancelWithdrawal(
                withdrawal.getPointTransaction().getId(), adminId, "출금 실패로 인한 포인트 복구");
        }

        Withdrawal savedWithdrawal = withdrawalRepository.save(withdrawal);

        log.info("Withdrawal failed successfully: withdrawalId={}, adminId={}, reason={}",
            withdrawalId, adminId, responseMessage);

        return savedWithdrawal;
    }

    /**
     * 일괄 승인 처리
     */
    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class)
    public List<Withdrawal> batchApproveWithdrawals(List<Long> withdrawalIds, Long adminId, String note) {
        log.info("Processing batch withdrawal approval: count={}, adminId={}", withdrawalIds.size(), adminId);

        User admin = userRepository.findById(adminId)
            .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "관리자를 찾을 수 없습니다."));

        if (!admin.isAdmin()) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_PERMISSIONS, "관리자만 일괄 승인할 수 있습니다.");
        }

        List<Withdrawal> results = withdrawalIds.stream()
            .map(withdrawalId -> {
                try {
                    return approveWithdrawal(withdrawalId, adminId, note, null, null);
                } catch (Exception e) {
                    log.error("Failed to approve withdrawal: withdrawalId={}, error={}", withdrawalId, e.getMessage());
                    // 개별 실패는 로그만 남기고 계속 진행
                    return null;
                }
            })
            .filter(withdrawal -> withdrawal != null)
            .collect(Collectors.toList());

        log.info("Batch approval completed: processed={}/{}", results.size(), withdrawalIds.size());

        return results;
    }

    /**
     * 출금 통계 조회
     */
    public WithdrawalStatsResponse getWithdrawalStats(LocalDate startDate, LocalDate endDate) {
        log.debug("Getting withdrawal stats: startDate={}, endDate={}", startDate, endDate);

        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay();

        // 상태별 통계
        List<Object[]> statusStatsData = withdrawalRepository.getWithdrawalStatsByStatus();
        Map<String, WithdrawalStatsResponse.StatusStat> statusStats = new HashMap<>();

        for (Object[] row : statusStatsData) {
            Withdrawal.WithdrawalStatus status = (Withdrawal.WithdrawalStatus) row[0];
            Long count = (Long) row[1];
            Long requestedAmount = ((Number) row[2]).longValue();

            statusStats.put(status.name(), WithdrawalStatsResponse.StatusStat.builder()
                .count(count)
                .requestedAmount(requestedAmount)
                .withdrawalAmount(requestedAmount) // 실제로는 완료된 것만 계산해야 함
                .formattedRequestedAmount(WithdrawalStatsResponse.formatPoint(requestedAmount))
                .formattedWithdrawalAmount(WithdrawalStatsResponse.formatPoint(requestedAmount))
                .build());
        }

        // 일별 통계
        List<Object[]> dailyStatsData = withdrawalRepository.getWithdrawalStatsByDate(startDateTime, endDateTime);
        Map<LocalDate, WithdrawalStatsResponse.DailyStat> dailyStats = new HashMap<>();

        for (Object[] row : dailyStatsData) {
            LocalDate date = ((java.sql.Date) row[0]).toLocalDate();
            Long count = (Long) row[1];
            Long requestedAmount = ((Number) row[2]).longValue();
            Long withdrawalAmount = ((Number) row[3]).longValue();

            dailyStats.put(date, WithdrawalStatsResponse.DailyStat.builder()
                .date(date)
                .count(count)
                .requestedAmount(requestedAmount)
                .withdrawalAmount(withdrawalAmount)
                .formattedRequestedAmount(WithdrawalStatsResponse.formatPoint(requestedAmount))
                .formattedWithdrawalAmount(WithdrawalStatsResponse.formatAmount(withdrawalAmount))
                .build());
        }

        // 전체 요약 통계 계산
        WithdrawalStatsResponse.Summary summary = calculateSummaryStats(startDateTime, endDateTime);

        return WithdrawalStatsResponse.builder()
            .statusStats(statusStats)
            .dailyStats(dailyStats)
            .summary(summary)
            .build();
    }

    /**
     * 처리 지연 출금 조회
     */
    public List<Withdrawal> getDelayedWithdrawals() {
        return withdrawalRepository.findDelayedWithdrawals(LocalDateTime.now().minusDays(3));
    }

    /**
     * 자동 처리 가능한 출금 조회
     */
    public List<Withdrawal> getAutoProcessEligibleWithdrawals() {
        return withdrawalRepository.findAutoProcessEligibleWithdrawals(LocalDateTime.now());
    }

    // === Private Helper Methods ===

    /**
     * 전체 요약 통계 계산
     */
    private WithdrawalStatsResponse.Summary calculateSummaryStats(LocalDateTime startDateTime, LocalDateTime endDateTime) {
        List<Withdrawal> allWithdrawals = withdrawalRepository.findByRequestedAtBetween(startDateTime, endDateTime);

        Long totalRequests = (long) allWithdrawals.size();
        Long totalRequestedAmount = allWithdrawals.stream()
            .mapToLong(w -> w.getRequestedAmount().longValue())
            .sum();

        Long totalWithdrawnAmount = allWithdrawals.stream()
            .filter(w -> w.getStatus() == Withdrawal.WithdrawalStatus.COMPLETED)
            .mapToLong(w -> w.getWithdrawalAmount().longValue())
            .sum();

        Long totalFeeAmount = allWithdrawals.stream()
            .filter(w -> w.getStatus() == Withdrawal.WithdrawalStatus.COMPLETED)
            .mapToLong(w -> w.getFeeAmount().longValue())
            .sum();

        // 상태별 카운트
        Map<Withdrawal.WithdrawalStatus, Long> statusCounts = allWithdrawals.stream()
            .collect(Collectors.groupingBy(Withdrawal::getStatus, Collectors.counting()));

        Long pendingCount = statusCounts.getOrDefault(Withdrawal.WithdrawalStatus.PENDING, 0L) +
            statusCounts.getOrDefault(Withdrawal.WithdrawalStatus.UNDER_REVIEW, 0L);
        Long approvedCount = statusCounts.getOrDefault(Withdrawal.WithdrawalStatus.APPROVED, 0L);
        Long completedCount = statusCounts.getOrDefault(Withdrawal.WithdrawalStatus.COMPLETED, 0L);
        Long rejectedCount = statusCounts.getOrDefault(Withdrawal.WithdrawalStatus.REJECTED, 0L);

        // 처리 지연 건수
        Long delayedCount = (long) getDelayedWithdrawals().size();

        // 승인률/반려율 계산
        Long processedCount = completedCount + rejectedCount;
        Double approvalRate = processedCount > 0 ? (completedCount.doubleValue() / processedCount) * 100 : 0.0;
        Double rejectionRate = processedCount > 0 ? (rejectedCount.doubleValue() / processedCount) * 100 : 0.0;

        // 평균 처리 기간 계산
        Double averageProcessingDays = allWithdrawals.stream()
            .filter(w -> w.getProcessedAt() != null)
            .mapToLong(Withdrawal::getProcessingDaysFromRequest)
            .average()
            .orElse(0.0);

        return WithdrawalStatsResponse.Summary.builder()
            .totalRequests(totalRequests)
            .totalRequestedAmount(totalRequestedAmount)
            .totalWithdrawnAmount(totalWithdrawnAmount)
            .totalFeeAmount(totalFeeAmount)
            .formattedTotalRequestedAmount(WithdrawalStatsResponse.formatPoint(totalRequestedAmount))
            .formattedTotalWithdrawnAmount(WithdrawalStatsResponse.formatAmount(totalWithdrawnAmount))
            .formattedTotalFeeAmount(WithdrawalStatsResponse.formatAmount(totalFeeAmount))
            .averageProcessingDays(averageProcessingDays)
            .pendingCount(pendingCount)
            .approvedCount(approvedCount)
            .completedCount(completedCount)
            .rejectedCount(rejectedCount)
            .delayedCount(delayedCount)
            .approvalRate(approvalRate)
            .rejectionRate(rejectionRate)
            .build();
    }
}