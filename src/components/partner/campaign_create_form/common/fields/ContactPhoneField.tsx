/* ========================================
   📞 문의 담당자 휴대폰 번호 필드 컴포넌트
   ======================================== */

/**
 * 문의 담당자 휴대폰 번호 필드 컴포넌트
 *
 * 목적: 캠페인 문의 담당자 휴대폰 번호를 입력받는 필드를 제공합니다.
 *
 * 주요 기능:
 * - 휴대폰 번호 입력 (필수 필드)
 * - 전화번호 형식 자동 포맷팅 (010-1234-5678)
 * - 수정 모드에서 편집 제어
 */

"use client";

import infoStyles from "@/styles/partner/campaign_create/campaign_info.module.css";

/**
 * 문의 담당자 휴대폰 번호 필드 Props
 *
 * 설명:
 * - value: 휴대폰 번호 값
 * - onChange: 값 변경 시 호출되는 콜백 함수
 * - isEditMode: 수정 모드 여부
 * - isEditable: 필드 편집 가능 여부
 */
interface ContactPhoneFieldProps {
  /** 휴대폰 번호 값 */
  value: string;
  /** 값 변경 시 호출되는 콜백 함수 */
  onChange: (value: string) => void;
  /** 수정 모드 여부 */
  isEditMode?: boolean;
  /** 필드 편집 가능 여부 */
  isEditable?: boolean;
}

/**
 * 전화번호 포맷팅 함수
 *
 * 설명:
 * - 숫자만 추출하여 010-1234-5678 형식으로 포맷팅합니다.
 *
 * @param value - 포맷팅할 전화번호 문자열
 * @returns 포맷팅된 전화번호 (010-1234-5678)
 */
function formatPhoneNumber(value: string): string {
  // 숫자만 추출
  const numbers = value.replace(/\D/g, "");

  // 길이에 따라 포맷팅
  if (numbers.length <= 3) {
    return numbers;
  } else if (numbers.length <= 7) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  } else if (numbers.length <= 11) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
  } else {
    // 11자리 초과 시 11자리까지만
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  }
}

/**
 * 문의 담당자 휴대폰 번호 필드 컴포넌트
 *
 * 설명:
 * - 전화번호 입력 시 자동으로 010-1234-5678 형식으로 포맷팅됩니다.
 * - 숫자와 하이픈만 입력 가능합니다.
 */
export function ContactPhoneField({
  value,
  onChange,
  isEditMode = false,
  isEditable = true,
}: ContactPhoneFieldProps) {
  /**
   * 전화번호 입력 변경 핸들러
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // 숫자만 추출
    const numbers = inputValue.replace(/\D/g, "");
    // 포맷팅된 값으로 변환
    const formatted = formatPhoneNumber(numbers);
    onChange(formatted);
  };

  /**
   * 전화번호 키 입력 핸들러
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 허용할 키들
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
    ];

    // Ctrl, Cmd 키와 함께 사용되는 키 (복사, 붙여넣기 등)
    const isCtrlKey = e.ctrlKey || e.metaKey;
    const isAllowedKeyWithCtrl = ["a", "c", "v", "x"].includes(
      e.key.toLowerCase()
    );

    // 입력된 키가 숫자인지 확인
    const isNumeric = /^[0-9]$/.test(e.key);

    // 허용된 키가 아니면 입력 방지
    if (
      !isNumeric &&
      !allowedKeys.includes(e.key) &&
      !(isCtrlKey && isAllowedKeyWithCtrl)
    ) {
      e.preventDefault();
    }
  };

  return (
    <article className={infoStyles.form_group}>
      <label className={infoStyles.form_label}>
        문의 담당자 휴대폰 번호<span className={infoStyles.required}>*</span>
      </label>
      <input
        type="tel"
        className={infoStyles.form_input}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="010-1234-5678"
        maxLength={13} // 010-1234-5678 (13자)
        readOnly={isEditMode && !isEditable}
      />
    </article>
  );
}

