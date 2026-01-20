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
  user_type: 'reviewer' | 'partner' | 'admin';
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
