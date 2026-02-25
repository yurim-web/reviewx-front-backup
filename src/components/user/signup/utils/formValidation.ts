/* ========================================
   회원가입 폼 유효성 검증 함수
   ======================================== */

/**
 * formValidation
 *
 * 목적: 유저 회원가입 폼의 전체 필드 유효성을 검증하고 에러 객체를 반환합니다.
 *
 * 사용 페이지:
 * - /user/signup (유저 회원가입 > 폼 제출 시 검증)
 */

import {
  validateSignupEmailField,
  validateSignupNameField,
  validateSignupPhoneField,
} from "@/utils/validation/signup";

export interface SignupFormErrors {
  email?: string;
  name?: string;
  phone?: string;
  verificationCode?: string;
  terms?: string;
}

export interface SignupFormData {
  email: string;
  name: string;
  phone: string;
  isPhoneVerified: boolean;
  termsAgreed: boolean;
  privacyAgreed: boolean;
}

/**
 * 회원가입 폼 전체 유효성 검증
 *
 * @param formData - 회원가입 폼 데이터
 * @returns 검증 에러 객체
 */
export function validateSignupForm(formData: SignupFormData): SignupFormErrors {
  const errors: SignupFormErrors = {};

  // 이메일 검증 (선택사항: 소셜 로그인으로 가져온 이메일이므로 빈 값은 통과)
  const emailError = validateSignupEmailField(formData.email, false);
  if (emailError !== undefined) errors.email = emailError;

  // 이름 검증
  const nameError = validateSignupNameField(formData.name, "이름을 입력해주세요.");
  if (nameError !== undefined) errors.name = nameError;

  // 휴대폰 번호 + 인증 검증
  const phoneError = validateSignupPhoneField(
    formData.phone,
    formData.isPhoneVerified,
    "휴대폰 번호를 입력해주세요."
  );
  if (phoneError !== undefined) errors.phone = phoneError;

  // 약관 동의 검증
  if (!formData.termsAgreed || !formData.privacyAgreed) {
    errors.terms = "이용 약관에 동의해 주세요.";
  }

  return errors;
}
