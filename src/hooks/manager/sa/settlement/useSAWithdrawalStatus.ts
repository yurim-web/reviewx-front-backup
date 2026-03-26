/* ========================================
   SA 관리자 출금 현황 훅
   ======================================== */

/**
 * useSAWithdrawalStatus
 *
 * 목적: SA 관리자 출금 현황을 SA 전용 백엔드 API에서 로드하고
 *       WithdrawalItem 타입으로 변환하여 반환합니다.
 *
 * 사용 페이지:
 * - /manager_sa/settlement/withdrawal
 *
 * 백엔드 API (SA-04):
 * - GET /api/admin-sa/settlement/withdrawal → 출금 현황 목록
 * - GET /api/admin-sa/settlement/withdrawal/stats → 통계 카드
 */

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSAWithdrawalList } from "@/lib/api/admin";
import type { SAWithdrawalStatusParams, SAWithdrawalStatusItem } from "@/types/api/admin";
import type { WithdrawalItem } from "@/data/manager_sa/settlement/withdrawalData";

// ── paymentStatus 매핑 (UPPERCASE → lowercase) ──
const PAYMENT_STATUS_MAP: Record<string, WithdrawalItem["paymentStatus"]> = {
  URGENT: "urgent",
  REQUEST: "request",
  COMPLETED: "completed",
  REJECTED: "rejected",
  // lowercase 호환
  urgent: "urgent",
  request: "request",
  completed: "completed",
  rejected: "rejected",
};

// ── memberType 매핑 ──
const MEMBER_TYPE_MAP: Record<string, WithdrawalItem["type"]> = {
  NORMAL: "일반 회원",
  CAUTION: "주의 회원",
  RESTRICTED: "이용 제한 회원",
  "일반 회원": "일반 회원",
  "주의 회원": "주의 회원",
  "이용 제한 회원": "이용 제한 회원",
};

// ── status 매핑 ──
const STATUS_MAP: Record<string, WithdrawalItem["status"]> = {
  ACTIVE: "정상",
  PAUSED: "일시 정지",
  BANNED: "영구 정지",
  WITHDRAWN: "탈퇴",
  정상: "정상",
  "일시 정지": "일시 정지",
  "영구 정지": "영구 정지",
  탈퇴: "탈퇴",
};

function formatDate(iso: string | null): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day} ${h}:${min}`;
}

/** 백엔드 SAWithdrawalStatusItem → 프론트 WithdrawalItem */
function adaptWithdrawalItem(item: SAWithdrawalStatusItem): WithdrawalItem {
  return {
    id: String(item.id),
    number: item.number,
    round: item.round ?? "-",
    name: item.name,
    account: item.account,
    ssn: item.ssn ?? "------*******",
    amount:
      typeof item.amount === "number" ? item.amount.toLocaleString("ko-KR") : String(item.amount),
    remaining:
      typeof item.remaining === "number"
        ? item.remaining.toLocaleString("ko-KR")
        : String(item.remaining ?? "-"),
    requestDate: formatDate(item.requestDate),
    paymentDate: formatDate(item.paymentDate),
    type: MEMBER_TYPE_MAP[item.memberType] ?? "일반 회원",
    paymentStatus: PAYMENT_STATUS_MAP[item.paymentStatus] ?? "request",
    status: STATUS_MAP[item.status] ?? "정상",
  };
}

export function useSAWithdrawalStatus(params?: SAWithdrawalStatusParams) {
  // 출금 현황 목록 (통계는 클라이언트 계산 — 명세서: 별도 stats API 없음)
  const { data: listData, isLoading } = useQuery({
    queryKey: ["saWithdrawalStatus", params],
    queryFn: () => fetchSAWithdrawalList(params),
    staleTime: 30_000,
  });

  const withdrawals = useMemo<WithdrawalItem[]>(() => {
    if (!listData?.withdrawals) return [];
    return listData.withdrawals.map(adaptWithdrawalItem);
  }, [listData]);

  return {
    withdrawals,
    isLoading,
  };
}
