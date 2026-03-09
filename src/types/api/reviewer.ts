/* ========================================
   리뷰어 프로필 API 타입
   ======================================== */

/**
 * 리뷰어 프로필 API 타입
 *
 * 목적: 리뷰어 프로필 GET/PATCH API의 요청·응답 타입 정의
 *
 * 사용 위치:
 * - src/lib/api/reviewer.ts
 * - src/hooks/user/mypage/useReviewerProfile.ts
 * - src/hooks/user/mypage/useEditProfile.ts
 */

/**
 * GET /reviewer/mypage/profile/:id 응답 타입
 */
export interface ReviewerProfileResponse {
  id: number;
  name?: string;
  nickname?: string;
  email?: string;
  phone?: string;
  address?: string;
  postal_code?: string;
  detail_address?: string;
  bank?: string;
  account_holder?: string;
  account_number?: string;
  ssn_front?: string;
  ssn_back?: string;
  profile_image?: string;
  channel_details?: Array<{
    name: string;
    url: string;
    status: "connected" | "disconnected";
  }>;
  channels?: string[];
  current_points?: number;
  withdrawn_points?: number;
  daily_visits?: number;
  total_visits?: number;
  neighbors?: number;
  join_date?: string;
  last_access_date?: string;
}
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
