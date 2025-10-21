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

import { useState } from "react";
import TabNavigation from "@/components/user/campaign_management/TabNavigation";
import StatisticsTab from "@/components/user/campaign_management/StatisticsTab";
import CampaignList from "@/components/user/campaign_management/CampaignList";
import PenaltyContent from "@/components/user/campaign_management/PenaltyContent";
import type { CampaignApplication, MainTab } from "@/types/campaignManagement";
import layoutStyles from "../../../styles/user/campaign_management/layout.module.css";
import cardStyles from "../../../styles/user/campaign_management/campaign_card.module.css";

// 임시 데이터 import
import {
  campaignManagementData,
  campaignManagementStats,
} from "@/data/user/campaign_management/campaignManagementData";

/**
 * 캠페인 관리 메인 페이지 컴포넌트
 */
export default function CampaignManagementPage() {
  // 상단 메인 탭 상태 (캠페인 / 포인트)
  const [activeTab, setActiveTab] = useState<MainTab>("campaign");

  // 통계 탭 상태 (신청 / 선정 / 완료 / 취소반려 / 패널티)
  // 메뉴부분
  const [activeStatTab, setActiveStatTab] = useState<
    "신청" | "선정" | "완료" | "취소/반려" | "패널티"
  >("신청");

  // 임시 데이터에서 통계 정보 사용
  const stats = campaignManagementStats;

  return (
    <div className={layoutStyles.container}>
      {/* 메인 컨텐츠 영역 */}
      <div className={layoutStyles.main_content}>
        {/* 상단 탭 네비게이션: 캠페인/포인트/계정/커뮤니티 */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* 통계 탭: 신청/선정/완료/취소반려/패널티 */}
        <StatisticsTab
          activeStatTab={activeStatTab}
          setActiveStatTab={setActiveStatTab}
          stats={stats}
        />
        {/* 캠페인 목록 또는 패널티 내역 */}
        {activeStatTab === "패널티" ? (
          <div className={cardStyles.campaign_list}>
            <PenaltyContent />
          </div>
        ) : (
          <CampaignList
            campaigns={campaignManagementData}
            activeStatTab={activeStatTab}
          />
        )}
      </div>
    </div>
  );
}
