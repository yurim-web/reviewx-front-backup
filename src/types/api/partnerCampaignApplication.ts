/* ========================================
   파트너 캠페인 신청내역 API 타입 정의
   ======================================== */

/**
 * 백엔드 API 19: GET /partner/campaign/applications/{campaignId}
 * 백엔드 API 20: PUT /partner/campaign/applications/{applicationId}/select
 * 백엔드 API 21: PUT /partner/campaign/applications/{applicationId}/cancel-select
 */

// ----------------------------------------
// API 19: 캠페인 신청내역 조회 Response
// ----------------------------------------

/** 캠페인 기본 정보 (상단 배너용) */
export interface CampaignApplicationInfo {
  campaignId: number;
  title: string;
  type: string; // "VISIT" | "PURCHASE" | "DELIVERY" | "REPORTER" | "MISSION"
  status: string; // "REGISTERING" | "RECRUITING" | "SELECTING" | "PURCHASING" | "CLOSED" | "EMERGENCY"
  recruitLimit: number;
  totalApplied: number;
  totalSelected: number;
  totalCanceled: number;
  recruitStartAt: string; // ISO 8601
  recruitEndAt: string; // ISO 8601
  // 프론트엔드 UI에 필요한 추가 필드 (백엔드에서 추가 제공 가능)
  thumbnailUrl?: string;
  platform?: string;
  category?: string;
  campaignStartAt?: string;
  campaignEndAt?: string;
  announcementDate?: string;
  points?: number;
  region?: string;
  subRegion?: string;
}

/** 채널 정보 (신청자 내부) */
export interface ChannelInfo {
  channelId: number;
  channelName: string; // "NAVER_BLOG" | "NAVER_CLIP" | "INSTAGRAM" | "YOUTUBE" | "REELS" | "SHORTS"
  channelUrl: string;
  followerCount: number;
  // 프론트엔드 UI에 필요한 추가 메트릭 (mock에서 제공)
  dailyVisits?: number;
  totalVisits?: number;
  neighbors?: number;
  subscribers?: number;
}

/** 신청자 정보 */
export interface ApplicationItem {
  applicationId: number;
  reviewerId: number;
  reviewerName: string;
  reviewerEmail?: string;
  reviewerPhone?: string;
  reviewerGrade?: string; // "PLATINUM" | "GOLD" | "SILVER" | "BRONZE"
  reviewerSex?: string; // "M" | "F"
  reviewerBirthDate?: string; // yyyy-MM-dd
  channelInfo: ChannelInfo;
  status: string; // "APPLIED" | "SELECTED" | "CANCELED"
  memo: string;
  isAgreed?: boolean;
  appliedAt: string; // ISO 8601
  selectedAt?: string | null;
  canceledAt?: string | null;
  // 프론트엔드 UI에 필요한 추가 필드
  profileImage?: string;
  userType?: string; // "REVIEWER" | "INFLUENCER"
  memberType?: string; // "MODEL" | "CAUTION" | "WARNING" | "BLOCKED"
}

/** 페이지네이션 */
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/** 신청내역 조회 응답 */
export interface CampaignApplicationResponse {
  result: string;
  generatedAt: string;
  data: {
    campaignInfo: CampaignApplicationInfo;
    applications: ApplicationItem[];
    pagination: PaginationInfo;
  };
}

// ----------------------------------------
// API 20: 리뷰어 선정 Response
// ----------------------------------------

export interface SelectApplicationResponse {
  result: string;
  generatedAt: string;
  data: {
    applicationId: number;
    campaignId: number;
    reviewerId: number;
    reviewerName: string;
    status: string; // "SELECTED"
    selectedAt: string;
    message: string;
  };
}

// ----------------------------------------
// API 21: 리뷰어 선정 취소 Response
// ----------------------------------------

export interface CancelSelectResponse {
  result: string;
  generatedAt: string;
  data: {
    applicationId: number;
    campaignId: number;
    reviewerId: number;
    reviewerName: string;
    status: string; // "APPLIED"
    canceledAt: string;
    message: string;
  };
}

// ----------------------------------------
// 쿼리 파라미터
// ----------------------------------------

export type ApplicationStatusFilter = "ALL" | "APPLIED" | "SELECTED" | "CANCELED";
export type ApplicationSortOption = "LATEST" | "OLDEST" | "RECOMMEND";

// ----------------------------------------
// 채널/멤버타입 매핑
// ----------------------------------------

/** 채널 코드 → 프론트엔드 레이블 */
export const CHANNEL_LABEL: Record<string, string> = {
  NAVER_BLOG: "네이버블로그",
  NAVER_CLIP: "네이버클립",
  INSTAGRAM: "인스타그램",
  INSTAGRAM_REELS: "릴스",
  YOUTUBE: "유튜브",
  YOUTUBE_SHORTS: "숏츠",
  REELS: "릴스",
  SHORTS: "숏츠",
  BASIC: "기본",
};

/** 유저 타입 코드 → 프론트엔드 레이블 */
export const USER_TYPE_LABEL: Record<string, string> = {
  REVIEWER: "리뷰어",
  INFLUENCER: "인플루언서",
};

/** 멤버 타입 코드 → 프론트엔드 레이블 */
export const MEMBER_TYPE_LABEL: Record<string, string> = {
  MODEL: "모범 회원",
  CAUTION: "주의 회원",
  WARNING: "경고 회원",
  BLOCKED: "이용 제한",
};

/** 리뷰어 등급 코드 → 프론트엔드 레이블 */
export const REVIEWER_GRADE_LABEL: Record<string, string> = {
  PLATINUM: "플래티넘",
  GOLD: "골드",
  SILVER: "실버",
  BRONZE: "브론즈",
};
