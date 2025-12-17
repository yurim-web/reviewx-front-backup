/* ========================================
   🚚 배송형 캠페인 목록 페이지
   ======================================== */

/**
 * 배송형 캠페인 목록 페이지
 *
 * 페이지 경로:
 * - /delivery (기존 /user/delivery에서 변경)
 *
 * 사용 파일:
 * - 컴포넌트: CampaignListPage
 * - 훅: useCampaignFilters
 * - 데이터: deliveryCampaigns, deliveryCategoryOptions, deliveryChannelOptions, deliverySortOptions
 * - CSS: delivery.module.css
 */

"use client";

import CampaignListPage from "@/components/campaign/CampaignListPage";
import { useCampaignFilters } from "@/hooks/common/campaign/useCampaignFilters";
import { deliveryCampaigns } from "@/data/user/delivery/deliveryCampaigns";
import {
  deliveryCategoryOptions,
  deliveryChannelOptions,
  deliverySortOptions,
} from "@/data/user/delivery/deliveryFilterOptions";

export default function DeliveryPage() {
  // 공용 훅을 사용하여 필터 상태 관리 및 필터링/정렬
  const {
    activeFilters,
    closingSoon,
    handleFilterChange,
    setClosingSoon,
    filteredAndSortedCampaigns,
  } = useCampaignFilters({
    campaigns: deliveryCampaigns,
  });

  return (
    <CampaignListPage
      title="배송형"
      campaigns={filteredAndSortedCampaigns}
      basePath="/campaign/delivery"
      filterBarProps={{
        onFilterChange: handleFilterChange,
        activeFilters,
        categoryOptions: deliveryCategoryOptions,
        channelOptions: deliveryChannelOptions,
        sortOptions: deliverySortOptions,
        closingSoon,
        onClosingSoonChange: setClosingSoon,
        defaultSort: "최신순",
      }}
    />
  );
}
