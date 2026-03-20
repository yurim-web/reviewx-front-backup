/* ========================================
   파트너 대시보드 API Response 타입
   ======================================== */

/**
 * 모듈 목적
 *
 * - 파트너 대시보드 메인페이지 API 응답 타입 정의 (06번: GET /partner/dashboard)
 * - 파트너 캠페인 검색 API 응답 타입 정의 (GET /partner/search)
 * - 파트너 캠페인 유형별 조회 API 응답 타입 정의 (GET /partner/{type})
 *
 * 사용 위치:
 * - src/lib/api/dashboard.ts
 * - src/hooks/user/useDashboard.ts
 */

/** 배너 */
export interface PartnerBanner {
  bannerId: number;
  imageUrl: string;
  linkUrl: string | null;
  displayOrder: number;
}

/** 캠페인 공통 카드 (홈 / 검색 / 유형별 공통) */
export interface PartnerCampaignCard {
  campaignId: number;
  type: "DELIVERY" | "VISIT" | "PURCHASE" | "REPORTER" | "MISSION";
  status:
    | "REGISTERING"
    | "RECRUITING"
    | "CLOSED"
    | "SELECTING"
    | "PURCHASING"
    | "EMERGENCY"
    | "DRAFT";
  title: string;
  thumbnail: { attachmentId: number; fileId: number; url: string };
  category: { categoryId: number; categoryName: string };
  requiredPlatform: { channelId: number; channelName: string };
  region?: { regionId: number; name: string; parentId: number | null };
  recruit: {
    recruitLimit: number;
    recruitStartAt: string;
    recruitEndAt: string;
  };
  metrics: {
    appliedCount: number;
    selectedCount: number;
    applicationRate: number;
  };
  reward: {
    extraRewardPoint: number;
    paymentRewardPoint: number;
  };
}

/** GET /partner/dashboard 응답 */
export interface PartnerDashboardResponse {
  result: "OK";
  generatedAt: string;
  banners: PartnerBanner[];
  sections: {
    highSelectionProbability: PartnerCampaignCard[];
    popularNow: PartnerCampaignCard[];
    similarCampaigns?: PartnerCampaignCard[];
    ongoing: PartnerCampaignCard[];
  };
}

/** GET /partner/search 응답 */
export interface PartnerSearchResponse {
  result: "OK";
  generatedAt: string;
  keyword: string;
  totalCount: number;
  campaigns: PartnerCampaignCard[];
}

/** GET /partner/{type} 파라미터 */
export type PartnerCampaignType = "DELIVERY" | "VISIT" | "PURCHASE" | "REPORTER" | "MISSION";

export interface PartnerTypeFilterParams {
  type: PartnerCampaignType;
  categoryId?: number;
  channelId?: number;
  status?: string;
}

/** GET /partner/{type} 응답 */
export interface PartnerTypeFilterResponse {
  result: "OK";
  generatedAt: string;
  type: PartnerCampaignType;
  totalCount: number;
  campaigns: PartnerCampaignCard[];
}

// ── 하위 호환 별칭 (기존 import 유지) ──
/** @deprecated PartnerCampaignCard 사용 */
export type DashboardApiItem = PartnerCampaignCard;
/** @deprecated PartnerDashboardResponse 사용 */
export type DashboardApiResponse = PartnerDashboardResponse;
/** @deprecated PartnerSearchResponse 사용 */
export type SearchApiResponse = PartnerSearchResponse;
