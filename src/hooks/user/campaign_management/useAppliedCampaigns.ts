/* ========================================
   신청 캠페인 데이터 커스텀 훅
   ======================================== */

/**
 * useAppliedCampaigns
 *
 * 목적: 신청 탭의 캠페인 데이터를 mock 서버에서 조회·필터링·통계 계산합니다.
 *
 * 사용 페이지:
 * - /user/campaign_management/applied (신청 탭)
 */

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { fetchReviewerCampaigns } from "@/lib/api/reviewer";
import { getReviewerIdNum } from "@/hooks/user/mypage/useReviewerProfile";
import type { CampaignApplication } from "@/types/domain/user";

// db.json status → CampaignApplication.status 매핑
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

export function useAppliedCampaigns() {
  const { user } = useAuth();
  const reviewerIdNum = getReviewerIdNum(user?.id);

  const { data: rawCampaigns = [], isLoading } = useQuery({
    queryKey: ["reviewerCampaigns", reviewerIdNum],
    queryFn: () => fetchReviewerCampaigns(reviewerIdNum!),
    enabled: !!reviewerIdNum,
    staleTime: 1000 * 30,
    retry: false,
  });

  // 신청완료 상태만 필터링 → CampaignApplication 형태로 매핑
  const serverCampaigns: CampaignApplication[] = rawCampaigns
    .filter((c) => c.status === "신청완료")
    .map((c) => ({
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
    }));

  // 취소 낙관적 업데이트를 위한 로컬 state
  const [campaigns, setCampaigns] = useState<CampaignApplication[]>([]);

  useEffect(() => {
    if (!isLoading) {
      setCampaigns(serverCampaigns);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawCampaigns, isLoading]);

  // 전체 탭별 통계 계산
  const 선정 = rawCampaigns.filter(
    (c) => c.status === "선정완료" || c.status === "콘텐츠등록"
  ).length;
  const 완료 = rawCampaigns.filter((c) => c.status === "완료").length;
  const 취소반려 = rawCampaigns.filter((c) => c.status === "취소/반려").length;
  const 패널티 = rawCampaigns.filter((c) => c.isPenalty).length;

  const displayStats = {
    신청: serverCampaigns.length, // rawCampaigns 기반 직접 계산 (state 지연 없음)
    선정,
    완료,
    "취소/반려": 취소반려,
    전체: serverCampaigns.length + 선정 + 완료 + 취소반려,
    패널티,
  };

  return {
    campaigns,
    setCampaigns: setCampaigns as Dispatch<SetStateAction<CampaignApplication[]>>,
    displayStats,
    statsReady: !isLoading,
    isLoading,
  };
}
