import { useQuery } from "@tanstack/react-query";
import { getPartnerSession } from "@/lib/api/partnerAuth";

/**
 * 파트너 세션 상태 조회 훅
 * GET /partner/session → AUTHENTICATED / UNAUTHENTICATED
 *
 * @param enabled - 쿼리 활성화 여부 (파트너 경로에서만 true)
 */
export const usePartnerSession = (enabled = true) => {
  return useQuery({
    queryKey: ["partner", "session"],
    queryFn: getPartnerSession,
    enabled,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};
