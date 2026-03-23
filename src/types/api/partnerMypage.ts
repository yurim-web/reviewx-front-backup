/**
 * 파트너 마이페이지 API 타입 정의
 * 프론트엔드 명세서 13, 13.1, 13.2 기준
 */

/** 사업자 구분 */
export type BusinessType = "법인사업자" | "개인사업자";

/** 파트너 프로필 정보 (GET /partner/mypage 응답) */
export interface PartnerProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  profileImage?: string | null;
  businessName: string;
  representativeName: string;
  businessNumber: string;
  businessType: BusinessType;
  businessDocumentUrl?: string | null;
  businessDocumentFileName?: string | null;
  postalCode?: string;
  address?: string;
  detailAddress?: string;
  contactPhone?: string;
  joinDate?: string;
}

/** 내 정보 수정 요청 (PUT /partner/mypage) */
export interface UpdatePartnerProfileRequest {
  phone?: string;
  phoneVerificationToken?: string;
  businessName?: string;
  representativeName?: string;
  businessNumber?: string;
  businessType?: BusinessType;
  postalCode?: string;
  address?: string;
  detailAddress?: string;
  contactPhone?: string;
}

/** 프로필 사진 업로드 응답 */
export interface ProfileImageUploadResponse {
  profileImageUrl: string;
}

/** 사업자등록증 업로드 응답 */
export interface BusinessDocumentUploadResponse {
  documentUrl: string;
  documentFileName: string;
}

/** 비밀번호 변경 요청 (PUT /partner/mypage/password) */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/** 회원 탈퇴 요청 (DELETE /partner/mypage) */
export interface WithdrawRequest {
  reason?: string;
}
