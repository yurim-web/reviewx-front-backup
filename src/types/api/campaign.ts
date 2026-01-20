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

import { ApiResponse } from './auth';

/**
 * 캠페인 타입
 */
export type CampaignType = 'delivery' | 'visit' | 'review' | 'reporter' | 'mission';

/**
 * 캠페인 상태
 */
export type CampaignStatus =
  | 'recruiting'      // 모집중
  | 'in_progress'     // 진행중
  | 'completed'       // 완료
  | 'cancelled'       // 취소됨
  | 'pending_approval'; // 승인대기

/**
 * 플랫폼 타입
 */
export type PlatformType =
  | 'naver_blog'
  | 'naver_clip'
  | 'instagram'
  | 'instagram_reels'
  | 'youtube'
  | 'youtube_shorts';

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
  recruit_count: number;        // 모집 인원
  current_applicants: number;   // 현재 신청자 수
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
    gender?: 'male' | 'female' | 'all';
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
  status: 'pending' | 'approved' | 'rejected' | 'completed';
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
    status: 'pending';
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
    status: 'approved' | 'rejected';
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
