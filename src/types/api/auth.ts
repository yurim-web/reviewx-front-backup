/* ========================================
   🔐 인증 관련 API Response 타입
   ======================================== */

/**
 * 모듈 목적
 *
 * - 로그인, 회원가입, 비밀번호 재설정 등 인증 관련 API 응답 타입 정의
 * - API 연동 시 타입 안전성 보장
 *
 * 📌 사용 위치:
 * - API 호출 함수에서 응답 타입으로 사용
 * - 인증 관련 hooks에서 사용
 */

/**
 * 공통 API 응답 구조
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * 사용자 정보 (로그인 응답에 포함)
 */
export interface UserInfo {
  id: string;
  email: string;
  name: string;
  phone: string;
  profile_image?: string;
  user_type: "reviewer" | "partner" | "admin";
  created_at: string;
}

/**
 * 파트너 정보 (로그인 응답에 포함)
 */
export interface PartnerInfo {
  id: string;
  email: string;
  company_name: string;
  business_number: string;
  contact_name: string;
  contact_phone: string;
  created_at: string;
}

/**
 * 로그인 응답 (리뷰어)
 */
export interface LoginResponse {
  success: boolean;
  data: {
    access_token: string;
    refresh_token: string;
    user: UserInfo;
  };
  message?: string;
}

/**
 * 파트너 로그인 응답
 */
export interface PartnerLoginResponse {
  success: boolean;
  data: {
    access_token: string;
    refresh_token: string;
    partner: PartnerInfo;
  };
  message?: string;
}

/**
 * 회원가입 응답 (리뷰어)
 */
export interface SignupResponse {
  success: boolean;
  data: {
    user_id: string;
    email: string;
    name: string;
  };
  message?: string;
}

/**
 * 파트너 회원가입 응답
 */
export interface PartnerSignupResponse {
  success: boolean;
  data: {
    partner_id: string;
    company_name: string;
    business_number: string;
  };
  message?: string;
}

/**
 * 이메일 찾기 응답
 */
export interface FindEmailResponse {
  success: boolean;
  data: {
    email: string;
    masked_email: string; // 예: "user***@example.com"
  };
  message?: string;
}

/**
 * 비밀번호 재설정 토큰 발급 응답
 */
export interface ResetPasswordTokenResponse {
  success: boolean;
  data: {
    reset_token: string;
    expires_at: string;
  };
  message?: string;
}

/**
 * 비밀번호 재설정 완료 응답
 */
export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

/**
 * 휴대폰 인증 코드 전송 응답
 */
export interface SendVerificationCodeResponse {
  success: boolean;
  data: {
    verification_id: string;
    expires_at: string;
  };
  message?: string;
}

/**
 * 휴대폰 인증 코드 확인 응답
 */
export interface VerifyPhoneResponse {
  success: boolean;
  data: {
    verified: boolean;
  };
  message?: string;
}

/**
 * 토큰 갱신 응답
 */
export interface RefreshTokenResponse {
  success: boolean;
  data: {
    access_token: string;
    refresh_token: string;
  };
  message?: string;
}

/**
 * 로그아웃 응답
 */
export interface LogoutResponse {
  success: boolean;
  message: string;
}

/* ========================================
   소셜 로그인 관련 타입 (리뷰어)
   ======================================== */

/** 소셜 로그인 제공자 */
export type SocialProvider = "naver" | "kakao";

/** 회원가입 사전 정보 (소셜 플랫폼에서 가져온 사용자 정보) */
export interface SocialPrefill {
  email: string;
  name: string;
  nickname: string;
  profileImageUrl: string;
  gender?: string;
  birthday?: string;
  ageRange?: string;
  birthyear?: string;
  phoneNum?: string;
}

/** 로그인 성공 시 사용자 정보 */
export interface SocialLoginUser {
  userId: number;
  role: "REVIEWER" | "PARTNER" | "ADMIN";
  email: string;
  name: string;
}

/** JWT 토큰 */
export interface SocialLoginToken {
  accessToken: string;
  refreshToken: string;
}

/**
 * GET /api/v1/auth/{provider}/callback 응답 (Discriminated Union)
 * - LOGGED_IN: 기존 회원 → JWT 발급
 * - SIGN_UP_REQUIRED: 미가입자 → signupToken + prefill 발급
 */
export type SocialCallbackResponse =
  | {
      result: "LOGGED_IN";
      provider: "NAVER" | "KAKAO";
      user: SocialLoginUser;
      token: SocialLoginToken;
      next: { action: "REDIRECT"; redirectPath: string };
    }
  | {
      result: "SIGN_UP_REQUIRED";
      provider: "NAVER" | "KAKAO";
      signupToken: string;
      prefill: SocialPrefill;
      next: { action: "SIGN_UP"; redirectPath: string };
    };

/* ========================================
   리뷰어 회원가입 관련 타입
   ======================================== */

/** 회원가입 페이지 진입 응답 (GET /reviewer/sign-up?signupToken=...) */
export interface SignupPageData {
  email: string;
  provider: "NAVER" | "KAKAO";
}

/** 휴대폰 인증번호 요청 */
export interface PhoneVerifyRequest {
  phoneNum: string;
}
export interface PhoneVerifyResponse {
  result: "OK";
  verificationId: string;
  expiresInSeconds: number;
  cooldownSeconds: number;
  sentChannel: string;
  fallbackUsed: boolean;
}

/** 인증번호 확인 */
export interface PhoneVerifyConfirmRequest {
  verificationId: string;
  code: string;
}
export interface PhoneVerifyConfirmResponse {
  result: "VERIFIED";
  verifiedPhoneToken: string;
  verifiedAt: string;
}

/** 회원가입 완료 요청 */
export interface ReviewerSignupAgreements {
  termsServicePrivacyAgreed: boolean;
  privacyThirdPartyAgreed: boolean;
  marketingPrivacyAgreed?: boolean;
}
export interface ReviewerSignupRequest {
  signupToken: string;
  email: string;
  name: string;
  phoneNum: string;
  agreements: ReviewerSignupAgreements;
}
export interface ReviewerSignupResponse {
  result: "SIGNED_UP_AND_LOGGED_IN";
  user: {
    userId: number;
    role: "REVIEWER";
    email: string;
    name: string;
    phoneNum: string;
  };
  token: {
    accessToken: string;
    refreshToken: string;
  };
  next: {
    action: "REDIRECT";
    redirectPath: string;
  };
}

/** 회원가입 완료 확인 응답 (GET /api/v1/reviewer/sign-up/finish) */
export interface SignupFinishResponse {
  result: "OK";
  page: "SIGN_UP_FINISH";
  message: string;
}

/**
 * 계정 찾기 요청 (API 3: POST /api/v1/auth/find-account)
 * ⚠️ 엔드포인트 백엔드 확정 후 경로 업데이트 필요
 */
export interface FindAccountRequest {
  phoneNum: string;
  verifiedPhoneToken: string;
  accountType: "user";
}

/**
 * 계정 찾기 응답
 */
export type FindAccountResponse =
  | { result: "FOUND"; provider: "NAVER" | "KAKAO"; maskedEmail: string }
  | { result: "NOT_FOUND" };
