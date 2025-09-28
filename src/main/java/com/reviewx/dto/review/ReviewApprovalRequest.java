package com.reviewx.dto.review;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 리뷰 승인/반려 요청 DTO
 */
@Data
@NoArgsConstructor
public class ReviewApprovalRequest {

    @NotNull(message = "승인 상태는 필수입니다")
    private ApprovalStatus status;

    @Size(max = 1000, message = "피드백/반려 사유는 1000자 이하여야 합니다")
    private String feedback;

    public enum ApprovalStatus {
        APPROVE("승인"),
        REJECT("반려");

        private final String description;

        ApprovalStatus(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    /**
     * 반려인 경우 피드백 필수 검증
     */
    public void validate() {
        if (status == ApprovalStatus.REJECT) {
            if (feedback == null || feedback.trim().isEmpty()) {
                throw new IllegalArgumentException("반려 시 사유는 필수입니다");
            }
        }
    }
}