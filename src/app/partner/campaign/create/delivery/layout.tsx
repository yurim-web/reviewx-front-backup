/* ========================================
   배송형 캠페인 등록 레이아웃
   ======================================== */

/**
 * DeliveryCampaignLayout
 *
 * 목적: 배송형 캠페인 등록 페이지에 메타데이터를 제공하는 레이아웃
 *
 * 사용 페이지:
 * - /partner/campaign/create/delivery
 */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 새 캠페인 등록 - 배송형",
  description: "배송형 캠페인을 등록하고 관리하세요",
};

export default function DeliveryCampaignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
