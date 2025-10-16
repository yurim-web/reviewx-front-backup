/* ========================================
   📊 캠페인 관리 레이아웃
   ======================================== */

/**
 * 캠페인 관리 레이아웃
 *
 * 목적: 캠페인 관리 페이지들의 공통 레이아웃을 제공하는 레이아웃 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /user/campaign_management (캠페인 관리 메인 페이지)
 *
 * 주요 기능:
 * - 페이지 메타데이터 설정 (제목, 설명)
 * - 공통 레이아웃 구조 제공
 */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 캠페인 관리",
  description: "신청한 캠페인을 관리하고 상태를 확인하세요",
};

export default function CampaignManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
