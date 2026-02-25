/* ========================================
   🏢 방문형 캠페인 신청내역 레이아웃
   ======================================== */

/**
 * 방문형 캠페인 신청내역 페이지 레이아웃
 *
 * 목적: 방문형 캠페인 신청내역 페이지들의 공통 레이아웃(UI 뼈대)을 제공합니다.
 *
 * 사용 페이지:
 * - /partner/campaign_application/visit/[id] (동적 라우팅)
 */

import { Metadata } from "next";
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";
import layoutStyles from "@/styles/partner/partner_layout.module.css";

// 메타데이터 설정 (브라우저 탭 제목/설명)
export const metadata: Metadata = {
  title: "방문형 캠페인 신청내역 | ReviewX",
  description: "방문형 캠페인 신청자 관리 페이지",
};

/**
 * 방문형 캠페인 신청내역 레이아웃 컴포넌트
 *
 * @param children - 해당 경로의 페이지 컴포넌트 콘텐츠
 */
export default function VisitCampaignApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={layoutStyles.container}>
      {/* 파트너 서브헤더 - PC에서만 표시, 모바일에서 숨김 */}
      <div className={layoutStyles.partner_sub_header_wrapper}>
        <PartnerSubHeader />
      </div>

      {/* 자식 페이지 콘텐츠 영역 */}
      {children}
    </div>
  );
}
