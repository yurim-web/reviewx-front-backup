/* ========================================
   파트너 포인트 충전 Mutation 훅
   ======================================== */

/**
 * usePartnerCharge
 *
 * 목적: 파트너 포인트 충전 요청 (무통장 입금 / 신용카드)
 *
 * API:
 * - 24-2번: POST /partner/points/charge
 * - 24-2-1번: 무통장 입금 (paymentMethod: "BANK_TRANSFER")
 * - 24-2-2번: 신용카드 (paymentMethod: "CARD")
 *
 * 사용 페이지:
 * - /partner/point/charge
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestPointCharge } from "@/lib/api/partnerPoint";
import { partnerPointKeys } from "@/hooks/partner/point/usePartnerPoints";
import type { ChargeRequest, ChargeResponse } from "@/types/api/partnerPoint";

/** 포인트 충전 Mutation 훅 */
export function usePartnerCharge() {
  const queryClient = useQueryClient();

  return useMutation<ChargeResponse, Error, ChargeRequest>({
    mutationFn: requestPointCharge,
    onSuccess: () => {
      // 충전 후 포인트 내역 캐시 무효화
      queryClient.invalidateQueries({ queryKey: partnerPointKeys.list("ALL") });
      queryClient.invalidateQueries({ queryKey: partnerPointKeys.list("CHARGE") });
    },
  });
}
