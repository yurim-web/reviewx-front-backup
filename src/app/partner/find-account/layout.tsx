/* ========================================
   파트너 아이디/비밀번호 찾기 레이아웃
   ======================================== */

/**
 * PartnerFindAccountLayout
 *
 * 목적: 파트너 아이디/비밀번호 찾기 페이지에 메타데이터를 제공하는 레이아웃
 *
 * 사용 페이지:
 * - /partner/find-account
 */

import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "ReviewX | 파트너 아이디/비밀번호 찾기",
};

export default function PartnerFindAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
