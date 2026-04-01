/* ========================================
   SA 게시글 관리 React Query 훅
   ======================================== */

/**
 * useSAAdminPosts
 *
 * 목적: 최고관리자(SA) 게시글 CRUD + 고정/해제 React Query 훅
 *       SA 응답을 GA 훅과 동일한 인터페이스로 변환하여 공유 컴포넌트 호환성 유지
 *
 * 사용 페이지:
 * - /manager_sa/community/posts (SA 게시글 목록)
 * - /manager_sa/community/posts/create (SA 게시글 작성)
 * - /manager_sa/community/posts/[id] (SA 게시글 상세)
 * - /manager_sa/community/posts/[id]/edit (SA 게시글 수정)
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSABoardList,
  getSABoardDetail,
  createSABoard,
  updateSABoard,
  deleteSABoards,
  pinSABoard,
  unpinSABoard,
  getSABoardFormOptions,
  type SACreateBoardRequest,
  type SAUpdateBoardRequest,
} from "@/lib/api/sa-posts";
import type { BoardListParams } from "@/lib/api/posts";
import type {
  BoardListResponse,
  BoardDetailResponse,
  BoardFormOptionsResponse,
  BoardApiItem,
  BoardDetailData,
  BoardCategoryOption,
} from "@/lib/api/posts";

const SA_QUERY_KEY = "saAdminBoards";

/**
 * SA 게시글 목록 조회
 * - SA 응답(flat) → GA 응답(data wrapper) 형태로 변환
 */
export function useSAAdminPosts(params?: BoardListParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [SA_QUERY_KEY, params],
    enabled: options?.enabled ?? true,
    queryFn: async (): Promise<BoardListResponse> => {
      const raw = await getSABoardList(params);
      // SA 응답 → GA 응답 형태로 변환
      const boards: BoardApiItem[] = raw.boards.map((b) => ({
        boardId: b.boardId,
        division: b.division,
        boardCategory: b.category,
        target: b.target,
        title: b.title,
        viewCount: b.viewCount,
        isFixed: b.isPinned,
        createdAt: b.createdAt,
        createdBy: b.registrantName,
      }));
      return {
        result: raw.result,
        generatedAt: raw.generatedAt,
        data: {
          boards,
          totalCount: raw.totalCount,
          totalPages: 1,
          currentPage: 0,
          size: raw.totalCount,
        },
      };
    },
    staleTime: 30_000,
  });
}

/**
 * SA 게시글 상세 조회
 * - SA 응답(board 필드) → GA 응답(data wrapper) 형태로 변환
 */
export function useSABoardDetail(boardId: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [SA_QUERY_KEY, "detail", boardId],
    queryFn: async (): Promise<BoardDetailResponse> => {
      const raw = await getSABoardDetail(boardId);
      const b = raw.board;
      const detail: BoardDetailData = {
        boardId: b.boardId,
        division: b.division,
        boardCategory: b.category,
        target: b.target,
        title: b.title,
        content: b.content,
        viewCount: b.viewCount,
        isFixed: b.isPinned,
        createdAt: b.createdAt,
        createdBy: b.registrantName,
        updatedAt: b.updatedAt,
      };
      return {
        result: raw.result,
        generatedAt: raw.generatedAt,
        data: detail,
      };
    },
    enabled: boardId > 0 && (options?.enabled ?? true),
  });
}

/**
 * SA 폼 옵션 조회
 * - SA 응답(categories) → GA 응답(boardCategories) 형태로 변환
 */
export function useSABoardFormOptions(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [SA_QUERY_KEY, "formOptions"],
    enabled: options?.enabled ?? true,
    queryFn: async (): Promise<BoardFormOptionsResponse> => {
      const raw = await getSABoardFormOptions();
      // SA categories → GA boardCategories 변환
      const boardCategories: BoardCategoryOption[] = raw.categories.map((c, idx) => ({
        boardCategoryId: idx + 1, // SA는 code 기반이지만 GA 인터페이스에 맞춰 임시 ID
        categoryName: c.label,
        division: c.division as "NOTICE" | "QUESTIONS",
        categoryCode: c.code, // SA에서는 code를 사용하여 등록/수정
      }));
      return {
        result: raw.result,
        generatedAt: raw.generatedAt,
        data: {
          divisions: raw.divisions.map((d) => ({ value: d.code, label: d.label })),
          targets: raw.targets.map((t) => ({ value: t.code, label: t.label })),
          boardCategories,
        },
      };
    },
    staleTime: Infinity,
  });
}

/** SA 게시글 등록 */
export function useSACreateBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: SACreateBoardRequest) => createSABoard(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SA_QUERY_KEY] });
    },
  });
}

/** SA 게시글 수정 */
export function useSAUpdateBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ boardId, body }: { boardId: number; body: SAUpdateBoardRequest }) =>
      updateSABoard(boardId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SA_QUERY_KEY] });
    },
  });
}

/** SA 게시글 삭제 (복수) */
export function useSADeleteBoards() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (boardIds: number[]) => deleteSABoards(boardIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SA_QUERY_KEY] });
    },
  });
}

/** SA 게시글 고정 */
export function useSAPinBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (boardId: number) => pinSABoard(boardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SA_QUERY_KEY] });
    },
  });
}

/** SA 게시글 고정 해제 */
export function useSAUnpinBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (boardId: number) => unpinSABoard(boardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SA_QUERY_KEY] });
    },
  });
}
