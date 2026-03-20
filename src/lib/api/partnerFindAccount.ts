import { partnerApiClient } from "@/lib/api/partnerClient";
import type {
  FindPartnerIdRequest,
  FindPartnerIdResponse,
  FindPartnerPasswordRequest,
  FindPartnerPasswordResponse,
} from "@/types/api/partnerFindAccount";

/**
 * 파트너 아이디 찾기
 * POST /partner/auth/find-id
 */
export const findPartnerId = async (req: FindPartnerIdRequest): Promise<FindPartnerIdResponse> => {
  const { data } = await partnerApiClient.post<FindPartnerIdResponse>("/partner/auth/find-id", req);
  return data;
};

/**
 * 파트너 비밀번호 찾기
 * POST /partner/auth/find-password
 */
export const findPartnerPassword = async (
  req: FindPartnerPasswordRequest
): Promise<FindPartnerPasswordResponse> => {
  const { data } = await partnerApiClient.post<FindPartnerPasswordResponse>(
    "/partner/auth/find-password",
    req
  );
  return data;
};
