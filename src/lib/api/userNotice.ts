/* ========================================
   리뷰어 공지사항 API 함수
   ======================================== */

/**
 * 리뷰어 공지사항 API
 *
 * 목적: 리뷰어 대상 공지사항 목록 조회 + 상세 조회
 *
 * 사용 페이지:
 * - /user/notice (공지사항 목록)
 * - /user/notice/[id] (공지사항 상세)
 *
 * API:
 * - 37번: GET /user/notice (공지사항 목록)
 * - 37번: GET /user/notice/:boardId (공지사항 상세)
 */

import { apiClient } from "@/lib/api/client";
import type {
  NoticeListParams,
  NoticeListResponse,
  NoticeDetailResponse,
} from "@/types/api/partnerNotice";

/** 리뷰어 공지사항 목록 조회 (37번: GET /user/notice) */
export async function fetchUserNoticeList(params?: NoticeListParams): Promise<NoticeListResponse> {
  const { data } = await apiClient.get<{
    result: string;
    generatedAt: string;
    data: Omit<NoticeListResponse, "result" | "generatedAt">;
  }>("/api/v1/reviewer/notices", {
    params,
  });
  return { result: data.result, generatedAt: data.generatedAt, ...data.data };
}

/** 리뷰어 공지사항 상세 조회 (37번: GET /user/notice/:boardId) */
export async function fetchUserNoticeDetail(boardId: number): Promise<NoticeDetailResponse> {
  const { data } = await apiClient.get<{
    result: string;
    generatedAt: string;
    data: Omit<NoticeDetailResponse, "result" | "generatedAt">;
  }>(`/api/v1/reviewer/notices/${boardId}`);
  return { result: data.result, generatedAt: data.generatedAt, ...data.data };
}
