package com.reviewx.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Long id;

    // 연관관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id", nullable = false)
    private Campaign campaign;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer; // 리뷰어

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "partner_id", nullable = false)
    private User partner; // 파트너 (캠페인 소유자)

    // 리뷰 기본 정보
    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "rating")
    private Integer rating; // 별점 (1-5)

    // 플랫폼 게시 정보
    @Column(name = "platform_url", length = 1000)
    private String platformUrl; // 게시된 리뷰 URL

    @Column(name = "platform_review_id", length = 100)
    private String platformReviewId; // 플랫폼 내 리뷰 ID

    @Column(name = "posted_at")
    private LocalDateTime postedAt; // 플랫폼 게시 일시

    // 키워드 및 해시태그
    @Column(name = "keywords_used", length = 1000)
    private String keywordsUsed; // 사용된 키워드 (콤마 구분)

    @Column(name = "hashtags", length = 500)
    private String hashtags; // 해시태그 (콤마 구분)

    // 배송형/구매평 전용 정보
    @Column(name = "purchase_confirmed", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean purchaseConfirmed = false; // 구매 확인 여부

    @Column(name = "order_number", length = 100)
    private String orderNumber; // 주문번호

    @Column(name = "purchase_amount")
    private Integer purchaseAmount; // 실제 구매금액

    @Column(name = "delivery_address", length = 255)
    private String deliveryAddress; // 배송주소

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt; // 배송완료 일시

    // 방문형/체험단 전용 정보
    @Column(name = "visit_confirmed", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean visitConfirmed = false; // 방문 확인 여부

    @Column(name = "visited_at")
    private LocalDateTime visitedAt; // 방문 일시

    @Column(name = "visit_duration")
    private Integer visitDuration; // 방문 시간 (분)

    @Column(name = "companion_count")
    private Integer companionCount; // 동행자 수

    // 성과 지표
    @Column(name = "view_count", columnDefinition = "INT DEFAULT 0")
    private Integer viewCount = 0; // 조회수

    @Column(name = "like_count", columnDefinition = "INT DEFAULT 0")
    private Integer likeCount = 0; // 좋아요 수

    @Column(name = "comment_count", columnDefinition = "INT DEFAULT 0")
    private Integer commentCount = 0; // 댓글 수

    @Column(name = "share_count", columnDefinition = "INT DEFAULT 0")
    private Integer shareCount = 0; // 공유 수

    // 리뷰 상태
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ReviewStatus status = ReviewStatus.DRAFT;

    // 검토 정보
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by_partner_id")
    private User reviewedByPartner; // 파트너 검토자 (1차 검토)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by_admin_id")
    private User reviewedByAdmin; // 관리자 검토자 (2차 검토)

    @Column(name = "partner_feedback", length = 1000)
    private String partnerFeedback; // 파트너 피드백

    @Column(name = "admin_feedback", length = 1000)
    private String adminFeedback; // 관리자 피드백

    @Column(name = "rejection_reason", length = 1000)
    private String rejectionReason; // 반려 사유

    @Column(name = "partner_reviewed_at")
    private LocalDateTime partnerReviewedAt; // 파트너 검토 완료 일시

    @Column(name = "admin_reviewed_at")
    private LocalDateTime adminReviewedAt; // 관리자 검토 완료 일시

    // 정산 정보
    @Column(name = "reward_point", nullable = false)
    private Integer rewardPoint; // 지급 예정 포인트

    @Column(name = "point_paid", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean pointPaid = false; // 포인트 지급 여부

    @Column(name = "point_paid_at")
    private LocalDateTime pointPaidAt; // 포인트 지급 일시

    // 품질 점수 (자동 계산)
    @Column(name = "quality_score")
    private Double qualityScore; // 품질 점수 (0-100)

    @Column(name = "text_length")
    private Integer textLength; // 텍스트 길이

    @Column(name = "photo_count")
    private Integer photoCount; // 사진 개수

    @Column(name = "video_count")
    private Integer videoCount; // 영상 개수

    // 추가 메타데이터
    @Column(name = "device_info", length = 100)
    private String deviceInfo; // 작성 디바이스 정보

    @Column(name = "ip_address", length = 45)
    private String ipAddress; // 작성 IP

    @Column(name = "user_agent", length = 500)
    private String userAgent; // User Agent

    // 메타 정보
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt; // 제출 일시

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    // ENUM 정의
    public enum ReviewStatus {
        DRAFT("작성중"),                    // 임시저장
        SUBMITTED("제출완료"),              // 제출 (파트너 검토 대기)
        PARTNER_APPROVED("파트너승인"),      // 파트너 1차 승인
        PARTNER_REJECTED("파트너반려"),      // 파트너 1차 반려
        ADMIN_REVIEW("관리자검토"),          // 관리자 2차 검토 중 (파트너 반려 시)
        APPROVED("최종승인"),               // 최종 승인 (포인트 지급)
        REJECTED("최종반려"),               // 최종 반려
        REVISION_REQUESTED("수정요청"),      // 수정 요청
        CANCELLED("취소");                 // 취소

        private final String description;

        ReviewStatus(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    // 편의 메서드
    public boolean isActive() {
        return this.deletedAt == null;
    }

    public boolean isEditable() {
        return this.status == ReviewStatus.DRAFT || 
               this.status == ReviewStatus.REVISION_REQUESTED;
    }

    public boolean isPendingPartnerReview() {
        return this.status == ReviewStatus.SUBMITTED;
    }

    public boolean isPendingAdminReview() {
        return this.status == ReviewStatus.ADMIN_REVIEW;
    }

    public boolean isApproved() {
        return this.status == ReviewStatus.APPROVED || 
               this.status == ReviewStatus.PARTNER_APPROVED;
    }

    public boolean isRejected() {
        return this.status == ReviewStatus.REJECTED || 
               this.status == ReviewStatus.PARTNER_REJECTED;
    }

    public boolean isCompleted() {
        return this.status == ReviewStatus.APPROVED && this.pointPaid;
    }

    public boolean requiresPurchaseVerification() {
        return this.campaign.requiresShipping();
    }

    public boolean requiresVisitVerification() {
        return this.campaign.requiresVisit();
    }

    // 상태 변경 메서드
    public void submit() {
        this.status = ReviewStatus.SUBMITTED;
        this.submittedAt = LocalDateTime.now();
        calculateQualityScore();
    }

    public void approveByPartner(User partner, String feedback) {
        this.status = ReviewStatus.PARTNER_APPROVED;
        this.reviewedByPartner = partner;
        this.partnerFeedback = feedback;
        this.partnerReviewedAt = LocalDateTime.now();
    }

    public void rejectByPartner(User partner, String reason) {
        this.status = ReviewStatus.PARTNER_REJECTED;
        this.reviewedByPartner = partner;
        this.rejectionReason = reason;
        this.partnerReviewedAt = LocalDateTime.now();
    }

    public void escalateToAdmin() {
        this.status = ReviewStatus.ADMIN_REVIEW;
    }

    public void approveByAdmin(User admin, String feedback) {
        this.status = ReviewStatus.APPROVED;
        this.reviewedByAdmin = admin;
        this.adminFeedback = feedback;
        this.adminReviewedAt = LocalDateTime.now();
    }

    public void rejectByAdmin(User admin, String reason) {
        this.status = ReviewStatus.REJECTED;
        this.reviewedByAdmin = admin;
        this.rejectionReason = reason;
        this.adminReviewedAt = LocalDateTime.now();
    }

    public void requestRevision(String reason) {
        this.status = ReviewStatus.REVISION_REQUESTED;
        this.rejectionReason = reason;
    }

    public void cancel() {
        this.status = ReviewStatus.CANCELLED;
    }

    // 포인트 지급 메서드
    public void payRewardPoint() {
        this.pointPaid = true;
        this.pointPaidAt = LocalDateTime.now();
    }

    // 품질 점수 계산 (기본 로직)
    public void calculateQualityScore() {
        double score = 0.0;
        
        // 텍스트 길이 점수 (40점 만점)
        if (this.textLength != null) {
            if (this.textLength >= 500) {
                score += 40;
            } else if (this.textLength >= 300) {
                score += 30;
            } else if (this.textLength >= 100) {
                score += 20;
            } else {
                score += 10;
            }
        }
        
        // 사진 개수 점수 (30점 만점)
        if (this.photoCount != null) {
            if (this.photoCount >= 5) {
                score += 30;
            } else if (this.photoCount >= 3) {
                score += 25;
            } else if (this.photoCount >= 1) {
                score += 20;
            }
        }
        
        // 별점 점수 (20점 만점)
        if (this.rating != null) {
            score += this.rating * 4; // 5점 기준으로 20점
        }
        
        // 키워드 사용 점수 (10점 만점)
        if (this.keywordsUsed != null && !this.keywordsUsed.trim().isEmpty()) {
            score += 10;
        }
        
        this.qualityScore = Math.min(score, 100.0);
    }

    // 통계 업데이트 메서드
    public void updatePerformanceMetrics(Integer views, Integer likes, Integer comments, Integer shares) {
        this.viewCount = views;
        this.likeCount = likes;
        this.commentCount = comments;
        this.shareCount = shares;
    }

    // 구매 확인 메서드
    public void confirmPurchase(String orderNumber, Integer amount, String deliveryAddress) {
        this.purchaseConfirmed = true;
        this.orderNumber = orderNumber;
        this.purchaseAmount = amount;
        this.deliveryAddress = deliveryAddress;
    }

    public void confirmDelivery() {
        this.deliveredAt = LocalDateTime.now();
    }

    // 방문 확인 메서드
    public void confirmVisit(Integer duration, Integer companions) {
        this.visitConfirmed = true;
        this.visitedAt = LocalDateTime.now();
        this.visitDuration = duration;
        this.companionCount = companions;
    }

    // 텍스트와 미디어 개수 업데이트
    public void updateContentMetrics(String content, Integer photoCount, Integer videoCount) {
        this.content = content;
        this.textLength = content != null ? content.length() : 0;
        this.photoCount = photoCount != null ? photoCount : 0;
        this.videoCount = videoCount != null ? videoCount : 0;
        calculateQualityScore();
    }

    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
        this.status = ReviewStatus.CANCELLED;
    }

    // 종합 성과 점수 계산
    public double getEngagementScore() {
        if (viewCount == 0) return 0.0;
        
        double engagement = 0.0;
        engagement += (likeCount * 2.0);     // 좋아요 가중치
        engagement += (commentCount * 3.0);   // 댓글 가중치 
        engagement += (shareCount * 5.0);     // 공유 가중치
        
        return (engagement / viewCount) * 100.0; // 백분율로 변환
    }
}