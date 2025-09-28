package com.reviewx.service;

import com.reviewx.dto.campaign.PurchaseReviewCampaignCreateRequest;
import com.reviewx.dto.campaign.PurchaseReviewCampaignResponse;
import com.reviewx.entity.Campaign;
import com.reviewx.entity.User;
import com.reviewx.repository.CampaignRepository;
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

/**
 * 구매평 캠페인 관리 서비스
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class PurchaseReviewCampaignService {

    private final CampaignRepository campaignRepository;
    private final UserRepository userRepository;

    /**
     * 구매평 캠페인 생성 (파트너)
     */
    @Transactional
    @PreAuthorize("hasRole('PARTNER')")
    public PurchaseReviewCampaignResponse createCampaign(PurchaseReviewCampaignCreateRequest request,
                                                        Authentication auth) {
        log.info("Creating purchase review campaign: {}", request.getTitle());

        // 요청 데이터 검증
        request.validate();

        // 파트너 정보 조회
        User partner = userRepository.findByEmail(auth.getName())
            .orElseThrow(() -> new IllegalArgumentException("파트너를 찾을 수 없습니다"));

        // Campaign 엔티티 생성
        Campaign campaign = request.toEntity();
        campaign.setPartner(partner);

        // 플랫폼 수수료 계산 (기본 3.3%)
        Integer platformFee = (int) (campaign.getTotalBudget() * 0.033);
        campaign.setPlatformFee(platformFee);
        campaign.setFinalCost(campaign.getTotalBudget() + platformFee);

        // 저장
        Campaign savedCampaign = campaignRepository.save(campaign);

        log.info("Purchase review campaign created successfully: ID={}", savedCampaign.getId());

        return new PurchaseReviewCampaignResponse(savedCampaign);
    }

    /**
     * 구매평 캠페인 수정 (파트너)
     */
    @Transactional
    @PreAuthorize("hasRole('PARTNER')")
    public PurchaseReviewCampaignResponse updateCampaign(Long campaignId,
                                                        PurchaseReviewCampaignCreateRequest request,
                                                        Authentication auth) {
        log.info("Updating purchase review campaign: ID={}", campaignId);

        // 요청 데이터 검증
        request.validate();

        // 캠페인 조회 및 권한 확인
        Campaign campaign = getCampaignByIdAndPartner(campaignId, auth.getName());

        // 수정 가능 상태 확인
        if (!campaign.getStatus().equals(Campaign.CampaignStatus.DRAFT) &&
            !campaign.getStatus().equals(Campaign.CampaignStatus.REJECTED)) {
            throw new IllegalStateException("작성중 또는 반려 상태의 캠페인만 수정할 수 있습니다");
        }

        // 캠페인 정보 업데이트
        updateCampaignFromRequest(campaign, request);

        // 예산 재계산
        campaign.setTotalBudget(campaign.getRecruitCount() * campaign.getRewardPoint());
        Integer platformFee = (int) (campaign.getTotalBudget() * 0.033);
        campaign.setPlatformFee(platformFee);
        campaign.setFinalCost(campaign.getTotalBudget() + platformFee);

        Campaign updatedCampaign = campaignRepository.save(campaign);

        log.info("Purchase review campaign updated successfully: ID={}", updatedCampaign.getId());

        return new PurchaseReviewCampaignResponse(updatedCampaign);
    }

    /**
     * 구매평 캠페인 검토 제출 (파트너)
     */
    @Transactional
    @PreAuthorize("hasRole('PARTNER')")
    public void submitCampaignForReview(Long campaignId, Authentication auth) {
        log.info("Submitting purchase review campaign for admin review: ID={}", campaignId);

        Campaign campaign = getCampaignByIdAndPartner(campaignId, auth.getName());

        if (!campaign.getStatus().equals(Campaign.CampaignStatus.DRAFT)) {
            throw new IllegalStateException("작성중인 캠페인만 검토 제출할 수 있습니다");
        }

        // 필수 정보 검증
        validateCampaignForSubmission(campaign);

        campaign.submitForReview();
        campaignRepository.save(campaign);

        log.info("Purchase review campaign submitted for review successfully: ID={}", campaignId);
    }

    /**
     * 구매평 캠페인 승인 (관리자)
     */
    @Transactional
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public void approveCampaign(Long campaignId, String adminNote, Authentication auth) {
        log.info("Approving purchase review campaign: ID={}", campaignId);

        Campaign campaign = campaignRepository.findById(campaignId)
            .orElseThrow(() -> new IllegalArgumentException("캠페인을 찾을 수 없습니다"));

        if (!campaign.getStatus().equals(Campaign.CampaignStatus.PENDING_REVIEW)) {
            throw new IllegalStateException("검토 대기중인 캠페인만 승인할 수 있습니다");
        }

        User admin = userRepository.findByEmail(auth.getName())
            .orElseThrow(() -> new IllegalArgumentException("관리자를 찾을 수 없습니다"));

        campaign.approve(admin);
        if (adminNote != null && !adminNote.trim().isEmpty()) {
            campaign.setAdminNote(adminNote);
        }

        campaignRepository.save(campaign);

        log.info("Purchase review campaign approved successfully: ID={}", campaignId);
    }

    /**
     * 구매평 캠페인 반려 (관리자)
     */
    @Transactional
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public void rejectCampaign(Long campaignId, String reason, Authentication auth) {
        log.info("Rejecting purchase review campaign: ID={}", campaignId);

        if (reason == null || reason.trim().isEmpty()) {
            throw new IllegalArgumentException("반려 사유는 필수입니다");
        }

        Campaign campaign = campaignRepository.findById(campaignId)
            .orElseThrow(() -> new IllegalArgumentException("캠페인을 찾을 수 없습니다"));

        if (!campaign.getStatus().equals(Campaign.CampaignStatus.PENDING_REVIEW)) {
            throw new IllegalStateException("검토 대기중인 캠페인만 반려할 수 있습니다");
        }

        User admin = userRepository.findByEmail(auth.getName())
            .orElseThrow(() -> new IllegalArgumentException("관리자를 찾을 수 없습니다"));

        campaign.reject(admin, reason);
        campaignRepository.save(campaign);

        log.info("Purchase review campaign rejected successfully: ID={}", campaignId);
    }

    /**
     * 구매평 캠페인 모집 시작 (파트너/관리자)
     */
    @Transactional
    @PreAuthorize("hasRole('PARTNER') or hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public void startRecruitment(Long campaignId, Authentication auth) {
        log.info("Starting recruitment for purchase review campaign: ID={}", campaignId);

        Campaign campaign;
        if (auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().contains("ADMIN"))) {
            // 관리자는 모든 캠페인 접근 가능
            campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new IllegalArgumentException("캠페인을 찾을 수 없습니다"));
        } else {
            // 파트너는 본인 캠페인만 접근 가능
            campaign = getCampaignByIdAndPartner(campaignId, auth.getName());
        }

        if (!campaign.getStatus().equals(Campaign.CampaignStatus.APPROVED)) {
            throw new IllegalStateException("승인된 캠페인만 모집을 시작할 수 있습니다");
        }

        if (campaign.getApplicationStartDate().isAfter(LocalDateTime.now())) {
            throw new IllegalStateException("아직 모집 시작일이 아닙니다");
        }

        campaign.startRecruitment();
        campaignRepository.save(campaign);

        log.info("Recruitment started successfully for purchase review campaign: ID={}", campaignId);
    }

    /**
     * 구매평 캠페인 상세 조회
     */
    public PurchaseReviewCampaignResponse getCampaignById(Long campaignId) {
        Campaign campaign = campaignRepository.findById(campaignId)
            .orElseThrow(() -> new IllegalArgumentException("캠페인을 찾을 수 없습니다"));

        if (!campaign.getCampaignType().equals(Campaign.CampaignType.PURCHASE_REVIEW)) {
            throw new IllegalArgumentException("구매평 캠페인이 아닙니다");
        }

        if (campaign.getDeletedAt() != null) {
            throw new IllegalArgumentException("삭제된 캠페인입니다");
        }

        return new PurchaseReviewCampaignResponse(campaign);
    }

    /**
     * 파트너별 구매평 캠페인 목록 조회
     */
    @PreAuthorize("hasRole('PARTNER')")
    public Page<PurchaseReviewCampaignResponse> getPartnerCampaigns(Authentication auth, Pageable pageable) {
        User partner = userRepository.findByEmail(auth.getName())
            .orElseThrow(() -> new IllegalArgumentException("파트너를 찾을 수 없습니다"));

        Page<Campaign> campaigns = campaignRepository.findByPartnerAndCampaignTypeAndDeletedAtIsNull(
            partner, Campaign.CampaignType.PURCHASE_REVIEW, pageable
        );

        return campaigns.map(PurchaseReviewCampaignResponse::forList);
    }

    /**
     * 참여 가능한 구매평 캠페인 목록 조회 (일반 사용자)
     */
    public Page<PurchaseReviewCampaignResponse> getAvailableCampaigns(Pageable pageable) {
        Page<Campaign> campaigns = campaignRepository.findAvailablePurchaseReviewCampaigns(pageable);
        return campaigns.map(PurchaseReviewCampaignResponse::forList);
    }

    /**
     * 구매평 캠페인 검색
     */
    public Page<PurchaseReviewCampaignResponse> searchCampaigns(String keyword, Pageable pageable) {
        Page<Campaign> campaigns;
        if (keyword != null && !keyword.trim().isEmpty()) {
            campaigns = campaignRepository.searchAvailablePurchaseReviewCampaigns(keyword.trim(), pageable);
        } else {
            campaigns = campaignRepository.findAvailablePurchaseReviewCampaigns(pageable);
        }
        return campaigns.map(PurchaseReviewCampaignResponse::forList);
    }

    /**
     * 리뷰 플랫폼별 구매평 캠페인 조회
     */
    public Page<PurchaseReviewCampaignResponse> getCampaignsByPlatform(Campaign.ReviewPlatform platform, Pageable pageable) {
        Page<Campaign> campaigns = campaignRepository.findPurchaseReviewCampaignsByPlatform(platform, pageable);
        return campaigns.map(PurchaseReviewCampaignResponse::forList);
    }

    /**
     * 리뷰 형식별 구매평 캠페인 조회
     */
    public Page<PurchaseReviewCampaignResponse> getCampaignsByFormat(Campaign.ReviewFormat format, Pageable pageable) {
        Page<Campaign> campaigns = campaignRepository.findPurchaseReviewCampaignsByFormat(format, pageable);
        return campaigns.map(PurchaseReviewCampaignResponse::forList);
    }

    /**
     * 리워드 포인트 범위별 구매평 캠페인 조회
     */
    public Page<PurchaseReviewCampaignResponse> getCampaignsByPointRange(Integer minPoint, Integer maxPoint, Pageable pageable) {
        Page<Campaign> campaigns = campaignRepository.findPurchaseReviewCampaignsByPointRange(minPoint, maxPoint, pageable);
        return campaigns.map(PurchaseReviewCampaignResponse::forList);
    }

    /**
     * 관리자 검토 대기중인 구매평 캠페인 목록
     */
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public Page<PurchaseReviewCampaignResponse> getPendingReviewCampaigns(Pageable pageable) {
        Page<Campaign> campaigns = campaignRepository.findPendingReviewPurchaseReviewCampaigns(pageable);
        return campaigns.map(PurchaseReviewCampaignResponse::new);
    }

    /**
     * 모든 구매평 캠페인 목록 조회 (관리자)
     */
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public Page<PurchaseReviewCampaignResponse> getAllCampaigns(Pageable pageable) {
        Page<Campaign> campaigns = campaignRepository.findByCampaignTypeAndDeletedAtIsNull(
            Campaign.CampaignType.PURCHASE_REVIEW, pageable
        );

        return campaigns.map(PurchaseReviewCampaignResponse::new);
    }

    /**
     * 구매평 캠페인 삭제 (소프트 삭제)
     */
    @Transactional
    @PreAuthorize("hasRole('PARTNER')")
    public void deleteCampaign(Long campaignId, Authentication auth) {
        log.info("Deleting purchase review campaign: ID={}", campaignId);

        Campaign campaign = getCampaignByIdAndPartner(campaignId, auth.getName());

        if (!campaign.canBeCancelled()) {
            throw new IllegalStateException("진행중인 캠페인은 삭제할 수 없습니다");
        }

        campaign.softDelete();
        campaignRepository.save(campaign);

        log.info("Purchase review campaign deleted successfully: ID={}", campaignId);
    }

    // === Private Helper Methods ===

    private Campaign getCampaignByIdAndPartner(Long campaignId, String email) {
        User partner = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("파트너를 찾을 수 없습니다"));

        return campaignRepository.findByIdAndPartnerAndCampaignTypeAndDeletedAtIsNull(
                campaignId, partner, Campaign.CampaignType.PURCHASE_REVIEW)
            .orElseThrow(() -> new IllegalArgumentException("구매평 캠페인을 찾을 수 없거나 접근 권한이 없습니다"));
    }

    private void updateCampaignFromRequest(Campaign campaign, PurchaseReviewCampaignCreateRequest request) {
        // 기본 정보
        campaign.setTitle(request.getTitle());
        campaign.setDescription(request.getDescription());

        // 제품 정보
        campaign.setProductName(request.getProductName());
        campaign.setProductPrice(request.getProductPrice());
        campaign.setProductUrl(request.getProductUrl());
        campaign.setShopName(request.getShopName());
        campaign.setShopUrl(request.getShopUrl());

        // 플랫폼 및 리뷰 형식
        campaign.setReviewPlatform(request.getReviewPlatform());
        campaign.setReviewFormat(request.getReviewFormat());

        // 리뷰 설정
        campaign.setMinTextLength(request.getMinTextLength());
        campaign.setMinPhotoCount(request.getMinPhotoCount());

        // 모집 설정
        campaign.setRecruitCount(request.getRecruitCount());
        campaign.setRewardPoint(request.getRewardPoint());

        // 가이드
        campaign.setReviewGuide(request.getReviewGuide());
        campaign.setKeywordRequirements(request.getKeywordRequirements());

        // 일정
        campaign.setApplicationStartDate(request.getApplicationStartDate());
        campaign.setApplicationEndDate(request.getApplicationEndDate());
        campaign.setSelectionDate(request.getSelectionDate());
        campaign.setReviewStartDate(request.getReviewStartDate());
        campaign.setReviewEndDate(request.getReviewEndDate());

        // 배송 설정
        campaign.setShippingRequired(request.getShippingRequired());
        campaign.setShippingFee(request.getShippingFee());
        campaign.setShippingNote(request.getShippingNote());
    }

    private void validateCampaignForSubmission(Campaign campaign) {
        if (campaign.getTitle() == null || campaign.getTitle().trim().isEmpty()) {
            throw new IllegalStateException("캠페인 제목은 필수입니다");
        }
        if (campaign.getProductName() == null || campaign.getProductName().trim().isEmpty()) {
            throw new IllegalStateException("제품명은 필수입니다");
        }
        if (campaign.getProductUrl() == null || campaign.getProductUrl().trim().isEmpty()) {
            throw new IllegalStateException("제품 URL은 필수입니다");
        }
        if (campaign.getReviewGuide() == null || campaign.getReviewGuide().trim().isEmpty()) {
            throw new IllegalStateException("리뷰 가이드는 필수입니다");
        }
        if (campaign.getReviewPlatform() == null) {
            throw new IllegalStateException("리뷰 플랫폼은 필수입니다");
        }
        if (campaign.getReviewFormat() == null) {
            throw new IllegalStateException("리뷰 형식은 필수입니다");
        }
        if (campaign.getApplicationStartDate() == null || campaign.getApplicationEndDate() == null) {
            throw new IllegalStateException("모집 일정은 필수입니다");
        }
        if (campaign.getReviewEndDate() == null) {
            throw new IllegalStateException("리뷰 마감일은 필수입니다");
        }
    }
}