/* ========================================
   🔐 소셜 로그인 페이지 레이아웃
   ======================================== */

/**
 * 소셜 로그인 페이지 전용 레이아웃
 *
 * 목적: 소셜 로그인 페이지에서만 적용되는 레이아웃 설정
 *
 * 주요 기능:
 * - 기본 헤더 숨김 처리
 * - 소셜 로그인 페이지 전용 스타일 적용
 *
 * - Next.js App Router의 layout.tsx
 * - 페이지별 레이아웃 커스터마이징
 * - children prop으로 하위 페이지 렌더링
 * - Metadata API: SEO를 위한 메타데이터 설정
 */

import type { Metadata } from 'next';

// 소셜 로그인 페이지 메타데이터
export const metadata: Metadata = {
  title: 'ReviewX | 소셜 로그인',
  description: 'ReviewX 소셜 로그인 페이지 - 네이버, 카카오 소셜 로그인',
};

/**
 * 소셜 로그인 페이지 레이아웃 컴포넌트
 *
 * @param children - 소셜 로그인 페이지 컴포넌트
 *
 * - Readonly: 객체를 읽기 전용으로 만들어 불변성 보장
 * - React.ReactNode: React 컴포넌트가 렌더링할 수 있는 모든 타입
 */
export default function SnsLoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
