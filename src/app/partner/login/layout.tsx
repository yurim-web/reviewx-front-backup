/* ========================================
   🔐 파트너 로그인 페이지 레이아웃
   ======================================== */

/**
 * 파트너 로그인 페이지 전용 레이아웃
 *
 * 목적: 파트너 로그인 페이지에서만 적용되는 레이아웃 설정
 *
 * 주요 기능:
 * - 파트너 로그인 페이지 전용 메타데이터 설정
 * - 페이지별 레이아웃 커스터마이징
 */

import type { Metadata } from 'next';

// 파트너 로그인 페이지 메타데이터
export const metadata: Metadata = {
  title: '파트너 로그인 | ReviewX',
  description: 'ReviewX 파트너 로그인 페이지 - 아이디/비밀번호 로그인',
};

/**
 * 파트너 로그인 페이지 레이아웃 컴포넌트
 *
 * @param children - 파트너 로그인 페이지 컴포넌트
 */
export default function PartnerLoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
