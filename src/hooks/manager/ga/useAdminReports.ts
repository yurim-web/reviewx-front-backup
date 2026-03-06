/* ========================================
   관리자 신고 내역 훅
   ======================================== */

/**
 * useAdminReports
 *
 * 목적: 관리자 신고 내역을 mock API에서 로드하고
 *       ReportedCampaignItem 타입으로 변환하여 반환합니다.
 *
 * 사용 페이지:
 * - /manager_ga/campaign/reported
 * - /manager_sa/campaign/reported
 */

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminReports } from "@/lib/api/admin";
import { reported_campaign_list } from "@/data/manager_ga/reported";
import type { AdminReportApiItem } from "@/types/api/admin";
import type { ReportedCampaignItem } from "@/data/manager_ga/reported";
import type { ReportCode } from "@/data/manager_ga/common/filterOptions";

function adaptReport(item: AdminReportApiItem): ReportedCampaignItem {
  return {
    id: String(item.id),
    campaign_number: item.campaign_number,
    campaign_name: item.campaign_name,
    report_code: item.report_code as ReportCode,
    report_reason: item.report_reason,
    inspector: item.inspector,
    target: item.target,
    processed_date: item.processed_date,
    report_count: item.report_count,
  };
}

export function useAdminReports() {
  const { data: apiData, isLoading } = useQuery({
    queryKey: ["adminReports"],
    queryFn: fetchAdminReports,
    staleTime: 30_000,
  });

  const reports = useMemo<ReportedCampaignItem[]>(() => {
    if (apiData != null && apiData.length > 0) {
      return apiData.map(adaptReport);
    }
    return reported_campaign_list;
  }, [apiData]);

  return { reports, isLoading };
}
