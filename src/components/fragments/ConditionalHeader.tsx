/* ========================================
   🎯 조건부 헤더 컴포넌트
   ======================================== */

/**
 * 조건부 헤더 컴포넌트
 *
 * 사용처:
 * - src/app/layout.tsx (루트 레이아웃)
 *   - 모든 페이지에서 공통으로 사용되는 헤더 컴포넌트
 *   - 경로에 따라 파트너 헤더 또는 일반 헤더를 자동으로 표시
 *
 * 목적: 현재 경로에 따라 적절한 헤더를 표시합니다.
 *
 * 설명:
 * - 파트너 경로(/partner/*)에서는 파트너 헤더를 표시합니다.
 * - 캠페인 경로(/campaign/*)는 사용자와 파트너 모두가 사용하는 공통 경로입니다.
 *   - 파트너 경로에서 캠페인 페이지로 이동한 경우: 파트너 헤더 유지
 *   - 사용자 경로에서 캠페인 페이지로 이동한 경우: 일반 헤더 표시
 * - 그 외의 경로에서는 일반 헤더를 표시합니다.
 *
 * 주요 기능:
 * - usePathname Hook을 사용하여 현재 경로를 확인합니다.
 * - useEffect를 사용하여 경로 변경을 추적하고 sessionStorage에 컨텍스트를 저장합니다.
 * - 경로에 따라 PartnerHeader 또는 Header를 조건부로 렌더링합니다.
 */

"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "./Header";
import ConditionalPartnerHeader from "./ConditionalPartnerHeader";

/**
 * 조건부 헤더 컴포넌트
 *
 * 주요 기능:
 * - 현재 경로를 확인하여 적절한 헤더를 표시합니다.
 * - 파트너 경로(/partner/*)에서만 파트너 헤더를 표시합니다.
 * - 파트너에서 캠페인 페이지로 이동한 경우 파트너 헤더를 유지합니다.
 * - 사용자에서 캠페인 페이지로 이동한 경우 일반 헤더를 표시합니다.
 */
export default function ConditionalHeader() {
  /**
   * usePathname Hook: Next.js에서 현재 경로를 가져오는 Hook
   *
   * 설명:
   * - 현재 페이지의 경로를 문자열로 반환합니다.
   * - 예: "/partner", "/campaign/delivery", "/user" 등
   */
  const pathname = usePathname();

  /**
   * 파트너 컨텍스트 상태
   *
   * 설명:
   * - 파트너 경로에서 캠페인 페이지로 이동했는지 추적합니다.
   * - sessionStorage를 사용하여 현재 세션 동안만 유지됩니다.
   * - 브라우저 탭을 닫으면 초기화됩니다.
   * - 초기값은 false로 설정하여 Hydration 에러 방지 (서버와 클라이언트 일치)
   * - useEffect에서 실제 값을 설정합니다.
   */
  const [isPartnerContext, setIsPartnerContext] = useState(false);

  /**
   * 클라이언트 마운트 상태 및 모바일 여부
   *
   * 설명:
   * - is_mounted: Hydration 에러를 방지하기 위해 클라이언트 마운트 여부를 추적합니다.
   * - is_mobile: 현재 뷰포트가 모바일(가로 768px 이하)인지 여부를 나타냅니다.
   */
  const [is_mounted, setIsMounted] = useState(false);
  const [is_mobile, set_is_mobile] = useState(false);

  /**
   * 클라이언트 마운트 확인
   *
   * 설명:
   * - Hydration 에러를 방지하기 위해 클라이언트 마운트를 확인합니다.
   * - 서버 사이드 렌더링과 클라이언트 사이드 렌더링의 일치를 보장합니다.
   */
  useEffect(() => {
    // 브라우저 환경에서만 실행
    if (typeof window === "undefined") return;

    setIsMounted(true);

    // 모바일 여부 체크 함수
    const check_mobile = () => {
      set_is_mobile(window.innerWidth <= 768);
    };

    // 초기 한 번 실행
    check_mobile();

    // 윈도우 리사이즈 시에도 모바일 여부 갱신
    window.addEventListener("resize", check_mobile);
    return () => {
      window.removeEventListener("resize", check_mobile);
    };
  }, []);

  /**
   * 경로 변경 추적 및 컨텍스트 관리
   *
   * 설명:
   * - useEffect: 컴포넌트가 마운트되거나 pathname이 변경될 때 실행됩니다.
   * - 의존성 배열 [pathname]: pathname이 변경될 때마다 실행됩니다.
   *
   * 동작 방식:
   * 1. 파트너 경로(/partner/*)에 있으면 sessionStorage에 "partner" 저장
   * 2. 사용자 경로(/user/*) 또는 루트 경로(/)에 있으면 sessionStorage에서 "partner" 제거
   * 3. 캠페인 경로(/campaign/*)에서는 sessionStorage 값을 확인하여 헤더 결정
   */
  useEffect(() => {
    // 클라이언트 사이드에서만 실행 (SSR 방지)
    if (typeof window === "undefined") return;

    const isPartnerPath = pathname.startsWith("/partner");
    const isCampaignPath = pathname.startsWith("/campaign");
    const isUserPath = pathname.startsWith("/user") || pathname === "/";

    if (isPartnerPath) {
      // 파트너 경로에 있으면 파트너 컨텍스트 저장
      sessionStorage.setItem("headerContext", "partner");
      setIsPartnerContext(true);
    } else if (isUserPath) {
      // 사용자 경로에 있으면 파트너 컨텍스트 제거
      sessionStorage.removeItem("headerContext");
      setIsPartnerContext(false);
    } else if (isCampaignPath) {
      // 캠페인 경로에서는 저장된 컨텍스트 확인
      const savedContext = sessionStorage.getItem("headerContext");
      setIsPartnerContext(savedContext === "partner");
    } else {
      // 그 외 경로에서는 컨텍스트 제거
      sessionStorage.removeItem("headerContext");
      setIsPartnerContext(false);
    }
  }, [pathname]);

  /**
   * 파트너 경로 확인
   *
   * 설명:
   * - 현재 경로가 "/partner"로 시작하는지 확인합니다.
   * - 또는 캠페인 경로이면서 파트너 컨텍스트가 있는지 확인합니다.
   */
  const isPartnerPath = pathname.startsWith("/partner");
  const isCampaignPath = pathname.startsWith("/campaign");
  const isUserSignupPath = pathname === "/user/signup";
  const shouldShowPartnerHeader =
    isPartnerPath || (isCampaignPath && isPartnerContext);

  /**
   * 조건부 렌더링: 파트너 경로 또는 파트너 컨텍스트가 있는 캠페인 경로에서 파트너 헤더 표시
   *
   * 설명:
   * - 파트너 경로(/partner/*)에서만 파트너 헤더를 표시합니다.
   * - 파트너에서 캠페인 페이지로 이동한 경우 파트너 헤더를 유지합니다.
   * - 사용자에서 캠페인 페이지로 이동한 경우 일반 헤더를 표시합니다.
   * - ConditionalPartnerHeader는 내부적으로 포인트 충전 페이지 등을 처리합니다.
   * - 그 외의 경우에는 일반 Header를 표시합니다.
   *
   * Hydration 에러 방지:
   * - 클라이언트 마운트 전까지는 기본적으로 Header를 렌더링하여
   *   서버 사이드와 클라이언트 사이드 렌더링을 일치시킵니다.
   * - 마운트 후에는 실제 경로에 따라 올바른 헤더를 표시합니다.
   */
  if (!is_mounted) {
    // Hydration 에러 방지: 마운트 전까지는 경로 기반으로만 결정
    if (pathname.startsWith("/partner")) {
      return <ConditionalPartnerHeader />;
    }
    return <Header />;
  }

  // 모바일에서 유저 회원가입 페이지(/user/signup)일 때는 헤더를 숨김
  if (is_mobile && isUserSignupPath) {
    return null;
  }

  if (shouldShowPartnerHeader) {
    return <ConditionalPartnerHeader />;
  }

  return <Header />;
}
