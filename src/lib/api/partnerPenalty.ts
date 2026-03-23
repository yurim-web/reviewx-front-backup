/* ========================================
   파트너 패널티 내역 API 함수
   ======================================== */

/**
 * 파트너 패널티 내역 API
 *
 * API:
 * - 23번: GET /partner/account/penalty (패널티 내역 조회)
 *
 * 사용 위치:
 * - src/hooks/partner/usePartnerPenalty.ts
 */

import { apiClient } from "@/lib/api/client";
import type { PartnerPenaltyResponse, PenaltyTab } from "@/types/api/partnerPenalty";

/**
 * 패널티 내역 조회
 * GET /partner/account/penalty?tab={tab}
 */
export const getPartnerPenalty = async (
  tab: PenaltyTab = "warning"
): Promise<PartnerPenaltyResponse> => {
  const { data } = await apiClient.get<PartnerPenaltyResponse>("/partner/account/penalty", {
    params: { tab },
  });
  return data;
};
