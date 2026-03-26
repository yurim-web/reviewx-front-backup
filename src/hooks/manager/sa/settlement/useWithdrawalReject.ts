/* ========================================
   출금 반려 처리 훅
   ======================================== */

/**
 * useWithdrawalReject
 *
 * 목적: 출금 요청 반려 상태 관리 및 SA 백엔드 API 호출
 *
 * 사용 페이지:
 * - /manager_sa/settlement/withdrawal_request
 *
 * 백엔드 API (SA-05):
 * - POST /api/admin-sa/withdrawal/requests/reject → 일괄 반려
 */

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AdminWithdrawalRequestItem } from "@/types/api/admin";
import { rejectSAWithdrawalRequests } from "@/lib/api/admin";

interface UseWithdrawalRejectParams {
  selected_ids: string[];
  setSelectedIds: (ids: string[]) => void;
}

export function useWithdrawalReject({ selected_ids, setSelectedIds }: UseWithdrawalRejectParams) {
  const queryClient = useQueryClient();
  const [is_reject_modal_open, setIsRejectModalOpen] = useState(false);
  const [pending_reject_ids, setPendingRejectIds] = useState<string[]>([]);

  const rejectMutation = useMutation({
    mutationFn: ({ ids, reason }: { ids: number[]; reason?: string }) =>
      rejectSAWithdrawalRequests({ withdrawalRequestIds: ids, reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saWithdrawalRequests"] });
    },
  });

  const handle_reject = (item: AdminWithdrawalRequestItem) => {
    const ids_to_reject = selected_ids.length > 0 ? selected_ids : [item.id];
    setPendingRejectIds(ids_to_reject);
    if (selected_ids.length === 0) setSelectedIds([item.id]);
    setIsRejectModalOpen(true);
  };

  const handle_close_reject_modal = () => {
    setIsRejectModalOpen(false);
    setPendingRejectIds([]);
  };

  const handle_confirm_reject = async (reason: string) => {
    if (pending_reject_ids.length === 0 || !reason.trim()) return;

    try {
      const numericIds = pending_reject_ids.map((id) => Number(id));
      await rejectMutation.mutateAsync({ ids: numericIds, reason });
    } catch (_error) {
      alert("출금 반려 처리 중 오류가 발생했습니다.");
      return;
    }

    setSelectedIds([]);
    setPendingRejectIds([]);
    setIsRejectModalOpen(false);
  };

  return {
    pending_reject_ids,
    is_reject_modal_open,
    handle_reject,
    handle_confirm_reject,
    handle_close_reject_modal,
  };
}
