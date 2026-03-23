/* ========================================
   파트너 캠페인 신청내역 API 함수
   ======================================== */

/**
 * 백엔드 API:
 * - 19. GET /partner/campaign/applications/{campaignId} → 신청내역 조회
 * - 20. PUT /partner/campaign/applications/{applicationId}/select → 리뷰어 선정
 * - 21. PUT /partner/campaign/applications/{applicationId}/cancel-select → 선정 취소
 */

import { partnerApiClient } from "./partnerClient";
import type {
  CampaignApplicationResponse,
  SelectApplicationResponse,
  CancelSelectResponse,
  ApplicationStatusFilter,
  ApplicationSortOption,
} from "@/types/api/partnerCampaignApplication";

// status 파라미터: 미입력 시 전체 반환이므로 ALL일 때 파라미터 제외

// ----------------------------------------
// API 19: 캠페인 신청내역 조회
// ----------------------------------------

interface GetApplicationsParams {
  campaignId: string;
  status?: ApplicationStatusFilter;
  sort?: ApplicationSortOption;
}

export async function getCampaignApplications({
  campaignId,
  status = "ALL",
  sort = "LATEST",
}: GetApplicationsParams): Promise<CampaignApplicationResponse> {
  const params = new URLSearchParams();
  if (status !== "ALL") params.append("status", status);
  params.append("sort", sort);

  const query = params.toString();
  const url = `/partner/campaign/applications/${campaignId}${query ? `?${query}` : ""}`;
  const { data } = await partnerApiClient.get<CampaignApplicationResponse>(url);
  return data;
}

// ----------------------------------------
// API 20: 리뷰어 선정하기
// ----------------------------------------

export async function selectApplication(applicationId: number): Promise<SelectApplicationResponse> {
  const { data } = await partnerApiClient.put<SelectApplicationResponse>(
    `/partner/campaign/applications/${applicationId}/select`
  );
  return data;
}

// ----------------------------------------
// API 21: 리뷰어 선정 취소하기
// ----------------------------------------

export async function cancelSelectApplication(
  applicationId: number
): Promise<CancelSelectResponse> {
  const { data } = await partnerApiClient.put<CancelSelectResponse>(
    `/partner/campaign/applications/${applicationId}/cancel-select`
  );
  return data;
}
