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
import { validatePasswordMatch } from '@/utils/signup/validation';
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
  const [showPasswordConfirm, setShowPasswordConfirm] =
    useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onValueChange(newValue);

    // 실시간 비밀번호 일치 검증
    if (
      newValue.length > 0 &&
      password &&
      !validatePasswordMatch(password, newValue)
    ) {
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
          aria-label={showPasswordConfirm ? '비밀번호 숨기기' : '비밀번호 보기'}
        >
          {/* 
            📌 이미지 아이콘 사용
            - showPasswordConfirm가 true일 때: sign_show.svg (비밀번호가 보이는 상태 → 숨기기 버튼)
            - showPasswordConfirm가 false일 때: sign_none.svg (비밀번호가 숨겨진 상태 → 보이게 하는 버튼)
            
            Next.js의 public 폴더는 루트 경로(/)에서 접근 가능합니다.
            예: /images/icons/signup/sign_show.svg
          */}
          <img
            src={
              showPasswordConfirm
                ? '/images/icons/signup/sign_show.svg'
                : '/images/icons/signup/sign_none.svg'
            }
            alt={showPasswordConfirm ? '비밀번호 숨기기' : '비밀번호 보기'}
            width={16}
            height={16}
          />
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
