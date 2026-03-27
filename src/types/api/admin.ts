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
// 리뷰어 목록 — mock 호환용 (deprecated)
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
  account_number?: string;
  ssn_front?: string;
  ssn_back?: string;
  last_access_date: string;
  join_date: string;
}

// ----------------------------------------
// 리뷰어 목록 — 실제 백엔드 API (GA-06)
// ----------------------------------------

/** GET /api/admin/reviewers 조회 파라미터 */
export interface ReviewerListParams {
  keyword?: string;
  channel?: string;
  division?: string;
  type?: string;
  status?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

/** GET /api/admin/reviewers 목록 항목 */
export interface ReviewerListApiItem {
  userId: number;
  nickname: string;
  channels: string[];
  division: string;
  lastLoginAt: string;
  createdAt: string;
  campaignParticipated: number;
  campaignCompleted: number;
  holdingPoint: number;
  withdrawalPoint: number;
  memberType: string;
  status: string;
}

/** GET /api/admin/reviewers 전체 응답 */
export interface ReviewerListResponse {
  result: string;
  generatedAt: string;
  data: {
    totalCount: number;
    reviewers: ReviewerListApiItem[];
  };
}

/** GET /api/admin/reviewers/stats 통계 응답 */
export interface ReviewerStatsResponse {
  result: string;
  generatedAt: string;
  data: {
    monthlyNew: number;
    total: number;
    monthlyActive: number;
    dormant: number;
  };
}

// ----------------------------------------
// 리뷰어 상세 — 실제 백엔드 API (GA-07)
// ----------------------------------------

/** GET /api/admin/reviewers/{id} 상세 응답 */
export interface ReviewerDetailResponse {
  result: string;
  generatedAt: string;
  data: {
    basicInfo: {
      userId: number;
      reviewerId: number;
      status: string;
      profileImageUrl: string | null;
      nickname: string;
      name: string;
      gender: string;
      age: number;
      email: string;
      phoneNum: string;
      address: string;
    };
    activityInfo: {
      campaignInProgress: number;
      campaignCompleted: number;
      penaltyCount: number;
      lastLoginAt: string;
      createdAt: string;
      pointBalance: number;
      pointWithdrawn: number;
    };
    channelInfo: {
      channelId: number;
      channelName: string;
      externalId: string;
      channelUrl: string;
      followers: number | null;
      dailyVisitors: number | null;
    }[];
    bankAccountInfo: {
      bankName: string;
      accountNumber: string;
      accountHolder: string;
      ssnMasked: string;
    };
  };
}

/** GET /api/admin/reviewers/{id}/campaigns 캠페인 내역 항목 */
export interface ReviewerCampaignApiItem {
  campaignId: number;
  campaignTitle: string;
  status: string;
  type: string;
  channel: string;
  rewardPoint: number;
}

/** GET /api/admin/reviewers/{id}/campaigns 전체 응답 */
export interface ReviewerCampaignsResponse {
  result: string;
  generatedAt: string;
  data: {
    totalCount: number;
    campaigns: ReviewerCampaignApiItem[];
  };
}

/** GET /api/admin/reviewers/{id}/penalties 패널티 항목 */
export interface ReviewerPenaltyApiItem {
  penaltyHistoryId: number;
  penaltyCode: string;
  penaltyReason: string;
  penaltyScore: number;
  imposeType: string;
  createdAt: string;
  currentStatus: string;
}

/** GET /api/admin/reviewers/{id}/penalties 전체 응답 */
export interface ReviewerPenaltiesResponse {
  result: string;
  generatedAt: string;
  data: {
    totalCount: number;
    penalties: ReviewerPenaltyApiItem[];
  };
}

// ----------------------------------------
// 파트너 목록
// ----------------------------------------
// 파트너 목록 — mock 호환용 (deprecated)
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
// 파트너 목록 — 실제 백엔드 API (GA-08)
// ----------------------------------------

/** GET /api/admin/partners 조회 파라미터 */
export interface PartnerListParams {
  keyword?: string;
  businessType?: string;
  grade?: string;
  status?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

/** GET /api/admin/partners 목록 항목 */
export interface PartnerListApiItem {
  partnerId: number;
  userId: number;
  businessName: string;
  ceoName: string;
  businessType: string;
  businessNumber: string;
  email: string;
  phoneNum: string;
  grade: string;
  status: string;
  campaignCount: number;
  penaltyCount: number;
  createdAt: string;
  lastLoginAt: string;
}

/** GET /api/admin/partners 전체 응답 */
export interface PartnerListResponse {
  result: string;
  generatedAt: string;
  data: {
    totalCount: number;
    partners: PartnerListApiItem[];
  };
}

/** GET /api/admin/partners/stats 통계 응답 */
export interface PartnerStatsResponse {
  result: string;
  generatedAt: string;
  data: {
    monthlyNew: number;
    total: number;
    monthlyActive: number;
    dormant: number;
  };
}

// ----------------------------------------
// 파트너 상세 — 실제 백엔드 API (GA-09)
// ----------------------------------------

/** GET /api/admin/partners/{id} 상세 응답 */
export interface PartnerDetailResponse {
  result: string;
  generatedAt: string;
  data: {
    basicInfo: {
      userId: number;
      partnerId: number;
      status: string;
      profileImageUrl: string | null;
      businessName: string;
      businessType: string;
      email: string;
      phoneNum: string;
      address: string;
    };
    activityInfo: {
      campaignInProgress: number;
      campaignCompleted: number;
      penaltyCount: number;
      lastLoginAt: string;
      createdAt: string;
      pointBalance: number;
      pointPaid: number;
    };
    businessInfo: {
      businessName: string;
      ceoName: string;
      businessNumber: string;
      businessLicenseUrl: string | null;
    };
    contactInfo: {
      csNumber: string;
    };
  };
}

/** GET /api/admin/partners/{id}/campaigns 캠페인 내역 항목 */
export interface PartnerCampaignApiItem {
  campaignId: number;
  campaignTitle: string;
  status: string;
  type: string;
  channel: string;
  rewardPoint: number;
}

/** GET /api/admin/partners/{id}/campaigns 전체 응답 */
export interface PartnerCampaignsResponse {
  result: string;
  generatedAt: string;
  data: {
    totalCount: number;
    campaigns: PartnerCampaignApiItem[];
  };
}

/** GET /api/admin/partners/{id}/penalties 패널티 항목 */
export interface PartnerPenaltyApiItem {
  penaltyHistoryId: number;
  penaltyCode: string;
  penaltyReason: string;
  penaltyScore: number;
  imposeType: string;
  createdAt: string;
  currentStatus: string;
}

/** GET /api/admin/partners/{id}/penalties 전체 응답 */
export interface PartnerPenaltiesResponse {
  result: string;
  generatedAt: string;
  data: {
    totalCount: number;
    penalties: PartnerPenaltyApiItem[];
  };
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
// 신고 내역 (mock 호환용 — deprecated)
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
// 신고 내역 — 실제 백엔드 API 응답 (GA-04)
// ----------------------------------------

/** GET /api/admin/reports/codes 신고 코드 목록 응답 항목 */
export interface ReportCodeApiItem {
  code: string; // W001~W013
  targetType: string; // REVIEWER | PARTNER | SYSTEM | ETC
  label: string; // 선정 후 취소 등
}

/** GET /api/admin/reports/codes 전체 응답 */
export interface ReportCodesResponse {
  result: string;
  data: {
    codes: ReportCodeApiItem[];
  };
}

/** GET /api/admin/reports/stats 조회 파라미터 */
export interface ReportStatsParams {
  startDate?: string; // yyyy-MM-dd
  endDate?: string; // yyyy-MM-dd
}

/** GET /api/admin/reports/stats 통계 항목 */
export interface ReportStatApiItem {
  code: string; // W001~W013
  count: number;
}

/** GET /api/admin/reports/stats 전체 응답 */
export interface ReportStatsResponse {
  result: string;
  data: {
    stats: ReportStatApiItem[];
  };
}

/** GET /api/admin/reports 조회 파라미터 */
export interface ReportListParams {
  startDate?: string; // yyyy-MM-dd
  endDate?: string; // yyyy-MM-dd
  reportCode?: string; // W001~W013
  keyword?: string; // 캠페인명/대상자명 검색
  sort?: string; // processedAt | reportCount
  order?: string; // asc | desc
}

/** GET /api/admin/reports 신고 내역 항목 */
export interface ReportListApiItem {
  reportNumber: string; // 신고번호
  campaignTitle: string; // 캠페인명
  targetName: string; // 대상자
  targetType: string; // REVIEWER | PARTNER
  targetUserId?: number; // 대상자 유저 ID (차단/해제용)
  inspector: string; // 검수자
  inspectorType: string; // PARTNER | ADMIN | AI
  reportCode: string; // W001~W013
  reportCodeLabel: string; // 선정 후 취소 등
  reportCount: number; // 누적 신고 횟수
  processedAt: string; // ISO 8601
}

/** GET /api/admin/reports 전체 응답 */
export interface ReportListResponse {
  result: string;
  data: {
    reports: ReportListApiItem[];
  };
}

// ----------------------------------------
// 캠페인 현황 (progress) — 실제 백엔드 API 응답
// ----------------------------------------

/** GET /api/admin/campaigns 목록 조회 파라미터 */
export interface AdminCampaignListParams {
  startDate?: string; // yyyy-MM-dd
  endDate?: string; // yyyy-MM-dd
  status?: string; // REGISTERING | RECRUITING | SELECTING | PURCHASING | EMERGENCY | CLOSED | CANCELLED
  type?: string; // DELIVERY | VISIT | PURCHASE | REPORTER | MISSION
  channel?: string; // BLOG | CLIP | INSTAGRAM | REELS | YOUTUBE | SHORTS
  keyword?: string; // 캠페인번호/파트너명/캠페인명 검색
}

/** GET /api/admin/campaigns 목록 응답 항목 */
export interface AdminCampaignListItem {
  campaignId: number;
  campaignNumber: string; // "004015" (6자리 zero-padding)
  partnerId: number;
  partnerName: string;
  title: string;
  type: string; // DELIVERY | VISIT | PURCHASE | REPORTER | MISSION
  typeLabel: string; // 배송형 | 방문형 | 구매평 | 기자단 | 미션형
  platformIconUrl: string;
  status: string; // REGISTERING | RECRUITING | SELECTING | PURCHASING | EMERGENCY | CLOSED | CANCELLED
  statusLabel: string; // 예정 | 신청 | 진행 | 종료 | 취소
  appliedCount: number;
  recruitLimit: number;
  rewardPoint: number;
  recruitStartAt: string; // ISO 8601
  recruitEndAt: string; // ISO 8601
}

/** GET /api/admin/campaigns/summary 통계 응답 */
export interface AdminCampaignSummaryResponse {
  result: string;
  generatedAt: string;
  data: {
    campaignSummary: {
      total: number;
      scheduled: number;
      recruiting: number;
      inProgress: number;
      completed: number;
      cancelled: number;
    };
  };
}

/** POST /api/admin/campaigns/{campaign_id}/report 신고 요청 */
export interface ReportCampaignRequest {
  reportCode: string; // W001~W013
  reportReason?: string; // 상세 사유 (선택)
}

/** 캠페인 상세 조회용 (mock — 백엔드 상세 엔드포인트 미확정) */
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
  partner_id?: number;
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
  ssn?: string; // 주민등록번호 (마스킹 처리)
  round?: number; // 출금 회차
  remaining_amount?: number; // 잔여 포인트
  status: string; // PENDING | APPROVED | REJECTED | URGENT
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
// 이용제한(차단) 목록 — mock 호환용 (deprecated)
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
  status?: string; // ACTIVE | BLOCKED | PAUSED | WITHDRAW
}

// ----------------------------------------
// 이용제한(차단) 목록 — 실제 백엔드 API (GA-05)
// ----------------------------------------

export type BlockCode =
  | "B001"
  | "B002"
  | "B003"
  | "B004"
  | "B005"
  | "B006"
  | "B007"
  | "B008"
  | "B009"
  | "B010";

export type MemberDivision = "reviewer" | "partner" | "admin";

export interface BlockedListParams {
  startDate?: string;
  endDate?: string;
  division?: MemberDivision;
  blockCode?: BlockCode;
  keyword?: string;
  page?: number;
  limit?: number;
  sort?: "created_at_desc" | "point_desc";
}

export interface BlockedItem {
  blockId: number;
  userId: number;
  name: string;
  businessName: string | null;
  division: MemberDivision;
  id: string;
  ip: string;
  point: number;
  blockCode: BlockCode;
  blockReason: string;
  createdAt: string;
  createdBy: string;
}

export interface BlockedListResponse {
  result: "OK";
  generatedAt: string;
  data: {
    totalCount: number;
    blockedList: BlockedItem[];
  };
}

// ----------------------------------------
// 이용제한(차단) 목록 — SA 백엔드 API
// ----------------------------------------

export interface SABlacklistParams {
  startDate?: string;
  endDate?: string;
  division?: string;
  blockCode?: string;
  keyword?: string;
  sortBy?: string;
  sortDirection?: string;
}

export interface SABlacklistItem {
  id: string;
  name: string;
  userId: string;
  division: string;
  currentPoints: number;
  ipAddress: string;
  blockCode: string;
  blockReason: string;
  registeredDate: string;
  registeredBy: string;
}

export interface SABlacklistResponse {
  result: string;
  generatedAt: string;
  totalCount: number;
  blacklist: SABlacklistItem[];
}

// ----------------------------------------
// 관리자 목록 (SA 전용 - 레거시 json-server용)
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
// 관리자 목록 (SA 전용 - 백엔드 API 연동)
// ----------------------------------------
export interface SAAdminListParams {
  status?: string;
  keyword?: string;
  page?: number;
  size?: number;
}

export interface SAAdminListResponse {
  result: string;
  generatedAt: string;
  totalCount: number;
  admins: SAAdminItem[];
}

export interface SAAdminItem {
  id: number;
  name: string;
  email: string;
  phone: string;
  adminLevel: string;
  reportCount: number;
  suspendCount: number;
  lastLoginAt: string;
  createdAt: string;
  status: string;
}

export interface SAAdminCreateParams {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  phone: string;
}

export interface SAAdminUpdateParams {
  name?: string;
  phone?: string;
  password?: string;
  passwordConfirm?: string;
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

// ── GET /api/admin/dashboard 응답 (GA-01) ──

export type DashboardPeriod = "today" | "week" | "month" | "custom";

export interface AdminDashboardParams {
  period?: DashboardPeriod;
  startDate?: string;
  endDate?: string;
}

export interface AdminDashboardResponse {
  result: "OK";
  generatedAt: string;
  campaignSummary: {
    recruitRate: number;
    recruitRateChange: number;
    achieveRate: number;
    achieveRateChange: number;
    rejectRate: number;
    rejectRateChange: number;
    reportRate: number;
    reportRateChange: number;
  };
  campaignStats: {
    total: number;
    registering: number;
    recruiting: number;
    selecting: number;
    purchasing: number;
    emergency: number;
    closed: number;
    cancelled: number;
    byType: Array<{ type: string; label: string; count: number }>;
    byCategory: Array<{
      category: string;
      recruitmentRate: number;
      achievementRate: number;
      averageDuration: number;
    }>;
  };
  rejectReportStats: {
    totalRejects: number;
    totalReports: number;
    rejectTrend: number;
    reportTrend: number;
  };
  accessStats: {
    totalAccess: number;
    totalAccessChange: number;
    inflowCount: number;
    inflowChange: number;
    pcRate: number;
    mobileRate: number;
    tabletRate: number;
    appRate: number;
  };
  memberStats: {
    total: number;
    totalChange: number;
    newMembers: number;
    newMembersChange: number;
    active: number;
    activeChange: number;
    dormant: number;
    dormantChange: number;
  };
  memberTypeStats: {
    reviewer: { total: number; newMembers: number; active: number; dormant: number };
    partner: { total: number; newMembers: number; active: number; dormant: number };
  };
  channelStats: {
    channels: Array<{ channelName: string; memberCount: number; percentage: number }>;
  };
}

// ── GET /api/admin/campaigns/rejected 응답 (GA-03) ──

export interface RejectedListParams {
  startDate?: string;
  endDate?: string;
  rejectCode?: string;
  keyword?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface RejectedCampaignApiItem {
  rejectId: number;
  campaignId: number;
  campaignTitle: string;
  partnerName: string;
  reviewerName: string;
  reviewerId: number;
  rejectCode: string | null;
  rejectCodeLabel: string;
  rejectReason: string;
  aiRecommendedCodes: string[];
  adminMemo?: string | null;
  processedAt: string;
  processedBy: string;
}

export interface RejectStatItem {
  code: string;
  label: string;
  count: number;
}

export interface RejectedListResponse {
  result: "OK";
  generatedAt: string;
  data: {
    rejectStats: RejectStatItem[];
    rejectList: RejectedCampaignApiItem[];
    pagination: {
      totalCount: number;
      currentPage: number;
      totalPages: number;
      limit: number;
    };
  };
}

// ----------------------------------------
// SA 캠페인 진행현황 (SA-02)
// ----------------------------------------

/** SA 캠페인 진행현황 조회 파라미터 */
export interface SACampaignProgressParams {
  startDate?: string;
  endDate?: string;
  status?: string; // OPEN_SCHEDULED | APPLYING | IN_PROGRESS | ENDED | CANCELLED | URGENT (다중: 쉼표 구분)
  type?: string; // DELIVERY | VISIT | REVIEW | REPORTER | MISSION (다중: 쉼표 구분)
  channel?: string; // BLOG | INSTAGRAM | CLIP | YOUTUBE | REELS | SHORTS | MISSION | REVIEW (다중: 쉼표 구분)
  keyword?: string;
  sortBy?: string; // campaignNumber | applyCount | recruitCount | point
  sortDir?: string; // asc | desc
  page?: number;
  size?: number;
}

/** SA 캠페인 통계 응답 */
export interface SACampaignStatsResponse {
  result: string;
  generatedAt: string;
  stats: {
    total: number;
    openScheduled: number;
    applying: number;
    inProgress: number;
    ended: number;
    cancelled: number;
    urgent?: number;
  };
}

/** SA 캠페인 목록 응답 */
export interface SACampaignListResponse {
  result: string;
  generatedAt: string;
  totalCount: number;
  campaigns: SACampaignItem[];
}

/** SA 캠페인 목록 항목 */
export interface SACampaignItem {
  campaignId?: number; // 실제 DB 캠페인 ID (상세 페이지 이동용)
  campaignNumber: string; // 6자리 패딩 (예: 004015)
  partnerName: string;
  campaignName: string;
  status: string; // OPEN_SCHEDULED | APPLYING | IN_PROGRESS | ENDED | CANCELLED | URGENT
  type: string; // DELIVERY | VISIT | REVIEW | REPORTER | MISSION
  channel: string; // BLOG | INSTAGRAM | CLIP | YOUTUBE | REELS | SHORTS | MISSION | REVIEW
  applyCount: number;
  recruitCount: number;
  point: number;
}

// ----------------------------------------
// SA 출금 요청 (SA-05)
// ----------------------------------------

/** SA 출금 요청 목록 조회 파라미터 */
export interface SAWithdrawalRequestParams {
  tab?: "URGENT" | "ROUND";
  page?: number;
  size?: number;
  sort?: string;
  direction?: "asc" | "desc";
}

/** SA 출금 요청 목록 응답 */
export interface SAWithdrawalRequestListResponse {
  result: string;
  generatedAt: string;
  totalCount: number;
  totalAmount: number;
  withdrawalRequests: SAWithdrawalRequestItem[];
}

/** SA 출금 요청 항목 */
export interface SAWithdrawalRequestItem {
  id: number;
  seq: number;
  reviewerId: number;
  name: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  ssn: string;
  withdrawalPoints: number;
  remainingPoints: number;
  requestedAt: string; // ZonedDateTime → ISO string
  memberType: string; // GENERAL | VIP 등
  status: string; // NORMAL | WARNED | BLOCKED 등
  round: string; // "-" = 긴급, "1차", "2차" 등
}

/** SA 출금 승인 요청 body */
export interface SAWithdrawalApproveRequest {
  withdrawalRequestIds: number[];
}

/** SA 출금 승인 응답 */
export interface SAWithdrawalApproveResponse {
  result: string;
  generatedAt: string;
  approvedCount: number;
  approvedIds: number[];
}

/** SA 출금 반려 요청 body */
export interface SAWithdrawalRejectRequest {
  withdrawalRequestIds: number[];
  reason?: string;
}

/** SA 출금 반려 응답 */
export interface SAWithdrawalRejectResponse {
  result: string;
  generatedAt: string;
  rejectedCount: number;
  rejectedIds: number[];
}

// ----------------------------------------
// SA 출금 현황 (SA-04)
// ----------------------------------------

/** SA 출금 현황 목록 조회 파라미터 */
export interface SAWithdrawalStatusParams {
  startDate?: string;
  endDate?: string;
  paymentStatus?: string; // urgent | request | completed | rejected (쉼표 구분)
  memberType?: string; // 일반 회원 | 주의 회원 | 이용 제한 회원 (쉼표 구분)
  status?: string; // 정상 | 일시 정지 | 영구 정지 | 탈퇴 (쉼표 구분)
  keyword?: string;
  sortBy?: string; // number | name | amount | requestDate | paymentDate
  sortDirection?: string; // asc | desc
}

/** SA 출금 현황 통계 응답 */
export interface SAWithdrawalStatsResponse {
  result: string;
  generatedAt: string;
  stats: {
    urgentAmount: number;
    urgentCount: number;
    weekScheduledAmount: number;
    weekScheduledCount: number;
    monthTotalAmount: number;
    monthTotalCount: number;
    totalDepositAmount: number;
  };
}

/** SA 출금 현황 목록 응답 */
export interface SAWithdrawalStatusListResponse {
  result: string;
  generatedAt: string;
  totalCount: number;
  withdrawals: SAWithdrawalStatusItem[];
}

/** SA 출금 현황 항목 (백엔드 원본) */
export interface SAWithdrawalStatusItem {
  id: string;
  number: string; // 7자리 순번
  round: string; // 회차 (없으면 "-")
  name: string;
  account: string; // 은행명 + 계좌번호 + 예금주 조합
  ssn: string; // 마스킹 처리됨
  amount: number; // 출금 포인트 (원)
  remaining: number; // 잔여 포인트 (원)
  paymentStatus: string; // URGENT | REQUEST | COMPLETED | REJECTED
  requestDate: string; // ISO 8601 ZonedDateTime
  paymentDate: string | null; // ISO 8601 or null
  memberType: string; // NORMAL | CAUTION | RESTRICTED
  status: string; // ACTIVE | PAUSED | BANNED | WITHDRAWN
}

// ----------------------------------------
// SA 결제 내역 (SA-06)
// ----------------------------------------

/** SA 결제 내역 목록 조회 파라미터 */
export interface SAPaymentHistoryParams {
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  entityType?: string; // CORPORATE | INDIVIDUAL
  paymentMethod?: string; // CARD | BANK_TRANSFER | POINT
  receiptType?: string; // TAX_INVOICE | CASH_RECEIPT_INCOME | CASH_RECEIPT_EXPENSE | NONE
  paymentStatus?: string; // COMPLETED | PENDING | CANCELLED (쉼표 구분 다중)
  memberGrade?: string; // EXCELLENT,NORMAL | CAUTION,WARNING | RESTRICTED (쉼표 구분 다중)
  memberStatus?: string; // ACTIVE | PAUSED | BLOCKED | WITHDRAW (다중)
  keyword?: string;
  page?: number;
  size?: number;
}

/** SA 결제 통계 응답 */
export interface SAPaymentStatsResponse {
  result: string;
  generatedAt: string;
  weekBankCount: number;
  weekBankAmount: number;
  weekCardCount: number;
  weekCardAmount: number;
  monthTotalCount: number;
  monthTotalAmount: number;
}

/** SA 결제 내역 목록 응답 */
export interface SAPaymentListResponse {
  result: string;
  generatedAt: string;
  totalCount: number;
  payments: SAPaymentItem[];
}

/** SA 결제 내역 항목 (백엔드 원본) */
export interface SAPaymentItem {
  paymentId: number;
  businessName: string;
  businessNumber: string;
  managers: string[];
  depositorName: string;
  entityType: string; // CORPORATE | INDIVIDUAL
  paymentMethod: string; // CARD | BANK_TRANSFER | POINT
  receiptType: string; // TAX_INVOICE | CASH_RECEIPT_INCOME | CASH_RECEIPT_EXPENSE | NONE
  chargePoint: number;
  retainedPoint: number;
  paymentStatus: string; // PENDING | COMPLETED | CANCELLED
  requestedAt: string; // ISO 8601
  approvedAt: string | null; // ISO 8601 or null (PENDING 시 null)
  memberGrade: string; // EXCELLENT | NORMAL | CAUTION | WARNING | RESTRICTED
  memberStatus: string; // ACTIVE | PAUSED | BLOCKED | WITHDRAW
}

// ----------------------------------------
// SA 리뷰어 목록 (SA-07)
// ----------------------------------------

/** SA 리뷰어 목록 조회 파라미터 */
export interface SAReviewerListParams {
  channel?: string; // NAVER_BLOG | NAVER_CLIP | INSTAGRAM | YOUTUBE
  reviewerType?: string; // NORMAL | SUPPORTER | INFLUENCER
  memberGrade?: string; // EXCELLENT,NORMAL | CAUTION,WARNING | RESTRICTED
  memberStatus?: string; // ACTIVE | PAUSED | BLOCKED | WITHDRAW
  keyword?: string;
  page?: number;
  size?: number;
}

/** SA 리뷰어 통계 응답 */
export interface SAReviewerStatsResponse {
  result: string;
  generatedAt: string;
  monthlyNewCount: number;
  totalCount: number;
  monthlyActiveCount: number;
  dormantCount: number;
}

/** SA 리뷰어 목록 응답 */
export interface SAReviewerListResponse {
  result: string;
  generatedAt: string;
  totalCount: number;
  reviewers: SAReviewerItem[];
}

/** SA 리뷰어 목록 항목 (백엔드 원본) */
export interface SAReviewerItem {
  reviewerId?: number; // 리뷰어 고유 ID (상세 조회용)
  reviewerNumber: string;
  name: string;
  channels: {
    channelType: string; // NAVER_BLOG | NAVER_CLIP | INSTAGRAM | YOUTUBE
    accountUrl: string;
  }[];
  reviewerType: string; // NORMAL | SUPPORTER | INFLUENCER
  lastAccessedAt: string; // ISO 8601
  joinedAt: string; // ISO 8601
  campaignParticipationCount: number;
  campaignCompletionCount: number;
  retainedPoint: number;
  withdrawalPoint: number;
  memberGrade: string; // EXCELLENT | NORMAL | CAUTION | WARNING | RESTRICTED
  memberStatus: string; // ACTIVE | PAUSED | BLOCKED | WITHDRAW
}

/** SA 리뷰어 이용 제한 요청 */
export interface SAReviewerRestrictRequest {
  reviewerIds: number[];
  blockCode: string; // B001~B010
  blockReason?: string; // 최대 500자
}

/** SA 리뷰어 이용 제한 응답 */
export interface SAReviewerRestrictResponse {
  result: string;
  generatedAt: string;
  processedCount: number;
}

// ----------------------------------------
// SA 파트너 목록 (SA-08)
// ----------------------------------------

/** SA 파트너 목록 조회 파라미터 */
export interface SAPartnerListParams {
  channel?: string;
  entityType?: string;
  partnerType?: string;
  memberStatus?: string;
  keyword?: string;
  page?: number;
  size?: number;
}

/** SA 파트너 통계 응답 */
export interface SAPartnerStatsResponse {
  result: string;
  generatedAt: string;
  partnerStats: {
    monthlyNewCount: number;
    totalCount: number;
    monthlyActiveCount: number;
    dormantCount: number;
  };
}

/** SA 파트너 목록 응답 */
export interface SAPartnerListResponse {
  result: string;
  generatedAt: string;
  totalCount: number;
  partners: SAPartnerItem[];
}

/** SA 파트너 목록 단건 아이템 */
export interface SAPartnerItem {
  id: number;
  number: string;
  channel: string; // NAVER_BLOG | NAVER_CLIP | INSTAGRAM | YOUTUBE
  entityType: string; // CORPORATE | INDIVIDUAL
  partnerType: string; // NORMAL | CAUTION | RESTRICTED
  memberStatus: string; // ACTIVE | SUSPENDED | PENDING | WITHDRAWN
  companyName: string;
  representativeName: string;
  email: string;
  phone: string;
  businessRegistrationNumber: string;
  campaignCount: number;
  campaignCompleted?: number;
  pointBalance?: number;
  createdAt: string; // ISO 8601
  lastLoginAt: string; // ISO 8601
}

// ========================================
// SA 대시보드 통합 API (SA-01)
// ========================================

/** SA 대시보드 Request 파라미터 */
export interface SADashboardParams {
  startDate?: string; // yyyy-MM-dd, 미입력 시 당월 1일
  endDate?: string; // yyyy-MM-dd, 미입력 시 오늘
}

/** SA 대시보드 통합 응답 */
export interface SADashboardResponse {
  result: string;
  generatedAt: string;
  dashboardData: {
    settlementSummary: SASettlementSummary;
    paymentSummary: SAPaymentSummary;
    memberActivation: SAMemberActivation;
    memberType: SAMemberType;
    channelMember: SAChannelMember;
  };
}

/** 정산 요약 */
export interface SASettlementSummary {
  withdrawalRequestAmount: number;
  withdrawalCompleteAmount: number;
  totalDepositBalance: number;
  settlementChart: SAChartDataItem[];
}

/** 결제 요약 */
export interface SAPaymentSummary {
  totalPaymentAmount: number;
  completedPaymentAmount: number;
  pendingPaymentAmount: number;
  paymentChart: SAChartDataItem[];
}

/** 차트 데이터 아이템 */
export interface SAChartDataItem {
  month: string; // yyyy-MM
  amount: number;
}

/** 전체 회원 통계 */
export interface SAMemberActivation {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  activePercentage: number;
  totalMembersChange: SAChangeInfo;
}

/** 회원 유형별 통계 */
export interface SAMemberType {
  totalPartners: number;
  activePartners: number;
  totalReviewers: number;
  activeReviewers: number;
  partnerPercentage: number;
  reviewerPercentage: number;
  activePartnerPercentage: number;
  activeReviewerPercentage: number;
  totalPartnersChange: SAChangeInfo;
  totalReviewersChange: SAChangeInfo;
}

/** 채널별 회원 통계 */
export interface SAChannelMember {
  blog: SAChannelStat;
  instagram: SAChannelStat;
  clip: SAChannelStat;
  youtube: SAChannelStat;
}

export interface SAChannelStat {
  count: number;
  percentage: number;
}

/** 증감 정보 */
export interface SAChangeInfo {
  percentage: number;
  type: "positive" | "negative" | "neutral";
}
