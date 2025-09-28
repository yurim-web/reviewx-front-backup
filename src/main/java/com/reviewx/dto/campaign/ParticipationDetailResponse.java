package com.reviewx.dto.campaign;

import com.reviewx.entity.CampaignParticipation;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ParticipationDetailResponse {
    
    private Long id;
    private Long campaignId;
    private String campaignTitle;
    private Integer rewardPoint;
    private Long reviewerId;
    private String reviewerName;
    private String reviewerNickname;
    private String reviewerPhone;
    private String reviewerAddress;
    private String reviewerBlogUrl;
    private String reviewerInstagramUrl;
    private Integer reviewerFollowerCount;
    private String status;
    private String applicationMessage;
    private String applicationReason;
    private String selectionNote;
    private LocalDateTime selectedAt;
    private LocalDateTime createdAt;
    
    // 캠페인 정보
    private String shopName;
    private String visitAddress;
    private LocalDateTime applicationEndDate;
    private LocalDateTime reviewEndDate;

    public ParticipationDetailResponse(CampaignParticipation participation) {
        this.setValues(participation);
    }

    private void setValues(CampaignParticipation participation) {
        this.setId(participation.getId());
        this.setCampaignId(participation.getCampaign().getId());
        this.setCampaignTitle(participation.getCampaign().getTitle());
        this.setRewardPoint(participation.getCampaign().getRewardPoint());
        this.setReviewerId(participation.getReviewer().getId());
        this.setReviewerName(participation.getReviewerName());
        this.setReviewerNickname(participation.getReviewerNickname());
        this.setReviewerPhone(participation.getReviewerPhone());
        this.setReviewerAddress(participation.getReviewerAddress());
        this.setReviewerBlogUrl(participation.getReviewerBlogUrl());
        this.setReviewerInstagramUrl(participation.getReviewerInstagramUrl());
        this.setReviewerFollowerCount(participation.getReviewerFollowerCount());
        this.setStatus(participation.getStatus().getDescription());
        this.setApplicationMessage(participation.getApplicationMessage());
        this.setApplicationReason(participation.getApplicationReason());
        this.setSelectionNote(participation.getSelectionNote());
        this.setSelectedAt(participation.getSelectedAt());
        this.setCreatedAt(participation.getCreatedAt());

        // 캠페인 정보
        this.setShopName(participation.getCampaign().getShopName());
        this.setVisitAddress(participation.getCampaign().getVisitAddress());
        this.setApplicationEndDate(participation.getCampaign().getApplicationEndDate());
        this.setReviewEndDate(participation.getCampaign().getReviewEndDate());
    }

    public static ParticipationDetailResponse from(CampaignParticipation participation) {
        return new ParticipationDetailResponse(participation);
    }
}