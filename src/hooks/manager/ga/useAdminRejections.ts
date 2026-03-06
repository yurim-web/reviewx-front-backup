/* ========================================
   관리자 반려 내역 훅
   ======================================== */

/**
 * useAdminRejections
 *
 * 목적: 관리자 반려 내역을 mock API에서 로드하고
 *       RejectedCampaignItem 타입으로 변환하여 반환합니다.
 *
 * 사용 페이지:
 * - /manager_ga/campaign/rejected
 * - /manager_sa/campaign/rejected
 */

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminRejections } from "@/lib/api/admin";
import { rejected_campaign_list } from "@/data/manager_ga/rejected";
import type { AdminRejectionApiItem } from "@/types/api/admin";
import type { RejectedCampaignItem, RejectCode } from "@/data/manager_ga/rejected";

function adaptRejection(item: AdminRejectionApiItem): RejectedCampaignItem {
  return {
    id: String(item.id),
    campaign_number: item.campaign_number,
    campaign_name: item.campaign_name,
    reject_code: item.reject_code as RejectCode,
    reject_reason: item.reject_reason,
    inspector: item.inspector,
    target: item.target,
    processed_date: item.processed_date,
    reject_count: item.reject_count,
  };
}

export function useAdminRejections() {
  const { data: apiData, isLoading } = useQuery({
    queryKey: ["adminRejections"],
    queryFn: fetchAdminRejections,
    staleTime: 30_000,
  });

  const rejections = useMemo<RejectedCampaignItem[]>(() => {
    if (apiData != null && apiData.length > 0) {
      return apiData.map(adaptRejection);
    }
    return rejected_campaign_list;
  }, [apiData]);

  return { rejections, isLoading };
}
