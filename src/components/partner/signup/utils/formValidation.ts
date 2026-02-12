/* ========================================
   🛠️ 파트너 회원가입 폼 유효성 검증 함수
   ======================================== */

/**
 * 모듈 목적
 *
 * - 파트너 회원가입 폼 전체 유효성 검증 로직
 * - 모든 필드 검증 후 에러 객체 반환
 * - 빈 필드는 빈 문자열로 에러 상태만 표시 (테두리만 빨간색)
 *
 * 📌 위치 설명:
 * - 이 파일은 파트너 회원가입 페이지에서만 사용되는 유틸리티입니다.
 * - 컴포넌트 폴더 내부에 위치하여 해당 기능과 밀접하게 연관되어 있음을 나타냅니다.
 *
 * 📍 사용 페이지/컴포넌트:
 * - src/app/partner/signup/page.tsx
 *   (파트너 회원가입 페이지에서 폼 제출 시 전체 검증에 사용)
 */

import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
} from "@/utils/validation";
import { validateBusinessNumber } from "./validation";

export interface PartnerSignupFormErrors {
  email?: string;
  password?: string;
  passwordConfirm?: string;
  name?: string;
  phone?: string;
  verificationCode?: string;
  companyName?: string;
  representativeName?: string;
  businessNumber?: string;
  businessRegistration?: string;
  postalCode?: string;
  address?: string;
  detailAddress?: string;
  contactPhone?: string;
  terms?: string;
}

export interface PartnerSignupFormData {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  phone: string;
  isPhoneVerified: boolean;
  companyName: string;
  representativeName: string;
  businessNumber: string;
  businessRegistrationFile: File | null;
  postalCode: string;
  address: string;
  detailAddress: string;
  contactPhone: string;
  serviceTermsAgreed: boolean;
  privacyAgreed: boolean;
  thirdPartyAgreed: boolean;
  advertisingAgreed: boolean;
}

/**
 * 파트너 회원가입 폼 전체 유효성 검증
 *
 * @param formData - 파트너 회원가입 폼 데이터
 * @returns 검증 에러 객체 (빈 필드는 빈 문자열로 표시)
 */
export function validatePartnerSignupForm(
  formData: PartnerSignupFormData
): PartnerSignupFormErrors {
  const errors: PartnerSignupFormErrors = {};

  // 이메일 검증 (빈 필드는 에러 객체에만 저장, 텍스트는 표시 안 함)
  if (!formData.email) {
    errors.email = ""; // 빈 문자열로 에러 상태만 표시 (테두리만 빨간색)
  } else if (!validateEmail(formData.email)) {
    errors.email = "올바른 이메일 형식을 입력해주세요.";
  }

  // 비밀번호 검증 (빈 필드는 에러 객체에만 저장, 텍스트는 표시 안 함)
  if (!formData.password) {
    errors.password = ""; // 빈 문자열로 에러 상태만 표시 (테두리만 빨간색)
  } else if (!validatePassword(formData.password)) {
    errors.password =
      "8~16자 영문, 숫자, 특수문자(!@#$%^&*()-_=+) 조합으로 입력해 주세요.";
  }

  // 비밀번호 확인 검증 (빈 필드는 에러 객체에만 저장, 텍스트는 표시 안 함)
  if (!formData.passwordConfirm) {
    errors.passwordConfirm = ""; // 빈 문자열로 에러 상태만 표시 (테두리만 빨간색)
  } else if (
    !validatePasswordMatch(formData.password, formData.passwordConfirm)
  ) {
    errors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
  }

  // 이름 검증 (빈 필드는 에러 객체에만 저장, 텍스트는 표시 안 함)
  if (!formData.name) {
    errors.name = ""; // 빈 문자열로 에러 상태만 표시 (테두리만 빨간색)
  }

  // 휴대폰 번호 검증 (빈 필드는 에러 객체에만 저장, 텍스트는 표시 안 함)
  if (!formData.phone) {
    errors.phone = ""; // 빈 문자열로 에러 상태만 표시 (테두리만 빨간색)
  } else if (!formData.isPhoneVerified) {
    errors.phone = "휴대폰 인증을 완료해주세요.";
  }

  // 상호명 검증 (빈 필드는 에러 객체에만 저장, 텍스트는 표시 안 함)
  if (!formData.companyName) {
    errors.companyName = ""; // 빈 문자열로 에러 상태만 표시 (테두리만 빨간색)
  }

  // 대표자명 검증 (빈 필드는 에러 객체에만 저장, 텍스트는 표시 안 함)
  if (!formData.representativeName) {
    errors.representativeName = ""; // 빈 문자열로 에러 상태만 표시 (테두리만 빨간색)
  }

  // 사업자등록번호 검증 (빈 필드는 에러 객체에만 저장, 텍스트는 표시 안 함)
  if (!formData.businessNumber) {
    errors.businessNumber = ""; // 빈 문자열로 에러 상태만 표시 (테두리만 빨간색)
  } else if (!validateBusinessNumber(formData.businessNumber)) {
    errors.businessNumber = "올바른 사업자등록번호 형식을 입력해주세요.";
  }

  // 사업자등록증 검증 (빈 필드는 에러 객체에만 저장, 텍스트는 표시 안 함)
  if (!formData.businessRegistrationFile) {
    errors.businessRegistration = ""; // 빈 문자열로 에러 상태만 표시 (테두리만 빨간색)
  }

  // 주소 검증 (빈 필드는 에러 객체에만 저장, 텍스트는 표시 안 함)
  if (!formData.postalCode) {
    errors.postalCode = ""; // 빈 문자열로 에러 상태만 표시 (테두리만 빨간색)
  }
  if (!formData.address) {
    errors.address = ""; // 빈 문자열로 에러 상태만 표시 (테두리만 빨간색)
  }
  if (!formData.detailAddress) {
    errors.detailAddress = ""; // 빈 문자열로 에러 상태만 표시 (테두리만 빨간색)
  }

  // 문의 담당자 휴대폰 번호 검증 (빈 필드는 에러 객체에만 저장, 텍스트는 표시 안 함)
  if (!formData.contactPhone) {
    errors.contactPhone = ""; // 빈 문자열로 에러 상태만 표시 (테두리만 빨간색)
  } else {
    // 휴대폰 번호 형식 검증 (010-1234-5678 형식)
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(formData.contactPhone)) {
      errors.contactPhone =
        "올바른 휴대폰 번호 형식을 입력해주세요. (010-0000-0000)";
    }
  }

  // 약관 동의 검증
  if (
    !formData.serviceTermsAgreed ||
    !formData.privacyAgreed ||
    !formData.thirdPartyAgreed ||
    !formData.advertisingAgreed
  ) {
    errors.terms = "이용 약관에 동의해 주세요.";
  }

  return errors;
}
