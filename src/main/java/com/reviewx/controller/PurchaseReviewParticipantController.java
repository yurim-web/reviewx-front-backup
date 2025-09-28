package com.reviewx.controller;

import com.reviewx.dto.campaign.ParticipationDetailResponse;
import com.reviewx.dto.campaign.ParticipationRequest;
import com.reviewx.dto.campaign.PurchaseReviewCampaignResponse;
import com.reviewx.dto.review.PurchaseReviewCreateRequest;
import com.reviewx.dto.review.PurchaseReviewUpdateRequest;
import com.reviewx.dto.review.ReviewDetailResponse;
import com.reviewx.entity.Campaign;
import com.reviewx.service.PurchaseReviewCampaignService;
import com.reviewx.service.PurchaseReviewParticipationService;
import com.reviewx.service.PurchaseReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 참여자용 구매평 캠페인 컨트롤러
 */
@RestController
@RequestMapping("/api/reviewer/purchase-review-campaigns")
@RequiredArgsConstructor
@Slf4j
public class PurchaseReviewParticipantController {

    private final PurchaseReviewCampaignService campaignService;
    private final PurchaseReviewParticipationService participationService;
    private final PurchaseReviewService reviewService;

    // === 캠페인 조회 API ===

    /**
     * 참여 가능한 구매평 캠페인 목록 조회
     */
    @GetMapping("/available")
    public ResponseEntity<Page<PurchaseReviewCampaignResponse>> getAvailableCampaigns(
            @PageableDefault(size = 20) Pageable pageable) {

        log.info("Fetching available purchase review campaigns");

        Page<PurchaseReviewCampaignResponse> campaigns = campaignService.getAvailableCampaigns(pageable);
        return ResponseEntity.ok(campaigns);
    }

    /**
     * 구매평 캠페인 상세 조회
     */
    @GetMapping("/{campaignId}")
    public ResponseEntity<PurchaseReviewCampaignResponse> getCampaignDetail(
            @PathVariable Long campaignId) {

        log.info("Reviewer fetching purchase review campaign detail: ID={}", campaignId);

        PurchaseReviewCampaignResponse response = campaignService.getCampaignById(campaignId);
        return ResponseEntity.ok(response);
    }

    /**
     * 캠페인 검색
     */
    @GetMapping("/search")
    public ResponseEntity<Page<PurchaseReviewCampaignResponse>> searchCampaigns(
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 20) Pageable pageable) {

        log.info("Reviewer searching purchase review campaigns with keyword: {}", keyword);

        Page<PurchaseReviewCampaignResponse> campaigns =
            campaignService.searchCampaigns(keyword, pageable);
        return ResponseEntity.ok(campaigns);
    }

    /**
     * 리뷰 플랫폼별 캠페인 조회
     */
    @GetMapping("/filter/platform/{platform}")
    public ResponseEntity<Page<PurchaseReviewCampaignResponse>> getCampaignsByPlatform(
            @PathVariable Campaign.ReviewPlatform platform,
            @PageableDefault(size = 20) Pageable pageable) {

        log.info("Reviewer fetching purchase review campaigns by platform: {}", platform);

        Page<PurchaseReviewCampaignResponse> campaigns =
            campaignService.getCampaignsByPlatform(platform, pageable);
        return ResponseEntity.ok(campaigns);
    }

    /**
     * 리뷰 형식별 캠페인 조회
     */
    @GetMapping("/filter/format/{format}")
    public ResponseEntity<Page<PurchaseReviewCampaignResponse>> getCampaignsByFormat(
            @PathVariable Campaign.ReviewFormat format,
            @PageableDefault(size = 20) Pageable pageable) {

        log.info("Reviewer fetching purchase review campaigns by format: {}", format);

        Page<PurchaseReviewCampaignResponse> campaigns =
            campaignService.getCampaignsByFormat(format, pageable);
        return ResponseEntity.ok(campaigns);
    }

    /**
     * 리워드 포인트 범위별 캠페인 조회
     */
    @GetMapping("/filter/points")
    public ResponseEntity<Page<PurchaseReviewCampaignResponse>> getCampaignsByPointRange(
            @RequestParam Integer minPoint,
            @RequestParam Integer maxPoint,
            @PageableDefault(size = 20) Pageable pageable) {

        log.info("Reviewer fetching purchase review campaigns by point range: {}-{}", minPoint, maxPoint);

        Page<PurchaseReviewCampaignResponse> campaigns =
            campaignService.getCampaignsByPointRange(minPoint, maxPoint, pageable);
        return ResponseEntity.ok(campaigns);
    }

    // === 참여 관리 API ===

    /**
     * 구매평 캠페인 참여 신청
     */
    @PostMapping("/{campaignId}/participate")
    public ResponseEntity<ParticipationDetailResponse> applyForCampaign(
            @PathVariable Long campaignId,
            @Valid @RequestBody ParticipationRequest request,
            Authentication auth) {

        log.info("Reviewer applying for purchase review campaign: campaignId={}, user={}",
                campaignId, auth.getName());

        ParticipationDetailResponse response =
            participationService.applyForCampaign(campaignId, request, auth);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 구매평 캠페인 참여 신청 취소
     */
    @DeleteMapping("/{campaignId}/participate")
    public ResponseEntity<Map<String, String>> cancelApplication(
            @PathVariable Long campaignId,
            Authentication auth) {

        log.info("Reviewer cancelling purchase review campaign application: campaignId={}, user={}",
                campaignId, auth.getName());

        participationService.cancelApplication(campaignId, auth);

        Map<String, String> response = new HashMap<>();
        response.put("message", "참여 신청이 취소되었습니다");
        return ResponseEntity.ok(response);
    }

    /**
     * 내 구매평 캠페인 참여 목록 조회
     */
    @GetMapping("/my-participations")
    public ResponseEntity<Page<ParticipationDetailResponse>> getMyParticipations(
            @PageableDefault(size = 20) Pageable pageable,
            Authentication auth) {

        log.info("Reviewer fetching my purchase review campaign participations");

        Page<ParticipationDetailResponse> participations =
            participationService.getMyParticipations(auth, pageable);
        return ResponseEntity.ok(participations);
    }

    /**
     * 리뷰 작성 가능한 구매평 캠페인 참여 목록
     */
    @GetMapping("/eligible-for-review")
    public ResponseEntity<List<ParticipationDetailResponse>> getEligibleForReview(
            Authentication auth) {

        log.info("Reviewer fetching eligible purchase review campaigns for review");

        List<ParticipationDetailResponse> participations =
            participationService.getEligibleForReview(auth);
        return ResponseEntity.ok(participations);
    }

    /**
     * 참여 신청 상세 조회
     */
    @GetMapping("/participations/{participationId}")
    public ResponseEntity<ParticipationDetailResponse> getParticipationDetail(
            @PathVariable Long participationId,
            Authentication auth) {

        log.info("Reviewer fetching participation detail: ID={}", participationId);

        ParticipationDetailResponse response =
            participationService.getParticipationDetail(participationId, auth);
        return ResponseEntity.ok(response);
    }

    // === 리뷰 관리 API ===

    /**
     * 구매평 리뷰 작성
     */
    @PostMapping("/reviews")
    public ResponseEntity<ReviewDetailResponse> createReview(
            @Valid @RequestBody PurchaseReviewCreateRequest request,
            Authentication auth) {

        log.info("Reviewer creating purchase review: campaignId={}, user={}",
                request.getCampaignId(), auth.getName());

        ReviewDetailResponse response = reviewService.createReview(request, auth);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 구매평 리뷰 수정
     */
    @PutMapping("/reviews/{reviewId}")
    public ResponseEntity<ReviewDetailResponse> updateReview(
            @PathVariable Long reviewId,
            @Valid @RequestBody PurchaseReviewUpdateRequest request,
            Authentication auth) {

        log.info("Reviewer updating purchase review: reviewId={}, user={}", reviewId, auth.getName());

        ReviewDetailResponse response = reviewService.updateReview(reviewId, request, auth);
        return ResponseEntity.ok(response);
    }

    /**
     * 구매평 리뷰 제출
     */
    @PostMapping("/reviews/{reviewId}/submit")
    public ResponseEntity<Map<String, String>> submitReview(
            @PathVariable Long reviewId,
            Authentication auth) {

        log.info("Reviewer submitting purchase review: reviewId={}, user={}", reviewId, auth.getName());

        reviewService.submitReview(reviewId, auth);

        Map<String, String> response = new HashMap<>();
        response.put("message", "리뷰가 제출되었습니다");
        return ResponseEntity.ok(response);
    }

    /**
     * 구매평 리뷰 삭제
     */
    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<Map<String, String>> deleteReview(
            @PathVariable Long reviewId,
            Authentication auth) {

        log.info("Reviewer deleting purchase review: reviewId={}, user={}", reviewId, auth.getName());

        reviewService.deleteReview(reviewId, auth);

        Map<String, String> response = new HashMap<>();
        response.put("message", "리뷰가 삭제되었습니다");
        return ResponseEntity.ok(response);
    }

    /**
     * 내 구매평 리뷰 목록 조회
     */
    @GetMapping("/reviews")
    public ResponseEntity<Page<ReviewDetailResponse>> getMyReviews(
            @PageableDefault(size = 20) Pageable pageable,
            Authentication auth) {

        log.info("Reviewer fetching my purchase reviews");

        Page<ReviewDetailResponse> reviews = reviewService.getMyReviews(auth, pageable);
        return ResponseEntity.ok(reviews);
    }

    /**
     * 구매평 리뷰 상세 조회
     */
    @GetMapping("/reviews/{reviewId}")
    public ResponseEntity<ReviewDetailResponse> getReviewDetail(
            @PathVariable Long reviewId,
            Authentication auth) {

        log.info("Reviewer fetching review detail: ID={}", reviewId);

        ReviewDetailResponse response = reviewService.getReviewDetail(reviewId, auth);
        return ResponseEntity.ok(response);
    }

    // === 추가 유틸리티 API ===

    /**
     * 캠페인 참여 가능 여부 확인
     */
    @GetMapping("/{campaignId}/can-apply")
    public ResponseEntity<Map<String, Object>> canApplyForCampaign(
            @PathVariable Long campaignId) {

        log.info("Checking if can apply for campaign: ID={}", campaignId);

        PurchaseReviewCampaignResponse campaign = campaignService.getCampaignById(campaignId);

        Map<String, Object> response = new HashMap<>();
        response.put("campaignId", campaignId);
        response.put("canApply", campaign.getCanApply());
        response.put("isRecruitmentFull", campaign.getIsRecruitmentFull());
        response.put("isActive", campaign.getIsActive());
        response.put("appliedCount", campaign.getAppliedCount());
        response.put("recruitCount", campaign.getRecruitCount());

        return ResponseEntity.ok(response);
    }

    /**
     * 캠페인 통계 정보 조회
     */
    @GetMapping("/{campaignId}/stats")
    public ResponseEntity<Map<String, Object>> getCampaignStats(
            @PathVariable Long campaignId) {

        log.info("Fetching campaign stats: ID={}", campaignId);

        PurchaseReviewCampaignResponse campaign = campaignService.getCampaignById(campaignId);

        Map<String, Object> response = new HashMap<>();
        response.put("campaignId", campaignId);
        response.put("appliedCount", campaign.getAppliedCount());
        response.put("selectedCount", campaign.getSelectedCount());
        response.put("recruitCount", campaign.getRecruitCount());
        response.put("completedReviews", campaign.getCompletedReviews());
        response.put("approvedReviews", campaign.getApprovedReviews());
        response.put("rejectedReviews", campaign.getRejectedReviews());
        response.put("completionRate", campaign.getCompletionRate());
        response.put("approvalRate", campaign.getApprovalRate());

        return ResponseEntity.ok(response);
    }

    /**
     * 내 참여 통계 정보
     */
    @GetMapping("/my-stats")
    public ResponseEntity<Map<String, Object>> getMyParticipationStats(
            Authentication auth) {

        log.info("Reviewer fetching participation stats");

        // 참여 목록을 통해 통계 계산
        Page<ParticipationDetailResponse> participations =
            participationService.getMyParticipations(auth, Pageable.unpaged());

        long totalApplications = participations.getTotalElements();
        long selectedApplications = participations.getContent().stream()
            .mapToLong(p -> "SELECTED".equals(p.getStatus()) ? 1 : 0)
            .sum();
        long appliedApplications = participations.getContent().stream()
            .mapToLong(p -> "APPLIED".equals(p.getStatus()) ? 1 : 0)
            .sum();

        Map<String, Object> response = new HashMap<>();
        response.put("totalApplications", totalApplications);
        response.put("selectedApplications", selectedApplications);
        response.put("appliedApplications", appliedApplications);
        response.put("selectionRate", totalApplications > 0 ?
            (double) selectedApplications / totalApplications * 100 : 0.0);

        return ResponseEntity.ok(response);
    }
}