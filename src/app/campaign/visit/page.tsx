/* ========================================
   방문형 캠페인 목록 페이지
   ======================================== */

/**
 * VisitPage
 *
 * 목적: 방문형 캠페인 목록 표시 및 필터링
 *
 * 사용 페이지:
 * - /campaign/visit (방문형 캠페인 목록)
 */

"use client";

import CampaignListPage from "@/components/campaign/CampaignListPage";
import { useCampaignFilters } from "@/hooks/common/campaign/useCampaignFilters";
import { useVisitCampaignList } from "@/hooks/user/campaign/useCampaignList";
import {
  visitCategoryOptions,
  visitChannelOptions,
  useVisitRegionFilter,
  visitSortOptions,
} from "@/data/campaign/campaignFilterOptions";

export default function VisitPage() {
  const { data: campaigns = [] } = useVisitCampaignList();

  const {
    activeFilters,
    closingSoon,
    handleFilterChange,
    setClosingSoon,
    filteredAndSortedCampaigns,
  } = useCampaignFilters({ campaigns, enableRegionFilter: useVisitRegionFilter });

  return (
    <CampaignListPage
      title="방문형"
      campaigns={filteredAndSortedCampaigns}
      basePath="/campaign/visit"
      filterBarProps={{
        onFilterChange: handleFilterChange,
        activeFilters,
        categoryOptions: visitCategoryOptions,
        channelOptions: visitChannelOptions,
        useRegionFilter: useVisitRegionFilter,
        sortOptions: visitSortOptions,
        closingSoon,
        onClosingSoonChange: setClosingSoon,
        defaultSort: "최신순",
      }}
    />
  );
}
