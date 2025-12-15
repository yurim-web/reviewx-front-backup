/* ========================================
   💰 SA 관리자 출금 현황 페이지
   ======================================== */

/**
 * SA 관리자 출금 현황 페이지
 *
 * 목적: SA 관리자가 출금 현황을 확인하고 관리할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_sa/settlement/withdrawal
 *
 * 주요 기능:
 * - 상단 통계 카드 4개 (이번 달 출금 계획, 이번 달 예정 출금, 긴급 정산, 미처리 건수)
 * - 필터 섹션 (날짜, 지급 상태, 검색어, 원천징수 영수증 다운로드)
 * - 출금 현황 테이블 (체크박스, 번호, 순차, 이름, 계좌번호, 주민등록번호, 출금 포인트, 지급 신청일, 지급일, 유형, 상태, 상세 태그)
 *
 */

"use client";

import { useState } from "react";
import styles from "@/styles/manager_sa/settlement/withdrawal/page.module.css";
import ManagerPageTitle from "@/components/manager/common/fragments/ManagerPageTitle";
import WithdrawalStatCardsSection from "@/components/manager/sa/settlement/withdrawal/section/WithdrawalStatCardsSection";
import WithdrawalFilterSection from "@/components/manager/sa/settlement/withdrawal/section/WithdrawalFilterSection";
import WithdrawalTable from "@/components/manager/sa/settlement/withdrawal/section/WithdrawalTable";
import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";
import type { WithdrawalPaymentStatus } from "@/data/manager_sa/common/filterOptions";
import type { NormalStatus } from "@/components/manager/sa/settlement/withdrawal/filter/NormalStatusFilterModal";

export default function WithdrawalPage() {
  // 검색어 상태 관리
  const [search_query, set_search_query] = useState<string>("");

  // 필터 상태 관리
  const [selected_date_range, set_selected_date_range] = useState<
    DateRange | undefined
  >(undefined);
  const [selected_payment_statuses, set_selected_payment_statuses] = useState<
    WithdrawalPaymentStatus[]
  >([]);
  const [selected_normal_statuses, set_selected_normal_statuses] = useState<
    NormalStatus[]
  >([]);

  return (
    <div className={styles.container}>
      <div className={styles.main_content}>
        {/* 페이지 제목 */}
        <ManagerPageTitle title="출금 현황" />

        {/* 통계 카드 섹션 */}
        <WithdrawalStatCardsSection />

        {/* 필터 섹션 */}
        <WithdrawalFilterSection
          search_query={search_query}
          on_search_change={set_search_query}
          selected_date_range={selected_date_range}
          on_date_range_change={set_selected_date_range}
          selected_payment_statuses={selected_payment_statuses}
          on_payment_statuses_change={set_selected_payment_statuses}
          selected_normal_statuses={selected_normal_statuses}
          on_normal_statuses_change={set_selected_normal_statuses}
        />

        {/* 출금 현황 테이블 */}
        <WithdrawalTable
          search_query={search_query}
          selected_date_range={selected_date_range}
          selected_payment_statuses={selected_payment_statuses}
          selected_normal_statuses={selected_normal_statuses}
        />
      </div>
    </div>
  );
}
