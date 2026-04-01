import { partnerApiClient } from "@/lib/api/partnerClient";
import type { FaqListResponse, FaqListParams } from "@/types/api/partnerFaq";

/**
 * 파트너 FAQ 목록 조회
 * GET /partner/boards/faqs
 */
export async function getPartnerFaqList(params?: FaqListParams): Promise<FaqListResponse> {
  const { data } = await partnerApiClient.get<{
    result: string;
    generatedAt: string;
    data: Omit<FaqListResponse, "result" | "generatedAt">;
  }>("/partner/boards/faqs", { params });
  return { result: data.result, generatedAt: data.generatedAt, ...data.data };
}
