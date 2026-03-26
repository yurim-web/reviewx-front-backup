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

import { useState } from "react";
import CampaignListPage from "@/components/campaign/CampaignListPage";
import { useCampaignFilters } from "@/hooks/common/campaign/useCampaignFilters";
import { useReviewCampaignList } from "@/hooks/user/campaign/useCampaignList";
import {
  reviewCategoryOptions,
  reviewSortOptions,
  CATEGORY_ID_MAP,
} from "@/data/campaign/campaignFilterOptions";

export default function ReviewPage() {
  const [apiFilters, setApiFilters] = useState<{ categoryId?: number; channelId?: number }>({});

  const { data: campaigns = [] } = useReviewCampaignList(apiFilters);

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
