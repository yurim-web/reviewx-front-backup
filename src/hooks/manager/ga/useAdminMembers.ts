/* ========================================
   관리자 목록 훅
   ======================================== */

/**
 * useAdminMembers
 *
 * 목적: SA 관리자가 관리자 목록을 json-server에서 조회합니다.
 *
 * 사용 페이지:
 * - /manager_sa/member/admins
 */

import { useQuery } from "@tanstack/react-query";
import { fetchAdminMembers } from "@/lib/api/admin";
import type { AdminMemberApiItem } from "@/types/api/admin";

export function useAdminMembers() {
  const { data: adminMembers = [], isLoading } = useQuery<AdminMemberApiItem[]>({
    queryKey: ["adminMembers"],
    queryFn: fetchAdminMembers,
    staleTime: 1000 * 30,
    retry: false,
  });

  return { adminMembers, isLoading };
}
