/**
 * 파트너 아이디/비밀번호 찾기 API 타입 정의
 * 프론트엔드 기능명세서 기준: 4. 아이디/비밀번호 찾기
 */

/** POST /partner/auth/find-id 요청 */
export interface FindPartnerIdRequest {
  name: string;
  phone: string;
  verification_code: string;
}

/** POST /partner/auth/find-id 응답 */
export interface FindPartnerIdResponse {
  result: "OK";
  email: string;
  signupDate: string;
}

/** POST /partner/auth/find-password 요청 */
export interface FindPartnerPasswordRequest {
  email: string;
  phone: string;
  verification_code: string;
}

/** POST /partner/auth/find-password 응답 */
export interface FindPartnerPasswordResponse {
  result: "OK";
}

/** POST /partner/auth/send-verification 요청 */
export interface PartnerSendVerificationRequest {
  phone: string;
}

/** POST /partner/auth/send-verification 응답 */
export interface PartnerSendVerificationResponse {
  result: "OK";
  verificationId: string;
  expireAt: string;
}

/** POST /partner/auth/verify-code 요청 */
export interface PartnerVerifyCodeRequest {
  verificationId: string;
  code: string;
}

/** POST /partner/auth/verify-code 응답 */
export interface PartnerVerifyCodeResponse {
  result: "VERIFIED";
  verifiedPhoneToken: string;
}

/** POST /partner/auth/reset-password 요청 */
export interface ResetPartnerPasswordRequest {
  email: string;
  newPassword: string;
}

/** POST /partner/auth/reset-password 응답 */
export interface ResetPartnerPasswordResponse {
  result: "OK";
}
