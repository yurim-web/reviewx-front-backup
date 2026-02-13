"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Loading from "@/app/manager_ga/loading";
import { useAuth } from "@/hooks/useAuth";

/**
 * 관리자 레이아웃 래퍼 컴포넌트
 *
 * 목적:
 * - 관리자 레이아웃 속성(data-manager-layout)이 적용되기 전까지 로딩 화면 표시
 * - 레이아웃 깜빡임 완전 방지
 * - 인증되지 않은 사용자 접근 차단 (토큰 기반 인증)
 * - 관리자 권한 확인 (SA/GA)
 */
export default function ManagerLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
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
        // 전체 페이지 이동을 사용해 로그인 페이지가 올바른 레이아웃(max-width)으로 로드되도록 함
        if (!isAuthenticated || !user) {
          console.log("🔒 [ManagerLayoutWrapper] 미인증 사용자 - 로그인 페이지로 이동");
          window.location.replace("/manager/login");
          return;
        }

        // 관리자 권한 확인
        const isSAPath = pathname === "/manager_sa" || pathname.startsWith("/manager_sa/");
        const isGAPath = pathname === "/manager_ga" || pathname.startsWith("/manager_ga/");

        if (isSAPath && user.role !== "manager_sa") {
          console.log("🚫 [ManagerLayoutWrapper] SA 권한 없음 - 로그인 페이지로 이동");
          window.location.replace("/manager/login");
          return;
        }

        if (isGAPath && user.role !== "manager_ga") {
          console.log("🚫 [ManagerLayoutWrapper] GA 권한 없음 - 로그인 페이지로 이동");
          window.location.replace("/manager/login");
          return;
        }

        console.log("✅ [ManagerLayoutWrapper] 인증 확인 완료:", {
          role: user.role,
          name: user.name,
        });
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
