/* ========================================
   파트너 캠페인 콘텐츠 내역 API 타입 정의
   ======================================== */

/**
 * 파트너 캠페인 콘텐츠 내역 관련 API 타입
 *
 * API:
 * - 22번: GET /partner/campaign/{campaignId}/contents?tab=waiting|submitted|approved
 * - 22-1번: PUT /partner/campaign/contents/{contentId}/approve
 * - 22-2번: PUT /partner/campaign/contents/{contentId}/reject
 * - 22-3번: PUT /partner/campaign/applications/{applicationId}/extend-deadline
 * - 22-4번: POST /partner/campaign/applications/{applicationId}/report
 * - 22-5번: PUT /partner/campaign/contents/{contentId}/complete
 *
 * 사용 위치:
 * - src/lib/api/partnerCampaignContents.ts
 * - src/hooks/partner/campaign_contents/useCampaignContents.ts
 */

// ----------------------------------------
// API 22 — 콘텐츠 내역 조회
// GET /partner/campaign/{campaignId}/contents?tab=waiting|submitted|approved
// ----------------------------------------

/** 탭 파라미터 (백엔드 기준) */
export type ContentTab = "waiting" | "submitted" | "approved";

/** 프론트엔드 탭 → 백엔드 탭 매핑 */
export const TAB_TO_API_CONTENT_TAB: Record<string, ContentTab> = {
  대기: "waiting",
  확인: "submitted",
  완료: "approved",
};

/** 캠페인 기본 정보 (API 22 응답 — 백엔드 스펙 기준) */
export interface ContentCampaignInfo {
  campaignId: number;
  title: string;
  recruitLimit: number;
  selectedCount: number;
  contentRegistrationDeadline: string; // ISO 8601
}

/** 탭별 콘텐츠 건수 (백엔드: waiting/submitted/approved, "Count" 접미사 없음) */
export interface ContentTabCounts {
  waiting: number;
  submitted: number;
  approved: number;
}

/** 콘텐츠 아이템 (백엔드 응답 — API 22 스펙 기준) */
export interface ContentItemApi {
  campaignContentId: number | null; // null = 대기(미등록) 상태
  reviewerId: number;
  reviewerName: string;
  reviewerGrade: string; // "EXCELLENT" | "NORMAL" 등 백엔드 등급
  channelName: string; // "Instagram" | "NAVER_BLOG" 등
  channelUsername: string;
  contentUrl: string | null;
  contentStatus: string | null; // "SUBMITTED" | "APPROVED" | "REJECTED" | "EXTENSION" | null(대기)
  contentRegAt: string | null; // ISO 8601
  contentUpdateAt: string | null; // ISO 8601
  registrationDeadline?: string; // 대기 아이템의 개별 마감일
  // 프론트엔드 UI에서 추가로 사용하는 필드 (mock에서 제공)
  applicationId?: number;
  profileImage?: string;
  isLateSubmission?: boolean;
  extensionCount?: number;
  rejectReason?: string;
  reportedAt?: string;
  receiptImages?: string[];
  thumbnailSrc?: string;
}

/**
 * API 22 전체 응답 (백엔드: flat 구조 — data wrapper 없음)
 *
 * {
 *   "result": "OK",
 *   "generatedAt": "...",
 *   "campaignInfo": {...},
 *   "tabCounts": {...},
 *   "contents": [...]
 * }
 */
export interface CampaignContentsResponse {
  result: string;
  generatedAt: string;
  campaignInfo: ContentCampaignInfo;
  tabCounts: ContentTabCounts;
  contents: ContentItemApi[];
}

// ----------------------------------------
// API 22-1 — 콘텐츠 승인
// PUT /partner/campaign/contents/{contentId}/approve
// ----------------------------------------

export interface ContentApproveData {
  campaignContentId: number;
  contentStatus: string; // "APPROVED"
  contentUpdateAt: string;
  message: string;
}

export interface ContentApproveResponse {
  result: string;
  data: ContentApproveData;
}

// ----------------------------------------
// API 22-2 — 콘텐츠 반려
// PUT /partner/campaign/contents/{contentId}/reject
// ----------------------------------------

export interface ContentRejectRequest {
  rejectReason?: string; // 최대 255자
}

export interface ContentRejectData {
  campaignContentId: number;
  contentStatus: string; // "REJECTED"
  rejectReason: string;
  contentUpdateAt: string;
  message: string;
}

export interface ContentRejectResponse {
  result: string;
  data: ContentRejectData;
}

// ----------------------------------------
// API 22-3 — 콘텐츠 기한 연장
// PUT /partner/campaign/applications/{applicationId}/extend-deadline
// ----------------------------------------

export interface ContentExtendRequest {
  extensionDays?: number; // 기본값 3
}

export interface ContentExtendData {
  applicationId: number;
  campaignId: number;
  reviewerId: number;
  reviewerName: string;
  previousDeadline: string;
  newDeadline: string;
  extensionDays: number;
  message: string;
}

export interface ContentExtendResponse {
  result: string;
  data: ContentExtendData;
}

// ----------------------------------------
// API 22-4 — 리뷰어 신고
// POST /partner/campaign/applications/{applicationId}/report
// ----------------------------------------

/** 신고 사유 ENUM */
export type ReportReasonType =
  | "CANCEL_AFTER_SELECTED"
  | "NO_CONTACT_NO_SHOW"
  | "MISSED_CONTENT_DEADLINE"
  | "INCORRECT_CONTENT_SUBMISSION"
  | "OTHER_MISCONDUCT";

export interface ContentReportRequest {
  reportReason: ReportReasonType;
  reportDetail?: string | null; // OTHER_MISCONDUCT일 때 필수
}

export interface ContentReportData {
  reportId: number;
  applicationId: number;
  campaignId: number;
  reviewerId: number;
  reviewerName: string;
  reportReason: string;
  reportDetail: string | null;
  reportedAt: string;
  penaltyScore: number;
  message: string;
}

export interface ContentReportResponse {
  result: string;
  data: ContentReportData;
}

// ----------------------------------------
// API 22-5 — 콘텐츠 확인완료
// PUT /partner/campaign/contents/{contentId}/complete
// ----------------------------------------

export interface ContentCompleteData {
  campaignContentId: number;
  contentStatus: string; // "APPROVED"
  isCompleted: boolean;
  completedAt: string;
  message: string;
}

export interface ContentCompleteResponse {
  result: string;
  data: ContentCompleteData;
}

// ----------------------------------------
// 백엔드 상수 매핑
// ----------------------------------------

/** 백엔드 campaignType → 프론트엔드 한글 */
export const CONTENT_CAMPAIGN_TYPE_LABEL: Record<string, string> = {
  DELIVERY: "배송형",
  VISIT: "방문형",
  PURCHASE: "구매평",
  REPORTER: "기자단",
  MISSION: "미션형",
};

/** 백엔드 platform → 프론트엔드 한글 */
export const CONTENT_PLATFORM_LABEL: Record<string, string> = {
  NAVER_BLOG: "네이버블로그",
  BLOG: "네이버블로그",
  INSTAGRAM: "인스타그램",
  YOUTUBE: "유튜브",
  REELS: "릴스",
};

/** 백엔드 status → 프론트엔드 한글 상태 */
export const CONTENT_STATUS_LABEL: Record<string, string> = {
  REGISTERING: "대기 중",
  RECRUITING: "모집 중",
  SELECTING: "선정 중",
  PURCHASING: "진행 중",
  CLOSED: "종료",
  EMERGENCY: "취소",
};

/** 신고 사유 ENUM → 한글 라벨 */
export const REPORT_REASON_LABEL: Record<ReportReasonType, string> = {
  CANCEL_AFTER_SELECTED: "선정 후 취소",
  NO_CONTACT_NO_SHOW: "무단 이탈·노쇼",
  MISSED_CONTENT_DEADLINE: "노출 기간 불이행",
  INCORRECT_CONTENT_SUBMISSION: "수정 요청 불이행",
  OTHER_MISCONDUCT: "기타 비매너 행위",
};
