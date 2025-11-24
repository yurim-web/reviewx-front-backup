/* ========================================
   🛠️ 회원가입 폼 유효성 검증 함수
   ======================================== */

/**
 * 모듈 목적
 *
 * - 회원가입 폼 전체 유효성 검증 로직
 * - 모든 필드 검증 후 에러 객체 반환
 */

import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validatePhone,
} from './validation';

export interface SignupFormErrors {
  email?: string;
  password?: string;
  passwordConfirm?: string;
  name?: string;
  phone?: string;
  verificationCode?: string;
  terms?: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  passwordConfirm: string;
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
export function validateSignupForm(
  formData: SignupFormData,
): SignupFormErrors {
  const errors: SignupFormErrors = {};

  // 이메일 검증
  if (!formData.email) {
    errors.email = '아이디(이메일)을 입력해주세요.';
  } else if (!validateEmail(formData.email)) {
    errors.email = '올바른 이메일 형식을 입력해주세요.';
  }

  // 비밀번호 검증
  if (!formData.password) {
    errors.password = '비밀번호를 입력해주세요.';
  } else if (formData.password.length < 8 || formData.password.length > 16) {
    errors.password =
      '8~16자 영문, 숫자, 특수문자(!@#$%^&*()-_=+) 조합으로 입력해 주세요.';
  } else if (!validatePassword(formData.password)) {
    errors.password =
      '8~16자 영문, 숫자, 특수문자(!@#$%^&*()-_=+) 조합으로 입력해 주세요.';
  }

  // 비밀번호 확인 검증
  if (!formData.passwordConfirm) {
    errors.passwordConfirm = '비밀번호 확인을 입력해주세요.';
  } else if (
    !validatePasswordMatch(formData.password, formData.passwordConfirm)
  ) {
    errors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
  }

  // 이름 검증
  if (!formData.name) {
    errors.name = '이름을 입력해주세요.';
  }

  // 휴대폰 번호 검증
  if (!formData.phone) {
    errors.phone = '휴대폰 번호를 입력해주세요.';
  } else if (!formData.isPhoneVerified) {
    errors.phone = '휴대폰 인증을 완료해주세요.';
  }

  // 약관 동의 검증
  if (!formData.termsAgreed || !formData.privacyAgreed) {
    errors.terms = '이용 약관에 동의해 주세요.';
  }

  return errors;
}

