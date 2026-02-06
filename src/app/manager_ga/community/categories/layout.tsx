/* ========================================
   🔧 GA 관리자 카테고리 관리 레이아웃
   ======================================== */

/**
 * GA 관리자 카테고리 관리 레이아웃
 *
 * 목적: 카테고리 관리 페이지의 메타데이터를 설정하는 레이아웃 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /manager_ga/community/categories (카테고리 관리 페이지)
 * - /manager_ga/community/categories/create (카테고리 등록 페이지)
 * - /manager_ga/community/categories/[id]/edit (카테고리 수정 페이지)
 *
 * 주요 기능:
 * - 페이지 메타데이터 설정 (제목, 설명)
 * - 부모 레이아웃(manager_ga/layout.tsx)을 상속받아 헤더와 사이드바가 자동으로 표시됩니다
 *
 */

import { Metadata } from 'next';

// 페이지 메타데이터 설정
export const metadata: Metadata = {
  title: 'ReviewX | 카테고리 관리',
  description: 'GA 관리자 카테고리 관리 페이지입니다',
};

/**
 * GA 관리자 카테고리 관리 레이아웃 컴포넌트
 *
 * @param children - 하위 페이지 컴포넌트 (Next.js가 자동으로 전달)
 * @returns 레이아웃으로 감싼 페이지 컴포넌트
 *
 */
export default function ManagerGACategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

