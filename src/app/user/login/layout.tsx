/* ========================================
   유저 로그인 레이아웃
   ======================================== */

import type { Metadata } from "next";

// 사용자 로그인 페이지 메타데이터
export const metadata: Metadata = {
  title: "ReviewX | 사용자 로그인",
  description: "ReviewX 사용자 로그인 페이지 - 네이버, 카카오 로그인",
};

export default function UserLoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
