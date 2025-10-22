/* ========================================
   🏢 파트너 캠페인 관리 공통 헤더 컴포넌트
   ======================================== */

/**
 * 파트너 캠페인 관리 공통 헤더 컴포넌트
 *
 * 목적: 파트너 캠페인 관리 페이지들의 공통 상단 영역을 담당하는 컴포넌트입니다.
 * 상단 탭 네비게이션과 통계 탭을 포함합니다.
 *
 * 사용 페이지:
 * - /partner/campaign_management (전체 탭)
 * - /partner/campaign_management/scheduled (예정 탭)
 * - /partner/campaign_management/applied (신청 탭)
 * - /partner/campaign_management/progress (진행 탭)
 * - /partner/campaign_management/completed (종료 탭)
 * - /partner/campaign_management/cancelled (취소 탭)
 *
 * 주요 기능:
 * - 상단 메인 탭 네비게이션 (캠페인/포인트/계정)
 * - 통계 탭 네비게이션 (전체/예정/신청/진행/종료/취소)
 * - 각 페이지에서 재사용 가능한 공통 레이아웃
 * - 중복 코드 제거로 유지보수성 향상
 */

"use client";

import TabNavigation from "@/components/partner/TabNavigation";
import StatisticsTab from "@/components/partner/StatisticsTab";
import type { MainTab } from "@/types/campaignManagement";
import type { PartnerStatTab, PartnerCampaignStats } from "@/types/partner";

// 임시 데이터 import
import { partnerCampaignStats } from "@/data/partner/partnerCampaigns";

interface PartnerCampaignManagementHeaderProps {
  /** 현재 활성 메인 탭 (캠페인/포인트/계정) */
  activeTab: MainTab;
  /** 메인 탭 변경 핸들러 */
  setActiveTab: (tab: MainTab) => void;
  /** 현재 활성 통계 탭 (전체/예정/신청/진행/종료/취소) */
  activeStatTab: PartnerStatTab;
  /** 통계 탭 변경 핸들러 */
  setActiveStatTab: (tab: PartnerStatTab) => void;
}

/**
 * 파트너 캠페인 관리 공통 헤더 컴포넌트
 *
 * React 컴포넌트 구조:
 * - Props를 통해 상태와 핸들러를 받아서 사용
 * - 재사용 가능한 컴포넌트로 설계
 * - 각 페이지에서 동일한 헤더 구조를 제공
 * - 파트너 전용 탭과 통계 정보를 처리
 */
export default function PartnerCampaignManagementHeader({
  activeTab,
  setActiveTab,
  activeStatTab,
  setActiveStatTab,
}: PartnerCampaignManagementHeaderProps) {
  // 임시 데이터에서 통계 정보 사용
  const stats: PartnerCampaignStats = partnerCampaignStats;

  return (
    <>
      {/* 상단 탭 네비게이션: 캠페인/포인트/계정 */}
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 통계 탭: 전체/예정/신청/진행/종료/취소 */}
      <StatisticsTab
        activeStatTab={activeStatTab}
        setActiveStatTab={setActiveStatTab}
        stats={stats}
      />
    </>
  );
}
