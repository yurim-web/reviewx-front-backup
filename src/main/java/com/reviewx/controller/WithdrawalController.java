package com.reviewx.controller;

import com.reviewx.dto.account.BankAccountRequest;
import com.reviewx.dto.account.BankAccountResponse;
import com.reviewx.dto.withdrawal.*;
import com.reviewx.entity.User;
import com.reviewx.entity.Withdrawal;
import com.reviewx.repository.UserRepository;
import com.reviewx.security.SecurityUtils;
import com.reviewx.service.WithdrawalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 출금 관련 API 컨트롤러
 */
@Slf4j
@RestController
@RequestMapping("/api/withdrawals")
@RequiredArgsConstructor
public class WithdrawalController {

    private final WithdrawalService withdrawalService;
    private final UserRepository userRepository;

    /**
     * 내 계좌 정보 조회
     */
    @GetMapping("/account")
    @PreAuthorize("hasRole('REVIEWER')")
    public ResponseEntity<BankAccountResponse> getMyBankAccount() {
        Long userId = SecurityUtils.getCurrentUserId();
        log.debug("Bank account request: userId={}", userId);

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        BankAccountResponse response = BankAccountResponse.of(
            user.getBankName(),
            user.getAccountNumber(),
            user.getAccountHolder()
        );

        return ResponseEntity.ok(response);
    }

    /**
     * 계좌 정보 등록/수정
     */
    @PutMapping("/account")
    @PreAuthorize("hasRole('REVIEWER')")
    public ResponseEntity<BankAccountResponse> updateBankAccount(
            @Validated @RequestBody BankAccountRequest request) {

        Long userId = SecurityUtils.getCurrentUserId();
        log.info("Bank account update request: userId={}", userId);

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        user.setBankName(request.getBankName());
        user.setAccountNumber(request.getAccountNumber());
        user.setAccountHolder(request.getAccountHolder());

        userRepository.save(user);

        BankAccountResponse response = BankAccountResponse.of(
            user.getBankName(),
            user.getAccountNumber(),
            user.getAccountHolder()
        );

        return ResponseEntity.ok(response);
    }

    /**
     * 출금 가능 금액 조회
     */
    @GetMapping("/available-amount")
    @PreAuthorize("hasRole('REVIEWER')")
    public ResponseEntity<Map<String, Object>> getAvailableAmount() {
        Long userId = SecurityUtils.getCurrentUserId();
        log.debug("Available withdrawal amount request: userId={}", userId);

        Integer availableAmount = withdrawalService.getAvailableWithdrawalAmount(userId);
        WithdrawalService.WithdrawalStats stats = withdrawalService.getUserWithdrawalStats(userId);

        return ResponseEntity.ok(Map.of(
            "availableAmount", availableAmount,
            "formattedAvailableAmount", String.format("%,d P", availableAmount),
            "stats", stats
        ));
    }

    /**
     * 출금 신청
     */
    @PostMapping
    @PreAuthorize("hasRole('REVIEWER')")
    public ResponseEntity<WithdrawalResponse> requestWithdrawal(
            @Validated @RequestBody WithdrawalRequest request) {

        Long userId = SecurityUtils.getCurrentUserId();
        log.info("Withdrawal request: userId={}, amount={}", userId, request.getAmount());

        Withdrawal withdrawal = withdrawalService.requestWithdrawal(
            userId,
            request.getAmount(),
            request.getBankName(),
            request.getAccountNumber(),
            request.getAccountHolder()
        );

        WithdrawalResponse response = WithdrawalResponse.from(withdrawal);
        return ResponseEntity.ok(response);
    }

    /**
     * 내 출금 신청 목록 조회
     */
    @GetMapping
    @PreAuthorize("hasRole('REVIEWER')")
    public ResponseEntity<Page<WithdrawalResponse>> getMyWithdrawals(
            WithdrawalListRequest request) {

        Long userId = SecurityUtils.getCurrentUserId();
        log.debug("User withdrawal list request: userId={}", userId);

        request.setDefaults();

        Pageable pageable = PageRequest.of(
            request.getPage(),
            request.getSize(),
            Sort.Direction.fromString(request.getDirection()),
            request.getSort()
        );

        Page<Withdrawal> withdrawals = withdrawalService.getMyWithdrawals(userId, pageable);
        Page<WithdrawalResponse> response = withdrawals.map(WithdrawalResponse::from);

        return ResponseEntity.ok(response);
    }

    /**
     * 출금 신청 상세 조회
     */
    @GetMapping("/{withdrawalId}")
    @PreAuthorize("hasRole('REVIEWER')")
    public ResponseEntity<WithdrawalResponse> getWithdrawalDetail(
            @PathVariable Long withdrawalId) {

        Long userId = SecurityUtils.getCurrentUserId();
        log.debug("Withdrawal detail request: withdrawalId={}, userId={}", withdrawalId, userId);

        Withdrawal withdrawal = withdrawalService.getWithdrawalDetail(withdrawalId, userId);
        WithdrawalResponse response = WithdrawalResponse.from(withdrawal);

        return ResponseEntity.ok(response);
    }

    /**
     * 출금 신청 취소
     */
    @PostMapping("/{withdrawalId}/cancel")
    @PreAuthorize("hasRole('REVIEWER')")
    public ResponseEntity<WithdrawalResponse> cancelWithdrawal(
            @PathVariable Long withdrawalId) {

        Long userId = SecurityUtils.getCurrentUserId();
        log.info("Withdrawal cancellation request: withdrawalId={}, userId={}", withdrawalId, userId);

        Withdrawal withdrawal = withdrawalService.cancelWithdrawal(withdrawalId, userId);
        WithdrawalResponse response = WithdrawalResponse.from(withdrawal);

        return ResponseEntity.ok(response);
    }

    /**
     * 내 출금 통계 조회
     */
    @GetMapping("/stats")
    @PreAuthorize("hasRole('REVIEWER')")
    public ResponseEntity<WithdrawalService.WithdrawalStats> getMyWithdrawalStats() {
        Long userId = SecurityUtils.getCurrentUserId();
        log.debug("User withdrawal stats request: userId={}", userId);

        WithdrawalService.WithdrawalStats stats = withdrawalService.getUserWithdrawalStats(userId);

        return ResponseEntity.ok(stats);
    }

    // === 관리자용 API ===

    /**
     * 관리자 - 모든 출금 신청 조회
     */
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Page<WithdrawalResponse>> getAllWithdrawalsForAdmin(
            WithdrawalListRequest request) {

        log.debug("Admin - All withdrawals request");

        request.setDefaults();

        Pageable pageable = PageRequest.of(
            request.getPage(),
            request.getSize(),
            Sort.Direction.fromString(request.getDirection()),
            request.getSort()
        );

        Page<Withdrawal> withdrawals;
        if (request.getStatus() != null || request.getStartDate() != null ||
            request.getEndDate() != null || request.getKeyword() != null) {
            // 필터 검색
            withdrawals = withdrawalService.searchWithdrawals(request, pageable);
        } else {
            // 전체 조회
            withdrawals = withdrawalService.getAllWithdrawals(pageable);
        }

        Page<WithdrawalResponse> response = withdrawals.map(WithdrawalResponse::from);
        return ResponseEntity.ok(response);
    }

    /**
     * 관리자 - 상태별 출금 신청 조회
     */
    @GetMapping("/admin/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Page<WithdrawalResponse>> getWithdrawalsByStatusForAdmin(
            @PathVariable String status,
            WithdrawalListRequest request) {

        log.debug("Admin - Withdrawals by status request: status={}", status);

        request.setDefaults();

        Pageable pageable = PageRequest.of(
            request.getPage(),
            request.getSize(),
            Sort.Direction.fromString(request.getDirection()),
            request.getSort()
        );

        Withdrawal.WithdrawalStatus withdrawalStatus = Withdrawal.WithdrawalStatus.valueOf(status.toUpperCase());
        Page<Withdrawal> withdrawals = withdrawalService.getWithdrawalsByStatus(withdrawalStatus, pageable);
        Page<WithdrawalResponse> response = withdrawals.map(WithdrawalResponse::from);

        return ResponseEntity.ok(response);
    }

    /**
     * 관리자 - 출금 신청 상세 조회 (모든 출금 조회 가능)
     */
    @GetMapping("/admin/{withdrawalId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<WithdrawalResponse> getWithdrawalDetailForAdmin(
            @PathVariable Long withdrawalId) {

        log.debug("Admin - Withdrawal detail request: withdrawalId={}", withdrawalId);

        // 관리자는 모든 출금 내역을 볼 수 있으므로 별도 검증 없이 조회
        Withdrawal withdrawal = withdrawalService.getWithdrawalDetail(withdrawalId, null);
        WithdrawalResponse response = WithdrawalResponse.from(withdrawal);

        return ResponseEntity.ok(response);
    }
}