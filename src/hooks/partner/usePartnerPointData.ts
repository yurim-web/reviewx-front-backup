/* ========================================
   파트너 포인트 데이터 커스텀 훅
   ======================================== */

/**
 * usePartnerPointData
 *
 * 목적: 파트너 포인트 내역과 요약 정보를 json-server에서 조회합니다.
 *
 * 사용 페이지:
 * - /partner/point (전체 내역)
 * - /partner/point/all
 * - /partner/point/earned (충전 내역)
 * - /partner/point/withdrawn (사용 내역)
 */

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { fetchPartnerPointHistory } from "@/lib/api/partnerPoint";
import type { PartnerPointHistory, PartnerPointSummary } from "@/types/domain/partner";

function getPartnerIdNum(userId?: string): number | undefined {
  if (!userId) return undefined;
  const num = parseInt(userId.replace(/\D/g, ""), 10);
  return isNaN(num) ? undefined : num;
}

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
    date: "2026-07-04",
    status: "completed",
    balance: 410000,
  },
  {
    id: "ph005",
    type: "withdrawn",
    amount: -60000,
    description: "리뷰어 포인트 지급 — 판교 IT카페 리뷰",
    campaign_id: "4044",
    date: "2026-06-28",
    status: "completed",
    balance: 500000,
  },
  {
    id: "ph006",
    type: "earned",
    amount: 300000,
    description: "포인트 충전",
    date: "2026-06-20",
    status: "earned",
    balance: 560000,
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
    return_reason: "캠페인 취소로 인한 잔여 포인트 반환",
  },
];

const STATIC_PARTNER_POINT_SUMMARY: PartnerPointSummary = {
  total_points: 1150000,
  available_points: 380000,
  pending_points: 0,
};

export function usePartnerPointData() {
  const { user } = useAuth();
  const partnerIdNum = getPartnerIdNum(user?.id);

  const { data: history = [], isLoading } = useQuery<PartnerPointHistory[]>({
    queryKey: ["partnerPointHistory", partnerIdNum],
    queryFn: () => fetchPartnerPointHistory(partnerIdNum!),
    enabled: partnerIdNum !== undefined,
    staleTime: 1000 * 30,
    retry: false,
  });

  const summary: PartnerPointSummary = useMemo(() => {
    if (history.length === 0) return STATIC_PARTNER_POINT_SUMMARY;
    const earned = history
      .filter((h) => h.type === "earned" && h.status === "earned")
      .reduce((sum, h) => sum + h.amount, 0);
    const withdrawn = history
      .filter((h) => h.type === "withdrawn" && h.status === "completed")
      .reduce((sum, h) => sum + Math.abs(h.amount), 0);
    const pending = history
      .filter((h) => h.status === "pending")
      .reduce((sum, h) => sum + Math.abs(h.amount), 0);
    const returned = history
      .filter((h) => h.type === "returned" && h.status === "completed")
      .reduce((sum, h) => sum + h.amount, 0);

    const available = earned - withdrawn + returned;
    return {
      total_points: earned + returned,
      available_points: available > 0 ? available : 0,
      pending_points: pending,
    };
  }, [history]);

  const displayHistory = history.length > 0 ? history : STATIC_PARTNER_POINT_HISTORY;

  return { history: displayHistory, summary, isLoading };
}
