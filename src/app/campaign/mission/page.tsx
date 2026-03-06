/* ========================================
   미션형 캠페인 목록 페이지
   ======================================== */

/**
 * MissionPage
 *
 * 목적: 미션형 캠페인 목록 표시 및 필터링
 *
 * 사용 페이지:
 * - /campaign/mission (미션형 캠페인 목록)
 */

"use client";

import CampaignListPage from "@/components/campaign/CampaignListPage";
import { useCampaignFilters } from "@/hooks/common/campaign/useCampaignFilters";
import { useMissionCampaignList } from "@/hooks/user/campaign/useCampaignList";
import { missionCategoryOptions, missionSortOptions } from "@/data/campaign/campaignFilterOptions";

export default function MissionPage() {
  const { data: campaigns = [] } = useMissionCampaignList();

  const {
    activeFilters,
    closingSoon,
    handleFilterChange,
    setClosingSoon,
    filteredAndSortedCampaigns,
  } = useCampaignFilters({ campaigns });

  return (
    <CampaignListPage
      title="미션형"
      campaigns={filteredAndSortedCampaigns}
      basePath="/campaign/mission"
      filterBarProps={{
        onFilterChange: handleFilterChange,
        activeFilters,
        categoryOptions: missionCategoryOptions,
        channelOptions: [],
        sortOptions: missionSortOptions,
        closingSoon,
        onClosingSoonChange: setClosingSoon,
        defaultSort: "최신순",
      }}
    />
  );
}
