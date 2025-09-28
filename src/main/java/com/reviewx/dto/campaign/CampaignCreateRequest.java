package com.reviewx.dto.campaign;

import com.reviewx.entity.Campaign;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class CampaignCreateRequest {
    
    private String title;
    private String description;
    private String productName;
    private Integer productPrice;
    private String productUrl;
    private String shopName;
    private String shopUrl;
    private Integer recruitCount;
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

    public Campaign toEntity() {
        Campaign campaign = new Campaign();
        
        campaign.setTitle(this.title);
        campaign.setDescription(this.description);
        campaign.setProductName(this.productName);
        campaign.setProductPrice(this.productPrice);
        campaign.setProductUrl(this.productUrl);
        campaign.setShopName(this.shopName);
        campaign.setShopUrl(this.shopUrl);
        campaign.setRecruitCount(this.recruitCount);
        campaign.setRewardPoint(this.rewardPoint);
        campaign.setReviewGuide(this.reviewGuide);
        campaign.setKeywordRequirements(this.keywordRequirements);
        campaign.setApplicationStartDate(this.applicationStartDate);
        campaign.setApplicationEndDate(this.applicationEndDate);
        campaign.setSelectionDate(this.selectionDate);
        campaign.setReviewStartDate(this.reviewStartDate);
        campaign.setReviewEndDate(this.reviewEndDate);
        campaign.setVisitAddress(this.visitAddress);
        campaign.setVisitDetailAddress(this.visitDetailAddress);
        campaign.setVisitNote(this.visitNote);
        
        return campaign;
    }
}