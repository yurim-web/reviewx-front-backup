/* ========================================
   🛠️ 사업자등록번호 유틸리티 함수
   ======================================== */

/**
 * 모듈 목적
 *
 * - 사업자등록번호 포맷팅 및 파싱 로직 관리
 * - 숫자만 추출하여 XXX-XX-XXXXX 형식으로 자동 변환
 *
 * 📌 위치 설명:
 * - 이 파일은 파트너 회원가입 페이지에서만 사용되는 유틸리티입니다.
 * - 컴포넌트 폴더 내부에 위치하여 해당 기능과 밀접하게 연관되어 있음을 나타냅니다.
 * - 프로젝트의 다른 컴포넌트들(campaign_management 등)도 동일한 패턴을 따릅니다.
 *
 * 📍 사용 페이지/컴포넌트:
 * - src/app/partner/signup/page.tsx
 *   (파트너 회원가입 페이지에서 사업자등록번호 입력 시 자동 포맷팅에 사용)
 */

/**
 * 사업자등록번호 포맷팅
 * 숫자만 추출하여 XXX-XX-XXXXX 형식으로 변환
 *
 * @param value - 입력된 사업자등록번호 (숫자, 하이픈 포함 가능)
 * @returns 포맷팅된 사업자등록번호 (XXX-XX-XXXXX)
 *
 * @example
 * formatBusinessNumber('1221212345') // '122-12-12345'
 * formatBusinessNumber('122-12-12345') // '122-12-12345'
 */
export function formatBusinessNumber(value: string): string {
  const numbersOnly = value.replace(/[^0-9]/g, '').slice(0, 10);
  let formatted = '';

  if (numbersOnly.length >= 1) {
    formatted = numbersOnly.slice(0, 3);
    if (numbersOnly.length >= 4) {
      formatted += '-' + numbersOnly.slice(3, 5);
      if (numbersOnly.length >= 6) {
        formatted += '-' + numbersOnly.slice(5, 10);
      }
    }
  }

  return formatted;
}
