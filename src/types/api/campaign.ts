/* ========================================
   📢 캠페인 관련 API Response 타입
   ======================================== */

/**
 * 모듈 목적
 *
 * - 캠페인 목록, 상세, 신청, 승인 등 캠페인 관련 API 응답 타입 정의
 * - 캠페인 타입별 (리뷰, 배송, 방문 등) 데이터 구조 정의
 *
 * 📌 사용 위치:
 * - 캠페인 목록/상세 페이지
 * - 캠페인 신청/관리 기능
 */

import { ApiResponse } from "./auth";

/**
 * 캠페인 목록 API 단건 아이템 타입
 * 실제 백엔드 GET /reviewer/campaign/{type} 응답 items[] 구조와 일치
 * (22. 대시보드 유형별 조회 스펙 기준)
 */
export interface CampaignListApiItem {
  campaignId: number;
  type: string; // "DELIVERY" | "VISIT" | "PURCHASE" | "REPORTER" | "MISSION"
  status: string; // "RECRUITING" | "CLOSED" | "SELECTING" | "EMERGENCY" 등
  isEmergency: boolean;
  title: string;
  thumbnailUrl: string;
  category: {
    categoryId: number;
    categoryName: string; // "뷰티", "식품", "가전" 등
  };
  requiredPlatform: {
    channelId: number;
    channelName: string; // "INSTAGRAM" | "NAVER_BLOG" | "YOUTUBE" 등
  };
  recruitLimit: number; // 모집 인원 (total)
  appliedCount: number; // 신청자 수 (current)
  additionalPoint: number; // 추가 지급 포인트 (= extra_reward_point)
  recruitStartAt: string; // ISO 8601
  recruitEndAt: string; // ISO 8601
  region?: string; // 방문형 전용 (지역)
  // mock DB 호환 fallback 필드
  reward?: { extraRewardPoint?: number; paymentRewardPoint?: number };
  points?: number;
}

/**
 * 캠페인 목록 API 응답 래퍼 타입
 * 실제 백엔드: { result: "OK", items: [...] }
 * json-server 목업: [...] (배열 직접 반환) — API 함수에서 자동 처리
 */
export interface CampaignListApiResponse {
  result: string;
  items: CampaignListApiItem[];
}

/**
 * 캠페인 상세 API 아이템 타입 (23번: GET /reviewer/campaign/{campaignId})
 * 실제 백엔드: { result: "OK", campaign: {...} }
 * json-server 목업: 직접 객체 반환 — API 함수에서 자동 처리
 */
export interface CampaignDetailApiItem {
  campaignId: number;
  type: string;
  status: string;
  title: string;
  description: string;
  thumbnail: { url: string };
  thumbnailUrl?: string; // json-server mock fallback
  category: { categoryId: number; categoryName: string };
  requiredPlatform: { channelId: number; channelName: string };
  region?: string | { regionId: number; name: string; parentId: number | null } | null;
  recruit: {
    recruitLimit: number;
    recruitStartAt: string;
    recruitEndAt: string;
  };
  content?: {
    contentStartAt: string;
    contentEndAt: string;
  };
  reward?: {
    extraRewardPoint: number;
    paymentRewardPoint: number;
  };
  keywordPolicy?: {
    keyword: string;
    minTextLength: number;
    minPhotoCount: number;
    requireBodyLink: boolean;
  };
  notification?: string;
  detailImages?: string[]; // 상세 이미지 URL 배열 (mock DB)
  visitInfo?: { address: string; reservationRequired: boolean };
  purchaseInfo?: { purchaseLink: string; purchasePoint: number };
  missionInfo?: { requireContentLink: boolean; requireContentImage: boolean };
  // mock flat 구조 fallback
  recruitLimit?: number;
  appliedCount?: number;
  isEmergency?: boolean;
  metrics?: { appliedCount: number; selectedCount: number; applicationRate: number };
}

/** 상세 API 래퍼 (실제 백엔드: { result, campaign }) */
export interface CampaignDetailApiResponse {
  result: string;
  campaign: CampaignDetailApiItem;
}

/**
 * 캠페인 타입
 */
export type CampaignType = "delivery" | "visit" | "review" | "reporter" | "mission";

/**
 * 캠페인 상태
 */
export type CampaignStatus =
  | "recruiting" // 모집중
  | "in_progress" // 진행중
  | "completed" // 완료
  | "cancelled" // 취소됨
  | "pending_approval"; // 승인대기

/**
 * 플랫폼 타입
 */
export type PlatformType =
  | "naver_blog"
  | "naver_clip"
  | "instagram"
  | "instagram_reels"
  | "youtube"
  | "youtube_shorts";

/**
 * 캠페인 기본 정보
 */
export interface CampaignBasicInfo {
  id: string;
  title: string;
  campaign_type: CampaignType;
  platform: PlatformType;
  thumbnail_url: string;
  points: number;
  status: CampaignStatus;
  created_at: string;
  updated_at: string;
}

/**
 * 캠페인 상세 정보
 */
export interface CampaignDetail extends CampaignBasicInfo {
  description: string;
  detail_images: string[];

  // 모집 정보
  recruit_count: number; // 모집 인원
  current_applicants: number; // 현재 신청자 수
  application_start_date: string;
  application_end_date: string;

  // 캠페인 기간
  campaign_start_date: string;
  campaign_end_date: string;

  // 요구사항
  requirements?: {
    min_followers?: number;
    min_posts?: number;
    age_range?: string;
    gender?: "male" | "female" | "all";
    regions?: string[];
  };

  // 가이드라인
  guidelines?: string;
  prohibited_keywords?: string[];
  required_keywords?: string[];

  // 파트너 정보
  partner_id: string;
  partner_name: string;

  // 제품 정보 (배송형 캠페인)
  product_info?: {
    name: string;
    original_price: number;
    discounted_price?: number;
    shipping_fee: number;
  };

  // 방문 정보 (방문형 캠페인)
  visit_info?: {
    address: string;
    business_hours: string;
    reservation_required: boolean;
    contact_phone?: string;
  };
}

/**
 * 캠페인 목록 응답
 */
export interface CampaignListResponse extends ApiResponse {
  data: {
    campaigns: CampaignBasicInfo[];
    total_count: number;
    current_page: number;
    total_pages: number;
    has_next: boolean;
  };
}

/**
 * 캠페인 상세 응답
 */
export interface CampaignDetailResponse extends ApiResponse {
  data: CampaignDetail;
}

/**
 * 캠페인 신청 정보
 */
export interface CampaignApplication {
  id: string;
  campaign_id: string;
  user_id: string;
  status: "pending" | "approved" | "rejected" | "completed";
  applied_at: string;
  reviewed_at?: string;

  // 채널 정보
  channel_url: string;
  followers_count: number;

  // 제출 콘텐츠 (승인 후)
  content_url?: string;
  submitted_at?: string;

  // 파트너 피드백
  partner_feedback?: string;
}

/**
 * 캠페인 신청 응답
 */
export interface ApplyCampaignResponse extends ApiResponse {
  data: {
    application_id: string;
    campaign_id: string;
    status: "pending";
  };
}

/**
 * 캠페인 신청자 목록 응답 (파트너용)
 */
export interface CampaignApplicantsResponse extends ApiResponse {
  data: {
    applications: CampaignApplication[];
    total_count: number;
    pending_count: number;
    approved_count: number;
    rejected_count: number;
  };
}

/**
 * 신청 승인/거절 응답
 */
export interface ReviewApplicationResponse extends ApiResponse {
  data: {
    application_id: string;
    status: "approved" | "rejected";
    reviewed_at: string;
  };
}

/**
 * 콘텐츠 제출 응답
 */
export interface SubmitContentResponse extends ApiResponse {
  data: {
    application_id: string;
    content_url: string;
    submitted_at: string;
  };
}

/**
 * 캠페인 생성 응답 (파트너용)
 */
export interface CreateCampaignResponse extends ApiResponse {
  data: {
    campaign_id: string;
    title: string;
    status: CampaignStatus;
    created_at: string;
  };
}

/**
 * 캠페인 수정 응답 (파트너용)
 */
export interface UpdateCampaignResponse extends ApiResponse {
  data: {
    campaign_id: string;
    updated_at: string;
  };
}

/**
 * 캠페인 삭제 응답 (파트너용)
 */
export interface DeleteCampaignResponse extends ApiResponse {
  message: string;
}

/**
 * 캠페인 통계 (파트너용)
 */
export interface CampaignStats {
  total_campaigns: number;
  active_campaigns: number;
  completed_campaigns: number;
  total_applicants: number;
  approved_applicants: number;
  total_spent_points: number;
}

/**
 * 캠페인 통계 응답
 */
export interface CampaignStatsResponse extends ApiResponse {
  data: CampaignStats;
}

// ========================================
// mock json-server 쓰기 타입
// ========================================

/**
 * POST /reviewer/campaign/apply → /campaign_applications
 * 캠페인 신청 Request body (mock)
 */
export interface CampaignApplicationPostBody {
  campaign_id: number;
  reviewer_id: number;
  status: "APPLIED";
  apply_date: string;
  channel_url: string;
  introduction: string;
}

/** campaign_applications 아이템 응답 (mock) */
export interface CampaignApplicationApiItem {
  id: number;
  campaign_id: number;
  reviewer_id: number;
  status: string;
  apply_date: string;
  channel_url: string;
  introduction: string;
}
