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
import CampaignFilterBar from "@/components/common/campaign_management/CampaignFilterBar";
import type { MainTab } from "@/types/user/user";
import type { CampaignApplication } from "@/types/user/user";
import layoutStyles from "../../../../styles/user/campaign_management/layout.module.css";

// 임시 데이터 import
import {
  getCampaignsByTab,
  campaignManagementData,
} from "@/data/user/campaign_management/campaignManagementData";

// 실제 캠페인 데이터 import (applicationEnd 날짜 가져오기 위해)
import { deliveryCampaigns } from "@/data/campaign/delivery/deliveryCampaigns";
import { visitCampaigns } from "@/data/campaign/visit/visitCampaigns";
import { reviewCampaigns } from "@/data/campaign/review/reviewCampaigns";
import { reporterCampaigns } from "@/data/campaign/reporter/reporterCampaigns";
import { missionCampaigns } from "@/data/campaign/mission/missionCampaigns";

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
  const [filteredCampaigns, setFilteredCampaigns] = useState<
    CampaignApplication[]
  >([]);

  /**
   * 실제 캠페인 데이터에서 applicationEnd 날짜를 가져와서
   * 신청일 기준으로 남은 일수를 계산하는 함수
   *
   * 설명:
   * - 신청 탭의 캠페인 태그는 신청일 기준으로 모집기간의 남은 일수를 표시합니다.
   * - 3일 이하일 때는 "마감임박"으로 표시합니다.
   *
   */
  const calculateRemainingDays = (
    campaignId: string,
    campaignType: CampaignApplication["type"]
  ): { remainingDays: number; isUrgent: boolean } => {
    // 모든 캠페인 데이터를 하나의 배열로 합치기
    const allCampaigns = [
      ...deliveryCampaigns,
      ...visitCampaigns,
      ...reviewCampaigns,
      ...reporterCampaigns,
      ...missionCampaigns,
    ];

    // 캠페인 ID로 실제 캠페인 데이터 찾기
    const actualCampaign = allCampaigns.find((c) => c.id === campaignId);

    if (!actualCampaign || !actualCampaign.detailedSchedule?.applicationEnd) {
      // 실제 데이터를 찾을 수 없으면 기본값 반환
      return { remainingDays: 0, isUrgent: false };
    }

    // applicationEnd 날짜 가져오기 (예: "2026-01-01")
    const applicationEndDate = new Date(
      actualCampaign.detailedSchedule.applicationEnd
    );
    applicationEndDate.setHours(0, 0, 0, 0); // 시간을 00:00:00으로 설정

    // 오늘 날짜 (시간을 00:00:00으로 설정)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 남은 일수 계산 (밀리초를 일수로 변환)
    const diffTime = applicationEndDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 3일 이하이면 마감임박
    const isUrgent = diffDays <= 3;

    return { remainingDays: diffDays, isUrgent };
  };

  /**
   * 캠페인 목록에 remainingDays와 isUrgent를 계산하여 추가하는 함수
   *
   * 설명:
   * - 신청 탭의 캠페인만 신청일 기준으로 계산합니다.
   * - 다른 탭의 캠페인은 기존 데이터를 그대로 사용합니다.
   */
  const enrichCampaignsWithRemainingDays = (
    campaigns: CampaignApplication[]
  ): CampaignApplication[] => {
    // 신청 탭인 경우에만 신청일 기준으로 계산
    if (activeStatTab === "신청") {
      return campaigns.map((campaign) => {
        const { remainingDays, isUrgent } = calculateRemainingDays(
          campaign.id,
          campaign.type
        );
        return {
          ...campaign,
          remainingDays,
          isUrgent,
        };
      });
    }
    // 다른 탭은 기존 데이터 그대로 사용
    return campaigns;
  };

  // 캠페인 목록 상태 (취소 시 제거하기 위해 상태로 관리)
  const [campaigns, setCampaigns] = useState<CampaignApplication[]>(() => {
    const baseCampaigns = getCampaignsByTab(activeStatTab);
    return enrichCampaignsWithRemainingDays(baseCampaigns);
  });

  // 통계 상태 (카운트 갱신을 위해 상태로 관리)
  // 모든 캠페인 데이터를 기반으로 통계를 계산합니다.
  const [stats, setStats] = useState(() => {
    // 모든 캠페인 데이터를 사용하여 통계 계산
    return {
      신청: campaignManagementData.filter((c) => c.status === "신청").length,
      선정: campaignManagementData.filter((c) => c.status === "선정").length,
      완료: campaignManagementData.filter((c) => c.status === "완료").length,
      "취소/반려": campaignManagementData.filter(
        (c) => c.status === "취소/반려"
      ).length,
      패널티: campaignManagementData.filter((c) => c.isPenalty === true).length,
    };
  });

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
   * - 신청 탭인 경우 신청일 기준으로 remainingDays와 isUrgent를 계산합니다.
   */
  useEffect(() => {
    const baseCampaigns = getCampaignsByTab(activeStatTab);
    const enrichedCampaigns = enrichCampaignsWithRemainingDays(baseCampaigns);
    setCampaigns(enrichedCampaigns);
  }, [activeStatTab]);

  /**
   * 신청 취소 성공 핸들러
   *
   * 설명:
   * - 캠페인 신청 취소가 성공하면 해당 캠페인을 리스트에서 제거합니다.
   * - 통계 카운트도 즉시 갱신합니다.
   *
   * 학습 포인트:
   * - 상태 업데이트: setState를 사용하여 배열에서 항목을 제거합니다.
   * - 함수형 업데이트: 이전 상태를 기반으로 새로운 상태를 계산합니다.
   */
  const handleCancelSuccess = (campaignId: string) => {
    // 리스트에서 해당 캠페인 제거
    setCampaigns((prevCampaigns) =>
      prevCampaigns.filter((campaign) => campaign.id !== campaignId)
    );

    // 필터링된 목록에서도 제거
    setFilteredCampaigns((prevFiltered) =>
      prevFiltered.filter((campaign) => campaign.id !== campaignId)
    );

    // 통계 카운트 갱신 (신청 탭 카운트 감소)
    setStats((prevStats) => ({
      ...prevStats,
      신청: Math.max(0, prevStats.신청 - 1),
    }));
  };

  return (
    <div className={layoutStyles.container}>
      {/* 메인 컨텐츠 영역 */}
      <div className={layoutStyles.main_content}>
        {/* 공통 헤더: 상단 탭 네비게이션 + 통계 탭 */}
        <CampaignManagementHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeStatTab={activeStatTab}
          stats={stats}
        />

        {/* 필터 바: 유형, 채널 필터 및 검색 */}
        <CampaignFilterBar<CampaignApplication>
          campaigns={campaigns}
          onFilteredCampaignsChange={handleFilteredCampaignsChange}
        />

        {/* 필터링된 캠페인 목록 */}
        <CampaignList
          campaigns={filteredCampaigns}
          activeStatTab="신청"
          onCancelSuccess={handleCancelSuccess}
          originalCampaigns={campaigns}
        />
      </div>
    </div>
  );
}
