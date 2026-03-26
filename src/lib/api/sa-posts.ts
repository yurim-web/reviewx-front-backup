/* ========================================
   SA 게시글 관리 API 함수
   ======================================== */

/**
 * SA posts API
 *
 * 목적: 최고관리자(SA) 게시글 CRUD + 고정/해제 API 함수
 *
 * 백엔드 스펙:
 * - 목록: GET /api/admin-sa/board
 * - 상세: GET /api/admin-sa/board/{boardId}
 * - 등록: POST /api/admin-sa/board
 * - 수정: PUT /api/admin-sa/board/{boardId}
 * - 삭제: DELETE /api/admin-sa/board (복수)
 * - 고정: PATCH /api/admin-sa/board/{boardId}/pin
 * - 해제: PATCH /api/admin-sa/board/{boardId}/unpin
 * - 폼 옵션: GET /api/admin-sa/board/write
 *
 * 사용 훅:
 * - hooks/manager/sa/community/useSAAdminPosts.ts
 */

import { apiClient } from "@/lib/api/client";
import type { BoardDivision, BoardTarget, BoardListParams } from "@/lib/api/posts";

// ────────────────────────────────────────
// SA 응답 타입 (백엔드 스펙 기준, data wrapper 없음)
// ────────────────────────────────────────

/** SA 게시글 목록 아이템 */
export interface SABoardApiItem {
  boardId: number;
  boardNumber: string;
  division: BoardDivision;
  category: string;
  target: BoardTarget;
  title: string;
  viewCount: number;
  isPinned: boolean;
  registrantName: string;
  createdAt: string;
}

/** SA 게시글 목록 응답 */
export interface SABoardListResponse {
  result: string;
  generatedAt: string;
  totalCount: number;
  boards: SABoardApiItem[];
}

/** SA 게시글 상세 */
export interface SABoardDetailItem {
  boardId: number;
  boardNumber: string;
  division: BoardDivision;
  category: string;
  target: BoardTarget;
  title: string;
  content: string;
  viewCount: number;
  isPinned: boolean;
  registrantName: string;
  createdAt: string;
  updatedAt?: string;
}

/** SA 게시글 상세 응답 */
export interface SABoardDetailResponse {
  result: string;
  generatedAt: string;
  board: SABoardDetailItem;
}

/** SA 게시글 등록 요청 */
export interface SACreateBoardRequest {
  division: BoardDivision;
  category: string;
  target: BoardTarget;
  title: string;
  content: string;
}

/** SA 게시글 등록 응답 */
export interface SACreateBoardResponse {
  result: string;
  generatedAt: string;
  boardId: number;
  boardNumber: string;
  createdAt: string;
}

/** SA 게시글 수정 요청 */
export interface SAUpdateBoardRequest {
  division: BoardDivision;
  boardCategory: string;
  target: BoardTarget;
  title: string;
  content: string;
}

/** SA 게시글 삭제 요청 (복수) */
export interface SADeleteBoardsRequest {
  boardIds: number[];
}

/** SA 폼 옵션 카테고리 */
export interface SACategoryOption {
  code: string;
  label: string;
  division: string;
}

/** SA 폼 옵션 응답 */
export interface SABoardFormOptionsResponse {
  result: string;
  generatedAt: string;
  divisions: Array<{ code: string; label: string }>;
  categories: SACategoryOption[];
  targets: Array<{ code: string; label: string }>;
}

// ────────────────────────────────────────
// API 함수
// ────────────────────────────────────────

/** SA 게시글 목록 조회 */
export const getSABoardList = async (params?: BoardListParams): Promise<SABoardListResponse> => {
  const { data } = await apiClient.get<SABoardListResponse>("/api/admin-sa/board", { params });
  return data;
};

/** SA 게시글 상세 조회 */
export const getSABoardDetail = async (boardId: number): Promise<SABoardDetailResponse> => {
  const { data } = await apiClient.get<SABoardDetailResponse>(`/api/admin-sa/board/${boardId}`);
  return data;
};

/** SA 게시글 등록 */
export const createSABoard = async (body: SACreateBoardRequest): Promise<SACreateBoardResponse> => {
  const { data } = await apiClient.post<SACreateBoardResponse>("/api/admin-sa/board", body);
  return data;
};

/** SA 게시글 수정 */
export const updateSABoard = async (
  boardId: number,
  body: SAUpdateBoardRequest
): Promise<{ result: string }> => {
  const { data } = await apiClient.put<{ result: string }>(`/api/admin-sa/board/${boardId}`, body);
  return data;
};

/** SA 게시글 삭제 (복수) */
export const deleteSABoards = async (
  boardIds: number[]
): Promise<{ result: string; deletedCount: number }> => {
  const { data } = await apiClient.delete<{ result: string; deletedCount: number }>(
    "/api/admin-sa/board",
    {
      data: { boardIds },
    }
  );
  return data;
};

/** SA 게시글 고정 */
export const pinSABoard = async (boardId: number): Promise<{ result: string }> => {
  const { data } = await apiClient.patch<{ result: string }>(`/api/admin-sa/board/${boardId}/pin`);
  return data;
};

/** SA 게시글 고정 해제 */
export const unpinSABoard = async (boardId: number): Promise<{ result: string }> => {
  const { data } = await apiClient.patch<{ result: string }>(
    `/api/admin-sa/board/${boardId}/unpin`
  );
  return data;
};

/** SA 게시글 폼 옵션 조회 */
export const getSABoardFormOptions = async (): Promise<SABoardFormOptionsResponse> => {
  const { data } = await apiClient.get<SABoardFormOptionsResponse>("/api/admin-sa/board/write");
  return data;
};
