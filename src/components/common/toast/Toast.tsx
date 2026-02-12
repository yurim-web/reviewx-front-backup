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

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "@/styles/common/toast.module.css";

interface ToastProps {
  message: string; // 표시할 메시지 텍스트
  isOpen: boolean; // 토스트 표시 여부
  onClose?: () => void; // 토스트가 닫힐 때 호출되는 콜백 함수 (선택적)
  duration?: number; // 자동으로 사라지는 시간 (밀리초, 기본값: 2000ms)
  /** 'lower'면 화면에서 조금 더 아래에 표시 (일부 페이지 전용) */
  positionVariant?: "default" | "lower";
}

export default function Toast({
  message,
  isOpen,
  onClose,
  duration = 2000,
  positionVariant = "default",
}: ToastProps) {
  // 클라이언트 사이드에서만 Portal을 사용하기 위한 상태
  const [isMounted, setIsMounted] = useState(false);

  // 컴포넌트가 마운트된 후에만 Portal 사용 (SSR 대응)
  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  if (!isOpen || !isMounted) return null;

  /**
   * Portal을 사용하여 Toast를 body에 직접 렌더링
   *
   * 설명:
   * - createPortal: React의 Portal API를 사용하여 컴포넌트를 다른 DOM 노드에 렌더링합니다.
   * - document.body: Toast를 body 요소에 직접 렌더링하여 모달의 stacking context에 영향받지 않도록 합니다.
   * - 이렇게 하면 Toast가 항상 최상위 레벨에 표시되어 모든 모달 위에 나타납니다.
   * - isMounted 체크: Next.js의 SSR 환경에서 document가 없을 수 있으므로 클라이언트에서만 Portal을 사용합니다.
   */
  return createPortal(
    <div
      className={`${styles.toast} ${positionVariant === "lower" ? styles.toast_position_lower : ""}`}
    >
      {/* 체크마크 아이콘 */}
      <div className={styles.toast_icon}></div>
      {/* 메시지 텍스트 */}
      <span className={styles.toast_text}>{message}</span>
    </div>,
    document.body
  );
}
