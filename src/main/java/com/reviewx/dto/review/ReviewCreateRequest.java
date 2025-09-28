package com.reviewx.dto.review;

import com.reviewx.entity.Review;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ReviewCreateRequest {
    
    private Long campaignId;
    private String title;
    private String content;
    private Integer rating;
    private String platformUrl;
    private String platformReviewId;
    private LocalDateTime postedAt;
    private String keywordsUsed;
    private String hashtags;
    private LocalDateTime visitedAt;
    private Integer visitDuration;
    private Integer companionCount;
    private Integer photoCount;
    private Integer videoCount;

    public Review toEntity() {
        Review review = new Review();
        
        review.setTitle(this.title);
        review.setContent(this.content);
        review.setRating(this.rating);
        review.setPlatformUrl(this.platformUrl);
        review.setPlatformReviewId(this.platformReviewId);
        review.setPostedAt(this.postedAt);
        review.setKeywordsUsed(this.keywordsUsed);
        review.setHashtags(this.hashtags);
        review.setVisitedAt(this.visitedAt);
        review.setVisitDuration(this.visitDuration);
        review.setCompanionCount(this.companionCount);
        review.setPhotoCount(this.photoCount);
        review.setVideoCount(this.videoCount);
        
        return review;
    }
}