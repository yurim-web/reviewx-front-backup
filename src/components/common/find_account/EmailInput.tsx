/**
 * 이메일 입력 컴포넌트
 *
 * 비밀번호 찾기 탭에서 사용하는 이메일 입력 필드입니다.
 *
 * 사용처:
 * - src/components/common/FindAccountPage.tsx
 */

"use client";

import styles from "@/styles/common/find_account.module.css";

interface EmailInputProps {
  /** 이메일 값 */
  value: string;
  /** 이메일 변경 핸들러 */
  onChange: (value: string) => void;
  /** 에러 메시지 */
  error?: string;
}

export default function EmailInput({
  value,
  onChange,
  error,
}: EmailInputProps) {
  return (
    <div className={styles.email_input_wrapper}>
      <label htmlFor="find-account-email" className={styles.email_label}>
        아이디(이메일)
      </label>
      <input
        id="find-account-email"
        type="email"
        className={styles.email_input}
        placeholder="가입 시 사용한 이메일을 입력하세요"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && (
        <div className={styles.email_error_message}>
          <span className={styles.email_error_text}>{error}</span>
        </div>
      )}
    </div>
  );
}
