/* ========================================
   📱 휴대폰 번호 포맷팅 유틸리티
   ======================================== */

/**
 * 휴대폰 번호 포맷팅 관련 유틸리티
 *
 * 기존 파일 참고:
 * - src/utils/signup/phoneUtils.ts
 */

/**
 * 숫자만 추출
 *
 * @param value - 입력 문자열
 * @returns 숫자만 포함된 문자열
 */
export const extractPhoneNumbers = (value: string): string => {
  return value.replace(/[^0-9]/g, '');
};

/**
 * 휴대폰 번호를 "010-XXXX-XXXX" 형식으로 포맷팅
 *
 * @param phone - 숫자만 포함된 휴대폰 번호 (예: "01012345678")
 * @returns 포맷된 휴대폰 번호 (예: "010-1234-5678")
 */
export const formatPhoneNumber = (phone: string): string => {
  const numbers = extractPhoneNumbers(phone);

  if (numbers.length <= 3) {
    return numbers;
  }
  if (numbers.length <= 7) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  }
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
};

/**
 * 휴대폰 번호 마스킹 (중간 4자리 숨김)
 *
 * @param phone - 휴대폰 번호 (예: "010-1234-5678")
 * @returns 마스킹된 휴대폰 번호 (예: "010-****-5678")
 */
export const maskPhoneNumber = (phone: string): string => {
  const numbers = extractPhoneNumbers(phone);
  if (numbers.length !== 11) return phone;

  return `${numbers.slice(0, 3)}-****-${numbers.slice(7, 11)}`;
};

/**
 * 포맷된 휴대폰 번호를 순수 숫자로 변환
 *
 * @param formattedPhone - 포맷된 휴대폰 번호 (예: "010-1234-5678")
 * @returns 숫자만 포함된 문자열 (예: "01012345678")
 */
export const parsePhoneNumber = (formattedPhone: string): string => {
  return extractPhoneNumbers(formattedPhone);
};
