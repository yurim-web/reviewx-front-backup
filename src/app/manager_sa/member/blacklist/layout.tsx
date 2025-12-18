/* ========================================
   🔧 SA 관리자 차단내역 레이아웃
   ======================================== */

/**
 * SA 관리자 차단내역 레이아웃
 *
 * 목적: 차단내역 페이지의 메타데이터를 설정하는 레이아웃 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /manager_sa/member/blacklist (차단내역 페이지)
 *
 * 주요 기능:
 * - 페이지 메타데이터 설정 (제목, 설명)
 * - 부모 레이아웃(manager_sa/layout.tsx)을 상속받아 헤더와 사이드바가 자동으로 표시됩니다
 *
 */

import { Metadata } from "next";

// 페이지 메타데이터 설정

export const metadata: Metadata = {
  title: "ReviewX | 이용 제한 내역",
  description: "SA 관리자 이용 제한 내역 페이지입니다",
};

/**
 * SA 관리자 차단내역 레이아웃 컴포넌트
 *
 * @param children - 하위 페이지 컴포넌트 (Next.js가 자동으로 전달)
 * @returns 레이아웃으로 감싼 페이지 컴포넌트
 *
 */
export default function BlacklistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // children만 반환하면 부모 레이아웃이 자동으로 적용됩니다
  return <>{children}</>;
}
