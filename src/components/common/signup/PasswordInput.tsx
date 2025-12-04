/* ========================================
   🔒 비밀번호 입력 컴포넌트 (공통)
   ======================================== */

/**
 * 비밀번호 입력 컴포넌트
 *
 * 비밀번호 입력 필드 UI, 비밀번호 표시/숨김 토글 기능, 실시간 비밀번호 검증 및 에러 표시
 *
 * 사용 페이지:
 * - src/app/user/signup/page.tsx
 * - src/app/partner/signup/page.tsx
 */

"use client";

import { useState } from "react";
import { validatePassword } from "@/utils/signup/validation";
import styles from "@/styles/user/signup/signup.module.css";

interface PasswordInputProps {
  value: string;
  error?: string;
  onValueChange: (value: string) => void;
  onErrorChange: (error: string | undefined) => void;
  onPasswordConfirmValidate?: (password: string) => void;
  passwordConfirm?: string;
}

const PASSWORD_ERROR_MESSAGE =
  "8~16자 영문, 숫자, 특수문자(!@#$%^&*()-_=+) 조합으로 입력해 주세요.";

/**
 * 비밀번호 입력 컴포넌트
 */
export default function PasswordInput({
  value,
  error,
  onValueChange,
  onErrorChange,
  onPasswordConfirmValidate,
  passwordConfirm,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  /** 비밀번호 입력 핸들러 - 실시간 검증 및 비밀번호 확인 재검증 */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onValueChange(newValue);

    if (newValue.length > 0) {
      const isValid =
        newValue.length >= 8 &&
        newValue.length <= 16 &&
        validatePassword(newValue);
      onErrorChange(isValid ? undefined : PASSWORD_ERROR_MESSAGE);
    } else {
      onErrorChange(undefined);
    }

    if (onPasswordConfirmValidate && passwordConfirm) {
      onPasswordConfirmValidate(newValue);
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
          showPassword
            ? "/images/icons/signup/sign_show.svg"
            : "/images/icons/signup/sign_none.svg"
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
    return (
      <div className={styles.error_message}>
        <span className={styles.error_text}>{error}</span>
      </div>
    );
  };

  return (
    <div className={styles.form_field}>
      <label className={styles.field_label} htmlFor="password">
        비밀번호
      </label>
      <div className={styles.password_input_wrapper}>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          className={`${styles.input_field} ${
            error !== undefined ? styles.input_error : ""
          }`}
          placeholder="8~16자 영문, 숫자, 특수문자 조합 입력"
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
