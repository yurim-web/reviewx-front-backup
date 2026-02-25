/* ========================================
   🎯 미션형 캠페인 신청내역 페이지 레이아웃
   ======================================== */

/**
 * 미션형 캠페인 신청내역 페이지 레이아웃
 *
 * 목적: 미션형 캠페인 신청내역 페이지의 공통 레이아웃을 제공
 *
 * 사용 페이지:
 * - /partner/campaign_application/mission/[id] (동적 라우팅)
 */

import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";
import layoutStyles from "@/styles/partner/partner_layout.module.css";

/**
 * 미션형 캠페인 신청내역 페이지 레이아웃 컴포넌트
 */
export default function MissionCampaignApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={layoutStyles.container}>
      {/* 파트너 서브헤더 - 뒤로가기 버튼이 있는 서브헤더 */}
      <PartnerSubHeader />

      {/* 페이지 콘텐츠 */}
      {children}
    </div>
  );
}
