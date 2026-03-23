/* ========================================
   파트너 포인트 React Query 훅
   ======================================== */

/**
 * usePartnerPointList / useChargeReceipt
 *
 * 목적: 파트너 포인트 내역 조회 및 거래명세서 조회 (실제 API)
 *
 * API:
 * - 24번: GET /partner/points?type=ALL|CHARGE|USE&page=0&size=15
 * - 24-1번: GET /partner/points/charge/{chargeId}/receipt
 *
 * 사용 페이지:
 * - /partner/point/all (전체 내역)
 * - /partner/point/earned (충전 내역)
 * - /partner/point/withdrawn (사용 내역)
 */

import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { getPartnerPoints, getChargeReceipt } from "@/lib/api/partnerPoint";
import type { PointFilterType, PointTransaction } from "@/types/api/partnerPoint";
import type { PartnerPointHistory, PartnerPointSummary } from "@/types/domain/partner";

export const partnerPointKeys = {
  list: (type: PointFilterType) => ["partnerPoints", type] as const,
};

/* ========================================
   어댑터: API 타입 → 도메인 타입
   ======================================== */

const TYPE_MAP: Record<string, PartnerPointHistory["type"]> = {
  CHARGE: "earned",
  PAYOUT: "withdrawn",
  REFUND: "returned",
};

function adaptTransaction(tx: PointTransaction): PartnerPointHistory {
  return {
    id: String(tx.transactionId),
    type: TYPE_MAP[tx.type] || "earned",
    amount: tx.amount,
    description: tx.description,
    date: tx.createdAt.substring(0, 10),
    status: tx.type === "CHARGE" ? "earned" : "completed",
    balance: tx.balanceAfter,
    payment_method: tx.paymentMethod,
  };
}

/* ========================================
   훅: 포인트 내역 조회 (무한스크롤)
   ======================================== */

/** 포인트 내역 조회 훅 (전체/충전/사용 공통, 무한스크롤) */
export function usePartnerPointList(type: PointFilterType = "ALL") {
  const query = useInfiniteQuery({
    queryKey: partnerPointKeys.list(type),
    queryFn: ({ pageParam }) => getPartnerPoints(type, pageParam as number),
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.data.hasNext ? (lastPageParam as number) + 1 : undefined,
    initialPageParam: 0,
    staleTime: 30 * 1000,
  });

  const allTransactions = query.data?.pages.flatMap((p) => p.data.transactions) ?? [];
  const currentBalance = query.data?.pages[0]?.data.currentBalance ?? 0;

  const history: PartnerPointHistory[] = allTransactions.map(adaptTransaction);
  const summary: PartnerPointSummary = {
    total_points: currentBalance,
    available_points: currentBalance,
    pending_points: 0,
  };

  return {
    history,
    summary,
    isLoading: query.isLoading,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage ?? false,
    isFetchingNextPage: query.isFetchingNextPage,
  };
}

/** 거래명세서 URL 조회 훅 (충전 항목 전용) */
export function useChargeReceipt() {
  return useMutation({
    mutationFn: (chargeId: number) => getChargeReceipt(chargeId),
  });
}
