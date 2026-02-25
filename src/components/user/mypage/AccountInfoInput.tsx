/* ========================================
   계좌 정보 입력 컴포넌트
   ======================================== */

/**
 * AccountInfoInput
 *
 * 목적: 본인 명의 계좌 정보(은행, 계좌번호, 예금주)를 입력하고 예금주를 조회하는 컴포넌트
 *
 * 사용 페이지:
 * - /user/mypage/edit (유저 내 정보 수정 페이지)
 */

"use client";

import layoutStyles from "@/styles/user/mypage/edit_profile/edit_profile_layout.module.css";
import inputStyles from "@/styles/user/mypage/edit_profile/inputs.module.css";
import verificationStyles from "@/styles/user/mypage/edit_profile/verification.module.css";
import { CustomDropdown } from "@/components/partner/campaign_create_form/common/selectors/CustomDropdown";
import InputWithButton from "@/components/common/mypage/InputWithButton";
import ErrorText from "@/components/common/error_text/ErrorText";
import Image from "next/image";
import { useAccountVerification } from "@/hooks/user/mypage/useAccountVerification";

interface AccountInfoInputProps {
  accountHolder: string;
  bank: string;
  accountNumber: string;
  onAccountHolderChange: (value: string) => void;
  onBankChange: (value: string) => void;
  onAccountNumberChange: (value: string) => void;
  bankOptions: string[];
  onVerificationStatusChange?: (isVerified: boolean) => void;
  initialVerified?: boolean;
}

export default function AccountInfoInput({
  accountHolder,
  bank,
  accountNumber,
  onAccountHolderChange,
  onBankChange,
  onAccountNumberChange,
  bankOptions,
  onVerificationStatusChange,
  initialVerified = false,
}: AccountInfoInputProps) {
  const {
    queriedAccountHolder,
    isLoading,
    accountQueryError,
    isAccountHolderVerified,
    accountHolderMismatchError,
    handleAccountHolderQuery,
  } = useAccountVerification({
    accountHolder,
    bank,
    accountNumber,
    onAccountHolderChange,
    onVerificationStatusChange,
    initialVerified,
  });

  return (
    <>
      {/* 은행 */}
      <article className={layoutStyles.field_article}>
        <label className={inputStyles.field_label} htmlFor="bank">
          은행
        </label>
        <CustomDropdown
          value={bank}
          options={bankOptions}
          onChange={onBankChange}
          placeholder="은행 선택"
        />
      </article>

      {/* 계좌번호 */}
      <article className={layoutStyles.field_article}>
        <label className={inputStyles.field_label} htmlFor="accountNumber">
          계좌번호
        </label>
        <input
          type="number"
          id="accountNumber"
          name="accountNumber"
          className={inputStyles.input_field}
          value={accountNumber}
          onChange={(e) => onAccountNumberChange(e.target.value)}
          placeholder="- 제외"
        />
      </article>

      {/* 예금주 */}
      <article className={layoutStyles.field_article}>
        <label className={inputStyles.field_label} htmlFor="accountHolder">
          예금주
        </label>

        <InputWithButton
          input={
            <div className={verificationStyles.phone_input_container}>
              <input
                type="text"
                id="accountHolder"
                name="accountHolder"
                className={`${inputStyles.input_field} ${verificationStyles.account_holder_input} ${
                  isAccountHolderVerified ? verificationStyles.account_holder_input_verified : ""
                }`}
                value={accountHolder}
                readOnly
                placeholder=""
              />
              {isAccountHolderVerified && (
                <div className={verificationStyles.account_holder_check_icon}>
                  <Image src="/images/icons/sign_ok.svg" alt="인증 완료" width={16} height={16} />
                </div>
              )}
            </div>
          }
          button={
            <button
              type="button"
              className={`${verificationStyles.postal_button} ${
                isAccountHolderVerified ? verificationStyles.postal_button_verified : ""
              }`}
              onClick={handleAccountHolderQuery}
              disabled={
                isLoading ||
                isAccountHolderVerified ||
                !bank ||
                bank.trim().length === 0 ||
                !accountNumber ||
                String(accountNumber).trim().length === 0
              }
            >
              {isLoading ? "조회 중..." : isAccountHolderVerified ? "인증 완료" : "예금주 조회"}
            </button>
          }
        />

        {!queriedAccountHolder && !accountQueryError && !accountHolderMismatchError && (
          <p className={inputStyles.field_helper_text}>
            입력하신 정보와 예금주 정보가 반드시 일치해야 출금이 가능합니다.
          </p>
        )}

        <ErrorText message={accountQueryError || accountHolderMismatchError} />
      </article>
    </>
  );
}
