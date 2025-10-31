/* ========================================
   💰 파트너 포인트 충전 레이아웃
   ======================================== */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 파트너 포인트 충전",
  description: "파트너 포인트를 충전하세요",
};

export default function PartnerPointChargeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

