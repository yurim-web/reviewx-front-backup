/* ========================================
   파트너 캠페인 콘텐츠 내역 API 함수
   ======================================== */

/**
 * 파트너 캠페인 콘텐츠 내역 API
 *
 * 목적: 파트너 캠페인 콘텐츠 내역 페이지에서 사용하는 API 호출 함수
 *
 * API:
 * - 22번: GET /partner/campaign/{campaignId}/contents?tab=...
 * - 22-1번: PUT /partner/campaign/contents/{contentId}/approve
 * - 22-2번: PUT /partner/campaign/contents/{contentId}/reject
 * - 22-3번: PUT /partner/campaign/applications/{applicationId}/extend-deadline
 * - 22-4번: POST /partner/campaign/applications/{applicationId}/report
 * - 22-5번: PUT /partner/campaign/contents/{contentId}/complete
 *
 * 사용 위치:
 * - src/hooks/partner/campaign_contents/useCampaignContents.ts
 */

import { partnerApiClient } from "@/lib/api/partnerClient";
import type {
  ContentTab,
  CampaignContentsResponse,
  ContentApproveResponse,
  ContentRejectRequest,
  ContentRejectResponse,
  ContentExtendRequest,
  ContentExtendResponse,
  ContentReportRequest,
  ContentReportResponse,
  ContentCompleteResponse,
} from "@/types/api/partnerCampaignContents";

// ----------------------------------------
// API 22: 콘텐츠 내역 조회
// GET /partner/campaign/{campaignId}/contents?tab=waiting|submitted|approved
// 백엔드 응답: flat 구조 (data wrapper 없음)
// ----------------------------------------
export async function getCampaignContents(params: {
  campaignId: string;
  tab: ContentTab;
}): Promise<CampaignContentsResponse> {
  const { data } = await partnerApiClient.get<CampaignContentsResponse>(
    `/partner/campaign/${params.campaignId}/contents`,
    { params: { tab: params.tab } }
  );
  return data;
}

// ----------------------------------------
// API 22-1: 콘텐츠 승인
// PUT /partner/campaign/contents/{contentId}/approve
// ----------------------------------------
export async function approveContent(contentId: number): Promise<ContentApproveResponse> {
  const { data } = await partnerApiClient.put<ContentApproveResponse>(
    `/partner/campaign/contents/${contentId}/approve`
  );
  return data;
}

// ----------------------------------------
// API 22-2: 콘텐츠 반려
// PUT /partner/campaign/contents/{contentId}/reject
// ----------------------------------------
export async function rejectContent(
  contentId: number,
  body?: ContentRejectRequest
): Promise<ContentRejectResponse> {
  const { data } = await partnerApiClient.put<ContentRejectResponse>(
    `/partner/campaign/contents/${contentId}/reject`,
    body
  );
  return data;
}

// ----------------------------------------
// API 22-3: 콘텐츠 기한 연장
// PUT /partner/campaign/applications/{applicationId}/extend-deadline
// body: { extensionDays: 3 } (기본값 3)
// ----------------------------------------
export async function extendContentDeadline(
  applicationId: number,
  body?: ContentExtendRequest
): Promise<ContentExtendResponse> {
  const { data } = await partnerApiClient.put<ContentExtendResponse>(
    `/partner/campaign/applications/${applicationId}/extend-deadline`,
    body ?? { extensionDays: 3 }
  );
  return data;
}

// ----------------------------------------
// API 22-4: 리뷰어 신고
// POST /partner/campaign/applications/{applicationId}/report
// body: { reportReason: "NO_CONTACT_NO_SHOW", reportDetail: null }
// ----------------------------------------
export async function reportReviewer(
  applicationId: number,
  body: ContentReportRequest
): Promise<ContentReportResponse> {
  const { data } = await partnerApiClient.post<ContentReportResponse>(
    `/partner/campaign/applications/${applicationId}/report`,
    body
  );
  return data;
}

// ----------------------------------------
// API 22-5: 콘텐츠 확인완료
// PUT /partner/campaign/contents/{contentId}/complete
// ----------------------------------------
export async function completeContent(contentId: number): Promise<ContentCompleteResponse> {
  const { data } = await partnerApiClient.put<ContentCompleteResponse>(
    `/partner/campaign/contents/${contentId}/complete`
  );
  return data;
}
