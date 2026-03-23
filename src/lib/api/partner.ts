/* ========================================
   파트너 API 함수
   ======================================== */

/**
 * partner API
 *
 * 목적: 파트너 관련 API 함수 (apiClient → json-server or 실제 백엔드)
 *
 * 사용 훅:
 * - hooks/partner/usePartnerCampaigns.ts
 */

import { apiClient } from "@/lib/api/client";
import type { PartnerCampaignApiItem } from "@/types/api/partner";

/**
 * 파트너 캠페인 목록 조회
 * mock: GET /campaigns?partner_id=:id (json-server 라우팅 버그 우회)
 * 실제 백엔드 연결 시 → GET /partner/campaign?partner_id=:id 로 변경
 */
export const fetchPartnerCampaigns = (partnerId: number): Promise<PartnerCampaignApiItem[]> =>
  apiClient
    .get<PartnerCampaignApiItem[]>(`/campaigns`, {
      params: { partner_id: partnerId },
    })
    .then((res) => (Array.isArray(res.data) ? res.data : []));

/**
 * 파트너 회원가입
 * POST /partners → json-server partners 컬렉션에 저장
 */
export const postPartner = (body: Record<string, unknown>): Promise<Record<string, unknown>> =>
  apiClient.post<Record<string, unknown>>("/partners", body).then((res) => res.data);

/**
 * 파트너 캠페인 등록 (JSON body — mock 환경용)
 * POST /partner/campaign/create → 캠페인 등록 (10번 API)
 * @deprecated 실제 백엔드 연결 시 partnerCampaign.ts의 postCampaignCreate 사용
 */
export const postPartnerCampaign = (
  body: Record<string, unknown>
): Promise<Record<string, unknown>> =>
  apiClient.post<Record<string, unknown>>("/partner/campaign/create", body).then((res) => res.data);

/**
 * 캠페인 단건 조회 (edit 페이지 fallback용)
 * GET /campaigns/:id → json-server campaigns 컬렉션에서 조회
 */
export const fetchCampaignById = (id: string): Promise<PartnerCampaignApiItem | null> =>
  apiClient
    .get<PartnerCampaignApiItem>(`/campaigns/${id}`)
    .then((res) => res.data ?? null)
    .catch((error) => {
      console.error("fetchCampaignById failed:", error);
      return null;
    });

/**
 * 캠페인 수정
 * PATCH /campaigns/:numericId → json-server campaigns 컬렉션 업데이트
 * campaignId: "delivery_1" → numericId: 1
 */
export const patchCampaign = (campaignId: string, body: Record<string, unknown>): Promise<void> => {
  const numericId = parseInt(campaignId.replace(/\D/g, ""), 10);
  if (!numericId) return Promise.reject(new Error(`Invalid campaign ID: ${campaignId}`));
  return apiClient.patch(`/campaigns/${numericId}`, body).then(() => undefined);
};

/**
 * 캠페인 삭제
 * DELETE /partner/campaign/{campaignId} → 백엔드 API 17번
 * @deprecated 실제 백엔드 연결 시 partnerCampaignManagement.ts의 deleteCampaign 사용
 */
export const deleteCampaignApi = (campaignId: string): Promise<void> => {
  const numericId = parseInt(campaignId.replace(/\D/g, ""), 10);
  if (!numericId) return Promise.reject(new Error(`Invalid campaign ID: ${campaignId}`));
  return apiClient.delete(`/partner/campaign/${numericId}`).then(() => undefined);
};

// ----------------------------------------
// 캠페인 임시 저장 (11번, 12번 API)
// ----------------------------------------

/** 임시 저장 조회 (파트너 ID + 캠페인 타입) */
export const fetchDraftCampaign = (
  partnerId: string,
  campaignType: string
): Promise<Record<string, unknown> | null> =>
  apiClient
    .get<Record<string, unknown>[]>(`/draft_campaigns`, {
      params: { partner_id: partnerId, campaignType },
    })
    .then((res) => {
      const arr = Array.isArray(res.data) ? res.data : [];
      return arr.length > 0 ? arr[0] : null;
    })
    .catch((error) => {
      console.error("fetchDraftCampaign failed:", error);
      return null;
    });

/** 임시 저장 (POST /partner/campaign/draft) — 11번 API
 * @deprecated 실제 백엔드 연결 시 partnerCampaign.ts의 postCampaignDraft 사용 */
export const postDraftCampaign = (
  body: Record<string, unknown>
): Promise<Record<string, unknown>> =>
  apiClient.post<Record<string, unknown>>("/partner/campaign/draft", body).then((res) => res.data);

/** 임시 저장 업데이트 (PUT /draft_campaigns/:id) */
export const putDraftCampaign = (id: number, body: Record<string, unknown>): Promise<void> =>
  apiClient.put(`/draft_campaigns/${id}`, body).then(() => undefined);

/** 임시 저장 삭제 (DELETE /draft_campaigns/:id) */
export const deleteDraftCampaign = (id: number): Promise<void> =>
  apiClient.delete(`/draft_campaigns/${id}`).then(() => undefined);
