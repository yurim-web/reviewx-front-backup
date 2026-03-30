/* ========================================
   리뷰어 FAQ 커스텀 훅
   ======================================== */

/**
 * useUserFaqList
 *
 * 목적: 리뷰어 FAQ 목록 조회 React Query 훅
 *
 * 사용 페이지:
 * - /user/faq (FAQ 목록)
 * - /user/faq/[id] (FAQ 상세 — 목록 데이터에서 boardId로 조회)
 *
 * API:
 * - 38번: GET /user/faq (FAQ 목록)
 */

import { useQuery } from "@tanstack/react-query";
import { fetchUserFaqList } from "@/lib/api/userFaq";
import type { FaqBoardCategory } from "@/types/api/partnerFaq";

export const userFaqKeys = {
  all: ["user", "faqs"] as const,
  list: (category: FaqBoardCategory) => [...userFaqKeys.all, category] as const,
};

/** 리뷰어 FAQ 목록 훅 */
export function useUserFaqList(category: FaqBoardCategory = "ALL") {
  return useQuery({
    queryKey: userFaqKeys.list(category),
    queryFn: () => fetchUserFaqList(category === "ALL" ? undefined : { board_category: category }),
    staleTime: 1000 * 60 * 10,
  });
}
