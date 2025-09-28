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
@Table(name = "campaign_participations")
@Getter
@Setter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class CampaignParticipation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "participation_id")
    private Long id;

    // 연관관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id", nullable = false)
    private Campaign campaign;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;

    // 참여 상태
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ParticipationStatus status = ParticipationStatus.APPLIED;

    // 신청 정보
    @Column(name = "application_message", length = 1000)
    private String applicationMessage; // 신청 메시지

    @Column(name = "application_reason", length = 1000)
    private String applicationReason; // 신청 사유

    // 선발/반려 정보
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by_partner_id")
    private User reviewedByPartner; // 선발/반려를 결정한 파트너

    @Column(name = "selection_note", length = 500)
    private String selectionNote; // 선발/반려 사유

    @Column(name = "selected_at")
    private LocalDateTime selectedAt; // 선발/반려 결정 일시

    // 참여자 정보 스냅샷 (선발 당시의 정보 보존)
    @Column(name = "reviewer_name", nullable = false, length = 50)
    private String reviewerName;

    @Column(name = "reviewer_nickname", nullable = false, length = 30)
    private String reviewerNickname;

    @Column(name = "reviewer_phone", length = 20)
    private String reviewerPhone;

    @Column(name = "reviewer_address", length = 255)
    private String reviewerAddress;

    @Column(name = "reviewer_blog_url", length = 500)
    private String reviewerBlogUrl;

    @Column(name = "reviewer_instagram_url", length = 500)
    private String reviewerInstagramUrl;

    @Column(name = "reviewer_follower_count", columnDefinition = "INT DEFAULT 0")
    private Integer reviewerFollowerCount = 0;

    // 메타 정보
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    // ENUM 정의
    public enum ParticipationStatus {
        APPLIED("신청완료"),         // 신청 완료
        SELECTED("선발됨"),         // 선발됨 (리뷰 작성 가능)
        REJECTED("선발탈락"),       // 선발에서 탈락
        CANCELLED("취소됨"),        // 신청 취소 (리뷰어가 취소)
        COMPLETED("참여완료");       // 리뷰까지 완료

        private final String description;

        ParticipationStatus(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    // 생성자
    public CampaignParticipation(Campaign campaign, User reviewer) {
        this.campaign = campaign;
        this.reviewer = reviewer;
        this.reviewerName = reviewer.getName();
        this.reviewerNickname = reviewer.getNickname();
        this.reviewerPhone = reviewer.getPhone();
        this.reviewerAddress = reviewer.getAddress();
        this.reviewerBlogUrl = reviewer.getBlogUrl();
        this.reviewerInstagramUrl = reviewer.getInstagramUrl();
        this.reviewerFollowerCount = reviewer.getFollowerCount();
    }

    // 편의 메서드
    public boolean isActive() {
        return this.cancelledAt == null;
    }

    public boolean isPending() {
        return this.status == ParticipationStatus.APPLIED;
    }

    public boolean isSelected() {
        return this.status == ParticipationStatus.SELECTED;
    }

    public boolean isRejected() {
        return this.status == ParticipationStatus.REJECTED;
    }

    public boolean isCancelled() {
        return this.status == ParticipationStatus.CANCELLED;
    }

    public boolean isCompleted() {
        return this.status == ParticipationStatus.COMPLETED;
    }

    public boolean canBeSelected() {
        return this.status == ParticipationStatus.APPLIED && this.cancelledAt == null;
    }

    public boolean canBeRejected() {
        return this.status == ParticipationStatus.APPLIED && this.cancelledAt == null;
    }

    public boolean canBeCancelled() {
        return this.status == ParticipationStatus.APPLIED || this.status == ParticipationStatus.SELECTED;
    }

    // 상태 변경 메서드
    public void select(User partner, String note) {
        this.status = ParticipationStatus.SELECTED;
        this.reviewedByPartner = partner;
        this.selectionNote = note;
        this.selectedAt = LocalDateTime.now();
    }

    public void reject(User partner, String reason) {
        this.status = ParticipationStatus.REJECTED;
        this.reviewedByPartner = partner;
        this.selectionNote = reason;
        this.selectedAt = LocalDateTime.now();
    }

    public void cancel() {
        this.status = ParticipationStatus.CANCELLED;
        this.cancelledAt = LocalDateTime.now();
    }

    public void complete() {
        this.status = ParticipationStatus.COMPLETED;
    }

    // 체험단 캠페인 전용 검증 메서드
    public boolean isExperienceCampaign() {
        return this.campaign.getCampaignType() == Campaign.CampaignType.EXPERIENCE;
    }

    public boolean isEligibleForReview() {
        return this.status == ParticipationStatus.SELECTED && 
               this.campaign.getStatus() == Campaign.CampaignStatus.REVIEW_PERIOD;
    }
}