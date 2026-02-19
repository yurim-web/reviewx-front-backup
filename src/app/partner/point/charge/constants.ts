/** 무통장 입금 - 환불 정보 은행 목록 (은행 선택 드롭다운) */
export const REFUND_BANKS = [
  "국민은행",
  "신한은행",
  "우리은행",
  "하나은행",
  "기업은행",
  "NH농협",
  "카카오뱅크",
  "토스뱅크",
  "씨티은행",
  "SC제일은행",
] as const;

export type RefundBankName = (typeof REFUND_BANKS)[number];
