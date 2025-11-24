/* ========================================
   🔒 비밀번호 확인 입력 컴포넌트 (공통)
   ======================================== */

/**
 * 모듈 목적
 *
 * - 비밀번호 확인 입력 필드 UI
 * - 비밀번호 표시/숨김 토글 기능
 * - 실시간 비밀번호 일치 검증
 *
 * 📍 사용 페이지/컴포넌트:
 * - src/app/user/signup/page.tsx
 *   (사용자 회원가입 페이지에서 비밀번호 확인 입력 필드로 사용)
 * - src/app/partner/signup/page.tsx
 *   (파트너 회원가입 페이지에서 비밀번호 확인 입력 필드로 사용)
 *
 * 📌 공통 컴포넌트 위치:
 * - src/components/common/signup/PasswordConfirmInput.tsx
 *   (user와 partner 회원가입 페이지에서 공통으로 사용하는 컴포넌트)
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
      {/* 라벨: "비밀번호 확인" */}
      <label className={styles.field_label} htmlFor="passwordConfirm">
        비밀번호 확인
      </label>

      {/* 입력 필드 래퍼 (입력창 + 눈 아이콘 버튼) */}
      <div className={styles.password_input_wrapper}>
        {/* 비밀번호 확인 입력 필드 - 표시/숨김 토글, 에러 시 빨간 테두리, 입력 시 실시간 검증 */}
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
            e.preventDefault(); // 브라우저 기본 유효성 검사 방지
          }}
        />

        {/* 비밀번호 표시/숨김 토글 버튼 (눈 아이콘) */}
        <button
          type="button"
          className={styles.eye_toggle_button}
          onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
          aria-label={showPasswordConfirm ? '비밀번호 숨기기' : '비밀번호 보기'}
        >
          {/* 보이는 상태: sign_show.svg, 숨김 상태: sign_none.svg */}
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

      {/* 에러 메시지 표시 (에러가 있고 입력값이 있을 때만 표시) */}
      {error && value.length > 0 && (
        <div className={styles.error_message}>
          <span className={styles.error_text}>{error}</span>
        </div>
      )}
    </div>
  );
}
