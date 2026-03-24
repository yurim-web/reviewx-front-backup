/* ========================================
   게시글 관리 API 함수
   ======================================== */

/**
 * posts API
 *
 * 목적: GA/SA 관리자 게시글 CRUD + 고정/해제 API 함수
 *
 * 백엔드 스펙:
 * - 목록: GET /api/admin/boards
 * - 상세: GET /api/admin/boards/{boardId}
 * - 등록: POST /api/admin/boards
 * - 수정: PUT /api/admin/boards/{boardId}
 * - 삭제: DELETE /api/admin/boards/{boardId}
 * - 고정/해제: PATCH /api/admin/boards/{boardId}/fix
 * - 폼 옵션: GET /api/admin/boards/form
 *
 * 사용 훅:
 * - hooks/manager/ga/useAdminPosts.ts
 */

import { apiClient } from "@/lib/api/client";

// ────────────────────────────────────────
// 구분(Division) / 대상(Target) enum
// ────────────────────────────────────────

export type BoardDivision = "NOTICE" | "QUESTIONS";
export type BoardTarget = "ALL" | "REVIEWER" | "PARTNER" | "ADMIN";

/** 구분 enum → 한글 레이블 매핑 */
export const BOARD_DIVISION_LABEL_MAP: Record<BoardDivision, string> = {
  NOTICE: "공지사항",
  QUESTIONS: "자주 묻는 질문",
};

/** 한글 레이블 → 구분 enum 매핑 */
export const BOARD_DIVISION_VALUE_MAP: Record<string, BoardDivision> = {
  공지사항: "NOTICE",
  "자주 묻는 질문": "QUESTIONS",
};

/** 대상 enum → 한글 레이블 매핑 */
export const BOARD_TARGET_LABEL_MAP: Record<BoardTarget, string> = {
  ALL: "전체",
  REVIEWER: "리뷰어",
  PARTNER: "파트너",
  ADMIN: "관리자",
};

/** 한글 레이블 → 대상 enum 매핑 */
export const BOARD_TARGET_VALUE_MAP: Record<string, BoardTarget> = {
  전체: "ALL",
  리뷰어: "REVIEWER",
  파트너: "PARTNER",
  관리자: "ADMIN",
};

// ────────────────────────────────────────
// API 응답 타입
// ────────────────────────────────────────

/** 공통 envelope */
interface ApiEnvelope<T> {
  result: string;
  generatedAt: string;
  data: T;
}

/** 게시글 목록 아이템 (GET /api/admin/boards) */
export interface BoardApiItem {
  boardId: number;
  division: BoardDivision;
  boardCategory: string;
  target: BoardTarget;
  title: string;
  viewCount: number;
  isFixed: boolean;
  createdAt: string;
  createdBy: string;
}

/** 게시글 목록 응답 data */
export interface BoardListData {
  boards: BoardApiItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

/** 게시글 목록 응답 envelope */
export type BoardListResponse = ApiEnvelope<BoardListData>;

/** 게시글 상세 (GET /api/admin/boards/{boardId}) */
export interface BoardDetailData {
  boardId: number;
  division: BoardDivision;
  boardCategory: string;
  target: BoardTarget;
  title: string;
  content: string;
  viewCount: number;
  isFixed: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
}

/** 게시글 상세 응답 envelope */
export type BoardDetailResponse = ApiEnvelope<BoardDetailData>;

/** 게시글 등록 요청 (POST /api/admin/boards) */
export interface CreateBoardRequest {
  division: BoardDivision;
  boardCategoryId: number;
  target: BoardTarget;
  title: string;
  content: string;
}

/** 게시글 수정 요청 (PUT /api/admin/boards/{boardId}) */
export interface UpdateBoardRequest {
  division: BoardDivision;
  boardCategoryId: number;
  target: BoardTarget;
  title: string;
  content: string;
}

/** 고정/해제 요청 (PATCH /api/admin/boards/{boardId}/fix) */
export interface ToggleFixRequest {
  isFixed: boolean;
}

/** 폼 옵션 아이템 */
export interface FormOption {
  value: string;
  label: string;
}

/** 카테고리 폼 옵션 (division별) */
export interface BoardCategoryOption {
  boardCategoryId: number;
  categoryName: string;
  division: BoardDivision;
}

/** 폼 옵션 응답 data (GET /api/admin/boards/form) */
export interface BoardFormOptionsData {
  divisions: FormOption[];
  targets: FormOption[];
  boardCategories: BoardCategoryOption[];
}

/** 폼 옵션 응답 envelope */
export type BoardFormOptionsResponse = ApiEnvelope<BoardFormOptionsData>;

/** 게시글 등록/수정 응답 */
export type CreateBoardResponse = ApiEnvelope<{ boardId: number }>;
export type UpdateBoardResponse = ApiEnvelope<{ boardId: number }>;
export type ToggleFixResponse = ApiEnvelope<{ boardId: number; isFixed: boolean }>;
export type DeleteBoardResponse = ApiEnvelope<null>;

// ────────────────────────────────────────
// 목록 조회 파라미터
// ────────────────────────────────────────

export interface BoardListParams {
  page?: number;
  size?: number;
  division?: BoardDivision;
  target?: BoardTarget;
  keyword?: string;
  startDate?: string;
  endDate?: string;
}

// ────────────────────────────────────────
// API 함수
// ────────────────────────────────────────

/** 게시글 목록 조회 */
export const getBoardList = async (params?: BoardListParams): Promise<BoardListResponse> => {
  const { data } = await apiClient.get<BoardListResponse>("/api/admin/boards", { params });
  return data;
};

/** 게시글 상세 조회 */
export const getBoardDetail = async (boardId: number): Promise<BoardDetailResponse> => {
  const { data } = await apiClient.get<BoardDetailResponse>(`/api/admin/boards/${boardId}`);
  return data;
};

/** 게시글 등록 */
export const createBoard = async (body: CreateBoardRequest): Promise<CreateBoardResponse> => {
  const { data } = await apiClient.post<CreateBoardResponse>("/api/admin/boards", body);
  return data;
};

/** 게시글 수정 */
export const updateBoard = async (
  boardId: number,
  body: UpdateBoardRequest
): Promise<UpdateBoardResponse> => {
  const { data } = await apiClient.put<UpdateBoardResponse>(`/api/admin/boards/${boardId}`, body);
  return data;
};

/** 게시글 삭제 */
export const deleteBoard = async (boardId: number): Promise<DeleteBoardResponse> => {
  const { data } = await apiClient.delete<DeleteBoardResponse>(`/api/admin/boards/${boardId}`);
  return data;
};

/** 게시글 고정/해제 */
export const toggleBoardFix = async (
  boardId: number,
  body: ToggleFixRequest
): Promise<ToggleFixResponse> => {
  const { data } = await apiClient.patch<ToggleFixResponse>(
    `/api/admin/boards/${boardId}/fix`,
    body
  );
  return data;
};

/** 게시글 폼 옵션 조회 */
export const getBoardFormOptions = async (): Promise<BoardFormOptionsResponse> => {
  const { data } = await apiClient.get<BoardFormOptionsResponse>("/api/admin/boards/form");
  return data;
};
