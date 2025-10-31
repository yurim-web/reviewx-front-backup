/* ========================================
   📍 방문형 캠페인 수정 레이아웃
   ======================================== */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 캠페인 수정 - 방문형",
  description: "방문형 캠페인을 수정하세요",
};

export default function VisitCampaignEditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

