/* ========================================
   파트너 포인트 API 타입
   ======================================== */

/**
 * 파트너 포인트 내역 API 타입 정의
 *
 * API:
 * - 24번: GET /partner/point/all (포인트 페이지 조회) — mock에서는 /partner/points
 * - 24-1번: GET /partner/points/charge/{chargeId}/receipt (거래명세서 조회)
 *
 * ⚠️ 백엔드 엔드포인트: /partner/point/all (배포 시 URL 변경 필요)
 * ⚠️ paymentMethod: 백엔드에 없음, mock에만 포함 (배포 시 백엔드 추가 요청 필요)
 *
 * 사용 위치:
 * - src/lib/api/partnerPoint.ts
 * - src/hooks/partner/point/usePartnerPoints.ts
 */

/** 포인트 거래 DB 유형 */
export type PointTransactionDBType = "CHARGE" | "PAYOUT" | "REFUND";

/** 포인트 필터 유형 (쿼리 파라미터) */
export type PointFilterType = "ALL" | "CHARGE" | "USE";

/** 결제 수단 */
export type PaymentMethod = "card" | "bank";

/** 포인트 거래 내역 */
export interface PointTransaction {
  transactionId: number;
  type: PointTransactionDBType;
  label: string;
  description: string;
  amount: number;
  balanceAfter: number;
  createdAt: string;
  hasReceipt: boolean;
  paymentMethod?: PaymentMethod;
}

/** GET /partner/points 응답 */
export interface PartnerPointsResponse {
  result: "OK";
  generatedAt: string;
  data: {
    currentBalance: number;
    transactions: PointTransaction[];
    hasNext: boolean;
  };
}

/** GET /partner/points/charge/{chargeId}/receipt 응답 */
export interface ReceiptResponse {
  success: boolean;
  data: {
    receiptUrl: string;
    fileType: string;
    /** ⚠️ 백엔드 응답에 없음 — mock에만 포함. 배포 시 백엔드 추가 요청 필요 */
    paymentMethod?: PaymentMethod;
  };
}

/* ========================================
   24-2번 API: POST /partner/points/charge (포인트 충전하기)
   ======================================== */

/** 영수증/계산서 발행 유형 */
export type ReceiptType = "NONE" | "CASH_RECEIPT_INCOME" | "CASH_RECEIPT_EXPENSE" | "TAX_INVOICE";

/** 무통장 입금 충전 요청 */
export interface BankChargeRequest {
  paymentMethod: "BANK_TRANSFER";
  amount: number;
  agreeToTerms: boolean;
  depositorName: string;
  receiptType: ReceiptType;
  /** 이름 — 백엔드에서는 항상 필수(Y), 프론트에서는 receiptType이 CASH_RECEIPT_INCOME일 때만 입력 */
  name: string;
  /** 휴대폰 번호 — 백엔드에서는 항상 필수(Y), 프론트에서는 receiptType이 CASH_RECEIPT_INCOME일 때만 입력 */
  phoneNumber: string;
  refundBank: string;
  refundAccountNumber: string;
  refundAccountHolder: string;
}

/** 신용카드 충전 요청 */
export interface CardChargeRequest {
  paymentMethod: "CARD";
  amount: number;
  agreeToTerms: boolean;
}

/** 충전 요청 (유니온) */
export type ChargeRequest = BankChargeRequest | CardChargeRequest;

/** 무통장 입금 충전 응답 */
export interface BankChargeResponse {
  success: true;
  data: {
    chargeId: number;
    status: "PENDING";
    paymentMethod: "BANK_TRANSFER";
    amount: number;
    depositAccount: {
      bank: string;
      accountNumber: string;
      accountHolder: string;
    };
    expiredAt: string;
    createdAt: string;
  };
}

/** 신용카드 충전 응답 */
export interface CardChargeResponse {
  success: true;
  data: {
    chargeId: number;
    status: "COMPLETED";
    paymentMethod: "CARD";
    amount: number;
    createdAt: string;
  };
}

/** 충전 응답 (유니온) */
export type ChargeResponse = BankChargeResponse | CardChargeResponse;
