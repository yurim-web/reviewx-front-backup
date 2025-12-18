/* ========================================
   💳 계좌 정보 입력 컴포넌트
   ======================================== */

/**
 * 계좌 정보 입력 컴포넌트
 *
 * 목적: 본인 명의 계좌 정보(예금주, 은행, 계좌번호)를 입력할 수 있는 컴포넌트입니다.
 *
 * 주요 기능:
 * - 예금주 입력
 * - 은행 선택 (드롭다운)
 * - 계좌번호 입력
 *
 * 사용 위치:
 * - /user/mypage/edit (유저 내 정보 수정 페이지)
 */

"use client";

import styles from "@/styles/user/mypage/edit_profile.module.css";
import { CustomDropdown } from "@/components/partner/campaign_create_form/common/CustomDropdown";

interface AccountInfoInputProps {
  /** 예금주 */
  accountHolder: string;
  /** 은행 */
  bank: string;
  /** 계좌번호 */
  accountNumber: string;
  /** 예금주 변경 핸들러 */
  onAccountHolderChange: (value: string) => void;
  /** 은행 변경 핸들러 */
  onBankChange: (value: string) => void;
  /** 계좌번호 변경 핸들러 */
  onAccountNumberChange: (value: string) => void;
  /** 은행 옵션 목록 */
  bankOptions: string[];
}

/**
 * 계좌 정보 입력 컴포넌트
 */
export default function AccountInfoInput({
  accountHolder,
  bank,
  accountNumber,
  onAccountHolderChange,
  onBankChange,
  onAccountNumberChange,
  bankOptions,
}: AccountInfoInputProps) {
  return (
    <>
      {/* 예금주 */}
      <article className={styles.field_article}>
        <label className={styles.field_label} htmlFor="accountHolder">
          예금주<span className={styles.required_asterisk}>*</span>
        </label>
        <input
          type="text"
          id="accountHolder"
          name="accountHolder"
          className={styles.input_field}
          value={accountHolder}
          onChange={(e) => onAccountHolderChange(e.target.value)}
          placeholder="회원 이름과 동일한 예금주 입력"
        />
        <p className={styles.field_helper_text}>
          입력하신 정보와 예금주 정보가 반드시 일치해야 출금이 가능합니다.
        </p>
      </article>

      {/* 은행 */}
      <article className={styles.field_article}>
        <label className={styles.field_label} htmlFor="bank">
          은행<span className={styles.required_asterisk}>*</span>
        </label>
        <CustomDropdown
          value={bank}
          options={bankOptions}
          onChange={onBankChange}
          placeholder="은행 선택"
        />
      </article>

      {/* 계좌번호 */}
      <article className={styles.field_article}>
        <label className={styles.field_label} htmlFor="accountNumber">
          계좌번호<span className={styles.required_asterisk}>*</span>
        </label>
        <input
          type="number"
          id="accountNumber"
          name="accountNumber"
          className={styles.input_field}
          value={accountNumber}
          onChange={(e) => onAccountNumberChange(e.target.value)}
          placeholder="- 제외"
        />
      </article>
    </>
  );
}
