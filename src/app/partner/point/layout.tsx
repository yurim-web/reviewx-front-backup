/* ========================================
   💰 파트너 포인트 레이아웃
   ======================================== */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 파트너 포인트 관리",
  description: "파트너 포인트 내역을 확인하고 관리하세요",
};

export default function PartnerPointLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

