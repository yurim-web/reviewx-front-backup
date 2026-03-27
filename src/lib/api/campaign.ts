/* ========================================
   캠페인 목록 API 함수
   ======================================== */

/**
 * campaign API
 *
 * 목적: 캠페인 목록 조회 API 함수 (apiClient → json-server or 실제 백엔드)
 *
 * 사용 페이지:
 * - /campaign/delivery, /campaign/visit, /campaign/review
 * - /campaign/reporter, /campaign/mission
 *
 * 응답 처리:
 * - 실제 백엔드: { result: "OK", items: [...] }
 * - json-server 목업: [...] (배열 직접 반환)
 * → 두 형식 모두 자동으로 처리
 */

import { apiClient } from "@/lib/api/client";
import type {
  CampaignListApiItem,
  CampaignListApiResponse,
  CampaignDetailApiItem,
  CampaignDetailApiResponse,
  CampaignApplicationPostBody,
  CampaignApplicationApiItem,
  ApplicationFormDataResponse,
  CampaignApplyRequest,
  CampaignApplyResponse,
} from "@/types/api/campaign";

type RawResponse = CampaignListApiResponse | CampaignListApiItem[];

function extractItems(data: RawResponse): CampaignListApiItem[] {
  if (Array.isArray(data)) return data;
  return data.items ?? [];
}

export const fetchDeliveryCampaigns = () =>
  apiClient
    .get<RawResponse>("/api/v1/reviewer/dashboard/delivery")
    .then((res) => extractItems(res.data));

export const fetchVisitCampaigns = () =>
  apiClient
    .get<RawResponse>("/api/v1/reviewer/dashboard/visit")
    .then((res) => extractItems(res.data));

export const fetchReviewCampaigns = () =>
  apiClient
    .get<RawResponse>("/api/v1/reviewer/dashboard/purchase-review")
    .then((res) => extractItems(res.data));

export const fetchReporterCampaigns = () =>
  apiClient
    .get<RawResponse>("/api/v1/reviewer/dashboard/reporter")
    .then((res) => extractItems(res.data));

export const fetchMissionCampaigns = () =>
  apiClient
    .get<RawResponse>("/api/v1/reviewer/dashboard/mission")
    .then((res) => extractItems(res.data));

/** 캠페인 상세 조회 (23번: GET /campaign/{type}/{campaignId}) */
type RawDetailResponse = CampaignDetailApiResponse | CampaignDetailApiItem;

/** 캠페인 유형 path variable (백엔드 기준) */
type CampaignDetailType = "delivery" | "visit" | "purchase" | "reporter" | "mission";

function extractDetail(data: RawDetailResponse): CampaignDetailApiItem {
  if ("campaign" in data && data.campaign) return data.campaign;
  return data as CampaignDetailApiItem;
}

export const fetchCampaignDetail = (type: CampaignDetailType, campaignId: string | number) =>
  apiClient
    .get<RawDetailResponse>(`/api/v1/reviewer/campaign/${campaignId}`)
    .then((res) => extractDetail(res.data));

/** 캠페인 신청 (POST /api/v1/reviewer/campaign/{campaignId}/apply) */
export const postCampaignApplication = (
  body: CampaignApplicationPostBody
): Promise<CampaignApplicationApiItem> =>
  apiClient
    .post<CampaignApplicationApiItem>(`/api/v1/reviewer/campaign/${body.campaign_id}/apply`, body)
    .then((res) => res.data);

/** 캠페인 신청 취소 (DELETE) — TODO: 백엔드 엔드포인트 미확정, 확정 후 URL 업데이트 필요 */
export const deleteCampaignApplication = (applicationId: number): Promise<void> =>
  apiClient.delete(`/reviewer/campaign/apply/${applicationId}`).then(() => undefined);

// ========================================
// 캠페인 신청 (백엔드 R-24, R-25)
// ========================================

/** 신청 모달 데이터 조회 (R-24: GET /api/v1/reviewer/campaign/{campaignId}/apply-form) */
export const fetchApplicationFormData = (
  type: CampaignDetailType,
  campaignId: string | number
): Promise<ApplicationFormDataResponse> =>
  apiClient
    .get<ApplicationFormDataResponse>(`/api/v1/reviewer/campaign/${campaignId}/apply-form`)
    .then((res) => res.data);

/** 캠페인 신청 등록 (R-25: POST /api/v1/reviewer/campaign/{campaignId}/apply) */
export const submitCampaignApplication = (
  type: CampaignDetailType,
  campaignId: string | number,
  body: CampaignApplyRequest
): Promise<CampaignApplyResponse> =>
  apiClient
    .post<CampaignApplyResponse>(`/api/v1/reviewer/campaign/${campaignId}/apply`, body)
    .then((res) => res.data);
