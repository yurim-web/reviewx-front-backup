/* ========================================
   📰 기자단 콘텐츠 내역 레이아웃 (/partner/campaign_contents/reporter/[id])
   ======================================== */
import { ReactNode } from "react";
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";
import layoutStyles from "@/styles/partner/layout.module.css";
import campaignAppStyles from "@/styles/partner/campaign_application/campaign_application.module.css";

interface ReporterContentsLayoutProps {
  children: ReactNode;
}

export default function ReporterContentsLayout({
  children,
}: ReporterContentsLayoutProps) {
  return (
    <div className={campaignAppStyles.campaign_application_wrapper}>
      <PartnerSubHeader />
      <div className={layoutStyles.container}>
        {children}
      </div>
    </div>
  );
}

export const metadata = {
  title: "기자단 콘텐츠 내역 | ReviewX",
  description: "기자단 콘텐츠 검수/완료 상세 페이지",
};

