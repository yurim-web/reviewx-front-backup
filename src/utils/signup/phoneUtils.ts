/* ========================================
   🛠️ 휴대폰 번호 유틸리티 함수 (공통)
   ======================================== */

/**
 * 모듈 목적
 *
 * - 휴대폰 번호 포맷팅 및 파싱 로직 관리
 * - 숫자만 추출하여 010-XXXX-XXXX 형식으로 자동 변환
 *
 * 📌 위치 설명:
 * - 이 파일은 사용자와 파트너 회원가입 모두에서 공통으로 사용되는 유틸리티입니다.
 * - /utils/signup/ 폴더에 위치하여 user와 partner 모두에서 접근 가능합니다.
 *
 * 📍 사용 페이지/컴포넌트:
 * - src/components/user/signup/PhoneVerification.tsx
 *   (사용자 회원가입 페이지의 휴대폰 인증 컴포넌트에서 사용)
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
