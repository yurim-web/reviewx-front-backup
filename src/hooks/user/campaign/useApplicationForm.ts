/* ========================================
   캠페인 신청 모달 폼 상태 커스텀 훅
   ======================================== */

/**
 * useApplicationForm
 *
 * 목적: 캠페인 신청 모달의 폼 상태(메모, 동의, sessionStorage 유지)와 바디 스크롤 제어를 관리합니다.
 *
 * 사용 페이지:
 * - /user/campaign/[type]/[id] (캠페인 상세 - 신청 모달)
 */

import { useState, useEffect } from "react";

const SESSION_KEY = "applicationModalFormData";

function getStoredFormData(): { memo: string; isAgreed: boolean; isUrgentAgreed: boolean } | null {
  if (typeof window === "undefined") return null;
  const stored = sessionStorage.getItem(SESSION_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function useApplicationForm(isOpen: boolean) {
  const [isAgreed, setIsAgreed] = useState(false);
  const [isUrgentAgreed, setIsUrgentAgreed] = useState(false);
  const [memo, setMemo] = useState("");

  // 모달 열릴 때 폼 상태 초기화 또는 복원 (body 스크롤 제어 포함)
  useEffect(() => {
    if (!isOpen) return;

    if (typeof window !== "undefined") {
      // body 스크롤 제어
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.width = "100%";
        document.body.style.top = "0";
      }

      // shouldRestoreFormData 플래그에 따라 복원 또는 초기화
      const shouldRestore = sessionStorage.getItem("shouldRestoreFormData");
      if (shouldRestore === "true") {
        const stored = getStoredFormData();
        if (stored) {
          setMemo(stored.memo || "");
          setIsAgreed(stored.isAgreed || false);
          setIsUrgentAgreed(stored.isUrgentAgreed || false);
        }
      } else {
        setMemo("");
        setIsAgreed(false);
        setIsUrgentAgreed(false);
      }
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    };
  }, [isOpen]);

  const saveFormData = (memoVal: string, agreed: boolean, urgentAgreed: boolean) => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ memo: memoVal, isAgreed: agreed, isUrgentAgreed: urgentAgreed })
    );
  };

  const clearFormData = () => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(SESSION_KEY);
  };

  const restoreFormData = () => {
    const stored = getStoredFormData();
    if (stored) {
      setMemo(stored.memo || "");
      setIsAgreed(stored.isAgreed || false);
      setIsUrgentAgreed(stored.isUrgentAgreed || false);
    }
  };

  const resetFormData = () => {
    clearFormData();
    setMemo("");
    setIsAgreed(false);
    setIsUrgentAgreed(false);
  };

  return {
    isAgreed,
    setIsAgreed,
    isUrgentAgreed,
    setIsUrgentAgreed,
    memo,
    setMemo,
    saveFormData,
    clearFormData,
    restoreFormData,
    resetFormData,
  };
}
