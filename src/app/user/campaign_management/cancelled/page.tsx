/* ========================================
   ❌ 취소/반려 탭 전용 페이지
   ======================================== */

/**
 * 취소/반려 탭 전용 페이지
 *
 * 목적: 취소/반려 상태의 캠페인 목록을 보여주는 독립적인 페이지입니다.
 *
 * 페이지 경로:
 * - /user/campaign_management/cancelled
 *
 * 주요 기능:
 * - 취소/반려 상태의 캠페인 목록 표시
 * - 캠페인별 액션 버튼 (패널티 내역보기, 콘텐츠 재등록하기 등)
 * - URL 기반 라우팅으로 새로고침 시에도 페이지 유지
 */

"use client";

import { useState, useEffect } from "react";
import CampaignManagementHeader from "@/components/user/campaign_management/CampaignManagementHeader";
import CampaignList from "@/components/user/campaign_management/CampaignList";
import CampaignFilterBar from "@/components/common/campaign_management/CampaignFilterBar";
import type { MainTab } from "@/types/domain/user";
import type { CampaignApplication } from "@/types/domain/user";
import layoutStyles from "../../../../styles/user/campaign_management/layout.module.css";
import { withUserAuth } from "@/components/auth/withAuth";

// 임시 데이터 import
import { getCampaignsByTab } from "@/data/user/campaign_management/campaignManagementData";

/**
 * 취소/반려 탭 전용 페이지 컴포넌트
 */
function CancelledPage() {

  // 상단 메인 탭 상태 (캠페인 / 포인트)
  const [activeTab, setActiveTab] = useState<MainTab>("campaign");

  // 통계 탭 상태 - 취소/반려 탭이 활성화된 상태로 설정
  const [activeStatTab, setActiveStatTab] = useState<
    "신청" | "선정" | "완료" | "취소/반려" | "패널티"
  >("취소/반려");

  // 필터링된 캠페인 목록 상태
  const [filteredCampaigns, setFilteredCampaigns] = useState<
    CampaignApplication[]
  >([]);

  // 캠페인 목록 상태 (목업 데이터만 사용)
  const [campaigns, setCampaigns] = useState<CampaignApplication[]>([]);

  /**
   * 취소/반려 탭 캠페인 불러오기
   *
   * 설명:
   * - 목업 데이터만 사용합니다.
   * - 신청 내역에서 취소한 캠페인은 user_applied_campaigns에서 완전히 제거되므로 여기에는 표시되지 않습니다.
   */
  const loadCancelledCampaigns = () => {
    const mockCampaigns = getCampaignsByTab('취소/반려');
    console.log('[CancelledPage] 목업 캠페인 개수:', mockCampaigns.length);
    return mockCampaigns;
  };

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
   * 캠페인 목록 로드
   *
   * 설명:
   * - 컴포넌트 마운트 시 목업 데이터를 로드합니다.
   */
  useEffect(() => {
    const loadedCampaigns = loadCancelledCampaigns();
    setCampaigns(loadedCampaigns);
  }, []);

  /**
   * 페이지 포커스 시 캠페인 목록 새로고침
   *
   * 설명:
   * - 다른 탭에서 돌아왔을 때 최신 데이터를 표시하기 위해 새로고침합니다.
   */
  useEffect(() => {
    const handleFocus = () => {
      console.log('[CancelledPage] 페이지 포커스 - 데이터 새로고침');
      const loadedCampaigns = loadCancelledCampaigns();
      setCampaigns(loadedCampaigns);
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

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
        <CampaignList
          campaigns={filteredCampaigns}
          activeStatTab="취소/반려"
          originalCampaigns={campaigns}
        />
      </div>
    </div>
  );
}

// 유저(리뷰어) 전용 페이지로 보호
export default withUserAuth(CancelledPage);
