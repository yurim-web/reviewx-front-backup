/* ========================================
   🏢 사업자등록번호 입력 컴포넌트
   ======================================== */

/**
 * BusinessNumberInput
 *
 * 목적: 사업자등록번호 자동 포맷팅 (XXX-XX-XXXXX)
 *
 * 사용 페이지:
 * - src/app/partner/signup/page.tsx (회원가입)
 * - src/app/partner/mypage/edit/page.tsx (내 정보 수정)
 *
 * 기능:
 * - 숫자만 입력 허용
 * - 자동 하이픈 삽입 (3-2-5 형식)
 * - 실시간 형식 검증
 */

import ErrorText from "@/components/common/error_text/ErrorText";
import { formatBusinessNumber } from "@/utils/formatting/businessNumber";
import commonStyles from "@/styles/common/signup/signup.module.css";

interface BusinessNumberInputProps {
  /** 입력 필드 ID */
  id: string;
  /** 라벨 텍스트 */
  label: string;
  /** 현재 값 (포맷팅된 값) */
  value: string;
  /** 에러 메시지 */
  error?: string;
  /** 값 변경 핸들러 (포맷팅된 값 전달) */
  onChange: (value: string) => void;
  /** placeholder 텍스트 (선택) */
  placeholder?: string;
  /** 읽기 전용 여부 (선택) */
  readOnly?: boolean;
  /** 커스텀 wrapper className (선택) */
  wrapperClassName?: string;
  /** 커스텀 label className (선택) */
  labelClassName?: string;
  /** 커스텀 input className (선택) */
  inputClassName?: string;
}

/**
 * 사업자등록번호 입력 컴포넌트
 *
 * 자동으로 XXX-XX-XXXXX 형식으로 포맷팅합니다.
 */
export default function BusinessNumberInput({
  id,
  label,
  value,
  error,
  onChange,
  placeholder = "사업자등록번호 10자리",
  readOnly = false,
  wrapperClassName,
  labelClassName,
  inputClassName,
}: BusinessNumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBusinessNumber(e.target.value);
    onChange(formatted);
  };

  return (
    <div className={wrapperClassName || commonStyles.form_field}>
      <label className={labelClassName || commonStyles.field_label} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type="text"
        className={inputClassName || commonStyles.input_field}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={12} // XXX-XX-XXXXX (하이픈 포함 12자)
        readOnly={readOnly}
        onInvalid={(e) => e.preventDefault()}
      />
      <ErrorText message={error} />
    </div>
  );
}
