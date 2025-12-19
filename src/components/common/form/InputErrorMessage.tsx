/* ========================================
   ❗ 인풋 에러 메시지 컴포넌트
   ======================================== */

/**
 * 인풋 아래에 간단한 에러 문구를 렌더링하는 공용 컴포넌트입니다.
 * - message: 표시할 에러 텍스트
 * - show: 표시 여부 (기본값 true)
 */

"use client";

import styles from "@/styles/common/input_error_message.module.css";

interface InputErrorMessageProps {
  message?: string;
  show?: boolean;
}

export default function InputErrorMessage({
  message,
  show = true,
}: InputErrorMessageProps) {
  if (!message || !show) return null;

  return (
    <div className={styles.input_error_message}>
      <span className={styles.input_error_text}>{message}</span>
    </div>
  );
}
