import { useQuery } from "@tanstack/react-query";
import { getPartnerNoticeList, getPartnerNoticeDetail } from "@/lib/api/partnerNotice";
import type { NoticeBoardCategory } from "@/types/api/partnerNotice";

export const partnerNoticeKeys = {
  all: ["partner", "notices"] as const,
  list: (category: NoticeBoardCategory) => [...partnerNoticeKeys.all, category] as const,
  detail: (boardId: number) => [...partnerNoticeKeys.all, "detail", boardId] as const,
};

/** 공지사항 목록 훅 */
export function usePartnerNoticeList(category: NoticeBoardCategory = "ALL") {
  return useQuery({
    queryKey: partnerNoticeKeys.list(category),
    queryFn: () =>
      getPartnerNoticeList(category === "ALL" ? undefined : { board_category: category }),
    staleTime: 1000 * 60 * 5,
  });
}

/** 공지사항 상세 훅 */
export function usePartnerNoticeDetail(boardId: number) {
  return useQuery({
    queryKey: partnerNoticeKeys.detail(boardId),
    queryFn: () => getPartnerNoticeDetail(boardId),
    enabled: boardId > 0,
    staleTime: 1000 * 60 * 10,
  });
}
