package com.reviewx.controller;

import com.reviewx.dto.campaign.PurchaseReviewCampaignResponse;
import com.reviewx.dto.review.ReviewApprovalRequest;
import com.reviewx.dto.review.ReviewDetailResponse;
import com.reviewx.service.PurchaseReviewCampaignService;
import com.reviewx.service.PurchaseReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 관리자용 구매평 캠페인 관리 컨트롤러
 */
@RestController
@RequestMapping("/api/admin/purchase-review-campaigns")
@RequiredArgsConstructor
@Slf4j
public class PurchaseReviewAdminController {

    private final PurchaseReviewCampaignService campaignService;
    private final PurchaseReviewService reviewService;

    // === 캠페인 관리 API ===

    /**
     * 모든 구매평 캠페인 목록 조회
     */
    @GetMapping
    public ResponseEntity<Page<PurchaseReviewCampaignResponse>> getAllCampaigns(
            @PageableDefault(size = 20) Pageable pageable) {

        log.info("Admin fetching all purchase review campaigns");

        Page<PurchaseReviewCampaignResponse> campaigns = campaignService.getAllCampaigns(pageable);
        return ResponseEntity.ok(campaigns);
    }

    /**
     * 관리자 검토 대기중인 구매평 캠페인 목록
     */
    @GetMapping("/pending-review")
    public ResponseEntity<Page<PurchaseReviewCampaignResponse>> getPendingReviewCampaigns(
            @PageableDefault(size = 20) Pageable pageable) {

        log.info("Admin fetching pending review purchase review campaigns");

        Page<PurchaseReviewCampaignResponse> campaigns =
            campaignService.getPendingReviewCampaigns(pageable);
        return ResponseEntity.ok(campaigns);
    }

    /**
     * 구매평 캠페인 승인
     */
    @PostMapping("/{campaignId}/approve")
    public ResponseEntity<Map<String, String>> approveCampaign(
            @PathVariable Long campaignId,
            @RequestParam(required = false) String adminNote,
            Authentication auth) {

        log.info("Admin approving purchase review campaign: ID={}, admin={}",
                campaignId, auth.getName());

        campaignService.approveCampaign(campaignId, adminNote, auth);

        Map<String, String> response = new HashMap<>();
        response.put("message", "캠페인이 승인되었습니다");
        return ResponseEntity.ok(response);
    }

    /**
     * 구매평 캠페인 반려
     */
    @PostMapping("/{campaignId}/reject")
    public ResponseEntity<Map<String, String>> rejectCampaign(
            @PathVariable Long campaignId,
            @RequestParam String reason,
            Authentication auth) {

        log.info("Admin rejecting purchase review campaign: ID={}, admin={}",
                campaignId, auth.getName());

        campaignService.rejectCampaign(campaignId, reason, auth);

        Map<String, String> response = new HashMap<>();
        response.put("message", "캠페인이 반려되었습니다");
        return ResponseEntity.ok(response);
    }

    /**
     * 구매평 캠페인 모집 시작 (관리자가 직접)
     */
    @PostMapping("/{campaignId}/start-recruitment")
    public ResponseEntity<Map<String, String>> startRecruitment(
            @PathVariable Long campaignId,
            Authentication auth) {

        log.info("Admin starting recruitment for purchase review campaign: ID={}", campaignId);

        campaignService.startRecruitment(campaignId, auth);

        Map<String, String> response = new HashMap<>();
        response.put("message", "캠페인 모집이 시작되었습니다");
        return ResponseEntity.ok(response);
    }

    /**
     * 구매평 캠페인 상세 조회
     */
    @GetMapping("/{campaignId}")
    public ResponseEntity<PurchaseReviewCampaignResponse> getCampaignDetail(
            @PathVariable Long campaignId) {

        log.info("Admin fetching purchase review campaign detail: ID={}", campaignId);

        PurchaseReviewCampaignResponse response = campaignService.getCampaignById(campaignId);
        return ResponseEntity.ok(response);
    }

    // === 리뷰 관리 API ===

    /**
     * 관리자 검토 대기중인 구매평 리뷰 목록
     */
    @GetMapping("/reviews/pending-admin-review")
    public ResponseEntity<List<ReviewDetailResponse>> getPendingAdminReviews() {

        log.info("Admin fetching pending admin review purchase reviews");

        List<ReviewDetailResponse> reviews = reviewService.getPendingAdminReviews();
        return ResponseEntity.ok(reviews);
    }

    /**
     * 구매평 리뷰 승인/반려 (관리자)
     */
    @PostMapping("/reviews/{reviewId}/review")
    public ResponseEntity<Map<String, String>> reviewPurchaseReview(
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewApprovalRequest request,
            Authentication auth) {

        log.info("Admin reviewing purchase review: reviewId={}, status={}, admin={}",
                reviewId, request.getStatus(), auth.getName());

        reviewService.reviewByAdmin(reviewId, request, auth);

        Map<String, String> response = new HashMap<>();
        String message = request.getStatus() == ReviewApprovalRequest.ApprovalStatus.APPROVE
            ? "리뷰가 승인되었습니다"
            : "리뷰가 반려되었습니다";
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    /**
     * 구매평 리뷰 상세 조회
     */
    @GetMapping("/reviews/{reviewId}")
    public ResponseEntity<ReviewDetailResponse> getReviewDetail(
            @PathVariable Long reviewId,
            Authentication auth) {

        log.info("Admin fetching review detail: ID={}", reviewId);

        ReviewDetailResponse response = reviewService.getReviewDetail(reviewId, auth);
        return ResponseEntity.ok(response);
    }

    // === 통계 및 모니터링 API ===

    /**
     * 구매평 캠페인 전체 통계
     */
    @GetMapping("/stats/overview")
    public ResponseEntity<Map<String, Object>> getCampaignOverviewStats() {

        log.info("Admin fetching purchase review campaign overview stats");

        // 전체 캠페인 조회해서 통계 계산
        Page<PurchaseReviewCampaignResponse> allCampaigns =
            campaignService.getAllCampaigns(Pageable.unpaged());

        long totalCampaigns = allCampaigns.getTotalElements();
        long activeCampaigns = allCampaigns.getContent().stream()
            .mapToLong(c -> Boolean.TRUE.equals(c.getIsActive()) ? 1 : 0)
            .sum();
        long completedCampaigns = allCampaigns.getContent().stream()
            .mapToLong(c -> "COMPLETED".equals(c.getStatus().name()) ? 1 : 0)
            .sum();

        // 총 참여자 및 리뷰 수
        int totalParticipants = allCampaigns.getContent().stream()
            .mapToInt(c -> c.getAppliedCount() != null ? c.getAppliedCount() : 0)
            .sum();
        int totalSelectedParticipants = allCampaigns.getContent().stream()
            .mapToInt(c -> c.getSelectedCount() != null ? c.getSelectedCount() : 0)
            .sum();
        int totalCompletedReviews = allCampaigns.getContent().stream()
            .mapToInt(c -> c.getCompletedReviews() != null ? c.getCompletedReviews() : 0)
            .sum();
        int totalApprovedReviews = allCampaigns.getContent().stream()
            .mapToInt(c -> c.getApprovedReviews() != null ? c.getApprovedReviews() : 0)
            .sum();

        Map<String, Object> response = new HashMap<>();
        response.put("totalCampaigns", totalCampaigns);
        response.put("activeCampaigns", activeCampaigns);
        response.put("completedCampaigns", completedCampaigns);
        response.put("totalParticipants", totalParticipants);
        response.put("totalSelectedParticipants", totalSelectedParticipants);
        response.put("totalCompletedReviews", totalCompletedReviews);
        response.put("totalApprovedReviews", totalApprovedReviews);
        response.put("selectionRate", totalParticipants > 0 ?
            (double) totalSelectedParticipants / totalParticipants * 100 : 0.0);
        response.put("reviewCompletionRate", totalSelectedParticipants > 0 ?
            (double) totalCompletedReviews / totalSelectedParticipants * 100 : 0.0);
        response.put("reviewApprovalRate", totalCompletedReviews > 0 ?
            (double) totalApprovedReviews / totalCompletedReviews * 100 : 0.0);

        return ResponseEntity.ok(response);
    }

    /**
     * 검토 대기 현황
     */
    @GetMapping("/stats/pending")
    public ResponseEntity<Map<String, Object>> getPendingStats() {

        log.info("Admin fetching pending review stats");

        Page<PurchaseReviewCampaignResponse> pendingCampaigns =
            campaignService.getPendingReviewCampaigns(Pageable.unpaged());

        List<ReviewDetailResponse> pendingReviews = reviewService.getPendingAdminReviews();

        Map<String, Object> response = new HashMap<>();
        response.put("pendingCampaigns", pendingCampaigns.getTotalElements());
        response.put("pendingReviews", pendingReviews.size());

        return ResponseEntity.ok(response);
    }

    // === 필터링 및 검색 API ===

    /**
     * 캠페인 검색
     */
    @GetMapping("/search")
    public ResponseEntity<Page<PurchaseReviewCampaignResponse>> searchCampaigns(
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 20) Pageable pageable) {

        log.info("Admin searching purchase review campaigns with keyword: {}", keyword);

        Page<PurchaseReviewCampaignResponse> campaigns =
            campaignService.searchCampaigns(keyword, pageable);
        return ResponseEntity.ok(campaigns);
    }

    /**
     * 리뷰 플랫폼별 캠페인 조회
     */
    @GetMapping("/filter/platform/{platform}")
    public ResponseEntity<Page<PurchaseReviewCampaignResponse>> getCampaignsByPlatform(
            @PathVariable String platform,
            @PageableDefault(size = 20) Pageable pageable) {

        log.info("Admin fetching purchase review campaigns by platform: {}", platform);

        try {
            Page<PurchaseReviewCampaignResponse> campaigns =
                campaignService.getCampaignsByPlatform(
                    Enum.valueOf(com.reviewx.entity.Campaign.ReviewPlatform.class, platform.toUpperCase()),
                    pageable
                );
            return ResponseEntity.ok(campaigns);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid platform parameter: {}", platform);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 리뷰 형식별 캠페인 조회
     */
    @GetMapping("/filter/format/{format}")
    public ResponseEntity<Page<PurchaseReviewCampaignResponse>> getCampaignsByFormat(
            @PathVariable String format,
            @PageableDefault(size = 20) Pageable pageable) {

        log.info("Admin fetching purchase review campaigns by format: {}", format);

        try {
            Page<PurchaseReviewCampaignResponse> campaigns =
                campaignService.getCampaignsByFormat(
                    Enum.valueOf(com.reviewx.entity.Campaign.ReviewFormat.class, format.toUpperCase()),
                    pageable
                );
            return ResponseEntity.ok(campaigns);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid format parameter: {}", format);
            return ResponseEntity.badRequest().build();
        }
    }
}