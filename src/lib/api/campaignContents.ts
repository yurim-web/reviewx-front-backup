/* ========================================
   캠페인 콘텐츠 API 함수
   ======================================== */

/**
 * campaign_contents API
 *
 * 목적: 리뷰어 콘텐츠 제출 및 파트너 검수 내역을
 *       mock DB(json-server)의 campaign_contents 컬렉션에 기록합니다.
 *
 * 사용 위치(예정):
 * - 유저 캠페인 관리 > 콘텐츠 등록/수정 모달들
 * - 파트너 캠페인 콘텐츠 검수 페이지 (승인/반려)
 */

import { apiClient } from "@/lib/api/client";

/** json-server campaign_contents 아이템 타입 (필요한 필드만 정의) */
export interface CampaignContentApiItem {
  id: number;
  application_id?: number;
  campaign_id: number;
  reviewer_id?: number;
  content_url: string;
  submitted_at: string;
  status?: string;
  admin_comment?: string | null;
}

/** 콘텐츠 제출 (POST /campaign_contents) */
export const postCampaignContent = (
  body: Omit<CampaignContentApiItem, "id">
): Promise<CampaignContentApiItem> =>
  apiClient.post<CampaignContentApiItem>("/campaign_contents", body).then((res) => res.data);

/** 콘텐츠 상태 변경 (PATCH /campaign_contents/:id) */
export const patchCampaignContent = (
  id: number,
  body: Partial<Omit<CampaignContentApiItem, "id">>
): Promise<void> => apiClient.patch(`/campaign_contents/${id}`, body).then(() => undefined);
