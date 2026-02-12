/* ========================================
   🛒 구매평 캠페인 신청내역 페이지 레이아웃
   ======================================== */

/**
 * 구매평 캠페인 신청내역 페이지 레이아웃
 *
 * 목적: 구매평 캠페인 신청내역 페이지의 공통 레이아웃을 제공
 *
 * 주요 기능:
 * - PartnerHeader 컴포넌트 포함
 * - 페이지별 공통 스타일 적용
 * - 반응형 레이아웃 설정
 */

import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";
import layoutStyles from "@/styles/partner/partner_layout.module.css";

export default function ReviewCampaignApplicationLayout({
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
