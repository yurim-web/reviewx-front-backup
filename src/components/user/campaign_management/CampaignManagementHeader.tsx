/* ========================================
   📊 캠페인 관리 공통 헤더 컴포넌트
   ======================================== */

/**
 * 캠페인 관리 공통 헤더 컴포넌트
 *
 * 목적: 캠페인 관리 페이지들의 공통 상단 영역을 담당하는 컴포넌트입니다.
 * 상단 탭 네비게이션과 통계 탭을 포함합니다.
 *
 * 사용 페이지:
 * - /user/campaign_management/applied (신청 탭)
 * - /user/campaign_management/selected (선정 탭)
 * - /user/campaign_management/completed (완료 탭)
 * - /user/campaign_management/cancelled (취소/반려 탭)
 * - /user/campaign_management/penalty (패널티 탭)
 *
 * 주요 기능:
 * - 상단 메인 탭 네비게이션 (캠페인/포인트/계정)
 * - 통계 탭 네비게이션 (신청/선정/완료/취소반려/패널티)
 * - 각 페이지에서 재사용 가능한 공통 레이아웃
 * - 중복 코드 제거로 유지보수성 향상
 */

"use client";

import TabNavigation from "@/components/user/campaign_management/TabNavigation";
import StatisticsTab from "@/components/user/campaign_management/StatisticsTab";
import type { MainTab } from "@/types/user/user";

// 임시 데이터 import
import { campaignManagementStats } from "@/data/user/campaign_management/campaignManagementData";

interface CampaignManagementHeaderProps {
  /** 현재 활성 메인 탭 (캠페인/포인트/계정) */
  activeTab: MainTab;
  /** 메인 탭 변경 핸들러 */
  setActiveTab: (tab: MainTab) => void;
  /** 현재 활성 통계 탭 (신청/선정/완료/취소반려/패널티) */
  activeStatTab: "신청" | "선정" | "완료" | "취소/반려" | "패널티";
  /** 통계 탭 변경 핸들러 */
  setActiveStatTab: (
    tab: "신청" | "선정" | "완료" | "취소/반려" | "패널티"
  ) => void;
}

/**
 * 캠페인 관리 공통 헤더 컴포넌트
 *
 * React 컴포넌트 구조:
 * - Props를 통해 상태와 핸들러를 받아서 사용
 * - 재사용 가능한 컴포넌트로 설계
 * - 각 페이지에서 동일한 헤더 구조를 제공
 */
export default function CampaignManagementHeader({
  activeTab,
  setActiveTab,
  activeStatTab,
  setActiveStatTab,
}: CampaignManagementHeaderProps) {
  // 임시 데이터에서 통계 정보 사용
  const stats = campaignManagementStats;

  return (
    <>
      {/* 상단 탭 네비게이션: 캠페인/포인트/계정 */}
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 통계 탭: 신청/선정/완료/취소반려/패널티 */}
      <StatisticsTab
        activeStatTab={activeStatTab}
        setActiveStatTab={setActiveStatTab}
        stats={stats}
      />
    </>
  );
}
