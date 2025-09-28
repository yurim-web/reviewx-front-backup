package com.reviewx.dto.admin;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class WithdrawalRejectionRequest {

    @NotBlank(message = "반려 사유를 입력해주세요")
    @Size(max = 1000, message = "반려 사유는 1000자 이내여야 합니다")
    private String reason;

    private String adminNote; // 관리자 추가 메모
}