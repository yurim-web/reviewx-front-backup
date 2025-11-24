/* ========================================
   🛠️ 파트너 회원가입 유효성 검증 함수 모음
   ======================================== */

/**
 * 모듈 목적
 *
 * - 파트너 회원가입 폼의 유효성 검증 로직
 * - 사업자등록번호 형식 검증
 * - 기존 유저 검증 함수 재사용
 */

import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validatePhone,
} from '@/utils/user/signup/validation';

/**
 * 사업자등록번호 형식 검증
 * @param businessNumber - 검증할 사업자등록번호 (예: 122-12-12345)
 * @returns 유효한 형식이면 true, 아니면 false
 */
export function validateBusinessNumber(businessNumber: string): boolean {
  const businessNumberRegex = /^\d{3}-\d{2}-\d{5}$/;
  return businessNumberRegex.test(businessNumber);
}

// 기존 유저 검증 함수들 재사용
export {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validatePhone,
} from '@/utils/user/signup/validation';
