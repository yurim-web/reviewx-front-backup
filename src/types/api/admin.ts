/* ========================================
   관리자(GA/SA) API 타입 정의
   ======================================== */

/**
 * admin API types
 *
 * 목적: 관리자 관련 API 응답 타입 정의 (mock json-server 기준)
 *
 * 사용 파일:
 * - src/lib/api/admin.ts
 * - src/hooks/manager/ga/useAdminReviewers.ts
 * - src/hooks/manager/ga/useAdminPartners.ts
 * - src/hooks/manager/ga/useAdminRejections.ts
 * - src/hooks/manager/ga/useAdminReports.ts
 * - src/hooks/manager/ga/useAdminCampaigns.ts
 * - src/hooks/manager/ga/useAdminDashboard.ts
 */

// ----------------------------------------
// 리뷰어 목록
// ----------------------------------------
export interface AdminReviewerApiItem {
  id: number;
  number: string;
  name: string;
  nickname: string;
  gender: string;
  age: number;
  email: string;
  phone: string;
  address: string;
  channels: string[];
  type: string;
  campaign_participated: number;
  campaign_completed: number;
  current_points: number;
  withdrawn_points: number;
  status_type: string;
  status: string;
  penalty_count: number;
  bank: string;
  account_holder: string;
  last_access_date: string;
  join_date: string;
}

// ----------------------------------------
// 파트너 목록
// ----------------------------------------
export interface AdminPartnerApiItem {
  id: number;
  number: string;
  business_name: string;
  business_number: string;
  representative_name: string;
  division: string;
  email: string;
  phone: string;
  address: string;
  contact_name: string;
  contact_phone: string;
  campaign_in_progress: number;
  campaign_completed: number;
  current_points: number;
  used_points: number;
  status_type: string;
  status: string;
  penalty_count: number;
  last_access_date: string;
  join_date: string;
}

// ----------------------------------------
// 반려 내역
// ----------------------------------------
export interface AdminRejectionApiItem {
  id: number;
  campaign_number: string;
  campaign_name: string;
  reject_code: string;
  reject_reason: string;
  inspector: string;
  target: string;
  processed_date: string;
  reject_count: number;
}

// ----------------------------------------
// 신고 내역
// ----------------------------------------
export interface AdminReportApiItem {
  id: number;
  campaign_number: string;
  campaign_name: string;
  report_code: string;
  report_reason: string;
  inspector: string;
  target: string;
  processed_date: string;
  report_count: number;
}

// ----------------------------------------
// 캠페인 현황 (progress)
// ----------------------------------------
export interface AdminCampaignApiItem {
  id: number;
  type: string;
  status: string;
  title: string;
  thumbnailUrl: string;
  category: { categoryId: number; categoryName: string };
  requiredPlatform: { channelId: number; channelName: string };
  recruitLimit: number;
  appliedCount: number;
  recruitStartAt?: string;
  recruitEndAt?: string;
  recruit?: { recruitLimit: number; recruitStartAt: string; recruitEndAt: string };
  selectAt?: string;
  content: { contentStartAt: string; contentEndAt: string };
  reward: { extraRewardPoint: number; paymentRewardPoint: number };
  description?: string;
  selectedCount?: number;
  metrics?: { appliedCount: number; selectedCount: number; applicationRate: number };
}

// ----------------------------------------
// 출금 요청 (SA 정산)
// ----------------------------------------
export interface AdminWithdrawalApiItem {
  id: number;
  reviewer_id: number;
  user_name: string;
  requested_amount: number;
  net_amount: number;
  tax_amount: number;
  bank: string;
  account_number: string;
  account_holder: string;
  status: string; // PENDING | APPROVED | REJECTED
  request_date: string; // ISO 8601
  processed_date: string | null;
}

// ----------------------------------------
// 결제 내역 (SA 정산)
// ----------------------------------------
export interface AdminPaymentApiItem {
  id: number;
  partner_id: number;
  amount: number;
  payment_method: string; // CARD | TRANSFER
  status: string; // COMPLETED | PENDING | CANCELLED
  paid_at: string; // ISO 8601
  points_charged: number;
}

// ----------------------------------------
// 이용제한(차단) 목록
// ----------------------------------------
export interface AdminBlacklistApiItem {
  id: string;
  name: string;
  user_id: string;
  division: string;
  current_points: number;
  ip_address: string;
  block_code: string;
  block_reason: string;
  registered_date: string;
  registered_by: string;
}

// ----------------------------------------
// 관리자 목록 (SA 전용)
// ----------------------------------------
export interface AdminMemberApiItem {
  id: string;
  number: string;
  name: string;
  phone: string;
  report_count: number;
  block_count: number;
  last_access_date: string;
  join_date: string;
  status: string;
}

// ----------------------------------------
// 출금 요청 목록 (SA 정산 - 새 엔드포인트)
// ----------------------------------------
export interface AdminWithdrawalRequestItem {
  id: string;
  number: string;
  round: string;
  name: string;
  account: string;
  ssn: string;
  amount: string;
  remaining: string;
  requestDate: string;
  type: string;
  status: string;
}

// ----------------------------------------
// 캠페인 신청자 (진행현황 상세)
// ----------------------------------------
export interface CampaignApplicationApiItem {
  id: number;
  campaign_id: number;
  reviewer_id: number;
  /** PENDING | SELECTED */
  status: string;
  apply_date: string;
  channel_url: string;
  follower_count: number;
  introduction: string;
}

// ----------------------------------------
// 대시보드
// ----------------------------------------
export interface AdminDashboardApiItem {
  id: number;
  date: string;
  total_reviewers: number;
  total_partners: number;
  active_campaigns: number;
  total_campaigns: number;
  pending_withdrawals: number;
  pending_withdrawals_amount: number;
  total_points_paid: number;
  new_reviewers_today: number;
  new_partners_today: number;
  monthly_active_reviewers: number;
  monthly_new_reviewers: number;
  dormant_reviewers: number;
  monthly_active_partners: number;
  monthly_new_partners: number;
  dormant_partners: number;
  rejection_total: number;
  report_total: number;
}
