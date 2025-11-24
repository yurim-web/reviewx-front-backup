/* ========================================
   🛠️ 회원가입 폼 유효성 검증 함수
   ======================================== */

/**
 * 모듈 목적
 *
 * - 회원가입 폼 전체 유효성 검증 로직
 * - 모든 필드 검증 후 에러 객체 반환
 *
 * 📌 위치 설명:
 * - 이 파일은 사용자 회원가입 페이지에서만 사용되는 유틸리티입니다.
 * - 컴포넌트 폴더 내부에 위치하여 해당 기능과 밀접하게 연관되어 있음을 나타냅니다.
 *
 * 📍 사용 페이지/컴포넌트:
 * - src/app/user/signup/page.tsx
 *   (사용자 회원가입 페이지에서 폼 제출 시 전체 검증에 사용)
 */

import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validatePhone,
} from '@/utils/signup/validation';

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
export function validateSignupForm(formData: SignupFormData): SignupFormErrors {
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
