"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * 관리자 레이아웃 스타일 적용을 위한 클라이언트 컴포넌트
 *
 * 설명:
 * - 관리자 레이아웃이 적용된 경우 body에 data-manager-layout 속성을 추가합니다
 * - 이 속성을 통해 관리자 전용 CSS가 적용됩니다
 * - /campaign/* 경로로 이동하면 이 속성이 제거되어 일반 레이아웃이 적용됩니다
 */
export default function ManagerLayoutScript() {
  const pathname = usePathname();

  useEffect(() => {
    // 현재 경로가 관리자 경로인지 확인
    // 📌 주의: 대시보드 루트(/manager_ga, /manager_sa)도 포함해야 함
    const isManagerPath =
      pathname === "/manager_ga" ||
      pathname === "/manager_sa" ||
      pathname.startsWith("/manager_ga/") ||
      pathname.startsWith("/manager_sa/");

    // 현재 경로가 캠페인 상세 페이지인지 확인
    const isCampaignPath = pathname.startsWith("/campaign/");

    if (isManagerPath && !isCampaignPath) {
      // 관리자 경로이고 캠페인 경로가 아닌 경우 속성 추가
      document.body.setAttribute("data-manager-layout", "true");
    } else {
      // 캠페인 경로이거나 관리자 경로가 아닌 경우 속성 제거
      document.body.removeAttribute("data-manager-layout");
    }
  }, [pathname]);

  return null;
}

