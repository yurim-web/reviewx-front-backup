import { partnerApiClient } from "@/lib/api/partnerClient";
import type { FaqListResponse, FaqListParams } from "@/types/api/partnerFaq";

/**
 * 파트너 FAQ 목록 조회
 * GET /partner/boards/faqs
 */
export async function getPartnerFaqList(params?: FaqListParams): Promise<FaqListResponse> {
  const { data } = await partnerApiClient.get<FaqListResponse>("/partner/boards/faqs", { params });
  return data;
}
