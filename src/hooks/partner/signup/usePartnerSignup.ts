import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { getPartnerSignupPage, partnerSignup } from "@/lib/api/partnerSignup";
import type { PartnerSignupRequest } from "@/types/api/partnerSignup";

/** 회원가입 페이지 데이터 (약관 + 은행 목록) 조회 */
export function usePartnerSignupPage() {
  return useQuery({
    queryKey: ["partner", "signup", "page"],
    queryFn: getPartnerSignupPage,
    staleTime: 1000 * 60 * 30,
  });
}

/** 회원가입 제출 mutation */
export function usePartnerSignupMutation() {
  return useMutation({
    mutationFn: (req: PartnerSignupRequest) => partnerSignup(req),
  });
}
