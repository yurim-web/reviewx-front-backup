"use client";

import styles from "@/styles/common/input_error_message.module.css";
import { getErrorMessage, type InputErrorCode } from "@/utils/messages";

interface InputErrorMessageProps {
  code?: InputErrorCode;
  show?: boolean;
}

export default function InputErrorMessage({
  code,
  show = true,
}: InputErrorMessageProps) {
  if (!code || !show) return null;

  return (
    <div className={styles.input_error_message}>
      <span className={styles.input_error_text}>{getErrorMessage(code)}</span>
    </div>
  );
}
