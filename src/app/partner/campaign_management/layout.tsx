/* ========================================
   파트너 캠페인 관리 레이아웃
   ======================================== */

/**
 * CampaignManagementLayout
 *
 * 목적: 파트너 캠페인 관리 페이지에 메타데이터를 제공하는 레이아웃
 *
 * 사용 페이지:
 * - /partner/campaign_management
 */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 파트너 캠페인 관리",
  description: "파트너 캠페인 관리 대시보드",
};

export default function CampaignManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
