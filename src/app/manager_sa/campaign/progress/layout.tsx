/* ========================================
   SA 관리자 진행 현황 레이아웃
   ======================================== */

/**
 * ProgressLayout
 *
 * 목적: 진행 현황 페이지의 메타데이터를 설정하는 레이아웃 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /manager_sa/campaign/progress (진행 현황 페이지)
 */

import { Metadata } from "next";

// 페이지 메타데이터 설정

export const metadata: Metadata = {
  title: "ReviewX | 캠페인 진행 현황",
  description: "SA 관리자 캠페인 진행 현황 페이지입니다",
};

/**
 * SA 관리자 진행 현황 레이아웃 컴포넌트
 *
 * @param children - 하위 페이지 컴포넌트 (Next.js가 자동으로 전달)
 * @returns 레이아웃으로 감싼 페이지 컴포넌트
 */
export default function ProgressLayout({ children }: { children: React.ReactNode }) {
  // children만 반환하면 부모 레이아웃이 자동으로 적용됩니다
  return <>{children}</>;
}
