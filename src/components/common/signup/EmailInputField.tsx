/* ========================================
   📧 이메일 입력 컴포넌트 (중복 체크 포함)
   ======================================== */

/**
 * EmailInputField
 *
 * 목적: 이메일 입력 + 실시간 형식 검증 + 중복 체크
 *
 * 사용 위치:
 * - src/app/partner/signup/page.tsx (회원가입)
 * - src/app/user/signup/page.tsx (향후 적용 가능)
 *
 * 기능:
 * - 실시간 이메일 형식 검증
 * - 중복 체크 (getAccountsByType 사용)
 * - 에러 메시지 자동 표시
 */

import { useState, useEffect } from "react";
import ErrorText from "@/components/common/error_text/ErrorText";
import { getAccountsByType } from "@/data/login/unifiedAccountData";
import commonStyles from "@/styles/common/signup/signup.module.css";

interface EmailInputFieldProps {
  /** 입력 필드 ID */
  id: string;
  /** 라벨 텍스트 */
  label: string;
  /** 현재 값 */
  value: string;
  /** 외부 에러 메시지 */
  error?: string;
  /** 값 변경 핸들러 */
  onChange: (value: string) => void;
  /** 에러 변경 핸들러 */
  onErrorChange?: (error: string | undefined) => void;
  /** placeholder 텍스트 (선택) */
  placeholder?: string;
  /** 사용자 타입 (중복 체크용) */
  userType: "partner" | "user";
}

/**
 * 이메일 입력 컴포넌트
 *
 * 실시간 형식 검증 및 중복 체크를 수행합니다.
 */
export default function EmailInputField({
  id,
  label,
  value,
  error: externalError,
  onChange,
  onErrorChange,
  placeholder = "이메일 입력",
  userType,
}: EmailInputFieldProps) {
  const [internalError, setInternalError] = useState<string | undefined>();

  // 에러는 외부 에러를 우선으로 사용
  const displayError = externalError || internalError;

  useEffect(() => {
    if (value.trim() === "") {
      // 빈 필드: 에러 초기화
      setInternalError(undefined);
      onErrorChange?.(undefined);
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      const error = "올바른 이메일 형식을 입력해주세요.";
      setInternalError(error);
      onErrorChange?.(error);
      return;
    }

    // 형식이 유효한 경우: 중복 체크
    const accounts = getAccountsByType(userType);
    const isDuplicate = accounts.some((account) => account.email === value);

    if (isDuplicate) {
      const error = "이미 사용 중인 아이디입니다.";
      setInternalError(error);
      onErrorChange?.(error);
    } else {
      setInternalError(undefined);
      onErrorChange?.(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, userType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={commonStyles.form_field}>
      <label className={commonStyles.field_label} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type="email"
        className={commonStyles.input_field}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onInvalid={(e) => e.preventDefault()}
      />
      <ErrorText message={displayError} />
    </div>
  );
}
