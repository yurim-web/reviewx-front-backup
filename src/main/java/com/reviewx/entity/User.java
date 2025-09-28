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
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(name = "email", unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "password", length = 255)
    private String password; // 소셜 로그인 사용자는 null 가능

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "nickname", unique = true, nullable = false, length = 30)
    private String nickname;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "birth_date")
    private LocalDateTime birthDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @Column(name = "address", length = 255)
    private String address;

    @Column(name = "detail_address", length = 255)
    private String detailAddress;

    @Column(name = "zip_code", length = 10)
    private String zipCode;

    // 소셜 로그인 관련 필드
    @Enumerated(EnumType.STRING)
    @Column(name = "provider")
    private LoginProvider provider; // LOCAL, KAKAO

    @Column(name = "provider_id", length = 100)
    private String providerId; // 카카오 ID 등

    @Column(name = "profile_image_url", length = 500)
    private String profileImageUrl;

    // 사용자 상태
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private UserStatus status;


    // 정산 관련
    @Column(name = "bank_name", length = 50)
    private String bankName;

    @Column(name = "account_number", length = 50)
    private String accountNumber;

    @Column(name = "account_holder", length = 50)
    private String accountHolder;

    // 포인트 관리 (역할별로 다른 의미)
    // 파트너: 충전한 포인트 (캠페인 등록 시 차감)
    // 리뷰어: 정산 가능한 포인트 (리뷰 승인 시 적립)
    @Column(name = "point_balance", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer pointBalance = 0;
    
    // 리뷰어 전용: 출금 신청 중인 포인트 (출금 대기 중)
    @Column(name = "pending_withdrawal", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer pendingWithdrawal = 0;

    // 통계
    @Column(name = "total_campaigns", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer totalCampaigns = 0;

    @Column(name = "completed_campaigns", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer completedCampaigns = 0;

    @Column(name = "rejected_count", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer rejectedCount = 0;
    
    // 리뷰어 전용: 활동 통계
    @Column(name = "approved_reviews", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer approvedReviews = 0;
    
    @Column(name = "total_earned_points", nullable = false, columnDefinition = "INT DEFAULT 0")  
    private Integer totalEarnedPoints = 0;
    
    // 파트너/리뷰어 공통: 채널/매장 정보
    @Column(name = "business_name", length = 100)
    private String businessName; // 매장명/업체명
    
    @Column(name = "business_number", length = 20)
    private String businessNumber; // 사업자번호
    
    @Column(name = "business_type", length = 50)
    private String businessType; // B2B, B2C, INDIVIDUAL 등
    
    // 리뷰어 전용: 채널 정보
    @Column(name = "blog_url", length = 500)
    private String blogUrl;
    
    @Column(name = "instagram_url", length = 500) 
    private String instagramUrl;
    
    @Column(name = "youtube_url", length = 500)
    private String youtubeUrl;
    
    @Column(name = "follower_count", columnDefinition = "INT DEFAULT 0")
    private Integer followerCount = 0; // 주요 채널 팔로워 수

    // 메타 정보
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    // 역할 연관관계 (ENUM 대신 테이블 참조로 변경)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    // ENUM 정의
    public enum Gender {
        MALE, FEMALE, OTHER
    }

    public enum LoginProvider {
        LOCAL, KAKAO
    }

    public enum UserStatus {
        ACTIVE,        // 활성
        INACTIVE,      // 비활성
        SUSPENDED,     // 정지
        BLACKLISTED,   // 블랙리스트
        PENDING        // 승인 대기
    }

    // 편의 메서드
    public boolean isActive() {
        return this.status == UserStatus.ACTIVE && this.deletedAt == null;
    }

    public boolean isSocialUser() {
        return this.provider != LoginProvider.LOCAL;
    }

    // 역할 관련 편의 메서드
    public boolean isReviewer() {
        return this.role != null && this.role.isReviewer();
    }

    public boolean isPartner() {
        return this.role != null && this.role.isPartner();
    }

    public boolean isAdmin() {
        return this.role != null && this.role.isAdmin();
    }

    public boolean isSuperAdmin() {
        return this.role != null && this.role.isSuperAdmin();
    }

    public boolean hasManagementAuthority() {
        return this.role != null && this.role.hasManagementAuthority();
    }

    public String getRoleCode() {
        return this.role != null ? this.role.getRoleCode() : null;
    }

    public String getRoleName() {
        return this.role != null ? this.role.getRoleName() : null;
    }

    // 포인트 관련 편의 메서드
    public void addPoint(Integer amount) {
        this.pointBalance += amount;
    }

    public boolean deductPoint(Integer amount) {
        if (this.pointBalance >= amount) {
            this.pointBalance -= amount;
            return true;
        }
        return false;
    }
    
    // 리뷰어 정산 관련 메서드
    public void earnRewardPoint(Integer amount) {
        this.pointBalance += amount;
        this.totalEarnedPoints += amount;
        this.approvedReviews += 1;
    }
    
    public boolean requestWithdrawal(Integer amount) {
        if (this.pointBalance >= amount) {
            this.pointBalance -= amount;
            this.pendingWithdrawal += amount;
            return true;
        }
        return false;
    }
    
    public void completeWithdrawal(Integer amount) {
        this.pendingWithdrawal -= amount;
    }
    
    public void cancelWithdrawal(Integer amount) {
        this.pointBalance += amount;
        this.pendingWithdrawal -= amount;
    }
    
    // 활동 통계 메서드
    public double getApprovalRate() {
        if (totalCampaigns == 0) return 0.0;
        return (double) completedCampaigns / totalCampaigns * 100.0;
    }
    
    public double getRejectionRate() {
        if (totalCampaigns == 0) return 0.0;
        return (double) rejectedCount / totalCampaigns * 100.0;
    }

    // 기타 편의 메서드
    public void updateLastLogin() {
        this.lastLoginAt = LocalDateTime.now();
    }

    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
        this.status = UserStatus.INACTIVE;
    }
}