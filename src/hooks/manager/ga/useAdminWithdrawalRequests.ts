/* ========================================
   출금 요청 목록 훅
   ======================================== */

/**
 * useAdminWithdrawalRequests
 *
 * 목적: SA 관리자 출금 요청 목록을 json-server에서 조회합니다.
 *
 * 사용 페이지:
 * - /manager_sa/settlement/withdrawal_request
 */

import { useQuery } from "@tanstack/react-query";
import { fetchAdminWithdrawalRequests } from "@/lib/api/admin";
import type { AdminWithdrawalRequestItem } from "@/types/api/admin";

export function useAdminWithdrawalRequests() {
  const { data: requests = [], isLoading } = useQuery<AdminWithdrawalRequestItem[]>({
    queryKey: ["adminWithdrawalRequests"],
    queryFn: fetchAdminWithdrawalRequests,
    staleTime: 1000 * 30,
    retry: false,
  });

  return { requests, isLoading };
}
