/* ========================================
   🎯 미션형 캠페인 신청내역 페이지 레이아웃
   ======================================== */

/**
 * 미션형 캠페인 신청내역 페이지 레이아웃
 *
 * 목적: 미션형 캠페인 신청내역 페이지의 공통 레이아웃을 제공
 *
 * 주요 기능:
 * - PartnerHeader 컴포넌트 포함
 * - 페이지별 공통 스타일 적용
 * - 반응형 레이아웃 설정
 */

import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";
import layoutStyles from "@/styles/partner/partner_layout.module.css";

/**
 * 미션형 캠페인 신청내역 페이지 레이아웃 컴포넌트
 *
 *
 * 📌 Layout의 역할:
 * 1. 공통 UI 요소 (헤더, 네비게이션 등) 제공
 * 2. 페이지별 공통 스타일 적용
 * 3. children prop으로 페이지 콘텐츠 렌더링
 * 4. 중첩된 라우트에서 공통 레이아웃 유지
 */
export default function MissionCampaignApplicationLayout({
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
