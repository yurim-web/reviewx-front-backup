/* ========================================
   리뷰어 API 함수 (프로필 + 캠페인 관리)
   ======================================== */

/**
 * reviewer API
 *
 * 목적: 리뷰어 프로필 조회·수정 + 캠페인 관리 API 함수
 *
 * 사용 위치:
 * - src/hooks/user/mypage/useReviewerProfile.ts
 * - src/hooks/user/mypage/useEditProfile.ts
 * - src/hooks/user/campaign_management/useAppliedCampaigns.ts
 * - src/hooks/user/campaign_management/useSelectedCampaigns.ts
 * - src/app/user/mypage/channel/connect/page.tsx
 * - src/app/user/mypage/address/page.tsx
 */

import { apiClient } from "@/lib/api/client";
import type {
  ReviewerProfileResponse,
  ReviewerProfilePatchBody,
  ReviewerEditResponse,
  ReviewerChannelResponse,
} from "@/types/api/reviewer";

// ────────────────────────────────────────────────────────────────────────────────
// 캠페인 관리 타입
// ────────────────────────────────────────────────────────────────────────────────

export interface ReviewerCampaignItem {
  id: string;
  title: string;
  category: string;
  image: string;
  status: "신청완료" | "선정완료" | "콘텐츠등록" | "완료" | "취소/반려";
  remainingDays: number;
  statusMessage: string;
  type: "배송형" | "방문형" | "구매평" | "기자단" | "미션형";
  isUrgent: boolean;
  hasContent?: boolean;
  isPenalty?: boolean;
  extensionCount?: number;
  contentType?: "link" | "image" | "both";
  reviewer_id: number;
}

// ────────────────────────────────────────────────────────────────────────────────
// 캠페인 관리 API
// ────────────────────────────────────────────────────────────────────────────────

/**
 * 리뷰어 캠페인 관리 목록 조회
 * GET /reviewer/mypage/campaigns
 * (리뷰어 ID는 Bearer 토큰으로 식별 — query param 불필요)
 */
export const fetchReviewerCampaigns = (_reviewerId: number): Promise<ReviewerCampaignItem[]> =>
  apiClient.get<ReviewerCampaignItem[]>("/api/v1/reviewer/campaigns").then((r) => r.data);

// ────────────────────────────────────────────────────────────────────────────────
// 프로필 API
// ────────────────────────────────────────────────────────────────────────────────

/**
 * 리뷰어 프로필 조회 (R-28)
 * GET /user/mypage/profile (Bearer 토큰으로 식별)
 * ⚠️ reviewerId 파라미터는 하위 호환용 — 실제로는 사용하지 않음
 */
export const fetchReviewerProfile = (_reviewerId?: number): Promise<ReviewerProfileResponse> =>
  apiClient.get<ReviewerProfileResponse>("/api/v1/reviewer/mypage/profile").then((r) => r.data);

/**
 * 리뷰어 내 정보 수정 페이지 데이터 조회 (R-31)
 * GET /user/mypage/edit (Bearer 토큰으로 식별)
 */
export const fetchReviewerEdit = (): Promise<ReviewerEditResponse> =>
  apiClient.get<ReviewerEditResponse>("/api/v1/reviewer/mypage/edit").then((r) => r.data);

/**
 * 리뷰어 채널 목록 조회 (R-29)
 * GET /user/mypage/channel (Bearer 토큰으로 식별)
 */
export const fetchReviewerChannels = (): Promise<ReviewerChannelResponse> =>
  apiClient.get<ReviewerChannelResponse>("/api/v1/reviewer/mypage/channels").then((r) => r.data);

/**
 * 리뷰어 채널 등록/수정 (R-30)
 * POST /user/mypage/channel
 */
export const updateReviewerChannel = (body: {
  channelId: number;
  externalId?: string;
  channelUrl?: string;
}): Promise<void> => apiClient.put("/api/v1/reviewer/mypage/channels", body).then(() => undefined);

/**
 * 리뷰어 프로필 수정 (R-32)
 * POST /user/mypage/edit (Bearer 토큰으로 식별)
 * ⚠️ reviewerId 파라미터는 하위 호환용 — 실제로는 사용하지 않음
 */
export const patchReviewerProfile = (
  _reviewerId: number,
  body: ReviewerProfilePatchBody
): Promise<void> => apiClient.put("/api/v1/reviewer/mypage/edit", body).then(() => undefined);
