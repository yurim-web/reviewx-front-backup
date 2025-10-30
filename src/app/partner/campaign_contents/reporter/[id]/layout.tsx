/* ========================================
   📰 기자단 콘텐츠 내역 레이아웃 (/partner/campaign_contents/reporter/[id])
   ======================================== */
import { ReactNode } from "react";
import PartnerHeader from "@/components/fragments/PartnerHeader";
import layoutStyles from "@/styles/partner/layout.module.css";

interface ReporterContentsLayoutProps {
  children: ReactNode;
}

export default function ReporterContentsLayout({
  children,
}: ReporterContentsLayoutProps) {
  return (
    <div className={layoutStyles.container}>
      <PartnerHeader />
      {children}
    </div>
  );
}

export const metadata = {
  title: "기자단 콘텐츠 내역 | ReviewX",
  description: "기자단 콘텐츠 검수/완료 상세 페이지",
};

