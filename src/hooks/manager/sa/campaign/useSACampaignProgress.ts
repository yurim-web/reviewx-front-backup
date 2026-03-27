/* ========================================
   SA 관리자 캠페인 진행현황 훅
   ======================================== */

/**
 * useSACampaignProgress
 *
 * 목적: SA 관리자 캠페인 진행현황을 SA 전용 백엔드 API에서 로드하고
 *       CampaignProgressItem 타입으로 변환하여 반환합니다.
 *
 * 사용 페이지:
 * - /manager_sa/campaign/progress
 *
 * 백엔드 API (SA-02):
 * - GET /api/admin-sa/campaign/progress/stats → 통계 카드
 * - GET /api/admin-sa/campaign/progress       → 캠페인 목록
 * - POST /api/admin-sa/campaigns/{id}/report  → 캠페인 신고
 */

import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSACampaignStats, fetchSACampaignList, reportSACampaign } from "@/lib/api/admin";
import type {
  SACampaignProgressParams,
  SACampaignItem,
  ReportCampaignRequest,
} from "@/types/api/admin";
import type {
  CampaignProgressItem,
  CampaignStatus,
  CampaignType,
} from "@/data/manager_ga/progress";
import type { Channel } from "@/data/manager/common/filterOptions";
import type { CampaignSummaryStats } from "@/hooks/manager/ga/useAdminCampaigns";

// ── 백엔드 → 프론트 매핑 ──

const STATUS_MAP: Record<string, CampaignStatus> = {
  OPEN_SCHEDULED: "예정",
  APPLYING: "신청",
  IN_PROGRESS: "진행",
  ENDED: "종료",
  CANCELLED: "취소",
  URGENT: "긴급",
};

const TYPE_MAP: Record<string, CampaignType> = {
  DELIVERY: "배송형",
  VISIT: "방문형",
  REVIEW: "구매평",
  REPORTER: "기자단",
  MISSION: "미션형",
};

const CHANNEL_MAP: Record<string, Channel> = {
  BLOG: "Blog",
  INSTAGRAM: "Instagram",
  CLIP: "Clip",
  YOUTUBE: "Youtube",
  REELS: "Reels",
  SHORTS: "Shorts",
  MISSION: "Mission",
  REVIEW: "Review",
};

/** 백엔드 type → 상세 페이지 slug */
export const SA_TYPE_SLUG_MAP: Record<string, string> = {
  DELIVERY: "delivery",
  VISIT: "visit",
  REVIEW: "review",
  REPORTER: "reporter",
  MISSION: "mission",
};

/** 백엔드 SACampaignItem → 프론트 CampaignProgressItem */
function adaptSACampaign(item: SACampaignItem): CampaignProgressItem {
  return {
    id: item.campaignNumber,
    campaign_number: item.campaignNumber,
    partner_name: item.partnerName,
    campaign_name: item.campaignName,
    type: (TYPE_MAP[item.type] ?? "배송형") as CampaignType,
    channel: (CHANNEL_MAP[item.channel] ?? "Blog") as Channel,
    status: (STATUS_MAP[item.status] ?? "진행") as CampaignStatus,
    recruit_count: item.recruitCount,
    apply_count: item.applyCount,
    point: item.point,
    detail_campaign_id: item.campaignId
      ? String(item.campaignId)
      : String(parseInt(item.campaignNumber, 10)),
  };
}

// ── 메인 훅 ──

export function useSACampaignProgress(params?: SACampaignProgressParams) {
  const queryClient = useQueryClient();

  // 캠페인 목록 조회
  const {
    data: listData,
    isLoading: isListLoading,
    isError: isListError,
  } = useQuery({
    queryKey: ["saCampaignProgress", params],
    queryFn: () => fetchSACampaignList(params),
    staleTime: 30_000,
  });

  // 통계 카드 조회
  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ["saCampaignProgressStats", params?.startDate, params?.endDate],
    queryFn: () =>
      fetchSACampaignStats({
        startDate: params?.startDate,
        endDate: params?.endDate,
      }),
    staleTime: 30_000,
  });

  // 신고 mutation
  const reportMutation = useMutation({
    mutationFn: ({ campaignId, body }: { campaignId: number; body: ReportCampaignRequest }) =>
      reportSACampaign(campaignId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saCampaignProgress"] });
      queryClient.invalidateQueries({ queryKey: ["saCampaignProgressStats"] });
    },
  });

  // 백엔드 응답 → CampaignProgressItem 변환
  const campaigns = useMemo<CampaignProgressItem[]>(() => {
    if (listData != null && listData.length > 0) {
      return listData.map(adaptSACampaign);
    }
    return [];
  }, [listData]);

  // 통계 요약 (SA stats → GA summary 형태로 매핑)
  const summary = useMemo<CampaignSummaryStats>(() => {
    if (!statsData) {
      return {
        total: 0,
        scheduled: 0,
        recruiting: 0,
        inProgress: 0,
        completed: 0,
        cancelled: 0,
      };
    }
    return {
      total: statsData.total,
      scheduled: statsData.openScheduled,
      recruiting: statsData.applying,
      inProgress: statsData.inProgress,
      completed: statsData.ended,
      cancelled: statsData.cancelled,
    };
  }, [statsData]);

  const reportCampaign = (campaignId: number, body: ReportCampaignRequest): Promise<void> =>
    reportMutation.mutateAsync({ campaignId, body });

  return {
    campaigns,
    summary,
    isLoading: isListLoading || isStatsLoading,
    isError: isListError,
    reportCampaign,
    isReporting: reportMutation.isPending,
  };
}
