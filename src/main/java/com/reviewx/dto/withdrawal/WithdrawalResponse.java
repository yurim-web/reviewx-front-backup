package com.reviewx.dto.withdrawal;

import com.reviewx.entity.Withdrawal;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class WithdrawalResponse {

    private Long id;
    private String withdrawalNumber;
    private Integer requestedAmount;
    private String formattedRequestedAmount;
    private Integer withdrawalAmount;
    private String formattedWithdrawalAmount;
    private Integer feeAmount;
    private String formattedFeeAmount;
    private Double feeRate;

    // 계좌 정보
    private String bankName;
    private String accountNumber;
    private String accountHolder;
    private String bankAccountInfo;

    // 상태
    private String status;
    private String statusDescription;

    // 일시
    private LocalDateTime requestedAt;
    private LocalDateTime processedAt;
    private LocalDateTime completedAt;

    // 관리자 처리 정보
    private String adminNote;
    private String rejectionReason;

    // 은행 처리 정보
    private String bankTransactionId;
    private String bankReferenceNumber;

    // 처리 기간
    private Long processingDaysFromRequest;
    private Long completionDaysFromRequest;

    public static WithdrawalResponse from(Withdrawal withdrawal) {
        return WithdrawalResponse.builder()
            .id(withdrawal.getId())
            .withdrawalNumber(withdrawal.getWithdrawalNumber())
            .requestedAmount(withdrawal.getRequestedAmount())
            .formattedRequestedAmount(withdrawal.getFormattedRequestedAmount())
            .withdrawalAmount(withdrawal.getWithdrawalAmount())
            .formattedWithdrawalAmount(withdrawal.getFormattedWithdrawalAmount())
            .feeAmount(withdrawal.getFeeAmount())
            .formattedFeeAmount(withdrawal.getFormattedFeeAmount())
            .feeRate(withdrawal.getFeeRate())
            .bankName(withdrawal.getBankName())
            .accountNumber(withdrawal.getAccountNumber())
            .accountHolder(withdrawal.getAccountHolder())
            .bankAccountInfo(withdrawal.getBankAccountInfo())
            .status(withdrawal.getStatus().name())
            .statusDescription(withdrawal.getStatusDisplayText())
            .requestedAt(withdrawal.getRequestedAt())
            .processedAt(withdrawal.getProcessedAt())
            .completedAt(withdrawal.getCompletedAt())
            .adminNote(withdrawal.getAdminNote())
            .rejectionReason(withdrawal.getRejectionReason())
            .bankTransactionId(withdrawal.getBankTransactionId())
            .bankReferenceNumber(withdrawal.getBankReferenceNumber())
            .processingDaysFromRequest(withdrawal.getProcessingDaysFromRequest())
            .completionDaysFromRequest(withdrawal.getCompletionDaysFromRequest())
            .build();
    }
}