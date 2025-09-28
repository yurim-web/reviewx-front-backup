package com.reviewx.service;

import com.reviewx.entity.*;
import com.reviewx.repository.CampaignParticipationRepository;
import com.reviewx.repository.CampaignRepository;
import com.reviewx.repository.ReviewRepository;
import com.reviewx.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExperienceReviewService {

    private final ReviewRepository reviewRepository;
    private final CampaignRepository campaignRepository;
    private final CampaignParticipationRepository participationRepository;
    private final UserRepository userRepository;
    private final PointTransactionService pointTransactionService;

    /**
     * 체험단 리뷰 작성 (리뷰어)
     */
    @Transactional
    public Review submitExperienceReview(Review review, Long campaignId, Long reviewerId) {
        log.info("Reviewer {} submitting review for campaign {}", reviewerId, campaignId);
        
        // 리뷰어 조회 및 권한 검증
        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new IllegalArgumentException("리뷰어를 찾을 수 없습니다: " + reviewerId));
        
        if (!reviewer.isReviewer() || !reviewer.isActive()) {
            throw new IllegalArgumentException("활성 리뷰어만 리뷰를 작성할 수 있습니다.");
        }

        // 캠페인 조회 및 체험단 캠페인 검증
        Campaign campaign = campaignRepository.findExperienceCampaignById(campaignId)
                .orElseThrow(() -> new IllegalArgumentException("체험단 캠페인을 찾을 수 없습니다: " + campaignId));

        // 참여자 자격 검증
        CampaignParticipation participation = participationRepository
                .findByCampaignAndReviewer(campaign, reviewer)
                .orElseThrow(() -> new IllegalArgumentException("캠페인에 참여하지 않은 리뷰어입니다."));

        if (!participation.isEligibleForReview()) {
            throw new IllegalArgumentException("리뷰 작성 자격이 없습니다. 선발된 후 리뷰 기간에만 작성 가능합니다.");
        }

        // 중복 리뷰 확인
        if (reviewRepository.findByCampaignAndReviewer(campaign, reviewer).isPresent()) {
            throw new IllegalArgumentException("이미 리뷰를 작성했습니다.");
        }

        // 리뷰 설정
        review.setCampaign(campaign);
        review.setReviewer(reviewer);
        review.setPartner(campaign.getPartner());
        review.setRewardPoint(campaign.getRewardPoint());
        review.setStatus(Review.ReviewStatus.DRAFT);

        // 체험단 필수 필드 검증 및 설정
        validateExperienceReview(review);
        
        // 방문 정보 확인
        if (review.getVisitedAt() != null) {
            review.setVisitConfirmed(true);
        }

        // 콘텐츠 메트릭 업데이트 및 품질 점수 계산
        review.updateContentMetrics(review.getContent(), review.getPhotoCount(), review.getVideoCount());
        
        Review savedReview = reviewRepository.save(review);
        log.info("Experience review draft created: {}", savedReview.getId());
        
        return savedReview;
    }

    /**
     * 체험단 리뷰 제출 (임시저장에서 제출로 상태 변경)
     */
    @Transactional
    public Review submitReviewForApproval(Long reviewId, Long reviewerId) {
        log.info("Reviewer {} submitting review {} for approval", reviewerId, reviewId);
        
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("리뷰를 찾을 수 없습니다: " + reviewId));

        // 권한 검증
        if (!review.getReviewer().getId().equals(reviewerId)) {
            throw new IllegalArgumentException("본인의 리뷰만 제출할 수 있습니다.");
        }

        if (!review.isEditable()) {
            throw new IllegalArgumentException("제출할 수 없는 리뷰 상태입니다.");
        }

        // 필수 정보 재검증
        validateExperienceReviewForSubmission(review);

        // 제출 처리
        review.submit();
        
        // 캠페인 통계 업데이트
        Campaign campaign = review.getCampaign();
        campaign.incrementCompletedReviews();
        campaignRepository.save(campaign);
        
        Review submittedReview = reviewRepository.save(review);
        log.info("Experience review submitted for approval: {}", submittedReview.getId());
        
        return submittedReview;
    }

    /**
     * 체험단 리뷰 승인 (파트너)
     */
    @Transactional
    public Review approveReview(Long reviewId, Long partnerId, String feedback) {
        log.info("Partner {} approving review {}", partnerId, reviewId);
        
        // 파트너 조회
        User partner = userRepository.findById(partnerId)
                .orElseThrow(() -> new IllegalArgumentException("파트너를 찾을 수 없습니다: " + partnerId));

        // 리뷰 조회
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("리뷰를 찾을 수 없습니다: " + reviewId));

        // 권한 검증
        if (!review.getPartner().getId().equals(partnerId)) {
            throw new IllegalArgumentException("본인 캠페인의 리뷰만 승인할 수 있습니다.");
        }

        if (!review.isPendingPartnerReview()) {
            throw new IllegalArgumentException("승인할 수 없는 리뷰 상태입니다.");
        }

        // 승인 처리
        review.approveByPartner(partner, feedback);
        
        // 캠페인 통계 업데이트
        Campaign campaign = review.getCampaign();
        campaign.incrementApprovedReviews();
        
        // 캠페인 참여 완료 처리
        CampaignParticipation participation = participationRepository
                .findByCampaignAndReviewer(campaign, review.getReviewer())
                .orElse(null);
        if (participation != null) {
            participation.complete();
            participationRepository.save(participation);
        }

        // 포인트 지급 처리
        processRewardPayment(review);
        
        reviewRepository.save(review);
        campaignRepository.save(campaign);
        
        log.info("Experience review approved and reward paid: {}", reviewId);
        
        return review;
    }

    /**
     * 체험단 리뷰 반려 (파트너)
     */
    @Transactional
    public Review rejectReview(Long reviewId, Long partnerId, String rejectionReason) {
        log.info("Partner {} rejecting review {}", partnerId, reviewId);
        
        // 파트너 조회
        User partner = userRepository.findById(partnerId)
                .orElseThrow(() -> new IllegalArgumentException("파트너를 찾을 수 없습니다: " + partnerId));

        // 리뷰 조회
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("리뷰를 찾을 수 없습니다: " + reviewId));

        // 권한 검증
        if (!review.getPartner().getId().equals(partnerId)) {
            throw new IllegalArgumentException("본인 캠페인의 리뷰만 반려할 수 있습니다.");
        }

        if (!review.isPendingPartnerReview()) {
            throw new IllegalArgumentException("반려할 수 없는 리뷰 상태입니다.");
        }

        // 반려 처리
        review.rejectByPartner(partner, rejectionReason);
        
        // 캠페인 통계 업데이트
        Campaign campaign = review.getCampaign();
        campaign.incrementRejectedReviews();
        
        reviewRepository.save(review);
        campaignRepository.save(campaign);
        
        log.info("Experience review rejected: {}", reviewId);
        
        return review;
    }

    /**
     * 파트너의 리뷰 목록 조회 (검토 대상)
     */
    public Page<Review> getPartnerReviews(Long partnerId, Pageable pageable) {
        User partner = userRepository.findById(partnerId)
                .orElseThrow(() -> new IllegalArgumentException("파트너를 찾을 수 없습니다: " + partnerId));
        
        return reviewRepository.findExperienceReviewsByPartner(partner, pageable);
    }

    /**
     * 파트너의 검토 대기 중인 리뷰 목록
     */
    public List<Review> getPendingReviewsForPartner(Long partnerId) {
        User partner = userRepository.findById(partnerId)
                .orElseThrow(() -> new IllegalArgumentException("파트너를 찾을 수 없습니다: " + partnerId));
        
        return reviewRepository.findPendingExperienceReviewsByPartner(partner);
    }

    /**
     * 리뷰어의 체험단 리뷰 목록 조회
     */
    public Page<Review> getReviewerReviews(Long reviewerId, Pageable pageable) {
        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new IllegalArgumentException("리뷰어를 찾을 수 없습니다: " + reviewerId));
        
        return reviewRepository.findExperienceReviewsByReviewer(reviewer, pageable);
    }

    /**
     * 특정 캠페인의 리뷰 목록 조회
     */
    public List<Review> getCampaignReviews(Long campaignId, Long partnerId) {
        Campaign campaign = campaignRepository.findExperienceCampaignById(campaignId)
                .orElseThrow(() -> new IllegalArgumentException("체험단 캠페인을 찾을 수 없습니다: " + campaignId));

        // 권한 검증
        if (!campaign.getPartner().getId().equals(partnerId)) {
            throw new IllegalArgumentException("본인의 캠페인만 조회할 수 있습니다.");
        }

        return reviewRepository.findByCampaign(campaign);
    }

    /**
     * 리뷰 상세 조회
     */
    public Review getReviewDetail(Long reviewId, Long userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("리뷰를 찾을 수 없습니다: " + reviewId));

        // 권한 검증 (리뷰어 본인 또는 파트너만 조회 가능)
        if (!review.getReviewer().getId().equals(userId) && 
            !review.getPartner().getId().equals(userId)) {
            throw new IllegalArgumentException("리뷰를 조회할 권한이 없습니다.");
        }

        return review;
    }

    /**
     * 포인트 지급 처리 - PointTransactionService를 통한 완전한 거래 처리
     */
    @Transactional
    public void processRewardPayment(Review review) {
        if (review.getPointPaid()) {
            log.warn("Already paid reward for review: {}", review.getId());
            return;
        }

        try {
            // PointTransactionService를 통해 완전한 거래 처리
            PointTransaction transaction = pointTransactionService.payReviewReward(
                review.getReviewer().getId(), 
                review.getId(), 
                review.getRewardPoint()
            );
            
            // 리뷰어 통계 업데이트 (포인트는 이미 PointTransactionService에서 처리됨)
            User reviewer = review.getReviewer();
            reviewer.earnRewardPoint(review.getRewardPoint());
            userRepository.save(reviewer);
            
            // 리뷰 포인트 지급 완료 처리
            review.payRewardPoint();
            
            log.info("Reward payment processed successfully: {} points to reviewer {}, transaction: {}", 
                    review.getRewardPoint(), review.getReviewer().getId(), transaction.getId());
            
        } catch (Exception e) {
            log.error("Failed to process reward payment for review: {}", review.getId(), e);
            throw new RuntimeException("포인트 지급 처리에 실패했습니다: " + e.getMessage(), e);
        }
    }

    /**
     * 체험단 리뷰 검증 (기본)
     */
    private void validateExperienceReview(Review review) {
        if (review.getTitle() == null || review.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("리뷰 제목은 필수입니다.");
        }
        
        if (review.getContent() == null || review.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("리뷰 내용은 필수입니다.");
        }
        
        if (review.getRating() == null || review.getRating() < 1 || review.getRating() > 5) {
            throw new IllegalArgumentException("별점은 1-5 사이여야 합니다.");
        }
    }

    /**
     * 체험단 리뷰 제출 전 검증
     */
    private void validateExperienceReviewForSubmission(Review review) {
        validateExperienceReview(review);
        
        if (review.getPlatformUrl() == null || review.getPlatformUrl().trim().isEmpty()) {
            throw new IllegalArgumentException("네이버 플레이스 리뷰 URL은 필수입니다.");
        }
        
        if (review.getVisitedAt() == null) {
            throw new IllegalArgumentException("방문 일시는 필수입니다.");
        }
        
        if (review.getContent().length() < 50) {
            throw new IllegalArgumentException("리뷰 내용은 최소 50자 이상이어야 합니다.");
        }
        
        if (review.getPhotoCount() == null || review.getPhotoCount() < 1) {
            throw new IllegalArgumentException("최소 1장 이상의 사진이 필요합니다.");
        }
        
        // 방문 확인 검증
        if (!review.getVisitConfirmed()) {
            throw new IllegalArgumentException("매장 방문이 확인되지 않았습니다.");
        }
    }
}