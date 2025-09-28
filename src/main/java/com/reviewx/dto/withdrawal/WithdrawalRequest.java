package com.reviewx.dto.withdrawal;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class WithdrawalRequest {

    @NotNull(message = "출금 금액을 입력해주세요")
    @Min(value = 5000, message = "최소 출금 금액은 5,000P입니다")
    @Max(value = 1000000, message = "최대 출금 금액은 1,000,000P입니다")
    private Integer amount;

    @NotBlank(message = "은행명을 입력해주세요")
    @Size(max = 50, message = "은행명은 50자 이내여야 합니다")
    private String bankName;

    @NotBlank(message = "계좌번호를 입력해주세요")
    @Pattern(regexp = "^[0-9\\-]+$", message = "계좌번호는 숫자와 하이픈만 입력 가능합니다")
    @Size(max = 50, message = "계좌번호는 50자 이내여야 합니다")
    private String accountNumber;

    @NotBlank(message = "예금주명을 입력해주세요")
    @Size(max = 50, message = "예금주명은 50자 이내여야 합니다")
    private String accountHolder;

    private String memo; // 출금 메모 (선택사항)
}