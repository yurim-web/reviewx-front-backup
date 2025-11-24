/* ========================================
   🔒 비밀번호 확인 입력 컴포넌트
   ======================================== */

/**
 * 모듈 목적
 *
 * - 비밀번호 확인 입력 필드 UI
 * - 비밀번호 표시/숨김 토글 기능
 * - 실시간 비밀번호 일치 검증
 */

'use client';

import { useState } from 'react';
import { validatePasswordMatch } from '@/utils/user/signup/validation';
import styles from '@/styles/user/signup/signup.module.css';

interface PasswordConfirmInputProps {
  value: string;
  password: string;
  error?: string;
  onValueChange: (value: string) => void;
  onErrorChange: (error: string | undefined) => void;
}

export default function PasswordConfirmInput({
  value,
  password,
  error,
  onValueChange,
  onErrorChange,
}: PasswordConfirmInputProps) {
  const [showPasswordConfirm, setShowPasswordConfirm] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onValueChange(newValue);

    // 실시간 비밀번호 일치 검증
    if (newValue.length > 0 && password && !validatePasswordMatch(password, newValue)) {
      onErrorChange('비밀번호가 일치하지 않습니다.');
    } else {
      onErrorChange(undefined);
    }
  };

  return (
    <div className={styles.form_field}>
      <label className={styles.field_label} htmlFor="passwordConfirm">
        비밀번호 확인
      </label>
      <div className={styles.password_input_wrapper}>
        <input
          id="passwordConfirm"
          type={showPasswordConfirm ? 'text' : 'password'}
          className={`${styles.input_field} ${
            error !== undefined ? styles.input_error : ''
          }`}
          placeholder="비밀번호 재입력"
          value={value}
          onChange={handleChange}
          onInvalid={(e) => {
            e.preventDefault();
          }}
        />
        <button
          type="button"
          className={styles.eye_toggle_button}
          onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
          aria-label={
            showPasswordConfirm ? '비밀번호 숨기기' : '비밀번호 보기'
          }
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {showPasswordConfirm ? (
              <path
                d="M8 3C4.667 3 2.073 5.073 1 8c1.073 2.927 3.667 5 7 5s5.927-2.073 7-5c-1.073-2.927-3.667-5-7-5zm0 8.333c-1.84 0-3.333-1.493-3.333-3.333S6.16 4.667 8 4.667 11.333 6.16 11.333 8 9.84 11.333 8 11.333zm0-5.333c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                fill="#848484"
              />
            ) : (
              <>
                <path
                  d="M8 3C4.667 3 2.073 5.073 1 8c1.073 2.927 3.667 5 7 5s5.927-2.073 7-5c-1.073-2.927-3.667-5-7-5zm0 8.333c-1.84 0-3.333-1.493-3.333-3.333S6.16 4.667 8 4.667 11.333 6.16 11.333 8 9.84 11.333 8 11.333zm0-5.333c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                  fill="#848484"
                />
                <path
                  d="M1.293 1.293l13.414 13.414"
                  stroke="#848484"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </>
            )}
          </svg>
        </button>
      </div>
      {error && value.length > 0 && (
        <div className={styles.error_message}>
          <span className={styles.error_text}>{error}</span>
        </div>
      )}
    </div>
  );
}

