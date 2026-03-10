/* ========================================
   포인트 API 함수
   ======================================== */

/**
 * point API
 *
 * 목적: 포인트 잔액·내역 조회 API 함수 (apiClient → json-server or 실제 백엔드)
 *
 * 사용 페이지:
 * - /user/point/* (포인트 내역 페이지)
 *
 * 응답 처리:
 * - 실제 백엔드: { result: "OK", ... }
 * - json-server 목업: 객체/배열 직접 반환
 * → 두 형식 모두 자동으로 처리
 */

import { apiClient } from "@/lib/api/client";
import type {
  ReviewerPointApiItem,
  PointHistoryApiItem,
  WithdrawalPostBody,
} from "@/types/api/point";

/**
 * 리뷰어 포인트 잔액 조회
 * GET /reviewer/mypage/point/:reviewerId → /reviewers/:id
 */
export const fetchReviewerPoint = (reviewerId: number): Promise<ReviewerPointApiItem> =>
  apiClient
    .get<ReviewerPointApiItem>(`/reviewer/mypage/point/${reviewerId}`)
    .then((res) => res.data);

/**
 * 포인트 거래 내역 조회
 * GET /reviewer/mypage/point/history?reviewer_id=:id → /point_history?reviewer_id=:id
 */
export const fetchPointHistory = (reviewerId: number): Promise<PointHistoryApiItem[]> =>
  apiClient
    .get<PointHistoryApiItem[]>(`/reviewer/mypage/point/history?reviewer_id=${reviewerId}`)
    .then((res) => (Array.isArray(res.data) ? res.data : []));

/** 출금 신청 (POST /reviewer/mypage/withdrawal → /withdrawal_requests) */
export const postWithdrawalRequest = (body: WithdrawalPostBody): Promise<{ id: number }> =>
  apiClient.post<{ id: number }>("/reviewer/mypage/withdrawal", body).then((res) => res.data);

/** 출금 상태 변경 (승인/반려) (PATCH /admin/withdrawal/:id → /withdrawal_requests/:id) */
export const patchWithdrawalStatus = (
  id: number,
  body: { status: string; processed_date: string; rejection_reason?: string }
): Promise<void> => apiClient.patch(`/admin/withdrawal/${id}`, body).then(() => undefined);

/**
 * 적립 예정 포인트 목록 조회
 * GET /reviewer/mypage/point/history/pending → /point_history?status=PENDING&reviewer_id=:id
 */
export const fetchPendingPoints = (reviewerId: number): Promise<PointHistoryApiItem[]> =>
  apiClient
    .get<
      PointHistoryApiItem[]
    >(`/reviewer/mypage/point/history?status=PENDING&reviewer_id=${reviewerId}`)
    .then((res) => (Array.isArray(res.data) ? res.data : []));

/**
 * 파트너 포인트 충전 결제 등록
 * POST /partner/payment → /payments
 */
export const postPartnerPayment = (body: {
  partner_id: number;
  amount: number;
  payment_method: "CARD" | "BANK";
  status: "PENDING" | "COMPLETED";
  paid_at: string;
  points_charged: number;
}): Promise<{ id: number }> =>
  apiClient.post<{ id: number }>("/partner/payment", body).then((res) => res.data);
