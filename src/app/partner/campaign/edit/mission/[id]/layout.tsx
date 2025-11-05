/* ========================================
   🎯 미션형 캠페인 수정 레이아웃
   ======================================== */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 캠페인 수정 - 미션형",
  description: "미션형 캠페인을 수정하세요",
};

export default function MissionCampaignEditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

