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
} from "@/types/api/campaign";

type RawResponse = CampaignListApiResponse | CampaignListApiItem[];

function extractItems(data: RawResponse): CampaignListApiItem[] {
  if (Array.isArray(data)) return data;
  return data.items ?? [];
}

export const fetchDeliveryCampaigns = () =>
  apiClient.get<RawResponse>("/reviewer/campaign/delivery").then((res) => extractItems(res.data));

export const fetchVisitCampaigns = () =>
  apiClient.get<RawResponse>("/reviewer/campaign/visit").then((res) => extractItems(res.data));

export const fetchReviewCampaigns = () =>
  apiClient
    .get<RawResponse>("/reviewer/campaign/purchase-review")
    .then((res) => extractItems(res.data));

export const fetchReporterCampaigns = () =>
  apiClient.get<RawResponse>("/reviewer/campaign/reporter").then((res) => extractItems(res.data));

export const fetchMissionCampaigns = () =>
  apiClient.get<RawResponse>("/reviewer/campaign/mission").then((res) => extractItems(res.data));

/** 캠페인 상세 조회 (23번: GET /reviewer/campaign/{campaignId}) */
type RawDetailResponse = CampaignDetailApiResponse | CampaignDetailApiItem;

function extractDetail(data: RawDetailResponse): CampaignDetailApiItem {
  if ("campaign" in data && data.campaign) return data.campaign;
  return data as CampaignDetailApiItem;
}

export const fetchCampaignDetail = (campaignId: string | number) =>
  apiClient
    .get<RawDetailResponse>(`/reviewer/campaign/${campaignId}`)
    .then((res) => extractDetail(res.data));

/** 캠페인 신청 (POST /reviewer/campaign/apply → /campaign_applications) */
export const postCampaignApplication = (
  body: CampaignApplicationPostBody
): Promise<CampaignApplicationApiItem> =>
  apiClient
    .post<CampaignApplicationApiItem>("/reviewer/campaign/apply", body)
    .then((res) => res.data);

/** 캠페인 신청 취소 (DELETE /reviewer/campaign/apply/:id → /campaign_applications/:id) */
export const deleteCampaignApplication = (applicationId: number): Promise<void> =>
  apiClient.delete(`/reviewer/campaign/apply/${applicationId}`).then(() => undefined);
