/* ========================================
   게시글 관리 React Query 훅
   ======================================== */

/**
 * useAdminPosts
 *
 * 목적: GA/SA 관리자 게시글 CRUD + 고정/해제 React Query 훅
 *
 * 사용 페이지:
 * - /manager_ga/community/posts (GA 게시글 목록)
 * - /manager_sa/community/posts (SA 게시글 목록)
 * - /manager_ga/community/posts/create, /[id]/edit
 * - /manager_sa/community/posts/create, /[id]/edit
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBoardList,
  getBoardDetail,
  createBoard,
  updateBoard,
  deleteBoard,
  toggleBoardFix,
  getBoardFormOptions,
  type BoardListParams,
  type CreateBoardRequest,
  type UpdateBoardRequest,
  type ToggleFixRequest,
} from "@/lib/api/posts";

const QUERY_KEY = "adminBoards";

/** 게시글 목록 조회 */
export function useAdminPosts(params?: BoardListParams) {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => getBoardList(params),
    staleTime: 30_000,
  });
}

/** 게시글 상세 조회 */
export function useBoardDetail(boardId: number) {
  return useQuery({
    queryKey: [QUERY_KEY, "detail", boardId],
    queryFn: () => getBoardDetail(boardId),
    enabled: boardId > 0,
  });
}

/** 게시글 폼 옵션 조회 */
export function useBoardFormOptions() {
  return useQuery({
    queryKey: [QUERY_KEY, "formOptions"],
    queryFn: () => getBoardFormOptions(),
    staleTime: Infinity,
  });
}

/** 게시글 등록 */
export function useCreateBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateBoardRequest) => createBoard(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

/** 게시글 수정 */
export function useUpdateBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ boardId, body }: { boardId: number; body: UpdateBoardRequest }) =>
      updateBoard(boardId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

/** 게시글 삭제 */
export function useDeleteBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (boardId: number) => deleteBoard(boardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

/** 게시글 고정/해제 */
export function useToggleBoardFix() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ boardId, body }: { boardId: number; body: ToggleFixRequest }) =>
      toggleBoardFix(boardId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}
