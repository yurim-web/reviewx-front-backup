/* ========================================
   📋 파트너 캠페인 생성 공통 레이아웃
   ======================================== */

/**
 * 파트너 캠페인 생성 페이지들의 공통 레이아웃
 *
 * 목적: 모든 캠페인 생성 페이지에서 공통으로 사용되는 요소들을 관리
 *
 * 공통 요소:
 * - SubHeader (뒤로가기, 가이드북, 마이페이지 버튼)
 * - 메인 헤더 숨기기 처리
 * - 페이지 컨테이너 스타일링
 *
 * 적용 페이지:
 * - /partner/campaign/create/delivery
 * - /partner/campaign/create/mission
 * - /partner/campaign/create/reporter
 * - /partner/campaign/create/review
 * - /partner/campaign/create/visit
 */

"use client";

import SubHeader from "@/components/fragments/SubHeader";

/**
 * 캠페인 생성 페이지들의 공통 레이아웃 컴포넌트
 *
 * @param children - 하위 페이지 컴포넌트들
 *
 * 주요 기능:
 * 1. SubHeader 렌더링 (메인 헤더 숨기기는 SubHeader 컴포넌트 내부에서 처리)
 * 2. 페이지 컨테이너 스타일링
 */
export default function CampaignCreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* 서브헤더 컴포넌트 - 모든 캠페인 생성 페이지에서 공통으로 사용 */}
      <SubHeader />

      {/* 하위 페이지 컨텐츠 */}
      {children}
    </div>
  );
}
