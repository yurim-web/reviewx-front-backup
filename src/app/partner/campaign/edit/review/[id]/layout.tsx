/* ========================================
   🛒 구매평 캠페인 수정 레이아웃
   ======================================== */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 캠페인 수정 - 구매평",
  description: "구매평 캠페인을 수정하세요",
};

export default function ReviewCampaignEditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

