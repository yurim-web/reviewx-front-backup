/* ========================================
   💰 포인트 관련 API Response 타입
   ======================================== */

/**
 * 모듈 목적
 *
 * - 포인트 충전, 출금, 내역 조회 등 포인트 관련 API 응답 타입 정의
 * - 리뷰어와 파트너의 포인트 관리 데이터 구조 정의
 *
 * 📌 사용 위치:
 * - 포인트 페이지 (리뷰어/파트너)
 * - 출금 신청 페이지
 */

import { ApiResponse } from "./auth";

/**
 * 포인트 거래 타입
 */
export type PointTransactionType =
  | "charge" // 충전 (파트너)
  | "campaign_reward" // 캠페인 보상 (리뷰어)
  | "campaign_payment" // 캠페인 지급 (파트너)
  | "withdrawal" // 출금 (리뷰어)
  | "refund" // 환불
  | "penalty"; // 페널티

/**
 * 포인트 거래 상태
 */
export type PointTransactionStatus =
  | "pending" // 대기중
  | "completed" // 완료
  | "cancelled" // 취소
  | "failed"; // 실패

/**
 * 포인트 거래 내역
 */
export interface PointTransaction {
  id: string;
  user_id: string;
  type: PointTransactionType;
  amount: number;
  balance_after: number; // 거래 후 잔액
  status: PointTransactionStatus;
  description: string;
  created_at: string;

  // 캠페인 관련 (해당되는 경우)
  campaign_id?: string;
  campaign_title?: string;

  // 출금 관련 (해당되는 경우)
  withdrawal_id?: string;
  bank_name?: string;
  account_number?: string;
}

/**
 * 포인트 잔액 조회 응답
 */
export interface PointBalanceResponse extends ApiResponse {
  data: {
    total_points: number;
    available_points: number; // 출금 가능 포인트
    pending_points: number; // 보류 중인 포인트
  };
}

/**
 * 포인트 내역 조회 응답
 */
export interface PointHistoryResponse extends ApiResponse {
  data: {
    transactions: PointTransaction[];
    total_count: number;
    current_page: number;
    total_pages: number;
    has_next: boolean;
  };
}

/**
 * 포인트 충전 정보 (파트너)
 */
export interface PointChargeInfo {
  charge_id: string;
  amount: number;
  payment_method: "card" | "bank_transfer" | "virtual_account";
  status: PointTransactionStatus;
  created_at: string;

  // 결제 정보
  payment_info?: {
    card_company?: string;
    card_number_masked?: string;
    bank_name?: string;
    account_number?: string;
    virtual_account_number?: string;
  };
}

/**
 * 포인트 충전 응답 (파트너)
 */
export interface ChargePointsResponse extends ApiResponse {
  data: {
    charge_id: string;
    amount: number;
    payment_method: string;
    payment_url?: string; // 결제 페이지 URL (카드결제 시)
    status: PointTransactionStatus;
  };
}

/**
 * 출금 신청 정보 (리뷰어)
 */
export interface WithdrawalRequest {
  id: string;
  user_id: string;
  amount: number;
  status: "pending" | "approved" | "rejected" | "completed";
  requested_at: string;
  processed_at?: string;

  // 계좌 정보
  bank_name: string;
  account_number: string;
  account_holder: string;

  // 관리자 메모 (거절 시)
  admin_note?: string;
}

/**
 * 출금 신청 응답 (리뷰어)
 */
export interface WithdrawalRequestResponse extends ApiResponse {
  data: {
    withdrawal_id: string;
    amount: number;
    status: "pending";
    requested_at: string;
  };
}

/**
 * 출금 내역 조회 응답 (리뷰어)
 */
export interface WithdrawalHistoryResponse extends ApiResponse {
  data: {
    withdrawals: WithdrawalRequest[];
    total_count: number;
    total_withdrawn_amount: number; // 총 출금액
  };
}

/**
 * 출금 가능 금액 조회 응답
 */
export interface WithdrawableAmountResponse extends ApiResponse {
  data: {
    available_amount: number;
    min_withdrawal_amount: number;
    max_withdrawal_amount: number;
    pending_withdrawal_amount: number;
  };
}

/**
 * 포인트 통계 (리뷰어)
 */
export interface UserPointStats {
  total_earned: number; // 총 획득 포인트
  total_withdrawn: number; // 총 출금 포인트
  pending_withdrawal: number; // 출금 신청 중
  available_points: number; // 출금 가능 포인트
}

/**
 * 포인트 통계 응답 (리뷰어)
 */
export interface UserPointStatsResponse extends ApiResponse {
  data: UserPointStats;
}

/**
 * 포인트 통계 (파트너)
 */
export interface PartnerPointStats {
  total_charged: number; // 총 충전 금액
  total_spent: number; // 총 사용 금액
  available_points: number; // 사용 가능 포인트
  pending_points: number; // 보류 중인 포인트 (진행중인 캠페인)
}

/**
 * 포인트 통계 응답 (파트너)
 */
export interface PartnerPointStatsResponse extends ApiResponse {
  data: PartnerPointStats;
}

// ========================================
// mock json-server 응답 타입
// ========================================

/**
 * GET /reviewer/mypage/point/:id → /reviewers/:id
 * 리뷰어 포인트 잔액 정보 (mock)
 */
export interface ReviewerPointApiItem {
  id: number;
  current_points: number;
  withdrawn_points: number;
  bank?: string;
  account_holder?: string;
  account_number?: string;
}

/**
 * GET /reviewer/mypage/point/history → /point_history
 * 포인트 거래 내역 항목 (mock)
 */
export interface PointHistoryApiItem {
  id: number;
  reviewer_id: number;
  type: "EARNED" | "WITHDRAWAL";
  amount: number;
  description: string;
  status: "COMPLETED" | "PENDING" | "FAILED";
  date: string; // ISO 8601 (e.g. "2026-02-10T10:00:00Z")
  balance: number;
  rejection_reason?: string;
}

// ========================================
// mock json-server 쓰기 타입
// ========================================

/**
 * POST /reviewer/mypage/withdrawal → /withdrawal_requests
 * 출금 신청 Request body (mock)
 */
export interface WithdrawalPostBody {
  reviewer_id: number;
  user_name: string;
  requested_amount: number;
  net_amount: number;
  tax_amount: number;
  bank: string;
  account_number: string;
  account_holder: string;
  status: "PENDING";
  request_date: string;
  processed_date: null;
}
