import { partnerApiClient } from "@/lib/api/partnerClient";
import type {
  PartnerLoginRequest,
  PartnerLoginResponse,
  PartnerSessionResponse,
} from "@/types/api/partnerAuth";

/**
 * 파트너 로그인
 * POST /partner/login
 * 성공 시 서버에서 Set-Cookie: JSESSIONID / REMEMBER_ME 발급
 */
export const partnerLogin = async (req: PartnerLoginRequest): Promise<PartnerLoginResponse> => {
  const { data } = await partnerApiClient.post<PartnerLoginResponse>("/partner/login", req);
  return data;
};

/**
 * 파트너 세션 상태 확인
 * GET /partner/session
 * 쿠키 자동 포함 (withCredentials: true)
 */
export const getPartnerSession = async (): Promise<PartnerSessionResponse> => {
  const { data } = await partnerApiClient.get<PartnerSessionResponse>("/partner/session");
  return data;
};

/**
 * 파트너 로그아웃
 * POST /partner/logout
 */
export const partnerLogout = async (): Promise<void> => {
  await partnerApiClient.post("/partner/logout");
};
