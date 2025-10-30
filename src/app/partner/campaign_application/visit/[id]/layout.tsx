/* ========================================
   🏢 방문형 캠페인 신청내역 레이아웃
   ======================================== */

/**
 * 방문형 캠페인 신청내역 페이지 레이아웃
 *
 * 목적: 방문형 캠페인 신청내역 페이지들의 공통 레이아웃(UI 뼈대)을 제공합니다.
 *
 * 주요 기능:
 * - PartnerHeader 컴포넌트 표시 (파트너 전용 상단 헤더)
 * - 페이지별 공통 컨테이너 스타일 적용
 * - 메타데이터 설정 (브라우저 탭 제목/설명)
 *
 * 🎓 학습 포인트: Next.js 레이아웃 시스템
 * - 레이아웃은 동일 경로 아래의 모든 page.tsx를 감싸는 공통 UI입니다.
 * - 자식 페이지는 children prop으로 전달되어 렌더링됩니다.
 */

import { Metadata } from "next";
import PartnerHeader from "@/components/fragments/PartnerHeader";
import layoutStyles from "@/styles/partner/layout.module.css";

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
      {/* 파트너 전용 헤더 */}
      <PartnerHeader />

      {/* 자식 페이지 콘텐츠 영역 */}
      {children}
    </div>
  );
}
