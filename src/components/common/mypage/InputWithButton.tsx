/**
 * 입력 필드와 버튼 조합 컴포넌트
 *
 * input_with_button 패턴을 재사용하는 컴포넌트입니다.
 *
 * 사용 페이지:
 * - src/components/common/mypage/AddressInput.tsx
 * - src/components/common/phone_verification/PhoneVerification.tsx (마이페이지 스타일)
 */

"use client";

import verificationStyles from "@/styles/user/mypage/edit_profile/verification.module.css";

interface InputWithButtonProps {
  /** 입력 필드 요소 */
  input: React.ReactNode;
  /** 버튼 요소 (선택적) */
  button?: React.ReactNode;
  /** 추가 클래스명 */
  className?: string;
}

export default function InputWithButton({ input, button, className = "" }: InputWithButtonProps) {
  return (
    <div className={`${verificationStyles.input_with_button} ${className}`.trim()}>
      {input}
      {button}
    </div>
  );
}
