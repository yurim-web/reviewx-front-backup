/* ========================================
   관리자 파트너 목록 훅
   ======================================== */

/**
 * useAdminPartners
 *
 * 목적: 관리자 파트너 목록을 mock API에서 로드하고
 *       PartnerItem 타입으로 변환하여 반환합니다.
 *
 * 사용 페이지:
 * - /manager_ga/member/partners
 * - /manager_sa/member/partners
 */

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminPartners } from "@/lib/api/admin";
import { partner_list } from "@/data/manager_ga/member/partners";
import type { AdminPartnerApiItem } from "@/types/api/admin";
import type {
  PartnerItem,
  PartnerDivision,
  PartnerStatus,
  PartnerStatusType,
} from "@/data/manager_ga/member/partners";

function adaptPartner(item: AdminPartnerApiItem): PartnerItem {
  return {
    id: String(item.id),
    number: item.number,
    business_name: item.business_name,
    business_number: item.business_number,
    representative_name: item.representative_name,
    division: item.division as PartnerDivision,
    campaign_in_progress: item.campaign_in_progress,
    campaign_completed: item.campaign_completed,
    current_points: item.current_points,
    used_points: item.used_points,
    status_type: item.status_type as PartnerStatusType,
    status: item.status as PartnerStatus,
    last_access_date: item.last_access_date,
    join_date: item.join_date,
  };
}

export function useAdminPartners() {
  const { data: apiData, isLoading } = useQuery({
    queryKey: ["adminPartners"],
    queryFn: fetchAdminPartners,
    staleTime: 30_000,
  });

  const partners = useMemo<PartnerItem[]>(() => {
    if (apiData != null && apiData.length > 0) {
      return apiData.map(adaptPartner);
    }
    return partner_list;
  }, [apiData]);

  return { partners, isLoading };
}
