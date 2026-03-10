/* ========================================
   캠페인 목록 React Query 훅
   ======================================== */

/**
 * useCampaignList
 *
 * 목적: 캠페인 목록 API 호출 + 백엔드 응답 → useCampaignFilters 호환 타입으로 변환
 *       API가 비어있거나 실패하면 → 정적 mock 데이터로 자동 fallback
 *
 * 사용 페이지:
 * - /campaign/delivery, /campaign/visit, /campaign/review
 * - /campaign/reporter, /campaign/mission
 */

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  fetchDeliveryCampaigns,
  fetchVisitCampaigns,
  fetchReviewCampaigns,
  fetchReporterCampaigns,
  fetchMissionCampaigns,
} from "@/lib/api/campaign";
import type { CampaignListApiItem } from "@/types/api/campaign";

// 정적 fallback 데이터
import { deliveryCampaigns } from "@/data/campaign/delivery/deliveryCampaigns";
import { visitCampaigns } from "@/data/campaign/visit/visitCampaigns";
import { reviewCampaigns } from "@/data/campaign/review/reviewCampaigns";
import { reporterCampaigns } from "@/data/campaign/reporter/reporterCampaigns";
import { missionCampaigns } from "@/data/campaign/mission/missionCampaigns";

/* ========================================
   채널명 변환 (백엔드 ENUM → 화면 필터 옵션)
   ======================================== */

const CHANNEL_LABEL: Record<string, string> = {
  NAVER_BLOG: "네이버 블로그",
  NAVER_CLIP: "클립",
  INSTAGRAM: "인스타그램",
  INSTAGRAM_REELS: "릴스",
  YOUTUBE: "유튜브",
  YOUTUBE_SHORTS: "유튜브 쇼츠",
};

/* ========================================
   캠페인 유형 라벨 (백엔드 ENUM → 화면 표시)
   ======================================== */

const TYPE_LABEL: Record<string, string> = {
  DELIVERY: "배송형",
  VISIT: "방문형",
  PURCHASE: "구매평",
  PURCHASE_REVIEW: "구매평",
  REPORTER: "기자단",
  MISSION: "미션형",
};

/* ========================================
   어댑터 타입 (useCampaignFilters + CampaignListPage 호환)
   ======================================== */

export interface CampaignListAdapted {
  id: string;
  title: string;
  category: string; // 표시용 유형명 ("배송형", "방문형" 등)
  subcategory: string; // 카테고리 필터 기준 ("식품", "뷰티" 등)
  channel: string; // 채널 필터 기준 ("인스타그램", "네이버 블로그" 등)
  image: string;
  recruitment: { current: number; total: number };
  dayCount: string;
  schedule: string;
  detailedSchedule?: { applicationStart: string; applicationEnd: string };
  region?: string;
  isUrgent: boolean;
  registeredAt: string;
}

/* ========================================
   어댑터 유틸 함수
   ======================================== */

/** 모집 마감일로부터 남은 일수 텍스트 계산 */
function calcDayCount(recruitEndAt: string): string {
  if (!recruitEndAt) return "";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(recruitEndAt);
  if (isNaN(end.getTime())) return "";
  end.setHours(0, 0, 0, 0);
  const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "마감";
  if (diff <= 1) return "마감임박";
  return `${diff}일 전`;
}

/** 모집 시작일이 미래이면 "오픈 예정" schedule 텍스트 반환 */
function calcSchedule(recruitStartAt: string): string {
  if (!recruitStartAt) return "";
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(recruitStartAt);
    if (isNaN(start.getTime())) return "";
    start.setHours(0, 0, 0, 0);
    if (today < start) {
      return `${format(new Date(recruitStartAt), "M/d (E)", { locale: ko })}\n모집 오픈`;
    }
  } catch (_e) {}
  return "";
}

/** 백엔드 API 응답 → CampaignListAdapted */
function adaptApiCampaign(item: CampaignListApiItem): CampaignListAdapted {
  return {
    id: String(item.campaignId),
    title: item.title,
    category: TYPE_LABEL[item.type] ?? item.type,
    subcategory: item.category?.categoryName ?? "기타",
    channel:
      CHANNEL_LABEL[item.requiredPlatform?.channelName] ?? item.requiredPlatform?.channelName ?? "",
    image: item.thumbnailUrl,
    recruitment: {
      current: item.appliedCount,
      total: item.recruitLimit,
    },
    dayCount: calcDayCount(item.recruitEndAt),
    schedule: calcSchedule(item.recruitStartAt),
    detailedSchedule: {
      applicationStart: item.recruitStartAt ?? "",
      applicationEnd: item.recruitEndAt ?? "",
    },
    region: item.region,
    isUrgent: item.isEmergency === true,
    registeredAt: item.recruitStartAt,
  };
}

/** 정적 mock 데이터 → CampaignListAdapted (fallback용) */
function adaptStaticCampaign(item: {
  id: string;
  title: string;
  category: string;
  image: string;
  subcategory?: string;
  channel?: string;
  recruitment: { current: number; total: number };
  dayCount?: string;
  schedule?: string;
  region?: string;
  isUrgent?: boolean;
  registeredAt?: string;
  detailedSchedule?: { applicationStart?: string; applicationEnd?: string };
}): CampaignListAdapted {
  const appStart = item.detailedSchedule?.applicationStart ?? "";
  const appEnd = item.detailedSchedule?.applicationEnd ?? "";
  return {
    id: String(item.id),
    title: item.title,
    category: item.category,
    subcategory: item.subcategory ?? "기타",
    channel: item.channel ?? "",
    image: item.image,
    recruitment: item.recruitment,
    // 날짜에서 직접 계산 (정적 데이터의 hardcoded dayCount 무시)
    dayCount: appEnd ? calcDayCount(appEnd) : "",
    schedule: item.schedule || (appStart ? calcSchedule(appStart) : ""),
    detailedSchedule:
      appStart || appEnd ? { applicationStart: appStart, applicationEnd: appEnd } : undefined,
    region: item.region,
    isUrgent: item.isUrgent ?? false,
    registeredAt: item.registeredAt ?? appStart,
  };
}

/* ========================================
   훅 (캠페인 유형별 5개)
   API 응답이 있으면 우선 사용, 없으면 정적 데이터 fallback
   ======================================== */

export function useDeliveryCampaignList() {
  return useQuery({
    queryKey: ["campaigns", "delivery"],
    queryFn: async () => {
      try {
        const list = await fetchDeliveryCampaigns();
        if (list.length > 0) return list.map(adaptApiCampaign);
      } catch (_e) {}
      return deliveryCampaigns.map(adaptStaticCampaign);
    },
    placeholderData: () => deliveryCampaigns.map(adaptStaticCampaign),
    staleTime: 30 * 1000,
  });
}

export function useVisitCampaignList() {
  return useQuery({
    queryKey: ["campaigns", "visit"],
    queryFn: async () => {
      try {
        const list = await fetchVisitCampaigns();
        if (list.length > 0) return list.map(adaptApiCampaign);
      } catch (_e) {}
      return visitCampaigns.map(adaptStaticCampaign);
    },
    placeholderData: () => visitCampaigns.map(adaptStaticCampaign),
    staleTime: 30 * 1000,
  });
}

export function useReviewCampaignList() {
  return useQuery({
    queryKey: ["campaigns", "purchase-review"],
    queryFn: async () => {
      try {
        const list = await fetchReviewCampaigns();
        if (list.length > 0) return list.map(adaptApiCampaign);
      } catch (_e) {}
      return reviewCampaigns.map(adaptStaticCampaign);
    },
    placeholderData: () => reviewCampaigns.map(adaptStaticCampaign),
    staleTime: 30 * 1000,
  });
}

export function useReporterCampaignList() {
  return useQuery({
    queryKey: ["campaigns", "reporter"],
    queryFn: async () => {
      try {
        const list = await fetchReporterCampaigns();
        if (list.length > 0) return list.map(adaptApiCampaign);
      } catch (_e) {}
      return reporterCampaigns.map(adaptStaticCampaign);
    },
    placeholderData: () => reporterCampaigns.map(adaptStaticCampaign),
    staleTime: 30 * 1000,
  });
}

export function useMissionCampaignList() {
  return useQuery({
    queryKey: ["campaigns", "mission"],
    queryFn: async () => {
      try {
        const list = await fetchMissionCampaigns();
        if (list.length > 0) return list.map(adaptApiCampaign);
      } catch (_e) {}
      return missionCampaigns.map(adaptStaticCampaign);
    },
    placeholderData: () => missionCampaigns.map(adaptStaticCampaign),
    staleTime: 30 * 1000,
  });
}
