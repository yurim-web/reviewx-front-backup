/* ========================================
   관리자 대시보드 훅
   ======================================== */

/**
 * useAdminDashboard
 *
 * 목적: 관리자 대시보드 통계를 mock API에서 로드합니다.
 *
 * 사용 페이지:
 * - /manager_ga (대시보드)
 * - /manager_sa (대시보드)
 */

import { useQuery } from "@tanstack/react-query";
import { fetchAdminDashboard } from "@/lib/api/admin";
import type { AdminDashboardApiItem } from "@/types/api/admin";

export function useAdminDashboard() {
  const { data, isLoading } = useQuery<AdminDashboardApiItem | null>({
    queryKey: ["adminDashboard"],
    queryFn: fetchAdminDashboard,
    staleTime: 30_000,
  });

  return { dashboard: data ?? null, isLoading };
}
