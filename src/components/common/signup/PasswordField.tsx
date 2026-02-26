/* ========================================
   🔒 비밀번호 입력 컴포넌트 (공통)
   ======================================== */
/* eslint-disable @next/next/no-img-element */

/**
 * 비밀번호 입력 컴포넌트
 *
 * 비밀번호 입력 필드 및 비밀번호 확인 입력 필드 UI
 * 비밀번호 표시/숨김 토글 기능, 실시간 비밀번호 검증 및 에러 표시
 *
 * 사용 페이지:
 * - src/app/user/signup/page.tsx
 * - src/app/partner/signup/page.tsx
 */

"use client";

import { useState } from "react";
import { validatePassword, validatePasswordMatch } from "@/utils/validation";
import styles from "@/styles/common/signup/signup.module.css";

interface PasswordFieldProps {
  type: "password" | "confirm";
  value: string;
  error?: string;
  onValueChange: (value: string) => void;
  onErrorChange: (error: string | undefined) => void;
  // confirm 타입일 때만 사용
  password?: string;
}

const PASSWORD_ERROR_MESSAGE =
  "8~16자 영문, 숫자, 특수문자(!@#$%^&*()-_=+) 조합으로 입력해 주세요.";

/**
 * 비밀번호 입력 컴포넌트
 */
export default function PasswordField({
  type,
  value,
  error,
  onValueChange,
  onErrorChange,
  password,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  /** 비밀번호 입력 핸들러 - 실시간 검증 */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onValueChange(newValue);

    if (type === "password") {
      // 비밀번호 형식 검증
      if (newValue.length > 0) {
        const isValid = newValue.length >= 8 && newValue.length <= 16 && validatePassword(newValue);
        onErrorChange(isValid ? undefined : PASSWORD_ERROR_MESSAGE);
      } else {
        onErrorChange(undefined);
      }
    } else if (type === "confirm") {
      // 비밀번호 일치 검증
      if (newValue.length > 0 && password) {
        if (!validatePasswordMatch(password, newValue)) {
          onErrorChange("비밀번호가 일치하지 않습니다.");
        } else {
          onErrorChange(undefined);
        }
      } else {
        onErrorChange(undefined);
      }
    }
  };

  /** 비밀번호 표시/숨김 토글 버튼 렌더링 */
  const renderEyeToggleButton = () => (
    <button
      type="button"
      className={styles.eye_toggle_button}
      onClick={() => setShowPassword(!showPassword)}
      aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
    >
      <img
        src={
          showPassword ? "/images/icons/signup/sign_show.svg" : "/images/icons/signup/sign_none.svg"
        }
        alt={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
        width={16}
        height={16}
      />
    </button>
  );

  /** 에러 메시지 렌더링 */
  const renderErrorMessage = () => {
    if (!error || value.length === 0) return null;
    return <div className={styles.error_message}>{error}</div>;
  };

  const fieldId = type === "password" ? "password" : "password_confirm";
  const label = type === "password" ? "비밀번호" : "비밀번호 확인";
  const placeholder =
    type === "password" ? "8~16자 영문, 숫자, 특수문자 조합 입력" : "비밀번호 재입력";

  return (
    <div className={styles.form_field}>
      <label className={styles.field_label} htmlFor={fieldId}>
        {label}
      </label>
      <div className={styles.password_input_wrapper}>
        <input
          id={fieldId}
          type={showPassword ? "text" : "password"}
          className={styles.input_field}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onInvalid={(e) => {
            e.preventDefault();
          }}
        />
        {renderEyeToggleButton()}
      </div>
      {renderErrorMessage()}
    </div>
  );
}
