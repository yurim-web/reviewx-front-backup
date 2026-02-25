/* ========================================
   💰 파트너 포인트 충전 레이아웃
   ======================================== */

/**
 * 파트너 포인트 충전 레이아웃
 *
 * 설명:
 * - 이 레이아웃은 포인트 충전 페이지에서만 사용됩니다.
 * - 포인트 충전 페이지에서는 항상 SubHeader(뒤로 가기 버튼이 있는 헤더)를 사용합니다.
 * - 상위 레이아웃의 PartnerHeader는 SubHeader 컴포넌트 내부에서 자동으로 숨겨집니다.
 */

"use client";

import { useLayoutEffect } from "react";

/**
 * 파트너 포인트 충전 레이아웃 컴포넌트
 *
 * @param children - 포인트 충전 페이지 컴포넌트 (page.tsx)
 */
export default function PartnerPointChargeLayout({ children }: { children: React.ReactNode }) {
  /**
   * useLayoutEffect Hook: DOM 업데이트 직후 동기적으로 실행되는 부수 효과 처리
   *
   * 설명:
   * - useEffect와 달리 useLayoutEffect는 브라우저가 화면을 그리기 전에 실행됩니다.
   * - 따라서 헤더를 숨기는 작업이 화면에 보이기 전에 완료되어 깜빡임을 방지할 수 있습니다.
   * - 포인트 충전 페이지에서는 항상 PartnerHeader를 숨깁니다.
   */
  useLayoutEffect(() => {
    // 클라이언트 사이드에서만 실행 (SSR 방지)
    if (typeof window === "undefined") return;

    /**
     * 헤더 숨기기 함수
     *
     * 설명:
     * - requestAnimationFrame을 사용하여 다음 프레임에 실행되도록 합니다.
     * - 이렇게 하면 DOM이 완전히 렌더링된 후에 헤더를 숨길 수 있습니다.
     */
    const hideHeader = () => {
      // PartnerHeader 숨기기 (header 태그 안에 있음)
      // querySelector: DOM에서 첫 번째로 일치하는 요소를 찾는 메서드
      const header = document.querySelector("header");
      if (header) {
        // display: none으로 헤더를 숨김
        header.style.display = "none";
      }
    };

    // 즉시 실행
    hideHeader();

    // 다음 프레임에도 실행 (DOM이 완전히 렌더링된 후)
    const frameId = requestAnimationFrame(() => {
      hideHeader();
    });

    // cleanup 함수: 컴포넌트가 언마운트될 때 실행
    // 다른 페이지로 이동할 때 헤더를 다시 표시하여 정상적으로 보이도록 함
    return () => {
      cancelAnimationFrame(frameId);
      const header = document.querySelector("header");
      if (header) {
        header.style.display = "block";
      }
    };
  }, []); // 빈 의존성 배열: 컴포넌트 마운트/언마운트 시에만 실행

  return <>{children}</>;
}
