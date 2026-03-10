/* ========================================
   유저 패널티 커스텀 훅
   ======================================== */

/**
 * useUserPenalty
 *
 * 목적: 유저(리뷰어)의 패널티 내역과 상태를 API에서 조회합니다.
 *      실패 시 정적 목업 데이터로 fallback 합니다.
 *
 * 사용 페이지:
 * - /user/campaign_management/penalty (유저 패널티 페이지)
 */

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { fetchUserPenalties, fetchUserPenaltyStatus } from "@/lib/api/penalty";
import { userPenaltyData, userPenaltyStatus } from "@/data/user/penaltyData";
import type { PenaltyItem, PenaltyStatusData } from "@/data/campaign_management/penaltyTypes";

// ========================================
// 유틸: 사용자 ID → 리뷰어 ID (mock 전용)
// 실제 백엔드 전환 시 JWT 기반으로 교체
// ========================================

function getReviewerId(userId: string): number {
  if (userId.includes("kakao")) return 1;
  if (userId.includes("naver")) return 2;
  return 1;
}

// ========================================
// 반환 타입
// ========================================

export interface UseUserPenaltyReturn {
  penaltyData: PenaltyItem[];
  penaltyStatus: PenaltyStatusData;
  isLoading: boolean;
}

// ========================================
// 훅
// ========================================

export function useUserPenalty(): UseUserPenaltyReturn {
  const { user } = useAuth();
  const reviewerId = user ? getReviewerId(user.id) : 1;

  const { data: penalties, isLoading: penaltiesLoading } = useQuery({
    queryKey: ["userPenalties", reviewerId],
    queryFn: () => fetchUserPenalties(reviewerId),
    enabled: reviewerId > 0,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  const { data: status, isLoading: statusLoading } = useQuery({
    queryKey: ["userPenaltyStatus", reviewerId],
    queryFn: () => fetchUserPenaltyStatus(reviewerId),
    enabled: reviewerId > 0,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  return {
    penaltyData: penalties ?? userPenaltyData,
    penaltyStatus: status ?? userPenaltyStatus,
    isLoading: penaltiesLoading || statusLoading,
  };
}
