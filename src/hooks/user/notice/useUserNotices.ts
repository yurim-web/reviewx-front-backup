/* ========================================
   리뷰어 공지사항 커스텀 훅
   ======================================== */

/**
 * useUserNotices / useUserNoticeDetail
 *
 * 목적: 리뷰어 공지사항 목록 조회 + 상세 조회 React Query 훅
 *
 * 사용 페이지:
 * - /user/notice (공지사항 목록)
 * - /user/notice/[id] (공지사항 상세)
 *
 * API:
 * - 37번: GET /user/notice (공지사항 목록)
 * - 37번: GET /user/notice/:boardId (공지사항 상세)
 */

import { useQuery } from "@tanstack/react-query";
import { fetchUserNoticeList, fetchUserNoticeDetail } from "@/lib/api/userNotice";
import type { NoticeBoardCategory } from "@/types/api/partnerNotice";

export const userNoticeKeys = {
  all: ["user", "notices"] as const,
  list: (category: NoticeBoardCategory) => [...userNoticeKeys.all, category] as const,
  detail: (boardId: number) => [...userNoticeKeys.all, "detail", boardId] as const,
};

/** 리뷰어 공지사항 목록 훅 */
export function useUserNoticeList(category: NoticeBoardCategory = "ALL") {
  return useQuery({
    queryKey: userNoticeKeys.list(category),
    queryFn: () =>
      fetchUserNoticeList(category === "ALL" ? undefined : { board_category: category }),
    staleTime: 1000 * 60 * 5,
  });
}

/** 리뷰어 공지사항 상세 훅 */
export function useUserNoticeDetail(boardId: number) {
  return useQuery({
    queryKey: userNoticeKeys.detail(boardId),
    queryFn: () => fetchUserNoticeDetail(boardId),
    enabled: boardId > 0,
    staleTime: 1000 * 60 * 10,
  });
}
