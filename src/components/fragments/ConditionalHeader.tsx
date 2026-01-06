/* ========================================
   🎯 조건부 헤더 컴포넌트
   ======================================== */

/**
 * 조건부 헤더 컴포넌트
 *
 * 목적: 현재 경로에 따라 적절한 헤더를 표시합니다.
 *
 * 설명:
 * - 파트너 경로(/partner/*) 또는 캠페인 경로(/campaign/*)에서는 파트너 헤더를 표시합니다.
 * - 그 외의 경로에서는 일반 헤더를 표시합니다.
 * - 파트너에서 캠페인 페이지로 이동했을 때도 파트너 헤더가 유지됩니다.
 *
 * 주요 기능:
 * - usePathname Hook을 사용하여 현재 경로를 확인합니다.
 * - 경로에 따라 PartnerHeader 또는 Header를 조건부로 렌더링합니다.
 */

"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import ConditionalPartnerHeader from "./ConditionalPartnerHeader";

/**
 * 조건부 헤더 컴포넌트
 *
 * 주요 기능:
 * - 현재 경로를 확인하여 적절한 헤더를 표시합니다.
 * - 파트너 경로 또는 캠페인 경로에서는 파트너 헤더를 표시합니다.
 * - 그 외의 경로에서는 일반 헤더를 표시합니다.
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
   * 파트너 경로 확인
   *
   * 설명:
   * - 현재 경로가 "/partner"로 시작하는지 확인합니다.
   * - 파트너 관련 페이지에서는 파트너 헤더를 표시해야 합니다.
   */
  const isPartnerPath = pathname.startsWith("/partner");

  /**
   * 캠페인 경로 확인
   *
   * 설명:
   * - 현재 경로가 "/campaign"으로 시작하는지 확인합니다.
   * - 파트너에서 캠페인 페이지로 이동했을 때도 파트너 헤더를 유지하기 위해
   *   캠페인 경로에서도 파트너 헤더를 표시합니다.
   */
  const isCampaignPath = pathname.startsWith("/campaign");

  /**
   * 조건부 렌더링: 파트너 또는 캠페인 경로에서는 파트너 헤더 표시
   *
   * 설명:
   * - || 연산자를 사용하여 두 조건 중 하나라도 true이면 파트너 헤더를 표시합니다.
   * - ConditionalPartnerHeader는 내부적으로 포인트 충전 페이지 등을 처리합니다.
   * - 그 외의 경우에는 일반 Header를 표시합니다.
   */
  if (isPartnerPath || isCampaignPath) {
    return <ConditionalPartnerHeader />;
  }

  return <Header />;
}

