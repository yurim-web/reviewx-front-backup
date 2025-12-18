/* ========================================
   🚶 방문형 캠페인 목록 페이지
   ======================================== */

/**
 * 방문형 캠페인 목록 페이지
 *
 * 페이지 경로:
 * - /visit (기존 /user/visit에서 변경)
 *
 * 사용 파일:
 * - 컴포넌트: CampaignListPage
 * - 훅: useCampaignFilters
 * - 데이터: visitCampaigns, visitCategoryOptions, visitChannelOptions, useVisitRegionFilter, visitSortOptions
 * - CSS: delivery.module.css
 */

"use client";

import CampaignListPage from "@/components/campaign/CampaignListPage";
import { useCampaignFilters } from "@/hooks/common/campaign/useCampaignFilters";
import { visitCampaigns } from "@/data/user/visit/visitCampaigns";
import {
  visitCategoryOptions,
  visitChannelOptions,
  useVisitRegionFilter,
  visitSortOptions,
} from "@/data/user/visit/visitFilterOptions";

export default function VisitPage() {
  // 공용 훅을 사용하여 필터 상태 관리 및 필터링/정렬 (지역 필터 활성화)
  const {
    activeFilters,
    closingSoon,
    handleFilterChange,
    setClosingSoon,
    filteredAndSortedCampaigns,
  } = useCampaignFilters({
    campaigns: visitCampaigns,
    enableRegionFilter: true, // 방문형은 지역 필터 사용
  });

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
      }}
    />
  );
}
