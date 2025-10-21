/* ========================================
   🏢 파트너 캠페인 관리 메인 페이지
   ======================================== */

/**
 * 파트너 캠페인 관리 메인 페이지
 *
 * 목적: 파트너가 생성한 캠페인들을 관리하고 모니터링하는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner
 *
 * 사용 파일:
 * - 컴포넌트: TabNavigation, StatisticsTab, CampaignList
 * - 타입: MainTab
 * - CSS: layout.module.css, campaign_card.module.css
 *
 * 주요 기능:
 * - 캠페인/포인트 탭 네비게이션
 * - 캠페인 상태별 통계 표시 (전체/예정/신청/진행/종료/취소)
 * - 상태별 캠페인 목록 필터링 및 표시
 * - 캠페인별 액션 버튼 (수정, 삭제, 검수 등)
 */

"use client";

import { useState } from "react";
import TabNavigation from "@/components/partner/TabNavigation";
import StatisticsTab from "@/components/partner/StatisticsTab";
import CampaignList from "@/components/partner/CampaignList";
import PenaltyContent from "@/components/partner/PenaltyContent";
import type { MainTab } from "@/types/campaignManagement";
import layoutStyles from "../../styles/partner/layout.module.css";
import cardStyles from "../../styles/partner/campaign_card.module.css";

import type {
  PartnerStatTab,
  PartnerCampaignStats,
  PartnerCampaign,
} from "@/types/partner";

// 임시 데이터 import
import {
  partnerCampaigns,
  partnerCampaignStats,
} from "@/data/partner/partnerCampaigns";

/**
 * 파트너 캠페인 관리 메인 페이지 컴포넌트
 */
export default function PartnerCampaignPage() {
  // 상단 메인 탭 상태 (캠페인 / 포인트)
  const [activeTab, setActiveTab] = useState<MainTab>("campaign");

  // 통계 탭 상태 (전체 / 예정 / 신청 / 진행 / 종료 / 취소)
  const [activeStatTab, setActiveStatTab] = useState<PartnerStatTab>("전체");

  // 임시 데이터에서 통계 정보 사용
  const stats: PartnerCampaignStats = partnerCampaignStats;

  return (
    <div className={layoutStyles.container}>
      {/* 메인 컨텐츠 영역 */}
      <div className={layoutStyles.main_content}>
        {/* 상단 탭 네비게이션: 캠페인/포인트 */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* 통계 탭: 전체/예정/신청/진행/종료/취소 */}
        <StatisticsTab
          activeStatTab={activeStatTab}
          setActiveStatTab={setActiveStatTab}
          stats={stats}
        />

        {/* 캠페인 목록 */}
        <CampaignList
          campaigns={partnerCampaigns}
          activeStatTab={activeStatTab}
        />
      </div>
    </div>
  );
}
