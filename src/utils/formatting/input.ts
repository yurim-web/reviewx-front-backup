/* ========================================
   📝 입력값 포맷팅 유틸리티
   ======================================== */

/**
 * 입력값 포맷팅 유틸리티
 *
 * 목적: 사용자 입력값을 특정 형식으로 포맷팅
 *
 * 사용 위치:
 * - /partner/point/charge
 */

/**
 * 휴대폰 번호 포맷팅
 * - 숫자만 11자리
 * - 3-4-4 하이픈 자동 추가
 *
 * @param value 입력값
 * @returns 포맷팅된 휴대폰 번호 (예: 010-1234-5678)
 */
export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

/**
 * 사업자등록번호 포맷팅
 * - 숫자만 10자리
 * - 3-2-5 하이픈 자동 추가
 *
 * @param value 입력값
 * @returns 포맷팅된 사업자등록번호 (예: 123-45-67890)
 */
export function formatBusinessNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
}
