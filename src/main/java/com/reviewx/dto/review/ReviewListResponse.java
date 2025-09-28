package com.reviewx.dto.review;

import com.reviewx.entity.Review;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ReviewListResponse {
    
    private Long id;
    private Long campaignId;
    private String campaignTitle;
    private String shopName;
    private String reviewerNickname;
    private String partnerName;
    private String title;
    private Integer rating;
    private String status;
    private Integer rewardPoint;
    private Boolean pointPaid;
    private Double qualityScore;
    private Integer photoCount;
    private Integer textLength;
    private LocalDateTime createdAt;
    private LocalDateTime submittedAt;
    private LocalDateTime partnerReviewedAt;
    
    // 계산된 필드
    private boolean isPendingReview;
    private boolean isApproved;
    private boolean isRejected;
    private int daysSinceSubmission;

    public static ReviewListResponse from(Review review) {
        ReviewListResponse response = new ReviewListResponse();
        
        response.setId(review.getId());
        response.setCampaignId(review.getCampaign().getId());
        response.setCampaignTitle(review.getCampaign().getTitle());
        response.setShopName(review.getCampaign().getShopName());
        response.setReviewerNickname(review.getReviewer().getNickname());
        response.setPartnerName(review.getPartner().getName());
        response.setTitle(review.getTitle());
        response.setRating(review.getRating());
        response.setStatus(review.getStatus().getDescription());
        response.setRewardPoint(review.getRewardPoint());
        response.setPointPaid(review.getPointPaid());
        response.setQualityScore(review.getQualityScore());
        response.setPhotoCount(review.getPhotoCount());
        response.setTextLength(review.getTextLength());
        response.setCreatedAt(review.getCreatedAt());
        response.setSubmittedAt(review.getSubmittedAt());
        response.setPartnerReviewedAt(review.getPartnerReviewedAt());
        
        // 계산된 필드
        response.setPendingReview(review.isPendingPartnerReview());
        response.setApproved(review.isApproved());
        response.setRejected(review.isRejected());
        
        // 제출 후 경과 일수
        if (review.getSubmittedAt() != null) {
            long daysSince = java.time.temporal.ChronoUnit.DAYS.between(
                review.getSubmittedAt().toLocalDate(), 
                LocalDateTime.now().toLocalDate()
            );
            response.setDaysSinceSubmission((int) daysSince);
        }
        
        return response;
    }
}