/* ========================================
   📊 캠페인 관리 메인 페이지
   ======================================== */

/**
 * 캠페인 관리 메인 페이지
 *
 * 목적: 사용자가 신청/선정/완료된 캠페인을 관리하고 패널티 정보를 확인하는 통합 관리 페이지입니다.
 *
 * 페이지 경로:
 * - /user/campaign_management
 *
 * 사용 파일:
 * - 컴포넌트: TabNavigation, StatisticsTab, CampaignList
 * - 타입: CampaignApplication, MainTab
 * - CSS: campaign_management.module.css
 *
 * 주요 기능:
 * - 캠페인 상태별 통계 표시 (신청/선정/완료/취소반려/패널티)
 * - 상태별 캠페인 목록 필터링 및 표시
 * - 캠페인별 액션 버튼 (신청 취소, 콘텐츠 등록, 패널티 해제 등)
 * - 상단 고정 탭 네비게이션 (캠페인/포인트/계정)
 * - 통계 탭 네비게이션 (상태별 필터링)
 * - 패널티 내역 및 현황 표시
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * 캠페인 관리 메인 페이지 컴포넌트
 * 신청 탭 페이지로 리다이렉트
 */
export default function CampaignManagementPage() {
  const router = useRouter();

  useEffect(() => {
    // 메인 캠페인 관리 페이지 접근 시 신청 탭으로 리다이렉트
    router.replace("/user/campaign_management/applied");
  }, [router]);

  // 리다이렉트 중에는 아무것도 렌더링하지 않음
  return null;
}
