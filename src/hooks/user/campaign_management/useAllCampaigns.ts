/* ========================================
   전체 캠페인 데이터 커스텀 훅
   ======================================== */

/**
 * useAllCampaigns
 *
 * 목적: 전체 탭의 캠페인 데이터를 mock 서버에서 조회·매핑·통계 계산합니다.
 *
 * 사용 페이지:
 * - /user/campaign_management/all (전체 탭)
 */

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { fetchReviewerCampaigns } from "@/lib/api/reviewer";
import { getReviewerIdNum } from "@/hooks/user/mypage/useReviewerProfile";
import type { CampaignApplication } from "@/types/domain/user";

function mapStatus(dbStatus: string): CampaignApplication["status"] {
  switch (dbStatus) {
    case "신청완료":
      return "신청";
    case "선정완료":
    case "콘텐츠등록":
      return "선정";
    case "완료":
      return "완료";
    default:
      return "취소/반려";
  }
}

export function useAllCampaigns() {
  const { user } = useAuth();
  const reviewerIdNum = getReviewerIdNum(user?.id);

  const { data: rawCampaigns = [], isLoading } = useQuery({
    queryKey: ["reviewerCampaigns", reviewerIdNum],
    queryFn: () => fetchReviewerCampaigns(reviewerIdNum!),
    enabled: !!reviewerIdNum,
    staleTime: 1000 * 30,
    retry: false,
  });

  const campaigns: CampaignApplication[] = useMemo(
    () =>
      rawCampaigns.map((c) => ({
        id: c.id,
        title: c.title,
        category: c.category,
        image: c.image,
        status: mapStatus(c.status),
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
