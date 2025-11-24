/* ========================================
   🔒 비밀번호 입력 컴포넌트 (공통)
   ======================================== */

/**
 * 모듈 목적
 *
 * - 비밀번호 입력 필드 UI
 * - 비밀번호 표시/숨김 토글 기능
 * - 실시간 비밀번호 검증 및 에러 표시
 *
 * 📍 사용 페이지/컴포넌트:
 * - src/app/user/signup/page.tsx
 *   (사용자 회원가입 페이지에서 비밀번호 입력 필드로 사용)
 * - src/app/partner/signup/page.tsx
 *   (파트너 회원가입 페이지에서 비밀번호 입력 필드로 사용)
 *
 * 📌 공통 컴포넌트 위치:
 * - src/components/common/signup/PasswordInput.tsx
 *   (user와 partner 회원가입 페이지에서 공통으로 사용하는 컴포넌트)
 */

'use client';

import { useState } from 'react';
import { validatePassword } from '@/utils/signup/validation';
import styles from '@/styles/user/signup/signup.module.css';

interface PasswordInputProps {
  value: string;
  error?: string;
  onValueChange: (value: string) => void;
  onErrorChange: (error: string | undefined) => void;
  onPasswordConfirmValidate?: (password: string) => void;
  passwordConfirm?: string;
}

export default function PasswordInput({
  value,
  error,
  onValueChange,
  onErrorChange,
  onPasswordConfirmValidate,
  passwordConfirm,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onValueChange(newValue);

    // 실시간 비밀번호 검증
    if (newValue.length > 0) {
      if (newValue.length < 8 || newValue.length > 16) {
        onErrorChange(
          '8~16자 영문, 숫자, 특수문자(!@#$%^&*()-_=+) 조합으로 입력해 주세요.',
        );
      } else if (!validatePassword(newValue)) {
        onErrorChange(
          '8~16자 영문, 숫자, 특수문자(!@#$%^&*()-_=+) 조합으로 입력해 주세요.',
        );
      } else {
        onErrorChange(undefined);
      }
    } else {
      onErrorChange(undefined);
    }

    // 비밀번호 확인도 다시 검증
    if (onPasswordConfirmValidate && passwordConfirm) {
      onPasswordConfirmValidate(newValue);
    }
  };

  return (
    <div className={styles.form_field}>
      <label className={styles.field_label} htmlFor="password">
        비밀번호
      </label>
      <div className={styles.password_input_wrapper}>
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          className={`${styles.input_field} ${
            error !== undefined ? styles.input_error : ''
          }`}
          placeholder="8~16자 영문, 숫자, 특수문자 조합 입력"
          value={value}
          onChange={handleChange}
          onInvalid={(e) => {
            e.preventDefault();
          }}
        />
        <button
          type="button"
          className={styles.eye_toggle_button}
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
        >
          {/* 
            📌 이미지 아이콘 사용
            - showPassword가 true일 때: sign_show.svg (비밀번호가 보이는 상태 → 숨기기 버튼)
            - showPassword가 false일 때: sign_none.svg (비밀번호가 숨겨진 상태 → 보이게 하는 버튼)
            
            Next.js의 public 폴더는 루트 경로(/)에서 접근 가능합니다.
            예: /images/icons/signup/sign_show.svg
          */}
          <img
            src={
              showPassword
                ? '/images/icons/signup/sign_show.svg'
                : '/images/icons/signup/sign_none.svg'
            }
            alt={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
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
