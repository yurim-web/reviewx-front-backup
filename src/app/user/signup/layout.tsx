/* ========================================
   유저 회원가입 레이아웃
   ======================================== */

import type { Metadata } from 'next';

// 유저 회원가입 페이지 메타데이터
export const metadata: Metadata = {
  title: 'ReviewX | 리뷰어 회원가입',
  description: 'ReviewX 유저 회원가입 페이지',
};
export default function UserSignupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
