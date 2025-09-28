package com.reviewx.dto.point;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PointBalanceResponse {

    private Integer pointBalance;
    private String formattedPointBalance;
    private Integer pendingWithdrawal;
    private String formattedPendingWithdrawal;
    private Integer availableForWithdrawal;
    private String formattedAvailableForWithdrawal;

    // 통계
    private Integer totalEarned;
    private String formattedTotalEarned;
    private Integer totalWithdrawn;
    private String formattedTotalWithdrawn;

    public static PointBalanceResponse of(Integer pointBalance, Integer pendingWithdrawal,
                                        Integer totalEarned, Integer totalWithdrawn) {
        Integer availableForWithdrawal = pointBalance; // 출금 가능 금액 = 현재 잔액

        return PointBalanceResponse.builder()
            .pointBalance(pointBalance)
            .formattedPointBalance(formatPoint(pointBalance))
            .pendingWithdrawal(pendingWithdrawal)
            .formattedPendingWithdrawal(formatPoint(pendingWithdrawal))
            .availableForWithdrawal(availableForWithdrawal)
            .formattedAvailableForWithdrawal(formatPoint(availableForWithdrawal))
            .totalEarned(totalEarned)
            .formattedTotalEarned(formatPoint(totalEarned))
            .totalWithdrawn(totalWithdrawn)
            .formattedTotalWithdrawn(formatPoint(totalWithdrawn))
            .build();
    }

    private static String formatPoint(Integer points) {
        return String.format("%,d P", points != null ? points : 0);
    }
}