/* ========================================
   출금 반려 처리 훅
   ======================================== */

/**
 * useWithdrawalReject
 *
 * 목적: 출금 요청 반려 상태 관리 및 localStorage 뮤테이션 처리
 *
 * 사용 페이지:
 * - /manager_sa/settlement/withdrawal_request
 */

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { AdminWithdrawalRequestItem } from "@/types/api/admin";
import type { StoredRequest, StoredAccount, PointHistoryEntry } from "./withdrawalTypes";
import { patchWithdrawalStatus } from "@/lib/api/point";

interface UseWithdrawalRejectParams {
  selected_ids: string[];
  setSelectedIds: (ids: string[]) => void;
}

export function useWithdrawalReject({ selected_ids, setSelectedIds }: UseWithdrawalRejectParams) {
  const queryClient = useQueryClient();
  const [is_reject_modal_open, setIsRejectModalOpen] = useState(false);
  const [pending_reject_ids, setPendingRejectIds] = useState<string[]>([]);

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
      if (typeof window !== "undefined") {
        const now = new Date();

        // 1. withdrawal_requests 상태 업데이트
        const storedRequests = localStorage.getItem("withdrawal_requests");
        const requestsMap = new Map<string, StoredRequest>();

        if (storedRequests) {
          const requests = JSON.parse(storedRequests);
          requests.forEach((req: StoredRequest) => {
            if (pending_reject_ids.includes(req.id)) {
              req.status = "rejected";
              req.processed_date = now.toISOString();
              req.rejection_reason = reason;
              requestsMap.set(req.id, req);
            }
          });
          localStorage.setItem("withdrawal_requests", JSON.stringify(requests));
        }

        // 2. user_accounts 포인트 복원
        const storedAccounts = localStorage.getItem("user_accounts");
        if (storedAccounts) {
          const accounts = JSON.parse(storedAccounts);
          pending_reject_ids.forEach((id: string) => {
            const requestData = requestsMap.get(id);
            if (!requestData) return;
            const requestAmount = requestData.requested_amount;
            const accountIndex = accounts.findIndex(
              (a: StoredAccount) => a.id === requestData.user_id
            );
            if (accountIndex !== -1) {
              const account = accounts[accountIndex] as StoredAccount;
              account.pending_points = (account.pending_points || 0) - requestAmount;
              if (account.point_history) {
                const historyIndex = account.point_history.findIndex(
                  (h: PointHistoryEntry) => h.id === id
                );
                if (historyIndex !== -1) {
                  account.point_history[historyIndex].status = "failed";
                  account.point_history[historyIndex].description = "출금 신청 반려";
                  account.point_history[historyIndex].rejection_reason = reason;
                  account.point_history[historyIndex].balance = account.available_points;
                }
              }
              accounts[accountIndex] = account;
            }
          });
          localStorage.setItem("user_accounts", JSON.stringify(accounts));
        }

        // 3. 알림 추가
        const storedNotifications = localStorage.getItem("notifications");
        const notifications = storedNotifications ? JSON.parse(storedNotifications) : [];
        pending_reject_ids.forEach((id: string) => {
          const requestData = requestsMap.get(id);
          if (requestData) {
            notifications.unshift({
              id: `notif_${id}_${now.getTime()}`,
              user_id: requestData.user_id,
              type: "withdrawal_rejected",
              title: "출금 반려",
              message: "출금 요청이 반려되었습니다.",
              is_read: false,
              created_at: now.toISOString(),
            });
          }
        });
        localStorage.setItem("notifications", JSON.stringify(notifications));

        // 4. mock 서버 출금 상태 업데이트 (PATCH /admin/withdrawal/:id)
        const now_iso = now.toISOString();
        const apiResults = await Promise.allSettled(
          pending_reject_ids.map((id: string) => {
            const numericId = parseInt(id.replace(/\D/g, ""), 10);
            if (numericId) {
              return patchWithdrawalStatus(numericId, {
                status: "REJECTED",
                processed_date: now_iso,
                rejection_reason: reason,
              });
            }
            return Promise.resolve();
          })
        );

        const failedCount = apiResults.filter((r) => r.status === "rejected").length;
        if (failedCount > 0) {
          alert(
            `${failedCount}건의 출금 반려 API 동기화에 실패했습니다. 관리자에게 문의해 주세요.`
          );
        }
      }
    } catch (_error) {
      alert("출금 반려 처리 중 오류가 발생했습니다.");
      return;
    }

    setSelectedIds([]);
    setPendingRejectIds([]);
    setIsRejectModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ["adminWithdrawalRequests"] });
  };

  return {
    pending_reject_ids,
    is_reject_modal_open,
    handle_reject,
    handle_confirm_reject,
    handle_close_reject_modal,
  };
}
