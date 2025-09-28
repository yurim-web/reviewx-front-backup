package com.reviewx.dto.campaign;

import com.reviewx.entity.Campaign;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class CampaignDetailResponse {
    
    private Long id;
    private String title;
    private String description;
    private String campaignType;
    private String reviewPlatform;
    private String productName;
    private Integer productPrice;
    private String productUrl;
    private String shopName;
    private String shopUrl;
    private Integer recruitCount;
    private Integer appliedCount;
    private Integer selectedCount;
    private Integer rewardPoint;
    private String reviewGuide;
    private String keywordRequirements;
    private LocalDateTime applicationStartDate;
    private LocalDateTime applicationEndDate;
    private LocalDateTime selectionDate;
    private LocalDateTime reviewStartDate;
    private LocalDateTime reviewEndDate;
    private String visitAddress;
    private String visitDetailAddress;
    private String visitNote;
    private String status;
    private Integer totalBudget;
    private Integer platformFee;
    private Integer finalCost;
    private Integer completedReviews;
    private Integer approvedReviews;
    private Integer rejectedReviews;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // 파트너 정보
    private Long partnerId;
    private String partnerName;
    private String partnerBusinessName;
    
    // 계산된 필드
    private boolean canApply;
    private boolean isRecruitmentFull;
    private double completionRate;
    private double approvalRate;

    public static CampaignDetailResponse from(Campaign campaign) {
        CampaignDetailResponse response = new CampaignDetailResponse();
        
        response.setId(campaign.getId());
        response.setTitle(campaign.getTitle());
        response.setDescription(campaign.getDescription());
        response.setCampaignType(campaign.getCampaignType().getDescription());
        response.setReviewPlatform(campaign.getReviewPlatform().getDescription());
        response.setProductName(campaign.getProductName());
        response.setProductPrice(campaign.getProductPrice());
        response.setProductUrl(campaign.getProductUrl());
        response.setShopName(campaign.getShopName());
        response.setShopUrl(campaign.getShopUrl());
        response.setRecruitCount(campaign.getRecruitCount());
        response.setAppliedCount(campaign.getAppliedCount());
        response.setSelectedCount(campaign.getSelectedCount());
        response.setRewardPoint(campaign.getRewardPoint());
        response.setReviewGuide(campaign.getReviewGuide());
        response.setKeywordRequirements(campaign.getKeywordRequirements());
        response.setApplicationStartDate(campaign.getApplicationStartDate());
        response.setApplicationEndDate(campaign.getApplicationEndDate());
        response.setSelectionDate(campaign.getSelectionDate());
        response.setReviewStartDate(campaign.getReviewStartDate());
        response.setReviewEndDate(campaign.getReviewEndDate());
        response.setVisitAddress(campaign.getVisitAddress());
        response.setVisitDetailAddress(campaign.getVisitDetailAddress());
        response.setVisitNote(campaign.getVisitNote());
        response.setStatus(campaign.getStatus().getDescription());
        response.setTotalBudget(campaign.getTotalBudget());
        response.setPlatformFee(campaign.getPlatformFee());
        response.setFinalCost(campaign.getFinalCost());
        response.setCompletedReviews(campaign.getCompletedReviews());
        response.setApprovedReviews(campaign.getApprovedReviews());
        response.setRejectedReviews(campaign.getRejectedReviews());
        response.setCreatedAt(campaign.getCreatedAt());
        response.setUpdatedAt(campaign.getUpdatedAt());
        
        // 파트너 정보
        response.setPartnerId(campaign.getPartner().getId());
        response.setPartnerName(campaign.getPartner().getName());
        response.setPartnerBusinessName(campaign.getPartner().getBusinessName());
        
        // 계산된 필드
        response.setCanApply(campaign.canApply());
        response.setRecruitmentFull(campaign.isRecruitmentFull());
        response.setCompletionRate(campaign.getCompletionRate());
        response.setApprovalRate(campaign.getApprovalRate());
        
        return response;
    }
}