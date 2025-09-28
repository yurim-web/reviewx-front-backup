package com.reviewx.dto.campaign;

import com.reviewx.entity.Campaign;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class CampaignListResponse {
    
    private Long id;
    private String title;
    private String shopName;
    private String visitAddress;
    private Integer recruitCount;
    private Integer appliedCount;
    private Integer selectedCount;
    private Integer rewardPoint;
    private LocalDateTime applicationStartDate;
    private LocalDateTime applicationEndDate;
    private LocalDateTime reviewEndDate;
    private String status;
    private LocalDateTime createdAt;
    
    // 파트너 정보
    private String partnerName;
    private String partnerBusinessName;
    
    // 계산된 필드
    private boolean canApply;
    private boolean isRecruitmentFull;
    private int remainingDays;
    private int remainingSlots;

    public static CampaignListResponse from(Campaign campaign) {
        CampaignListResponse response = new CampaignListResponse();
        
        response.setId(campaign.getId());
        response.setTitle(campaign.getTitle());
        response.setShopName(campaign.getShopName());
        response.setVisitAddress(campaign.getVisitAddress());
        response.setRecruitCount(campaign.getRecruitCount());
        response.setAppliedCount(campaign.getAppliedCount());
        response.setSelectedCount(campaign.getSelectedCount());
        response.setRewardPoint(campaign.getRewardPoint());
        response.setApplicationStartDate(campaign.getApplicationStartDate());
        response.setApplicationEndDate(campaign.getApplicationEndDate());
        response.setReviewEndDate(campaign.getReviewEndDate());
        response.setStatus(campaign.getStatus().getDescription());
        response.setCreatedAt(campaign.getCreatedAt());
        
        // 파트너 정보
        response.setPartnerName(campaign.getPartner().getName());
        response.setPartnerBusinessName(campaign.getPartner().getBusinessName());
        
        // 계산된 필드
        response.setCanApply(campaign.canApply());
        response.setRecruitmentFull(campaign.isRecruitmentFull());
        
        // 남은 일수 계산 (신청 마감일까지)
        if (campaign.getApplicationEndDate() != null) {
            long remainingDays = java.time.temporal.ChronoUnit.DAYS.between(
                LocalDateTime.now().toLocalDate(), 
                campaign.getApplicationEndDate().toLocalDate()
            );
            response.setRemainingDays((int) Math.max(0, remainingDays));
        }
        
        // 남은 모집 인원
        response.setRemainingSlots(Math.max(0, campaign.getRecruitCount() - campaign.getAppliedCount()));
        
        return response;
    }
}