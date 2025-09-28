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
@Table(name = "point_transactions")
@Getter
@Setter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class PointTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Long id;

    // 사용자 연관관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 거래 기본 정보
    @Column(name = "transaction_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;

    @Column(name = "amount", nullable = false)
    private Integer amount; // 포인트 금액

    @Column(name = "balance_before", nullable = false)
    private Integer balanceBefore; // 거래 전 잔액

    @Column(name = "balance_after", nullable = false)
    private Integer balanceAfter; // 거래 후 잔액

    // 연관 엔티티 참조 (선택적)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "related_campaign_id")
    private Campaign relatedCampaign; // 관련 캠페인

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "related_review_id")
    private Review relatedReview; // 관련 리뷰

    // 거래 상세 정보
    @Column(name = "description", nullable = false, length = 500)
    private String description; // 거래 설명

    @Column(name = "reference_id", length = 100)
    private String referenceId; // 외부 참조 ID (결제사 거래번호 등)

    // 결제 관련 정보 (충전 시)
    @Column(name = "payment_method")
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Column(name = "payment_key", length = 200)
    private String paymentKey; // 토스페이먼트 등의 결제 키

    @Column(name = "order_id", length = 100)
    private String orderId; // 주문 ID

    // 관리자 처리 정보 (관리자가 수동으로 처리한 경우)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "processed_by_admin_id")
    private User processedByAdmin;

    @Column(name = "admin_note", length = 1000)
    private String adminNote;

    // 거래 상태
    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private TransactionStatus status = TransactionStatus.COMPLETED;

    // 메타 정보
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "processed_at")
    private LocalDateTime processedAt; // 처리 완료 일시

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt; // 취소 일시

    // ENUM 정의
    public enum TransactionType {
        // 파트너 관련
        CHARGE("충전"),                    // 포인트 충전
        CAMPAIGN_PAYMENT("캠페인결제"),     // 캠페인 등록 시 포인트 차감
        CAMPAIGN_REFUND("캠페인환불"),      // 캠페인 취소 시 포인트 환불
        
        // 리뷰어 관련
        REVIEW_REWARD("리뷰보상"),          // 리뷰 승인 시 포인트 지급
        WITHDRAWAL("출금"),               // 포인트 출금 (차감)
        WITHDRAWAL_CANCEL("출금취소"),     // 출금 취소 (재적립)
        
        // 공통/기타
        ADMIN_ADJUSTMENT("관리자조정"),     // 관리자 수동 조정
        BONUS("보너스"),                  // 이벤트/보너스 포인트
        PENALTY("패널티"),                // 위반 시 차감
        REFUND("환불");                   // 일반 환불

        private final String description;

        TransactionType(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }

        public boolean isDebit() {
            return this == CAMPAIGN_PAYMENT || this == WITHDRAWAL || this == PENALTY;
        }

        public boolean isCredit() {
            return this == CHARGE || this == REVIEW_REWARD || this == CAMPAIGN_REFUND || 
                   this == WITHDRAWAL_CANCEL || this == ADMIN_ADJUSTMENT || this == BONUS || 
                   this == REFUND;
        }
    }

    public enum PaymentMethod {
        CREDIT_CARD("신용카드"),
        BANK_TRANSFER("계좌이체"),
        VIRTUAL_ACCOUNT("가상계좌"),
        MOBILE_PAYMENT("휴대폰결제"),
        KAKAO_PAY("카카오페이"),
        NAVER_PAY("네이버페이"),
        TOSS("토스"),
        ADMIN_MANUAL("관리자수동");

        private final String description;

        PaymentMethod(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    public enum TransactionStatus {
        PENDING("대기중"),          // 처리 대기
        PROCESSING("처리중"),       // 처리 중
        COMPLETED("완료"),          // 완료
        FAILED("실패"),            // 실패
        CANCELLED("취소"),          // 취소
        REFUNDED("환불완료");       // 환불 완료

        private final String description;

        TransactionStatus(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    // 생성자
    public PointTransaction(User user, TransactionType type, Integer amount, 
                           String description) {
        this.user = user;
        this.transactionType = type;
        this.amount = amount;
        this.description = description;
        this.balanceBefore = user.getPointBalance();
        
        // 잔액 계산
        if (type.isDebit()) {
            this.balanceAfter = this.balanceBefore - amount;
        } else {
            this.balanceAfter = this.balanceBefore + amount;
        }
        
        this.processedAt = LocalDateTime.now();
    }

    public PointTransaction(User user, TransactionType type, Integer amount, 
                           String description, Campaign campaign) {
        this(user, type, amount, description);
        this.relatedCampaign = campaign;
    }

    public PointTransaction(User user, TransactionType type, Integer amount, 
                           String description, Review review) {
        this(user, type, amount, description);
        this.relatedReview = review;
    }

    // 편의 메서드
    public boolean isDebit() {
        return this.transactionType.isDebit();
    }

    public boolean isCredit() {
        return this.transactionType.isCredit();
    }

    public boolean isCompleted() {
        return this.status == TransactionStatus.COMPLETED;
    }

    public boolean isPending() {
        return this.status == TransactionStatus.PENDING || 
               this.status == TransactionStatus.PROCESSING;
    }

    public boolean isFailed() {
        return this.status == TransactionStatus.FAILED ||
               this.status == TransactionStatus.CANCELLED;
    }

    public boolean isPaymentRelated() {
        return this.transactionType == TransactionType.CHARGE ||
               this.transactionType == TransactionType.WITHDRAWAL;
    }

    public boolean isCampaignRelated() {
        return this.transactionType == TransactionType.CAMPAIGN_PAYMENT ||
               this.transactionType == TransactionType.CAMPAIGN_REFUND;
    }

    public boolean isReviewRelated() {
        return this.transactionType == TransactionType.REVIEW_REWARD;
    }

    // 상태 변경 메서드
    public void markAsProcessing() {
        this.status = TransactionStatus.PROCESSING;
    }

    public void complete() {
        this.status = TransactionStatus.COMPLETED;
        this.processedAt = LocalDateTime.now();
    }

    public void fail() {
        this.status = TransactionStatus.FAILED;
        this.processedAt = LocalDateTime.now();
    }

    public void cancel() {
        this.status = TransactionStatus.CANCELLED;
        this.cancelledAt = LocalDateTime.now();
    }

    public void refund() {
        this.status = TransactionStatus.REFUNDED;
        this.processedAt = LocalDateTime.now();
    }

    // 관리자 처리 메서드
    public void processBy(User admin, String note) {
        this.processedByAdmin = admin;
        this.adminNote = note;
        this.processedAt = LocalDateTime.now();
    }

    // 결제 정보 설정
    public void setPaymentInfo(PaymentMethod method, String paymentKey, String orderId) {
        this.paymentMethod = method;
        this.paymentKey = paymentKey;
        this.orderId = orderId;
    }

    // 정적 팩토리 메서드들
    public static PointTransaction charge(User user, Integer amount, PaymentMethod method, 
                                        String paymentKey, String orderId) {
        PointTransaction transaction = new PointTransaction(user, TransactionType.CHARGE, 
                                                          amount, "포인트 충전");
        transaction.setPaymentInfo(method, paymentKey, orderId);
        return transaction;
    }

    public static PointTransaction campaignPayment(User partner, Campaign campaign, Integer amount) {
        return new PointTransaction(partner, TransactionType.CAMPAIGN_PAYMENT, amount,
                                  "캠페인 등록: " + campaign.getTitle(), campaign);
    }

    public static PointTransaction reviewReward(User reviewer, Review review, Integer amount) {
        return new PointTransaction(reviewer, TransactionType.REVIEW_REWARD, amount,
                                  "리뷰 보상: " + review.getTitle(), review);
    }

    public static PointTransaction withdrawal(User user, Integer amount) {
        return new PointTransaction(user, TransactionType.WITHDRAWAL, amount, "포인트 출금");
    }

    public static PointTransaction adminAdjustment(User user, Integer amount, String reason, User admin) {
        PointTransaction transaction = new PointTransaction(user, TransactionType.ADMIN_ADJUSTMENT, 
                                                          amount, "관리자 조정: " + reason);
        transaction.processBy(admin, reason);
        return transaction;
    }

    public static PointTransaction campaignRefund(User partner, Campaign campaign, Integer amount) {
        return new PointTransaction(partner, TransactionType.CAMPAIGN_REFUND, amount,
                                  "캠페인 환불: " + campaign.getTitle(), campaign);
    }

    // 표시용 메서드
    public String getDisplayAmount() {
        String prefix = isDebit() ? "-" : "+";
        return prefix + String.format("%,d P", amount);
    }

    public String getDisplayDescription() {
        StringBuilder sb = new StringBuilder();
        sb.append(transactionType.getDescription());
        
        if (relatedCampaign != null) {
            sb.append(" (").append(relatedCampaign.getTitle()).append(")");
        } else if (relatedReview != null) {
            sb.append(" (").append(relatedReview.getTitle()).append(")");
        }
        
        return sb.toString();
    }
}