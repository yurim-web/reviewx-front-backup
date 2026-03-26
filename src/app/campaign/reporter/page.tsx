/* ========================================
   기자단 캠페인 목록 페이지
   ======================================== */

/**
 * ReporterPage
 *
 * 목적: 기자단 캠페인 목록 표시 및 필터링
 *
 * 사용 페이지:
 * - /campaign/reporter (기자단 캠페인 목록)
 */

"use client";

import { useState } from "react";
import CampaignListPage from "@/components/campaign/CampaignListPage";
import { useCampaignFilters } from "@/hooks/common/campaign/useCampaignFilters";
import { useReporterCampaignList } from "@/hooks/user/campaign/useCampaignList";
import {
  reporterCategoryOptions,
  reporterChannelOptions,
  reporterSortOptions,
  CATEGORY_ID_MAP,
  CHANNEL_ID_MAP,
} from "@/data/campaign/campaignFilterOptions";

export default function ReporterPage() {
  const [apiFilters, setApiFilters] = useState<{ categoryId?: number; channelId?: number }>({});

  const { data: campaigns = [] } = useReporterCampaignList(apiFilters);

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
      if (filters.channel !== undefined) {
        const chs = filters.channel ? filters.channel.split(",").filter(Boolean) : [];
        next.channelId = chs.length === 1 ? CHANNEL_ID_MAP[chs[0]] : undefined;
      }
      return next;
    });
  };

  return (
    <CampaignListPage
      title="기자단"
      campaigns={filteredAndSortedCampaigns}
      basePath="/campaign/reporter"
      filterBarProps={{
        onFilterChange: handleFilterChange,
        activeFilters,
        categoryOptions: reporterCategoryOptions,
        channelOptions: reporterChannelOptions,
        sortOptions: reporterSortOptions,
        closingSoon,
        onClosingSoonChange: setClosingSoon,
        defaultSort: "최신순",
      }}
    />
  );
}
