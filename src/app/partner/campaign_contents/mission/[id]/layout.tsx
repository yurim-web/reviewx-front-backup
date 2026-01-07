/* ========================================
   🎯 미션형 콘텐츠 내역 레이아웃 (/partner/campaign_contents/mission/[id])
   ======================================== */
import { ReactNode } from "react";
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";
import layoutStyles from "@/styles/partner/layout.module.css";

interface MissionContentsLayoutProps {
  children: ReactNode;
}

export default function MissionContentsLayout({
  children,
}: MissionContentsLayoutProps) {
  return (
    <div className={layoutStyles.container}>
      <PartnerSubHeader />
      {children}
    </div>
  );
}

export const metadata = {
  title: "미션형 콘텐츠 내역 | ReviewX",
  description: "미션형 콘텐츠 검수/완료 상세 페이지",
};

