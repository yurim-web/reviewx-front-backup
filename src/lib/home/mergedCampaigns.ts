/* ========================================
   홈 캠페인 데이터: 정적 데이터 기반
   ======================================== */

/**
 * mergedCampaigns
 *
 * 목적: 정적 캠페인 데이터를 홈 화면에 제공 (서버 API 폴백용)
 *
 * 사용 페이지:
 * - / (홈)
 */

import { enrichStaticCampaigns } from "@/utils/home/enrichCampaigns";
import {
  deliveryCampaigns,
  type DeliveryCampaignData,
} from "@/data/campaign/delivery/deliveryCampaigns";
import { visitCampaigns, type VisitCampaignData } from "@/data/campaign/visit/visitCampaigns";
import { reviewCampaigns, type ReviewCampaignData } from "@/data/campaign/review/reviewCampaigns";
import {
  missionCampaigns,
  type MissionCampaignData,
} from "@/data/campaign/mission/missionCampaigns";
import {
  reporterCampaigns,
  type ReporterCampaignData,
} from "@/data/campaign/reporter/reporterCampaigns";

export type MergedCampaigns = {
  allDelivery: DeliveryCampaignData[];
  allVisit: VisitCampaignData[];
  allReview: ReviewCampaignData[];
  allMission: MissionCampaignData[];
  allReporter: ReporterCampaignData[];
};

/**
 * 서버/클라이언트 동일 결과용 정적 캠페인만 반환 (hydration 방지).
 */
export function getStaticCampaigns(): MergedCampaigns {
  return {
    allDelivery: enrichStaticCampaigns([...deliveryCampaigns]),
    allVisit: enrichStaticCampaigns([...visitCampaigns]),
    allReview: enrichStaticCampaigns([...reviewCampaigns]),
    allMission: enrichStaticCampaigns([...missionCampaigns]),
    allReporter: enrichStaticCampaigns([...reporterCampaigns]),
  };
}
