/* ========================================
   🔐 인증 관련 유효성 검증
   ======================================== */

/**
 * 기존 파일에서 이동:
 * - src/utils/signup/validation.ts 의 내용을 개선하여 여기로 통합
 *
 * 개선 사항:
 * - 상수를 constants 폴더에서 가져옴
 * - 에러 메시지를 constants에서 가져옴
 * - 더 명확한 타입 정의
 */

import { REGEX_PATTERNS, PASSWORD_CONSTRAINTS } from '../constants/validation';

/* ========================================
   📧 이메일 검증
   ======================================== */

/**
 * 이메일 형식 검증
 *
 * @param email - 검증할 이메일 주소
 * @returns 유효한 이메일 형식이면 true, 아니면 false
 *
 * 예시:
 * - validateEmail("test@example.com") → true
 * - validateEmail("invalid-email") → false
 */
export function validateEmail(email: string): boolean {
  if (!email) return false;
  return REGEX_PATTERNS.EMAIL.test(email);
}

/* ========================================
   🔒 비밀번호 검증
   ======================================== */

/**
 * 비밀번호 형식 검증
 *
 * @param password - 검증할 비밀번호
 * @returns 유효한 비밀번호 형식이면 true, 아니면 false
 *
 * 규칙:
 * - 8~16자
 * - 영문, 숫자, 특수문자 포함
 *
 * 예시:
 * - validatePassword("Test123!") → true
 * - validatePassword("short") → false
 */
export function validatePassword(password: string): boolean {
  if (!password) return false;

  // 길이 검증 (8~16자)
  if (
    password.length < PASSWORD_CONSTRAINTS.MIN_LENGTH ||
    password.length > PASSWORD_CONSTRAINTS.MAX_LENGTH
  ) {
    return false;
  }

  // 특수문자 포함 여부 확인
  const hasLetter = REGEX_PATTERNS.HAS_LETTER.test(password);
  const hasNumber = REGEX_PATTERNS.HAS_NUMBER.test(password);
  const hasSpecial = REGEX_PATTERNS.SPECIAL_CHARS.test(password);

  return hasLetter && hasNumber && hasSpecial;
}

/**
 * 비밀번호 일치 확인
 *
 * @param password - 원본 비밀번호
 * @param passwordConfirm - 확인용 비밀번호
 * @returns 일치하면 true, 아니면 false
 */
export function validatePasswordMatch(password: string, passwordConfirm: string): boolean {
  if (!password || !passwordConfirm) return false;
  return password === passwordConfirm;
}

/* ========================================
   📱 휴대폰 번호 검증
   ======================================== */

/**
 * 휴대폰 번호 형식 검증
 *
 * @param phone - 검증할 휴대폰 번호 (010-XXXX-XXXX 형식)
 * @returns 유효한 형식이면 true, 아니면 false
 *
 * 예시:
 * - validatePhone("010-1234-5678") → true
 * - validatePhone("01012345678") → false
 */
export function validatePhone(phone: string): boolean {
  if (!phone) return false;
  return REGEX_PATTERNS.PHONE.test(phone);
}

/* ========================================
   🔢 인증번호 검증
   ======================================== */

/**
 * 인증번호 형식 검증
 *
 * @param code - 검증할 인증번호
 * @returns 6자리 숫자이면 true, 아니면 false
 *
 * 예시:
 * - validateVerificationCode("123456") → true
 * - validateVerificationCode("12345") → false
 */
export function validateVerificationCode(code: string): boolean {
  if (!code) return false;
  return REGEX_PATTERNS.VERIFICATION_CODE.test(code);
}
