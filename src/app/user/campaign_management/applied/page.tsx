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
  campaignManagementStats,
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
   * 실제 캠페인 데이터에서 선정 발표일이 지났는지 확인하는 함수
   *
   * 설명:
   * - 선정 발표일(announcement)이 오늘 날짜와 같거나 이전이면 true를 반환합니다.
   * - 선정 발표일이 오늘이거나 지난 캠페인은 신청 탭에서 제거되어야 합니다.
   * - 선정된 캠페인은 선정 탭으로 이동합니다.
   *
   * @param campaignId - 캠페인 ID
   * @returns 선정 발표일이 오늘이거나 지났으면 true, 아니면 false
   */
  const isAnnouncementDatePassed = (campaignId: string): boolean => {
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

    if (!actualCampaign || !actualCampaign.detailedSchedule?.announcement) {
      // 실제 데이터를 찾을 수 없으면 false 반환 (제거하지 않음)
      return false;
    }

    // 선정 발표일 문자열 가져오기 (예: "2026-01-07")
    const announcementDateStr =
      actualCampaign.detailedSchedule.announcement.trim();

    // 날짜 문자열을 안전하게 파싱 (YYYY-MM-DD 형식)
    const [year, month, day] = announcementDateStr.split("-").map(Number);
    if (!year || !month || !day || isNaN(year) || isNaN(month) || isNaN(day)) {
      console.warn(
        `[AppliedPage] 유효하지 않은 선정 발표일: ${announcementDateStr} (캠페인: ${campaignId})`
      );
      return false;
    }

    // 선정 발표일 Date 객체 생성 (로컬 시간대 기준)
    const announcementDate = new Date(year, month - 1, day);
    announcementDate.setHours(0, 0, 0, 0);

    // 오늘 날짜 (로컬 시간대 기준, 시간을 00:00:00으로 설정)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 선정 발표일이 오늘이거나 이전이면 true (지났거나 오늘)
    // 오늘이 선정 발표일이면 이미 발표가 끝났으므로 제거해야 함
    const isPassed = announcementDate <= today;

    if (isPassed) {
      console.log(
        `[AppliedPage] 선정 발표일 지남: ${campaignId} - 선정 발표일: ${announcementDateStr}, 오늘: ${
          today.toISOString().split("T")[0]
        }`
      );
    }

    return isPassed;
  };

  /**
   * 실제 캠페인 데이터에서 선정 발표일(announcement)을 기준으로
   * 남은 일수를 계산하는 함수
   *
   * 설명:
   * - 신청 탭의 캠페인은 "캠페인 선정 발표까지 n일 남았습니다"라는 메시지를 표시합니다.
   * - 따라서 선정 발표일(announcement)을 기준으로 남은 일수를 계산해야 합니다.
   * - 예: 선정 발표일이 2026-01-07이고 오늘이 2026-01-06이면 1일 남은 것입니다.
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

    if (!actualCampaign || !actualCampaign.detailedSchedule?.announcement) {
      // 실제 데이터를 찾을 수 없으면 기본값 반환
      return { remainingDays: 0, isUrgent: false };
    }

    // 선정 발표일 문자열 가져오기 (예: "2026-01-07")
    const announcementDateStr =
      actualCampaign.detailedSchedule.announcement.trim();

    // 날짜 문자열을 안전하게 파싱 (YYYY-MM-DD 형식)
    const [year, month, day] = announcementDateStr.split("-").map(Number);
    if (!year || !month || !day || isNaN(year) || isNaN(month) || isNaN(day)) {
      console.warn(
        `[AppliedPage] 유효하지 않은 선정 발표일: ${announcementDateStr} (캠페인: ${campaignId})`
      );
      return { remainingDays: 0, isUrgent: false };
    }

    // 선정 발표일 Date 객체 생성 (로컬 시간대 기준)
    const announcementDate = new Date(year, month - 1, day);
    announcementDate.setHours(0, 0, 0, 0);

    // 오늘 날짜 (로컬 시간대 기준, 시간을 00:00:00으로 설정)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 남은 일수 계산 (밀리초를 일수로 변환)
    // Math.ceil 대신 Math.floor를 사용하여 정확한 일수 계산
    // 예: 오늘이 2026-01-06이고 선정 발표일이 2026-01-07이면 1일 남은 것입니다.
    const diffTime = announcementDate.getTime() - today.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // 3일 이하이면 마감임박
    const isUrgent = diffDays <= 3 && diffDays >= 0;

    return { remainingDays: diffDays, isUrgent };
  };

  /**
   * 선정 발표일이 지난 캠페인을 필터링하는 함수
   *
   * 설명:
   * - 신청 탭에서 선정 발표일이 지난 캠페인을 제거합니다.
   * - 선정된 캠페인은 선정 탭으로 이동해야 하므로 신청 탭에서는 보이지 않습니다.
   *
   * @param campaigns - 필터링할 캠페인 목록
   * @param tab - 현재 활성화된 탭 (기본값: activeStatTab)
   * @returns 선정 발표일이 지나지 않은 캠페인만 포함된 목록
   */
  const filterCampaignsByAnnouncementDate = (
    campaigns: CampaignApplication[],
    tab: typeof activeStatTab = activeStatTab
  ): CampaignApplication[] => {
    // 신청 탭인 경우에만 선정 발표일이 지난 캠페인 제거
    if (tab === "신청") {
      const filtered = campaigns.filter((campaign) => {
        const passed = isAnnouncementDatePassed(campaign.id);
        if (passed) {
          console.log(
            `[AppliedPage] 선정 발표일 지난 캠페인 제거: ${campaign.id} - ${campaign.title}`
          );
        }
        return !passed;
      });
      return filtered;
    }
    // 다른 탭은 필터링하지 않음
    return campaigns;
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
    // 선정 발표일이 지난 캠페인 필터링 (activeStatTab을 명시적으로 전달)
    const filteredCampaigns = filterCampaignsByAnnouncementDate(
      baseCampaigns,
      activeStatTab
    );
    // remainingDays와 isUrgent 계산
    return enrichCampaignsWithRemainingDays(filteredCampaigns);
  });

  /**
   * 통계 계산 함수
   *
   * 설명:
   * - 선정 발표일이 지난 신청 상태 캠페인은 통계에서 제외합니다.
   * - 선정된 캠페인은 선정 탭으로 이동하므로 신청 탭 통계에서 제외됩니다.
   *
   * @returns 각 탭별 캠페인 수 통계
   */
  const calculateStats = () => {
    // 신청 상태 캠페인 중 선정 발표일이 지나지 않은 것만 카운트
    const appliedCampaigns = getCampaignsByTab("신청");
    const validAppliedCampaigns = appliedCampaigns.filter(
      (c) => !isAnnouncementDatePassed(c.id)
    );

    return {
      신청: validAppliedCampaigns.length,
      선정: getCampaignsByTab("선정").length,
      완료: getCampaignsByTab("완료").length,
      "취소/반려": getCampaignsByTab("취소/반려").length,
      패널티: getCampaignsByTab("패널티").length,
    };
  };

  // 통계 상태 (카운트 갱신을 위해 상태로 관리)
  // 선정 발표일이 지난 캠페인을 제외한 통계를 계산합니다.
  const [stats, setStats] = useState(() => calculateStats());

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
   * - 신청 탭인 경우:
   *   1. 선정 발표일이 지난 캠페인을 필터링하여 제거합니다.
   *   2. 신청일 기준으로 remainingDays와 isUrgent를 계산합니다.
   * - 통계도 함께 업데이트합니다.
   */
  useEffect(() => {
    const baseCampaigns = getCampaignsByTab(activeStatTab);
    console.log("[AppliedPage] 기본 캠페인 수:", baseCampaigns.length);

    // 선정 발표일이 지난 캠페인 필터링
    const filteredCampaigns = filterCampaignsByAnnouncementDate(baseCampaigns);
    console.log(
      "[AppliedPage] 선정 발표일 필터링 후 캠페인 수:",
      filteredCampaigns.length
    );

    // remainingDays와 isUrgent 계산
    const enrichedCampaigns =
      enrichCampaignsWithRemainingDays(filteredCampaigns);
    setCampaigns(enrichedCampaigns);

    // 통계 업데이트
    setStats(calculateStats());
  }, [activeStatTab]);

  /**
   * 신청 취소 성공 핸들러
   *
   * 설명:
   * - 캠페인 신청 취소가 성공하면 해당 캠페인을 리스트에서 제거합니다.
   * - 통계 카운트도 즉시 갱신합니다.
   *
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
