/* ========================================
   구매평 캠페인 목록 페이지
   ======================================== */

/**
 * ReviewPage
 *
 * 목적: 구매평 캠페인 목록 표시 및 필터링
 *
 * 사용 페이지:
 * - /campaign/review (구매평 캠페인 목록)
 */

"use client";

import CampaignListPage from "@/components/campaign/CampaignListPage";
import { useCampaignFilters } from "@/hooks/common/campaign/useCampaignFilters";
import { useReviewCampaignList } from "@/hooks/user/campaign/useCampaignList";
import { reviewCategoryOptions, reviewSortOptions } from "@/data/campaign/campaignFilterOptions";

export default function ReviewPage() {
  const { data: campaigns = [] } = useReviewCampaignList();

  const {
    activeFilters,
    closingSoon,
    handleFilterChange,
    setClosingSoon,
    filteredAndSortedCampaigns,
  } = useCampaignFilters({ campaigns });

  return (
    <CampaignListPage
      title="구매평"
      campaigns={filteredAndSortedCampaigns}
      basePath="/campaign/review"
      filterBarProps={{
        onFilterChange: handleFilterChange,
        activeFilters,
        categoryOptions: reviewCategoryOptions,
        channelOptions: [],
        sortOptions: reviewSortOptions,
        closingSoon,
        onClosingSoonChange: setClosingSoon,
        defaultSort: "최신순",
      }}
    />
  );
}
