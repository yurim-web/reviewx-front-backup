/* ========================================
   🔧 SA 관리자 레이아웃
   ======================================== */

/**
 * SA 관리자 레이아웃
 *
 * 목적: SA 관리자 페이지들의 공통 레이아웃을 제공하는 레이아웃 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /manager_sa (SA 관리자 메인 페이지 및 하위 페이지들)
 *
 * 주요 기능:
 * - 페이지 메타데이터 설정 (제목, 설명)
 * - 공통 레이아웃 구조 제공
 * - SA 관리자 전용 헤더 및 사이드바 메뉴
 *
 */

import { Metadata } from "next";
import ManagerGAHeader from "@/components/manager/ga/common/ManagerGAHeader";
import SidebarMenu from "@/components/manager/sa/common/SidebarMenu";
import ManagerLayoutScript from "@/components/manager/common/ManagerLayoutScript";
// 관리자 페이지 전용 레이아웃 스타일 (전역 main 태그의 max-width 제한 제거)
// 일반 CSS 파일이므로 전역 스타일을 적용할 수 있습니다
import "@/styles/manager_ga/layout.css";

// 페이지 메타데이터 설정
// Next.js의 Metadata API를 사용하여 SEO와 브라우저 탭 제목을 설정합니다
export const metadata: Metadata = {
  title: "ReviewX | SA 관리자",
  description: "SA 관리자 페이지입니다",
};

/**
 * SA 관리자 레이아웃 컴포넌트
 *
 * @param children - 하위 페이지 컴포넌트 (Next.js가 자동으로 전달)
 * @returns 레이아웃으로 감싼 페이지 컴포넌트
 */
export default function ManagerSALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* SA 관리자 전용 헤더 (현재는 GA 헤더 재사용) */}
      <ManagerGAHeader managerType="sa" />
      {/* SA 관리자 사이드바 메뉴 (현재는 GA 사이드바 재사용) */}
      <SidebarMenu />
      {/* 관리자 레이아웃 스타일 적용을 위한 스크립트 */}
      <ManagerLayoutScript />
      {/* 하위 페이지 컴포넌트 */}
      {children}
    </>
  );
}
