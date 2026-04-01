import { partnerApiClient } from "@/lib/api/partnerClient";
import type {
  FindPartnerIdRequest,
  FindPartnerIdResponse,
  FindPartnerPasswordRequest,
  FindPartnerPasswordResponse,
  ResetPartnerPasswordRequest,
  ResetPartnerPasswordResponse,
} from "@/types/api/partnerFindAccount";

/**
 * 파트너 아이디 찾기
 * POST /partner/auth/find-id
 */
export const findPartnerId = async (req: FindPartnerIdRequest): Promise<FindPartnerIdResponse> => {
  const { data } = await partnerApiClient.post<{
    result: "OK";
    generatedAt: string;
    data: Omit<FindPartnerIdResponse, "result">;
  }>("/partner/auth/find-id", req);
  return { result: data.result, ...data.data };
};

/**
 * 파트너 비밀번호 찾기
 * POST /partner/auth/find-password
 */
export const findPartnerPassword = async (
  req: FindPartnerPasswordRequest
): Promise<FindPartnerPasswordResponse> => {
  const { data } = await partnerApiClient.post<{ result: "OK"; generatedAt: string; data: null }>(
    "/partner/auth/find-password",
    req
  );
  return { result: data.result };
};

/**
 * 파트너 비밀번호 재설정 (비밀번호 찾기 후 새 비밀번호 설정)
 * POST /partner/auth/reset-password
 */
export const resetPartnerPassword = async (
  req: ResetPartnerPasswordRequest
): Promise<ResetPartnerPasswordResponse> => {
  const { data } = await partnerApiClient.post<{ result: "OK"; generatedAt: string; data: null }>(
    "/partner/auth/reset-password",
    req
  );
  return { result: data.result };
};
