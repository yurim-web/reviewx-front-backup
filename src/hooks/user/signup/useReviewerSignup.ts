/* ========================================
   리뷰어 회원가입 훅
   ======================================== */

/**
 * useReviewerSignup
 *
 * 목적: 회원가입 페이지 진입(signupToken 검증) + 회원가입 완료 API 호출
 *
 * 사용 페이지:
 * - /user/signup (리뷰어 회원가입)
 * - /user/signup/complete (회원가입 완료)
 */

import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getSignupPage, reviewerSignup, getSignupFinish } from "@/lib/api/userAuth";
import { setStoredToken } from "@/lib/auth";
import type { ReviewerSignupRequest } from "@/types/api/auth";

/** signupToken 검증 및 이메일 prefill */
export const useSignupPage = (signupToken: string) =>
  useQuery({
    queryKey: ["signup", "page", signupToken],
    queryFn: () => getSignupPage(signupToken),
    enabled: !!signupToken,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

/** 회원가입 완료 상태 확인 (비정상 접근 방지) */
export const useSignupFinish = () =>
  useQuery({
    queryKey: ["signup", "finish"],
    queryFn: getSignupFinish,
    retry: false,
    staleTime: 0,
  });

/** 회원가입 완료 */
export const useReviewerSignup = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (body: ReviewerSignupRequest) => reviewerSignup(body),

    onSuccess: (data) => {
      // JWT 토큰 저장
      setStoredToken(data.token.accessToken, "user");
      // 회원가입 완료 페이지로 이동
      const nickname = data.user.name || "회원";
      router.replace(`/user/signup/complete?nickname=${encodeURIComponent(nickname)}`);
    },
  });
};
