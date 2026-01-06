/* ========================================
   🏢 조건부 파트너 헤더 컴포넌트
   ======================================== */

/**
 * 조건부 파트너 헤더 컴포넌트
 *
 * 목적: 특정 페이지에서는 PartnerHeader를 표시하지 않습니다.
 *
 * 설명:
 * - 포인트 충전 페이지(/partner/point/charge)에서는 SubHeader를 사용하므로
 *   PartnerHeader를 표시하지 않습니다.
 * - 다른 파트너 페이지에서는 일반 PartnerHeader를 표시합니다.
 */

"use client";

import { usePathname } from "next/navigation";
import PartnerHeader from "./PartnerHeader";

/**
 * 조건부 파트너 헤더 컴포넌트
 *
 * 주요 기능:
 * - 현재 경로를 확인하여 포인트 충전 페이지가 아닐 때만 PartnerHeader를 표시합니다.
 * - 포인트 충전 페이지에서는 SubHeader가 사용되므로 헤더를 표시하지 않습니다.
 */
export default function ConditionalPartnerHeader() {
  /**
   * usePathname Hook: Next.js에서 현재 경로를 가져오는 Hook
   *
   * 설명:
   * - 현재 페이지의 경로를 문자열로 반환합니다.
   * - 예: "/partner/point/charge", "/partner", "/partner/campaign/create" 등
   */
  const pathname = usePathname();

  /**
   * 포인트 충전 페이지 경로 확인
   *
   * 설명:
   * - 현재 경로가 "/partner/point/charge"인지 확인합니다.
   * - 이 페이지에서는 SubHeader를 사용하므로 PartnerHeader를 표시하지 않습니다.
   */
  const isPointChargePage = pathname === "/partner/point/charge";

  /**
   * 조건부 렌더링: 포인트 충전 페이지가 아닐 때만 PartnerHeader 표시
   *
   * 설명:
   * - 삼항 연산자 또는 && 연산자를 사용하여 조건부로 컴포넌트를 렌더링할 수 있습니다.
   * - 여기서는 !isPointChargePage가 true일 때만 PartnerHeader를 렌더링합니다.
   */
  if (isPointChargePage) {
    return null; // 포인트 충전 페이지에서는 헤더를 표시하지 않음
  }

  return <PartnerHeader />;
}

