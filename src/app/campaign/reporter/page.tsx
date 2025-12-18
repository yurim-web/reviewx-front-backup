/* ========================================
   📰 기자단 캠페인 목록 페이지
   ======================================== */

/**
 * 기자단 캠페인 목록 페이지
 *
 * 페이지 경로:
 * - /reporter (기존 /user/reporter에서 변경)
 *
 * 사용 파일:
 * - 컴포넌트: CampaignListPage
 * - 훅: useCampaignFilters
 * - 데이터: reporterCampaigns, reporterCategoryOptions, reporterChannelOptions, reporterSortOptions
 * - CSS: delivery.module.css
 */

"use client";

import CampaignListPage from "@/components/campaign/CampaignListPage";
import { useCampaignFilters } from "@/hooks/common/campaign/useCampaignFilters";
import { reporterCampaigns } from "@/data/user/reporter/reporterCampaigns";
import {
  reporterCategoryOptions,
  reporterChannelOptions,
  reporterSortOptions,
} from "@/data/user/reporter/reporterFilterOptions";

export default function ReporterPage() {
  // 공용 훅을 사용하여 필터 상태 관리 및 필터링/정렬
  const {
    activeFilters,
    closingSoon,
    handleFilterChange,
    setClosingSoon,
    filteredAndSortedCampaigns,
  } = useCampaignFilters({
    campaigns: reporterCampaigns,
  });

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
