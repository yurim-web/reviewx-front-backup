package com.reviewx.service;

import com.reviewx.dto.review.PurchaseReviewCreateRequest;
import com.reviewx.dto.review.PurchaseReviewUpdateRequest;
import com.reviewx.dto.review.ReviewApprovalRequest;
import com.reviewx.dto.review.ReviewDetailResponse;
import com.reviewx.entity.Campaign;
import com.reviewx.entity.CampaignParticipation;
import com.reviewx.entity.Review;
import com.reviewx.entity.User;
import com.reviewx.repository.CampaignRepository;
import com.reviewx.repository.CampaignParticipationRepository;
import com.reviewx.repository.ReviewRepository;
import com.reviewx.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 구매평 리뷰 관리 서비스
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class PurchaseReviewService {

    private final ReviewRepository reviewRepository;
    private final CampaignRepository campaignRepository;
    private final CampaignParticipationRepository participationRepository;
    private final UserRepository userRepository;

    /**
     * 구매평 리뷰 생성 (참여자)
     */
    @Transactional
    @PreAuthorize("hasRole('REVIEWER')")
    public ReviewDetailResponse createReview(PurchaseReviewCreateRequest request, Authentication auth) {
        log.info("Creating purchase review: campaignId={}, user={}", request.getCampaignId(), auth.getName());

        // 요청 데이터 검증
        request.validate();

        // 사용자 조회
        User reviewer = userRepository.findByEmail(auth.getName())
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

        // 캠페인 조회 및 검증
        Campaign campaign = campaignRepository.findById(request.getCampaignId())
            .orElseThrow(() -> new IllegalArgumentException("캠페인을 찾을 수 없습니다"));

        if (!campaign.getCampaignType().equals(Campaign.CampaignType.PURCHASE_REVIEW)) {
            throw new IllegalArgumentException("구매평 캠페인이 아닙니다");
        }

        // 참여 권한 확인
        CampaignParticipation participation = participationRepository
            .findPurchaseReviewParticipationByCampaignIdAndReviewer(request.getCampaignId(), reviewer)
            .orElseThrow(() -> new IllegalArgumentException("해당 캠페인에 참여하지 않았습니다"));

        if (!participation.getStatus().equals(CampaignParticipation.ParticipationStatus.SELECTED)) {
            throw new IllegalStateException("선발된 참여자만 리뷰를 작성할 수 있습니다");
        }

        // 중복 리뷰 작성 확인
        Optional<Review> existingReview = reviewRepository.findPurchaseReviewByCampaignAndReviewer(campaign, reviewer);
        if (existingReview.isPresent()) {
            throw new IllegalStateException("이미 해당 캠페인에 대한 리뷰를 작성했습니다");
        }

        // 리뷰 작성 가능 시기 확인
        validateReviewPeriod(campaign);

        // 캠페인의 리뷰 형식 요구사항 확인
        validateReviewRequirements(campaign, request);

        // 리뷰 엔티티 생성
        Review review = createReviewEntity(campaign, reviewer, request);

        // 저장
        review = reviewRepository.save(review);

        // 리뷰가 생성되었으므로 별도의 참여 정보 업데이트는 필요 없음
        // Review 엔티티에 캠페인과 리뷰어 정보가 모두 포함되어 관계를 추적할 수 있음

        log.info("Purchase review created successfully: reviewId={}", review.getId());

        return new ReviewDetailResponse(review);
    }

    /**
     * 구매평 리뷰 수정 (참여자)
     */
    @Transactional
    @PreAuthorize("hasRole('REVIEWER')")
    public ReviewDetailResponse updateReview(Long reviewId, PurchaseReviewUpdateRequest request, Authentication auth) {
        log.info("Updating purchase review: reviewId={}, user={}", reviewId, auth.getName());

        // 요청 데이터 검증
        request.validate();

        // 리뷰 조회 및 권한 확인
        Review review = getReviewByIdAndReviewer(reviewId, auth.getName());

        // 수정 가능한 상태 확인
        if (!review.isEditable()) {
            throw new IllegalStateException("작성중 또는 수정요청 상태의 리뷰만 수정할 수 있습니다");
        }

        // 캠페인의 리뷰 형식 요구사항 확인
        validateUpdateRequirements(review.getCampaign(), request);

        // 리뷰 정보 업데이트
        updateReviewFromRequest(review, request);

        Review updatedReview = reviewRepository.save(review);

        log.info("Purchase review updated successfully: reviewId={}", reviewId);

        return new ReviewDetailResponse(updatedReview);
    }

    /**
     * 구매평 리뷰 제출 (참여자)
     */
    @Transactional
    @PreAuthorize("hasRole('REVIEWER')")
    public void submitReview(Long reviewId, Authentication auth) {
        log.info("Submitting purchase review: reviewId={}, user={}", reviewId, auth.getName());

        Review review = getReviewByIdAndReviewer(reviewId, auth.getName());

        if (!review.getStatus().equals(Review.ReviewStatus.DRAFT)) {
            throw new IllegalStateException("작성중인 리뷰만 제출할 수 있습니다");
        }

        // 제출 전 최종 검증
        validateReviewForSubmission(review);

        review.submit();
        reviewRepository.save(review);

        // 캠페인 완료 리뷰 수 증가
        Campaign campaign = review.getCampaign();
        campaign.incrementCompletedReviews();
        campaignRepository.save(campaign);

        log.info("Purchase review submitted successfully: reviewId={}", reviewId);
    }

    /**
     * 구매평 리뷰 승인/반려 (파트너)
     */
    @Transactional
    @PreAuthorize("hasRole('PARTNER')")
    public void reviewByPartner(Long reviewId, ReviewApprovalRequest request, Authentication auth) {
        log.info("Partner reviewing purchase review: reviewId={}, status={}, partner={}",
                reviewId, request.getStatus(), auth.getName());

        // 요청 데이터 검증
        request.validate();

        User partner = userRepository.findByEmail(auth.getName())
            .orElseThrow(() -> new IllegalArgumentException("파트너를 찾을 수 없습니다"));

        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new IllegalArgumentException("리뷰를 찾을 수 없습니다"));

        // 권한 확인
        if (!review.getPartner().equals(partner)) {
            throw new IllegalArgumentException("해당 캠페인의 파트너만 검토할 수 있습니다");
        }

        // 구매평 리뷰 확인
        if (!review.getCampaign().getCampaignType().equals(Campaign.CampaignType.PURCHASE_REVIEW)) {
            throw new IllegalArgumentException("구매평 리뷰가 아닙니다");
        }

        // 검토 가능한 상태 확인
        if (!review.isPendingPartnerReview()) {
            throw new IllegalStateException("제출된 상태의 리뷰만 검토할 수 있습니다");
        }

        // 승인/반려 처리
        Campaign campaign = review.getCampaign();
        if (request.getStatus() == ReviewApprovalRequest.ApprovalStatus.APPROVE) {
            review.approveByPartner(partner, request.getFeedback());
            campaign.incrementApprovedReviews();
            log.info("Purchase review approved by partner: reviewId={}", reviewId);
        } else {
            review.rejectByPartner(partner, request.getFeedback());
            campaign.incrementRejectedReviews();
            log.info("Purchase review rejected by partner: reviewId={}", reviewId);
        }

        reviewRepository.save(review);
        campaignRepository.save(campaign);
    }

    /**
     * 구매평 리뷰 승인/반려 (관리자)
     */
    @Transactional
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public void reviewByAdmin(Long reviewId, ReviewApprovalRequest request, Authentication auth) {
        log.info("Admin reviewing purchase review: reviewId={}, status={}, admin={}",
                reviewId, request.getStatus(), auth.getName());

        // 요청 데이터 검증
        request.validate();

        User admin = userRepository.findByEmail(auth.getName())
            .orElseThrow(() -> new IllegalArgumentException("관리자를 찾을 수 없습니다"));

        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new IllegalArgumentException("리뷰를 찾을 수 없습니다"));

        // 구매평 리뷰 확인
        if (!review.getCampaign().getCampaignType().equals(Campaign.CampaignType.PURCHASE_REVIEW)) {
            throw new IllegalArgumentException("구매평 리뷰가 아닙니다");
        }

        // 검토 가능한 상태 확인
        if (!review.isPendingAdminReview()) {
            throw new IllegalStateException("관리자 검토 대기 상태의 리뷰만 처리할 수 있습니다");
        }

        // 승인/반려 처리
        Campaign campaign = review.getCampaign();
        if (request.getStatus() == ReviewApprovalRequest.ApprovalStatus.APPROVE) {
            review.approveByAdmin(admin, request.getFeedback());
            // 파트너가 반려했었지만 관리자가 승인한 경우이므로 승인 수 증가
            campaign.incrementApprovedReviews();
            log.info("Purchase review approved by admin: reviewId={}", reviewId);
        } else {
            review.rejectByAdmin(admin, request.getFeedback());
            log.info("Purchase review rejected by admin: reviewId={}", reviewId);
        }

        reviewRepository.save(review);
        campaignRepository.save(campaign);
    }

    /**
     * 참여자의 구매평 리뷰 목록 조회
     */
    @PreAuthorize("hasRole('REVIEWER')")
    public Page<ReviewDetailResponse> getMyReviews(Authentication auth, Pageable pageable) {
        User reviewer = userRepository.findByEmail(auth.getName())
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

        Page<Review> reviews = reviewRepository.findPurchaseReviewsByReviewer(reviewer, pageable);
        return reviews.map(ReviewDetailResponse::new);
    }

    /**
     * 파트너의 구매평 리뷰 목록 조회
     */
    @PreAuthorize("hasRole('PARTNER')")
    public Page<ReviewDetailResponse> getPartnerReviews(Authentication auth, Pageable pageable) {
        User partner = userRepository.findByEmail(auth.getName())
            .orElseThrow(() -> new IllegalArgumentException("파트너를 찾을 수 없습니다"));

        Page<Review> reviews = reviewRepository.findPurchaseReviewsByPartner(partner, pageable);
        return reviews.map(ReviewDetailResponse::new);
    }

    /**
     * 파트너의 검토 대기중인 구매평 리뷰 목록
     */
    @PreAuthorize("hasRole('PARTNER')")
    public List<ReviewDetailResponse> getPendingReviews(Authentication auth) {
        User partner = userRepository.findByEmail(auth.getName())
            .orElseThrow(() -> new IllegalArgumentException("파트너를 찾을 수 없습니다"));

        List<Review> reviews = reviewRepository.findPendingPurchaseReviewsByPartner(partner);
        return reviews.stream()
            .map(ReviewDetailResponse::new)
            .toList();
    }

    /**
     * 특정 캠페인의 구매평 리뷰 목록 조회 (파트너)
     */
    @PreAuthorize("hasRole('PARTNER')")
    public List<ReviewDetailResponse> getCampaignReviews(Long campaignId, Authentication auth) {
        User partner = userRepository.findByEmail(auth.getName())
            .orElseThrow(() -> new IllegalArgumentException("파트너를 찾을 수 없습니다"));

        Campaign campaign = campaignRepository.findById(campaignId)
            .orElseThrow(() -> new IllegalArgumentException("캠페인을 찾을 수 없습니다"));

        // 권한 확인
        if (!campaign.getPartner().equals(partner)) {
            throw new IllegalArgumentException("해당 캠페인의 파트너만 조회할 수 있습니다");
        }

        // 구매평 캠페인 확인
        if (!campaign.getCampaignType().equals(Campaign.CampaignType.PURCHASE_REVIEW)) {
            throw new IllegalArgumentException("구매평 캠페인이 아닙니다");
        }

        List<Review> reviews = reviewRepository.findPurchaseReviewsByCampaign(campaign);
        return reviews.stream()
            .map(ReviewDetailResponse::new)
            .toList();
    }

    /**
     * 관리자의 검토 대기중인 구매평 리뷰 목록
     */
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public List<ReviewDetailResponse> getPendingAdminReviews() {
        List<Review> reviews = reviewRepository.findPendingPurchaseReviewsForAdmin();
        return reviews.stream()
            .map(ReviewDetailResponse::new)
            .toList();
    }

    /**
     * 구매평 리뷰 상세 조회
     */
    public ReviewDetailResponse getReviewDetail(Long reviewId, Authentication auth) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new IllegalArgumentException("리뷰를 찾을 수 없습니다"));

        // 구매평 리뷰 확인
        if (!review.getCampaign().getCampaignType().equals(Campaign.CampaignType.PURCHASE_REVIEW)) {
            throw new IllegalArgumentException("구매평 리뷰가 아닙니다");
        }

        // 권한 확인 (리뷰어 본인, 캠페인 파트너, 관리자)
        String username = auth.getName();
        boolean isReviewer = review.getReviewer().getEmail().equals(username);
        boolean isPartner = review.getPartner().getEmail().equals(username);
        boolean isAdmin = auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().contains("ADMIN"));

        if (!isReviewer && !isPartner && !isAdmin) {
            throw new IllegalArgumentException("해당 리뷰를 조회할 권한이 없습니다");
        }

        return new ReviewDetailResponse(review);
    }

    /**
     * 구매평 리뷰 삭제 (소프트 삭제)
     */
    @Transactional
    @PreAuthorize("hasRole('REVIEWER')")
    public void deleteReview(Long reviewId, Authentication auth) {
        log.info("Deleting purchase review: reviewId={}, user={}", reviewId, auth.getName());

        Review review = getReviewByIdAndReviewer(reviewId, auth.getName());

        if (!review.getStatus().equals(Review.ReviewStatus.DRAFT)) {
            throw new IllegalStateException("작성중인 리뷰만 삭제할 수 있습니다");
        }

        review.softDelete();
        reviewRepository.save(review);

        log.info("Purchase review deleted successfully: reviewId={}", reviewId);
    }

    // === Private Helper Methods ===

    private Review getReviewByIdAndReviewer(Long reviewId, String email) {
        User reviewer = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new IllegalArgumentException("리뷰를 찾을 수 없습니다"));

        if (!review.getReviewer().equals(reviewer)) {
            throw new IllegalArgumentException("본인이 작성한 리뷰만 수정할 수 있습니다");
        }

        if (!review.getCampaign().getCampaignType().equals(Campaign.CampaignType.PURCHASE_REVIEW)) {
            throw new IllegalArgumentException("구매평 리뷰가 아닙니다");
        }

        return review;
    }

    private void validateReviewPeriod(Campaign campaign) {
        LocalDateTime now = LocalDateTime.now();

        if (campaign.getReviewStartDate() != null && now.isBefore(campaign.getReviewStartDate())) {
            throw new IllegalStateException("아직 리뷰 작성 기간이 아닙니다");
        }

        if (now.isAfter(campaign.getReviewEndDate())) {
            throw new IllegalStateException("리뷰 작성 기간이 종료되었습니다");
        }
    }

    private void validateReviewRequirements(Campaign campaign, PurchaseReviewCreateRequest request) {
        // 리뷰 형식에 따른 검증
        Campaign.ReviewFormat format = campaign.getReviewFormat();

        if (format == Campaign.ReviewFormat.TEXT || format == Campaign.ReviewFormat.TEXT_AND_PHOTO) {
            if (campaign.getMinTextLength() != null && request.getTextLength() < campaign.getMinTextLength()) {
                throw new IllegalArgumentException("최소 텍스트 길이 요구사항을 충족하지 않습니다");
            }
        }

        if (format == Campaign.ReviewFormat.PHOTO || format == Campaign.ReviewFormat.TEXT_AND_PHOTO) {
            if (campaign.getMinPhotoCount() != null && request.getPhotoCount() < campaign.getMinPhotoCount()) {
                throw new IllegalArgumentException("최소 사진 개수 요구사항을 충족하지 않습니다");
            }
        }

        // 구매 영수증 필수 확인
        if (request.getReceiptFileIds() == null || request.getReceiptFileIds().isEmpty()) {
            throw new IllegalArgumentException("구매 영수증은 필수입니다");
        }
    }

    private void validateUpdateRequirements(Campaign campaign, PurchaseReviewUpdateRequest request) {
        // 리뷰 형식에 따른 검증
        Campaign.ReviewFormat format = campaign.getReviewFormat();

        if (format == Campaign.ReviewFormat.TEXT || format == Campaign.ReviewFormat.TEXT_AND_PHOTO) {
            if (campaign.getMinTextLength() != null && request.getTextLength() < campaign.getMinTextLength()) {
                throw new IllegalArgumentException("최소 텍스트 길이 요구사항을 충족하지 않습니다");
            }
        }

        if (format == Campaign.ReviewFormat.PHOTO || format == Campaign.ReviewFormat.TEXT_AND_PHOTO) {
            if (campaign.getMinPhotoCount() != null && request.getFinalPhotoCount() < campaign.getMinPhotoCount()) {
                throw new IllegalArgumentException("최소 사진 개수 요구사항을 충족하지 않습니다");
            }
        }
    }

    private Review createReviewEntity(Campaign campaign, User reviewer, PurchaseReviewCreateRequest request) {
        Review review = new Review();

        // 기본 정보
        review.setCampaign(campaign);
        review.setReviewer(reviewer);
        review.setPartner(campaign.getPartner());
        review.setTitle(request.getTitle());
        review.setContent(request.getContent());
        review.setRating(request.getRating());
        review.setRewardPoint(campaign.getRewardPoint());

        // 키워드 및 해시태그
        review.setKeywordsUsed(request.getKeywordsUsed());
        review.setHashtags(request.getHashtags());

        // 플랫폼 게시 정보
        review.setPlatformUrl(request.getPlatformUrl());
        review.setPlatformReviewId(request.getPlatformReviewId());
        review.setPostedAt(request.getPostedAt());

        // 구매 정보
        review.confirmPurchase(request.getOrderNumber(), request.getPurchaseAmount(), request.getDeliveryAddress());

        // 콘텐츠 메트릭 업데이트
        review.updateContentMetrics(request.getContent(), request.getPhotoCount(), 0);

        // 디바이스 정보
        review.setDeviceInfo(request.getDeviceInfo());
        review.setIpAddress(request.getIpAddress());
        review.setUserAgent(request.getUserAgent());

        return review;
    }

    private void updateReviewFromRequest(Review review, PurchaseReviewUpdateRequest request) {
        review.setTitle(request.getTitle());
        review.setContent(request.getContent());
        review.setRating(request.getRating());

        // 키워드 및 해시태그
        review.setKeywordsUsed(request.getKeywordsUsed());
        review.setHashtags(request.getHashtags());

        // 플랫폼 게시 정보
        review.setPlatformUrl(request.getPlatformUrl());
        review.setPlatformReviewId(request.getPlatformReviewId());
        review.setPostedAt(request.getPostedAt());

        // 콘텐츠 메트릭 업데이트
        review.updateContentMetrics(request.getContent(), request.getFinalPhotoCount(), 0);
    }

    private void validateReviewForSubmission(Review review) {
        if (review.getTitle() == null || review.getTitle().trim().isEmpty()) {
            throw new IllegalStateException("리뷰 제목은 필수입니다");
        }
        if (review.getContent() == null || review.getContent().trim().isEmpty()) {
            throw new IllegalStateException("리뷰 내용은 필수입니다");
        }
        if (!review.getPurchaseConfirmed()) {
            throw new IllegalStateException("구매 확인이 필요합니다");
        }
        if (review.getOrderNumber() == null || review.getOrderNumber().trim().isEmpty()) {
            throw new IllegalStateException("주문번호는 필수입니다");
        }
    }
}