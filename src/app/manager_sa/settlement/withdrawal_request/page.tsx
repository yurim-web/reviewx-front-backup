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

import { useState } from "react";
import styles from "@/styles/manager_sa/settlement/withdrawal_request/withdrawal_request_page.module.css";
import Loading from "@/app/loading";
import ManagerPageTitle from "@/components/manager/common/fragments/ManagerPageTitle";
import WithdrawalRequestFilterSection, {
  type RequestFilterStatus,
} from "@/components/manager/sa/settlement/withdrawal_request/section/WithdrawalRequestFilterSection";
import RequestTable from "@/components/manager/sa/settlement/withdrawal_request/section/RequestTable";
import { useSAWithdrawalRequests } from "@/hooks/manager/sa/settlement/useSAWithdrawalRequests";

export default function WithdrawalRequestPage() {
  const [urgent_filter, set_urgent_filter] = useState<RequestFilterStatus>("all");
  const [round_filter, set_round_filter] = useState<RequestFilterStatus>("all");

  // SA 전용 훅으로 출금 요청 목록 조회
  const { urgentRequests, roundRequests, isLoading } = useSAWithdrawalRequests();

  if (isLoading) return <Loading />;

  return (
    <div className={styles.container}>
      <div className={styles.main_content}>
        <ManagerPageTitle title="출금 요청" />

        {/* 긴급 출금 요청 테이블 */}
        <RequestTable
          title="긴급"
          data={urgentRequests}
          show_total={true}
          filter_section={
            <WithdrawalRequestFilterSection
              selected_filter={urgent_filter}
              on_filter_change={set_urgent_filter}
            />
          }
        />

        {/* 이번 순차 정산 출금 요청 테이블 */}
        <RequestTable
          title="회차 정산"
          data={roundRequests}
          show_total={true}
          filter_section={
            <WithdrawalRequestFilterSection
              selected_filter={round_filter}
              on_filter_change={set_round_filter}
            />
          }
        />
      </div>
    </div>
  );
}
