/* ========================================
   완료 캠페인 데이터 커스텀 훅
   ======================================== */

/**
 * useCompletedCampaigns
 *
 * 목적: 완료 탭의 캠페인 데이터를 실제 API(R-27)에서 조회·매핑·통계 계산합니다.
 *
 * 사용 페이지:
 * - /user/campaign_management/completed (완료 탭)
 */

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMyCampaigns, type MyCampaignItem } from "@/lib/api/userCampaignManagement";
import type { CampaignApplication } from "@/types/domain/user";

const typeLabel: Record<string, string> = {
  DELIVERY: "배송형",
  VISIT: "방문형",
  PURCHASE: "구매평",
  REPORTER: "기자단",
  MISSION: "미션형",
};

function mapItem(item: MyCampaignItem): CampaignApplication {
  return {
    id: String(item.campaignId),
    title: item.title || "",
    category: "",
    image: item.thumbnailUrl || "",
    status: "완료" as const,
    remainingDays: 0,
    statusMessage: "",
    type: (typeLabel[item.campaignType] || "배송형") as CampaignApplication["type"],
    isUrgent: item.isUrgent || false,
    hasContent: !!item.content,
    isPenalty: false,
    extensionCount: 0,
    contentType: undefined,
  };
}

export function useCompletedCampaigns() {
  const { data: completedData, isLoading } = useQuery({
    queryKey: ["myCampaigns", "COMPLETE"],
    queryFn: () => fetchMyCampaigns({ status: "COMPLETE" }),
    staleTime: 1000 * 30,
    retry: false,
  });

  const allQuery = useQuery({
    queryKey: ["myCampaigns"],
    queryFn: () => fetchMyCampaigns(),
    staleTime: 1000 * 30,
    retry: false,
  });

  const campaigns: CampaignApplication[] = useMemo(
    () => (completedData?.items || []).map(mapItem),
    [completedData]
  );

  const allItems = allQuery.data?.items || [];

  const stats = useMemo(() => {
    const 신청 = allItems.filter((i) => i.status === "APPLIED").length;
    const 선정 = allItems.filter((i) => i.status === "SELECTED").length;
    const 완료 = allItems.filter((i) => i.status === "COMPLETE").length;
    const 취소반려 = allItems.filter(
      (i) => i.status === "CANCELED" || i.status === "REJECT"
    ).length;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const 패널티 = allItems.filter((i) => (i as any).isPenalty).length;
    return {
      신청,
      선정,
      완료,
      "취소/반려": 취소반려,
      전체: 신청 + 선정 + 완료 + 취소반려,
      패널티,
    };
  }, [allItems]);

  return { campaigns, stats, isLoading };
}
