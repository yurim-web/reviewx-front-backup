/* ========================================
   📝 회원가입 폼 입력 필드 컴포넌트
   ======================================== */

/**
 * FormInputField
 *
 * 목적: 회원가입 페이지의 반복되는 입력 필드 패턴을 통합
 *
 * 사용 페이지:
 * - src/app/partner/signup/page.tsx
 * - src/app/user/signup/page.tsx (향후 적용 가능)
 *
 * 재사용 대상 필드:
 * - 이메일
 * - 이름
 * - 상호명
 * - 대표자명
 * - 기타 단순 텍스트 입력 필드
 */

import ErrorText from "@/components/common/error_text/ErrorText";
import commonStyles from "@/styles/common/signup/signup.module.css";

interface FormInputFieldProps {
  /** 입력 필드 ID (label htmlFor와 연결) */
  id: string;
  /** 라벨 텍스트 */
  label: string;
  /** 입력 타입 (기본값: 'text') */
  type?: string;
  /** 현재 값 */
  value: string;
  /** 에러 메시지 (있으면 ErrorText 표시) */
  error?: string;
  /** 값 변경 핸들러 */
  onChange: (value: string) => void;
  /** placeholder 텍스트 (선택) */
  placeholder?: string;
  /** 최대 입력 길이 (선택) */
  maxLength?: number;
  /** 읽기 전용 여부 (선택) */
  readOnly?: boolean;
  /** 비활성화 여부 (선택) */
  disabled?: boolean;
}

/**
 * 회원가입 폼 입력 필드 컴포넌트
 *
 * label + input + ErrorText 패턴을 통합하여 반복 코드 제거
 */
export default function FormInputField({
  id,
  label,
  type = "text",
  value,
  error,
  onChange,
  placeholder,
  maxLength,
  readOnly = false,
  disabled = false,
}: FormInputFieldProps) {
  return (
    <div className={commonStyles.form_field}>
      <label className={commonStyles.field_label} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        className={commonStyles.input_field}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        readOnly={readOnly}
        disabled={disabled}
        onInvalid={(e) => e.preventDefault()}
      />
      <ErrorText message={error} />
    </div>
  );
}
