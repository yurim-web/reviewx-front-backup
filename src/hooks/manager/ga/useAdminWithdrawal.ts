/* ========================================
   관리자 출금 요청 목록 훅
   ======================================== */

/**
 * useAdminWithdrawal
 *
 * 목적: SA 관리자 출금 요청 목록을 mock API에서 로드하고
 *       WithdrawalItem 타입으로 변환하여 반환합니다.
 *
 * 사용 페이지:
 * - /manager_sa/settlement/withdrawal
 */

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminWithdrawal } from "@/lib/api/admin";
import { withdrawalList, type WithdrawalItem } from "@/data/manager_sa/settlement/withdrawalData";
import type { AdminWithdrawalApiItem } from "@/types/api/admin";

const STATUS_MAP: Record<string, WithdrawalItem["paymentStatus"]> = {
  PENDING: "request",
  APPROVED: "completed",
  REJECTED: "rejected",
  URGENT: "urgent",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day} ${h}:${min}`;
}

function adaptWithdrawalItem(item: AdminWithdrawalApiItem, index: number): WithdrawalItem {
  return {
    id: String(item.id),
    number: String(index + 1).padStart(6, "0"),
    round: item.round != null ? String(item.round) : "-",
    name: item.user_name,
    account: `${item.bank} ${item.account_number} ${item.account_holder}`,
    ssn: item.ssn ?? "------*******",
    amount: (item.net_amount ?? item.requested_amount ?? 0).toLocaleString("ko-KR"),
    remaining: item.remaining_amount != null ? item.remaining_amount.toLocaleString("ko-KR") : "-",
    requestDate: formatDate(item.request_date),
    paymentDate: item.processed_date ? formatDate(item.processed_date) : "-",
    type: "일반 회원",
    paymentStatus: STATUS_MAP[item.status] ?? "request",
    status: "정상",
  };
}

export function useAdminWithdrawal() {
  const { data: apiData, isLoading } = useQuery({
    queryKey: ["adminWithdrawal"],
    queryFn: fetchAdminWithdrawal,
    staleTime: 30_000,
  });

  const withdrawals = useMemo<WithdrawalItem[]>(() => {
    if (apiData != null && apiData.length > 0) {
      return apiData.map(adaptWithdrawalItem);
    }
    return withdrawalList;
  }, [apiData]);

  return { withdrawals, isLoading };
}
