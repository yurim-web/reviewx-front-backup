/* ========================================
   리뷰어 포인트 API 함수
   ======================================== */

/**
 * 리뷰어 포인트 API
 *
 * 목적: 리뷰어 포인트 잔액 + 내역 조회 (커서 기반 페이지네이션)
 *
 * 사용 페이지:
 * - /user/point/all (전체 포인트 내역)
 * - /user/point/earned (적립 포인트 내역)
 * - /user/point/withdrawn (출금 포인트 내역)
 *
 * API:
 * - 33번: GET /user/point
 */

import { apiClient } from "@/lib/api/client";
import type { UserPointResponse, PointTransactionTypeParam } from "@/types/api/userPoint";

/** 리뷰어 포인트 내역 조회 (33번: GET /user/point) */
export const fetchUserPoint = async (params?: {
  point_transaction_type?: PointTransactionTypeParam;
  cursor?: string;
}): Promise<UserPointResponse> => {
  const { data } = await apiClient.get<{
    result: "OK";
    generatedAt: string;
    data: Omit<UserPointResponse, "result" | "generatedAt">;
  }>("/api/v1/reviewer/points", { params });
  return { result: data.result, generatedAt: data.generatedAt, ...data.data };
};
