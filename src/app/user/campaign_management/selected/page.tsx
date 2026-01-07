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

import { useState, useEffect } from "react";
import CampaignManagementHeader from "@/components/user/campaign_management/CampaignManagementHeader";
import CampaignList from "@/components/user/campaign_management/CampaignList";
import CampaignFilterBar from "@/components/common/campaign_management/CampaignFilterBar";
import type { MainTab } from "@/types/user/user";
import type { CampaignApplication } from "@/types/user/user";
import layoutStyles from "../../../../styles/user/campaign_management/layout.module.css";

// 임시 데이터 import
import { getCampaignsByTab } from "@/data/user/campaign_management/campaignManagementData";

// 실제 캠페인 데이터 import (registrationPeriod 날짜 가져오기 위해)
import { deliveryCampaigns } from "@/data/campaign/delivery/deliveryCampaigns";
import { visitCampaigns } from "@/data/campaign/visit/visitCampaigns";
import { reviewCampaigns } from "@/data/campaign/review/reviewCampaigns";
import { reporterCampaigns } from "@/data/campaign/reporter/reporterCampaigns";
import { missionCampaigns } from "@/data/campaign/mission/missionCampaigns";

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

  // 필터링된 캠페인 목록 상태
  const [filteredCampaigns, setFilteredCampaigns] = useState<
    CampaignApplication[]
  >([]);

  /**
   * 실제 캠페인 데이터에서 registrationPeriod 날짜를 가져와서
   * 등록기간 기준으로 남은 일수를 계산하는 함수
   *
   * 설명:
   * - 선정 탭의 캠페인 태그는 등록기간 기준으로 남은 일수를 표시합니다.
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

    if (!actualCampaign || !actualCampaign.detailedSchedule) {
      // 실제 데이터를 찾을 수 없으면 기본값 반환
      return { remainingDays: 0, isUrgent: false };
    }

    // 캠페인 타입에 따라 등록기간 필드명이 다릅니다
    // - 방문형: purchasePeriod
    // - 배송형/구매평/미션형/기자단: registrationPeriod
    let registrationPeriod: string | null = null;

    if (campaignType === "방문형") {
      // 방문형은 purchasePeriod를 사용
      registrationPeriod =
        "purchasePeriod" in actualCampaign.detailedSchedule
          ? (actualCampaign.detailedSchedule.purchasePeriod as string)
          : null;
    } else {
      // 나머지 타입은 registrationPeriod를 사용
      registrationPeriod =
        "registrationPeriod" in actualCampaign.detailedSchedule
          ? (actualCampaign.detailedSchedule.registrationPeriod as string)
          : null;
    }

    if (!registrationPeriod) {
      // 등록기간이 없으면 기본값 반환
      return { remainingDays: 0, isUrgent: false };
    }

    // registrationPeriod에서 끝 날짜 추출 (예: "2026-01-10 ~ 2026-01-17" → "2026-01-17")
    const endDateStr = registrationPeriod.split("~")[1]?.trim();

    if (!endDateStr) {
      return { remainingDays: 0, isUrgent: false };
    }

    // 등록기간 끝 날짜 가져오기
    const registrationEndDate = new Date(endDateStr);
    registrationEndDate.setHours(0, 0, 0, 0); // 시간을 00:00:00으로 설정

    // 오늘 날짜 (시간을 00:00:00으로 설정)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 남은 일수 계산 (밀리초를 일수로 변환)
    const diffTime = registrationEndDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 3일 이하이면 마감임박
    const isUrgent = diffDays <= 3;

    return { remainingDays: diffDays, isUrgent };
  };

  /**
   * 실제 캠페인 데이터에서 contentType을 가져오는 함수
   *
   * 설명:
   * - 미션형 캠페인의 경우 실제 캠페인 데이터에서 contentType을 찾아서 설정합니다.
   * - contentType은 "link", "image", "both" 중 하나입니다.
  
   */
  const getContentTypeFromCampaign = (
    campaignId: string,
    campaignType: CampaignApplication["type"]
  ): "link" | "image" | "both" | undefined => {
    // 미션형이 아닌 경우 contentType이 필요 없음
    if (campaignType !== "미션형") {
      return undefined;
    }

    // 미션형 캠페인 데이터에서만 찾기
    const missionCampaign = missionCampaigns.find((c) => c.id === campaignId);

    // contentType 반환 (없으면 undefined)
    // 타입 가드: missionCampaign이 있고 contentType 속성이 있는지 확인
    if (missionCampaign && "contentType" in missionCampaign) {
      return missionCampaign.contentType;
    }

    return undefined;
  };

  /**
   * 캠페인 목록에 remainingDays, isUrgent, contentType을 계산하여 추가하는 함수
   *
   * 설명:
   * - 선정 탭의 캠페인만 등록기간 기준으로 계산합니다.
   * - 미션형 캠페인의 경우 실제 캠페인 데이터에서 contentType을 가져옵니다.
   * - 다른 탭의 캠페인은 기존 데이터를 그대로 사용합니다.
   */
  const enrichCampaignsWithRemainingDays = (
    campaigns: CampaignApplication[]
  ): CampaignApplication[] => {
    // 선정 탭인 경우에만 등록기간 기준으로 계산
    if (activeStatTab === "선정") {
      return campaigns.map((campaign) => {
        const { remainingDays, isUrgent } = calculateRemainingDays(
          campaign.id,
          campaign.type
        );

        // 미션형 캠페인의 경우 contentType 가져오기
        const contentType = getContentTypeFromCampaign(
          campaign.id,
          campaign.type
        );

        return {
          ...campaign,
          remainingDays,
          isUrgent,
          // contentType이 없으면 기존 값 유지, 있으면 새로 설정
          contentType: contentType ?? campaign.contentType,
        };
      });
    }
    // 다른 탭은 기존 데이터 그대로 사용
    return campaigns;
  };

  // 캠페인 목록 상태
  const [campaigns, setCampaigns] = useState<CampaignApplication[]>(() => {
    const baseCampaigns = getCampaignsByTab(activeStatTab);
    return enrichCampaignsWithRemainingDays(baseCampaigns);
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
   * - 선정 탭인 경우 등록기간 기준으로 remainingDays와 isUrgent를 계산합니다.
   */
  useEffect(() => {
    const baseCampaigns = getCampaignsByTab(activeStatTab);
    const enrichedCampaigns = enrichCampaignsWithRemainingDays(baseCampaigns);
    setCampaigns(enrichedCampaigns);
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
        <CampaignList
          campaigns={filteredCampaigns}
          activeStatTab="선정"
          originalCampaigns={campaigns}
        />
      </div>
    </div>
  );
}
