"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Loading from "@/app/manager_ga/loading";

/**
 * 관리자 레이아웃 래퍼 컴포넌트
 *
 * 목적:
 * - 관리자 레이아웃 속성(data-manager-layout)이 적용되기 전까지 로딩 화면 표시
 * - 레이아웃 깜빡임 완전 방지
 */
export default function ManagerLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 현재 경로가 관리자 경로인지 확인
    const isManagerPath =
      pathname === "/manager_ga" ||
      pathname === "/manager_sa" ||
      pathname.startsWith("/manager_ga/") ||
      pathname.startsWith("/manager_sa/");

    const isCampaignPath = pathname.startsWith("/campaign/");

    if (isManagerPath && !isCampaignPath) {
      // 관리자 경로이고 캠페인 경로가 아닌 경우 속성 추가
      document.body.setAttribute("data-manager-layout", "true");
      document.documentElement.setAttribute("data-manager-layout", "true");

      // 속성이 적용된 후 화면 표시
      requestAnimationFrame(() => {
        setIsReady(true);
      });
    } else {
      // 캠페인 경로이거나 관리자 경로가 아닌 경우 속성 제거
      document.body.removeAttribute("data-manager-layout");
      document.documentElement.removeAttribute("data-manager-layout");
      setIsReady(true);
    }
  }, [pathname]);

  // 레이아웃이 준비되기 전까지 로딩 화면 표시
  if (!isReady) {
    return <Loading />;
  }

  return <>{children}</>;
}
