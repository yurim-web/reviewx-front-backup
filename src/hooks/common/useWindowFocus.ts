/* ========================================
   윈도우 포커스 이벤트 훅
   ======================================== */

/**
 * useWindowFocus.ts
 *
 * 목적: 브라우저 창 포커스 시 콜백을 실행하는 공통 훅
 *
 * 사용 페이지:
 * - /user/campaign_management/* (캠페인 관리 전체)
 */

import { useEffect } from "react";

export function useWindowFocus(callback: () => void) {
  useEffect(() => {
    window.addEventListener("focus", callback);
    return () => window.removeEventListener("focus", callback);
  }, [callback]);
}
