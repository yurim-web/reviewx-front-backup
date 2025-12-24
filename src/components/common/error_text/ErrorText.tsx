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
 */
interface ErrorTextProps {
  /** 표시할 에러 메시지 텍스트 */
  message?: string;
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
export default function ErrorText({ message }: ErrorTextProps) {
  // 메시지가 없으면 렌더링하지 않음 (조건부 렌더링)
  // 학습 포인트: && 연산자를 사용하여 조건에 따라 컴포넌트 표시/숨김
  if (!message) return null;

  return (
    <span className={styles.input_error_message}>
      <span className={styles.input_error_text}>{message}</span>
    </span>
  );
}
