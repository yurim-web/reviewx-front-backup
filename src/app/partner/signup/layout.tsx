/* ========================================
   📝 파트너 회원가입 페이지 레이아웃
   ======================================== */

/**
 * 파트너 회원가입 페이지 레이아웃
 *
 * 목적: 파트너 회원가입 페이지의 공통 레이아웃을 제공합니다.
 */

import type { Metadata } from 'next';

// 파트너 회원가입 페이지 메타데이터
export const metadata: Metadata = {
  title: 'ReviewX | 파트너 회원가입',
  description: 'ReviewX 파트너 회원가입 페이지',
};

export default function PartnerSignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
