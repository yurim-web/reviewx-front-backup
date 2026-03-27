/* ========================================
   리뷰어 소셜 로그인 API
   ======================================== */

/**
 * userAuth
 *
 * 목적: 리뷰어 소셜 로그인(네이버/카카오), 회원가입, 회원 탈퇴 API 함수
 *
 * 사용 페이지:
 * - /user/login (소셜 로그인 버튼 클릭)
 * - /user/login/callback (OAuth 콜백 처리)
 * - /user/signup (회원가입)
 * - /blacklist_info (이용 제한 안내 → 회원 탈퇴)
 */

import { apiClient } from "@/lib/api/client";
import type {
  SocialProvider,
  SocialCallbackResponse,
  SignupPageData,
  ReviewerSignupRequest,
  ReviewerSignupResponse,
  SignupFinishResponse,
  FindAccountRequest,
  FindAccountResponse,
} from "@/types/api/auth";

/**
 * API 1: 소셜 로그인 시작
 * 버튼 클릭 → 브라우저를 서버 OAuth 인가 엔드포인트로 이동
 * 서버가 네이버/카카오 로그인 화면으로 302 Redirect 처리
 * provider를 sessionStorage에 저장해 콜백 페이지에서 식별
 */
export const startSocialLogin = (provider: SocialProvider): void => {
  sessionStorage.setItem("reviewx_oauth_provider", provider);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
  window.location.href = `${baseUrl}/api/v1/auth/${provider}/authorize`;
};

/**
 * API 2: 소셜 콜백 처리
 * OAuth 콜백에서 받은 code + state를 백엔드로 전달 (GET + query params)
 * 서버가 소셜 토큰 교환 → 회원 조회 → LOGGED_IN 또는 SIGN_UP_REQUIRED 응답
 */
export const processSocialCallback = async (
  provider: SocialProvider,
  code: string,
  state: string
): Promise<SocialCallbackResponse> => {
  const { data } = await apiClient.get<SocialCallbackResponse>(
    `/api/v1/auth/${provider}/callback`,
    { params: { code, state } }
  );
  return data;
};

/**
 * 회원가입 페이지 진입 (signupToken 검증 + prefill 데이터 로드)
 * GET /reviewer/sign-up?signupToken={token}
 */
export const getSignupPage = async (signupToken: string): Promise<SignupPageData> => {
  const { data } = await apiClient.get<{ result: string; data: SignupPageData }>(
    "/api/v1/reviewer/sign-up",
    {
      params: { signupToken },
    }
  );
  return data.data;
};

/**
 * 회원가입 완료
 * POST /api/v1/reviewer/sign-up
 */
export const reviewerSignup = async (
  body: ReviewerSignupRequest
): Promise<ReviewerSignupResponse> => {
  const { data } = await apiClient.post<ReviewerSignupResponse>("/api/v1/reviewer/sign-up", body);
  return data;
};

/**
 * 계정 찾기 (휴대폰 인증 후 등록된 소셜 계정 조회)
 * POST /api/v1/auth/find-account
 */
export const findAccount = async (body: FindAccountRequest): Promise<FindAccountResponse> => {
  const { data } = await apiClient.post<FindAccountResponse>("/api/v1/auth/find-account", body);
  return data;
};

/**
 * 회원가입 완료 상태 확인
 * GET /api/v1/reviewer/sign-up/finish
 * 비정상 접근 방지용 (회원가입 완료 후에만 접근 가능)
 */
export const getSignupFinish = async (): Promise<SignupFinishResponse> => {
  const { data } = await apiClient.get<SignupFinishResponse>("/api/v1/reviewer/sign-up/finish");
  return data;
};

/**
 * 회원 탈퇴 API
 * 이용 제한 안내 페이지(/blacklist_info)에서 회원 탈퇴 시 호출
 * TODO: 백엔드에 해당 엔드포인트(DELETE /api/v1/reviewer/withdraw)가 아직 존재하지 않음 — 확정 후 URL 업데이트 필요
 */
export const withdrawReviewer = async (): Promise<void> => {
  await apiClient.delete("/api/v1/reviewer/withdraw");
};

/**
 * 최근 로그인 소셜 제공자 조회
 * localStorage에서 마지막 로그인 provider를 읽어 반환
 */
export const getLastLoginProvider = (): SocialProvider | null => {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("reviewx_last_login_provider");
  return (stored as SocialProvider) ?? null;
};
