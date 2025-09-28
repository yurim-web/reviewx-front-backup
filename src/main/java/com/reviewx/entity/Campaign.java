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
@Table(name = "campaigns")
@Getter
@Setter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Campaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "campaign_id")
    private Long id;

    // 파트너 연관관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "partner_id", nullable = false)
    private User partner; // 파트너 (캠페인 등록자)

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    // 캠페인 유형
    @Enumerated(EnumType.STRING)
    @Column(name = "campaign_type", nullable = false)
    private CampaignType campaignType;

    // 리뷰 작성 플랫폼
    @Enumerated(EnumType.STRING)
    @Column(name = "review_platform", nullable = false)
    private ReviewPlatform reviewPlatform;

    // 상품/서비스 정보
    @Column(name = "product_name", nullable = false, length = 200)
    private String productName;

    @Column(name = "product_price")
    private Integer productPrice;

    @Column(name = "product_url", length = 1000)
    private String productUrl; // 네이버쇼핑 URL 등

    @Column(name = "shop_name", length = 100)
    private String shopName;

    @Column(name = "shop_url", length = 1000)
    private String shopUrl; // 네이버플레이스 URL 등

    // 캠페인 모집 설정
    @Column(name = "recruit_count", nullable = false)
    private Integer recruitCount; // 모집 인원

    @Column(name = "applied_count", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer appliedCount = 0; // 신청 인원

    @Column(name = "selected_count", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer selectedCount = 0; // 선발 인원

    // 리뷰어 리워드
    @Column(name = "reward_point", nullable = false)
    private Integer rewardPoint; // 리뷰어에게 지급할 포인트

    // 미션 가이드 (구매평, 기자단 등에서 사용)
    @Column(name = "review_guide", columnDefinition = "TEXT")
    private String reviewGuide; // 리뷰 작성 가이드

    @Column(name = "keyword_requirements", length = 500)
    private String keywordRequirements; // 포함해야 할 키워드

    // 구매평 전용 설정
    @Enumerated(EnumType.STRING)
    @Column(name = "review_format") 
    private ReviewFormat reviewFormat; // TEXT, PHOTO (구매평만 해당)

    @Column(name = "min_text_length")
    private Integer minTextLength; // 최소 텍스트 길이

    @Column(name = "min_photo_count")
    private Integer minPhotoCount; // 최소 사진 개수

    // 일정 관리
    @Column(name = "application_start_date", nullable = false)
    private LocalDateTime applicationStartDate; // 신청 시작일

    @Column(name = "application_end_date", nullable = false)
    private LocalDateTime applicationEndDate; // 신청 마감일

    @Column(name = "selection_date")
    private LocalDateTime selectionDate; // 선발 발표일

    @Column(name = "review_start_date")
    private LocalDateTime reviewStartDate; // 리뷰 시작일

    @Column(name = "review_end_date", nullable = false)
    private LocalDateTime reviewEndDate; // 리뷰 마감일

    // 배송 정보 (배송형, 구매평 전용)
    @Column(name = "shipping_required", nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean shippingRequired = false;

    @Column(name = "shipping_fee")
    private Integer shippingFee;

    @Column(name = "shipping_note", length = 500)
    private String shippingNote;

    // 방문 정보 (체험단, 방문형 전용)
    @Column(name = "visit_address", length = 255)
    private String visitAddress;

    @Column(name = "visit_detail_address", length = 255)
    private String visitDetailAddress;

    @Column(name = "visit_note", length = 500)
    private String visitNote;

    // 기자단 전용
    @Column(name = "content_format")
    private String contentFormat; // SNS, BLOG, VIDEO 등

    @Column(name = "posting_requirements", columnDefinition = "TEXT")
    private String postingRequirements; // 게시 요구사항

    // 캠페인 상태
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private CampaignStatus status = CampaignStatus.DRAFT;

    // 비용 및 정산
    @Column(name = "total_budget", nullable = false)
    private Integer totalBudget; // 총 예산 (리워드 포인트 * 모집인원)

    @Column(name = "platform_fee")
    private Integer platformFee; // 플랫폼 수수료

    @Column(name = "final_cost")
    private Integer finalCost; // 최종 비용 (총 예산 + 수수료)

    // 관리자 검토
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_admin_id")
    private User reviewerAdmin; // 검토한 관리자

    @Column(name = "admin_note", length = 500)
    private String adminNote; // 관리자 검토 메모

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt; // 검토 완료일

    // 성과 통계
    @Column(name = "completed_reviews", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer completedReviews = 0; // 완료된 리뷰 수

    @Column(name = "approved_reviews", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer approvedReviews = 0; // 승인된 리뷰 수

    @Column(name = "rejected_reviews", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer rejectedReviews = 0; // 반려된 리뷰 수

    // 메타 정보
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    // ENUM 정의
    public enum CampaignType {
        DELIVERY("배송형"),           // 네이버쇼핑 구매 → 배송 → 리뷰
        PURCHASE_REVIEW("구매평"),    // 배송형 + 리뷰 형식 선택
        EXPERIENCE("체험단"),         // 매장 방문 → 네이버플레이스 리뷰
        VISIT("방문형"),              // 플랫폼 자료로 방문 리뷰
        JOURNALIST("기자단");         // 가이드 원고 기반 SNS/블로그

        private final String description;

        CampaignType(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    public enum ReviewPlatform {
        NAVER_SHOPPING("네이버쇼핑"),
        NAVER_PLACE("네이버플레이스"), 
        INSTAGRAM("인스타그램"),
        BLOG("블로그"),
        YOUTUBE("유튜브"),
        COUPANG("쿠팡"),
        GMARKET("지마켓"),
        OTHER("기타");

        private final String description;

        ReviewPlatform(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    public enum ReviewFormat {
        TEXT("텍스트"),
        PHOTO("포토"),
        TEXT_AND_PHOTO("텍스트+포토");

        private final String description;

        ReviewFormat(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    public enum CampaignStatus {
        DRAFT("작성중"),              // 임시저장
        PENDING_REVIEW("검토대기"),    // 관리자 검토 대기
        APPROVED("승인"),             // 승인됨 (모집 시작 가능)
        RECRUITING("모집중"),         // 모집 중
        SELECTION_IN_PROGRESS("선발중"), // 선발 진행 중
        IN_PROGRESS("진행중"),        // 캠페인 진행 중
        REVIEW_PERIOD("리뷰기간"),    // 리뷰 작성 기간
        COMPLETED("완료"),            // 캠페인 완료
        CANCELLED("취소"),            // 취소됨
        REJECTED("반려");             // 관리자 반려

        private final String description;

        CampaignStatus(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    // 편의 메서드
    public boolean isActive() {
        return this.deletedAt == null && 
               (this.status == CampaignStatus.RECRUITING || 
                this.status == CampaignStatus.IN_PROGRESS ||
                this.status == CampaignStatus.REVIEW_PERIOD);
    }

    public boolean canApply() {
        return this.status == CampaignStatus.RECRUITING && 
               this.appliedCount < this.recruitCount &&
               LocalDateTime.now().isBefore(this.applicationEndDate);
    }

    public boolean isRecruitmentFull() {
        return this.appliedCount >= this.recruitCount;
    }

    public boolean isSelectionComplete() {
        return this.selectedCount > 0;
    }

    public double getCompletionRate() {
        if (selectedCount == 0) return 0.0;
        return (double) completedReviews / selectedCount * 100.0;
    }

    public double getApprovalRate() {
        if (completedReviews == 0) return 0.0;
        return (double) approvedReviews / completedReviews * 100.0;
    }

    // 캠페인 타입별 검증 메서드
    public boolean requiresShipping() {
        return this.campaignType == CampaignType.DELIVERY || 
               this.campaignType == CampaignType.PURCHASE_REVIEW;
    }

    public boolean requiresVisit() {
        return this.campaignType == CampaignType.EXPERIENCE || 
               this.campaignType == CampaignType.VISIT;
    }

    public boolean isReviewFormatApplicable() {
        return this.campaignType == CampaignType.PURCHASE_REVIEW;
    }

    public boolean canBeCancelled() {
        return this.status == CampaignStatus.DRAFT ||
               this.status == CampaignStatus.PENDING_REVIEW ||
               this.status == CampaignStatus.RECRUITING ||
               this.status == CampaignStatus.SELECTION_IN_PROGRESS;
    }

    // 상태 변경 메서드
    public void submitForReview() {
        this.status = CampaignStatus.PENDING_REVIEW;
    }

    public void approve(User admin) {
        this.status = CampaignStatus.APPROVED;
        this.reviewerAdmin = admin;
        this.reviewedAt = LocalDateTime.now();
    }

    public void reject(User admin, String reason) {
        this.status = CampaignStatus.REJECTED;
        this.reviewerAdmin = admin;
        this.adminNote = reason;
        this.reviewedAt = LocalDateTime.now();
    }

    public void startRecruitment() {
        this.status = CampaignStatus.RECRUITING;
    }

    public void complete() {
        this.status = CampaignStatus.COMPLETED;
    }

    public void cancel() {
        this.status = CampaignStatus.CANCELLED;
    }

    // 신청/선발 관련 메서드
    public void incrementAppliedCount() {
        this.appliedCount++;
    }

    public void decrementAppliedCount() {
        if (this.appliedCount > 0) {
            this.appliedCount--;
        }
    }

    public void incrementSelectedCount() {
        this.selectedCount++;
    }

    public void decrementSelectedCount() {
        if (this.selectedCount > 0) {
            this.selectedCount--;
        }
    }

    // 리뷰 통계 업데이트 메서드
    public void incrementCompletedReviews() {
        this.completedReviews++;
    }

    public void incrementApprovedReviews() {
        this.approvedReviews++;
    }

    public void incrementRejectedReviews() {
        this.rejectedReviews++;
    }

    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
        this.status = CampaignStatus.CANCELLED;
    }
}