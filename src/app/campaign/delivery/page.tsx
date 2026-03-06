/* ========================================
   배송형 캠페인 목록 페이지
   ======================================== */

/**
 * DeliveryPage
 *
 * 목적: 배송형 캠페인 목록 표시 및 필터링
 *
 * 사용 페이지:
 * - /campaign/delivery (배송형 캠페인 목록)
 */

"use client";

import CampaignListPage from "@/components/campaign/CampaignListPage";
import { useCampaignFilters } from "@/hooks/common/campaign/useCampaignFilters";
import { useDeliveryCampaignList } from "@/hooks/user/campaign/useCampaignList";
import {
  deliveryCategoryOptions,
  deliveryChannelOptions,
  deliverySortOptions,
} from "@/data/campaign/campaignFilterOptions";

export default function DeliveryPage() {
  const { data: campaigns = [] } = useDeliveryCampaignList();

  const {
    activeFilters,
    closingSoon,
    handleFilterChange,
    setClosingSoon,
    filteredAndSortedCampaigns,
  } = useCampaignFilters({ campaigns });

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
