/* ========================================
   리뷰어 캠페인 유형별 목록 API
   ======================================== */

/**
 * userCampaignList
 *
 * 목적: 리뷰어 캠페인 유형별 목록 조회 (배송/방문/구매평/기자단/미션)
 *
 * 사용 페이지:
 * - /campaign/delivery, /campaign/visit, /campaign/review
 * - /campaign/reporter, /campaign/mission
 *
 * 백엔드 API:
 * - R-22: GET /campaign/{type} (대시보드 유형별 조회)
 *   type = delivery | visit | purchase | reporter | mission
 *   Auth: Bearer {access_token}
 */

import { apiClient } from "@/lib/api/client";
import type { CampaignListApiResponse } from "@/types/api/campaign";

/** 캠페인 유형 path variable (백엔드 기준) */
export type CampaignTypeParam = "delivery" | "visit" | "purchase" | "reporter" | "mission";

/** 유형별 조회 쿼리 파라미터 */
export interface CampaignListParams {
  categoryId?: number;
  requiredPlatformId?: number;
  state?: string;
}

/**
 * 리뷰어 캠페인 유형별 목록 조회
 * GET /campaign/{type}
 * Bearer 토큰으로 인증
 */
export async function fetchCampaignListByType(
  type: CampaignTypeParam,
  params?: CampaignListParams
): Promise<CampaignListApiResponse> {
  const { data } = await apiClient.get<CampaignListApiResponse>(
    `/api/v1/reviewer/dashboard/${type}`,
    { params }
  );
  return data;
}
