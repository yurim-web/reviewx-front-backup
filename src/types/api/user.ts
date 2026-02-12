/* ========================================
   👤 사용자(리뷰어) 관련 API Response 타입
   ======================================== */

/**
 * 모듈 목적
 *
 * - 리뷰어 프로필, 채널 연동, 마이페이지 등 사용자 관련 API 응답 타입 정의
 * - 리뷰어의 활동 내역 및 통계 데이터 구조 정의
 *
 * 📌 사용 위치:
 * - 마이페이지
 * - 채널 연동 페이지
 * - 프로필 수정 페이지
 */

import { ApiResponse } from './auth';
import { PlatformType } from './campaign';

/**
 * 리뷰어 등급
 */
export type ReviewerGrade = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

/**
 * 채널 연동 상태
 */
export type ChannelConnectionStatus = 'connected' | 'disconnected' | 'pending_verification';

/**
 * 리뷰어 채널 정보
 */
export interface ReviewerChannel {
  id: string;
  platform: PlatformType;
  channel_url: string;
  channel_name: string;
  followers_count: number;
  posts_count: number;
  connection_status: ChannelConnectionStatus;
  connected_at?: string;
  last_verified_at?: string;
}

/**
 * 리뷰어 프로필 정보
 */
export interface ReviewerProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  profile_image?: string;

  // 등급 정보
  grade: ReviewerGrade;

  // 채널 정보
  channels: ReviewerChannel[];

  // 주소 정보 (배송형 캠페인용)
  address?: {
    postal_code: string;
    address_line1: string;
    address_line2?: string;
  };

  // 계좌 정보
  bank_info?: {
    bank_name: string;
    account_number: string;
    account_holder: string;
  };

  // 가입 정보
  created_at: string;
  last_login_at?: string;
}

/**
 * 프로필 조회 응답
 */
export interface GetProfileResponse extends ApiResponse {
  data: ReviewerProfile;
}

/**
 * 프로필 수정 응답
 */
export interface UpdateProfileResponse extends ApiResponse {
  data: {
    updated_at: string;
  };
  message: string;
}

/**
 * 프로필 이미지 업로드 응답
 */
export interface UploadProfileImageResponse extends ApiResponse {
  data: {
    image_url: string;
  };
}

/**
 * 채널 연동 요청 응답
 */
export interface ConnectChannelResponse extends ApiResponse {
  data: {
    channel_id: string;
    platform: PlatformType;
    verification_url?: string; // OAuth 인증 URL
    status: ChannelConnectionStatus;
  };
}

/**
 * 채널 연동 해제 응답
 */
export interface DisconnectChannelResponse extends ApiResponse {
  message: string;
}

/**
 * 채널 정보 갱신 응답
 */
export interface RefreshChannelResponse extends ApiResponse {
  data: {
    channel_id: string;
    followers_count: number;
    posts_count: number;
    last_verified_at: string;
  };
}

/**
 * 리뷰어 활동 통계
 */
export interface ReviewerActivityStats {
  total_applications: number;     // 총 신청 횟수
  approved_applications: number;  // 승인된 신청
  completed_campaigns: number;    // 완료한 캠페인
  total_earned_points: number;    // 총 획득 포인트
  current_grade: ReviewerGrade;   // 현재 등급
  next_grade?: ReviewerGrade;     // 다음 등급
  points_to_next_grade?: number;  // 다음 등급까지 필요한 포인트
}

/**
 * 활동 통계 조회 응답
 */
export interface GetActivityStatsResponse extends ApiResponse {
  data: ReviewerActivityStats;
}

/**
 * 내 캠페인 목록 필터
 */
export type MyCampaignFilter = 'all' | 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected';

/**
 * 내 캠페인 항목
 */
export interface MyCampaignItem {
  application_id: string;
  campaign_id: string;
  campaign_title: string;
  campaign_type: string;
  thumbnail_url: string;
  points: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  applied_at: string;

  // 진행 정보
  content_url?: string;
  submitted_at?: string;
  partner_feedback?: string;
}

/**
 * 내 캠페인 목록 응답
 */
export interface MyCampaignsResponse extends ApiResponse {
  data: {
    campaigns: MyCampaignItem[];
    total_count: number;
    counts_by_status: {
      pending: number;
      approved: number;
      in_progress: number;
      completed: number;
      rejected: number;
    };
  };
}

/**
 * 주소 수정 응답
 */
export interface UpdateAddressResponse extends ApiResponse {
  data: {
    address: {
      postal_code: string;
      address_line1: string;
      address_line2?: string;
    };
  };
  message: string;
}

/**
 * 계좌 정보 수정 응답
 */
export interface UpdateBankInfoResponse extends ApiResponse {
  data: {
    bank_info: {
      bank_name: string;
      account_number: string;
      account_holder: string;
    };
  };
  message: string;
}

/**
 * 회원 탈퇴 응답
 */
export interface DeleteAccountResponse extends ApiResponse {
  message: string;
}
