/**
 * 파트너 회원가입 API 타입 정의
 * 백엔드 API 기준: 01. 파트너 회원가입 페이지 조회 / 02. 파트너 회원가입
 */

// ========================================
// GET /partner/signup — 회원가입 페이지 조회
// ========================================

/** 약관 코드 ENUM */
export type TermsCode =
  | "TERMS_SERVICE"
  | "PRIVACY_COLLECTION_USE"
  | "AD_PROMO_COMPLIANCE"
  | "PRIVACY_THIRD_PARTY"
  | "MARKETING_RECEIVE"
  | "MARKETING_THIRD_PARTY";

/** 약관 항목 */
export interface TermsItem {
  termsId: number;
  termsCode: TermsCode;
  title: string;
  isRequired: boolean;
  content: string;
}

/** 은행 항목 */
export interface BankItem {
  bankCode: string;
  bankName: string;
}

/** GET /partner/signup 응답 */
export interface PartnerSignupPageResponse {
  result: "OK";
  generatedAt: string;
  data: {
    terms: TermsItem[];
    banks: BankItem[];
  };
}

// ========================================
// POST /partner/signup — 파트너 회원가입
// ========================================

/** 약관 동의 객체 (multipart form 내 agreements.*) */
export interface PartnerSignupAgreements {
  /** [user] 이용약관 동의 (필수) */
  termsServicePrivacyAgreed: boolean;
  /** [user] 개인정보 제3자 동의 (필수) */
  privacyThirdPartyAgreed: boolean;
  /** [user] 마케팅 동의 (선택) */
  marketingPrivacyAgreed?: boolean;
  /** [partner] 서비스 이용 약관 동의 (필수) */
  termsServiceAgreed: boolean;
  /** [partner] 광고/홍보 준수사항 동의 (필수) */
  termsAdPromoComplianceAgreed: boolean;
  /** [partner] 제3자 정보 제공 동의 (선택) */
  marketingThirdPartyProvisionAgreed?: boolean;
}

/** POST /partner/signup 요청 (multipart/form-data) */
export interface PartnerSignupRequest {
  email: string;
  password: string;
  name: string;
  phoneNum: string;
  businessName: string;
  ceoName: string;
  businessNumber: string;
  businessLicenseFile: File;
  postNumber: number;
  address: string;
  addressDetail: string;
  csNumber: string;
  agreements: PartnerSignupAgreements;
}

/** 응답 내 user 객체 */
export interface PartnerSignupUser {
  userId: number;
  email: string;
  name: string;
  phoneNum: string;
  address: string;
  addressDetail: string;
  postNumber: number;
  status: string;
  createdAt: string;
}

/** 응답 내 사업자등록증 파일 */
export interface BusinessLicenseFile {
  fileId: number;
  fileUrl: string;
}

/** 응답 내 partner 객체 */
export interface PartnerSignupPartner {
  partnerId: number;
  businessName: string;
  ceoName: string;
  businessNumber: string;
  csNumber: string;
  grade: string;
  businessLicenseFile: BusinessLicenseFile;
}

/** 응답 내 next 객체 */
export interface PartnerSignupNext {
  action: "REDIRECT";
  redirectPath: string;
}

/** POST /partner/signup 응답 */
export interface PartnerSignupResponse {
  result: "OK";
  generatedAt: string;
  data: {
    user: PartnerSignupUser;
    partner: PartnerSignupPartner;
    next: PartnerSignupNext;
  };
}

// ========================================
// 에러 응답
// ========================================

/** 회원가입 에러 코드 */
export type PartnerSignupErrorCode =
  | "DUPLICATE_EMAIL"
  | "INVALID_PASSWORD_FORMAT"
  | "REQUIRED_TERMS_NOT_AGREED"
  | "I_E16"
  | "I_E17"
  | "FILE_SIZE_EXCEEDED"
  | "INVALID_FILE_TYPE"
  | "INTERNAL_SERVER_ERROR";

/** 회원가입 에러 응답 */
export interface PartnerSignupError {
  result: "ERROR";
  generatedAt: string;
  error: {
    code: PartnerSignupErrorCode;
    message: string;
  };
}
