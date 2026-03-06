/* ========================================
   리뷰어 프로필 API 함수 (mock)
   ======================================== */

/**
 * reviewer API (쓰기)
 *
 * 목적: 리뷰어 프로필·계좌·채널·주소 수정 API 함수 (mock)
 *
 * 사용 위치:
 * - src/hooks/user/mypage/useEditProfile.ts
 * - src/app/user/mypage/channel/connect/page.tsx
 * - src/app/user/mypage/address/page.tsx
 */

import { apiClient } from "@/lib/api/client";
import type { ReviewerProfilePatchBody } from "@/types/api/reviewer";

/**
 * 리뷰어 프로필 수정
 * PATCH /reviewer/mypage/profile/:id → /reviewers/:id
 */
export const patchReviewerProfile = (
  reviewerId: number,
  body: ReviewerProfilePatchBody
): Promise<void> =>
  apiClient.patch(`/reviewer/mypage/profile/${reviewerId}`, body).then(() => undefined);
