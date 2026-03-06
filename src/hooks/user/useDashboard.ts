/* ========================================
   대시보드 React Query 훅
   ======================================== */

/**
 * useDashboard
 *
 * 목적: 대시보드 API 호출 + 백엔드 응답 → CampaignBox 호환 타입으로 변환
 *
 * 사용 페이지:
 * - /user (대시보드 메인 홈페이지)
 *
 * API: 20번 GET /reviewer/dashboard
 */

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { fetchDashboard } from "@/lib/api/dashboard";
import type { DashboardApiItem } from "@/types/api/dashboard";

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
   어댑터 (DashboardApiItem → CampaignBox 호환)
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
  if (diff <= 3) return "마감임박";
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

function adaptItem(item: DashboardApiItem): DashboardCampaign {
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

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () =>
      fetchDashboard().then((res) => ({
        highProbability: (res.sections?.highSelectionProbability ?? []).map(adaptItem),
        popularNow: (res.sections?.popularNow ?? []).map(adaptItem),
        ongoing: (res.sections?.ongoing ?? []).map(adaptItem),
        similar: (res.sections?.similar ?? []).map(adaptItem),
      })),
  });
}
