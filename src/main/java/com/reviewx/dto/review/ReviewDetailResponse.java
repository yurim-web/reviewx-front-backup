package com.reviewx.dto.review;

import com.reviewx.entity.Review;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ReviewDetailResponse {
    
    private Long id;
    private Long campaignId;
    private String campaignTitle;
    private String shopName;
    private Long reviewerId;
    private String reviewerNickname;
    private Long partnerId;
    private String partnerName;
    private String title;
    private String content;
    private Integer rating;
    private String platformUrl;
    private String platformReviewId;
    private LocalDateTime postedAt;
    private String keywordsUsed;
    private String hashtags;
    private Boolean visitConfirmed;
    private LocalDateTime visitedAt;
    private Integer visitDuration;
    private Integer companionCount;
    private Integer viewCount;
    private Integer likeCount;
    private Integer commentCount;
    private Integer shareCount;
    private String status;
    private String partnerFeedback;
    private String adminFeedback;
    private String rejectionReason;
    private LocalDateTime partnerReviewedAt;
    private LocalDateTime adminReviewedAt;
    private Integer rewardPoint;
    private Boolean pointPaid;
    private LocalDateTime pointPaidAt;
    private Double qualityScore;
    private Integer textLength;
    private Integer photoCount;
    private Integer videoCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime submittedAt;
    
    // 계산된 필드
    private boolean isEditable;
    private boolean isPendingPartnerReview;
    private boolean isApproved;
    private boolean isRejected;
    private boolean isCompleted;
    private double engagementScore;

    public ReviewDetailResponse(Review review) {
        this.setValues(review);
    }

    private void setValues(Review review) {
        this.setId(review.getId());
        this.setCampaignId(review.getCampaign().getId());
        this.setCampaignTitle(review.getCampaign().getTitle());
        this.setShopName(review.getCampaign().getShopName());
        this.setReviewerId(review.getReviewer().getId());
        this.setReviewerNickname(review.getReviewer().getNickname());
        this.setPartnerId(review.getPartner().getId());
        this.setPartnerName(review.getPartner().getName());
        this.setTitle(review.getTitle());
        this.setContent(review.getContent());
        this.setRating(review.getRating());
        this.setPlatformUrl(review.getPlatformUrl());
        this.setPlatformReviewId(review.getPlatformReviewId());
        this.setPostedAt(review.getPostedAt());
        this.setKeywordsUsed(review.getKeywordsUsed());
        this.setHashtags(review.getHashtags());
        this.setVisitConfirmed(review.getVisitConfirmed());
        this.setVisitedAt(review.getVisitedAt());
        this.setVisitDuration(review.getVisitDuration());
        this.setCompanionCount(review.getCompanionCount());
        this.setViewCount(review.getViewCount());
        this.setLikeCount(review.getLikeCount());
        this.setCommentCount(review.getCommentCount());
        this.setShareCount(review.getShareCount());
        this.setStatus(review.getStatus().getDescription());
        this.setPartnerFeedback(review.getPartnerFeedback());
        this.setAdminFeedback(review.getAdminFeedback());
        this.setRejectionReason(review.getRejectionReason());
        this.setPartnerReviewedAt(review.getPartnerReviewedAt());
        this.setAdminReviewedAt(review.getAdminReviewedAt());
        this.setRewardPoint(review.getRewardPoint());
        this.setPointPaid(review.getPointPaid());
        this.setPointPaidAt(review.getPointPaidAt());
        this.setQualityScore(review.getQualityScore());
        this.setTextLength(review.getTextLength());
        this.setPhotoCount(review.getPhotoCount());
        this.setVideoCount(review.getVideoCount());
        this.setCreatedAt(review.getCreatedAt());
        this.setUpdatedAt(review.getUpdatedAt());
        this.setSubmittedAt(review.getSubmittedAt());

        // 계산된 필드
        this.setEditable(review.isEditable());
        this.setPendingPartnerReview(review.isPendingPartnerReview());
        this.setApproved(review.isApproved());
        this.setRejected(review.isRejected());
        this.setCompleted(review.isCompleted());
        this.setEngagementScore(review.getEngagementScore());
    }

    public static ReviewDetailResponse from(Review review) {
        return new ReviewDetailResponse(review);
    }
}