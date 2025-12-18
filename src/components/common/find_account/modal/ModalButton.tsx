/**
 * 모달 버튼 컴포넌트
 *
 * find_account 모달에서 사용하는 공통 버튼 컴포넌트
 *
 * 사용처:
 * - src/components/common/find_account/modal/AccountFoundModal.tsx
 * - src/components/common/find_account/modal/AccountNotFoundModal.tsx
 * - src/components/common/find_account/modal/BlockedAccountModal.tsx
 * - src/components/common/find_account/modal/SNSLoginModal.tsx
 */

"use client";

import styles from "@/styles/common/find_account.module.css";

/**
 * ModalButton Props 타입
 */
interface ModalButtonProps {
  /** 버튼 텍스트 */
  children: React.ReactNode;
  /** 버튼 variant 타입 */
  variant?: "primary" | "secondary" | "close" | "kakao" | "sns-secondary";
  /** 클릭 핸들러 */
  onClick?: () => void;
  /** 추가 클래스명 */
  className?: string;
}

/**
 * 모달 버튼 컴포넌트
 */
export default function ModalButton({
  children,
  variant = "primary",
  onClick,
  className = "",
}: ModalButtonProps) {
  const getButtonClassName = () => {
    const baseClass = className;
    switch (variant) {
      case "primary":
        return `${styles.result_modal_login_button} ${baseClass}`.trim();
      case "secondary":
        return `${styles.result_modal_secondary_button} ${baseClass}`.trim();
      case "close":
        return `${styles.error_modal_close_button} ${baseClass}`.trim();
      case "kakao":
        return `${styles.sns_modal_primary_button} ${baseClass}`.trim();
      case "sns-secondary":
        return `${styles.sns_modal_secondary_button} ${baseClass}`.trim();
      default:
        return `${styles.result_modal_login_button} ${baseClass}`.trim();
    }
  };

  return (
    <button type="button" className={getButtonClassName()} onClick={onClick}>
      {children}
    </button>
  );
}
