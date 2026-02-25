/* ========================================
   📋 파트너 캠페인 생성 공통 레이아웃
   ======================================== */

/**
 * 파트너 캠페인 생성 페이지들의 공통 레이아웃
 *
 * 목적: 모든 캠페인 생성 페이지에서 공통으로 사용되는 요소들을 관리
 *
 * 사용 페이지:
 * - /partner/campaign/create/delivery
 * - /partner/campaign/create/mission
 * - /partner/campaign/create/reporter
 * - /partner/campaign/create/review
 * - /partner/campaign/create/visit
 */

"use client";

import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";

/**
 * 캠페인 생성 페이지들의 공통 레이아웃 컴포넌트
 *
 * @param children - 하위 페이지 컴포넌트들
 */
export default function CampaignCreateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* 파트너 서브헤더 컴포넌트 - 모든 캠페인 생성 페이지에서 공통으로 사용 */}
      <PartnerSubHeader />

      {/* 하위 페이지 컨텐츠 */}
      {children}
    </div>
  );
}
