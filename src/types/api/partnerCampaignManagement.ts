/* ========================================
   파트너 캠페인 관리 API 타입 정의
   ======================================== */

/**
 * 파트너 캠페인 관리 관련 API 타입
 *
 * API:
 * - 13번: GET /partner/campaign_management (관리 페이지 조회 — stats + 캠페인)
 * - 14번: GET /partner/campaign_management/{status} (상태별 조회)
 * - 17번: DELETE /partner/campaign/{campaignId} (캠페인 삭제)
 *
 * 사용 위치:
 * - src/lib/api/partnerCampaignManagement.ts
 * - src/hooks/partner/campaign_management/usePartnerCampaigns.ts
 */

// ----------------------------------------
// 공통 응답 wrapper
// ----------------------------------------

/** 백엔드 공통 응답 wrapper */
export interface ApiResponseWrapper<T> {
  result: string; // "OK" | "success" | 에러코드
  generatedAt: string; // ISO 8601
  data: T;
}

// ----------------------------------------
// 캠페인 아이템 (API 13 — `id` 필드)
// ----------------------------------------

/** API 13 응답의 캠페인 아이템 (camelCase — 백엔드 확정) */
export interface CampaignManagementItem {
  id: number;
  title: string;
  campaignType: string;
  platform: string;
  thumbnailUrl: string;
  category?: string;
  points: number;
  status: string;
  recruitCount: number;
  currentApplicants: number;
  selectedCount?: number;
  applicationStartDate: string;
  applicationEndDate: string;
  campaignStartDate: string;
  campaignEndDate: string;
  description?: string;
  notification?: string;
  createdAt: string;
  updatedAt: string;
  extensionRequested?: boolean;
  extensionRequestCount?: number;
  waitingCount?: number;
  submittedCount?: number;
  approvedCount?: number;
}

// ----------------------------------------
// 캠페인 아이템 (API 14 — `campaignId` 필드)
// ----------------------------------------

/** API 14 응답의 캠페인 아이템 (camelCase — 백엔드 확정) */
export interface CampaignStatusItem {
  campaignId: number;
  title: string;
  campaignType: string;
  platform: string;
  thumbnailUrl: string;
  category?: string;
  points: number;
  status: string;
  recruitCount: number;
  currentApplicants: number;
  selectedCount?: number;
  applicationStartDate: string;
  applicationEndDate: string;
  campaignStartDate: string;
  campaignEndDate: string;
  createdAt: string;
  updatedAt: string;
  extensionRequested?: boolean;
  extensionRequestCount?: number;
  waitingCount?: number;
  submittedCount?: number;
  approvedCount?: number;
}

// ----------------------------------------
// 통계 (API 13 전용)
// ----------------------------------------

/** 탭별 캠페인 개수 통계 */
export interface CampaignManagementStats {
  totalCount: number;
  scheduledCount: number;
  applicationCount: number;
  ongoingCount: number;
  completedCount: number;
  canceledCount: number;
  extensionRequestCount: number;
}

// ----------------------------------------
// API 13 — 캠페인 관리 페이지 조회
// GET /partner/campaign_management
// ----------------------------------------

/** API 13 응답 data */
export interface CampaignManagementPageData {
  campaigns: CampaignManagementItem[];
  stats: CampaignManagementStats;
}

/** API 13 전체 응답 */
export type CampaignManagementPageResponse = ApiResponseWrapper<CampaignManagementPageData>;

// ----------------------------------------
// API 14 — 캠페인 상태별 조회
// GET /partner/campaign_management/{status}
// ----------------------------------------

/** API 14 요청 파라미터 */
export interface CampaignStatusParams {
  status: string; // "all" | "REGISTERING" | "RECRUITING" | "CLOSED" | "SELECTING" | "PURCHASING" | "EMERGENCY"
  sort?: "LATEST" | "OLDEST" | "DEADLINE";
  type?: string[]; // DELIVERY, VISIT, PURCHASE, REPORT (복수 선택)
  channel?: string[]; // BLOG, INSTAGRAM, YOUTUBE, REELS (복수 선택)
  keyword?: string;
}

/** API 14 응답 data */
export interface CampaignStatusData {
  campaigns: CampaignStatusItem[];
}

/** API 14 전체 응답 */
export type CampaignStatusResponse = ApiResponseWrapper<CampaignStatusData>;

// ----------------------------------------
// API 17 — 캠페인 삭제
// DELETE /partner/campaign/{campaignId}
// ----------------------------------------

/** API 17 응답 */
export interface CampaignDeleteResponse {
  result: string;
  generatedAt: string;
  message: string;
  deletedCampaignId: number;
}

// ----------------------------------------
// 탭 ↔ status 매핑
// ----------------------------------------

/** 프론트엔드 탭명 → 백엔드 status 매핑 */
export const TAB_TO_API_STATUS: Record<string, string> = {
  전체: "all",
  예정: "REGISTERING",
  신청: "RECRUITING",
  진행: "SELECTING", // SELECTING + PURCHASING
  종료: "CLOSED",
  취소: "EMERGENCY",
  "연장 요청": "EXTENSION",
};

/** 백엔드 campaign_type → 프론트엔드 한글 */
export const CAMPAIGN_TYPE_LABEL: Record<string, string> = {
  delivery: "배송형",
  visit: "방문형",
  purchase: "구매평",
  report: "기자단",
  DELIVERY: "배송형",
  VISIT: "방문형",
  PURCHASE: "구매평",
  REPORT: "기자단",
};

/** 백엔드 platform → 프론트엔드 한글 */
export const PLATFORM_LABEL: Record<string, string> = {
  naver_blog: "네이버블로그",
  naver_clip: "네이버클립",
  instagram: "인스타그램",
  instagram_reels: "릴스",
  youtube: "유튜브",
  youtube_shorts: "쇼츠",
  reels: "릴스",
  NAVER_BLOG: "네이버블로그",
  NAVER_CLIP: "네이버클립",
  BLOG: "네이버블로그",
  INSTAGRAM: "인스타그램",
  INSTAGRAM_REELS: "릴스",
  YOUTUBE: "유튜브",
  YOUTUBE_SHORTS: "쇼츠",
  REELS: "릴스",
};

/** 백엔드 status → 프론트엔드 한글 상태 */
export const STATUS_LABEL: Record<string, string> = {
  REGISTERING: "대기 중",
  RECRUITING: "모집 중",
  SELECTING: "선정 중",
  PURCHASING: "진행 중",
  CLOSED: "종료",
  EMERGENCY: "취소",
};
