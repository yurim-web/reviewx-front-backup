/* ========================================
   🚚 배송형 콘텐츠 내역 레이아웃 (/partner/campaign_contents/delivery/[id])
   ======================================== */

/**
 * 목적: 배송형 콘텐츠 상세(id 연동) 페이지의 공통 레이아웃 제공
 * 경로: /partner/campaign_contents/delivery/[id]
 */
import { ReactNode } from "react";
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";
import layoutStyles from "@/styles/partner/layout.module.css";

interface DeliveryContentsLayoutProps {
  children: ReactNode;
}

export default function DeliveryContentsLayout({
  children,
}: DeliveryContentsLayoutProps) {
  return (
    <div className={layoutStyles.container}>
      <PartnerSubHeader />
      {children}
    </div>
  );
}

export const metadata = {
  title: "배송형 콘텐츠 내역 | ReviewX",
  description: "배송형 콘텐츠 검수/완료 상세 페이지",
};
