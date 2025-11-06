/* ========================================
   🏢 파트너 캠페인 관리 메인 페이지
   ======================================== */

/**
 * 파트너 캠페인 관리 메인 페이지
 *
 * 목적: 파트너가 생성한 캠페인들을 관리하고 모니터링하는 페이지입니다.
 * 이제 공통 헤더 컴포넌트를 사용하여 중복 코드를 제거합니다.
 *
 * 페이지 경로:
 * - /partner/campaign_management (전체 탭)
 *
 * 사용 파일:
 * - 컴포넌트: PartnerCampaignManagementHeader, CampaignList
 * - 타입: MainTab, PartnerStatTab
 * - CSS: layout.module.css
 *
 * 주요 기능:
 * - 캠페인/포인트 탭 네비게이션
 * - 캠페인 상태별 통계 표시 (전체/예정/신청/진행/종료/취소)
 * - 상태별 캠페인 목록 필터링 및 표시
 * - 캠페인별 액션 버튼 (수정, 삭제, 검수 등)
 */

"use client";

import { useState, useEffect } from "react";
import PartnerCampaignManagementHeader from "@/components/partner/campaign_management/PartnerCampaignManagementHeader";
import CampaignList from "@/components/partner/campaign_management/CampaignList";
import CampaignFilterBar from "@/components/partner/campaign_management/CampaignFilterBar";
import type { PartnerMainTab } from "@/types/partner/partner";
import type { PartnerStatTab } from "@/types/partner/partner";
import type { PartnerCampaign } from "@/types/partner/partner";
import layoutStyles from "../../../styles/partner/layout.module.css";

// 공용 데이터 import
import {
  convertToPartnerCampaigns,
  getCampaignsByTab,
} from "@/data/partner/sharedCampaigns";

/**
 * 파트너 캠페인 관리 메인 페이지 컴포넌트
 */
export default function PartnerCampaignManagementPage() {
  // 상단 메인 탭 상태 (캠페인 / 포인트)
  const [activeTab, setActiveTab] = useState<PartnerMainTab>("campaign");

  // 통계 탭 상태 (전체 / 예정 / 신청 / 진행 / 종료 / 취소)
  const [activeStatTab, setActiveStatTab] = useState<PartnerStatTab>("전체");

  // 필터링된 캠페인 목록 상태
  const [filteredCampaigns, setFilteredCampaigns] = useState<PartnerCampaign[]>([]);

  // 탭별 캠페인 목록 가져오기
  const campaigns = getCampaignsByTab(activeStatTab);

  /**
   * 통계 탭 변경 핸들러
   * 각 탭 클릭 시 해당 페이지로 이동
   */
  const handleStatTabChange = (tab: PartnerStatTab) => {
    switch (tab) {
      case "전체":
        // 현재 페이지이므로 아무것도 하지 않음
        break;
      case "예정":
        window.location.href = "/partner/campaign_management/scheduled";
        break;
      case "신청":
        window.location.href = "/partner/campaign_management/applied";
        break;
      case "진행":
        window.location.href = "/partner/campaign_management/progress";
        break;
      case "종료":
        window.location.href = "/partner/campaign_management/completed";
        break;
      case "취소":
        window.location.href = "/partner/campaign_management/cancelled";
        break;
      case "패널티":
        window.location.href = "/partner/campaign_management/penalty";
        break;
    }
  };

  /**
   * 필터링된 캠페인 목록 변경 핸들러
   *
   * 설명:
   * - CampaignFilterBar 컴포넌트에서 필터링된 결과를 받아서 상태를 업데이트합니다.
   * - 이제 필터링 로직은 CampaignFilterBar 내부에서 처리됩니다.
   */
  const handleFilteredCampaignsChange = (filtered: PartnerCampaign[]) => {
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
        <PartnerCampaignManagementHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeStatTab={activeStatTab}
          setActiveStatTab={handleStatTabChange}
        />

        {/* 필터 바: 유형, 채널 필터 및 검색 */}
        <CampaignFilterBar
          campaigns={campaigns}
          onFilteredCampaignsChange={handleFilteredCampaignsChange}
        />

        {/* 필터링된 캠페인 목록 */}
        <CampaignList
          campaigns={filteredCampaigns}
          activeStatTab={activeStatTab}
        />
      </div>
    </div>
  );
}
