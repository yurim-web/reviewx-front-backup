/* ========================================
   관리자 레이아웃 래퍼 컴포넌트
   ======================================== */

/**
 * ManagerLayoutWrapper
 *
 * 목적: 관리자 인증 확인 및 레이아웃 깜빡임 방지 래퍼
 *
 * 사용 페이지:
 * - /manager_ga/* (GA 관리자 전체 레이아웃)
 * - /manager_sa/* (SA 관리자 전체 레이아웃)
 */

"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Loading from "@/app/manager_ga/loading";
import { useAuth } from "@/hooks/useAuth";
export default function ManagerLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
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
      // 관리자 경로인 경우 인증 체크
      if (!authLoading) {
        // 인증되지 않은 경우 로그인 페이지로 리다이렉트
        if (!isAuthenticated || !user) {
          document.body.removeAttribute("data-manager-layout");
          document.documentElement.removeAttribute("data-manager-layout");
          router.replace("/manager/login");
          return;
        }

        // 관리자 권한 확인
        const isSAPath = pathname === "/manager_sa" || pathname.startsWith("/manager_sa/");
        const isGAPath = pathname === "/manager_ga" || pathname.startsWith("/manager_ga/");

        if (isSAPath && user.role !== "manager_sa") {
          document.body.removeAttribute("data-manager-layout");
          document.documentElement.removeAttribute("data-manager-layout");
          router.replace("/manager/login");
          return;
        }

        if (isGAPath && user.role !== "manager_ga") {
          document.body.removeAttribute("data-manager-layout");
          document.documentElement.removeAttribute("data-manager-layout");
          router.replace("/manager/login");
          return;
        }
      }

      // 관리자 레이아웃 속성 추가
      document.body.setAttribute("data-manager-layout", "true");
      document.documentElement.setAttribute("data-manager-layout", "true");

      // 속성이 적용된 후 화면 표시 (인증 완료된 경우만)
      if (!authLoading && isAuthenticated) {
        requestAnimationFrame(() => {
          setIsReady(true);
        });
      }
    } else {
      // 캠페인 경로이거나 관리자 경로가 아닌 경우 속성 제거
      document.body.removeAttribute("data-manager-layout");
      document.documentElement.removeAttribute("data-manager-layout");
      setIsReady(true);
    }
  }, [pathname, isAuthenticated, user, authLoading, router]);

  // 레이아웃이 준비되기 전까지 로딩 화면 표시
  if (!isReady || authLoading) {
    return <Loading />;
  }

  return <>{children}</>;
}
