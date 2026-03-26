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

import { useState } from "react";
import CampaignListPage from "@/components/campaign/CampaignListPage";
import { useCampaignFilters } from "@/hooks/common/campaign/useCampaignFilters";
import { useMissionCampaignList } from "@/hooks/user/campaign/useCampaignList";
import {
  missionCategoryOptions,
  missionSortOptions,
  CATEGORY_ID_MAP,
} from "@/data/campaign/campaignFilterOptions";

export default function MissionPage() {
  const [apiFilters, setApiFilters] = useState<{ categoryId?: number; channelId?: number }>({});

  const { data: campaigns = [] } = useMissionCampaignList(apiFilters);

  const {
    activeFilters,
    closingSoon,
    handleFilterChange: _handleFilterChange,
    setClosingSoon,
    filteredAndSortedCampaigns,
  } = useCampaignFilters({ campaigns });

  const handleFilterChange = (filters: {
    category?: string;
    channel?: string;
    region?: string;
    closingSoon?: boolean;
    sortBy?: string;
  }) => {
    _handleFilterChange(filters);

    setApiFilters((prev) => {
      const next = { ...prev };
      if (filters.category !== undefined) {
        const cats = filters.category ? filters.category.split(",").filter(Boolean) : [];
        next.categoryId = cats.length === 1 ? CATEGORY_ID_MAP[cats[0]] : undefined;
      }
      return next;
    });
  };

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
