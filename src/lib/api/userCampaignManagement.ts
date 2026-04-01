/* ========================================
   리뷰어 캠페인 관리 API
   ======================================== */

/**
 * userCampaignManagement
 *
 * 목적: 리뷰어 캠페인 관리 목록 조회 + 액션 API (신청 취소, 콘텐츠 등록 등)
 *
 * 사용 페이지:
 * - /user/campaign_management/all (전체)
 * - /user/campaign_management/applied (신청)
 * - /user/campaign_management/selected (선정)
 * - /user/campaign_management/completed (완료)
 * - /user/campaign_management/cancelled (취소/반려)
 *
 * 백엔드 API:
 * - R-27: GET /user/campaign_management (내 캠페인 내역 조회)
 */

import { apiClient } from "@/lib/api/client";

// ────────────────────────────────────────────────────────────────────────────
// 타입 정의
// ────────────────────────────────────────────────────────────────────────────

/** 캠페인 유형 */
export type CampaignType = "DELIVERY" | "VISIT" | "PURCHASE" | "REPORTER" | "MISSION";

/** 신청 상태 */
export type ApplicationStatus =
  | "APPLIED"
  | "SELECTED"
  | "WAIT"
  | "COMPLETE"
  | "REJECT"
  | "CANCELED";

/** 콘텐츠 상태 */
export type ContentStatus = "WAIT" | "SUBMITTED" | "APPROVED" | "REJECTED";

/** 콘텐츠 정보 */
export interface CampaignContentInfo {
  campaignContentId: number;
  contentStatus: ContentStatus;
  contentUrl: string | null;
}

/** 캠페인 관리 목록 아이템 (백엔드 R-27 응답) */
export interface MyCampaignItem {
  campaignApplicationId: number;
  campaignId: number;
  campaignType: CampaignType;
  channelType?: string; // 채널 유형 (예: 인스타그램, 네이버블로그, 유튜브 등)
  status: ApplicationStatus;
  appliedAt: string;
  selectedAt: string | null;
  content: CampaignContentInfo | null;
  title: string;
  thumbnailUrl: string;
  recruitEndAt: string;
  isUrgent: boolean;
  subStatus?: string;
  rejectionReason?: string;
  rejectedAt?: string; // 반려 일시 (ISO8601) - 반려된 콘텐츠에만 존재
  isPenalty?: boolean;
}

/** 캠페인 관리 목록 응답 */
export interface MyCampaignListResponse {
  result: "OK";
  generatedAt: string;
  items: MyCampaignItem[];
  nextCursor: string | null;
}

/** 목록 조회 쿼리 파라미터 */
export interface MyCampaignParams {
  status?: ApplicationStatus;
  type?: CampaignType;
  requiredPlatformId?: number;
  page?: number;
  size?: number;
}

/** 신청 취소 응답 */
export interface CancelApplicationResponse {
  result: "OK";
  message: string;
}

/** 콘텐츠 등록/수정 응답 */
export interface SubmitContentResponse {
  result: "OK";
  campaignContentId: number;
  contentStatus: "SUBMITTED";
}

/** 기한 연장 응답 */
export interface ExtensionResponse {
  result: "OK";
  extensionCount: number;
  newDeadline: string;
}

/** 반려 사유 조회 응답 */
export interface RejectionReasonResponse {
  result: "OK";
  rejectionCode: string;
  rejectionReason: string;
  rejectedAt: string;
  resubmitDeadline: string;
}

// ────────────────────────────────────────────────────────────────────────────
// 목록 조회 API
// ────────────────────────────────────────────────────────────────────────────

/**
 * 캠페인 관리 목록 조회
 * GET /user/campaign_management
 * Bearer 토큰으로 리뷰어 식별 (query param 불필요)
 * 백엔드 R-27
 */
export const fetchMyCampaigns = async (
  params?: MyCampaignParams
): Promise<MyCampaignListResponse> => {
  const { data } = await apiClient.get<{
    result: "OK";
    generatedAt: string;
    data: {
      totalCount: number;
      campaigns: Array<
        Omit<MyCampaignItem, "campaignType" | "status"> & {
          type: string;
          applicationStatus: string;
        }
      >;
    };
  }>("/api/v1/reviewer/campaigns", { params });
  const items = (data.data?.campaigns ?? []).map((item) => ({
    ...item,
    campaignType: item.type as CampaignType,
    status: item.applicationStatus as ApplicationStatus,
  }));
  return {
    result: data.result,
    generatedAt: data.generatedAt,
    items,
    nextCursor: null,
  };
};

// ────────────────────────────────────────────────────────────────────────────
// 액션 API
// ────────────────────────────────────────────────────────────────────────────

/**
 * 신청 취소
 * DELETE /reviewer/my-page/my-campaign/{applicationId}
 */
export const cancelApplication = async (
  applicationId: number
): Promise<CancelApplicationResponse> => {
  const { data } = await apiClient.delete<{
    result: "OK";
    generatedAt: string;
    data: Omit<CancelApplicationResponse, "result">;
  }>(`/api/v1/reviewer/campaigns/${applicationId}/cancel`);
  return { result: data.result, ...data.data };
};

/**
 * 콘텐츠 등록
 * POST /reviewer/my-page/my-campaign/{applicationId}/content
 */
export const submitContent = async (
  applicationId: number,
  formData: FormData
): Promise<SubmitContentResponse> => {
  const { data } = await apiClient.post<{
    result: "OK";
    generatedAt: string;
    data: Omit<SubmitContentResponse, "result">;
  }>(`/api/v1/reviewer/campaigns/${applicationId}/content`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return { result: data.result, ...data.data };
};

/**
 * 콘텐츠 수정
 * PUT /reviewer/my-page/my-campaign/{applicationId}/content
 */
export const updateContent = async (
  applicationId: number,
  formData: FormData
): Promise<SubmitContentResponse> => {
  const { data } = await apiClient.put<{
    result: "OK";
    generatedAt: string;
    data: Omit<SubmitContentResponse, "result">;
  }>(`/api/v1/reviewer/campaigns/${applicationId}/content`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return { result: data.result, ...data.data };
};

/**
 * 등록 기한 연장 요청
 * POST /reviewer/my-page/my-campaign/{applicationId}/extension
 */
export const requestExtension = async (applicationId: number): Promise<ExtensionResponse> => {
  const { data } = await apiClient.post<{
    result: "OK";
    generatedAt: string;
    data: Omit<ExtensionResponse, "result">;
  }>(`/api/v1/reviewer/campaigns/${applicationId}/content/extend`);
  return { result: data.result, ...data.data };
};

/**
 * 반려 사유 조회
 * GET /user/campaign_management/content/rejection-reason/{applicationId}
 */
export const getRejectionReason = async (
  applicationId: number
): Promise<RejectionReasonResponse> => {
  const { data } = await apiClient.get<{
    result: "OK";
    generatedAt: string;
    data: Omit<RejectionReasonResponse, "result">;
  }>(`/api/v1/reviewer/campaigns/${applicationId}/content/rejection`);
  return { result: data.result, ...data.data };
};
