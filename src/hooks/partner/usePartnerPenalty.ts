/* ========================================
   파트너 패널티 커스텀 훅
   ======================================== */

/**
 * usePartnerPenalty
 *
 * 목적: 파트너(광고주)의 패널티 내역을 백엔드 API(23번)에서 조회합니다.
 *
 * API: GET /partner/account/penalty?tab={tab}
 *
 * 사용 페이지:
 * - /partner/campaign_management/penalty (파트너 패널티 페이지)
 */

import { useQuery } from "@tanstack/react-query";
import { getPartnerPenalty } from "@/lib/api/partnerPenalty";
import type { PenaltyTab, PartnerPenaltyResponse } from "@/types/api/partnerPenalty";

export function usePartnerPenalty(tab: PenaltyTab = "warning") {
  return useQuery<PartnerPenaltyResponse>({
    queryKey: ["partnerPenalty", tab],
    queryFn: () => getPartnerPenalty(tab),
    staleTime: 5 * 60 * 1000,
  });
}
