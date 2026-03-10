/* ========================================
   관리자 차단(이용제한) 목록 훅
   ======================================== */

/**
 * useAdminBlacklist
 *
 * 목적: 관리자 이용제한 목록을 json-server에서 조회합니다.
 *
 * 사용 페이지:
 * - /manager_ga/member/blacklist
 * - /manager_sa/member/blacklist
 */

import { useQuery } from "@tanstack/react-query";
import { fetchAdminBlacklist } from "@/lib/api/admin";
import type { AdminBlacklistApiItem } from "@/types/api/admin";

export function useAdminBlacklist() {
  const { data: blacklist = [], isLoading } = useQuery<AdminBlacklistApiItem[]>({
    queryKey: ["adminBlacklist"],
    queryFn: fetchAdminBlacklist,
    staleTime: 1000 * 30,
    retry: false,
  });

  return { blacklist, isLoading };
}
