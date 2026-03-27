/* ========================================
   소셜 로그인 콜백 처리 훅
   ======================================== */

/**
 * useLoginCallback
 *
 * 목적: OAuth 콜백에서 받은 code/state를 백엔드로 전달하여
 *       로그인 처리(JWT 저장) 또는 회원가입 분기를 수행
 *
 * 사용 페이지:
 * - /user/login/callback (OAuth 콜백 페이지)
 */

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { processSocialCallback } from "@/lib/api/userAuth";
import { setStoredToken } from "@/lib/auth";
import type { SocialProvider } from "@/types/api/auth";

interface CallbackParams {
  code: string;
  state: string;
}

export const useLoginCallback = (provider: SocialProvider) => {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ code, state }: CallbackParams) => processSocialCallback(provider, code, state),

    onSuccess: (data) => {
      // provider 식별용 임시값 정리
      sessionStorage.removeItem("reviewx_oauth_provider");

      if (data.result === "LOGGED_IN") {
        // JWT 토큰 저장 (기존 auth storage 유틸 활용)
        setStoredToken(data.token.accessToken, "user");
        // 최근 로그인 provider 저장 (다음 로그인 시 배지 표시용)
        localStorage.setItem("reviewx_last_login_provider", provider);
        // 캠페인 관리 페이지로 이동
        router.replace("/user/campaign_management");
      } else if (data.result === "SIGN_UP_REQUIRED") {
        // 회원가입 페이지로 이동 (signupToken + provider 전달)
        router.replace(
          `/user/signup?signupToken=${encodeURIComponent(data.signupToken)}&provider=${data.provider}`
        );
      }
    },

    onError: (error: unknown) => {
      sessionStorage.removeItem("reviewx_oauth_provider");

      // ACCOUNT_BLOCKED: 이용 제한(BLOCKED) 또는 정지(PAUSED) 계정
      const axiosErr = error as { response?: { data?: { code?: string } } };
      const errCode = axiosErr?.response?.data?.code;

      if (errCode === "ACCOUNT_BLOCKED") {
        // 이용 제한 안내 페이지로 이동
        router.replace("/blacklist_info");
        return;
      }
      if (errCode === "ACCOUNT_BANNED") {
        // 정지/탈퇴 안내 페이지로 이동
        router.replace("/pause_info");
        return;
      }

      alert("로그인 중 오류가 발생했습니다.");
      router.replace("/user/login");
    },
  });
};
