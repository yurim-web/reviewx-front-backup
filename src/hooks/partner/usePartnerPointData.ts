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

  return { history, summary, isLoading };
}
