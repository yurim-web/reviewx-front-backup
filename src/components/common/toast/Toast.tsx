/* ========================================
   🔔 토스트 메시지 컴포넌트
   ======================================== */

/**
 * 토스트 메시지 컴포넌트
 *
 * 목적: 사용자에게 간단한 알림 메시지를 표시하는 재사용 가능한 컴포넌트입니다.
 *
 * 주요 기능:
 * - 메시지 텍스트 표시
 * - 체크마크 아이콘 표시
 * - 자동으로 사라지는 기능 (기본 2초)
 * - 페이드 인/아웃 애니메이션
 *
 * 사용 예시:
 * ```tsx
 * const [showToast, setShowToast] = useState(false);
 *
 * <Toast
 *   message="복사되었습니다."
 *   isOpen={showToast}
 *   onClose={() => setShowToast(false)}
 *   duration={2000}
 * />
 * ```
 */

"use client";

import { useEffect } from "react";
import styles from "@/styles/common/toast.module.css";

interface ToastProps {
  message: string; // 표시할 메시지 텍스트
  isOpen: boolean; // 토스트 표시 여부
  onClose?: () => void; // 토스트가 닫힐 때 호출되는 콜백 함수 (선택적)
  duration?: number; // 자동으로 사라지는 시간 (밀리초, 기본값: 2000ms)
}

export default function Toast({
  message,
  isOpen,
  onClose,
  duration = 2000,
}: ToastProps) {
  // isOpen이 true가 되면 duration 시간 후 자동으로 닫기
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      clearTimeout(timer);
    };
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.toast}>
      {/* 체크마크 아이콘 */}
      <div className={styles.toast_icon}></div>
      {/* 메시지 텍스트 */}
      <span className={styles.toast_text}>{message}</span>
    </div>
  );
}
