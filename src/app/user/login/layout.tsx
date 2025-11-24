/* ========================================
   🔐 사용자 로그인 페이지 레이아웃
   ======================================== */

/**
 * 사용자 로그인 페이지 전용 레이아웃
 *
 * 목적: 사용자 로그인 페이지에서만 적용되는 레이아웃 설정
 *
 * 주요 기능:
 * - 기본 헤더 숨김 처리
 * - 사용자 로그인 페이지 전용 스타일 적용
 *
 * 🎓 학습 포인트:
 * - Next.js App Router의 layout.tsx
 * - 페이지별 레이아웃 커스터마이징
 * - children prop으로 하위 페이지 렌더링
 * - Metadata API: SEO를 위한 메타데이터 설정
 */

import type { Metadata } from 'next';

// 사용자 로그인 페이지 메타데이터
export const metadata: Metadata = {
  title: 'ReviewX | 로그인',
  description: 'ReviewX 사용자 로그인 페이지 - 아이디/비밀번호 로그인',
};

/**
 * 사용자 로그인 페이지 레이아웃 컴포넌트
 *
 * @param children - 사용자 로그인 페이지 컴포넌트
 *
 */
export default function UserLoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
