/* ========================================
   관리자(GA/SA) API 함수
   ======================================== */

/**
 * admin API
 *
 * 목적: 관리자 관련 API 함수 (apiClient → json-server 또는 실제 백엔드)
 *
 * mock 라우팅 (mock/routes.json):
 * - /admin/reviewer    → /reviewers
 * - /admin/partner     → /partners
 * - /admin/rejection   → /rejection_history
 * - /admin/report      → /report_history
 * - /admin/campaign    → /campaigns
 * - /admin/dashboard   → /admin_dashboard
 *
 * 사용 훅:
 * - hooks/manager/ga/useAdminReviewers.ts
 * - hooks/manager/ga/useAdminPartners.ts
 * - hooks/manager/ga/useAdminRejections.ts
 * - hooks/manager/ga/useAdminReports.ts
 * - hooks/manager/ga/useAdminCampaigns.ts
 * - hooks/manager/ga/useAdminDashboard.ts
 */

import { apiClient } from "@/lib/api/client";
import type {
  AdminReviewerApiItem,
  AdminPartnerApiItem,
  AdminRejectionApiItem,
  AdminReportApiItem,
  AdminCampaignApiItem,
  AdminDashboardApiItem,
  AdminWithdrawalApiItem,
  AdminPaymentApiItem,
} from "@/types/api/admin";
import type { UnifiedAccount, AccountType } from "@/data/login/unifiedAccountData";

const asArray = <T>(data: unknown): T[] => (Array.isArray(data) ? (data as T[]) : []);

/** 리뷰어 목록 조회  GET /admin/reviewer */
export const fetchAdminReviewers = (): Promise<AdminReviewerApiItem[]> =>
  apiClient
    .get<AdminReviewerApiItem[]>("/admin/reviewer")
    .then((res) => asArray<AdminReviewerApiItem>(res.data));

/** 파트너 목록 조회  GET /admin/partner */
export const fetchAdminPartners = (): Promise<AdminPartnerApiItem[]> =>
  apiClient
    .get<AdminPartnerApiItem[]>("/admin/partner")
    .then((res) => asArray<AdminPartnerApiItem>(res.data));

/** 반려 내역 조회  GET /admin/rejection */
export const fetchAdminRejections = (): Promise<AdminRejectionApiItem[]> =>
  apiClient
    .get<AdminRejectionApiItem[]>("/admin/rejection")
    .then((res) => asArray<AdminRejectionApiItem>(res.data));

/** 신고 내역 조회  GET /admin/report */
export const fetchAdminReports = (): Promise<AdminReportApiItem[]> =>
  apiClient
    .get<AdminReportApiItem[]>("/admin/report")
    .then((res) => asArray<AdminReportApiItem>(res.data));

/** 캠페인 현황 조회  GET /admin/campaign */
export const fetchAdminCampaigns = (): Promise<AdminCampaignApiItem[]> =>
  apiClient
    .get<AdminCampaignApiItem[]>("/admin/campaign")
    .then((res) => asArray<AdminCampaignApiItem>(res.data));

/** 출금 요청 목록 조회  GET /admin/withdrawal */
export const fetchAdminWithdrawal = (): Promise<AdminWithdrawalApiItem[]> =>
  apiClient
    .get<AdminWithdrawalApiItem[]>("/admin/withdrawal")
    .then((res) => asArray<AdminWithdrawalApiItem>(res.data));

/** 결제 내역 목록 조회  GET /admin/payment */
export const fetchAdminPayments = (): Promise<AdminPaymentApiItem[]> =>
  apiClient
    .get<AdminPaymentApiItem[]>("/admin/payment")
    .then((res) => asArray<AdminPaymentApiItem>(res.data));

/** 대시보드 통계 조회  GET /admin/dashboard */
export const fetchAdminDashboard = (): Promise<AdminDashboardApiItem | null> =>
  apiClient
    .get<AdminDashboardApiItem[]>("/admin/dashboard")
    .then((res) => (Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : null));

/**
 * 커뮤니티 게시글 삭제
 * DELETE /admin/community/:id → /community_posts/:id
 */
export const deleteAdminCommunityPost = (id: number | string): Promise<void> =>
  apiClient.delete(`/admin/community/${id}`).then(() => undefined);

const ACCOUNT_TYPE_PRIORITY: Record<string, number> = {
  partner: 4,
  admin_ga: 3,
  admin_sa: 2,
  user: 1,
};

/**
 * 전화번호로 계정 찾기 (아이디/비밀번호 찾기용)  GET /admin/accounts
 * allowedTypes 미지정 시 전체 타입 검색
 */
export const fetchAccountByPhone = async (
  phone: string,
  allowedTypes?: AccountType[]
): Promise<UnifiedAccount | undefined> => {
  const res = await apiClient.get<UnifiedAccount[]>("/admin/accounts");
  const accounts = asArray<UnifiedAccount>(res.data);
  const normalize = (p: string) => p.replace(/-/g, "");
  const inputPhone = normalize(phone);

  const matched = accounts
    .filter((acc) => normalize(acc.phone) === inputPhone)
    .filter((acc) => !allowedTypes || allowedTypes.includes(acc.userType as AccountType));

  return matched.sort(
    (a, b) => (ACCOUNT_TYPE_PRIORITY[b.userType] ?? 0) - (ACCOUNT_TYPE_PRIORITY[a.userType] ?? 0)
  )[0];
};
