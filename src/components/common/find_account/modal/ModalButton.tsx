/**
 * 모달 버튼 컴포넌트
 *
 * find_account 모달에서 사용하는 공통 버튼 컴포넌트
 *
 * 사용처:
 * - src/components/common/find_account/modal/AccountFoundModal.tsx
 * - src/components/common/find_account/modal/SNSLoginModal.tsx
 */

"use client";

import styles from "@/styles/common/find_account/find_account.module.css";

/**
 * ModalButton Props 타입
 *
 * TypeScript 인터페이스:
 * - children: React.ReactNode - 버튼 내부에 표시될 내용 (텍스트, 아이콘 등)
 * - variant: 버튼 스타일 타입 (선택적)
 * - onClick: 버튼 클릭 시 실행할 함수 (선택적)
 * - className: 추가 CSS 클래스명 (선택적)
 */
interface ModalButtonProps {
  /** 버튼 텍스트 */
  children: React.ReactNode;
  /** 버튼 variant 타입 */
  variant?:
    | "primary"
    | "secondary"
    | "close"
    | "kakao"
    | "naver"
    | "sns-secondary";
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
  /**
   * 버튼 variant에 따라 적절한 CSS 클래스명을 반환하는 함수
   *
   * switch 문 사용법:
   * - variant 값에 따라 다른 CSS 클래스를 반환
   * - 각 case는 variant의 가능한 값들
   * - default는 위의 case에 해당하지 않을 때 실행
   *
   * .trim() 메서드:
   * - 문자열 앞뒤 공백을 제거하는 JavaScript 메서드
   * - className이 빈 문자열일 때 불필요한 공백을 제거하기 위해 사용
   */
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
      case "naver":
        return `${styles.sns_modal_naver_button} ${baseClass}`.trim();
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
