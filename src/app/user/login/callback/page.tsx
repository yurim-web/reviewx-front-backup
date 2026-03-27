/* ========================================
   OAuth 소셜 로그인 콜백 페이지
   ======================================== */

/**
 * LoginCallbackPage
 *
 * 목적: 네이버/카카오 OAuth 인증 완료 후 리다이렉트되는 콜백 페이지
 *       code + state를 백엔드에 전달하여 로그인 또는 회원가입 분기 처리
 *
 * 사용 페이지:
 * - /user/login/callback?code=...&state=...
 *
 * 호출 API:
 * - GET /api/v1/auth/{provider}/callback (소셜 콜백 처리)
 */

"use client";

import { useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLoginCallback } from "@/hooks/user/auth/useLoginCallback";
import Loading from "@/app/loading";
import type { SocialProvider } from "@/types/api/auth";

function LoginCallbackContent() {
  const searchParams = useSearchParams();
  const calledRef = useRef(false);

  // startSocialLogin()에서 저장한 provider 읽기
  const provider =
    (typeof window !== "undefined"
      ? (sessionStorage.getItem("reviewx_oauth_provider") as SocialProvider)
      : null) ?? "naver";

  const { mutate: handleCallback } = useLoginCallback(provider);

  useEffect(() => {
    // 중복 호출 방지 (StrictMode 등)
    if (calledRef.current) return;

    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (code && state) {
      calledRef.current = true;
      handleCallback({ code, state });
    }
  }, [searchParams, handleCallback]);

  return <Loading />;
}

export default function LoginCallbackPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginCallbackContent />
    </Suspense>
  );
}
