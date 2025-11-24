/* ========================================
   🛠️ 파트너 회원가입 유효성 검증 함수 (파트너 전용)
   ======================================== */

/**
 * 모듈 목적
 *
 * - 파트너 회원가입 폼의 파트너 전용 유효성 검증 로직
 * - 사업자등록번호 형식 검증
 *
 * 📌 위치 설명:
 * - 이 파일은 파트너 회원가입 페이지에서만 사용되는 유틸리티입니다.
 * - 공통 검증 함수는 @/utils/signup/validation에서 직접 import하여 사용합니다.
 *
 * 📍 사용 페이지/컴포넌트:
 * - src/components/partner/signup/utils/formValidation.ts
 *   (파트너 회원가입 폼 전체 검증에서 사업자등록번호 검증에 사용)
 */

/**
 * 사업자등록번호 형식 검증
 * @param businessNumber - 검증할 사업자등록번호 (예: 122-12-12345)
 * @returns 유효한 형식이면 true, 아니면 false
 */
export function validateBusinessNumber(businessNumber: string): boolean {
  const businessNumberRegex = /^\d{3}-\d{2}-\d{5}$/;
  return businessNumberRegex.test(businessNumber);
}
