package com.reviewx.dto.account;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BankAccountResponse {

    private String bankName;
    private String accountNumber;
    private String accountHolder;
    private String formattedAccountNumber; // 마스킹된 계좌번호
    private String bankAccountInfo; // 전체 계좌 정보
    private boolean isRegistered; // 계좌 등록 여부

    public static BankAccountResponse of(String bankName, String accountNumber, String accountHolder) {
        return BankAccountResponse.builder()
            .bankName(bankName)
            .accountNumber(accountNumber)
            .accountHolder(accountHolder)
            .formattedAccountNumber(maskAccountNumber(accountNumber))
            .bankAccountInfo(String.format("%s %s (%s)", bankName, maskAccountNumber(accountNumber), accountHolder))
            .isRegistered(bankName != null && accountNumber != null && accountHolder != null)
            .build();
    }

    private static String maskAccountNumber(String accountNumber) {
        if (accountNumber == null || accountNumber.length() < 4) {
            return accountNumber;
        }
        int visibleLength = Math.min(4, accountNumber.length());
        String visible = accountNumber.substring(accountNumber.length() - visibleLength);
        return "*".repeat(Math.max(0, accountNumber.length() - visibleLength)) + visible;
    }
}