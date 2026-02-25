/* ========================================
   회원가입 공통 유효성 검증 헬퍼
   ======================================== */

/**
 * signup
 *
 * 목적: 유저/파트너 회원가입 폼에서 공통으로 사용하는 필드 검증 헬퍼를 제공합니다.
 *
 * 사용 위치:
 * - src/components/user/signup/utils/formValidation.ts
 * - src/components/partner/signup/utils/formValidation.ts
 */

import { validateEmail } from "./auth";

/**
 * 이메일 필드 검증
 *
 * @param email - 이메일 값
 * @param required - true이면 빈 값도 오류 (빈 문자열 반환), false이면 빈 값은 통과
 * @returns 오류 메시지 (없으면 undefined)
 */
export function validateSignupEmailField(email: string, required: boolean): string | undefined {
  if (required && !email) return "";
  if (email && !validateEmail(email)) return "올바른 이메일 형식을 입력해주세요.";
  return undefined;
}

/**
 * 이름 필드 검증 (필수)
 *
 * @param name - 이름 값
 * @param emptyError - 빈 값일 때 반환할 오류 메시지 (기본: 빈 문자열 = 테두리만 빨간색)
 * @returns 오류 메시지 (없으면 undefined)
 */
export function validateSignupNameField(name: string, emptyError: string = ""): string | undefined {
  if (!name) return emptyError;
  return undefined;
}

/**
 * 휴대폰 번호 + 인증 여부 검증
 *
 * @param phone - 휴대폰 번호 값
 * @param isPhoneVerified - 인증 완료 여부
 * @param emptyError - 빈 값일 때 반환할 오류 메시지 (기본: 빈 문자열 = 테두리만 빨간색)
 * @returns 오류 메시지 (없으면 undefined)
 */
export function validateSignupPhoneField(
  phone: string,
  isPhoneVerified: boolean,
  emptyError: string = ""
): string | undefined {
  if (!phone) return emptyError;
  if (!isPhoneVerified) return "휴대폰 인증을 완료해주세요.";
  return undefined;
}
