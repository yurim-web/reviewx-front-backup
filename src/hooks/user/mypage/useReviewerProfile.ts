/* ========================================
   리뷰어 프로필 조회 훅
   ======================================== */

/**
 * useReviewerProfile
 *
 * 목적: 서버에서 리뷰어 프로필을 조회하는 React Query 훅
 *
 * 사용 페이지:
 * - /user/mypage/edit (내 정보 수정)
 * - /user/mypage/profile (프로필 보기)
 * - /user/mypage/address (주소 관리)
 * - /user/mypage/channel (채널 관리)
 */

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchReviewerProfile } from "@/lib/api/reviewer";
import type { ReviewerProfileResponse } from "@/types/api/reviewer";

/**
 * mock용 리뷰어 ID 매핑
 * auth userId(string) → mock DB reviewerId(number)
 */
export function getReviewerIdNum(userId?: string): number | null {
  if (!userId) return null;
  if (userId.includes("kakao")) return 1;
  if (userId.includes("naver")) return 2;
  return 1;
}

const PROFILE_QUERY_KEY = "reviewerProfile";

export function useReviewerProfile(userId?: string) {
  const reviewerIdNum = getReviewerIdNum(userId);

  return useQuery<ReviewerProfileResponse>({
    queryKey: [PROFILE_QUERY_KEY, reviewerIdNum],
    queryFn: () => fetchReviewerProfile(reviewerIdNum!),
    enabled: !!reviewerIdNum,
    staleTime: 30_000,
  });
}

/**
 * 프로필 쿼리 무효화 (수정 후 재조회용)
 */
export function useInvalidateReviewerProfile() {
  const queryClient = useQueryClient();
  return (userId?: string) => {
    const reviewerIdNum = getReviewerIdNum(userId);
    if (reviewerIdNum) {
      queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY, reviewerIdNum] });
    }
  };
}
