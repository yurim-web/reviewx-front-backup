/**
 * 입력 필드와 버튼 조합 컴포넌트
 *
 * input_with_button 패턴을 재사용하는 컴포넌트입니다.
 *
 * 사용처:
 * - src/components/common/mypage/AddressInput.tsx
 * - src/components/common/mypage/PhoneVerificationInput.tsx
 */

"use client";

import styles from "@/styles/user/mypage/edit_profile.module.css";

interface InputWithButtonProps {
  /** 입력 필드 요소 */
  input: React.ReactNode;
  /** 버튼 요소 (선택적) */
  button?: React.ReactNode;
  /** 추가 클래스명 */
  className?: string;
}

export default function InputWithButton({
  input,
  button,
  className = "",
}: InputWithButtonProps) {
  return (
    <div className={`${styles.input_with_button} ${className}`.trim()}>
      {input}
      {button}
    </div>
  );
}
