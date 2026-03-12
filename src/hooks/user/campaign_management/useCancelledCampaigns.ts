/* ========================================
   취소/반려 캠페인 데이터 커스텀 훅
   ======================================== */

/**
 * useCancelledCampaigns
 *
 * 목적: 취소/반려 탭의 캠페인 데이터를 mock 서버에서 조회·필터링·통계 계산합니다.
 *
 * 사용 페이지:
 * - /user/campaign_management/cancelled (취소/반려 탭)
 */

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { fetchReviewerCampaigns } from "@/lib/api/reviewer";
import { getReviewerIdNum } from "@/hooks/user/mypage/useReviewerProfile";
import type { CampaignApplication } from "@/types/domain/user";

export function useCancelledCampaigns() {
  const { user } = useAuth();
  const reviewerIdNum = getReviewerIdNum(user?.id);

  const { data: allCampaigns = [], isLoading } = useQuery({
    queryKey: ["reviewerCampaigns", reviewerIdNum],
    queryFn: () => fetchReviewerCampaigns(reviewerIdNum!),
    enabled: !!reviewerIdNum,
    staleTime: 1000 * 30,
    retry: false,
  });

  // mock: 클라이언트 reviewer_id 필터링
  const rawCampaigns = useMemo(
    () => allCampaigns.filter((c) => !c.reviewer_id || c.reviewer_id === reviewerIdNum),
    [allCampaigns, reviewerIdNum]
  );

  const campaigns: CampaignApplication[] = useMemo(
    () =>
      rawCampaigns
        .filter((c) => c.status === "취소/반려")
        .map((c) => ({
          id: c.id,
          title: c.title,
          category: c.category,
          image: c.image,
          status: "취소/반려" as const,
          remainingDays: c.remainingDays,
          statusMessage: c.statusMessage,
          type: c.type,
          isUrgent: c.isUrgent,
          hasContent: c.hasContent,
          isPenalty: c.isPenalty,
          extensionCount: c.extensionCount,
          contentType: c.contentType,
        })),
    [rawCampaigns]
  );

  const stats = useMemo(() => {
    const 신청 = rawCampaigns.filter((c) => c.status === "신청완료").length;
    const 선정 = rawCampaigns.filter(
      (c) => c.status === "선정완료" || c.status === "콘텐츠등록"
    ).length;
    const 완료 = rawCampaigns.filter((c) => c.status === "완료").length;
    const 취소반려 = rawCampaigns.filter((c) => c.status === "취소/반려").length;
    const 패널티 = rawCampaigns.filter((c) => c.isPenalty).length;
    return {
      신청,
      선정,
      완료,
      "취소/반려": 취소반려,
      전체: 신청 + 선정 + 완료 + 취소반려,
      패널티,
    };
  }, [rawCampaigns]);

  return { campaigns, stats, isLoading };
}
