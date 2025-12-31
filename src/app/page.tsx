/* ========================================
   🏠 메인 홈 페이지
   ======================================== */

/**
 * 메인 홈 페이지
 *
 * 목적: 리뷰 캠페인 플랫폼의 메인 홈페이지로, 선정 확률 높은 캠페인과 인기 캠페인을 보여줍니다.
 *
 * 페이지 경로:
 * - / (루트 경로)
 *
 * 사용 컴포넌트:
 * - HomePageClient (공통 컴포넌트)
 *
 * 주요 기능:
 * - 메인 배너 표시
 * - 선정 확률 높은 캠페인 섹션 (각 타입별 1-2개씩 선별)
 * - 지금 인기 많은 캠페인 섹션 (각 타입별 1-2개씩 선별)
 * - 진행 중인 캠페인 섹션 (전체 캠페인 중 최대 32개)
 * - 캠페인 상세 페이지로 이동
 * - 메인 메뉴 상단 고정
 */

import type { Metadata } from "next";
import HomePageClient from "@/components/main/HomePageClient";

// 페이지 메타데이터 설정
export const metadata: Metadata = {
  title: "ReviewX | 리뷰 캠페인 플랫폼",
  description: "리뷰 캠페인 플랫폼 메인 페이지입니다",
};

/**
 * 메인 홈 페이지 컴포넌트
 *
 * @returns 메인 홈 페이지 JSX 요소
 */
export default function Home() {
  return <HomePageClient />;
}
