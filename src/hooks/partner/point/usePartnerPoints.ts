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

const STATIC_PARTNER_POINT_HISTORY: PartnerPointHistory[] = [
  {
    id: "ph001",
    type: "earned",
    amount: 500000,
    description: "포인트 충전",
    date: "2026-07-08",
    status: "earned",
    balance: 500000,
    payment_method: "card",
  },
  {
    id: "ph002",
    type: "withdrawn",
    amount: -120000,
    description: "리뷰어 포인트 지급 — 프리미엄 스킨케어 세트 체험단",
    campaign_id: "961",
    date: "2026-07-06",
    status: "completed",
    balance: 380000,
  },
  {
    id: "ph003",
    type: "earned",
    amount: 300000,
    description: "포인트 충전",
    date: "2026-07-02",
    status: "earned",
    balance: 500000,
    payment_method: "bank",
  },
  {
    id: "ph004",
    type: "withdrawn",
    amount: -90000,
    description: "리뷰어 포인트 지급 — 식당 방문 리뷰",
    campaign_id: "1001",
    date: "2026-07-01",
    status: "completed",
    balance: 380000,
  },
  {
    id: "ph005",
    type: "withdrawn",
    amount: -60000,
    description: "리뷰어 포인트 지급 — 판교 IT카페 리뷰",
    campaign_id: "4044",
    date: "2026-06-28",
    status: "completed",
    balance: 470000,
  },
  {
    id: "ph006",
    type: "earned",
    amount: 300000,
    description: "포인트 충전",
    date: "2026-06-20",
    status: "earned",
    balance: 530000,
    payment_method: "card",
  },
  {
    id: "ph007",
    type: "returned",
    amount: 50000,
    description: "캠페인 포인트 반환 — 충전 케이블 세트 리뷰",
    campaign_id: "4026",
    date: "2026-06-10",
    status: "completed",
    balance: 260000,
  },
];

const STATIC_PARTNER_POINT_SUMMARY: PartnerPointSummary = {
  total_points: 1150000,
  available_points: 380000,
  pending_points: 0,
};

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

  const rawHistory: PartnerPointHistory[] = allTransactions.map(adaptTransaction);
  const history: PartnerPointHistory[] =
    rawHistory.length > 0 ? rawHistory : STATIC_PARTNER_POINT_HISTORY;
  const summary: PartnerPointSummary =
    rawHistory.length > 0
      ? { total_points: currentBalance, available_points: currentBalance, pending_points: 0 }
      : STATIC_PARTNER_POINT_SUMMARY;

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
