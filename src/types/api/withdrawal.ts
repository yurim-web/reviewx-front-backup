/* ========================================
   리뷰어 출금 신청 API Response 타입
   ======================================== */

/**
 * 모듈 목적
 *
 * - 리뷰어 출금 신청 API 응답 타입 정의
 *   - 34번: GET /user/point/withdrawal_request (페이지 진입)
 *   - 35번: POST /user/point/withdrawal_request (출금 신청)
 *
 * 사용 위치:
 * - src/lib/api/withdrawal.ts
 * - src/hooks/user/point/useWithdrawalInfo.ts
 */

/** GET /user/point/withdrawal_request — 계좌 정보 */
export interface WithdrawalBankAccount {
  bankAccountId: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

/** GET /user/point/withdrawal_request — 출금 정책 */
export interface WithdrawalPolicy {
  minAmount: number; // 10000
  maxAmount: number; // 500000
}

/** GET /user/point/withdrawal_request — 응답 (34번) */
export interface WithdrawalInfoResponse {
  result: "OK";
  generatedAt: string;
  balancePoint: number;
  bankAccount: WithdrawalBankAccount | null;
  withdrawalPolicy: WithdrawalPolicy;
}

/** POST /user/point/withdrawal_request — 요청 바디 (35번) */
export interface WithdrawalRequestBody {
  requestedAmount: number;
}

/** POST /user/point/withdrawal_request — 응답 (35번) */
export interface WithdrawalResponse {
  result: "REQUESTED";
  generatedAt?: string;
  withdrawalId: number;
  withdrawalNumber: string; // WD-YYYYMMDD-NNNNNN
  status: "PENDING";
  bankAccountId: number;
  requestedAmount: number;
  feeRate: number; // 0.033 (3.3%)
  feeAmount: number; // requestedAmount × 0.033
  expectedAmount: number; // requestedAmount - feeAmount
  balanceBefore: number;
  balanceAfter: number;
  pointTransactionId: number;
  requestedAt: string; // ISO 8601
}

/** POST /user/point/withdrawal_request — 에러 응답 */
export interface WithdrawalErrorResponse {
  errorCode:
    | "INSUFFICIENT_POINT"
    | "BELOW_MIN_WITHDRAWAL"
    | "EXCEED_MAX_WITHDRAWAL"
    | "NO_BANK_ACCOUNT"
    | "PENDING_WITHDRAWAL_EXISTS"
    | "EXCEED_MONTHLY_MAX_WITHDRAWAL"
    | "WITHDRAWAL_WEEKLY_LIMIT_EXCEEDED"
    | "UNAUTHORIZED"
    | "TOKEN_EXPIRED"
    | "INTERNAL_SERVER_ERROR";
  message: string;
}
