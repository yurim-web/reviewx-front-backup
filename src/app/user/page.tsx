/* ========================================
   🏠 유저 메인 홈 페이지
   ======================================== */

/**
 * 유저 메인 홈 페이지
 *
 * 목적: 리뷰 캠페인 플랫폼의 메인 홈페이지로, 선정 확률 높은 캠페인과 인기 캠페인을 보여줍니다.
 *
 * 사용 페이지:
 * - /user (유저 메인 홈 페이지)
 */

import type { Metadata } from "next";
import HomePageClient from "@/components/main/HomePageClient";

// 페이지 메타데이터 설정
export const metadata: Metadata = {
  title: "ReviewX | 리뷰 캠페인 플랫폼",
  description: "리뷰 캠페인 플랫폼 메인 페이지입니다",
};

/**
 * 유저 메인 홈 페이지 컴포넌트
 *
 * @returns 유저 메인 홈 페이지 JSX 요소
 */
export default function UserHome() {
  return <HomePageClient />;
}
