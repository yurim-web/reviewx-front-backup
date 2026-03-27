/* ========================================
   SA 대시보드 통합 데이터 훅
   ======================================== */

/**
 * useSADashboard
 *
 * 목적: SA 대시보드 통합 API(SA-01)를 호출하여 5개 섹션 데이터를 한 번에 조회합니다.
 *       API 실패 시 각 섹션은 기존 mock/fallback 로직을 그대로 사용합니다.
 *
 * 사용 페이지:
 * - /manager_sa (최고관리자 대시보드)
 *
 * API: GET /api/admin-sa/dashboard?startDate={}&endDate={}
 */

import { useQuery } from "@tanstack/react-query";
import { fetchSADashboard } from "@/lib/api/admin";
import type { SADashboardResponse } from "@/types/api/admin";
import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";
import { format } from "date-fns";

export function useSADashboard(dateRange: DateRange) {
  const startDate = dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : undefined;
  const endDate = dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : undefined;

  // startDate/endDate 미입력 시 백엔드에서 당월 1일~오늘 기본값 사용
  const { data, isLoading, error } = useQuery<SADashboardResponse>({
    queryKey: ["sa", "dashboard", startDate, endDate],
    queryFn: () => fetchSADashboard({ startDate, endDate }),
    staleTime: 1000 * 60, // 1분
  });

  return {
    dashboardData: data?.dashboardData ?? null,
    isLoading,
    error,
  };
}
