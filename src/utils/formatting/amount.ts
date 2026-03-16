/* ========================================
   💰 금액 포맷팅 유틸리티
   ======================================== */

/**
 * 기존 파일에서 이동:
 * - src/utils/point/amountFormatter.ts 의 내용을 여기로 통합
 *
 * 사용처:
 * - src/components/point/AmountInput.tsx
 * - src/app/user/point/withdrawal_request/page.tsx
 * - src/app/partner/point/charge/page.tsx
 */

/**
 * 입력값에서 숫자만 추출 (쉼표 제거)
 *
 * @param value - 입력된 문자열 값
 * @returns 숫자만 포함된 문자열
 *
 * 예시:
 * - "10,000" → "10000"
 * - "abc123" → "123"
 */
export const extractNumericValue = (value: string): string => {
  return value.replace(/[^0-9]/g, "");
};

/**
 * 숫자에 천 단위 구분 기호(쉼표) 추가
 *
 * @param value - 숫자 문자열 또는 숫자
 * @returns 천 단위 구분 기호가 추가된 문자열
 *
 * 예시:
 * - "10000" → "10,000"
 * - 1000000 → "1,000,000"
 * - "" → ""
 */
export const formatAmountWithComma = (value: string | number): string => {
  if (value === undefined || value === null || value === "") return "";
  const numericValue = typeof value === "string" ? extractNumericValue(value) : String(value);
  if (!numericValue) return "";
  return Number(numericValue).toLocaleString();
};

/**
 * 포맷된 금액 문자열을 숫자로 변환
 *
 * @param formattedValue - 쉼표가 포함된 금액 문자열
 * @returns 숫자 값
 *
 * 예시:
 * - "10,000" → 10000
 * - "1,000,000" → 1000000
 */
export const parseFormattedAmount = (formattedValue: string): number => {
  if (!formattedValue) return 0;
  return Number(extractNumericValue(formattedValue));
};

/**
 * 금액을 "원" 단위로 포맷팅
 *
 * @param amount - 금액 (숫자)
 * @returns 포맷된 문자열 (예: "10,000원")
 */
export const formatCurrency = (amount: number): string => {
  return `${formatAmountWithComma(amount)}원`;
};

/**
 * 포인트를 "P" 단위로 포맷팅
 *
 * @param points - 포인트 (숫자)
 * @returns 포맷된 문자열 (예: "1,000P")
 */
export const formatPoints = (points: number): string => {
  return `${formatAmountWithComma(points)}P`;
};
