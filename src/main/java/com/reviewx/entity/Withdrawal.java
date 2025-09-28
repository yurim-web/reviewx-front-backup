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
@Table(name = "withdrawals")
@Getter
@Setter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Withdrawal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "withdrawal_id")
    private Long id;

    // 사용자 연관관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // 출금 신청자 (리뷰어)

    // 출금 기본 정보
    @Column(name = "withdrawal_number", unique = true, nullable = false, length = 50)
    private String withdrawalNumber; // 출금 요청 번호 (시스템 생성)

    @Column(name = "requested_amount", nullable = false)
    private Integer requestedAmount; // 신청 포인트

    @Column(name = "withdrawal_amount", nullable = false)
    private Integer withdrawalAmount; // 실제 출금 금액 (수수료 제외)

    @Column(name = "fee_amount", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer feeAmount = 0; // 출금 수수료

    // 수수료율 정보 (신청 시점 기준)
    @Column(name = "fee_rate", columnDefinition = "DECIMAL(5,2) DEFAULT 0.00")
    private Double feeRate = 0.0; // 수수료율 (%)

    @Column(name = "minimum_fee")
    private Integer minimumFee; // 최소 수수료

    @Column(name = "maximum_fee")
    private Integer maximumFee; // 최대 수수료

    // 계좌 정보 (신청 시점 기준으로 스냅샷 저장)
    @Column(name = "bank_name", nullable = false, length = 50)
    private String bankName;

    @Column(name = "account_number", nullable = false, length = 50)
    private String accountNumber;

    @Column(name = "account_holder", nullable = false, length = 50)
    private String accountHolder;

    // 출금 상태
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private WithdrawalStatus status = WithdrawalStatus.PENDING;

    // 관리자 처리 정보
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "processed_by_admin_id")
    private User processedByAdmin;

    @Column(name = "admin_note", length = 1000)
    private String adminNote;

    @Column(name = "rejection_reason", length = 1000)
    private String rejectionReason;

    // 은행 처리 정보
    @Column(name = "bank_transaction_id", length = 100)
    private String bankTransactionId; // 은행 거래 ID

    @Column(name = "bank_reference_number", length = 100)
    private String bankReferenceNumber; // 은행 참조번호

    @Column(name = "bank_response_code", length = 10)
    private String bankResponseCode; // 은행 응답 코드

    @Column(name = "bank_response_message", length = 500)
    private String bankResponseMessage; // 은행 응답 메시지

    // 연관 포인트 거래
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "point_transaction_id")
    private PointTransaction pointTransaction;

    // 일정 관련
    @Column(name = "requested_at", nullable = false)
    private LocalDateTime requestedAt; // 신청 일시

    @Column(name = "processed_at")
    private LocalDateTime processedAt; // 처리 완료 일시

    @Column(name = "completed_at")
    private LocalDateTime completedAt; // 입금 완료 일시

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt; // 취소 일시

    // 자동 처리 관련
    @Column(name = "auto_process_eligible", nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean autoProcessEligible = false; // 자동 처리 가능 여부

    @Column(name = "scheduled_process_date")
    private LocalDateTime scheduledProcessDate; // 예정 처리 일시

    // 검증 정보
    @Column(name = "verification_required", nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean verificationRequired = false; // 추가 검증 필요 여부

    @Column(name = "verification_type")
    @Enumerated(EnumType.STRING)
    private VerificationType verificationType;

    @Column(name = "verification_completed", nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean verificationCompleted = false;

    // 메타 정보
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ENUM 정의
    public enum WithdrawalStatus {
        PENDING("신청완료"),          // 출금 신청 완료 (처리 대기)
        UNDER_REVIEW("검토중"),       // 관리자 검토 중
        VERIFICATION_REQUIRED("검증필요"), // 추가 검증 필요
        APPROVED("승인"),            // 승인 (은행 처리 대기)
        PROCESSING("처리중"),        // 은행 처리 중
        COMPLETED("완료"),           // 출금 완료
        FAILED("실패"),              // 출금 실패
        CANCELLED("취소"),           // 사용자 취소
        REJECTED("반려");            // 관리자 반려

        private final String description;

        WithdrawalStatus(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }

        public boolean isCompletable() {
            return this == PENDING || this == UNDER_REVIEW || this == APPROVED;
        }

        public boolean isCancellable() {
            return this == PENDING || this == UNDER_REVIEW || this == VERIFICATION_REQUIRED;
        }

        public boolean isProcessable() {
            return this == APPROVED;
        }

        public boolean isFinal() {
            return this == COMPLETED || this == FAILED || this == CANCELLED || this == REJECTED;
        }
    }

    public enum VerificationType {
        NONE("없음"),
        PHONE_VERIFICATION("휴대폰인증"),
        EMAIL_VERIFICATION("이메일인증"),
        DOCUMENT_VERIFICATION("서류인증"),
        BANK_ACCOUNT_VERIFICATION("계좌인증"),
        ADMIN_MANUAL("관리자수동");

        private final String description;

        VerificationType(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    // 생성자
    public Withdrawal(User user, Integer requestedAmount) {
        this.user = user;
        this.requestedAmount = requestedAmount;
        this.requestedAt = LocalDateTime.now();
        
        // 사용자 계좌 정보 복사
        this.bankName = user.getBankName();
        this.accountNumber = user.getAccountNumber();
        this.accountHolder = user.getAccountHolder();
        
        // 출금 번호 생성
        this.withdrawalNumber = generateWithdrawalNumber();
        
        // 수수료 계산
        calculateFeeAndAmount();
    }

    // 편의 메서드
    public boolean isPending() {
        return this.status == WithdrawalStatus.PENDING;
    }

    public boolean isUnderReview() {
        return this.status == WithdrawalStatus.UNDER_REVIEW;
    }

    public boolean isApproved() {
        return this.status == WithdrawalStatus.APPROVED;
    }

    public boolean isCompleted() {
        return this.status == WithdrawalStatus.COMPLETED;
    }

    public boolean isFailed() {
        return this.status == WithdrawalStatus.FAILED;
    }

    public boolean isCancelled() {
        return this.status == WithdrawalStatus.CANCELLED;
    }

    public boolean isRejected() {
        return this.status == WithdrawalStatus.REJECTED;
    }

    public boolean isCancellable() {
        return this.status.isCancellable();
    }

    public boolean isProcessable() {
        return this.status.isProcessable();
    }

    public boolean isFinal() {
        return this.status.isFinal();
    }

    // 상태 변경 메서드
    public void submitForReview() {
        this.status = WithdrawalStatus.UNDER_REVIEW;
    }

    public void requireVerification(VerificationType type) {
        this.status = WithdrawalStatus.VERIFICATION_REQUIRED;
        this.verificationType = type;
        this.verificationRequired = true;
    }

    public void completeVerification() {
        this.verificationCompleted = true;
        if (this.status == WithdrawalStatus.VERIFICATION_REQUIRED) {
            this.status = WithdrawalStatus.UNDER_REVIEW;
        }
    }

    public void approve(User admin, String note) {
        this.status = WithdrawalStatus.APPROVED;
        this.processedByAdmin = admin;
        this.adminNote = note;
        this.processedAt = LocalDateTime.now();
    }

    public void reject(User admin, String reason) {
        this.status = WithdrawalStatus.REJECTED;
        this.processedByAdmin = admin;
        this.rejectionReason = reason;
        this.processedAt = LocalDateTime.now();
        this.cancelledAt = LocalDateTime.now();
    }

    public void startProcessing() {
        this.status = WithdrawalStatus.PROCESSING;
    }

    public void complete(String bankTransactionId, String bankReference) {
        this.status = WithdrawalStatus.COMPLETED;
        this.bankTransactionId = bankTransactionId;
        this.bankReferenceNumber = bankReference;
        this.completedAt = LocalDateTime.now();
    }

    public void fail(String responseCode, String responseMessage) {
        this.status = WithdrawalStatus.FAILED;
        this.bankResponseCode = responseCode;
        this.bankResponseMessage = responseMessage;
        this.processedAt = LocalDateTime.now();
    }

    public void cancel() {
        if (!isCancellable()) {
            throw new IllegalStateException("출금을 취소할 수 없는 상태입니다: " + this.status);
        }
        this.status = WithdrawalStatus.CANCELLED;
        this.cancelledAt = LocalDateTime.now();
    }

    // 수수료 계산
    private void calculateFeeAndAmount() {
        // 기본 수수료 정책 (설정에 따라 변경 가능)
        if (requestedAmount <= 10000) {
            this.feeRate = 0.0;
            this.feeAmount = 0;
        } else if (requestedAmount <= 100000) {
            this.feeRate = 3.0;
            this.minimumFee = 1000;
            this.maximumFee = 3000;
        } else {
            this.feeRate = 2.0;
            this.minimumFee = 3000;
            this.maximumFee = 10000;
        }

        if (feeRate > 0) {
            int calculatedFee = (int) (requestedAmount * feeRate / 100);
            this.feeAmount = Math.max(minimumFee != null ? minimumFee : 0,
                                    Math.min(maximumFee != null ? maximumFee : Integer.MAX_VALUE, 
                                           calculatedFee));
        }

        this.withdrawalAmount = this.requestedAmount - this.feeAmount;
    }

    // 출금 번호 생성
    private String generateWithdrawalNumber() {
        // WD + YYYYMMDD + 시퀀스 형태로 생성
        String dateStr = LocalDateTime.now().toString().substring(0, 10).replace("-", "");
        long timestamp = System.currentTimeMillis() % 10000; // 마지막 4자리
        return String.format("WD%s%04d", dateStr, timestamp);
    }

    // 자동 처리 가능 여부 검증
    public void checkAutoProcessEligibility() {
        this.autoProcessEligible = 
            this.requestedAmount <= 100000 &&  // 10만원 이하
            this.user.getApprovalRate() >= 90.0 &&  // 승인율 90% 이상
            this.user.getRejectionRate() <= 5.0 &&   // 반려율 5% 이하
            !this.verificationRequired;  // 추가 검증 불필요
            
        if (this.autoProcessEligible) {
            // 다음 영업일 자동 처리 예약
            this.scheduledProcessDate = calculateNextBusinessDay();
        }
    }

    // 다음 영업일 계산 (간단한 구현 - 주말 제외)
    private LocalDateTime calculateNextBusinessDay() {
        LocalDateTime next = LocalDateTime.now().plusDays(1);
        
        // 주말이면 월요일로 설정
        while (next.getDayOfWeek().getValue() >= 6) { // 토(6), 일(7)
            next = next.plusDays(1);
        }
        
        return next.withHour(9).withMinute(0).withSecond(0).withNano(0);
    }

    // 포인트 거래와 연결
    public void linkPointTransaction(PointTransaction transaction) {
        this.pointTransaction = transaction;
    }

    // 처리 소요 시간 계산
    public long getProcessingDaysFromRequest() {
        if (processedAt == null) {
            return java.time.Duration.between(requestedAt, LocalDateTime.now()).toDays();
        }
        return java.time.Duration.between(requestedAt, processedAt).toDays();
    }

    // 완료까지 소요 시간 계산
    public long getCompletionDaysFromRequest() {
        if (completedAt == null) {
            return -1;
        }
        return java.time.Duration.between(requestedAt, completedAt).toDays();
    }

    // 표시용 메서드들
    public String getFormattedRequestedAmount() {
        return String.format("%,d P", requestedAmount);
    }

    public String getFormattedWithdrawalAmount() {
        return String.format("%,d원", withdrawalAmount);
    }

    public String getFormattedFeeAmount() {
        return String.format("%,d원 (%.1f%%)", feeAmount, feeRate);
    }

    public String getStatusDisplayText() {
        return status.getDescription();
    }

    public String getBankAccountInfo() {
        return String.format("%s %s (%s)", bankName, accountNumber, accountHolder);
    }

    // 정적 팩토리 메서드
    public static Withdrawal createRequest(User user, Integer amount) {
        if (user.getPointBalance() < amount) {
            throw new IllegalArgumentException("보유 포인트가 부족합니다.");
        }
        
        if (amount < 5000) {
            throw new IllegalArgumentException("최소 출금 금액은 5,000P 입니다.");
        }
        
        if (user.getBankName() == null || user.getAccountNumber() == null || user.getAccountHolder() == null) {
            throw new IllegalArgumentException("계좌 정보를 먼저 등록해주세요.");
        }
        
        Withdrawal withdrawal = new Withdrawal(user, amount);
        withdrawal.checkAutoProcessEligibility();
        
        return withdrawal;
    }
}