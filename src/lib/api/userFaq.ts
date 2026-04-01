/* ========================================
   리뷰어 FAQ API 함수
   ======================================== */

/**
 * 리뷰어 FAQ API
 *
 * 목적: 리뷰어 대상 FAQ 목록 조회
 *
 * 사용 페이지:
 * - /user/faq (FAQ 목록)
 * - /user/faq/[id] (FAQ 상세 — 목록 데이터에서 boardId로 조회)
 *
 * API:
 * - 38번: GET /user/faq (FAQ 목록)
 * - ⚠️ 상세 조회 API 없음 — 목록 데이터에서 boardId로 찾아 표시
 */

import { apiClient } from "@/lib/api/client";
import type { FaqListParams, FaqListResponse } from "@/types/api/partnerFaq";

/** 리뷰어 FAQ 목록 조회 (38번: GET /user/faq) */
export async function fetchUserFaqList(params?: FaqListParams): Promise<FaqListResponse> {
  const { data } = await apiClient.get<{
    result: string;
    generatedAt: string;
    data: Omit<FaqListResponse, "result" | "generatedAt">;
  }>("/api/v1/reviewer/faq", {
    params,
  });
  return { result: data.result, generatedAt: data.generatedAt, ...data.data };
}
