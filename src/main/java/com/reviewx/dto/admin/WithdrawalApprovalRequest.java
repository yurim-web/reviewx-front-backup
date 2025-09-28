package com.reviewx.dto.admin;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class WithdrawalApprovalRequest {

    @NotBlank(message = "처리 사유를 입력해주세요")
    @Size(max = 1000, message = "처리 사유는 1000자 이내여야 합니다")
    private String note;

    private String bankTransactionId; // 은행 거래 ID (승인 시)
    private String bankReferenceNumber; // 은행 참조번호 (승인 시)
}