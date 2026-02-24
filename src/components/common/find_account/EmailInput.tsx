/**
 * 이메일 입력 컴포넌트
 *
 * 비밀번호 찾기 탭에서 사용하는 이메일 입력 필드입니다.
 *
 * 사용 페이지:
 * - src/components/common/FindAccountPage.tsx
 */

"use client";

import styles from "@/styles/common/find_account/find_account.module.css";
import signupStyles from "@/styles/common/signup/signup.module.css";

interface EmailInputProps {
  /** 이메일 값 */
  value: string;
  /** 이메일 변경 핸들러 */
  onChange: (value: string) => void;
  /** 에러 메시지 */
  error?: string;
  /** 관리자용: true면 라벨 "아이디", placeholder 없음, type="text" */
  isManager?: boolean;
}

export default function EmailInput({ value, onChange, error, isManager = false }: EmailInputProps) {
  return (
    <div className={styles.email_input_wrapper}>
      <label htmlFor="find-account-email" className={styles.email_label}>
        {isManager ? "아이디" : "아이디(이메일)"}
      </label>
      <input
        id="find-account-email"
        type={isManager ? "text" : "email"}
        className={styles.email_input}
        placeholder={isManager ? "" : "이메일 입력"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <div className={signupStyles.error_message}>{error}</div>}
    </div>
  );
}
