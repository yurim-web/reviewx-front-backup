/* ========================================
   파트너 캠페인 관리 API 함수
   ======================================== */

/**
 * 파트너 캠페인 관리 관련 API
 *
 * API:
 * - 13번: GET /partner/campaign_management (관리 페이지 조회)
 * - 14번: GET /partner/campaign_management/{status} (상태별 조회)
 * - 17번: DELETE /partner/campaign/{campaignId} (캠페인 삭제)
 *
 * 사용 위치:
 * - src/hooks/partner/campaign_management/usePartnerCampaigns.ts
 */

import { partnerApiClient } from "@/lib/api/partnerClient";
import type {
  CampaignManagementPageResponse,
  CampaignStatusResponse,
  CampaignStatusParams,
  CampaignDeleteResponse,
} from "@/types/api/partnerCampaignManagement";

/**
 * 1. 캠페인 관리 페이지 조회 (API 13)
 * GET /partner/campaign_management
 * → stats(탭별 개수) + 전체 캠페인 목록
 */
export const getCampaignManagementPage = async (): Promise<CampaignManagementPageResponse> => {
  const { data } = await partnerApiClient.get<CampaignManagementPageResponse>(
    "/partner/campaign_management"
  );
  return data;
};

/**
 * 2. 캠페인 상태별 조회 (API 14)
 * GET /partner/campaign_management/{status}?sort=LATEST&type=DELIVERY&channel=BLOG&keyword=...
 * → 특정 상태의 캠페인 목록
 */
export const getCampaignsByStatus = async (
  params: CampaignStatusParams
): Promise<CampaignStatusResponse> => {
  const { status, sort, type, channel, keyword } = params;

  const queryParams: Record<string, string> = {};
  if (sort) queryParams.sort = sort;
  if (keyword) queryParams.keyword = keyword;
  if (type && type.length > 0) queryParams.type = type.join(",");
  if (channel && channel.length > 0) queryParams.channel = channel.join(",");
  if (params.page !== undefined) queryParams.page = String(params.page);
  if (params.size !== undefined) queryParams.size = String(params.size);

  const { data } = await partnerApiClient.get<CampaignStatusResponse>(
    `/partner/campaign_management/${status}`,
    { params: queryParams }
  );
  return data;
};

/**
 * 3. 캠페인 삭제 (API 17)
 * DELETE /partner/campaign/{campaignId}
 */
export const deleteCampaign = async (campaignId: number): Promise<CampaignDeleteResponse> => {
  const { data } = await partnerApiClient.delete<CampaignDeleteResponse>(
    `/partner/campaign/${campaignId}`
  );
  return data;
};
