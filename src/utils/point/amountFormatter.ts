/**
 * 금액 포맷팅 및 유효성 검사 유틸리티 함수
 *
 * 사용처:
 * - src/components/point/AmountInput.tsx
 * - src/app/user/point/withdrawal_request/page.tsx
 * - src/app/partner/point/charge/page.tsx
 *
 * 목적: 금액 입력 필드에서 사용하는 공통 로직을 재사용 가능한 함수로 제공
 *
 * 주요 기능:
 * - 숫자만 추출 (쉼표 제거)
 * - 천 단위 구분 기호(쉼표) 자동 추가
 * - 금액 유효성 검사 (최소/최대 금액, 보유 포인트 체크)
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
  if (!value) return "";
  const numericValue =
    typeof value === "string" ? extractNumericValue(value) : String(value);
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
 * 금액 유효성 검사 결과 타입
 */
export interface AmountValidationResult {
  isValid: boolean;
  errorMessage: string;
}

/**
 * 금액 유효성 검사
 *
 * @param amount - 검사할 금액 (숫자)
 * @param minAmount - 최소 금액
 * @param maxAmount - 최대 금액
 * @param availablePoints - 보유 포인트 (선택적, 보유 포인트 체크 시 사용)
 * @param errorMessages - 커스텀 에러 메시지 (선택적)
 * @returns 유효성 검사 결과
 */
export const validateAmount = (
  amount: number,
  minAmount: number,
  maxAmount: number,
  availablePoints?: number,
  errorMessages?: {
    min?: string;
    max?: string;
    exceedsAvailable?: string;
  }
): AmountValidationResult => {
  const defaultMessages = {
    min: `최소 ${minAmount.toLocaleString()}원부터 입력할 수 있습니다.`,
    max: `최대 ${maxAmount.toLocaleString()}원까지 입력할 수 있습니다.`,
    exceedsAvailable: "보유 포인트 이내에서만 입력할 수 있습니다.",
  };

  const messages = { ...defaultMessages, ...errorMessages };

  if (amount === 0) {
    return { isValid: false, errorMessage: "" };
  }

  if (amount < minAmount) {
    return { isValid: false, errorMessage: messages.min };
  }

  if (amount > maxAmount) {
    return { isValid: false, errorMessage: messages.max };
  }

  if (availablePoints !== undefined && amount > availablePoints) {
    return { isValid: false, errorMessage: messages.exceedsAvailable };
  }

  return { isValid: true, errorMessage: "" };
};
