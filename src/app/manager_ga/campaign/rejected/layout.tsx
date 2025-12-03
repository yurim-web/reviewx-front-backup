/* ========================================
   🔧 GA 관리자 반려내역 레이아웃
   ======================================== */

/**
 * GA 관리자 반려내역 레이아웃
 *
 * 목적: 반려내역 페이지의 메타데이터를 설정하는 레이아웃 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /manager_ga/campaign/rejected (반려내역 페이지)
 *
 * 주요 기능:
 * - 페이지 메타데이터 설정 (제목, 설명)
 * - 부모 레이아웃(manager_ga/layout.tsx)을 상속받아 헤더와 사이드바가 자동으로 표시됩니다
 *
 */

import { Metadata } from 'next';

// 페이지 메타데이터 설정
// Next.js의 Metadata API를 사용하여 SEO와 브라우저 탭 제목을 설정합니다
export const metadata: Metadata = {
  title: 'ReviewX | 캠페인 반려내역',
  description: 'GA 관리자 캠페인 반려내역 페이지입니다',
};

/**
 * GA 관리자 반려내역 레이아웃 컴포넌트
 *
 * @param children - 하위 페이지 컴포넌트 (Next.js가 자동으로 전달)
 * @returns 레이아웃으로 감싼 페이지 컴포넌트
 */
export default function RejectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // children을 그대로 반환하여 페이지 컴포넌트를 렌더링합니다
  // 부모 레이아웃(manager_ga/layout.tsx)이 헤더와 사이드바를 제공하므로
  // 여기서는 메타데이터만 설정하면 됩니다
  return <>{children}</>;
}

