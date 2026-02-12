/* ========================================
   💰 금액 유효성 검증
   ======================================== */

/**
 * 기존 파일에서 이동:
 * - src/utils/point/amountFormatter.ts 의 검증 로직
 */

import { ERROR_MESSAGES } from '../constants/messages';
import { AMOUNT_CONSTRAINTS } from '../constants/validation';

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
 * @param options - 검증 옵션
 * @param options.minAmount - 최소 금액 (기본값: 10,000)
 * @param options.maxAmount - 최대 금액 (기본값: 1,000,000)
 * @param options.availablePoints - 보유 포인트 (선택적)
 * @param options.errorMessages - 커스텀 에러 메시지 (선택적)
 * @returns 유효성 검사 결과
 *
 * 예시:
 * ```ts
 * validateAmount(5000)
 * // { isValid: false, errorMessage: "최소 10,000원부터 입력할 수 있습니다." }
 *
 * validateAmount(50000, { availablePoints: 30000 })
 * // { isValid: false, errorMessage: "보유 포인트 이내에서만 입력할 수 있습니다." }
 * ```
 */
export const validateAmount = (
  amount: number,
  options?: {
    minAmount?: number;
    maxAmount?: number;
    availablePoints?: number;
    errorMessages?: {
      min?: string;
      max?: string;
      exceedsAvailable?: string;
    };
  }
): AmountValidationResult => {
  const minAmount = options?.minAmount ?? AMOUNT_CONSTRAINTS.MIN_AMOUNT;
  const maxAmount = options?.maxAmount ?? AMOUNT_CONSTRAINTS.MAX_AMOUNT;
  const { availablePoints, errorMessages } = options || {};

  // 0원일 경우
  if (amount === 0) {
    return { isValid: false, errorMessage: '' };
  }

  // 최소 금액 체크
  if (amount < minAmount) {
    return {
      isValid: false,
      errorMessage: errorMessages?.min ?? ERROR_MESSAGES.AMOUNT_TOO_LOW(minAmount),
    };
  }

  // 최대 금액 체크
  if (amount > maxAmount) {
    return {
      isValid: false,
      errorMessage: errorMessages?.max ?? ERROR_MESSAGES.AMOUNT_TOO_HIGH(maxAmount),
    };
  }

  // 보유 포인트 체크
  if (availablePoints !== undefined && amount > availablePoints) {
    return {
      isValid: false,
      errorMessage: errorMessages?.exceedsAvailable ?? ERROR_MESSAGES.AMOUNT_EXCEEDS_AVAILABLE,
    };
  }

  return { isValid: true, errorMessage: '' };
};

/**
 * 금액이 유효한 범위 내에 있는지 간단히 체크
 *
 * @param amount - 검사할 금액
 * @param min - 최소 금액
 * @param max - 최대 금액
 * @returns 유효하면 true
 */
export const isAmountInRange = (amount: number, min: number, max: number): boolean => {
  return amount >= min && amount <= max;
};
