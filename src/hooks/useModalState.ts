/* ========================================
   단순 모달 열림/닫힘 상태 훅
   ======================================== */

/**
 * useModalState
 *
 * 목적: boolean 모달 상태를 open/close 메서드로 간결하게 관리하는 범용 훅
 *
 * 사용 페이지:
 * - 모달 한 개의 열림/닫힘 상태가 필요한 모든 컴포넌트
 */

import { useState } from "react";

export interface ModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export function useModalState(initial = false): ModalState {
  const [isOpen, setIsOpen] = useState(initial);
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };
}
