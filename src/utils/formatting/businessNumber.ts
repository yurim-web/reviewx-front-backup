/* ========================================
   🛠️ 사업자등록번호 유틸리티 함수
   ======================================== */

/**
 * 사업자등록번호 포맷팅 유틸리티
 *
 * 목적:
 * - 사업자등록번호를 XXX-XX-XXXXX 형식으로 자동 변환
 * - 숫자만 추출하여 포맷팅
 *
 * 사용 위치:
 * - src/app/partner/signup/page.tsx (회원가입 페이지)
 * - src/app/partner/mypage/edit/page.tsx (내 정보 수정 페이지)
 */

/**
 * 사업자등록번호 포맷팅
 *
 * 숫자만 추출하여 XXX-XX-XXXXX 형식으로 변환합니다.
 *
 * @param value - 입력된 사업자등록번호 (숫자, 하이픈 포함 가능)
 * @returns 포맷팅된 사업자등록번호 (XXX-XX-XXXXX)
 *
 * @example
 * formatBusinessNumber('1221212345') // '122-12-12345'
 * formatBusinessNumber('122-12-12345') // '122-12-12345'
 * formatBusinessNumber('122') // '122'
 */
export function formatBusinessNumber(value: string): string {
  const numbersOnly = value.replace(/[^0-9]/g, "").slice(0, 10);
  let formatted = "";

  if (numbersOnly.length >= 1) {
    formatted = numbersOnly.slice(0, 3);
    if (numbersOnly.length >= 4) {
      formatted += "-" + numbersOnly.slice(3, 5);
      if (numbersOnly.length >= 6) {
        formatted += "-" + numbersOnly.slice(5, 10);
      }
    }
  }

  return formatted;
}
