/* ========================================
   🛠️ 휴대폰 번호 유틸리티 함수
   ======================================== */

/**
 * 모듈 목적
 *
 * - 휴대폰 번호 포맷팅 및 파싱 로직 관리
 * - 숫자만 추출하여 010-XXXX-XXXX 형식으로 자동 변환
 */

/**
 * 휴대폰 번호 포맷팅
 * 숫자만 추출하여 010-XXXX-XXXX 형식으로 변환
 *
 * @param value - 입력된 휴대폰 번호 (숫자, 하이픈 포함 가능)
 * @returns 포맷팅된 휴대폰 번호 (010-XXXX-XXXX)
 *
 * @example
 * formatPhoneNumber('01012345678') // '010-1234-5678'
 * formatPhoneNumber('010-1234-5678') // '010-1234-5678'
 * formatPhoneNumber('010-1234-567') // '010-1234-567'
 */
export function formatPhoneNumber(value: string): string {
  const numbersOnly = value.replace(/[^0-9]/g, '').slice(0, 11);
  let formatted = '';

  if (numbersOnly.length >= 1) {
    formatted = numbersOnly.slice(0, 3);
    if (numbersOnly.length >= 4) {
      formatted += '-' + numbersOnly.slice(3, 7);
      if (numbersOnly.length >= 8) {
        formatted += '-' + numbersOnly.slice(7, 11);
      }
    }
  }

  return formatted;
}

