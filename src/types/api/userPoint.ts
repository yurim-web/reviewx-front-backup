/* ========================================
   리뷰어 포인트 API Response 타입
   ======================================== */

/**
 * 모듈 목적
 *
 * - 리뷰어 포인트 내역 API 응답 타입 정의 (33번: GET /user/point)
 *
 * 사용 위치:
 * - src/lib/api/userPoint.ts
 * - src/hooks/user/point/usePointData.ts
 */

/** 포인트 변동 유형 필터 파라미터 */
export type PointTransactionTypeParam = "WITHDRAW" | "PAYOUT" | "CHARGE" | "REFUND";

/** 포인트 거래 단건 아이템 */
export interface UserPointTransactionItem {
  pointTransactionId: number;
  type: "PAYOUT" | "WITHDRAW" | "CHARGE" | "REFUND";
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: string; // ISO 8601 (e.g. "2026-01-05T10:00:00+09:00")
}

/** GET /user/point 응답 */
export interface UserPointResponse {
  result: "OK";
  generatedAt: string;
  balance: number;
  items: UserPointTransactionItem[];
  nextCursor: string | null;
}
