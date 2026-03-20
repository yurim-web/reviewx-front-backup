import { useQuery } from "@tanstack/react-query";
import { searchPartnerCampaigns } from "@/lib/api/dashboard";

/**
 * 파트너 캠페인 키워드 검색 (React Query)
 * keyword가 없으면 API 미호출
 */
export function usePartnerCampaignSearch(keyword: string) {
  return useQuery({
    queryKey: ["partnerSearch", keyword],
    queryFn: () => searchPartnerCampaigns(keyword),
    enabled: !!keyword,
    staleTime: 1000 * 60 * 2,
  });
}
