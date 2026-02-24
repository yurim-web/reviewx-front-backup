/* ========================================
   캠페인 타입 공통 유틸리티
   ======================================== */

/**
 * campaignTypeUtils.ts
 *
 * 목적: 캠페인 타입 변환, 채널명 정규화, 정적 캠페인 데이터 조회 등 공통 유틸 함수 제공
 *
 * 사용 페이지:
 * - /user/campaign_management/applied (신청 탭)
 * - /user/campaign_management/selected (선정 탭)
 */

import { deliveryCampaigns } from "@/data/campaign/delivery/deliveryCampaigns";
import { visitCampaigns } from "@/data/campaign/visit/visitCampaigns";
import { reviewCampaigns } from "@/data/campaign/review/reviewCampaigns";
import { reporterCampaigns } from "@/data/campaign/reporter/reporterCampaigns";
import { missionCampaigns } from "@/data/campaign/mission/missionCampaigns";
import type { CampaignApplication } from "@/types/domain/user";

/** localStorage에 저장된 캠페인 신청 항목 타입 */
export interface StoredCampaignEntry {
  campaignId: string;
  campaignType: CampaignTypeEn;
  status: "대기" | "선정" | "완료" | "취소" | "반려";
  channel?: string;
  campaignTitle?: string;
  campaignImage?: string;
}

/** localStorage에 저장된 유저별 신청 목록 타입 */
export interface UserAppliedCampaigns {
  userId: string;
  campaigns: StoredCampaignEntry[];
}

/** 영문 캠페인 타입 */
export type CampaignTypeEn = "delivery" | "visit" | "review" | "reporter" | "mission";

/** 영문 타입 → 한글 타입 변환 맵 */
export const CAMPAIGN_TYPE_KO: Record<CampaignTypeEn, CampaignApplication["type"]> = {
  delivery: "배송형",
  visit: "방문형",
  review: "구매평",
  reporter: "기자단",
  mission: "미션형",
};

/** 영문 타입 → localStorage 키 변환 맵 */
export const CAMPAIGN_TYPE_STORAGE_KEY: Record<CampaignTypeEn, string> = {
  delivery: "deliveryCampaigns",
  visit: "visitCampaigns",
  review: "reviewCampaigns",
  reporter: "reporterCampaigns",
  mission: "missionCampaigns",
};

/** 영문 타입 → ID 접두사 변환 맵 */
export const CAMPAIGN_TYPE_ID_PREFIX: Record<CampaignTypeEn, string> = {
  delivery: "delivery_",
  visit: "visit_",
  review: "review_",
  reporter: "reporter_",
  mission: "mission_",
};

/**
 * 채널 이름을 표준 이름으로 정규화
 * - "클립", "네이버 클립" → "네이버클립"
 * - "Blog", "블로그" → "네이버블로그"
 */
export function normalizeChannelName(channelName: string | undefined | null): string {
  if (!channelName) return "";

  const normalized = channelName.replace(/\s+/g, "");
  const normalizedLower = normalized.toLowerCase();

  if (normalized === "네이버블로그" || normalized === "블로그" || normalizedLower === "blog") {
    return "네이버블로그";
  }
  if (normalized === "네이버클립" || normalized === "클립" || normalizedLower === "clip") {
    return "네이버클립";
  }
  if (
    normalized === "인스타그램" ||
    normalizedLower === "instagram" ||
    normalizedLower === "insta"
  ) {
    return "인스타그램";
  }
  if (normalized === "유튜브" || normalizedLower === "youtube" || normalizedLower === "yt") {
    return "유튜브";
  }
  if (normalized === "릴스" || normalizedLower === "reels") {
    return "릴스";
  }
  if (normalized === "쇼츠" || normalized === "숏츠" || normalizedLower === "shorts") {
    return "쇼츠";
  }

  const categoryIconMap: Record<string, string> = {
    네이버블로그: "네이버블로그",
    네이버클립: "네이버클립",
    클립: "네이버클립",
    인스타그램: "인스타그램",
    유튜브: "유튜브",
    릴스: "릴스",
    쇼츠: "쇼츠",
    숏츠: "쇼츠",
  };

  return categoryIconMap[normalized] ?? normalized;
}

/**
 * 모든 정적 캠페인 데이터를 하나의 배열로 반환
 */
export function getAllStaticCampaigns() {
  return [
    ...deliveryCampaigns,
    ...visitCampaigns,
    ...reviewCampaigns,
    ...reporterCampaigns,
    ...missionCampaigns,
  ];
}

/**
 * campaignId와 campaignType으로 캠페인을 찾을 때 사용하는 ID 매칭 함수
 * - 정확히 일치, prefix 포함/제외 형식 모두 처리
 */
export function matchCampaignId(campId: string, storedId: string, prefix: string): boolean {
  if (campId === storedId) return true;
  if (prefix && campId === `${prefix}${storedId}`) return true;
  if (storedId.startsWith(prefix)) {
    const withoutPrefix = storedId.replace(new RegExp(`^${prefix}`), "");
    if (campId === withoutPrefix) return true;
  }
  return false;
}
