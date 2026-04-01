/* ========================================
   파트너 대시보드 API 함수
   ======================================== */

/**
 * 파트너 대시보드 API
 *
 * 목적: 파트너 대시보드 + 검색 + 유형별 조회 API 함수
 *
 * 사용 페이지:
 * - /partner (대시보드 메인)
 * - /partner/search (캠페인 검색)
 *
 * API:
 * - 06번: GET /partner/dashboard
 * - GET /partner/search?keyword=xxx
 * - GET /partner/{type}
 */

import { partnerApiClient } from "@/lib/api/partnerClient";
import type {
  PartnerDashboardResponse,
  PartnerSearchResponse,
  PartnerTypeFilterParams,
  PartnerTypeFilterResponse,
} from "@/types/api/dashboard";

/** 1. 홈 대시보드 메인 조회 */
export const getPartnerDashboard = async (): Promise<PartnerDashboardResponse> => {
  const { data } = await partnerApiClient.get<{
    result: "OK";
    generatedAt: string;
    data: Omit<PartnerDashboardResponse, "result" | "generatedAt">;
  }>("/partner/dashboard");
  return { result: data.result, generatedAt: data.generatedAt, ...data.data };
};

/** 2. 키워드 검색 */
export const searchPartnerCampaigns = async (keyword: string): Promise<PartnerSearchResponse> => {
  const { data } = await partnerApiClient.get<{
    result: "OK";
    generatedAt: string;
    data: Omit<PartnerSearchResponse, "result" | "generatedAt">;
  }>("/partner/search", {
    params: { keyword },
  });
  return { result: data.result, generatedAt: data.generatedAt, ...data.data };
};

/** 3. 유형별 필터 조회 */
export const getPartnerCampaignsByType = async ({
  type,
  ...params
}: PartnerTypeFilterParams): Promise<PartnerTypeFilterResponse> => {
  const { data } = await partnerApiClient.get<{
    result: "OK";
    generatedAt: string;
    data: Omit<PartnerTypeFilterResponse, "result" | "generatedAt">;
  }>(`/partner/${type}`, {
    params,
  });
  return { result: data.result, generatedAt: data.generatedAt, ...data.data };
};

// ── 하위 호환 별칭 ──
/** @deprecated getPartnerDashboard 사용 */
export const fetchDashboard = getPartnerDashboard;
