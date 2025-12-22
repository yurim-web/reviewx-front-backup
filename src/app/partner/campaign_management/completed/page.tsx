/* ========================================
   ✅ 종료 탭 페이지 (통합 레이아웃 사용)
   ======================================== */

/**
 * 종료 탭 페이지
 *
 * 목적: 종료 상태의 캠페인 목록을 보여주는 페이지입니다.
 * 이제 공통 헤더 컴포넌트를 사용하여 중복 코드를 제거합니다.
 *
 * 페이지 경로:
 * - /partner/campaign_management/completed
 *
 * 주요 기능:
 * - 종료 상태의 캠페인 목록 표시
 * - 캠페인별 액션 버튼 (수정, 삭제, 검수 등)
 * - 공통 헤더 컴포넌트 사용으로 일관성 보장
 * - URL 기반 라우팅으로 새로고침 시에도 페이지 유지
 */

"use client";

import { useState, useEffect } from "react";
import PartnerCampaignManagementHeader from "@/components/partner/campaign_management/PartnerCampaignManagementHeader";
import CampaignList from "@/components/partner/campaign_management/CampaignList";
import CampaignFilterBar from "@/components/common/campaign_management/CampaignFilterBar";
import type { PartnerMainTab } from "@/types/partner/partner";
import type { PartnerStatTab } from "@/types/partner/partner";
import type { PartnerCampaign } from "@/types/partner/partner";
import layoutStyles from "../../../../styles/partner/layout.module.css";

// 공용 데이터 import
import { getCampaignsByTab } from "@/data/partner/sharedCampaigns";

/**
 * 종료 탭 페이지 컴포넌트
 */
export default function CompletedPage() {
  // 상단 메인 탭 상태 (캠페인 / 포인트)
  const [activeTab, setActiveTab] = useState<PartnerMainTab>("campaign");

  // 통계 탭 상태 - 종료 탭이 활성화된 상태로 설정
  const [activeStatTab, setActiveStatTab] = useState<PartnerStatTab>("종료");

  // 필터링된 캠페인 목록 상태
  const [filteredCampaigns, setFilteredCampaigns] = useState<PartnerCampaign[]>(
    []
  );

  // 탭별 캠페인 목록 가져오기
  const campaigns = getCampaignsByTab(activeStatTab);

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
