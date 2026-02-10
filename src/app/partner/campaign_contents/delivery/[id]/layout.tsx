/* ========================================
   🚚 배송형 콘텐츠 내역 레이아웃 (/partner/campaign_contents/delivery/[id])
   ======================================== */

/**
 * 목적: 배송형 콘텐츠 상세(id 연동) 페이지의 공통 레이아웃 제공
 * 경로: /partner/campaign_contents/delivery/[id]
 */
import { ReactNode } from "react";
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";
import layoutStyles from "@/styles/partner/partner_layout.module.css";
import campaignAppStyles from "@/styles/partner/campaign_application/campaign_application.module.css";

interface DeliveryContentsLayoutProps {
  children: ReactNode;
}

export default function DeliveryContentsLayout({
  children,
}: DeliveryContentsLayoutProps) {
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
  title: "배송형 콘텐츠 내역 | ReviewX",
  description: "배송형 콘텐츠 검수/완료 상세 페이지",
};
