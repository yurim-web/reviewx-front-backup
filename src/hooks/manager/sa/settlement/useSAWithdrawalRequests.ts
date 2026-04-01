/* ========================================
   SA 관리자 출금 요청 목록 훅
   ======================================== */

/**
 * useSAWithdrawalRequests
 *
 * 목적: SA 관리자 출금 요청 목록을 SA 전용 백엔드 API에서 로드하고
 *       AdminWithdrawalRequestItem 타입으로 변환하여 반환합니다.
 *
 * 사용 페이지:
 * - /manager_sa/settlement/withdrawal_request
 *
 * 백엔드 API (SA-05):
 * - GET /api/admin-sa/settlement/withdrawal/requests → 출금 요청 목록
 */

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSAWithdrawalRequests } from "@/lib/api/admin";
import type { SAWithdrawalRequestParams, SAWithdrawalRequestItem } from "@/types/api/admin";
import type { AdminWithdrawalRequestItem } from "@/types/api/admin";

/** 백엔드 SAWithdrawalRequestItem → 프론트 AdminWithdrawalRequestItem */
function adaptWithdrawalRequest(item: SAWithdrawalRequestItem): AdminWithdrawalRequestItem {
  const requestDate = (() => {
    if (!item.requestedAt) return "";
    const d = new Date(item.requestedAt);
    if (isNaN(d.getTime())) return "";
    const y = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const h = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${y}-${mo}-${day} ${h}:${min}`;
  })();

  return {
    id: String(item.id),
    number: String(item.seq).padStart(6, "0"),
    round: item.round ?? "-",
    name: item.name,
    account: `${item.bankName} ${item.accountNumber} ${item.accountHolder}`,
    ssn: item.ssn,
    amount: item.withdrawalPoints.toLocaleString(),
    remaining: item.remainingPoints.toLocaleString(),
    requestDate,
    type: item.memberType === "VIP" ? "VIP 회원" : "일반 회원",
    status: item.status === "BLOCKED" ? "정지" : item.status === "WARNED" ? "경고" : "정상",
  };
}

export function useSAWithdrawalRequests(params?: SAWithdrawalRequestParams) {
  // 긴급 출금 요청
  const { data: urgentData, isLoading: isUrgentLoading } = useQuery({
    queryKey: ["saWithdrawalRequests", "URGENT", params],
    queryFn: () => fetchSAWithdrawalRequests({ ...params, tab: "URGENT" }),
    staleTime: 30_000,
  });

  // 회차 정산 출금 요청
  const { data: roundData, isLoading: isRoundLoading } = useQuery({
    queryKey: ["saWithdrawalRequests", "ROUND", params],
    queryFn: () => fetchSAWithdrawalRequests({ ...params, tab: "ROUND" }),
    staleTime: 30_000,
  });

  const urgentRequests = useMemo<AdminWithdrawalRequestItem[]>(() => {
    if (!urgentData?.withdrawalRequests) return [];
    return urgentData.withdrawalRequests.map(adaptWithdrawalRequest);
  }, [urgentData]);

  const roundRequests = useMemo<AdminWithdrawalRequestItem[]>(() => {
    if (!roundData?.withdrawalRequests) return [];
    return roundData.withdrawalRequests.map(adaptWithdrawalRequest);
  }, [roundData]);

  return {
    urgentRequests,
    roundRequests,
    urgentTotalAmount: urgentData?.totalAmount ?? 0,
    roundTotalAmount: roundData?.totalAmount ?? 0,
    isLoading: isUrgentLoading || isRoundLoading,
  };
}
