/* ========================================
   출금 승인 처리 훅
   ======================================== */

/**
 * useWithdrawalApprove
 *
 * 목적: 출금 요청 승인 상태 관리 및 localStorage 뮤테이션 처리
 *
 * 사용 페이지:
 * - /manager_sa/settlement/withdrawal_request
 */

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { AdminWithdrawalRequestItem } from "@/types/api/admin";
import type { StoredRequest, StoredAccount, PointHistoryEntry } from "./withdrawalTypes";
import { patchWithdrawalStatus } from "@/lib/api/point";

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
      if (typeof window !== "undefined") {
        const now = new Date();
        const approve_ids = pending_approve_items.map((item) => item.id);

        // 1. withdrawal_requests 상태 업데이트
        const storedRequests = localStorage.getItem("withdrawal_requests");
        const requestsMap = new Map<string, StoredRequest>();

        if (storedRequests) {
          const requests = JSON.parse(storedRequests);
          requests.forEach((req: StoredRequest) => {
            if (approve_ids.includes(req.id)) {
              req.status = "approved";
              req.processed_date = now.toISOString();
              requestsMap.set(req.id, req);
            }
          });
          localStorage.setItem("withdrawal_requests", JSON.stringify(requests));
        }

        // 2. user_accounts 포인트 처리
        const storedAccounts = localStorage.getItem("user_accounts");
        if (storedAccounts) {
          const accounts = JSON.parse(storedAccounts);
          pending_approve_items.forEach((item: AdminWithdrawalRequestItem) => {
            const requestData = requestsMap.get(item.id);
            if (!requestData) return;
            const requestAmount = requestData.requested_amount;
            const accountIndex = accounts.findIndex(
              (a: StoredAccount) => a.id === requestData.user_id
            );
            if (accountIndex !== -1) {
              const account = accounts[accountIndex] as StoredAccount;
              account.available_points = Math.max(
                0,
                (account.available_points || 0) - requestAmount
              );
              account.pending_points = Math.max(0, (account.pending_points || 0) - requestAmount);
              if (account.point_history) {
                const historyIndex = account.point_history.findIndex(
                  (h: PointHistoryEntry) => h.id === item.id
                );
                if (historyIndex !== -1) {
                  account.point_history[historyIndex].type = "withdrawn";
                  account.point_history[historyIndex].status = "completed";
                  account.point_history[historyIndex].description = "출금 완료";
                  account.point_history[historyIndex].balance = account.available_points;
                }
              }
              account.withdrawn_points = (account.withdrawn_points || 0) + requestAmount;
              accounts[accountIndex] = account;
            }
          });
          localStorage.setItem("user_accounts", JSON.stringify(accounts));
        }

        // 3. 알림 추가
        const storedNotifications = localStorage.getItem("notifications");
        const notifications = storedNotifications ? JSON.parse(storedNotifications) : [];
        pending_approve_items.forEach((item: AdminWithdrawalRequestItem) => {
          const requestData = requestsMap.get(item.id);
          if (requestData) {
            notifications.unshift({
              id: `notif_${item.id}_${now.getTime()}`,
              user_id: requestData.user_id,
              type: "withdrawal_completed",
              title: "출금 완료",
              message: `${requestData.requested_amount.toLocaleString()}원 출금이 완료되었습니다.`,
              is_read: false,
              created_at: now.toISOString(),
            });
          }
        });
        localStorage.setItem("notifications", JSON.stringify(notifications));

        // 4. withdrawal_history 기록 추가
        const storedHistory = localStorage.getItem("withdrawal_history");
        const withdrawalHistory = storedHistory ? JSON.parse(storedHistory) : [];
        const updatedAccounts = JSON.parse(localStorage.getItem("user_accounts") || "[]");

        pending_approve_items.forEach((item: AdminWithdrawalRequestItem) => {
          const requestData = requestsMap.get(item.id);
          if (requestData) {
            const userAccount = (updatedAccounts as StoredAccount[]).find(
              (a) => a.id === requestData.user_id
            );
            withdrawalHistory.push({
              id: `withdrawal_${item.id}_${now.getTime()}`,
              number: item.number,
              round: item.round || "-",
              name: item.name,
              account: item.account,
              ssn: item.ssn,
              amount: requestData.requested_amount.toLocaleString(),
              remaining: userAccount
                ? (userAccount.available_points || 0).toLocaleString()
                : item.remaining,
              requestDate: item.requestDate,
              paymentDate: now
                .toLocaleString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
                .replace(/\. /g, "-")
                .replace(".", "")
                .replace(",", ""),
              type: item.type,
              paymentStatus: "completed",
              status: item.status,
            });
          }
        });
        localStorage.setItem("withdrawal_history", JSON.stringify(withdrawalHistory));

        // 5. 서버 API에도 출금 상태 업데이트
        const apiResults = await Promise.allSettled(
          pending_approve_items.map((item: AdminWithdrawalRequestItem) => {
            const numericId = parseInt(String(item.id).replace(/\D/g, ""), 10);
            if (numericId) {
              return patchWithdrawalStatus(numericId, {
                status: "APPROVED",
                processed_date: now.toISOString(),
              });
            }
            return Promise.resolve();
          })
        );

        const failedCount = apiResults.filter((r) => r.status === "rejected").length;
        if (failedCount > 0) {
          alert(
            `${failedCount}건의 출금 승인 API 동기화에 실패했습니다. 관리자에게 문의해 주세요.`
          );
        }
      }
    } catch (_error) {
      alert("출금 승인 처리 중 오류가 발생했습니다.");
      return;
    }

    setSelectedIds([]);
    setIsApproveConfirmModalOpen(false);
    setIsApproveSuccessModalOpen(true);
    queryClient.invalidateQueries({ queryKey: ["adminWithdrawalRequests"] });
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
