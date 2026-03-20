import { useMutation } from "@tanstack/react-query";
import { partnerLogin } from "@/lib/api/partnerAuth";
import type { PartnerLoginRequest } from "@/types/api/partnerAuth";

/**
 * 파트너 로그인 뮤테이션 훅
 * POST /partner/login → 세션 쿠키 발급
 */
export const usePartnerLogin = () => {
  return useMutation({
    mutationFn: (req: PartnerLoginRequest) => partnerLogin(req),
  });
};
