/* ========================================
   📞 연락처 입력 컴포넌트
   ======================================== */

/**
 * ContactPhoneInput
 *
 * 목적: 연락처 자동 포맷팅 (010-XXXX-XXXX)
 *
 * 사용 페이지:
 * - src/app/partner/signup/page.tsx (회원가입 - 담당자 연락처)
 * - src/app/partner/mypage/edit/page.tsx (내 정보 수정)
 *
 * 기능:
 * - 숫자만 입력 허용
 * - 자동 하이픈 삽입 (3-4-4 형식)
 * - 실시간 형식 검증
 */

import { useEffect } from "react";
import ErrorText from "@/components/common/error_text/ErrorText";
import { formatPhoneNumber } from "@/utils/formatting/phone";
import commonStyles from "@/styles/common/signup/signup.module.css";

interface ContactPhoneInputProps {
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
  /** 에러 변경 핸들러 (선택) */
  onErrorChange?: (error: string | undefined) => void;
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
 * 연락처 입력 컴포넌트
 *
 * 자동으로 010-XXXX-XXXX 형식으로 포맷팅합니다.
 */
export default function ContactPhoneInput({
  id,
  label,
  value,
  error,
  onChange,
  onErrorChange,
  placeholder = "010-0000-0000",
  readOnly = false,
  wrapperClassName,
  labelClassName,
  inputClassName,
}: ContactPhoneInputProps) {
  // 실시간 휴대폰 번호 형식 검증
  useEffect(() => {
    if (!onErrorChange) return; // 검증 콜백이 없으면 스킵

    if (value.trim() === "") {
      onErrorChange(undefined);
      return;
    }

    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(value)) {
      onErrorChange("올바른 휴대폰 번호 형식을 입력해주세요.");
    } else {
      onErrorChange(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    onChange(formatted);
  };

  return (
    <div className={wrapperClassName || commonStyles.form_field}>
      <label className={labelClassName || commonStyles.field_label} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type="tel"
        className={inputClassName || commonStyles.input_field}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={13} // 010-XXXX-XXXX (하이픈 포함 13자)
        readOnly={readOnly}
        onInvalid={(e) => e.preventDefault()}
      />
      <ErrorText message={error} />
    </div>
  );
}
