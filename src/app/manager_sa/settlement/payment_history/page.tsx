/* ========================================
   SA 관리자 결제 내역 페이지
   ======================================== */

/**
 * PaymentHistoryPage
 *
 * 목적: SA 관리자가 결제 내역을 확인하고 관리할 수 있는 페이지입니다.
 *
 * 사용 페이지:
 * - /manager_sa/settlement/payment_history
 */

"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/manager_sa/settlement/payment_history/payment_history_page.module.css";
import Loading from "@/app/loading";
import ManagerPageTitle from "@/components/manager/common/fragments/ManagerPageTitle";
import StatCardsSection from "@/components/manager/sa/settlement/payment_history/section/StatCardsSection";
import PaymentHistoryFilterSection from "@/components/manager/sa/settlement/payment_history/section/PaymentHistoryFilterSection";
import PaymentHistoryTable from "@/components/manager/sa/settlement/payment_history/section/PaymentHistoryTable";
import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";
import type { BusinessType } from "@/components/manager/sa/settlement/payment_history/filter/BusinessTypeFilterModal";
import type { PaymentMethod } from "@/data/manager_sa/common/filterOptions";
import type { PaymentStatus } from "@/components/manager/sa/settlement/payment_history/filter/PaymentStatusFilterModal";
import type { AccountStatus } from "@/components/manager/sa/settlement/payment_history/filter/AccountStatusFilterDropdown";
import type { TaxInvoiceType } from "@/components/manager/sa/settlement/payment_history/filter/TaxInvoiceTypeFilterDropdown";
import type { MemberType } from "@/components/manager/sa/settlement/payment_history/filter/MemberTypeFilterDropdown";
import { useAdminPayments } from "@/hooks/manager/ga/useAdminPayments";

/**
 * 이번 달의 시작일과 종료일을 계산하는 함수
 *
 * @returns {DateRange} 이번 달의 시작일(from)과 종료일(to)을 포함한 DateRange 객체
 *
 * 학습 포인트:
 * - new Date(): 현재 날짜와 시간을 나타내는 Date 객체를 생성합니다
 * - getFullYear(): 연도를 반환합니다 (예: 2025)
 * - getMonth(): 월을 반환합니다 (0-11, 0이 1월, 11이 12월)
 * - new Date(year, month, day): 특정 날짜의 Date 객체를 생성합니다
 * - new Date(year, month + 1, 0): 다음 달의 0일은 이번 달의 마지막 날입니다
 */
function get_current_month_range(): DateRange {
  // 현재 날짜를 가져옵니다
  const now = new Date();

  // 이번 달의 시작일: 년, 월, 1일로 설정
  // 예: 2025년 1월이면 2025-01-01 00:00:00
  const start_of_month = new Date(now.getFullYear(), now.getMonth(), 1);

  // 이번 달의 종료일: 다음 달의 0일은 이번 달의 마지막 날입니다
  // 예: 2025년 1월이면 2025-02-00 = 2025-01-31 00:00:00
  const end_of_month = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // 시간 부분을 제거하여 날짜만 사용합니다
  // setHours(0, 0, 0, 0): 시간, 분, 초, 밀리초를 모두 0으로 설정
  start_of_month.setHours(0, 0, 0, 0);
  end_of_month.setHours(23, 59, 59, 999); // 종료일은 23:59:59로 설정하여 하루 전체를 포함

  return {
    from: start_of_month,
    to: end_of_month,
  };
}

export default function PaymentHistoryPage() {
  const { isLoading } = useAdminPayments();

  // 검색어 상태 관리
  const [search_query, set_search_query] = useState<string>("");

  // 필터 상태 관리
  // 📌 초기값은 undefined로 설정하고, useEffect에서 이번 달로 설정합니다
  // 이렇게 하면 서버 사이드 렌더링(SSR)과 클라이언트 사이드 렌더링(CSR) 간의
  // Hydration 오류를 방지할 수 있습니다
  const [selected_date_range, set_selected_date_range] = useState<DateRange | undefined>(undefined);

  // useEffect: 컴포넌트가 마운트될 때 이번 달로 날짜 범위 초기화
  // 📌 React Hook - useEffect 설명:
  // - 컴포넌트가 렌더링된 후에 실행되는 함수입니다
  // - 의존성 배열 []이 비어있으면 컴포넌트가 처음 마운트될 때만 실행됩니다
  // - 서버 사이드에서는 실행되지 않으므로 Hydration 오류를 방지할 수 있습니다
  useEffect(() => {
    // 페이지 로드 시 이번 달로 날짜 범위를 초기화합니다
    const current_month_range = get_current_month_range();
    set_selected_date_range(current_month_range);
  }, []); // 빈 의존성 배열: 컴포넌트가 처음 마운트될 때만 실행
  const [selected_business_types, set_selected_business_types] = useState<BusinessType[]>([]);
  const [selected_payment_methods, set_selected_payment_methods] = useState<PaymentMethod[]>([]);
  const [selected_tax_invoice_types, set_selected_tax_invoice_types] = useState<TaxInvoiceType[]>(
    []
  );
  const [selected_payment_statuses, set_selected_payment_statuses] = useState<PaymentStatus[]>([]);
  const [selected_member_types, set_selected_member_types] = useState<MemberType[]>([]);
  const [selected_account_statuses, set_selected_account_statuses] = useState<AccountStatus[]>([]);

  if (isLoading) return <Loading />;

  return (
    <div className={styles.container}>
      <div className={styles.main_content}>
        {/* 페이지 제목 */}
        <ManagerPageTitle title="결제 내역" />

        {/* 통계 카드 섹션 */}
        <StatCardsSection
          selected_date_range={selected_date_range}
          selected_business_types={selected_business_types}
          selected_payment_methods={selected_payment_methods}
          selected_tax_invoice_types={selected_tax_invoice_types}
          selected_payment_statuses={selected_payment_statuses}
          selected_member_types={selected_member_types}
          selected_account_statuses={selected_account_statuses}
        />

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
          selected_tax_invoice_types={selected_tax_invoice_types}
          on_tax_invoice_types_change={set_selected_tax_invoice_types}
          selected_payment_statuses={selected_payment_statuses}
          on_payment_statuses_change={set_selected_payment_statuses}
          selected_member_types={selected_member_types}
          on_member_types_change={set_selected_member_types}
          selected_account_statuses={selected_account_statuses}
          on_account_statuses_change={set_selected_account_statuses}
        />

        {/* 결제 내역 테이블 */}
        <PaymentHistoryTable
          search_query={search_query}
          selected_date_range={selected_date_range}
          selected_business_types={selected_business_types}
          selected_payment_methods={selected_payment_methods}
          selected_tax_invoice_types={selected_tax_invoice_types}
          selected_payment_statuses={selected_payment_statuses}
          selected_member_types={selected_member_types}
          selected_account_statuses={selected_account_statuses}
        />
      </div>
    </div>
  );
}
