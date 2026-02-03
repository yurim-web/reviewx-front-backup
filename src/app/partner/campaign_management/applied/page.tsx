/* ========================================
   📝 신청 탭 페이지 (통합 레이아웃 사용)
   ======================================== */

/**
 * 신청 탭 페이지
 *
 * 목적: 신청 상태의 캠페인 목록을 보여주는 페이지입니다.
 * 이제 공통 헤더 컴포넌트를 사용하여 중복 코드를 제거합니다.
 *
 * 페이지 경로:
 * - /partner/campaign_management/applied
 *
 * 주요 기능:
 * - 신청 상태의 캠페인 목록 표시
 * - 캠페인별 액션 버튼 (수정, 삭제, 검수 등)
 * - 공통 헤더 컴포넌트 사용으로 일관성 보장
 * - URL 기반 라우팅으로 새로고침 시에도 페이지 유지
 */

"use client";

import { useState, useEffect } from "react";
import PartnerCampaignManagementHeader from "@/components/partner/campaign_management/PartnerCampaignManagementHeader";
import CampaignList from "@/components/partner/campaign_management/CampaignList";
import CampaignFilterBar from "@/components/common/campaign_management/CampaignFilterBar";
import Loading from "@/app/loading";
import type { PartnerMainTab } from "@/types/domain/partner";
import type { PartnerStatTab } from "@/types/domain/partner";
import type { PartnerCampaign } from "@/types/domain/partner";
import layoutStyles from "../../../../styles/partner/layout.module.css";

// 공용 데이터 import
import { getCampaignsByTab } from "@/data/partner/sharedCampaigns";

/**
 * 신청 탭 페이지 컴포넌트
 */
export default function AppliedPage() {
  // 상단 메인 탭 상태 (캠페인 / 포인트)
  const [activeTab, setActiveTab] = useState<PartnerMainTab>("campaign");

  // 통계 탭 상태 - 신청 탭이 활성화된 상태로 설정
  const [activeStatTab, setActiveStatTab] = useState<PartnerStatTab>("신청");

  // 필터링된 캠페인 목록 상태
  const [filteredCampaigns, setFilteredCampaigns] = useState<PartnerCampaign[]>(
    []
  );

  // 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 탭별 캠페인 목록 가져오기
  const campaigns = getCampaignsByTab(activeStatTab);

  /**
   * 필터링된 캠페인 목록 변경 핸들러
   *
   * 설명:
   * - CampaignFilterBar 컴포넌트에서 필터링된 결과를 받아서 상태를 업데이트합니다.
   * - 이제 필터링 로직은 CampaignFilterBar 내부에서 처리됩니다.
   * - 데이터가 준비되면 로딩을 종료합니다.
   */
  const handleFilteredCampaignsChange = (filtered: PartnerCampaign[]) => {
    setFilteredCampaigns(filtered);
    // 데이터가 준비되면 로딩 종료
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsLoading(false);
      });
    });
  };

  /**
   * 탭 변경 시 로딩 시작
   *
   * 설명:
   * - 탭이 변경되면 로딩 상태를 표시합니다.
   * - 실제 데이터가 준비되면 handleFilteredCampaignsChange에서 로딩을 해제합니다.
   * - 안전장치로 최대 2초 후에는 강제로 로딩을 해제합니다.
   */
  useEffect(() => {
    // 탭 변경 시 로딩 시작
    setIsLoading(true);

    // 안전장치: 최대 2초 후에는 강제로 로딩 해제
    const safetyTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(safetyTimer);
  }, [activeStatTab]);

  if (isLoading) {
    return <Loading />;
  }

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
          isPartner={true}
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
