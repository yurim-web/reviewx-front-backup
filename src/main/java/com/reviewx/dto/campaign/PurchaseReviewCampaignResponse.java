package com.reviewx.dto.campaign;

import com.reviewx.entity.Campaign;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 구매평 캠페인 응답 DTO
 */
@Data
@NoArgsConstructor
public class PurchaseReviewCampaignResponse {

    private Long id;
    private String title;
    private String description;

    // 제품 정보
    private String productName;
    private Integer productPrice;
    private String productUrl;
    private String shopName;
    private String shopUrl;

    // 리뷰 설정
    private Campaign.ReviewPlatform reviewPlatform;
    private String reviewPlatformDescription;
    private Campaign.ReviewFormat reviewFormat;
    private String reviewFormatDescription;
    private Integer minTextLength;
    private Integer minPhotoCount;

    // 모집 정보
    private Integer recruitCount;
    private Integer appliedCount;
    private Integer selectedCount;
    private Integer rewardPoint;

    // 가이드
    private String reviewGuide;
    private String keywordRequirements;

    // 일정
    private LocalDateTime applicationStartDate;
    private LocalDateTime applicationEndDate;
    private LocalDateTime selectionDate;
    private LocalDateTime reviewStartDate;
    private LocalDateTime reviewEndDate;

    // 배송 정보
    private Boolean shippingRequired;
    private Integer shippingFee;
    private String shippingNote;

    // 상태 정보
    private Campaign.CampaignStatus status;
    private String statusDescription;

    // 예산 정보
    private Integer totalBudget;
    private Integer platformFee;
    private Integer finalCost;

    // 통계 정보
    private Integer completedReviews;
    private Integer approvedReviews;
    private Integer rejectedReviews;
    private Double completionRate;
    private Double approvalRate;

    // 파트너 정보
    private String partnerName;
    private String partnerEmail;

    // 관리자 검토 정보
    private String reviewerAdminName;
    private String adminNote;
    private LocalDateTime reviewedAt;

    // 메타 정보
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 상태 확인 메서드
    private Boolean canApply;
    private Boolean isRecruitmentFull;
    private Boolean isActive;

    public PurchaseReviewCampaignResponse(Campaign campaign) {
        this.id = campaign.getId();
        this.title = campaign.getTitle();
        this.description = campaign.getDescription();

        // 제품 정보
        this.productName = campaign.getProductName();
        this.productPrice = campaign.getProductPrice();
        this.productUrl = campaign.getProductUrl();
        this.shopName = campaign.getShopName();
        this.shopUrl = campaign.getShopUrl();

        // 리뷰 설정
        this.reviewPlatform = campaign.getReviewPlatform();
        this.reviewPlatformDescription = campaign.getReviewPlatform() != null ?
            campaign.getReviewPlatform().getDescription() : null;
        this.reviewFormat = campaign.getReviewFormat();
        this.reviewFormatDescription = campaign.getReviewFormat() != null ?
            campaign.getReviewFormat().getDescription() : null;
        this.minTextLength = campaign.getMinTextLength();
        this.minPhotoCount = campaign.getMinPhotoCount();

        // 모집 정보
        this.recruitCount = campaign.getRecruitCount();
        this.appliedCount = campaign.getAppliedCount();
        this.selectedCount = campaign.getSelectedCount();
        this.rewardPoint = campaign.getRewardPoint();

        // 가이드
        this.reviewGuide = campaign.getReviewGuide();
        this.keywordRequirements = campaign.getKeywordRequirements();

        // 일정
        this.applicationStartDate = campaign.getApplicationStartDate();
        this.applicationEndDate = campaign.getApplicationEndDate();
        this.selectionDate = campaign.getSelectionDate();
        this.reviewStartDate = campaign.getReviewStartDate();
        this.reviewEndDate = campaign.getReviewEndDate();

        // 배송 정보
        this.shippingRequired = campaign.getShippingRequired();
        this.shippingFee = campaign.getShippingFee();
        this.shippingNote = campaign.getShippingNote();

        // 상태 정보
        this.status = campaign.getStatus();
        this.statusDescription = campaign.getStatus().getDescription();

        // 예산 정보
        this.totalBudget = campaign.getTotalBudget();
        this.platformFee = campaign.getPlatformFee();
        this.finalCost = campaign.getFinalCost();

        // 통계 정보
        this.completedReviews = campaign.getCompletedReviews();
        this.approvedReviews = campaign.getApprovedReviews();
        this.rejectedReviews = campaign.getRejectedReviews();
        this.completionRate = campaign.getCompletionRate();
        this.approvalRate = campaign.getApprovalRate();

        // 파트너 정보
        if (campaign.getPartner() != null) {
            this.partnerName = campaign.getPartner().getName();
            this.partnerEmail = campaign.getPartner().getEmail();
        }

        // 관리자 검토 정보
        if (campaign.getReviewerAdmin() != null) {
            this.reviewerAdminName = campaign.getReviewerAdmin().getName();
        }
        this.adminNote = campaign.getAdminNote();
        this.reviewedAt = campaign.getReviewedAt();

        // 메타 정보
        this.createdAt = campaign.getCreatedAt();
        this.updatedAt = campaign.getUpdatedAt();

        // 상태 확인
        this.canApply = campaign.canApply();
        this.isRecruitmentFull = campaign.isRecruitmentFull();
        this.isActive = campaign.isActive();
    }

    /**
     * 목록용 간소화된 생성자
     */
    public static PurchaseReviewCampaignResponse forList(Campaign campaign) {
        PurchaseReviewCampaignResponse response = new PurchaseReviewCampaignResponse();

        response.id = campaign.getId();
        response.title = campaign.getTitle();
        response.productName = campaign.getProductName();
        response.productPrice = campaign.getProductPrice();
        response.shopName = campaign.getShopName();
        response.reviewPlatform = campaign.getReviewPlatform();
        response.reviewPlatformDescription = campaign.getReviewPlatform() != null ?
            campaign.getReviewPlatform().getDescription() : null;
        response.reviewFormat = campaign.getReviewFormat();
        response.reviewFormatDescription = campaign.getReviewFormat() != null ?
            campaign.getReviewFormat().getDescription() : null;
        response.recruitCount = campaign.getRecruitCount();
        response.appliedCount = campaign.getAppliedCount();
        response.rewardPoint = campaign.getRewardPoint();
        response.applicationStartDate = campaign.getApplicationStartDate();
        response.applicationEndDate = campaign.getApplicationEndDate();
        response.reviewEndDate = campaign.getReviewEndDate();
        response.status = campaign.getStatus();
        response.statusDescription = campaign.getStatus().getDescription();
        response.completionRate = campaign.getCompletionRate();
        response.canApply = campaign.canApply();
        response.isRecruitmentFull = campaign.isRecruitmentFull();
        response.isActive = campaign.isActive();
        response.createdAt = campaign.getCreatedAt();

        if (campaign.getPartner() != null) {
            response.partnerName = campaign.getPartner().getName();
        }

        return response;
    }
}