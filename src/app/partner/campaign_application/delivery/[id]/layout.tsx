/* ========================================
   📦 배송형 캠페인 신청내역 레이아웃
   ======================================== */

/**
 * 배송형 캠페인 신청내역 레이아웃
 *
 * 목적: 배송형 캠페인 신청내역 페이지의 공통 레이아웃을 제공합니다.
 *
 * 사용 페이지:
 * - /partner/campaign_application/delivery/[id] (동적 라우팅)
 */

import { ReactNode } from "react";
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";
import layoutStyles from "@/styles/partner/partner_layout.module.css";

interface DeliveryCampaignLayoutProps {
  children: ReactNode;
}

/**
 * 배송형 캠페인 신청내역 레이아웃 컴포넌트
 */
export default function DeliveryCampaignLayout({ children }: DeliveryCampaignLayoutProps) {
  return (
    <div className={layoutStyles.container}>
      {/* 파트너 서브헤더 - 뒤로가기 버튼이 있는 서브헤더 */}
      <PartnerSubHeader />

      {/* 페이지 내용 - children으로 전달된 페이지 컴포넌트가 여기에 렌더링됩니다 */}
      {children}
    </div>
  );
}

export const metadata = {
  title: "배송형 캠페인 신청내역 | ReviewX",
  description: "배송형 캠페인의 신청자 관리 및 선정자 관리 페이지입니다.",
  keywords: ["배송형", "캠페인", "신청내역", "관리", "ReviewX"],
};
