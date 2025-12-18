/* ========================================
   🔒 비밀번호 확인 입력 컴포넌트 (공통)
   ======================================== */

/**
 * 비밀번호 확인 입력 컴포넌트
 *
 * 비밀번호 확인 입력 필드 UI, 비밀번호 표시/숨김 토글 기능, 실시간 비밀번호 일치 검증
 *
 * 사용 페이지:
 * - src/app/user/signup/page.tsx
 * - src/app/partner/signup/page.tsx
 */

"use client";

import { useState } from "react";
import { validatePasswordMatch } from "@/utils/signup/validation";
import styles from "@/styles/user/signup/signup.module.css";

interface PasswordConfirmInputProps {
  value: string;
  password: string;
  error?: string;
  onValueChange: (value: string) => void;
  onErrorChange: (error: string | undefined) => void;
}

/**
 * 비밀번호 확인 입력 컴포넌트
 */
export default function PasswordConfirmInput({
  value,
  password,
  error,
  onValueChange,
  onErrorChange,
}: PasswordConfirmInputProps) {
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  /** 비밀번호 확인 입력 핸들러 - 실시간 비밀번호 일치 검증 */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onValueChange(newValue);

    if (
      newValue.length > 0 &&
      password &&
      !validatePasswordMatch(password, newValue)
    ) {
      onErrorChange("비밀번호가 일치하지 않습니다.");
    } else {
      onErrorChange(undefined);
    }
  };

  /** 비밀번호 표시/숨김 토글 버튼 렌더링 */
  const renderEyeToggleButton = () => (
    <button
      type="button"
      className={styles.eye_toggle_button}
      onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
      aria-label={showPasswordConfirm ? "비밀번호 숨기기" : "비밀번호 보기"}
    >
      <img
        src={
          showPasswordConfirm
            ? "/images/icons/signup/sign_show.svg"
            : "/images/icons/signup/sign_none.svg"
        }
        alt={showPasswordConfirm ? "비밀번호 숨기기" : "비밀번호 보기"}
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
      <label className={styles.field_label} htmlFor="passwordConfirm">
        비밀번호 확인
      </label>
      <div className={styles.password_input_wrapper}>
        <input
          id="passwordConfirm"
          type={showPasswordConfirm ? "text" : "password"}
          className={`${styles.input_field} ${
            error !== undefined ? styles.input_error : ""
          }`}
          placeholder="비밀번호 재입력"
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
