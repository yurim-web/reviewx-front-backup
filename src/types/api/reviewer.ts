/* ========================================
   리뷰어 프로필 API 타입 (mock)
   ======================================== */

/**
 * ReviewerProfilePatchBody
 *
 * 목적: PATCH /reviewer/mypage/profile/:id → /reviewers/:id
 *       리뷰어 프로필·계좌·채널·주소 수정 Request body (mock)
 *
 * 사용 위치:
 * - src/lib/api/reviewer.ts
 * - src/hooks/user/mypage/useEditProfile.ts
 * - src/app/user/mypage/channel/connect/page.tsx
 * - src/app/user/mypage/address/page.tsx
 */
export interface ReviewerProfilePatchBody {
  name?: string;
  nickname?: string;
  phone?: string;
  bank?: string;
  account_number?: string;
  account_holder?: string;
  ssn_front?: string;
  ssn_back?: string;
  postal_code?: string;
  address?: string;
  detail_address?: string;
  channel_details?: Array<{
    name: string;
    url: string;
    status: "connected" | "disconnected";
  }>;
}
