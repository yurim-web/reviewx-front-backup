/* ========================================
   파트너 포인트 API 함수
   ======================================== */

/**
 * partnerPoint API
 *
 * 목적: 파트너 포인트 내역 조회 API 함수
 *
 * 사용 훅:
 * - hooks/partner/usePartnerPointData.ts
 */

import { apiClient } from "@/lib/api/client";
import type { PartnerPointHistory } from "@/types/domain/partner";

/**
 * 파트너 포인트 내역 조회
 * GET /partner/point/history?partner_id=:id → /partner_point_history?partner_id=:id
 */
export const fetchPartnerPointHistory = (partnerId: number): Promise<PartnerPointHistory[]> =>
  apiClient
    .get<PartnerPointHistory[]>("/partner/point/history", {
      params: { partner_id: partnerId },
    })
    .then((res) => (Array.isArray(res.data) ? res.data : []));
