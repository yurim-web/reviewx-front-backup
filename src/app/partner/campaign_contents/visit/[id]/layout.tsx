/* ========================================
   🏢 방문형 캠페인 신청내역 레이아웃
   ======================================== */



import { Metadata } from "next";
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";
import layoutStyles from "@/styles/partner/layout.module.css";
import campaignAppStyles from "@/styles/partner/campaign_application/campaign_application.module.css";

// 메타데이터 설정 (브라우저 탭 제목/설명)
export const metadata: Metadata = {
  title: "방문형 캠페인 콘텐츠 내역 | ReviewX",
  description: "방문형 캠페인 콘텐츠 내역 페이지",
};

/**
 * 방문형 캠페인 콘텐츠 내역 레이아웃 컴포넌트
 *
 * @param children - 해당 경로의 페이지 컴포넌트 콘텐츠
 */
export default function VisitCampaignApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={campaignAppStyles.campaign_application_wrapper}>
      <PartnerSubHeader />
      <div className={layoutStyles.container}>
        {/* 자식 페이지 콘텐츠 영역 */}
        {children}
      </div>
    </div>
  );
}
