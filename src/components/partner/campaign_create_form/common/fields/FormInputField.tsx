/* ========================================
   📝 폼 입력 필드 공통 컴포넌트
   ======================================== */

/**
 * 폼 입력 필드 공통 컴포넌트
 *
 * 목적: 모든 캠페인 폼에서 사용되는 텍스트 입력 필드를 재사용 가능하게 만듭니다.
 *
 * 주요 기능:
 * - 라벨과 입력 필드 조합
 * - 필수 필드 표시 (*)
 * - 읽기 전용 모드 지원
 * - 플레이스홀더 지원
 */

"use client";

import infoStyles from "@/styles/partner/campaign_create/campaign_info.module.css";

/**
 * 폼 입력 필드 Props
 *
 * 설명:
 * - label: 필드 라벨 텍스트
 * - required: 필수 필드 여부
 * - value: 입력 필드 값
 * - onChange: 값 변경 시 호출되는 콜백 함수
 * - placeholder: 플레이스홀더 텍스트
 * - readOnly: 읽기 전용 여부
 * - type: 입력 필드 타입 (text, url, number 등)
 */
interface FormInputFieldProps {
  /** 필드 라벨 텍스트 */
  label: string;
  /** 필수 필드 여부 */
  required?: boolean;
  /** 입력 필드 값 */
  value: string;
  /** 값 변경 시 호출되는 콜백 함수 */
  onChange: (value: string) => void;
  /** 플레이스홀더 텍스트 */
  placeholder?: string;
  /** 읽기 전용 여부 */
  readOnly?: boolean;
  /** 입력 필드 타입 */
  type?: "text" | "url" | "number";
}

/**
 * 폼 입력 필드 컴포넌트
 *
 * 설명:
 * - 라벨과 입력 필드를 조합한 재사용 가능한 컴포넌트입니다.
 * - 필수 필드일 경우 라벨 옆에 * 표시를 추가합니다.
 */
export function FormInputField({
  label,
  required = false,
  value,
  onChange,
  placeholder,
  readOnly = false,
  type = "text",
}: FormInputFieldProps) {
  return (
    <article className={infoStyles.form_group}>
      <label className={infoStyles.form_label}>
        {label}
        {required && <span className={infoStyles.required}>*</span>}
      </label>
      <input
        type={type}
        className={infoStyles.form_input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
      />
    </article>
  );
}

