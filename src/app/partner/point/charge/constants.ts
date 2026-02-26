/* ========================================
   📋 포인트 충전 상수 정의
   ======================================== */

/**
 * 포인트 충전 페이지 상수
 *
 * 목적: 포인트 충전 페이지에서 사용하는 상수 정의
 *
 * 사용 위치:
 * - /partner/point/charge
 */

import { BANK_OPTIONS } from "@/utils/constants/bank";

/** 환불 은행 목록 (utils/constants/bank.ts와 동일) */
export const REFUND_BANKS = [...BANK_OPTIONS] as const;

export const AMOUNT_OPTIONS = [50000, 100000, 150000, 200000, 300000, 500000, 1000000] as const;

export const partnerInfo = {
  companyName: "(주)청명종합광고기획",
  ownerName: "김청명",
  businessNumber: "123-45-67890",
  address: "서울특별시 강남구 테헤란로 123",
  bankAccount: "659401-01-490957",
} as const;
