/* ========================================
   파트너 패널티 커스텀 훅
   ======================================== */

/**
 * usePartnerPenalty
 *
 * 목적: 파트너(광고주)의 패널티 내역과 상태를 API에서 조회합니다.
 *      실패 시 정적 목업 데이터로 fallback 합니다.
 *
 * 사용 페이지:
 * - /partner/campaign_management/penalty (파트너 패널티 페이지)
 */

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { fetchPartnerPenalties, fetchPartnerPenaltyStatus } from "@/lib/api/penalty";
import { partnerPenaltyData, partnerPenaltyStatus } from "@/data/partner/penaltyData";
import type { PenaltyItem, PenaltyStatusData } from "@/data/campaign_management/penaltyTypes";

function getPartnerIdFromUser(userId?: string): number | null {
  if (!userId) return null;
  const num = parseInt(userId.replace(/\D/g, ""), 10);
  return isNaN(num) ? null : num;
}

// ========================================
// 반환 타입
// ========================================

export interface UsePartnerPenaltyReturn {
  penaltyData: PenaltyItem[];
  penaltyStatus: PenaltyStatusData;
  isLoading: boolean;
}

// ========================================
// 훅
// ========================================

export function usePartnerPenalty(): UsePartnerPenaltyReturn {
  const { user } = useAuth();
  const partnerId = getPartnerIdFromUser(user?.id);

  const { data: penalties, isLoading: penaltiesLoading } = useQuery({
    queryKey: ["partnerPenalties", partnerId],
    queryFn: () => fetchPartnerPenalties(partnerId!),
    enabled: partnerId !== null,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  const { data: status, isLoading: statusLoading } = useQuery({
    queryKey: ["partnerPenaltyStatus", partnerId],
    queryFn: () => fetchPartnerPenaltyStatus(partnerId!),
    enabled: partnerId !== null,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  return {
    penaltyData: penalties ?? partnerPenaltyData,
    penaltyStatus: status ?? partnerPenaltyStatus,
    isLoading: penaltiesLoading || statusLoading,
  };
}
