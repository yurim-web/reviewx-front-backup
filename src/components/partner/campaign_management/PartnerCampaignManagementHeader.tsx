/* ========================================
   🏢 파트너 캠페인 관리 공통 헤더 컴포넌트
   ======================================== */

/**
 * 파트너 캠페인 관리 공통 헤더 컴포넌트
 *
 * 목적: 파트너 캠페인 관리 페이지들의 공통 상단 영역을 담당하는 컴포넌트입니다.
 * 상단 탭 네비게이션과 통계 탭을 포함합니다.
 *
 * 사용 페이지:
 * - /partner/campaign_management (전체 탭)
 * - /partner/campaign_management/scheduled (예정 탭)
 * - /partner/campaign_management/applied (신청 탭)
 * - /partner/campaign_management/progress (진행 탭)
 * - /partner/campaign_management/completed (종료 탭)
 * - /partner/campaign_management/cancelled (취소 탭)
 *
 * 주요 기능:
 * - 상단 메인 탭 네비게이션 (캠페인/포인트/계정)
 * - 통계 탭 네비게이션 (전체/예정/신청/진행/종료/취소)
 * - 각 페이지에서 재사용 가능한 공통 레이아웃
 * - 중복 코드 제거로 유지보수성 향상
 */

"use client";

import { useState, useEffect } from "react";
import TabNavigation from "./TabNavigation";
import StatisticsTab from "./StatisticsTab";
import type { PartnerMainTab } from "@/types/partner/partner";
import type {
  PartnerStatTab,
  PartnerCampaignStats,
} from "@/types/partner/partner";

// 공용 데이터 import
import {
  getCampaignStats,
  getInitialCampaignStats,
} from "@/data/partner/sharedCampaigns";

interface PartnerCampaignManagementHeaderProps {
  /** 현재 활성 메인 탭 (캠페인/포인트/계정) */
  activeTab: PartnerMainTab;
  /** 메인 탭 변경 핸들러 */
  setActiveTab: (tab: PartnerMainTab) => void;
  /** 현재 활성 통계 탭 (전체/예정/신청/진행/종료/취소) */
  activeStatTab: PartnerStatTab;
  /** 통계 탭 변경 핸들러 (선택적 - 없으면 내부에서 페이지 이동 처리) */
  setActiveStatTab?: (tab: PartnerStatTab) => void;
}

/**
 * 파트너 캠페인 관리 공통 헤더 컴포넌트
 *
 * React 컴포넌트 구조:
 * - Props를 통해 상태와 핸들러를 받아서 사용
 * - 재사용 가능한 컴포넌트로 설계
 * - 각 페이지에서 동일한 헤더 구조를 제공
 * - 파트너 전용 탭과 통계 정보를 처리
 *
 * Hydration 에러 해결:
 * - localStorage를 사용하는 getCampaignStats()는 서버와 클라이언트에서 다른 값을 반환할 수 있습니다.
 * - useState와 useEffect를 사용하여 클라이언트에서만 통계를 계산하도록 수정했습니다.
 * - 초기 렌더링 시에는 기본값(0)을 사용하고, 클라이언트 마운트 후 실제 통계를 계산합니다.
 */
export default function PartnerCampaignManagementHeader({
  activeTab,
  setActiveTab,
  activeStatTab,
  setActiveStatTab,
}: PartnerCampaignManagementHeaderProps) {
  /* ========================================
     통계 상태 관리 (Statistics State Management)
     ======================================== */

  /**
   * useState로 통계 상태 관리
   *
   * 설명:
   * - 초기값을 0으로 설정하여 서버와 클라이언트에서 동일하게 렌더링됩니다.
   * - useEffect에서 즉시 통계를 계산하여 업데이트합니다.
   * - 이렇게 하면 hydration 에러를 방지하면서도 빠르게 숫자를 표시할 수 있습니다.
   */
  const [stats, setStats] = useState<PartnerCampaignStats>({
    전체: 0,
    예정: 0,
    신청: 0,
    진행: 0,
    종료: 0,
    취소: 0,
    패널티: 0,
  });

  /**
   * useEffect로 통계 계산
   *
   * 설명:
   * - 컴포넌트 마운트 시 즉시 통계를 계산합니다.
   * - 정적 데이터로 먼저 계산하여 빠르게 표시하고,
   * - 그 다음 localStorage를 포함한 전체 통계로 업데이트합니다.
   */
  useEffect(() => {
    // 클라이언트에서만 실행
    if (typeof window === "undefined") return;

    // 먼저 정적 데이터로 빠르게 표시
    try {
      const initialStats = getInitialCampaignStats();
      setStats(initialStats);
    } catch (error) {
      console.error("초기 통계 계산 실패:", error);
    }

    // 그 다음 localStorage를 포함한 전체 통계로 업데이트
    // requestAnimationFrame을 사용하여 브라우저 렌더링 사이클에 맞춰 실행
    requestAnimationFrame(() => {
      try {
        const calculatedStats = getCampaignStats();
        setStats(calculatedStats);
      } catch (error) {
        console.error("전체 통계 계산 실패:", error);
      }
    });
  }, []); // dependency 배열을 비워서 마운트 시 한 번만 실행

  /* ========================================
     통계 탭 변경 핸들러 (Statistics Tab Change Handler)
     ======================================== */

  /**
   * 통계 탭 변경 핸들러
   *
   * 설명:
   * - 통계 탭을 클릭하면 해당 페이지로 이동합니다.
   * - 현재 페이지와 같은 탭이면 이동하지 않습니다.
   * - setActiveStatTab prop이 제공되면 그것을 사용하고, 없으면 내부에서 페이지 이동을 처리합니다.
   *
   */
  const handleStatTabChange = (tab: PartnerStatTab) => {
    // setActiveStatTab prop이 제공되면 그것을 사용
    if (setActiveStatTab) {
      setActiveStatTab(tab);
      return;
    }

    // prop이 없으면 내부에서 페이지 이동 처리
    switch (tab) {
      case "전체":
        window.location.href = "/partner/campaign_management";
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

  return (
    <>
      {/* 상단 탭 네비게이션: 캠페인/포인트/계정 */}
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 통계 탭: 전체/예정/신청/진행/종료/취소 */}
      <StatisticsTab
        activeStatTab={activeStatTab}
        setActiveStatTab={handleStatTabChange}
        stats={stats}
      />
    </>
  );
}
