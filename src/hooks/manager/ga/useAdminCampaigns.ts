/* ========================================
   관리자 캠페인 현황 훅
   ======================================== */

/**
 * useAdminCampaigns
 *
 * 목적: 관리자 캠페인 현황을 mock API에서 로드하고
 *       CampaignProgressItem 타입으로 변환하여 반환합니다.
 *
 * 사용 페이지:
 * - /manager_ga/campaign/progress
 * - /manager_sa/campaign/progress
 */

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminCampaigns } from "@/lib/api/admin";
import { campaign_list } from "@/data/manager_ga/progress";
import type { AdminCampaignApiItem } from "@/types/api/admin";
import type {
  CampaignProgressItem,
  CampaignStatus,
  CampaignType,
} from "@/data/manager_ga/progress";
import type { Channel } from "@/data/manager/common/filterOptions";

const STATUS_MAP: Record<string, CampaignStatus> = {
  SCHEDULED: "예정",
  RECRUITING: "신청",
  IN_PROGRESS: "진행",
  REVIEW: "진행",
  REGISTERING: "진행",
  COMPLETED: "종료",
  CLOSED: "종료",
  CANCELLED: "취소",
};

const TYPE_MAP: Record<string, CampaignType> = {
  DELIVERY: "배송형",
  VISIT: "방문형",
  PURCHASE: "구매평",
  PURCHASE_REVIEW: "구매평",
  REPORTER: "기자단",
  MISSION: "미션형",
};

const CHANNEL_MAP: Record<string, Channel> = {
  INSTAGRAM: "Instagram",
  NAVER_BLOG: "Blog",
  NAVER_CLIP: "Clip",
  YOUTUBE: "Youtube",
  COUPANG: "Review",
  MISSION: "Mission",
};

function adaptCampaign(
  item: AdminCampaignApiItem & {
    partnerName?: string;
    points?: number;
    recruit?: { recruitLimit?: number };
    metrics?: { appliedCount?: number };
  }
): CampaignProgressItem {
  return {
    id: String(item.id),
    campaign_number: String(item.id).padStart(6, "0"),
    partner_name: item.partnerName ?? "",
    campaign_name: item.title,
    type: (TYPE_MAP[item.type] ?? "배송형") as CampaignType,
    channel: (CHANNEL_MAP[item.requiredPlatform?.channelName] ?? "Instagram") as Channel,
    status: (STATUS_MAP[item.status] ?? "진행") as CampaignStatus,
    recruit_count: item.recruitLimit ?? item.recruit?.recruitLimit ?? 0,
    apply_count: item.appliedCount ?? item.metrics?.appliedCount ?? 0,
    point: item.reward?.extraRewardPoint ?? item.points ?? 0,
    detail_campaign_id: String(item.id),
    created_at: item.recruitStartAt
      ? new Date(item.recruitStartAt)
      : item.recruit?.recruitStartAt
        ? new Date(item.recruit.recruitStartAt)
        : undefined,
  };
}

export function useAdminCampaigns() {
  const { data: apiData, isLoading } = useQuery({
    queryKey: ["adminCampaigns"],
    queryFn: fetchAdminCampaigns,
    staleTime: 30_000,
  });

  const campaigns = useMemo<CampaignProgressItem[]>(() => {
    if (apiData != null && apiData.length > 0) {
      return apiData.map(adaptCampaign);
    }
    return campaign_list;
  }, [apiData]);

  return { campaigns, isLoading };
}
