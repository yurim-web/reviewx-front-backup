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

import layoutStyles from "@/styles/user/mypage/edit_profile/edit_profile_layout.module.css";
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
  /**
   * 뒷자리 마스킹 처리
   * - 첫 번째 자리(성별): 그대로 표시
   * - 나머지 6자리: • (불릿) 로 마스킹
   */
  const getMaskedSsnBack = (value: string): string => {
    if (!value) return "";
    const firstDigit = value.charAt(0);
    const masked = "•".repeat(value.length - 1);
    return firstDigit + masked;
  };

  return (
    <article className={layoutStyles.field_article}>
      <label className={inputStyles.field_label} htmlFor="ssnFront">
        주민등록번호
      </label>
      <div className={ssnStyles.ssn_container}>
        <div className={ssnStyles.ssn_front_wrapper}>
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
        </div>
        <span className={ssnStyles.ssn_separator}>-</span>
        <div className={ssnStyles.ssn_back_wrapper}>
          <input
            type="text"
            id="ssnBack"
            name="ssnBack"
            className={`${inputStyles.input_field} ${ssnStyles.ssn_back_input}`}
            value={getMaskedSsnBack(ssnBack)}
            inputMode="numeric"
            onChange={(e) => {
              // 실제 입력값 처리 (숫자만)
              const input = e.target.value;
              const currentLength = ssnBack.length;

              // 마스킹 문자 제거하고 숫자만 추출
              if (input.length > currentLength) {
                // 입력이 추가된 경우
                const newChar = input.slice(-1);
                if (/^\d$/.test(newChar)) {
                  onSsnBackChange(ssnBack + newChar);
                }
              } else if (input.length < currentLength) {
                // 삭제된 경우
                onSsnBackChange(ssnBack.slice(0, -1));
              }
            }}
            onKeyDown={(e) => {
              // 백스페이스/Delete 키 처리
              if (e.key === "Backspace" || e.key === "Delete") {
                e.preventDefault();
                if (ssnBack.length > 0) {
                  onSsnBackChange(ssnBack.slice(0, -1));
                }
              }
            }}
            maxLength={7}
            placeholder="뒤 7자리"
          />
        </div>
      </div>
    </article>
  );
}
