/* ========================================
   📦 배송형 캠페인 신청내역 레이아웃
   ======================================== */

/**
 * 배송형 캠페인 신청내역 레이아웃
 *
 * 목적: 배송형 캠페인 신청내역 페이지의 공통 레이아웃을 제공합니다.
 *
 * 페이지 경로:
 * - /partner/campaign_application/delivery/[id] (동적 라우팅)
 *
 * 주요 기능:
 * - 파트너 헤더 포함
 * - 페이지별 공통 스타일 적용
 * - 메타데이터 설정
 * - 공통 레이아웃 구조 제공
 */

import { ReactNode } from "react";
import PartnerHeader from "@/components/fragments/PartnerHeader";
import layoutStyles from "@/styles/partner/layout.module.css";

interface DeliveryCampaignLayoutProps {
  children: ReactNode;
}

/**
 * 배송형 캠페인 신청내역 레이아웃 컴포넌트
 *
 * 레이아웃 구조:
 * 1. 파트너 헤더 (모든 파트너 페이지 공통)
 * 2. 메인 컨테이너 (children으로 페이지 내용 포함)
 * 3. 공통 스타일 적용
 * 4. 메타데이터 설정
 */
export default function DeliveryCampaignLayout({
  children,
}: DeliveryCampaignLayoutProps) {
  return (
    <div className={layoutStyles.container}>
      {/* 파트너 헤더 - 모든 파트너 페이지에서 공통으로 사용 */}
      <PartnerHeader />

      {/* 페이지 내용 - children으로 전달된 페이지 컴포넌트가 여기에 렌더링됩니다 */}
      {children}
    </div>
  );
}

/**
 * 메타데이터 설정
 *
 * 메타데이터 기능:
 * 1. 페이지 제목 설정
 * 2. SEO 최적화
 * 3. 브라우저 탭 제목 표시
 * 4. 소셜 미디어 공유 시 표시될 정보
 */
export const metadata = {
  title: "배송형 캠페인 신청내역 | ReviewX",
  description: "배송형 캠페인의 신청자 관리 및 선정자 관리 페이지입니다.",
  keywords: ["배송형", "캠페인", "신청내역", "관리", "ReviewX"],
};
