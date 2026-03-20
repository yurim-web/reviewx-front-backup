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

const PARTNER_NAME_MAP: Record<number, string> = {
  1: "주식회사 청명종합광고기획",
  2: "청불 천막집 방이점",
  3: "명륜진사갈비 수원광교점",
  4: "(주) 레인보우8",
  5: "(주)플레티어",
  6: "꽃초롱",
  7: "주식회사 와이디컴퍼니그룹",
  8: "(주)아이엠에스커뮤니케이션",
  9: "주식회사 청명미디어",
  10: "(주)아이엠에스커뮤니케이션",
  11: "(주)아이엠에스커뮤니케이션",
  12: "(주)아이엠에스커뮤니케이션",
};

const STATUS_MAP: Record<string, CampaignStatus> = {
  SCHEDULED: "예정",
  REGISTERING: "예정",
  RECRUITING: "신청",
  IN_PROGRESS: "진행",
  SELECTING: "진행",
  PURCHASING: "진행",
  EMERGENCY: "긴급",
  REVIEW: "진행",
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
    partner_name: item.partnerName ?? PARTNER_NAME_MAP[item.partner_id ?? 0] ?? "",
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
