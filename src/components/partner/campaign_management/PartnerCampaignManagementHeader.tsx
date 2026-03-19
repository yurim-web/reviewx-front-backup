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
 * - /partner/campaign_management/extension-request (연장 요청 탭)
 *
 */

"use client";

import { usePathname, useRouter } from "next/navigation";
import TabNavigation from "./TabNavigation";
import StatisticsTab from "./StatisticsTab";
import type { PartnerMainTab } from "@/types/domain/partner";
import type { PartnerStatTab, PartnerCampaignStats } from "@/types/domain/partner";

interface PartnerCampaignManagementHeaderProps {
  /** 현재 활성 메인 탭 (캠페인/포인트/계정) */
  activeTab: PartnerMainTab;
  /** 메인 탭 변경 핸들러 */
  setActiveTab: (tab: PartnerMainTab) => void;
  /** 현재 활성 통계 탭 (전체/예정/신청/진행/종료/취소) */
  activeStatTab: PartnerStatTab;
  /** 통계 탭 변경 핸들러 (선택적 - 없으면 내부에서 페이지 이동 처리) */
  setActiveStatTab?: (tab: PartnerStatTab) => void;
  /** API 기반 통계 데이터 (외부 전달) */
  apiStats?: Record<string, number>;
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
  setActiveStatTab: externalSetActiveStatTab,
  apiStats,
}: PartnerCampaignManagementHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const defaultStats: PartnerCampaignStats = {
    전체: 0,
    예정: 0,
    신청: 0,
    진행: 0,
    종료: 0,
    취소: 0,
    "연장 요청": 0,
    패널티: 0,
  };

  const stats: PartnerCampaignStats = apiStats
    ? ({ ...defaultStats, ...apiStats } as PartnerCampaignStats)
    : defaultStats;

  /* ========================================
     통계 탭 변경 핸들러 (Statistics Tab Change Handler)
     ======================================== */

  /**
   * 통계 탭 변경 핸들러
   *
   * 설명:
   * - 탭을 클릭하면 항상 해당 탭의 페이지로 이동합니다.
   * - 현재 경로와 클릭한 탭의 경로가 같으면 이동하지 않습니다.
   * - URL 기반 라우팅으로 새로고침 시에도 현재 탭이 유지됩니다.
   */
  const handleStatTabChange = (tab: PartnerStatTab) => {
    // 외부 핸들러가 있으면 우선 사용
    if (externalSetActiveStatTab) {
      externalSetActiveStatTab(tab);
      return;
    }

    // 각 탭에 해당하는 경로 매핑
    const tabPaths: Record<PartnerStatTab, string> = {
      전체: "/partner/campaign_management",
      예정: "/partner/campaign_management/scheduled",
      신청: "/partner/campaign_management/applied",
      진행: "/partner/campaign_management/progress",
      종료: "/partner/campaign_management/completed",
      취소: "/partner/campaign_management/cancelled",
      "연장 요청": "/partner/campaign_management/extension-request",
      패널티: "/partner/campaign_management/penalty",
    };

    const targetPath = tabPaths[tab];

    // 현재 경로와 목표 경로가 다르면 페이지 이동
    if (pathname !== targetPath) {
      router.push(targetPath);
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
