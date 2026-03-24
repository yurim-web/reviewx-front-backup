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
 * - hooks/manager/common/member/useReviewerDetailData.ts
 * - hooks/manager/common/member/usePartnerDetailData.ts
 */

import { apiClient } from "@/lib/api/client";
import type {
  AdminReviewerApiItem,
  AdminPartnerApiItem,
  AdminRejectionApiItem,
  AdminReportApiItem,
  AdminCampaignApiItem,
  AdminCampaignListItem,
  AdminCampaignListParams,
  AdminCampaignSummaryResponse,
  ReportCampaignRequest,
  AdminDashboardApiItem,
  AdminDashboardResponse,
  AdminDashboardParams,
  AdminWithdrawalApiItem,
  AdminPaymentApiItem,
  AdminBlacklistApiItem,
  AdminMemberApiItem,
  AdminWithdrawalRequestItem,
  CampaignApplicationApiItem,
  RejectedListParams,
  RejectedListResponse,
  ReportCodesResponse,
  ReportStatsParams,
  ReportStatsResponse,
  ReportListParams,
  ReportListResponse,
  BlockedListParams,
  BlockedListResponse,
  ReviewerListParams,
  ReviewerListResponse,
  ReviewerStatsResponse,
  ReviewerDetailResponse,
  ReviewerCampaignsResponse,
  ReviewerPenaltiesResponse,
  PartnerListParams,
  PartnerListResponse,
  PartnerStatsResponse,
  PartnerDetailResponse,
  PartnerCampaignsResponse,
  PartnerPenaltiesResponse,
} from "@/types/api/admin";
import type { UnifiedAccount, AccountType } from "@/data/login/unifiedAccountData";

const asArray = <T>(data: unknown): T[] => (Array.isArray(data) ? (data as T[]) : []);

/** @deprecated 기존 mock 호환 — getReviewerList 사용 */
export const fetchAdminReviewers = (): Promise<AdminReviewerApiItem[]> =>
  apiClient
    .get<AdminReviewerApiItem[]>("/admin/reviewer")
    .then((res) => asArray<AdminReviewerApiItem>(res.data));

/** @deprecated 기존 mock 호환 — getReviewerDetail 사용 */
export const fetchAdminReviewerDetail = (id: number): Promise<AdminReviewerApiItem> =>
  apiClient.get<AdminReviewerApiItem>(`/admin/reviewer/${id}`).then((res) => res.data);

/**
 * GA-06: 리뷰어 목록 조회
 * GET /api/admin/reviewers
 */
export const getReviewerList = async (
  params?: ReviewerListParams
): Promise<ReviewerListResponse> => {
  const { data } = await apiClient.get<ReviewerListResponse>("/api/admin/reviewers", { params });
  return data;
};

/**
 * GA-06: 리뷰어 통계 조회
 * GET /api/admin/reviewers/stats
 */
export const getReviewerStats = async (): Promise<ReviewerStatsResponse> => {
  const { data } = await apiClient.get<ReviewerStatsResponse>("/api/admin/reviewers/stats");
  return data;
};

/**
 * GA-07: 리뷰어 상세 조회
 * GET /api/admin/reviewers/{reviewerId}
 */
export const getReviewerDetail = async (reviewerId: number): Promise<ReviewerDetailResponse> => {
  const { data } = await apiClient.get<ReviewerDetailResponse>(
    `/api/admin/reviewers/${reviewerId}`
  );
  return data;
};

/**
 * GA-07: 리뷰어 캠페인 진행 내역
 * GET /api/admin/reviewers/{reviewerId}/campaigns
 */
export const getReviewerCampaigns = async (
  reviewerId: number
): Promise<ReviewerCampaignsResponse> => {
  const { data } = await apiClient.get<ReviewerCampaignsResponse>(
    `/api/admin/reviewers/${reviewerId}/campaigns`
  );
  return data;
};

/**
 * GA-07: 리뷰어 패널티 내역
 * GET /api/admin/reviewers/{reviewerId}/penalties
 */
export const getReviewerPenalties = async (
  reviewerId: number
): Promise<ReviewerPenaltiesResponse> => {
  const { data } = await apiClient.get<ReviewerPenaltiesResponse>(
    `/api/admin/reviewers/${reviewerId}/penalties`
  );
  return data;
};

/** @deprecated 기존 mock 호환 — getPartnerList 사용 */
export const fetchAdminPartners = (): Promise<AdminPartnerApiItem[]> =>
  apiClient
    .get<AdminPartnerApiItem[]>("/admin/partner")
    .then((res) => asArray<AdminPartnerApiItem>(res.data));

/** @deprecated 기존 mock 호환 — getPartnerDetail 사용 */
export const fetchAdminPartnerDetail = (id: number): Promise<AdminPartnerApiItem> =>
  apiClient.get<AdminPartnerApiItem>(`/admin/partner/${id}`).then((res) => res.data);

/**
 * GA-08: 파트너 목록 조회
 * GET /api/admin/partners
 */
export const getPartnerList = async (params?: PartnerListParams): Promise<PartnerListResponse> => {
  const { data } = await apiClient.get<PartnerListResponse>("/api/admin/partners", { params });
  return data;
};

/**
 * GA-08: 파트너 통계 조회
 * GET /api/admin/partners/stats
 */
export const getPartnerStats = async (): Promise<PartnerStatsResponse> => {
  const { data } = await apiClient.get<PartnerStatsResponse>("/api/admin/partners/stats");
  return data;
};

/**
 * GA-09: 파트너 상세 조회
 * GET /api/admin/partners/{partnerId}
 */
export const getPartnerDetail = async (partnerId: number): Promise<PartnerDetailResponse> => {
  const { data } = await apiClient.get<PartnerDetailResponse>(`/api/admin/partners/${partnerId}`);
  return data;
};

/**
 * GA-09: 파트너 캠페인 진행 내역
 * GET /api/admin/partners/{partnerId}/campaigns
 */
export const getPartnerCampaigns = async (partnerId: number): Promise<PartnerCampaignsResponse> => {
  const { data } = await apiClient.get<PartnerCampaignsResponse>(
    `/api/admin/partners/${partnerId}/campaigns`
  );
  return data;
};

/**
 * GA-09: 파트너 패널티 내역
 * GET /api/admin/partners/{partnerId}/penalties
 */
export const getPartnerPenalties = async (partnerId: number): Promise<PartnerPenaltiesResponse> => {
  const { data } = await apiClient.get<PartnerPenaltiesResponse>(
    `/api/admin/partners/${partnerId}/penalties`
  );
  return data;
};

/** @deprecated 기존 mock 호환 — getRejectedCampaigns 사용 */
export const fetchAdminRejections = (): Promise<AdminRejectionApiItem[]> =>
  apiClient
    .get<AdminRejectionApiItem[]>("/admin/rejection")
    .then((res) => asArray<AdminRejectionApiItem>(res.data));

/**
 * GA-03: 캠페인 반려내역 조회
 * GET /api/admin/campaigns/rejected
 */
export const getRejectedCampaigns = async (
  params?: RejectedListParams
): Promise<RejectedListResponse> => {
  const { data } = await apiClient.get<RejectedListResponse>("/api/admin/campaigns/rejected", {
    params,
  });
  return data;
};

/**
 * GA-03: 반려 코드 업데이트
 * PUT /api/admin/campaigns/rejected/{rejectId}/code
 */
export const updateRejectCode = async (
  rejectId: number,
  body: { rejectCode?: string; adminMemo?: string }
): Promise<void> => {
  await apiClient.put(`/api/admin/campaigns/rejected/${rejectId}/code`, body);
};

/**
 * GA-03: 반려 건 신고 처리
 * POST /api/admin/campaigns/rejected/{rejectId}/report
 */
export const reportRejectedItem = async (
  rejectId: number,
  body: { reportCode: string; reportReason?: string }
): Promise<void> => {
  await apiClient.post(`/api/admin/campaigns/rejected/${rejectId}/report`, body);
};

/** @deprecated 기존 mock 호환 — getReportCodes/getReportStats/getReportList 사용 */
export const fetchAdminReports = (): Promise<AdminReportApiItem[]> =>
  apiClient
    .get<AdminReportApiItem[]>("/admin/report")
    .then((res) => asArray<AdminReportApiItem>(res.data));

/**
 * GA-04: 신고 코드 목록 조회
 * GET /api/admin/reports/codes
 */
export const getReportCodes = async (): Promise<ReportCodesResponse["data"]["codes"]> => {
  const { data } = await apiClient.get<ReportCodesResponse>("/api/admin/reports/codes");
  return data?.data?.codes ?? [];
};

/**
 * GA-04: 신고 통계 조회
 * GET /api/admin/reports/stats
 */
export const getReportStats = async (
  params?: ReportStatsParams
): Promise<ReportStatsResponse["data"]["stats"]> => {
  const { data } = await apiClient.get<ReportStatsResponse>("/api/admin/reports/stats", { params });
  return data?.data?.stats ?? [];
};

/**
 * GA-04: 신고 내역 목록 조회
 * GET /api/admin/reports
 */
export const getReportList = async (
  params?: ReportListParams
): Promise<ReportListResponse["data"]["reports"]> => {
  const { data } = await apiClient.get<ReportListResponse>("/api/admin/reports", { params });
  return data?.data?.reports ?? [];
};

/** 캠페인 현황 목록 조회  GET /api/admin/campaigns */
export const fetchAdminCampaigns = async (
  params?: AdminCampaignListParams
): Promise<AdminCampaignListItem[]> => {
  const { data } = await apiClient.get<{
    result: string;
    data: { campaigns: AdminCampaignListItem[] };
  }>("/api/admin/campaigns", { params });
  // 백엔드 래핑: { result, data: { campaigns } } 또는 mock 직접 배열
  const campaigns = data?.data?.campaigns;
  if (Array.isArray(campaigns)) return campaigns;
  if (Array.isArray(data)) return data as unknown as AdminCampaignListItem[];
  return [];
};

/** 캠페인 통계 요약 조회  GET /api/admin/campaigns/summary */
export const fetchAdminCampaignsSummary = async (
  params?: Pick<AdminCampaignListParams, "startDate" | "endDate">
): Promise<AdminCampaignSummaryResponse["data"]["campaignSummary"]> => {
  const { data } = await apiClient.get<AdminCampaignSummaryResponse>(
    "/api/admin/campaigns/summary",
    { params }
  );
  return (
    data?.data?.campaignSummary ?? {
      total: 0,
      scheduled: 0,
      recruiting: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0,
    }
  );
};

/** 캠페인 신고 처리  POST /api/admin/campaigns/{campaign_id}/report */
export const reportAdminCampaign = async (
  campaignId: number,
  body: ReportCampaignRequest
): Promise<void> => {
  await apiClient.post(`/api/admin/campaigns/${campaignId}/report`, body);
};

/** 캠페인 상세 조회  GET /admin/campaign/:id → /campaigns/:id */
export const fetchAdminCampaignDetail = (id: string): Promise<AdminCampaignApiItem> =>
  apiClient.get<AdminCampaignApiItem>(`/admin/campaign/${id}`).then((res) => res.data);

/** 캠페인 신청자 목록 조회  GET /partner/campaign/:id/applications → /campaign_applications?campaign_id=:id */
export const fetchCampaignApplications = (
  campaignId: string
): Promise<CampaignApplicationApiItem[]> =>
  apiClient
    .get<CampaignApplicationApiItem[]>(`/partner/campaign/${campaignId}/applications`)
    .then((res) => asArray<CampaignApplicationApiItem>(res.data))
    .catch((error) => {
      console.error("fetchCampaignApplications failed:", error);
      return [];
    });

/** 리뷰어별 캠페인 신청 목록 조회  GET /campaign_applications?reviewer_id=:id */
export const fetchReviewerApplications = (
  reviewerId: number
): Promise<CampaignApplicationApiItem[]> =>
  apiClient
    .get<CampaignApplicationApiItem[]>(`/campaign_applications?reviewer_id=${reviewerId}`)
    .then((res) => asArray<CampaignApplicationApiItem>(res.data))
    .catch((error) => {
      console.error("fetchReviewerApplications failed:", error);
      return [];
    });

/** 캠페인 상세 조회 (단건)  GET /campaigns/:id */
export const fetchCampaignDetail = (campaignId: number): Promise<AdminCampaignApiItem> =>
  apiClient.get<AdminCampaignApiItem>(`/campaigns/${campaignId}`).then((res) => res.data);

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

/** @deprecated 기존 mock 호환 — getAdminDashboardStats 사용 */
export const fetchAdminDashboard = (): Promise<AdminDashboardApiItem | null> =>
  apiClient
    .get<AdminDashboardApiItem[]>("/admin/dashboard")
    .then((res) => (Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : null));

/**
 * GA-01: 대시보드 통계 데이터 조회
 * GET /api/admin/dashboard?period=&startDate=&endDate=
 */
export const getAdminDashboardStats = async (
  params?: AdminDashboardParams
): Promise<AdminDashboardResponse> => {
  const { data } = await apiClient.get<AdminDashboardResponse>("/api/admin/dashboard", { params });
  return data;
};

/**
 * 커뮤니티 게시글 삭제
 * DELETE /admin/community/:id → /community_posts/:id
 */
export const deleteAdminCommunityPost = (id: number | string): Promise<void> =>
  apiClient.delete(`/admin/community/${id}`).then(() => undefined);

/** @deprecated 기존 mock 호환 — getBlockedList 사용 */
export const fetchAdminBlacklist = (): Promise<AdminBlacklistApiItem[]> =>
  apiClient
    .get<AdminBlacklistApiItem[]>("/admin/blacklist")
    .then((res) => asArray<AdminBlacklistApiItem>(res.data));

/**
 * GA-05: 이용 제한 목록 조회
 * GET /api/admin/users/blocked
 */
export const getBlockedList = async (params?: BlockedListParams): Promise<BlockedListResponse> => {
  const { data } = await apiClient.get<BlockedListResponse>("/api/admin/users/blocked", { params });
  return data;
};

/**
 * GA-04/05: 이용 제한 등록 (차단)
 * POST /api/admin/users/{userId}/block
 */
export const blockUser = async (
  userId: number,
  body: { blockCode: string; blockReason: string }
): Promise<void> => {
  await apiClient.post(`/api/admin/users/${userId}/block`, body);
};

/**
 * GA-04/05: 이용 제한 해제
 * DELETE /api/admin/users/{userId}/block
 */
export const unblockUser = async (userId: number): Promise<void> => {
  await apiClient.delete(`/api/admin/users/${userId}/block`);
};

/** 관리자 목록 조회  GET /admin/member/admins */
export const fetchAdminMembers = (): Promise<AdminMemberApiItem[]> =>
  apiClient
    .get<AdminMemberApiItem[]>("/admin/member/admins")
    .then((res) => asArray<AdminMemberApiItem>(res.data));

/** 관리자 등록  POST /admin/member/admins */
export const createAdminMember = (
  data: Omit<AdminMemberApiItem, "report_count" | "block_count" | "last_access_date" | "join_date">
): Promise<AdminMemberApiItem> =>
  apiClient
    .post<AdminMemberApiItem>("/admin/member/admins", {
      ...data,
      report_count: 0,
      block_count: 0,
      last_access_date: new Date().toISOString().slice(0, 16).replace("T", " "),
      join_date: new Date().toISOString().slice(0, 16).replace("T", " "),
    })
    .then((res) => res.data);

/** 관리자 수정  PUT /admin/member/admins/:id */
export const updateAdminMember = (
  id: string,
  data: Partial<AdminMemberApiItem>
): Promise<AdminMemberApiItem> =>
  apiClient.patch<AdminMemberApiItem>(`/admin/member/admins/${id}`, data).then((res) => res.data);

/** 관리자 삭제  DELETE /admin/member/admins/:id */
export const deleteAdminMember = (id: string): Promise<void> =>
  apiClient.delete(`/admin/member/admins/${id}`).then(() => undefined);

/** 출금 요청 목록 조회  GET /admin/withdrawal/requests */
export const fetchAdminWithdrawalRequests = (): Promise<AdminWithdrawalRequestItem[]> =>
  apiClient
    .get<AdminWithdrawalRequestItem[]>("/admin/withdrawal/requests")
    .then((res) => asArray<AdminWithdrawalRequestItem>(res.data));

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
