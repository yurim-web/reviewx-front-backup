/* ========================================
   🏢 파트너(광고주) 관련 API Response 타입
   ======================================== */

/**
 * 모듈 목적
 *
 * - 파트너 프로필, 사업자 정보, 캠페인 관리 등 파트너 관련 API 응답 타입 정의
 * - 파트너의 캠페인 운영 및 통계 데이터 구조 정의
 *
 * 📌 사용 위치:
 * - 파트너 마이페이지
 * - 사업자 정보 관리
 * - 캠페인 관리 페이지
 */

import { ApiResponse } from "./auth";

/**
 * 사업자 유형
 */
export type BusinessType = "individual" | "corporate";

/**
 * 파트너 승인 상태
 */
export type PartnerApprovalStatus = "pending" | "approved" | "rejected";

/**
 * 사업자 정보
 */
export interface BusinessInfo {
  business_type: BusinessType;
  business_number: string; // 사업자등록번호
  company_name: string; // 상호명
  representative_name: string; // 대표자명
  business_address: string; // 사업장 주소
  business_category: string; // 업종
  registration_date: string; // 개업일

  // 첨부 서류
  business_registration_file?: string; // 사업자등록증
  tax_registration_file?: string; // 세금계산서 발행용 서류
}

/**
 * 담당자 정보
 */
export interface ContactPerson {
  name: string;
  department?: string;
  position?: string;
  phone: string;
  email: string;
}

/**
 * 파트너 프로필 정보
 */
export interface PartnerProfile {
  id: string;
  email: string;

  // 사업자 정보
  business_info: BusinessInfo;

  // 담당자 정보
  contact_person: ContactPerson;

  // 승인 정보
  approval_status: PartnerApprovalStatus;
  approved_at?: string;
  rejected_reason?: string;

  // 계정 정보
  created_at: string;
  last_login_at?: string;
}

/**
 * 파트너 프로필 조회 응답
 */
export interface GetPartnerProfileResponse extends ApiResponse {
  data: PartnerProfile;
}

/**
 * 파트너 프로필 수정 응답
 */
export interface UpdatePartnerProfileResponse extends ApiResponse {
  data: {
    updated_at: string;
  };
  message: string;
}

/**
 * 사업자 등록증 업로드 응답
 */
export interface UploadBusinessDocumentResponse extends ApiResponse {
  data: {
    file_url: string;
    file_type: "business_registration" | "tax_registration";
  };
}

/**
 * 사업자 정보 수정 응답
 */
export interface UpdateBusinessInfoResponse extends ApiResponse {
  data: {
    business_info: BusinessInfo;
    updated_at: string;
  };
  message: string;
}

/**
 * 담당자 정보 수정 응답
 */
export interface UpdateContactPersonResponse extends ApiResponse {
  data: {
    contact_person: ContactPerson;
    updated_at: string;
  };
  message: string;
}

/**
 * 파트너 활동 통계
 */
export interface PartnerActivityStats {
  total_campaigns: number; // 총 캠페인 수
  active_campaigns: number; // 진행 중인 캠페인
  completed_campaigns: number; // 완료된 캠페인
  total_applicants: number; // 총 신청자 수
  approved_applicants: number; // 승인된 신청자 수
  total_spent_points: number; // 총 사용 포인트
  average_campaign_performance: number; // 평균 캠페인 성과 (완료율)
}

/**
 * 파트너 활동 통계 응답
 */
export interface GetPartnerActivityStatsResponse extends ApiResponse {
  data: PartnerActivityStats;
}

/**
 * 파트너 대시보드 데이터
 */
export interface PartnerDashboard {
  stats: PartnerActivityStats;

  // 최근 캠페인
  recent_campaigns: Array<{
    id: string;
    title: string;
    status: string;
    applicants_count: number;
    created_at: string;
  }>;

  // 대기 중인 신청
  pending_applications: Array<{
    id: string;
    campaign_title: string;
    applicant_name: string;
    applied_at: string;
  }>;

  // 포인트 정보
  point_summary: {
    available_points: number;
    pending_points: number;
    total_charged: number;
  };
}

/**
 * 파트너 대시보드 응답
 */
export interface GetPartnerDashboardResponse extends ApiResponse {
  data: PartnerDashboard;
}

/**
 * 파트너 캠페인 목록 필터
 */
export type PartnerCampaignFilter =
  | "all"
  | "recruiting"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "pending_approval";

/**
 * 파트너의 캠페인 항목
 */
export interface PartnerCampaignItem {
  id: string;
  title: string;
  campaign_type: string;
  platform: string;
  thumbnail_url: string;
  status: string;

  // 모집 정보
  recruit_count: number;
  current_applicants: number;
  approved_count: number;

  // 기간
  application_start_date: string;
  application_end_date: string;
  campaign_start_date: string;
  campaign_end_date: string;

  // 포인트
  points_per_person: number;
  total_budget: number;
  spent_points: number;

  created_at: string;
}

/**
 * 파트너 캠페인 목록 응답
 */
export interface PartnerCampaignsResponse extends ApiResponse {
  data: {
    campaigns: PartnerCampaignItem[];
    total_count: number;
    counts_by_status: {
      recruiting: number;
      in_progress: number;
      completed: number;
      cancelled: number;
      pending_approval: number;
    };
  };
}

/**
 * 파트너 승인 요청 응답
 */
export interface RequestPartnerApprovalResponse extends ApiResponse {
  data: {
    partner_id: string;
    approval_status: "pending";
    requested_at: string;
  };
  message: string;
}

/**
 * 파트너 탈퇴 응답
 */
export interface DeletePartnerAccountResponse extends ApiResponse {
  message: string;
}

// ========================================
// mock API (json-server) 전용 타입
// ========================================

/**
 * mock DB 캠페인 응답 타입 (파트너용)
 * GET /partner/campaign?partner_id=:id → /campaigns?partner_id=:id
 */
export interface PartnerCampaignApiItem {
  id: number;
  partner_id: number;
  type: string; // "DELIVERY" | "VISIT" | "PURCHASE" | "PURCHASE_REVIEW" | "REPORTER" | "MISSION"
  status: string; // "REGISTERING" | "RECRUITING" | "SELECTED" | "IN_PROGRESS" | "COMPLETED" | "CLOSED" | "CANCELLED"
  title: string;
  thumbnailUrl: string;
  category: { categoryId: number; categoryName: string };
  requiredPlatform: { channelId: number; channelName: string };
  recruitLimit?: number;
  appliedCount?: number;
  selectedCount?: number;
  recruitStartAt?: string; // ISO 8601
  recruitEndAt?: string;
  recruit?: { recruitLimit: number; recruitStartAt: string; recruitEndAt: string };
  content?: { contentStartAt: string; contentEndAt: string };
  reward?: { extraRewardPoint: number; paymentRewardPoint: number };
  description?: string;
  extensionRequested?: boolean;

  /** 참여/제출 옵션 (캠페인 수정 시 폼에 반영) */
  adultOnly?: boolean;
  allowReParticipation?: boolean;
  allowLateSubmission?: boolean;
}
