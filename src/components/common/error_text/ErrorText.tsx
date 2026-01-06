/* ========================================
   ❗ 입력 필드 에러 메시지 컴포넌트
   ======================================== */

/**
 * 입력 필드 에러 메시지 컴포넌트
 *
 * 목적: 입력 필드 아래에 에러 메시지를 표시하는 재사용 가능한 컴포넌트입니다.
 *
 * 사용 위치:
 * - 입력 필드 아래에 에러 메시지를 표시할 때
 * - 폼 유효성 검사 실패 시 에러 메시지 표시
 *
 * 주요 기능:
 * - 에러 메시지 텍스트를 props로 받아서 표시
 * - 메시지가 없으면 렌더링하지 않음 (조건부 렌더링)
 * - 공통 스타일 적용
 *
 */

"use client";

import styles from "@/styles/common/input_error_message.module.css";

/**
 * ErrorText 컴포넌트 Props
 *
 * @property {string} message - 표시할 에러 메시지 텍스트
 * @property {string} className - 추가 CSS 클래스명 (선택사항)
 * @property {React.CSSProperties} style - 인라인 스타일 (선택사항)
 */
interface ErrorTextProps {
  /** 표시할 에러 메시지 텍스트 */
  message?: string;
  /** 추가 CSS 클래스명 (선택사항) */
  className?: string;
  /** 인라인 스타일 (선택사항) */
  style?: React.CSSProperties;
}

/**
 * 입력 필드 에러 메시지 컴포넌트
 *
 * @param {ErrorTextProps} props - 컴포넌트 props
 * @returns {JSX.Element | null} 에러 메시지가 있으면 JSX.Element, 없으면 null
 *
 * 사용 예시:
 * ```tsx
 * <ErrorText message="출금은 최소 10,000원부터 신청할 수 있습니다." />
 * ```
 *
 * 조건부 렌더링 예시:
 * ```tsx
 * {errorMessage && <ErrorText message={errorMessage} />}
 * ```
 */
export default function ErrorText({
  message,
  className,
  style,
}: ErrorTextProps) {
  // 메시지가 없으면 렌더링하지 않음 (조건부 렌더링)
  if (!message) return null;

  /**
   * 스타일 병합:
   * - 기본 스타일과 전달받은 인라인 스타일을 병합합니다.
   * - className과 style을 props로 받아 유연하게 스타일을 적용할 수 있습니다.
   */
  const mergedClassName = className
    ? `${styles.input_error_message} ${className}`
    : styles.input_error_message;

  return (
    <span className={mergedClassName} style={style}>
      <span className={styles.input_error_text}>{message}</span>
    </span>
  );
}
