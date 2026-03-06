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

import CampaignListPage from "@/components/campaign/CampaignListPage";
import { useCampaignFilters } from "@/hooks/common/campaign/useCampaignFilters";
import { useReporterCampaignList } from "@/hooks/user/campaign/useCampaignList";
import {
  reporterCategoryOptions,
  reporterChannelOptions,
  reporterSortOptions,
} from "@/data/campaign/campaignFilterOptions";

export default function ReporterPage() {
  const { data: campaigns = [] } = useReporterCampaignList();

  const {
    activeFilters,
    closingSoon,
    handleFilterChange,
    setClosingSoon,
    filteredAndSortedCampaigns,
  } = useCampaignFilters({ campaigns });

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
