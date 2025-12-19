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
