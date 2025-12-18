/* ========================================
   💳 SA 관리자 결제 내역 페이지
   ======================================== */

/**
 * SA 관리자 결제 내역 페이지
 *
 * 목적: SA 관리자가 결제 내역을 확인하고 관리할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_sa/settlement/payment_history
 *
 * 주요 기능:
 * - 상단 통계 카드 3개 (이번 달 입금 내역, 이번 달 카드 결제 금액, 이번 달 총계)
 * - 필터 섹션 (날짜, 구분, 결제 수단, 세금계산서 발행, 결제, 상태, 검색어, 세금계산서 발행 영수증 다운로드)
 * - 결제 내역 테이블 (체크박스, 번호, 상호명, 세금계산서명, 구분, 결제 수단, 세금계산서, 충전 포인트, 결제, 신청일, 인증일, 유형, 상태)
 *
 */

"use client";

import { useState } from "react";
import styles from "@/styles/manager_sa/settlement/payment_history/page.module.css";
import ManagerPageTitle from "@/components/manager/common/fragments/ManagerPageTitle";
import StatCardsSection from "@/components/manager/sa/settlement/payment_history/section/StatCardsSection";
import PaymentHistoryFilterSection from "@/components/manager/sa/settlement/payment_history/section/PaymentHistoryFilterSection";
import PaymentHistoryTable from "@/components/manager/sa/settlement/payment_history/section/PaymentHistoryTable";
import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";
import type { BusinessType } from "@/components/manager/sa/settlement/payment_history/filter/BusinessTypeFilterModal";
import type { PaymentMethod } from "@/data/manager_sa/common/filterOptions";
import type { PaymentStatus } from "@/components/manager/sa/settlement/payment_history/filter/PaymentStatusFilterModal";
import type { AccountStatus } from "@/components/manager/sa/settlement/payment_history/filter/AccountStatusFilterModal";

export default function PaymentHistoryPage() {
  // 검색어 상태 관리
  const [search_query, set_search_query] = useState<string>("");

  // 필터 상태 관리
  const [selected_date_range, set_selected_date_range] = useState<
    DateRange | undefined
  >(undefined);
  const [selected_business_types, set_selected_business_types] = useState<
    BusinessType[]
  >([]);
  const [selected_payment_methods, set_selected_payment_methods] = useState<
    PaymentMethod[]
  >([]);
  const [tax_invoice_only, set_tax_invoice_only] = useState(false);
  const [selected_payment_statuses, set_selected_payment_statuses] = useState<
    PaymentStatus[]
  >([]);
  const [selected_account_statuses, set_selected_account_statuses] = useState<
    AccountStatus[]
  >([]);

  return (
    <div className={styles.container}>
      <div className={styles.main_content}>
        {/* 페이지 제목 */}
        <ManagerPageTitle title="결제 내역" />

        {/* 통계 카드 섹션 */}
        <StatCardsSection />

        {/* 필터 섹션 */}
        <PaymentHistoryFilterSection
          search_query={search_query}
          on_search_change={set_search_query}
          selected_date_range={selected_date_range}
          on_date_range_change={set_selected_date_range}
          selected_business_types={selected_business_types}
          on_business_types_change={set_selected_business_types}
          selected_payment_methods={selected_payment_methods}
          on_payment_methods_change={set_selected_payment_methods}
          tax_invoice_only={tax_invoice_only}
          on_tax_invoice_change={set_tax_invoice_only}
          selected_payment_statuses={selected_payment_statuses}
          on_payment_statuses_change={set_selected_payment_statuses}
          selected_account_statuses={selected_account_statuses}
          on_account_statuses_change={set_selected_account_statuses}
        />

        {/* 결제 내역 테이블 */}
        <PaymentHistoryTable
          search_query={search_query}
          selected_date_range={selected_date_range}
          selected_business_types={selected_business_types}
          selected_payment_methods={selected_payment_methods}
          tax_invoice_only={tax_invoice_only}
          selected_payment_statuses={selected_payment_statuses}
          selected_account_statuses={selected_account_statuses}
        />
      </div>
    </div>
  );
}
