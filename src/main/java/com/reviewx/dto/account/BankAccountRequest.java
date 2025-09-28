package com.reviewx.dto.account;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class BankAccountRequest {

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
}