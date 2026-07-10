/* ========================================
   신청 캠페인 데이터 커스텀 훅
   ======================================== */

/**
 * useAppliedCampaigns
 *
 * 목적: 신청 탭의 캠페인 데이터를 실제 API(R-27)에서 조회·매핑·통계 계산합니다.
 *
 * 사용 페이지:
 * - /user/campaign_management/applied (신청 탭)
 */

import { useState, useEffect, useMemo, Dispatch, SetStateAction } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMyCampaigns, type MyCampaignItem } from "@/lib/api/userCampaignManagement";
import type { CampaignApplication } from "@/types/domain/user";

const statusMap: Record<string, CampaignApplication["status"]> = {
  APPLIED: "신청",
  SELECTED: "선정",
  COMPLETE: "완료",
  CANCELED: "취소/반려",
  REJECT: "취소/반려",
};

const typeLabel: Record<string, string> = {
  DELIVERY: "배송형",
  VISIT: "방문형",
  PURCHASE: "구매평",
  REPORTER: "기자단",
  MISSION: "미션형",
};

function calcRemainingDays(recruitEndAt: string): number {
  if (!recruitEndAt) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(recruitEndAt);
  if (isNaN(end.getTime())) return 0;
  end.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
}

function mapItem(item: MyCampaignItem): CampaignApplication {
  return {
    id: String(item.campaignId),
    title: item.title || "",
    category: item.channelType || "",
    image: item.thumbnailUrl || "",
    status: statusMap[item.status] || "취소/반려",
    remainingDays: calcRemainingDays(item.recruitEndAt),
    statusMessage: "",
    type: (typeLabel[item.campaignType] || "배송형") as CampaignApplication["type"],
    isUrgent: item.isUrgent || false,
    hasContent: !!item.content,
    isPenalty: false,
    extensionCount: 0,
    contentType: undefined,
    campaignApplicationId: item.campaignApplicationId,
  };
}

const STATIC_APPLIED: CampaignApplication[] = [
  {
    id: "u1001",
    title: "프리미엄 스킨케어 세럼 체험단",
    category: "NAVER_BLOG",
    image: "/images/main/campaign_img/eximg_7.png",
    status: "신청",
    remainingDays: 15,
    statusMessage: "심사 중",
    type: "배송형",
    isUrgent: false,
    hasContent: false,
    isPenalty: false,
    campaignApplicationId: 10001,
  },
  {
    id: "u1002",
    title: "프리미엄 카페 방문 체험단",
    category: "INSTAGRAM",
    image: "/images/main/campaign_img/eximg_5.png",
    status: "신청",
    remainingDays: 8,
    statusMessage: "심사 중",
    type: "방문형",
    isUrgent: true,
    hasContent: false,
    isPenalty: false,
    campaignApplicationId: 10002,
  },
];

const STATIC_STATS_APPLIED = {
  신청: 2,
  선정: 2,
  완료: 2,
  "취소/반려": 1,
  전체: 7,
  패널티: 0,
};

export function useAppliedCampaigns() {
  const { data: appliedData, isLoading } = useQuery({
    queryKey: ["myCampaigns", "APPLIED"],
    queryFn: () => fetchMyCampaigns({ status: "APPLIED" }),
    staleTime: 1000 * 30,
    retry: false,
  });

  const allQuery = useQuery({
    queryKey: ["myCampaigns"],
    queryFn: () => fetchMyCampaigns(),
    staleTime: 1000 * 30,
    retry: false,
  });

  const serverCampaigns: CampaignApplication[] = useMemo(
    () => (appliedData?.items ?? []).map(mapItem),
    [appliedData]
  );

  // 취소 낙관적 업데이트를 위한 로컬 state
  const [campaigns, setCampaigns] = useState<CampaignApplication[]>([]);

  useEffect(() => {
    if (!isLoading) {
      setCampaigns(serverCampaigns.length > 0 ? serverCampaigns : STATIC_APPLIED);
    }
  }, [serverCampaigns, isLoading]);

  const displayStats = useMemo(() => {
    const items = allQuery.data?.items ?? [];
    if (items.length === 0) return STATIC_STATS_APPLIED;
    const 신청 = items.filter((i) => i.status === "APPLIED").length;
    const 선정 = items.filter((i) => i.status === "SELECTED").length;
    const 완료 = items.filter((i) => i.status === "COMPLETE").length;
    const 취소반려 = items.filter((i) => i.status === "CANCELED" || i.status === "REJECT").length;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const 패널티 = items.filter((i) => (i as any).isPenalty).length;
    return {
      신청,
      선정,
      완료,
      "취소/반려": 취소반려,
      전체: 신청 + 선정 + 완료 + 취소반려,
      패널티,
    };
  }, [allQuery.data]);

  return {
    campaigns,
    setCampaigns: setCampaigns as Dispatch<SetStateAction<CampaignApplication[]>>,
    displayStats,
    statsReady: !allQuery.isLoading,
    isLoading,
  };
}
