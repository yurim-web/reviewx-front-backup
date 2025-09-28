package com.reviewx.controller;

import com.reviewx.dto.point.*;
import com.reviewx.entity.PointTransaction;
import com.reviewx.entity.User;
import com.reviewx.repository.UserRepository;
import com.reviewx.security.SecurityUtils;
import com.reviewx.service.PointTransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 포인트 거래 관련 API 컨트롤러
 */
@Slf4j
@RestController
@RequestMapping("/api/points")
@RequiredArgsConstructor
public class PointTransactionController {

    private final PointTransactionService pointTransactionService;
    private final UserRepository userRepository;

    /**
     * 내 포인트 잔액 조회
     */
    @GetMapping("/balance")
    @PreAuthorize("hasRole('REVIEWER') or hasRole('PARTNER')")
    public ResponseEntity<PointBalanceResponse> getMyBalance() {
        Long userId = SecurityUtils.getCurrentUserId();
        log.debug("Point balance request: userId={}", userId);

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // TODO: 통계 데이터는 실제 거래 내역에서 계산해야 함
        Integer totalEarned = 0; // pointTransactionService.getTotalEarned(userId);
        Integer totalWithdrawn = 0; // pointTransactionService.getTotalWithdrawn(userId);

        PointBalanceResponse response = PointBalanceResponse.of(
            user.getPointBalance(),
            user.getPendingWithdrawal(),
            totalEarned,
            totalWithdrawn
        );

        return ResponseEntity.ok(response);
    }

    /**
     * 내 포인트 거래 내역 조회
     */
    @GetMapping("/transactions")
    @PreAuthorize("hasRole('REVIEWER') or hasRole('PARTNER')")
    public ResponseEntity<Page<PointTransactionResponse>> getMyTransactions(
            PointTransactionListRequest request) {

        Long userId = SecurityUtils.getCurrentUserId();
        log.debug("User transaction history request: userId={}", userId);

        request.setDefaults();

        Pageable pageable = PageRequest.of(
            request.getPage(),
            request.getSize(),
            Sort.Direction.fromString(request.getDirection()),
            request.getSort()
        );

        Page<PointTransaction> transactions = pointTransactionService.getUserTransactions(userId, pageable);
        Page<PointTransactionResponse> response = transactions.map(PointTransactionResponse::from);

        return ResponseEntity.ok(response);
    }

    /**
     * 거래 내역 상세 조회
     */
    @GetMapping("/transactions/{transactionId}")
    @PreAuthorize("hasRole('REVIEWER') or hasRole('PARTNER')")
    public ResponseEntity<PointTransactionResponse> getTransactionDetail(
            @PathVariable Long transactionId) {

        Long userId = SecurityUtils.getCurrentUserId();
        log.debug("Transaction detail request: transactionId={}, userId={}", transactionId, userId);

        PointTransaction transaction = pointTransactionService.getTransactionDetail(transactionId, userId);
        PointTransactionResponse response = PointTransactionResponse.from(transaction);

        return ResponseEntity.ok(response);
    }

    /**
     * 포인트 충전 (파트너 전용)
     */
    @PostMapping("/charge")
    @PreAuthorize("hasRole('PARTNER')")
    public ResponseEntity<PointTransactionResponse> chargePoints(
            @RequestParam Integer amount,
            @RequestParam String paymentMethod,
            @RequestParam(required = false) String paymentKey,
            @RequestParam(required = false) String orderId) {

        Long userId = SecurityUtils.getCurrentUserId();
        log.info("Point charge request: userId={}, amount={}", userId, amount);

        PointTransaction.PaymentMethod method = PointTransaction.PaymentMethod.valueOf(paymentMethod);
        PointTransaction transaction = pointTransactionService.chargePoints(userId, amount, method, paymentKey, orderId);

        return ResponseEntity.ok(PointTransactionResponse.from(transaction));
    }

    /**
     * 사용자 포인트 잔액 검증
     */
    @GetMapping("/verify-balance")
    @PreAuthorize("hasRole('REVIEWER') or hasRole('PARTNER')")
    public ResponseEntity<Boolean> verifyMyBalance() {
        Long userId = SecurityUtils.getCurrentUserId();
        log.debug("Balance verification request: userId={}", userId);

        boolean isValid = pointTransactionService.verifyUserBalance(userId);

        return ResponseEntity.ok(isValid);
    }

    /**
     * 포인트 시스템 상태 확인
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Point System is running");
    }

    // === 관리자용 API ===

    /**
     * 관리자 - 사용자별 거래 내역 조회
     */
    @GetMapping("/admin/users/{userId}/transactions")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Page<PointTransactionResponse>> getUserTransactionsForAdmin(
            @PathVariable Long userId,
            PointTransactionListRequest request) {

        log.debug("Admin - User transaction history request: userId={}", userId);

        request.setDefaults();
        Pageable pageable = PageRequest.of(
            request.getPage(),
            request.getSize(),
            Sort.Direction.fromString(request.getDirection()),
            request.getSort()
        );

        Page<PointTransaction> transactions = pointTransactionService.getUserTransactions(userId, pageable);
        Page<PointTransactionResponse> response = transactions.map(PointTransactionResponse::from);

        return ResponseEntity.ok(response);
    }

    /**
     * 관리자 - 수동 조정
     */
    @PostMapping("/admin/adjustment")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<PointTransactionResponse> adminAdjustment(
            @RequestParam Long userId,
            @RequestParam Integer amount,
            @RequestParam String reason) {

        Long adminId = SecurityUtils.getCurrentUserId();
        log.info("Admin adjustment request: userId={}, amount={}, reason={}", userId, amount, reason);

        PointTransaction transaction = pointTransactionService.adminAdjustment(userId, amount, reason, adminId);

        return ResponseEntity.ok(PointTransactionResponse.from(transaction));
    }

    /**
     * 관리자 - 캠페인별 거래 내역 조회
     */
    @GetMapping("/admin/campaigns/{campaignId}/transactions")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<PointTransactionResponse>> getCampaignTransactionsForAdmin(
            @PathVariable Long campaignId) {

        log.debug("Admin - Campaign transaction history request: campaignId={}", campaignId);

        List<PointTransaction> transactions = pointTransactionService.getCampaignTransactions(campaignId);
        List<PointTransactionResponse> response = transactions.stream()
            .map(PointTransactionResponse::from)
            .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    /**
     * 관리자 - 캠페인 환불 처리
     */
    @PostMapping("/admin/campaigns/{campaignId}/refund")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<PointTransactionResponse> refundCampaign(
            @PathVariable Long campaignId,
            @RequestParam Long partnerId,
            @RequestParam Integer refundAmount,
            @RequestParam String reason) {

        log.info("Campaign refund request: partnerId={}, campaignId={}, amount={}",
            partnerId, campaignId, refundAmount);

        PointTransaction transaction = pointTransactionService.refundCampaign(
            partnerId, campaignId, refundAmount, reason);

        return ResponseEntity.ok(PointTransactionResponse.from(transaction));
    }
}