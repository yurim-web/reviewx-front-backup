/* ========================================
   유저 패널티 커스텀 훅
   ======================================== */

/**
 * useUserPenalty
 *
 * 목적: 리뷰어 패널티 현황/내역을 R-36 API로 조회하고
 *       기존 UI 타입(PenaltyItem[], PenaltyStatusData)으로 매핑
 *
 * 사용 페이지:
 * - /user/campaign_management/penalty (유저 패널티 페이지)
 *
 * 호출 API:
 * - GET /user/campaign_management/penalty (R-36)
 */

import { useQuery } from "@tanstack/react-query";
import { fetchReviewerPenalty } from "@/lib/api/penalty";
import type {
  PenaltyItem,
  PenaltyStatusData,
  PenaltyStatus,
  PenaltyType,
} from "@/data/campaign_management/penaltyTypes";

export interface UseUserPenaltyReturn {
  penaltyData: PenaltyItem[];
  penaltyStatus: PenaltyStatusData;
  isLoading: boolean;
}

/** R-36 currentLevel → UI PenaltyStatus 매핑 */
function mapLevelToStatus(
  level: string,
  isSuspended: boolean,
  remainDays: number | null,
  isPermanentlyBanned: boolean
): PenaltyStatus {
  if (isPermanentlyBanned) return "영구 정지";
  if (isSuspended && remainDays) {
    if (remainDays <= 7) return "이용 정지 7일";
    if (remainDays <= 15) return "이용 정지 15일";
    return "이용 정지 30일";
  }
  if (level === "CAUTION") return "경고 조치";
  return "활동 가능";
}

/** R-36 penaltyScore → UI PenaltyType 매핑 */
function mapScoreToType(score: number): PenaltyType {
  if (score <= 10) return "경고";
  if (score <= 30) return "주의";
  if (score <= 50) return "정지";
  return "제재";
}

export function useUserPenalty(): UseUserPenaltyReturn {
  const { data, isLoading } = useQuery({
    queryKey: ["userPenalties"],
    queryFn: fetchReviewerPenalty,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  // R-36 items → 기존 PenaltyItem[] 매핑
  const penaltyData: PenaltyItem[] = (data?.items ?? []).map((item) => ({
    id: String(item.userPenaltyHistoryId),
    type: mapScoreToType(item.penaltyScore),
    title: item.penaltyReason,
    campaignTitle: item.campaignTitle,
    date: item.createdAt.split("T")[0],
  }));

  // R-36 summary → 기존 PenaltyStatusData 매핑
  const penaltyStatus: PenaltyStatusData = data?.summary
    ? {
        currentStatus: mapLevelToStatus(
          data.summary.currentLevel,
          data.summary.isSuspended,
          data.summary.suspendedRemainingDays,
          data.summary.isPermanentlyBanned
        ),
        penaltyCount: data.summary.currentTotalScore,
      }
    : { currentStatus: "활동 가능", penaltyCount: 0 };

  return { penaltyData, penaltyStatus, isLoading };
}
