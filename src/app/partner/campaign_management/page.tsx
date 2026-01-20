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
import CampaignFilterBar from "@/components/common/campaign_management/CampaignFilterBar";
import BaseModal from "@/components/common/modal/BaseModal";
import type { PartnerMainTab } from "@/types/domain/partner";
import type { PartnerStatTab } from "@/types/domain/partner";
import type { PartnerCampaign } from "@/types/domain/partner";
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
  const [filteredCampaigns, setFilteredCampaigns] = useState<PartnerCampaign[]>(
    []
  );

  // 네트워크 오류 상태 (네트워크 지연이나 오류 발생 시 true)
  const [isNetworkError, setIsNetworkError] = useState<boolean>(false);

  // 필터 상태 (필터 바에서 사용)
  const [activeFilters, setActiveFilters] = useState<{
    types?: string[];
    channels?: string[];
    searchQuery?: string;
    sortBy?: string;
  }>({});

  // 클라이언트에서만 localStorage에서 필터 상태 복원 (Hydration 에러 방지)
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem("partner_campaign_filter_state");
      if (stored) {
        const restored = JSON.parse(stored);
        setActiveFilters(restored);
      }
    } catch (error) {
      console.error("localStorage에서 필터 상태 복원 실패:", error);
    }
  }, []); // 빈 의존성 배열: 마운트 시 한 번만 실행

  // 탭별 캠페인 목록 가져오기
  const campaigns = getCampaignsByTab(activeStatTab);

  /**
   * 필터 변경 핸들러
   *
   * 설명:
   * - CampaignFilterBar에서 필터가 변경될 때 호출됩니다.
   * - 필터 상태를 업데이트하여 필터 바에 전달합니다.
   */
  const handleFilterChange = (filters: {
    types?: string[];
    channels?: string[];
    searchQuery?: string;
    sortBy?: string;
  }) => {
    setActiveFilters(filters);
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
   * - 필터 바가 자동으로 필터링하여 결과를 반환합니다.
   *
   * 참고: 실제 API 호출 시에는 try-catch로 네트워크 오류를 처리하고
   *       setIsNetworkError(true)를 호출하여 오류 모달을 표시합니다.
   */
  useEffect(() => {
    // TODO: 실제 API 호출 시 네트워크 오류 처리
    // 예시:
    // try {
    //   const newCampaigns = await fetchCampaignsByTab(activeStatTab);
    //   setFilteredCampaigns(newCampaigns);
    // } catch (error) {
    //   console.error("네트워크 오류:", error);
    //   setIsNetworkError(true);
    // }

    const newCampaigns = getCampaignsByTab(activeStatTab);
    // 필터 바가 자동으로 필터링하여 결과를 반환합니다.
  }, [activeStatTab]);

  /**
   * 네트워크 오류 모달 닫기 핸들러
   *
   * 설명:
   * - 확인 버튼 클릭 시 모달을 닫습니다.
   * - 사용자가 다시 시도할 수 있도록 페이지를 유지합니다.
   */
  const handleNetworkErrorModalClose = () => {
    setIsNetworkError(false);
    // 필요시 페이지 새로고침 또는 재시도 로직 추가 가능
  };

  return (
    <>
      <div className={layoutStyles.container}>
        {/* 메인 컨텐츠 영역 */}
        <div className={layoutStyles.main_content}>
          {/* 공통 헤더: 상단 탭 네비게이션 + 통계 탭 */}
          <PartnerCampaignManagementHeader
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeStatTab={activeStatTab}
            setActiveStatTab={setActiveStatTab}
          />

          {/* 필터 바: 유형, 채널 필터 및 검색 */}
          <CampaignFilterBar
            campaigns={campaigns}
            onFilteredCampaignsChange={handleFilteredCampaignsChange}
            onFilterChange={handleFilterChange}
            activeFilters={activeFilters}
          />

          {/* 필터링된 캠페인 목록 */}
          <CampaignList
            campaigns={filteredCampaigns}
            activeStatTab={activeStatTab}
          />
        </div>
      </div>

      {/* 네트워크 오류 모달 */}
      <BaseModal
        is_open={isNetworkError}
        on_close={handleNetworkErrorModalClose}
        message="오류가 발생했습니다.<br>잠시 후 다시 시도해주세요."
        buttons={["확인"]}
      />
    </>
  );
}
