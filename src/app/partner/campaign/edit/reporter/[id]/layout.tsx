/* ========================================
   📰 기자단 캠페인 수정 레이아웃
   ======================================== */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 캠페인 수정 - 기자단",
  description: "기자단 캠페인을 수정하세요",
};

export default function ReporterCampaignEditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

