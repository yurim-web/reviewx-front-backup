/* ========================================
   📊 캠페인 관리 공통 헤더 컴포넌트
   ======================================== */

/**
 * 캠페인 관리 공통 헤더 컴포넌트
 *
 * 목적: 캠페인 관리 페이지들의 공통 상단 영역을 담당하는 컴포넌트입니다.
 * 상단 탭 네비게이션과 통계 탭을 포함합니다.
 *
 * 사용 페이지:
 * - /user/campaign_management/applied (신청 탭)
 * - /user/campaign_management/selected (선정 탭)
 * - /user/campaign_management/completed (완료 탭)
 * - /user/campaign_management/cancelled (취소/반려 탭)
 * - /user/campaign_management/penalty (패널티 탭)
 *
 * 주요 기능:
 * - 상단 메인 탭 네비게이션 (캠페인/포인트/계정)
 * - 통계 탭 네비게이션 (신청/선정/완료/취소반려/패널티)
 * - 각 페이지에서 재사용 가능한 공통 레이아웃
 * - 중복 코드 제거로 유지보수성 향상
 */

"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import TabNavigation from "@/components/user/campaign_management/TabNavigation";
import StatisticsTab from "@/components/user/campaign_management/StatisticsTab";
import type { MainTab } from "@/types/domain/user";

// 임시 데이터 import
import {
  campaignManagementStats,
  getClientCampaignStats,
} from "@/data/user/campaign_management/campaignManagementData";

interface CampaignManagementHeaderProps {
  /** 현재 활성 메인 탭 (캠페인/포인트/계정) */
  activeTab: MainTab;
  /** 메인 탭 변경 핸들러 */
  setActiveTab: (tab: MainTab) => void;
  /** 현재 활성 통계 탭 (신청/선정/완료/취소반려/전체/패널티) */
  activeStatTab: "신청" | "선정" | "완료" | "취소/반려" | "전체" | "패널티";
  /** 통계 탭 변경 핸들러 (선택적: 제공되지 않으면 StatisticsTab 내부에서 라우팅 처리) */
  setActiveStatTab?: (
    tab: "신청" | "선정" | "완료" | "취소/반려" | "전체" | "패널티"
  ) => void;
  /** 통계 데이터 (선택적: 제공되지 않으면 기본 데이터 사용) */
  stats?: {
    신청: number;
    선정: number;
    완료: number;
    "취소/반려": number;
    전체: number;
    패널티: number;
  };
}

/**
 * 캠페인 관리 공통 헤더 컴포넌트
 *
 * React 컴포넌트 구조:
 * - Props를 통해 상태와 핸들러를 받아서 사용
 * - 재사용 가능한 컴포넌트로 설계
 * - 각 페이지에서 동일한 헤더 구조를 제공
 */
export default function CampaignManagementHeader({
  activeTab,
  setActiveTab,
  activeStatTab,
  setActiveStatTab,
  stats: propStats,
}: CampaignManagementHeaderProps) {
  const pathname = usePathname();
  // 신청 탭 등에서 propStats가 아직 undefined로 올 때 정적(5) 잔상 방지: 클라이언트에서는 곧바로 실제 통계로 초기화
  const [stats, setStats] = useState(() => {
    if (propStats != null) return propStats;
    if (typeof window !== "undefined") return getClientCampaignStats();
    return campaignManagementStats;
  });

  // 경로/prop 변경 시 통계 동기화 (첫 페인트 전에 맞춤)
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (propStats != null) {
      setStats(propStats);
      return;
    }
    setStats(getClientCampaignStats());
  }, [pathname, propStats]);

  useEffect(() => {
    if (propStats != null) setStats(propStats);
  }, [propStats]);

  return (
    <>
      {/* 상단 탭 네비게이션: 캠페인/포인트/계정 */}
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 통계 탭: 신청/선정/완료/취소반려/패널티 */}
      <StatisticsTab
        activeStatTab={activeStatTab}
        setActiveStatTab={setActiveStatTab}
        stats={stats}
      />
    </>
  );
}
