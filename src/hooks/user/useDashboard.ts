/* ========================================
   파트너 대시보드 React Query 훅
   ======================================== */

/**
 * usePartnerDashboard / useDashboard
 *
 * 목적: 파트너 대시보드 API 호출 + 백엔드 응답 → CampaignBox 호환 타입으로 변환
 *
 * 사용 페이지:
 * - /partner (파트너 대시보드 메인 홈페이지)
 *
 * API: 06번 GET /partner/dashboard
 */

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  getPartnerDashboard,
  searchPartnerCampaigns,
  getPartnerCampaignsByType,
} from "@/lib/api/dashboard";
import type { PartnerCampaignCard, PartnerTypeFilterParams } from "@/types/api/dashboard";

/* ========================================
   채널 / 유형 라벨 변환
   ======================================== */

const CHANNEL_LABEL: Record<string, string> = {
  NAVER_BLOG: "네이버 블로그",
  NAVER_CLIP: "클립",
  INSTAGRAM: "인스타그램",
  INSTAGRAM_REELS: "릴스",
  YOUTUBE: "유튜브",
  YOUTUBE_SHORTS: "유튜브 쇼츠",
};

const TYPE_LABEL: Record<string, string> = {
  DELIVERY: "배송형",
  VISIT: "방문형",
  PURCHASE: "구매평",
  PURCHASE_REVIEW: "구매평",
  REPORTER: "기자단",
  MISSION: "미션형",
};

/* ========================================
   어댑터 (PartnerCampaignCard → CampaignBox 호환)
   ======================================== */

export interface DashboardCampaign {
  id: string;
  title: string;
  category: string;
  channel: string;
  image: string;
  dayCount: string;
  isUrgent: boolean;
  recruitment: { current: number; total: number };
  schedule: string;
  detailedSchedule: {
    applicationStart: string;
    applicationEnd: string;
  };
}

function calcDayCount(recruitEndAt: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(recruitEndAt);
  end.setHours(0, 0, 0, 0);
  const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "마감";
  if (diff <= 1) return "마감임박";
  return `D-${diff}`;
}

function calcSchedule(recruitStartAt: string): string {
  if (!recruitStartAt) return "";
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(recruitStartAt);
    start.setHours(0, 0, 0, 0);
    if (today < start) {
      return `${format(new Date(recruitStartAt), "M/d (E)", { locale: ko })}\n모집 오픈`;
    }
  } catch (_e) {}
  return "";
}

function adaptItem(item: PartnerCampaignCard): DashboardCampaign {
  return {
    id: String(item.campaignId),
    title: item.title,
    category: TYPE_LABEL[item.type] ?? item.type,
    channel:
      CHANNEL_LABEL[item.requiredPlatform?.channelName] ?? item.requiredPlatform?.channelName ?? "",
    image: item.thumbnail?.url ?? "",
    dayCount: calcDayCount(item.recruit?.recruitEndAt ?? ""),
    isUrgent: item.status === "EMERGENCY",
    recruitment: {
      current: item.metrics?.appliedCount ?? 0,
      total: item.recruit?.recruitLimit ?? 0,
    },
    schedule: calcSchedule(item.recruit?.recruitStartAt ?? ""),
    detailedSchedule: {
      applicationStart: item.recruit?.recruitStartAt ?? "",
      applicationEnd: item.recruit?.recruitEndAt ?? "",
    },
  };
}

/* ========================================
   훅
   ======================================== */

/** 파트너 홈 대시보드 */
export function usePartnerDashboard() {
  return useQuery({
    queryKey: ["partner", "dashboard"],
    queryFn: () =>
      getPartnerDashboard().then((res) => {
        const isOpen = (c: DashboardCampaign) => c.dayCount !== "마감";
        return {
          banners: res.banners ?? [],
          highProbability: (res.sections?.highSelectionProbability ?? [])
            .map(adaptItem)
            .filter(isOpen)
            .slice(0, 8),
          popularNow: (res.sections?.popularNow ?? []).map(adaptItem).filter(isOpen).slice(0, 8),
          ongoing: (res.sections?.ongoing ?? []).map(adaptItem).filter(isOpen).slice(0, 32),
          similarCampaigns: (res.sections?.similarCampaigns ?? [])
            .map(adaptItem)
            .filter(isOpen)
            .slice(0, 8),
        };
      }),
    staleTime: 1000 * 60 * 5,
  });
}

/** 파트너 키워드 검색 */
export function usePartnerSearch(keyword: string) {
  return useQuery({
    queryKey: ["partner", "search", keyword],
    queryFn: () => searchPartnerCampaigns(keyword),
    enabled: keyword.trim().length > 0,
    staleTime: 1000 * 60 * 2,
  });
}

/** 파트너 유형별 필터 */
export function usePartnerCampaignsByType(params: PartnerTypeFilterParams) {
  return useQuery({
    queryKey: ["partner", "type", params],
    queryFn: () => getPartnerCampaignsByType(params),
    staleTime: 1000 * 60 * 3,
  });
}

// ── 하위 호환 별칭 ──
/** @deprecated usePartnerDashboard 사용 */
export const useDashboard = usePartnerDashboard;
