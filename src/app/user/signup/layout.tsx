/* ========================================
   📝 유저 회원가입 페이지 레이아웃
   ======================================== */

/**
 * 유저 회원가입 페이지 전용 레이아웃
 *
 * 목적: 유저 회원가입 페이지에서만 적용되는 레이아웃 설정
 *
 * 주요 기능:
 * - 기본 헤더 표시
 * - 유저 회원가입 페이지 전용 스타일 적용
 */

import type { Metadata } from 'next';

// 유저 회원가입 페이지 메타데이터
export const metadata: Metadata = {
  title: 'ReviewX | 리뷰어 회원가입',
  description: 'ReviewX 유저 회원가입 페이지',
};

/**
 * 유저 회원가입 페이지 레이아웃 컴포넌트
 *
 * @param children - 유저 회원가입 페이지 컴포넌트
 */
export default function UserSignupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
