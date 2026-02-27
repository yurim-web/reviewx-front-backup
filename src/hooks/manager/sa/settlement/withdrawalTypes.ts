/* ========================================
   출금 요청 로컬스토리지 타입 정의
   ======================================== */

/**
 * withdrawalTypes
 *
 * 목적: 출금 승인/반려 훅에서 사용하는 localStorage 데이터 타입 정의
 *
 * 사용 페이지:
 * - /manager_sa/settlement/withdrawal_request
 */

export interface StoredRequest {
  id: string;
  status: string;
  processed_date?: string;
  rejection_reason?: string;
  requested_amount: number;
  user_id: string;
}

export interface StoredAccount {
  id: string;
  available_points: number;
  pending_points: number;
  withdrawn_points: number;
  point_history?: PointHistoryEntry[];
}

export interface PointHistoryEntry {
  id: string;
  type: string;
  status: string;
  description: string;
  rejection_reason?: string;
  balance: number;
}
