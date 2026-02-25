/* ========================================
   SA 관리자 관리자 목록 페이지 레이아웃
   ======================================== */

/**
 * AdminsLayout
 *
 * 목적: 관리자 목록 페이지의 공통 레이아웃을 제공하는 레이아웃 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /manager_sa/member/admins (관리자 목록 페이지)
 */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 관리자 목록",
  description: "SA 관리자 관리자 목록 페이지입니다",
};

/**
 * 관리자 목록 페이지 레이아웃 컴포넌트
 *
 * @param children - 하위 페이지 컴포넌트 (Next.js가 자동으로 전달)
 * @returns 레이아웃으로 감싼 페이지 컴포넌트
 */
export default function AdminsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
