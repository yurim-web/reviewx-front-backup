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

import PartnerHeader from "@/components/fragments/PartnerHeader";
import layoutStyles from "@/styles/partner/layout.module.css";

export default function ReviewCampaignApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={layoutStyles.container}>
      {/* 파트너 전용 헤더 */}
      <PartnerHeader />

      {/* 페이지 콘텐츠 */}
      {children}
    </div>
  );
}
