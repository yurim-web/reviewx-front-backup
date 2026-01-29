/* ========================================
   🆔 주민등록번호 입력 컴포넌트
   ======================================== */

/**
 * 주민등록번호 입력 컴포넌트
 *
 * 목적: 주민등록번호를 입력할 수 있는 컴포넌트입니다.
 *
 * 주요 기능:
 * - 생년월일 6자리 입력 (숫자만)
 * - 뒷자리 7자리 입력 (비밀번호 타입)
 * - 자동 하이픈 분리
 *
 * 사용 위치:
 * - /user/mypage/edit (유저 내 정보 수정 페이지)
 */

"use client";

import layoutStyles from "@/styles/user/mypage/edit_profile/layout.module.css";
import inputStyles from "@/styles/user/mypage/edit_profile/inputs.module.css";
import ssnStyles from "@/styles/user/mypage/edit_profile/ssn.module.css";

interface SocialSecurityNumberInputProps {
  /** 생년월일 6자리 */
  ssnFront: string;
  /** 뒷자리 7자리 */
  ssnBack: string;
  /** 생년월일 변경 핸들러 */
  onSsnFrontChange: (value: string) => void;
  /** 뒷자리 변경 핸들러 */
  onSsnBackChange: (value: string) => void;
}

/**
 * 주민등록번호 입력 컴포넌트
 */
export default function SocialSecurityNumberInput({
  ssnFront,
  ssnBack,
  onSsnFrontChange,
  onSsnBackChange,
}: SocialSecurityNumberInputProps) {
  const ssnBackGenderDigit = ssnBack.charAt(0);

  return (
    <article className={layoutStyles.field_article}>
      <label className={inputStyles.field_label} htmlFor="ssnFront">
        주민등록번호
      </label>
      <div className={ssnStyles.ssn_container}>
        <input
          type="text"
          id="ssnFront"
          name="ssnFront"
          className={`${inputStyles.input_field} ${ssnStyles.ssn_front_input}`}
          value={ssnFront}
          inputMode="numeric"
          onChange={(e) => {
            onSsnFrontChange(e.target.value);
          }}
          maxLength={6}
          placeholder="생년월일 6자리"
        />
        <span className={ssnStyles.ssn_separator}>-</span>
        <div className={ssnStyles.ssn_back_wrapper}>
          <input
            type="password"
            id="ssnBack"
            name="ssnBack"
            className={`${inputStyles.input_field} ${ssnStyles.ssn_back_input}`}
            value={ssnBack}
            onChange={(e) => {
              onSsnBackChange(e.target.value);
            }}
            maxLength={7}
            placeholder="뒤 7자리"
          />
          {ssnBackGenderDigit && (
            <span className={ssnStyles.ssn_back_gender_digit}>
              {ssnBackGenderDigit}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
