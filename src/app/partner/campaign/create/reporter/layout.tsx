/* ========================================
   기자단 캠페인 등록 레이아웃
   ======================================== */

/**
 * ReporterCampaignLayout
 *
 * 목적: 기자단 캠페인 등록 페이지에 메타데이터를 제공하는 레이아웃
 *
 * 사용 페이지:
 * - /partner/campaign/create/reporter
 */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 새 캠페인 등록 - 기자단",
  description: "기자단 캠페인을 등록하고 관리하세요",
};

export default function ReporterCampaignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
