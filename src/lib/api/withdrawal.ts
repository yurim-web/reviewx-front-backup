/* ========================================
   리뷰어 출금 신청 API 함수
   ======================================== */

/**
 * 리뷰어 출금 신청 API
 *
 * 목적: 출금 신청 페이지 진입 데이터 조회 + 출금 신청 제출
 *
 * 사용 페이지:
 * - /user/point/withdrawal_request (포인트 출금 신청)
 *
 * API:
 * - 34번: GET /user/point/withdrawal_request
 * - 35번: POST /user/point/withdrawal_request
 */

import { apiClient } from "@/lib/api/client";
import type {
  WithdrawalInfoResponse,
  WithdrawalRequestBody,
  WithdrawalResponse,
} from "@/types/api/withdrawal";

/** 출금 신청 페이지 진입 데이터 조회 (34번: GET /user/point/withdrawal_request) */
export const fetchWithdrawalInfo = async (): Promise<WithdrawalInfoResponse> => {
  const { data } = await apiClient.get<WithdrawalInfoResponse>("/api/v1/reviewer/points/withdraw");
  return data;
};

/** 출금 신청 제출 (35번: POST /user/point/withdrawal_request) */
export const submitWithdrawalRequest = async (
  body: WithdrawalRequestBody
): Promise<WithdrawalResponse> => {
  const { data } = await apiClient.post<WithdrawalResponse>(
    "/api/v1/reviewer/points/withdraw",
    body
  );
  return data;
};
