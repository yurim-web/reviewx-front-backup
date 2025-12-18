/* ========================================
   💰 SA 관리자 출금 요청 페이지
   ======================================== */

/**
 * SA 관리자 출금 요청 페이지
 *
 * 목적: SA 관리자가 출금 요청을 확인하고 승인/반려할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_sa/settlement/withdrawal_request
 *
 * 주요 기능:
 * - 필터 섹션 (승인, 반려 필터, 원천징수 영수증 다운로드)
 * - 긴급 출금 요청 테이블
 * - 이번 순차 정산 출금 요청 테이블
 *
 */

"use client";

import { useState } from "react";
import styles from "@/styles/manager_sa/settlement/withdrawal_request/page.module.css";
import ManagerPageTitle from "@/components/manager/common/fragments/ManagerPageTitle";
import WithdrawalRequestFilterSection, {
  type RequestFilterStatus,
} from "@/components/manager/sa/settlement/withdrawal_request/section/WithdrawalRequestFilterSection";
import RequestTable from "@/components/manager/sa/settlement/withdrawal_request/section/RequestTable";
import {
  urgentRequestList,
  currentRoundRequestList,
} from "@/data/manager_sa/settlement/withdrawalRequestData";

export default function WithdrawalRequestPage() {
  // 필터 상태 관리
  const [selected_filter, set_selected_filter] =
    useState<RequestFilterStatus>("all");

  return (
    <div className={styles.container}>
      <div className={styles.main_content}>
        {/* 페이지 제목 */}
        <ManagerPageTitle title="출금 요청" />

        {/* 긴급 출금 요청 테이블 */}
        <RequestTable
          title="긴급"
          data={urgentRequestList}
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
          data={currentRoundRequestList}
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
