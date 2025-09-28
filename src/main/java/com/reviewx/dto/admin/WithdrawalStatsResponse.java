package com.reviewx.dto.admin;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.Map;

@Data
@Builder
public class WithdrawalStatsResponse {

    // 상태별 통계
    private Map<String, StatusStat> statusStats;

    // 일별 통계 (최근 30일)
    private Map<LocalDate, DailyStat> dailyStats;

    // 전체 요약
    private Summary summary;

    @Data
    @Builder
    public static class StatusStat {
        private Long count;
        private Long requestedAmount;
        private Long withdrawalAmount;
        private String formattedRequestedAmount;
        private String formattedWithdrawalAmount;
    }

    @Data
    @Builder
    public static class DailyStat {
        private LocalDate date;
        private Long count;
        private Long requestedAmount;
        private Long withdrawalAmount;
        private String formattedRequestedAmount;
        private String formattedWithdrawalAmount;
    }

    @Data
    @Builder
    public static class Summary {
        private Long totalRequests;
        private Long totalRequestedAmount;
        private Long totalWithdrawnAmount;
        private Long totalFeeAmount;
        private String formattedTotalRequestedAmount;
        private String formattedTotalWithdrawnAmount;
        private String formattedTotalFeeAmount;
        private Double averageProcessingDays;

        // 처리 상태 요약
        private Long pendingCount;
        private Long approvedCount;
        private Long completedCount;
        private Long rejectedCount;

        // 지연 처리 관련
        private Long delayedCount; // 3일 이상 지연
        private Double approvalRate; // 승인률
        private Double rejectionRate; // 반려율
    }

    public static String formatAmount(Long amount) {
        return String.format("%,d원", amount != null ? amount : 0);
    }

    public static String formatPoint(Long points) {
        return String.format("%,d P", points != null ? points : 0);
    }
}