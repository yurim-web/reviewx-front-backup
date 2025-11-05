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
import type { PartnerStatTab, PartnerCampaignStats } from "@/types/partner/partner";

// 공용 데이터 import
import { getCampaignStats } from "@/data/partner/sharedCampaigns";

interface PartnerCampaignManagementHeaderProps {
  /** 현재 활성 메인 탭 (캠페인/포인트/계정) */
  activeTab: PartnerMainTab;
  /** 메인 탭 변경 핸들러 */
  setActiveTab: (tab: PartnerMainTab) => void;
  /** 현재 활성 통계 탭 (전체/예정/신청/진행/종료/취소) */
  activeStatTab: PartnerStatTab;
  /** 통계 탭 변경 핸들러 */
  setActiveStatTab: (tab: PartnerStatTab) => void;
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
   * useState 훅: 컴포넌트의 상태를 관리하는 React 훅
   * 
   * 설명:
   * - 통계 데이터를 컴포넌트 상태로 저장합니다.
   * - 초기값은 서버와 클라이언트가 동일하게 렌더링되도록 모든 값이 0인 객체입니다.
   * - setStats 함수를 사용하여 상태를 업데이트할 수 있습니다.
   * 
   * 학습 포인트:
   * - useState: React의 상태 관리 훅입니다.
   * - 배열 구조분해할당: [상태값, 상태변경함수] = useState(초기값)
   * - 객체 타입: PartnerCampaignStats 타입의 객체를 상태로 관리합니다.
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
   * useEffect 훅: 컴포넌트의 부수 효과(side effects)를 처리하는 React 훅
   * 
   * 설명:
   * - 컴포넌트가 클라이언트에서 마운트된 후에만 실행됩니다.
   * - localStorage를 사용하는 getCampaignStats()를 호출하여 실제 통계를 계산합니다.
   * - 의존성 배열이 비어있으므로 컴포넌트 마운트 시 한 번만 실행됩니다.
   * 
   * Hydration 에러 해결 원리:
   * - 서버 사이드 렌더링(SSR) 시: 초기값(모두 0)으로 렌더링됩니다.
   * - 클라이언트 마운트 후: useEffect가 실행되어 실제 통계를 계산하고 상태를 업데이트합니다.
   * - 이렇게 하면 서버와 클라이언트의 초기 렌더링 결과가 일치하여 hydration 에러가 발생하지 않습니다.
   * 
   * 학습 포인트:
   * - useEffect: 컴포넌트의 생명주기와 관련된 작업을 처리합니다.
   * - 의존성 배열([]): 빈 배열이면 컴포넌트 마운트 시 한 번만 실행됩니다.
   * - setState: 상태를 업데이트하면 컴포넌트가 리렌더링됩니다.
   */
  useEffect(() => {
    // 클라이언트에서만 실행되므로 localStorage 접근 가능
    const calculatedStats = getCampaignStats();
    setStats(calculatedStats);
  }, []);

  return (
    <>
      {/* 상단 탭 네비게이션: 캠페인/포인트/계정 */}
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 통계 탭: 전체/예정/신청/진행/종료/취소 */}
      <StatisticsTab
        activeStatTab={activeStatTab}
        setActiveStatTab={setActiveStatTab}
        stats={stats}
      />
    </>
  );
}
