/* ========================================
   📝 신청 탭 전용 페이지
   ======================================== */

/**
 * 신청 탭 전용 페이지
 *
 * 목적: 신청 상태의 캠페인 목록을 보여주는 독립적인 페이지입니다.
 *
 * 페이지 경로:
 * - /user/campaign_management/applied
 *
 * 주요 기능:
 * - 신청 상태의 캠페인 목록 표시
 * - 캠페인별 액션 버튼 (신청 취소 등)
 * - URL 기반 라우팅으로 새로고침 시에도 페이지 유지
 */

"use client";

import { useState, useEffect } from "react";
import CampaignManagementHeader from "@/components/user/campaign_management/CampaignManagementHeader";
import CampaignList from "@/components/user/campaign_management/CampaignList";
import CampaignFilterBar from "@/components/partner/campaign_management/CampaignFilterBar";
import type { MainTab } from "@/types/user/user";
import type { CampaignApplication } from "@/types/user/user";
import layoutStyles from "../../../../styles/user/campaign_management/layout.module.css";

// 임시 데이터 import
import { getCampaignsByTab } from "@/data/user/campaign_management/campaignManagementData";

/**
 * 신청 탭 전용 페이지 컴포넌트
 */
export default function AppliedPage() {
  // 상단 메인 탭 상태 (캠페인 / 포인트)
  const [activeTab, setActiveTab] = useState<MainTab>("campaign");

  // 통계 탭 상태 - 신청 탭이 활성화된 상태로 설정
  const [activeStatTab, setActiveStatTab] = useState<
    "신청" | "선정" | "완료" | "취소/반려" | "패널티"
  >("신청");

  // 필터링된 캠페인 목록 상태
  const [filteredCampaigns, setFilteredCampaigns] = useState<CampaignApplication[]>([]);

  // 탭별 캠페인 목록 가져오기
  const campaigns = getCampaignsByTab(activeStatTab);

  /**
   * 필터링된 캠페인 목록 변경 핸들러
   *
   * 설명:
   * - CampaignFilterBar 컴포넌트에서 필터링된 결과를 받아서 상태를 업데이트합니다.
   * - 이제 필터링 로직은 CampaignFilterBar 내부에서 처리됩니다.
   */
  const handleFilteredCampaignsChange = (filtered: CampaignApplication[]) => {
    setFilteredCampaigns(filtered);
  };

  /**
   * 탭 변경 시 캠페인 목록 초기화
   *
   * 설명:
   * - 탭이 변경되면 새로운 캠페인 목록을 가져옵니다.
   * - 필터 바에 새로운 캠페인 목록을 전달합니다.
   */
  useEffect(() => {
    const newCampaigns = getCampaignsByTab(activeStatTab);
    // 필터 바가 자동으로 필터링하여 결과를 반환합니다.
  }, [activeStatTab]);

  return (
    <div className={layoutStyles.container}>
      {/* 메인 컨텐츠 영역 */}
      <div className={layoutStyles.main_content}>
        {/* 공통 헤더: 상단 탭 네비게이션 + 통계 탭 */}
        <CampaignManagementHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeStatTab={activeStatTab}
        />

        {/* 필터 바: 유형, 채널 필터 및 검색 */}
        <CampaignFilterBar<CampaignApplication>
          campaigns={campaigns}
          onFilteredCampaignsChange={handleFilteredCampaignsChange}
        />

        {/* 필터링된 캠페인 목록 */}
        <CampaignList campaigns={filteredCampaigns} activeStatTab="신청" />
      </div>
    </div>
  );
}
