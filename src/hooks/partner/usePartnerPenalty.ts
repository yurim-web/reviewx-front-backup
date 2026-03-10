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
import { fetchPartnerPenalties, fetchPartnerPenaltyStatus } from "@/lib/api/penalty";
import { partnerPenaltyData, partnerPenaltyStatus } from "@/data/partner/penaltyData";
import type { PenaltyItem, PenaltyStatusData } from "@/data/campaign_management/penaltyTypes";

// ========================================
// 상수: mock 고정 파트너 ID
// 실제 백엔드 전환 시 JWT/세션 기반으로 교체
// ========================================

const MOCK_PARTNER_ID = 1;

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
  const partnerId = MOCK_PARTNER_ID;

  const { data: penalties, isLoading: penaltiesLoading } = useQuery({
    queryKey: ["partnerPenalties", partnerId],
    queryFn: () => fetchPartnerPenalties(partnerId),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  const { data: status, isLoading: statusLoading } = useQuery({
    queryKey: ["partnerPenaltyStatus", partnerId],
    queryFn: () => fetchPartnerPenaltyStatus(partnerId),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  return {
    penaltyData: penalties ?? partnerPenaltyData,
    penaltyStatus: status ?? partnerPenaltyStatus,
    isLoading: penaltiesLoading || statusLoading,
  };
}
