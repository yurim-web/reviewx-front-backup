/* ========================================
   관리자 대시보드 훅
   ======================================== */

/**
 * useAdminDashboard
 *
 * 목적: GA-01 대시보드 통계를 API에서 로드합니다.
 *
 * API: GET /api/admin/dashboard?period=&startDate=&endDate=
 *
 * 사용 페이지:
 * - /manager_ga (대시보드)
 */

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getAdminDashboardStats } from "@/lib/api/admin";
import type { AdminDashboardResponse, DashboardPeriod } from "@/types/api/admin";

export interface UseAdminDashboardParams {
  period?: DashboardPeriod;
  startDate?: string;
  endDate?: string;
}

export function useAdminDashboard(params?: UseAdminDashboardParams) {
  const { data, isLoading, isError } = useQuery<AdminDashboardResponse>({
    queryKey: ["adminDashboard", params?.period, params?.startDate, params?.endDate],
    queryFn: () => getAdminDashboardStats(params),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });

  return { dashboard: data ?? null, isLoading, isError };
}
