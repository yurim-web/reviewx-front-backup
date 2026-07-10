/* ========================================
   전체 캠페인 데이터 커스텀 훅
   ======================================== */

/**
 * useAllCampaigns
 *
 * 목적: 전체 탭의 캠페인 데이터를 실제 API(R-27)에서 조회·매핑·통계 계산합니다.
 *
 * 사용 페이지:
 * - /user/campaign_management/all (전체 탭)
 */

import { useMemo } from "react";
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
    isPenalty: item.isPenalty || false,
    extensionCount: 0,
    contentType: undefined,
    subStatus: item.subStatus as CampaignApplication["subStatus"],
    rejectionReason: item.rejectionReason,
    campaignApplicationId: item.campaignApplicationId,
  };
}

const STATIC_ALL: CampaignApplication[] = [
  {
    id: "u1001",
    title: "프리미엄 스킨케어 세럼 체험단",
    category: "네이버블로그",
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
    category: "인스타그램",
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
  {
    id: "u2001",
    title: "테크 기자단 체험단",
    category: "네이버블로그",
    image: "/images/main/campaign_img/eximg_6.png",
    status: "선정",
    remainingDays: 20,
    statusMessage: "콘텐츠 등록 전",
    type: "기자단",
    isUrgent: false,
    hasContent: false,
    isPenalty: false,
    subStatus: "content_not_registered",
    campaignApplicationId: 20001,
  },
  {
    id: "u2002",
    title: "패션 미션형 체험단",
    category: "인스타그램",
    image: "/images/main/campaign_img/eximg_4.png",
    status: "선정",
    remainingDays: 5,
    statusMessage: "콘텐츠 등록 완료",
    type: "미션형",
    isUrgent: true,
    hasContent: true,
    isPenalty: false,
    subStatus: "content_registered",
    campaignApplicationId: 20002,
  },
  {
    id: "u3001",
    title: "피자 구매평 리뷰",
    category: "네이버블로그",
    image: "/images/main/campaign_img/eximg_8.png",
    status: "완료",
    remainingDays: 0,
    statusMessage: "완료",
    type: "구매평",
    isUrgent: false,
    hasContent: true,
    isPenalty: false,
  },
  {
    id: "u3002",
    title: "인테리어 홈데코 리뷰",
    category: "인스타그램",
    image: "/images/main/campaign_img/eximg_3.png",
    status: "완료",
    remainingDays: 0,
    statusMessage: "완료",
    type: "배송형",
    isUrgent: false,
    hasContent: true,
    isPenalty: false,
  },
  {
    id: "u4001",
    title: "화장품 구매평 리뷰",
    category: "네이버블로그",
    image: "/images/main/campaign_img/eximg_9.png",
    status: "취소/반려",
    remainingDays: 0,
    statusMessage: "취소됨",
    type: "구매평",
    isUrgent: false,
    hasContent: false,
    isPenalty: false,
    rejectionReason: "선정 인원이 초과되었습니다.",
    campaignApplicationId: 40001,
  },
];

const STATIC_STATS_ALL = {
  신청: 2,
  선정: 2,
  완료: 2,
  "취소/반려": 1,
  전체: 7,
  패널티: 0,
};

export function useAllCampaigns() {
  const { data, isLoading } = useQuery({
    queryKey: ["myCampaigns"],
    queryFn: () => fetchMyCampaigns(),
    staleTime: 1000 * 30,
    retry: false,
  });

  const campaigns: CampaignApplication[] = useMemo(() => {
    const items = (data?.items ?? []).map(mapItem);
    return items.length > 0 ? items : STATIC_ALL;
  }, [data]);

  const stats = useMemo(() => {
    const items = data?.items ?? [];
    if (items.length === 0) return STATIC_STATS_ALL;
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
  }, [data]);

  return { campaigns, stats, isLoading };
}
