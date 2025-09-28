package com.reviewx.controller;

import com.reviewx.dto.campaign.ParticipationDetailResponse;
import com.reviewx.dto.campaign.PurchaseReviewCampaignCreateRequest;
import com.reviewx.dto.campaign.PurchaseReviewCampaignResponse;
import com.reviewx.dto.review.ReviewApprovalRequest;
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
 * 파트너용 구매평 캠페인 관리 컨트롤러
 */
@RestController
@RequestMapping("/api/partner/purchase-review-campaigns")
@RequiredArgsConstructor
@Slf4j
public class PurchaseReviewCampaignController {

    private final PurchaseReviewCampaignService campaignService;
    private final PurchaseReviewParticipationService participationService;
    private final PurchaseReviewService reviewService;

    /**
     * 구매평 캠페인 생성
     */
    @PostMapping
    public ResponseEntity<PurchaseReviewCampaignResponse> createCampaign(
            @Valid @RequestBody PurchaseReviewCampaignCreateRequest request,
            Authentication auth) {

        log.info("Partner creating purchase review campaign: {}", request.getTitle());

        PurchaseReviewCampaignResponse response = campaignService.createCampaign(request, auth);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 구매평 캠페인 수정
     */
    @PutMapping("/{campaignId}")
    public ResponseEntity<PurchaseReviewCampaignResponse> updateCampaign(
            @PathVariable Long campaignId,
            @Valid @RequestBody PurchaseReviewCampaignCreateRequest request,
            Authentication auth) {

        log.info("Partner updating purchase review campaign: ID={}", campaignId);

        PurchaseReviewCampaignResponse response = campaignService.updateCampaign(campaignId, request, auth);
        return ResponseEntity.ok(response);
    }

    /**
     * 구매평 캠페인 검토 제출
     */
    @PostMapping("/{campaignId}/submit")
    public ResponseEntity<Map<String, String>> submitCampaignForReview(
            @PathVariable Long campaignId,
            Authentication auth) {

        log.info("Partner submitting purchase review campaign for review: ID={}", campaignId);

        campaignService.submitCampaignForReview(campaignId, auth);

        Map<String, String> response = new HashMap<>();
        response.put("message", "캠페인이 관리자 검토를 위해 제출되었습니다");
        return ResponseEntity.ok(response);
    }

    /**
     * 구매평 캠페인 모집 시작
     */
    @PostMapping("/{campaignId}/start-recruitment")
    public ResponseEntity<Map<String, String>> startRecruitment(
            @PathVariable Long campaignId,
            Authentication auth) {

        log.info("Partner starting recruitment for purchase review campaign: ID={}", campaignId);

        campaignService.startRecruitment(campaignId, auth);

        Map<String, String> response = new HashMap<>();
        response.put("message", "캠페인 모집이 시작되었습니다");
        return ResponseEntity.ok(response);
    }

    /**
     * 파트너의 구매평 캠페인 목록 조회
     */
    @GetMapping
    public ResponseEntity<Page<PurchaseReviewCampaignResponse>> getPartnerCampaigns(
            @PageableDefault(size = 20) Pageable pageable,
            Authentication auth) {

        log.info("Partner fetching purchase review campaigns list");

        Page<PurchaseReviewCampaignResponse> campaigns = campaignService.getPartnerCampaigns(auth, pageable);
        return ResponseEntity.ok(campaigns);
    }

    /**
     * 구매평 캠페인 상세 조회
     */
    @GetMapping("/{campaignId}")
    public ResponseEntity<PurchaseReviewCampaignResponse> getCampaignDetail(
            @PathVariable Long campaignId) {

        log.info("Fetching purchase review campaign detail: ID={}", campaignId);

        PurchaseReviewCampaignResponse response = campaignService.getCampaignById(campaignId);
        return ResponseEntity.ok(response);
    }

    /**
     * 구매평 캠페인 삭제
     */
    @DeleteMapping("/{campaignId}")
    public ResponseEntity<Map<String, String>> deleteCampaign(
            @PathVariable Long campaignId,
            Authentication auth) {

        log.info("Partner deleting purchase review campaign: ID={}", campaignId);

        campaignService.deleteCampaign(campaignId, auth);

        Map<String, String> response = new HashMap<>();
        response.put("message", "캠페인이 삭제되었습니다");
        return ResponseEntity.ok(response);
    }

    // === 참여 관리 API ===

    /**
     * 파트너의 구매평 캠페인 참여 신청 목록 조회
     */
    @GetMapping("/participations")
    public ResponseEntity<Page<ParticipationDetailResponse>> getPartnerParticipations(
            @PageableDefault(size = 20) Pageable pageable,
            Authentication auth) {

        log.info("Partner fetching purchase review campaign participations");

        Page<ParticipationDetailResponse> participations =
            participationService.getPartnerParticipations(auth, pageable);
        return ResponseEntity.ok(participations);
    }

    /**
     * 검토 대기중인 구매평 캠페인 참여 신청 목록
     */
    @GetMapping("/participations/pending")
    public ResponseEntity<List<ParticipationDetailResponse>> getPendingParticipations(
            Authentication auth) {

        log.info("Partner fetching pending purchase review campaign participations");

        List<ParticipationDetailResponse> participations =
            participationService.getPendingParticipations(auth);
        return ResponseEntity.ok(participations);
    }

    /**
     * 특정 구매평 캠페인의 참여 신청 목록 조회
     */
    @GetMapping("/{campaignId}/participations")
    public ResponseEntity<List<ParticipationDetailResponse>> getCampaignParticipations(
            @PathVariable Long campaignId,
            Authentication auth) {

        log.info("Partner fetching participations for campaign: ID={}", campaignId);

        List<ParticipationDetailResponse> participations =
            participationService.getCampaignParticipations(campaignId, auth);
        return ResponseEntity.ok(participations);
    }

    /**
     * 구매평 캠페인 참여자 선발
     */
    @PostMapping("/participations/{participationId}/select")
    public ResponseEntity<Map<String, String>> selectParticipant(
            @PathVariable Long participationId,
            Authentication auth) {

        log.info("Partner selecting participant: participationId={}", participationId);

        participationService.selectParticipant(participationId, auth);

        Map<String, String> response = new HashMap<>();
        response.put("message", "참여자가 선발되었습니다");
        return ResponseEntity.ok(response);
    }

    /**
     * 구매평 캠페인 참여자 선발 취소
     */
    @PostMapping("/participations/{participationId}/unselect")
    public ResponseEntity<Map<String, String>> unselectParticipant(
            @PathVariable Long participationId,
            Authentication auth) {

        log.info("Partner unselecting participant: participationId={}", participationId);

        participationService.unselectParticipant(participationId, auth);

        Map<String, String> response = new HashMap<>();
        response.put("message", "참여자 선발이 취소되었습니다");
        return ResponseEntity.ok(response);
    }

    /**
     * 참여 신청 상세 조회
     */
    @GetMapping("/participations/{participationId}")
    public ResponseEntity<ParticipationDetailResponse> getParticipationDetail(
            @PathVariable Long participationId,
            Authentication auth) {

        log.info("Partner fetching participation detail: ID={}", participationId);

        ParticipationDetailResponse response =
            participationService.getParticipationDetail(participationId, auth);
        return ResponseEntity.ok(response);
    }

    // === 리뷰 관리 API ===

    /**
     * 파트너의 구매평 리뷰 목록 조회
     */
    @GetMapping("/reviews")
    public ResponseEntity<Page<ReviewDetailResponse>> getPartnerReviews(
            @PageableDefault(size = 20) Pageable pageable,
            Authentication auth) {

        log.info("Partner fetching purchase review list");

        Page<ReviewDetailResponse> reviews = reviewService.getPartnerReviews(auth, pageable);
        return ResponseEntity.ok(reviews);
    }

    /**
     * 검토 대기중인 구매평 리뷰 목록
     */
    @GetMapping("/reviews/pending")
    public ResponseEntity<List<ReviewDetailResponse>> getPendingReviews(
            Authentication auth) {

        log.info("Partner fetching pending purchase reviews");

        List<ReviewDetailResponse> reviews = reviewService.getPendingReviews(auth);
        return ResponseEntity.ok(reviews);
    }

    /**
     * 특정 캠페인의 구매평 리뷰 목록 조회
     */
    @GetMapping("/{campaignId}/reviews")
    public ResponseEntity<List<ReviewDetailResponse>> getCampaignReviews(
            @PathVariable Long campaignId,
            Authentication auth) {

        log.info("Partner fetching reviews for campaign: ID={}", campaignId);

        List<ReviewDetailResponse> reviews = reviewService.getCampaignReviews(campaignId, auth);
        return ResponseEntity.ok(reviews);
    }

    /**
     * 구매평 리뷰 승인/반려 (파트너)
     */
    @PostMapping("/reviews/{reviewId}/review")
    public ResponseEntity<Map<String, String>> reviewPurchaseReview(
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewApprovalRequest request,
            Authentication auth) {

        log.info("Partner reviewing purchase review: reviewId={}, status={}",
                reviewId, request.getStatus());

        reviewService.reviewByPartner(reviewId, request, auth);

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

        log.info("Partner fetching review detail: ID={}", reviewId);

        ReviewDetailResponse response = reviewService.getReviewDetail(reviewId, auth);
        return ResponseEntity.ok(response);
    }

    // === 필터링 및 검색 API ===

    /**
     * 리뷰 플랫폼별 캠페인 조회
     */
    @GetMapping("/filter/platform/{platform}")
    public ResponseEntity<Page<PurchaseReviewCampaignResponse>> getCampaignsByPlatform(
            @PathVariable Campaign.ReviewPlatform platform,
            @PageableDefault(size = 20) Pageable pageable) {

        log.info("Fetching purchase review campaigns by platform: {}", platform);

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

        log.info("Fetching purchase review campaigns by format: {}", format);

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

        log.info("Fetching purchase review campaigns by point range: {}-{}", minPoint, maxPoint);

        Page<PurchaseReviewCampaignResponse> campaigns =
            campaignService.getCampaignsByPointRange(minPoint, maxPoint, pageable);
        return ResponseEntity.ok(campaigns);
    }

    /**
     * 캠페인 검색
     */
    @GetMapping("/search")
    public ResponseEntity<Page<PurchaseReviewCampaignResponse>> searchCampaigns(
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 20) Pageable pageable) {

        log.info("Searching purchase review campaigns with keyword: {}", keyword);

        Page<PurchaseReviewCampaignResponse> campaigns =
            campaignService.searchCampaigns(keyword, pageable);
        return ResponseEntity.ok(campaigns);
    }
}