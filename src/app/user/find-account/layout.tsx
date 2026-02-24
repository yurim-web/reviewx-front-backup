/* ========================================
   유저 계정 찾기 레이아웃
   ======================================== */

import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "ReviewX | 사용자 계정찾기",
};

export default function UserFindAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
