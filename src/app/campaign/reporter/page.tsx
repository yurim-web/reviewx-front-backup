/* ========================================
   📰 기자단 캠페인 목록 페이지
   ======================================== */

/**
 * 기자단 캠페인 목록 페이지
 *
 * 페이지 경로:
 * - /reporter (기존 /user/reporter에서 변경)
 *
 * 필터 종류:
 * - 카테고리(옵션O): 카테고리 필터 옵션 선택 가능
 * - 채널(옵션O): 채널 필터 옵션 선택 가능
 * - 긴급(옵션X): 긴급 필터 옵션 선택 불가능
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
import { reporterCampaigns } from "@/data/campaign/reporter/reporterCampaigns";
import {
  reporterCategoryOptions,
  reporterChannelOptions,
  reporterSortOptions,
} from "@/data/campaign/campaignFilterOptions";

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
