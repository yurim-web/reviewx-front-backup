/* ========================================
   리뷰어 대시보드 API 함수
   ======================================== */

/**
 * 리뷰어 대시보드 API
 *
 * 목적: 리뷰어 대시보드 메인페이지 캠페인 목록 조회
 *
 * 사용 페이지:
 * - /user (리뷰어 대시보드 메인)
 *
 * API:
 * - 20번: GET /user (대시보드 메인페이지)
 */

import { apiClient } from "@/lib/api/client";
import type { UserDashboardResponse } from "@/types/api/userDashboard";

/** 리뷰어 대시보드 조회 (20번: GET /api/v1/reviewer/dashboard) */
export const fetchUserDashboard = async (): Promise<UserDashboardResponse> => {
  const { data } = await apiClient.get<{
    result: "OK";
    generatedAt: string;
    data: Omit<UserDashboardResponse, "result" | "generatedAt">;
  }>("/api/v1/reviewer/dashboard");
  return { result: data.result, generatedAt: data.generatedAt, ...data.data };
};
