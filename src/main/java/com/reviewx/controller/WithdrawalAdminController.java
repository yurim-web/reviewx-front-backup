package com.reviewx.controller;

import com.reviewx.dto.admin.*;
import com.reviewx.dto.withdrawal.WithdrawalResponse;
import com.reviewx.entity.Withdrawal;
import com.reviewx.security.SecurityUtils;
import com.reviewx.service.WithdrawalAdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 관리자용 출금 승인 관리 API 컨트롤러
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/withdrawals")
@RequiredArgsConstructor
public class WithdrawalAdminController {

    private final WithdrawalAdminService withdrawalAdminService;

    /**
     * 출금 신청 승인
     */
    @PostMapping("/{withdrawalId}/approve")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<WithdrawalResponse> approveWithdrawal(
            @PathVariable Long withdrawalId,
            @Validated @RequestBody WithdrawalApprovalRequest request) {

        Long adminId = SecurityUtils.getCurrentUserId();
        log.info("Withdrawal approval request: withdrawalId={}, adminId={}", withdrawalId, adminId);

        Withdrawal withdrawal = withdrawalAdminService.approveWithdrawal(
            withdrawalId, adminId, request.getNote(),
            request.getBankTransactionId(), request.getBankReferenceNumber()
        );

        WithdrawalResponse response = WithdrawalResponse.from(withdrawal);
        return ResponseEntity.ok(response);
    }

    /**
     * 출금 신청 반려
     */
    @PostMapping("/{withdrawalId}/reject")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<WithdrawalResponse> rejectWithdrawal(
            @PathVariable Long withdrawalId,
            @Validated @RequestBody WithdrawalRejectionRequest request) {

        Long adminId = SecurityUtils.getCurrentUserId();
        log.info("Withdrawal rejection request: withdrawalId={}, adminId={}", withdrawalId, adminId);

        Withdrawal withdrawal = withdrawalAdminService.rejectWithdrawal(
            withdrawalId, adminId, request.getReason(), request.getAdminNote()
        );

        WithdrawalResponse response = WithdrawalResponse.from(withdrawal);
        return ResponseEntity.ok(response);
    }

    /**
     * 출금 완료 처리 (실제 송금 완료 후)
     */
    @PostMapping("/{withdrawalId}/complete")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<WithdrawalResponse> completeWithdrawal(
            @PathVariable Long withdrawalId,
            @RequestParam String bankTransactionId,
            @RequestParam String bankReferenceNumber) {

        Long adminId = SecurityUtils.getCurrentUserId();
        log.info("Withdrawal completion request: withdrawalId={}, adminId={}", withdrawalId, adminId);

        Withdrawal withdrawal = withdrawalAdminService.completeWithdrawal(
            withdrawalId, adminId, bankTransactionId, bankReferenceNumber
        );

        WithdrawalResponse response = WithdrawalResponse.from(withdrawal);
        return ResponseEntity.ok(response);
    }

    /**
     * 출금 실패 처리 (송금 실패 시)
     */
    @PostMapping("/{withdrawalId}/fail")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<WithdrawalResponse> failWithdrawal(
            @PathVariable Long withdrawalId,
            @RequestParam String responseCode,
            @RequestParam String responseMessage) {

        Long adminId = SecurityUtils.getCurrentUserId();
        log.info("Withdrawal failure request: withdrawalId={}, adminId={}", withdrawalId, adminId);

        Withdrawal withdrawal = withdrawalAdminService.failWithdrawal(
            withdrawalId, adminId, responseCode, responseMessage
        );

        WithdrawalResponse response = WithdrawalResponse.from(withdrawal);
        return ResponseEntity.ok(response);
    }

    /**
     * 일괄 승인 처리
     */
    @PostMapping("/batch-approve")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<WithdrawalResponse>> batchApproveWithdrawals(
            @RequestParam List<Long> withdrawalIds,
            @RequestParam(required = false, defaultValue = "일괄 승인") String note) {

        Long adminId = SecurityUtils.getCurrentUserId();
        log.info("Batch withdrawal approval request: count={}, adminId={}", withdrawalIds.size(), adminId);

        List<Withdrawal> withdrawals = withdrawalAdminService.batchApproveWithdrawals(
            withdrawalIds, adminId, note
        );

        List<WithdrawalResponse> response = withdrawals.stream()
            .map(WithdrawalResponse::from)
            .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    /**
     * 출금 통계 조회
     */
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<WithdrawalStatsResponse> getWithdrawalStats(
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {

        // 기본값 설정 (최근 30일)
        if (endDate == null) {
            endDate = LocalDate.now();
        }
        if (startDate == null) {
            startDate = endDate.minusDays(30);
        }

        log.debug("Withdrawal stats request: startDate={}, endDate={}", startDate, endDate);

        WithdrawalStatsResponse stats = withdrawalAdminService.getWithdrawalStats(startDate, endDate);
        return ResponseEntity.ok(stats);
    }

    /**
     * 처리 지연 출금 조회
     */
    @GetMapping("/delayed")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<WithdrawalResponse>> getDelayedWithdrawals() {
        log.debug("Delayed withdrawals request");

        List<Withdrawal> delayedWithdrawals = withdrawalAdminService.getDelayedWithdrawals();
        List<WithdrawalResponse> response = delayedWithdrawals.stream()
            .map(WithdrawalResponse::from)
            .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    /**
     * 자동 처리 가능한 출금 조회
     */
    @GetMapping("/auto-processable")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<WithdrawalResponse>> getAutoProcessEligibleWithdrawals() {
        log.debug("Auto-processable withdrawals request");

        List<Withdrawal> autoProcessEligible = withdrawalAdminService.getAutoProcessEligibleWithdrawals();
        List<WithdrawalResponse> response = autoProcessEligible.stream()
            .map(WithdrawalResponse::from)
            .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    /**
     * 승인 대기 건수 조회 (대시보드용)
     */
    @GetMapping("/pending-count")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Long> getPendingWithdrawalCount() {
        log.debug("Pending withdrawal count request");

        // 실제로는 Repository에서 카운트 쿼리를 실행해야 함
        List<Withdrawal> delayedWithdrawals = withdrawalAdminService.getDelayedWithdrawals();
        Long count = (long) delayedWithdrawals.size();

        return ResponseEntity.ok(count);
    }

    /**
     * 금일 처리 현황 조회 (대시보드용)
     */
    @GetMapping("/today-summary")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<WithdrawalStatsResponse.Summary> getTodaySummary() {
        log.debug("Today's withdrawal summary request");

        LocalDate today = LocalDate.now();
        WithdrawalStatsResponse stats = withdrawalAdminService.getWithdrawalStats(today, today);

        return ResponseEntity.ok(stats.getSummary());
    }

    /**
     * 월간 통계 조회 (대시보드용)
     */
    @GetMapping("/monthly-stats")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<WithdrawalStatsResponse> getMonthlyStats(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {

        LocalDate now = LocalDate.now();
        if (year == null) year = now.getYear();
        if (month == null) month = now.getMonthValue();

        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.plusMonths(1).minusDays(1);

        log.debug("Monthly withdrawal stats request: year={}, month={}", year, month);

        WithdrawalStatsResponse stats = withdrawalAdminService.getWithdrawalStats(startDate, endDate);
        return ResponseEntity.ok(stats);
    }
}