/* ========================================
   ⭐ 구매평 캠페인 목록 페이지
   ======================================== */

/**
 * 구매평 캠페인 목록 페이지
 *
 * 페이지 경로:
 * - /review (기존 /user/review에서 변경)
 *
 * 필터 종류:
 * - 카테고리(옵션O): 카테고리 필터 옵션 선택 가능
 * - 긴급(옵션X): 긴급 필터 옵션 선택 불가능
 *
 * 사용 파일:
 * - 컴포넌트: CampaignListPage
 * - 훅: useCampaignFilters
 * - 데이터: reviewCampaigns, reviewCategoryOptions, reviewSortOptions
 * - CSS: delivery.module.css
 */

"use client";

import CampaignListPage from "@/components/campaign/CampaignListPage";
import { useCampaignFilters } from "@/hooks/common/campaign/useCampaignFilters";
import { reviewCampaigns } from "@/data/campaign/review/reviewCampaigns";
import {
  reviewCategoryOptions,
  reviewSortOptions,
} from "@/data/campaign/campaignFilterOptions";

export default function ReviewPage() {
  // 공용 훅을 사용하여 필터 상태 관리 및 필터링/정렬
  const {
    activeFilters,
    closingSoon,
    handleFilterChange,
    setClosingSoon,
    filteredAndSortedCampaigns,
  } = useCampaignFilters({
    campaigns: reviewCampaigns,
  });

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
