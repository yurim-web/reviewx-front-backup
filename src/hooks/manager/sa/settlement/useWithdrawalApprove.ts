/* ========================================
   출금 승인 처리 훅
   ======================================== */

/**
 * useWithdrawalApprove
 *
 * 목적: 출금 요청 승인 상태 관리 및 SA 백엔드 API 호출
 *
 * 사용 페이지:
 * - /manager_sa/settlement/withdrawal_request
 *
 * 백엔드 API (SA-05):
 * - POST /api/admin-sa/withdrawal/requests/approve → 일괄 승인
 */

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AdminWithdrawalRequestItem } from "@/types/api/admin";
import { approveSAWithdrawalRequests } from "@/lib/api/admin";

interface UseWithdrawalApproveParams {
  sorted_request_list: AdminWithdrawalRequestItem[];
  selected_ids: string[];
  setSelectedIds: (ids: string[]) => void;
}

export function useWithdrawalApprove({
  sorted_request_list,
  selected_ids,
  setSelectedIds,
}: UseWithdrawalApproveParams) {
  const queryClient = useQueryClient();
  const [is_approve_confirm_modal_open, setIsApproveConfirmModalOpen] = useState(false);
  const [is_approve_success_modal_open, setIsApproveSuccessModalOpen] = useState(false);
  const [pending_approve_items, setPendingApproveItems] = useState<AdminWithdrawalRequestItem[]>(
    []
  );

  const approveMutation = useMutation({
    mutationFn: (ids: number[]) => approveSAWithdrawalRequests({ withdrawalRequestIds: ids }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saWithdrawalRequests"] });
    },
  });

  const handle_approve = (id: string) => {
    const items_to_approve =
      selected_ids.length > 0
        ? sorted_request_list.filter((item) => selected_ids.includes(item.id))
        : [sorted_request_list.find((item) => item.id === id)];

    const valid_items = items_to_approve.filter(
      (item): item is AdminWithdrawalRequestItem => item !== undefined
    );

    if (valid_items.length === 0) return;

    setPendingApproveItems(valid_items);
    if (selected_ids.length === 0) setSelectedIds([id]);
    setIsApproveConfirmModalOpen(true);
  };

  const handle_close_approve_confirm_modal = () => {
    setIsApproveConfirmModalOpen(false);
    setPendingApproveItems([]);
  };

  const handle_confirm_approve = async () => {
    if (pending_approve_items.length === 0) return;

    try {
      const numericIds = pending_approve_items.map((item) => Number(item.id));
      await approveMutation.mutateAsync(numericIds);
    } catch (_error) {
      alert("출금 승인 처리 중 오류가 발생했습니다.");
      return;
    }

    setSelectedIds([]);
    setIsApproveConfirmModalOpen(false);
    setIsApproveSuccessModalOpen(true);
  };

  const handle_close_approve_success_modal = () => {
    setIsApproveSuccessModalOpen(false);
    setPendingApproveItems([]);
  };

  return {
    pending_approve_items,
    is_approve_confirm_modal_open,
    is_approve_success_modal_open,
    handle_approve,
    handle_confirm_approve,
    handle_close_approve_confirm_modal,
    handle_close_approve_success_modal,
  };
}
