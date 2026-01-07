/* ========================================
   📰 기자단 캠페인 신청내역 레이아웃
   ======================================== */

/**
 * 기자단 캠페인 신청내역 페이지 레이아웃
 *
 * 목적: 기자단 캠페인 신청내역 페이지의 공통 레이아웃을 제공합니다.
 *
 * 주요 기능:
 * - PartnerHeader 컴포넌트 표시
 * - 페이지별 공통 스타일 적용
 * - 메타데이터 설정
 */

import { Metadata } from "next";
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";
import layoutStyles from "@/styles/partner/layout.module.css";

// 메타데이터 설정
export const metadata: Metadata = {
  title: "기자단 캠페인 신청내역 | ReviewX",
  description: "기자단 캠페인 신청자 관리 페이지",
};

/**
 * 기자단 캠페인 신청내역 레이아웃 컴포넌트
 *
 *
 * 📌 레이아웃의 역할:
 * 1. 공통 UI 요소 제공 (헤더, 네비게이션 등)
 * 2. 페이지별 공통 스타일 적용
 * 3. 메타데이터 설정
 * 4. children prop으로 페이지 콘텐츠 렌더링
 *
 * @param children - 페이지 컴포넌트 (page.tsx)
 */
export default function ReporterCampaignApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={layoutStyles.container} >
      {/* 파트너 서브헤더 - 뒤로가기 버튼이 있는 서브헤더 */}
      <PartnerSubHeader />

      {/* 페이지 콘텐츠 */}
      {children}
    </div>
  );
}
