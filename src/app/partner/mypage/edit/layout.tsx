/* ========================================
   파트너 내 정보 수정 레이아웃
   ======================================== */

/**
 * PartnerEditLayout
 *
 * 목적: 파트너 내 정보 수정 페이지에 메타데이터를 제공하는 레이아웃
 *
 * 사용 페이지:
 * - /partner/mypage/edit
 */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 파트너 내 정보 수정",
  description: "파트너 내정보를 수정하세요",
};

export default function PartnerEditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
