package com.reviewx.controller;

import com.reviewx.dto.review.*;
import com.reviewx.dto.ErrorResponse;
import com.reviewx.entity.Review;
import com.reviewx.service.ExperienceReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ExperienceReviewController {

    private final ExperienceReviewService experienceReviewService;

    /**
     * 체험단 리뷰 작성/임시저장 (리뷰어)
     * POST /api/reviews
     */
    @PostMapping
    public ResponseEntity<ReviewDetailResponse> createReview(
            @RequestBody ReviewCreateRequest request,
            @RequestHeader("X-User-Id") Long reviewerId) {
        
        log.info("Creating experience review for campaign {} by reviewer {}", 
                request.getCampaignId(), reviewerId);
        
        try {
            Review review = request.toEntity();
            Review createdReview = experienceReviewService.submitExperienceReview(
                    review, request.getCampaignId(), reviewerId);
            
            ReviewDetailResponse response = ReviewDetailResponse.from(createdReview);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (IllegalArgumentException e) {
            log.warn("Invalid request for review creation: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error creating review", e);
            throw new RuntimeException("리뷰 작성 중 오류가 발생했습니다.", e);
        }
    }

    /**
     * 체험단 리뷰 제출 (임시저장 → 제출완료)
     * POST /api/reviews/{id}/submit
     */
    @PostMapping("/{id}/submit")
    public ResponseEntity<ReviewDetailResponse> submitReview(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long reviewerId) {
        
        log.info("Submitting review {} by reviewer {}", id, reviewerId);
        
        try {
            Review submittedReview = experienceReviewService.submitReviewForApproval(id, reviewerId);
            ReviewDetailResponse response = ReviewDetailResponse.from(submittedReview);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            log.warn("Invalid request for review submission: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error submitting review", e);
            throw new RuntimeException("리뷰 제출 중 오류가 발생했습니다.", e);
        }
    }

    /**
     * 체험단 리뷰 상세 조회
     * GET /api/reviews/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ReviewDetailResponse> getReviewDetail(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) {
        
        log.debug("Fetching review details: {} by user: {}", id, userId);
        
        try {
            Review review = experienceReviewService.getReviewDetail(id, userId);
            ReviewDetailResponse response = ReviewDetailResponse.from(review);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            log.warn("Review access denied or not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 체험단 리뷰 승인 (파트너)
     * POST /api/reviews/{id}/approve
     */
    @PostMapping("/{id}/approve")
    public ResponseEntity<ReviewDetailResponse> approveReview(
            @PathVariable Long id,
            @RequestBody ReviewApprovalRequest request,
            @RequestHeader("X-User-Id") Long partnerId) {
        
        log.info("Partner {} approving review {}", partnerId, id);
        
        try {
            Review approvedReview = experienceReviewService.approveReview(
                    id, partnerId, request.getFeedback());
            
            ReviewDetailResponse response = ReviewDetailResponse.from(approvedReview);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            log.warn("Invalid request for review approval: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error approving review", e);
            throw new RuntimeException("리뷰 승인 중 오류가 발생했습니다.", e);
        }
    }

    /**
     * 체험단 리뷰 반려 (파트너)
     * POST /api/reviews/{id}/reject
     */
    @PostMapping("/{id}/reject")
    public ResponseEntity<ReviewDetailResponse> rejectReview(
            @PathVariable Long id,
            @RequestBody ReviewRejectionRequest request,
            @RequestHeader("X-User-Id") Long partnerId) {
        
        log.info("Partner {} rejecting review {}", partnerId, id);
        
        try {
            Review rejectedReview = experienceReviewService.rejectReview(
                    id, partnerId, request.getReason());
            
            ReviewDetailResponse response = ReviewDetailResponse.from(rejectedReview);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            log.warn("Invalid request for review rejection: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error rejecting review", e);
            throw new RuntimeException("리뷰 반려 중 오류가 발생했습니다.", e);
        }
    }

    /**
     * 파트너의 리뷰 목록 조회 (검토 대상)
     * GET /api/reviews/partner
     */
    @GetMapping("/partner")
    public ResponseEntity<Page<ReviewListResponse>> getPartnerReviews(
            @PageableDefault(size = 20) Pageable pageable,
            @RequestHeader("X-User-Id") Long partnerId,
            @RequestParam(required = false, defaultValue = "all") String status) {
        
        log.debug("Fetching reviews for partner: {} with status: {}", partnerId, status);
        
        Page<Review> reviews = experienceReviewService.getPartnerReviews(partnerId, pageable);
        
        Page<ReviewListResponse> response = reviews.map(ReviewListResponse::from);
        
        return ResponseEntity.ok(response);
    }

    /**
     * 리뷰어의 체험단 리뷰 목록 조회
     * GET /api/reviews/my
     */
    @GetMapping("/my")
    public ResponseEntity<Page<ReviewListResponse>> getMyReviews(
            @PageableDefault(size = 20) Pageable pageable,
            @RequestHeader("X-User-Id") Long reviewerId) {
        
        log.debug("Fetching reviews for reviewer: {}", reviewerId);
        
        Page<Review> reviews = experienceReviewService.getReviewerReviews(reviewerId, pageable);
        Page<ReviewListResponse> response = reviews.map(ReviewListResponse::from);
        
        return ResponseEntity.ok(response);
    }

    /**
     * 특정 캠페인의 리뷰 목록 조회 (파트너)
     * GET /api/reviews/campaign/{campaignId}
     */
    @GetMapping("/campaign/{campaignId}")
    public ResponseEntity<List<ReviewListResponse>> getCampaignReviews(
            @PathVariable Long campaignId,
            @RequestHeader("X-User-Id") Long partnerId) {
        
        log.debug("Fetching reviews for campaign {} by partner {}", campaignId, partnerId);
        
        try {
            List<Review> reviews = experienceReviewService.getCampaignReviews(campaignId, partnerId);
            
            List<ReviewListResponse> response = reviews.stream()
                    .map(ReviewListResponse::from)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            log.warn("Invalid request for campaign reviews: {}", e.getMessage());
            throw e;
        }
    }

    /**
     * 글로벌 예외 처리
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException e) {
        log.warn("Bad request: {}", e.getMessage());
        return ResponseEntity.badRequest()
                .body(new ErrorResponse("INVALID_REQUEST", e.getMessage()));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException e) {
        log.error("Internal server error", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("INTERNAL_ERROR", "서버 내부 오류가 발생했습니다."));
    }
}