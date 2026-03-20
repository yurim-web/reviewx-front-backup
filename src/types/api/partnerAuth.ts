/**
 * 파트너 인증 API 타입 정의
 * 백엔드 API 기준: 03. 파트너 로그인 / 04. 세션/자동로그인 상태 확인
 */

// ========================================
// POST /partner/login
// ========================================

/** 파트너 로그인 요청 */
export interface PartnerLoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/** 로그인 응답 내 user 객체 */
export interface PartnerLoginUser {
  userId: number;
  role: "PARTNER";
  email: string;
  name: string;
  phoneNum: string;
  status: string;
}

/** 로그인 응답 내 partner 객체 */
export interface PartnerLoginPartner {
  partnerId: number;
  businessName: string;
  ceoName: string;
  businessNumber: string;
  grade: string;
}

/** 로그인 응답 내 next 객체 */
export interface PartnerLoginNext {
  action: "REDIRECT";
  redirectPath: string;
}

/** 파트너 로그인 응답 (백엔드 스펙: result + data wrapper) */
export interface PartnerLoginResponse {
  result: "OK";
  generatedAt: string;
  data: {
    user: PartnerLoginUser;
    partner: PartnerLoginPartner;
    next: PartnerLoginNext;
  };
}

// ========================================
// GET /partner/session
// ========================================

/** 세션 응답 내 user 객체 (로그인보다 필드 많음) */
export interface PartnerSessionUser {
  userId: number;
  role: "PARTNER";
  email: string;
  name: string;
  phoneNum: string;
  address: string;
  addressDetail: string;
  postNumber: number;
  status: string;
}

/** 세션 응답 내 partner 객체 (csNumber 추가) */
export interface PartnerSessionPartner {
  partnerId: number;
  businessName: string;
  ceoName: string;
  businessNumber: string;
  csNumber: string;
  grade: string;
}

/** 세션 응답 — AUTHENTICATED */
export interface PartnerSessionAuthenticated {
  result: "AUTHENTICATED";
  generatedAt: string;
  user: PartnerSessionUser;
  partner: PartnerSessionPartner;
}

/** 세션 응답 — UNAUTHENTICATED */
export interface PartnerSessionUnauthenticated {
  result: "UNAUTHENTICATED";
  generatedAt: string;
}

export type PartnerSessionResponse = PartnerSessionAuthenticated | PartnerSessionUnauthenticated;

// ========================================
// 에러 응답
// ========================================

/** 백엔드 에러 응답 구조 */
export interface PartnerAuthError {
  result: string;
  generatedAt: string;
  error: {
    code: string;
    message: string;
  };
}
