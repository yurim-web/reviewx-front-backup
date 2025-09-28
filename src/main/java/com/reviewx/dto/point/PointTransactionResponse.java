package com.reviewx.dto.point;

import com.reviewx.entity.PointTransaction;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PointTransactionResponse {

    private Long id;
    private String transactionType;
    private String transactionTypeDescription;
    private Integer amount;
    private String displayAmount;
    private Integer balanceBefore;
    private Integer balanceAfter;
    private String description;
    private String displayDescription;
    private String status;
    private String statusDescription;
    private LocalDateTime createdAt;
    private LocalDateTime processedAt;

    // 연관 정보
    private String campaignTitle;
    private String reviewTitle;
    private String paymentMethod;
    private String adminNote;

    public static PointTransactionResponse from(PointTransaction transaction) {
        return PointTransactionResponse.builder()
            .id(transaction.getId())
            .transactionType(transaction.getTransactionType().name())
            .transactionTypeDescription(transaction.getTransactionType().getDescription())
            .amount(transaction.getAmount())
            .displayAmount(transaction.getDisplayAmount())
            .balanceBefore(transaction.getBalanceBefore())
            .balanceAfter(transaction.getBalanceAfter())
            .description(transaction.getDescription())
            .displayDescription(transaction.getDisplayDescription())
            .status(transaction.getStatus().name())
            .statusDescription(transaction.getStatus().getDescription())
            .createdAt(transaction.getCreatedAt())
            .processedAt(transaction.getProcessedAt())
            .campaignTitle(transaction.getRelatedCampaign() != null ?
                transaction.getRelatedCampaign().getTitle() : null)
            .reviewTitle(transaction.getRelatedReview() != null ?
                transaction.getRelatedReview().getTitle() : null)
            .paymentMethod(transaction.getPaymentMethod() != null ?
                transaction.getPaymentMethod().getDescription() : null)
            .adminNote(transaction.getAdminNote())
            .build();
    }
}