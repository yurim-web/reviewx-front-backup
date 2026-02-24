/* ========================================
   파트너 마이페이지 레이아웃
   ======================================== */

/**
 * PartnerMypageLayout
 *
 * 목적: 파트너 마이페이지에 메타데이터를 제공하는 레이아웃
 *
 * 사용 페이지:
 * - /partner/mypage
 */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 파트너 마이페이지",
  description: "파트너 마이페이지",
};

export default function PartnerMypageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
