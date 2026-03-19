/* ========================================
   SA 관리자 출금 요청 페이지
   ======================================== */

/**
 * WithdrawalRequestPage
 *
 * 목적: SA 관리자가 출금 요청을 확인하고 승인/반려할 수 있는 페이지입니다.
 *
 * 사용 페이지:
 * - /manager_sa/settlement/withdrawal_request
 */

"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/manager_sa/settlement/withdrawal_request/withdrawal_request_page.module.css";
import Loading from "@/app/loading";
import ManagerPageTitle from "@/components/manager/common/fragments/ManagerPageTitle";
import WithdrawalRequestFilterSection, {
  type RequestFilterStatus,
} from "@/components/manager/sa/settlement/withdrawal_request/section/WithdrawalRequestFilterSection";
import RequestTable from "@/components/manager/sa/settlement/withdrawal_request/section/RequestTable";
import { useAdminWithdrawalRequests } from "@/hooks/manager/ga/useAdminWithdrawalRequests";
import type { AdminWithdrawalRequestItem } from "@/types/api/admin";

import type { StoredUserAccount } from "@/lib/auth/types";

// localStorage에 저장된 출금 요청 항목 타입
interface StoredWithdrawalRequest {
  id: string;
  status: string;
  user_id: string;
  user_name?: string;
  user_number?: string;
  account_holder: string;
  bank: string;
  account_number: string;
  requested_amount: number;
  request_date: string;
}

export default function WithdrawalRequestPage() {
  const [selected_filter, set_selected_filter] = useState<RequestFilterStatus>("all");

  // API 훅으로 출금 요청 목록 조회
  const { requests, isLoading } = useAdminWithdrawalRequests();

  // localStorage에서 pending 상태 출금 요청을 가져와 API 데이터와 합산
  const [local_withdrawal_requests, set_local_withdrawal_requests] = useState<
    AdminWithdrawalRequestItem[]
  >([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedRequests = localStorage.getItem("withdrawal_requests");
        const storedAccounts = localStorage.getItem("user_accounts");

        if (storedRequests) {
          const stored: StoredWithdrawalRequest[] = JSON.parse(storedRequests);
          const accounts: StoredUserAccount[] = storedAccounts ? JSON.parse(storedAccounts) : [];

          const formattedRequests: AdminWithdrawalRequestItem[] = stored
            .filter((req) => req.status === "pending")
            .map((req, index) => {
              const userAccount = accounts.find((a) => a.id === req.user_id);

              let ssn = "******-*******";
              if (userAccount?.ssn_front && userAccount?.ssn_back) {
                ssn = `${userAccount.ssn_front}-${userAccount.ssn_back}`;
              }

              const remaining = userAccount
                ? (userAccount.available_points || 0).toLocaleString()
                : "0";

              return {
                id: req.id,
                number: req.user_number || `00000${index + 1}`.slice(-6),
                round: "-",
                name: req.user_name || req.account_holder,
                account: `${req.bank} ${req.account_number} ${req.account_holder}`,
                ssn,
                amount: req.requested_amount.toLocaleString(),
                remaining,
                requestDate: new Date(req.request_date)
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
                type: "일반 회원",
                status: "정상",
              };
            });

          set_local_withdrawal_requests(formattedRequests);
        }
      } catch (_error) {
        // 출금 요청 로드 실패 시 빈 배열 유지
      }
    }
  }, []);

  if (isLoading) return <Loading />;

  // 긴급(round === "-") / 회차 정산(round !== "-") 분류
  const urgent_requests = requests.filter((r) => r.round === "-");
  const round_requests = requests.filter((r) => r.round !== "-");

  return (
    <div className={styles.container}>
      <div className={styles.main_content}>
        <ManagerPageTitle title="출금 요청" />

        {/* 긴급 출금 요청 테이블 */}
        <RequestTable
          title="긴급"
          data={[...urgent_requests, ...local_withdrawal_requests]}
          show_total={true}
          filter_section={
            <WithdrawalRequestFilterSection
              selected_filter={selected_filter}
              on_filter_change={set_selected_filter}
            />
          }
        />

        {/* 이번 순차 정산 출금 요청 테이블 */}
        <RequestTable
          title="회차 정산"
          data={[...round_requests, ...local_withdrawal_requests]}
          show_total={true}
          filter_section={
            <WithdrawalRequestFilterSection
              selected_filter={selected_filter}
              on_filter_change={set_selected_filter}
            />
          }
        />
      </div>
    </div>
  );
}
