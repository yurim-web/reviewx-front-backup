import { useQuery } from "@tanstack/react-query";
import { getPartnerFaqList } from "@/lib/api/partnerFaq";
import type { FaqBoardCategory } from "@/types/api/partnerFaq";

export const partnerFaqKeys = {
  all: ["partner", "faqs"] as const,
  list: (category: FaqBoardCategory) => [...partnerFaqKeys.all, category] as const,
};

export function usePartnerFaqList(category: FaqBoardCategory = "ALL") {
  return useQuery({
    queryKey: partnerFaqKeys.list(category),
    queryFn: () => getPartnerFaqList(category === "ALL" ? undefined : { board_category: category }),
    staleTime: 1000 * 60 * 10,
  });
}
