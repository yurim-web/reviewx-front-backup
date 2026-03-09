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
import type { ReviewerProfileResponse, ReviewerProfilePatchBody } from "@/types/api/reviewer";

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
 * GET /reviewer/mypage/campaigns?reviewer_id=:id → /reviewer_campaign_management?reviewer_id=:id
 */
export const fetchReviewerCampaigns = (reviewerId: number): Promise<ReviewerCampaignItem[]> =>
  apiClient
    .get<ReviewerCampaignItem[]>("/reviewer/mypage/campaigns", {
      params: { reviewer_id: reviewerId },
    })
    .then((r) => r.data);

// ────────────────────────────────────────────────────────────────────────────────
// 프로필 API
// ────────────────────────────────────────────────────────────────────────────────

/**
 * 리뷰어 프로필 조회
 * GET /reviewer/mypage/profile/:id → /reviewers/:id
 */
export const fetchReviewerProfile = (reviewerId: number): Promise<ReviewerProfileResponse> =>
  apiClient
    .get<ReviewerProfileResponse>(`/reviewer/mypage/profile/${reviewerId}`)
    .then((r) => r.data);

/**
 * 리뷰어 프로필 수정
 * PATCH /reviewer/mypage/profile/:id → /reviewers/:id
 */
export const patchReviewerProfile = (
  reviewerId: number,
  body: ReviewerProfilePatchBody
): Promise<void> =>
  apiClient.patch(`/reviewer/mypage/profile/${reviewerId}`, body).then(() => undefined);
