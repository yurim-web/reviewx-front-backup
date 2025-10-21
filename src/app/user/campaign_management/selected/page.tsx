/* ========================================
   🎯 선정 탭 전용 페이지
   ======================================== */

/**
 * 선정 탭 전용 페이지
 *
 * 목적: 선정 상태의 캠페인 목록을 보여주는 독립적인 페이지입니다.
 *
 * 페이지 경로:
 * - /user/campaign_management/selected
 *
 * 주요 기능:
 * - 선정 상태의 캠페인 목록 표시
 * - 캠페인별 액션 버튼 (콘텐츠 등록, 구매 영수증 등록 등)
 * - URL 기반 라우팅으로 새로고침 시에도 페이지 유지
 */

"use client";

import { useState } from "react";
import TabNavigation from "@/components/user/campaign_management/TabNavigation";
import StatisticsTab from "@/components/user/campaign_management/StatisticsTab";
import CampaignList from "@/components/user/campaign_management/CampaignList";
import type { MainTab } from "@/types/campaignManagement";
import layoutStyles from "../../../../styles/user/campaign_management/layout.module.css";

// 임시 데이터 import
import {
  campaignManagementData,
  campaignManagementStats,
} from "@/data/user/campaign_management/campaignManagementData";

/**
 * 선정 탭 전용 페이지 컴포넌트
 */
export default function SelectedPage() {
  // 상단 메인 탭 상태 (캠페인 / 포인트)
  const [activeTab, setActiveTab] = useState<MainTab>("campaign");

  // 통계 탭 상태 - 선정 탭이 활성화된 상태로 설정
  const [activeStatTab, setActiveStatTab] = useState<
    "신청" | "선정" | "완료" | "취소/반려" | "패널티"
  >("선정");

  // 임시 데이터에서 통계 정보 사용
  const stats = campaignManagementStats;

  /**
   * 통계 탭 변경 핸들러
   * 각 탭 클릭 시 해당 페이지로 이동
   */
  const handleStatTabChange = (
    tab: "신청" | "선정" | "완료" | "취소/반려" | "패널티"
  ) => {
    switch (tab) {
      case "신청":
        window.location.href = "/user/campaign_management/applied";
        break;
      case "선정":
        // 현재 페이지이므로 아무것도 하지 않음
        break;
      case "완료":
        window.location.href = "/user/campaign_management/completed";
        break;
      case "취소/반려":
        window.location.href = "/user/campaign_management/cancelled";
        break;
      case "패널티":
        window.location.href = "/user/campaign_management/penalty";
        break;
    }
  };

  return (
    <div className={layoutStyles.container}>
      {/* 메인 컨텐츠 영역 */}
      <div className={layoutStyles.main_content}>
        {/* 상단 탭 네비게이션: 캠페인/포인트/계정 */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* 통계 탭: 신청/선정/완료/취소반려/패널티 */}
        <StatisticsTab
          activeStatTab={activeStatTab}
          setActiveStatTab={handleStatTabChange}
          stats={stats}
        />

        {/* 선정 상태 캠페인 목록 */}
        <CampaignList campaigns={campaignManagementData} activeStatTab="선정" />
      </div>
    </div>
  );
}
