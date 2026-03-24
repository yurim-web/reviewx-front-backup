/* ========================================
   관리자 캠페인 현황 훅
   ======================================== */

/**
 * useAdminCampaigns
 *
 * 목적: 관리자 캠페인 현황을 실제 백엔드 API에서 로드하고
 *       CampaignProgressItem 타입으로 변환하여 반환합니다.
 *
 * 사용 페이지:
 * - /manager_ga/campaign/progress
 * - /manager_sa/campaign/progress
 *
 * 백엔드 API:
 * - GET /api/admin/campaigns          → 캠페인 목록
 * - GET /api/admin/campaigns/summary  → 통계 요약 (6종 카드)
 * - POST /api/admin/campaigns/{id}/report → 캠페인 신고
 */

import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAdminCampaigns,
  fetchAdminCampaignsSummary,
  reportAdminCampaign,
} from "@/lib/api/admin";
import type {
  AdminCampaignListItem,
  AdminCampaignListParams,
  ReportCampaignRequest,
} from "@/types/api/admin";
import type {
  CampaignProgressItem,
  CampaignStatus,
  CampaignType,
} from "@/data/manager_ga/progress";
import type { Channel } from "@/data/manager/common/filterOptions";

// ── 백엔드 → 프론트 매핑 ──

const STATUS_MAP: Record<string, CampaignStatus> = {
  REGISTERING: "예정",
  RECRUITING: "신청",
  SELECTING: "진행",
  PURCHASING: "진행",
  EMERGENCY: "긴급",
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

/** 백엔드 type → 상세 페이지 slug */
const TYPE_SLUG_MAP: Record<string, string> = {
  DELIVERY: "delivery",
  VISIT: "visit",
  PURCHASE: "review",
  PURCHASE_REVIEW: "review",
  REPORTER: "reporter",
  MISSION: "mission",
};

/** platformIconUrl에서 채널 추론 (아이콘 URL 기반) */
function inferChannel(platformIconUrl: string, type: string): Channel {
  // 구매평·미션형은 채널 무관하게 타입 고정 아이콘 사용
  if (type === "PURCHASE" || type === "PURCHASE_REVIEW") return "Review";
  if (type === "MISSION") return "Mission";

  const url = (platformIconUrl ?? "").toLowerCase();
  if (url.includes("blog")) return "Blog";
  if (url.includes("clip")) return "Clip";
  if (url.includes("instagram")) return "Instagram";
  if (url.includes("reels")) return "Reels";
  if (url.includes("youtube")) return "Youtube";
  if (url.includes("shorts")) return "Shorts";
  if (url.includes("store") || url.includes("coupang")) return "Store";
  if (url.includes("review")) return "Review";
  return "Blog";
}

/** 백엔드 AdminCampaignListItem → 프론트 CampaignProgressItem */
function adaptCampaign(item: AdminCampaignListItem): CampaignProgressItem {
  return {
    id: String(item.campaignId),
    campaign_number: item.campaignNumber,
    partner_name: item.partnerName,
    campaign_name: item.title,
    type: (TYPE_MAP[item.type] ?? "배송형") as CampaignType,
    channel: inferChannel(item.platformIconUrl, item.type),
    status: (STATUS_MAP[item.status] ?? "진행") as CampaignStatus,
    recruit_count: item.recruitLimit,
    apply_count: item.appliedCount,
    point: item.rewardPoint,
    detail_campaign_id: String(item.campaignId),
    created_at: item.recruitStartAt ? new Date(item.recruitStartAt) : undefined,
  };
}

// ── 통계 요약 타입 ──

export interface CampaignSummaryStats {
  total: number;
  scheduled: number;
  recruiting: number;
  inProgress: number;
  completed: number;
  cancelled: number;
}

// ── 메인 훅 ──

export function useAdminCampaigns(params?: AdminCampaignListParams) {
  const queryClient = useQueryClient();

  // 캠페인 목록 조회
  const {
    data: apiData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["adminCampaigns", params],
    queryFn: () => fetchAdminCampaigns(params),
    staleTime: 30_000,
  });

  // 통계 요약 조회 (향후 서버사이드 필터링 시 활용)
  const { data: summaryData } = useQuery({
    queryKey: ["adminCampaignsSummary", params?.startDate, params?.endDate],
    queryFn: () =>
      fetchAdminCampaignsSummary({
        startDate: params?.startDate,
        endDate: params?.endDate,
      }),
    staleTime: 30_000,
  });

  // 신고 mutation
  const reportMutation = useMutation({
    mutationFn: ({ campaignId, body }: { campaignId: number; body: ReportCampaignRequest }) =>
      reportAdminCampaign(campaignId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCampaigns"] });
      queryClient.invalidateQueries({ queryKey: ["adminCampaignsSummary"] });
    },
  });

  // 백엔드 응답 → CampaignProgressItem 변환
  const campaigns = useMemo<CampaignProgressItem[]>(() => {
    if (apiData != null && apiData.length > 0) {
      return apiData.map(adaptCampaign);
    }
    return [];
  }, [apiData]);

  // 통계 요약
  const summary = useMemo<CampaignSummaryStats>(() => {
    return (
      summaryData ?? {
        total: 0,
        scheduled: 0,
        recruiting: 0,
        inProgress: 0,
        completed: 0,
        cancelled: 0,
      }
    );
  }, [summaryData]);

  return {
    campaigns,
    summary,
    isLoading,
    isError,
    reportCampaign: reportMutation.mutateAsync,
    isReporting: reportMutation.isPending,
  };
}

export { TYPE_SLUG_MAP };
