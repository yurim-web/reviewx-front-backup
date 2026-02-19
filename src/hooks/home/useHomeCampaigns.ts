/* ========================================
   홈 페이지 섹션별 캠페인 데이터 훅
   ======================================== */

import { useMemo, useState, useEffect } from "react";
import { isNotClosed, shuffle_array } from "@/utils/home/campaignUtils";
import {
  getStaticCampaigns,
  getAllMergedCampaigns,
  type MergedCampaigns,
} from "@/lib/home/mergedCampaigns";
import type { DeliveryCampaignData } from "@/data/campaign/delivery/deliveryCampaigns";
import type { VisitCampaignData } from "@/data/campaign/visit/visitCampaigns";
import type { ReviewCampaignData } from "@/data/campaign/review/reviewCampaigns";
import type { MissionCampaignData } from "@/data/campaign/mission/missionCampaigns";
import type { ReporterCampaignData } from "@/data/campaign/reporter/reporterCampaigns";

export type HomeCampaign =
  | DeliveryCampaignData
  | VisitCampaignData
  | ReviewCampaignData
  | MissionCampaignData
  | ReporterCampaignData;

const SHUFFLE_SEED = 12345;
const HIGH_PROBABILITY_MAX = 8;
const POPULAR_MAX = 8;
const ONGOING_MAX = 32;
const SIMILAR_MAX = 8;

function getAllCampaignsList(merged: MergedCampaigns): HomeCampaign[] {
  return [
    ...merged.allDelivery,
    ...merged.allReview,
    ...merged.allVisit,
    ...merged.allMission,
    ...merged.allReporter,
  ];
}

export function useHomeCampaigns() {
  const [mergedCampaigns, setMergedCampaigns] = useState<MergedCampaigns>(
    getStaticCampaigns
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    setMergedCampaigns(getAllMergedCampaigns());
  }, []);

  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const high_probability_campaigns = useMemo(() => {
    const all = getAllCampaignsList(mergedCampaigns);
    const not_closed = all.filter((c) => isNotClosed(c, today));
    const low_applicant = not_closed.filter((c) => c.recruitment.current <= 100);
    const sorted = [...low_applicant].sort(
      (a, b) => a.recruitment.current - b.recruitment.current
    );
    const very_low = sorted.filter((c) => c.recruitment.current <= 5);
    const other = sorted.filter((c) => c.recruitment.current > 5);
    let selected = very_low.slice(0, HIGH_PROBABILITY_MAX);
    if (selected.length < HIGH_PROBABILITY_MAX) {
      const selectedIds = new Set(selected.map((c) => c.id));
      for (const c of other) {
        if (selected.length >= HIGH_PROBABILITY_MAX) break;
        if (!selectedIds.has(c.id)) {
          selected.push(c);
          selectedIds.add(c.id);
        }
      }
    }
    return shuffle_array(selected, SHUFFLE_SEED).slice(0, HIGH_PROBABILITY_MAX);
  }, [today, mergedCampaigns]);

  const popular_campaigns = useMemo(() => {
    const all = getAllCampaignsList(mergedCampaigns);
    const not_closed = all.filter((c) => isNotClosed(c, today));
    const high_participation = not_closed.filter((c) => {
      const rate =
        c.recruitment.total > 0
          ? c.recruitment.current / c.recruitment.total
          : 0;
      return rate >= 0.5;
    });
    const shuffled = shuffle_array(high_participation, SHUFFLE_SEED);
    const by_type: Record<string, HomeCampaign[]> = {
      배송형: [],
      구매평: [],
      방문형: [],
      미션형: [],
      기자단: [],
    };
    for (const c of shuffled) {
      const category = c.category as keyof typeof by_type;
      if (category in by_type && by_type[category].length < 2) {
        by_type[category].push(c);
      }
    }
    const selected = [
      ...by_type.배송형,
      ...by_type.구매평,
      ...by_type.방문형,
      ...by_type.미션형.slice(0, 1),
      ...by_type.기자단.slice(0, 1),
    ];
    return selected.slice(0, POPULAR_MAX);
  }, [today, mergedCampaigns]);

  const ongoing_campaigns = useMemo(() => {
    const all = getAllCampaignsList(mergedCampaigns);
    const active = all.filter((c) => isNotClosed(c, today));
    return shuffle_array(active, SHUFFLE_SEED).slice(0, ONGOING_MAX);
  }, [today, mergedCampaigns]);

  /**
   * 참여한 캠페인과 비슷한 캠페인 (추후 API/추천 로직으로 교체 예정)
   * 현재는 마감되지 않은 캠페인 중 랜덤 8개 노출.
   */
  const similar_campaigns = useMemo(() => {
    const all = getAllCampaignsList(mergedCampaigns);
    const active = all.filter((c) => isNotClosed(c, today));
    return shuffle_array(active, SHUFFLE_SEED + 1).slice(0, SIMILAR_MAX);
  }, [today, mergedCampaigns]);

  return {
    high_probability_campaigns,
    popular_campaigns,
    ongoing_campaigns,
    similar_campaigns,
  };
}
