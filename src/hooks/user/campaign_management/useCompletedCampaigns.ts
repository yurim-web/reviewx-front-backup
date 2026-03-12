/* ========================================
   완료 캠페인 데이터 커스텀 훅
   ======================================== */

/**
 * useCompletedCampaigns
 *
 * 목적: 완료 탭의 캠페인 데이터를 mock 서버에서 조회·필터링·통계 계산합니다.
 *
 * 사용 페이지:
 * - /user/campaign_management/completed (완료 탭)
 */

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { fetchReviewerCampaigns } from "@/lib/api/reviewer";
import { getReviewerIdNum } from "@/hooks/user/mypage/useReviewerProfile";
import type { CampaignApplication } from "@/types/domain/user";

export function useCompletedCampaigns() {
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
        .filter((c) => c.status === "완료")
        .map((c) => ({
          id: c.id,
          title: c.title,
          category: c.category,
          image: c.image,
          status: "완료" as const,
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
    const applied = rawCampaigns.filter((c) => c.status === "신청완료").length;
    const selected = rawCampaigns.filter(
      (c) => c.status === "선정완료" || c.status === "콘텐츠등록"
    ).length;
    const completed = rawCampaigns.filter((c) => c.status === "완료").length;
    const cancelled = rawCampaigns.filter((c) => c.status === "취소/반려").length;
    const penalty = rawCampaigns.filter((c) => c.isPenalty).length;
    return {
      신청: applied,
      선정: selected,
      완료: completed,
      "취소/반려": cancelled,
      전체: applied + selected + completed + cancelled,
      패널티: penalty,
    };
  }, [rawCampaigns]);

  return { campaigns, stats, isLoading };
}
