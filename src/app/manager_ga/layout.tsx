/* ========================================
   🔧 GA 관리자 레이아웃
   ======================================== */

/**
 * GA 관리자 레이아웃
 *
 * 목적: GA 관리자 페이지들의 공통 레이아웃을 제공하는 레이아웃 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /manager_ga (GA 관리자 메인 페이지 및 하위 페이지들)
 *
 * 주요 기능:
 * - 페이지 메타데이터 설정 (제목, 설명)
 * - 공통 레이아웃 구조 제공
 * - GA 관리자 전용 헤더 및 사이드바 메뉴
 *
 * 학습 포인트:
 * - Next.js의 layout.tsx는 해당 경로와 하위 경로의 모든 페이지에 적용됩니다
 * - metadata는 서버 컴포넌트에서만 export할 수 있습니다
 * - children prop은 하위 페이지 컴포넌트를 의미합니다
 * - 레이아웃 컴포넌트는 모든 하위 페이지에 공통으로 적용됩니다
 */

import { Metadata } from 'next';
import ManagerGAHeader from '@/components/manager_ga/common/ManagerGAHeader';
import SidebarMenu from '@/components/manager_ga/common/SidebarMenu';
// 관리자 페이지 전용 레이아웃 스타일 (전역 main 태그의 max-width 제한 제거)
// 일반 CSS 파일이므로 전역 스타일을 적용할 수 있습니다
import '@/styles/manager_ga/layout.css';

// 페이지 메타데이터 설정
// Next.js의 Metadata API를 사용하여 SEO와 브라우저 탭 제목을 설정합니다
export const metadata: Metadata = {
  title: 'ReviewX | GA 관리자 대시보드',
  description: 'GA 관리자 페이지입니다',
};

/**
 * GA 관리자 레이아웃 컴포넌트
 *
 * @param children - 하위 페이지 컴포넌트 (Next.js가 자동으로 전달)
 * @returns 레이아웃으로 감싼 페이지 컴포넌트
 */
export default function ManagerGALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* GA 관리자 전용 헤더 */}
      <ManagerGAHeader />
      {/* GA 관리자 사이드바 메뉴 */}
      <SidebarMenu />
      {/* 하위 페이지 컴포넌트 */}
      {children}
    </>
  );
}
