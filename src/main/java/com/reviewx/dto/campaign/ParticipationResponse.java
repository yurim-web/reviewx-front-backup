package com.reviewx.dto.campaign;

import com.reviewx.entity.CampaignParticipation;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ParticipationResponse {
    
    private Long id;
    private Long campaignId;
    private String campaignTitle;
    private Long reviewerId;
    private String reviewerNickname;
    private String status;
    private String applicationMessage;
    private String applicationReason;
    private LocalDateTime createdAt;

    public static ParticipationResponse from(CampaignParticipation participation) {
        ParticipationResponse response = new ParticipationResponse();
        
        response.setId(participation.getId());
        response.setCampaignId(participation.getCampaign().getId());
        response.setCampaignTitle(participation.getCampaign().getTitle());
        response.setReviewerId(participation.getReviewer().getId());
        response.setReviewerNickname(participation.getReviewerNickname());
        response.setStatus(participation.getStatus().getDescription());
        response.setApplicationMessage(participation.getApplicationMessage());
        response.setApplicationReason(participation.getApplicationReason());
        response.setCreatedAt(participation.getCreatedAt());
        
        return response;
    }
}