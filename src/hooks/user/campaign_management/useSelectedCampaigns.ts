/* ========================================
   선정 캠페인 데이터 커스텀 훅
   ======================================== */

/**
 * useSelectedCampaigns
 *
 * 목적: 선정 탭의 캠페인 데이터를 실제 API(R-27)에서 조회·매핑·통계 계산합니다.
 *
 * 사용 페이지:
 * - /user/campaign_management/selected (선정 탭)
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

function calcRemainingDays(recruitEndAt: string): number {
  if (!recruitEndAt) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(recruitEndAt);
  if (isNaN(end.getTime())) return 0;
  end.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
}

function mapSubStatus(item: MyCampaignItem): CampaignApplication["subStatus"] {
  const contentStatus = item.content?.contentStatus;
  if (contentStatus === "SUBMITTED" || contentStatus === "APPROVED") {
    return "content_registered";
  }
  return "content_not_registered";
}

function mapItem(item: MyCampaignItem): CampaignApplication {
  return {
    id: String(item.campaignId),
    title: item.title || "",
    category: item.channelType || "",
    image: item.thumbnailUrl || "",
    status: "선정" as const,
    remainingDays: calcRemainingDays(item.recruitEndAt),
    statusMessage: "",
    type: (typeLabel[item.campaignType] || "배송형") as CampaignApplication["type"],
    isUrgent: item.isUrgent || false,
    hasContent: !!item.content,
    isPenalty: false,
    extensionCount: undefined,
    contentType: undefined,
    subStatus: mapSubStatus(item),
  };
}

export function useSelectedCampaigns() {
  const { data: selectedData, isLoading } = useQuery({
    queryKey: ["myCampaigns", "SELECTED"],
    queryFn: () => fetchMyCampaigns({ status: "SELECTED" }),
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
    () => (selectedData?.items || []).map(mapItem),
    [selectedData]
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
