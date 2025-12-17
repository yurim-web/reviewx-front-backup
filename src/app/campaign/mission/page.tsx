/* ========================================
   🎯 미션형 캠페인 목록 페이지
   ======================================== */

/**
 * 미션형 캠페인 목록 페이지
 *
 * 페이지 경로:
 * - /mission (기존 /user/mission에서 변경)
 *
 * 사용 파일:
 * - 컴포넌트: CampaignListPage
 * - 훅: useCampaignFilters
 * - 데이터: missionCampaigns, missionCategoryOptions, missionChannelOptions, missionSortOptions
 * - CSS: mission.module.css
 */

"use client";

import CampaignListPage from "@/components/campaign/CampaignListPage";
import { useCampaignFilters } from "@/hooks/common/campaign/useCampaignFilters";
import { missionCampaigns } from "@/data/user/mission/missionCampaigns";
import {
  missionCategoryOptions,
  missionChannelOptions,
  missionSortOptions,
} from "@/data/user/mission/missionFilterOptions";

export default function MissionPage() {
  // 공용 훅을 사용하여 필터 상태 관리 및 필터링/정렬
  const {
    activeFilters,
    closingSoon,
    handleFilterChange,
    setClosingSoon,
    filteredAndSortedCampaigns,
  } = useCampaignFilters({
    campaigns: missionCampaigns,
  });

  return (
    <CampaignListPage
      title="미션형"
      campaigns={filteredAndSortedCampaigns}
      basePath="/campaign/mission"
      filterBarProps={{
        onFilterChange: handleFilterChange,
        activeFilters,
        categoryOptions: missionCategoryOptions,
        channelOptions: missionChannelOptions,
        sortOptions: missionSortOptions,
        closingSoon,
        onClosingSoonChange: setClosingSoon,
        defaultSort: "최신순",
      }}
    />
  );
}
