/* ========================================
   홈 페이지 섹션별 캠페인 데이터 훅
   ======================================== */

/**
 * useHomeCampaigns
 *
 * 목적: 대시보드 API(20번)에서 홈페이지 섹션별 캠페인 데이터 조회
 *       API가 비어있거나 실패하면 → 정적 mock 데이터 기반 계산으로 fallback
 *
 * 사용 페이지:
 * - /user (메인 홈페이지)
 */

import { useMemo } from "react";
import { useDashboard } from "@/hooks/user/useDashboard";
import type { DashboardCampaign } from "@/hooks/user/useDashboard";
import { shuffle_array } from "@/utils/home/campaignUtils";
import { getStaticCampaigns } from "@/lib/home/mergedCampaigns";

export type HomeCampaign = DashboardCampaign;

const SHUFFLE_SEED = 12345;
const HIGH_PROBABILITY_MAX = 8;
const POPULAR_MAX = 8;
const ONGOING_MAX = 32;
const SIMILAR_MAX = 8;

/** 정적 데이터를 HomeCampaign(=DashboardCampaign) 형식으로 변환 */
function adaptStatic(item: {
  id: string;
  title: string;
  category: string;
  channel?: string;
  image: string;
  dayCount?: string;
  isUrgent?: boolean;
  recruitment: { current: number; total: number };
  schedule?: string;
  detailedSchedule?: { applicationStart?: string; applicationEnd?: string };
}): HomeCampaign {
  return {
    id: String(item.id),
    title: item.title,
    category: item.category,
    channel: item.channel ?? "",
    image: item.image,
    dayCount: item.dayCount ?? "",
    isUrgent: item.isUrgent ?? false,
    recruitment: item.recruitment,
    schedule: item.schedule ?? "",
    detailedSchedule: {
      applicationStart: item.detailedSchedule?.applicationStart ?? "",
      applicationEnd: item.detailedSchedule?.applicationEnd ?? "",
    },
  };
}

export function useHomeCampaigns() {
  const { data: apiData, isError, isLoading } = useDashboard();

  // API 데이터가 있으면 즉시 반환
  const hasApiData =
    apiData &&
    (apiData.highProbability.length > 0 ||
      apiData.popularNow.length > 0 ||
      apiData.ongoing.length > 0);

  // 정적 데이터 기반 fallback 계산 (API 없을 때만 사용)
  const staticResult = useMemo(() => {
    if (hasApiData) return null;

    const merged = getStaticCampaigns();
    const all = [
      ...merged.allDelivery,
      ...merged.allReview,
      ...merged.allVisit,
      ...merged.allMission,
      ...merged.allReporter,
    ];

    // 마감된 캠페인만 제외 (오픈 예정 포함해서 표시)
    const notClosed = all.filter((c) => (c.dayCount ?? "") !== "마감");

    const high_probability_campaigns = (() => {
      const lowApplicant = notClosed.filter((c) => c.recruitment.current <= 100);
      const sorted = [...lowApplicant].sort(
        (a, b) => a.recruitment.current - b.recruitment.current
      );
      const veryLow = sorted.filter((c) => c.recruitment.current <= 5);
      const other = sorted.filter((c) => c.recruitment.current > 5);
      const selected = veryLow.slice(0, HIGH_PROBABILITY_MAX);
      if (selected.length < HIGH_PROBABILITY_MAX) {
        const ids = new Set(selected.map((c) => c.id));
        for (const c of other) {
          if (selected.length >= HIGH_PROBABILITY_MAX) break;
          if (!ids.has(c.id)) {
            selected.push(c);
            ids.add(c.id);
          }
        }
      }
      return shuffle_array(selected, SHUFFLE_SEED).slice(0, HIGH_PROBABILITY_MAX).map(adaptStatic);
    })();

    const popular_campaigns = (() => {
      const highParticipation = notClosed.filter((c) => {
        const rate = c.recruitment.total > 0 ? c.recruitment.current / c.recruitment.total : 0;
        return rate >= 0.5;
      });
      const shuffled = shuffle_array(highParticipation, SHUFFLE_SEED);
      const by_type: Record<string, typeof shuffled> = {
        배송형: [],
        구매평: [],
        방문형: [],
        미션형: [],
        기자단: [],
      };
      for (const c of shuffled) {
        const cat = c.category as keyof typeof by_type;
        if (cat in by_type && by_type[cat].length < 2) by_type[cat].push(c);
      }
      return [
        ...by_type.배송형,
        ...by_type.구매평,
        ...by_type.방문형,
        ...by_type.미션형.slice(0, 1),
        ...by_type.기자단.slice(0, 1),
      ]
        .slice(0, POPULAR_MAX)
        .map(adaptStatic);
    })();

    const ongoing_campaigns = shuffle_array(notClosed, SHUFFLE_SEED)
      .slice(0, ONGOING_MAX)
      .map(adaptStatic);

    const similar_campaigns = shuffle_array(notClosed, SHUFFLE_SEED + 1)
      .slice(0, SIMILAR_MAX)
      .map(adaptStatic);

    return { high_probability_campaigns, popular_campaigns, ongoing_campaigns, similar_campaigns };
  }, [hasApiData]);

  if (hasApiData && apiData) {
    return {
      high_probability_campaigns: apiData.highProbability,
      popular_campaigns: apiData.popularNow,
      ongoing_campaigns: apiData.ongoing,
      similar_campaigns: apiData.similar ?? [],
      isError: false,
    };
  }

  return {
    ...(staticResult ?? {
      high_probability_campaigns: [] as HomeCampaign[],
      popular_campaigns: [] as HomeCampaign[],
      ongoing_campaigns: [] as HomeCampaign[],
      similar_campaigns: [] as HomeCampaign[],
    }),
    isError,
  };
}
