/* ========================================
   SA 관리자 출금 현황 페이지
   ======================================== */

/**
 * WithdrawalPage
 *
 * 목적: SA 관리자가 출금 현황을 확인하고 관리할 수 있는 페이지입니다.
 *
 * 사용 페이지:
 * - /manager_sa/settlement/withdrawal
 */

"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/manager_sa/settlement/withdrawal/withdrawal_page.module.css";
import ManagerPageTitle from "@/components/manager/common/fragments/ManagerPageTitle";
import WithdrawalStatCardsSection from "@/components/manager/sa/settlement/withdrawal/section/WithdrawalStatCardsSection";
import WithdrawalFilterSection from "@/components/manager/sa/settlement/withdrawal/section/WithdrawalFilterSection";
import WithdrawalTable from "@/components/manager/sa/settlement/withdrawal/section/WithdrawalTable";
import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";
import type { WithdrawalPaymentStatus } from "@/data/manager_sa/common/filterOptions";
import type { NormalStatus } from "@/components/manager/sa/settlement/withdrawal/filter/NormalStatusFilterDropdown";
import type { WithdrawalMemberType } from "@/components/manager/sa/settlement/withdrawal/filter/MemberTypeFilterDropdown";

/**
 * 이번 달의 시작일과 종료일을 계산하는 함수
 *
 * 설명:
 * - 현재 날짜를 기준으로 이번 달의 첫 번째 날(1일)과 마지막 날을 계산합니다.
 * - 예: 오늘이 2026년 1월 19일이면 2026-01-01 ~ 2026-01-31을 반환합니다.
 *
 */
const get_current_month_range = (): DateRange => {
  // 현재 날짜 객체 생성
  const now = new Date();

  // 이번 달의 연도와 월 가져오기
  const year = now.getFullYear();
  const month = now.getMonth(); // 0부터 11까지 (0 = 1월, 11 = 12월)

  // 이번 달의 첫 번째 날 (1일)
  // new Date(year, month, 1): 해당 월의 1일을 생성합니다.
  const first_day = new Date(year, month, 1);

  // 이번 달의 마지막 날
  // new Date(year, month + 1, 0): 다음 달의 0일은 이번 달의 마지막 날을 의미합니다.
  // 예: new Date(2026, 1, 0) = 2026년 1월 31일
  const last_day = new Date(year, month + 1, 0);

  return {
    from: first_day,
    to: last_day,
  };
};

export default function WithdrawalPage() {
  // 검색어 상태 관리
  const [search_query, set_search_query] = useState<string>("");

  // 필터 상태 관리
  // 초기값을 undefined로 설정하여 Hydration 오류 방지
  // useEffect에서 클라이언트에서만 이번 달 범위로 초기화합니다.
  const [selected_date_range, set_selected_date_range] = useState<DateRange | undefined>(undefined);

  // 페이지 로드 시 이번 달로 날짜 범위 초기화
  // useEffect: 컴포넌트가 마운트된 후(클라이언트에서만) 실행됩니다.
  // 📌 Hydration 오류 방지:
  // - 서버 사이드에서는 실행되지 않으므로 서버와 클라이언트의 초기 렌더링 결과가 동일합니다.
  // - 클라이언트에서 마운트된 후에만 날짜 범위를 설정합니다.
  useEffect(() => {
    // 이번 달의 날짜 범위를 계산하여 설정
    const current_month_range = get_current_month_range();
    set_selected_date_range(current_month_range);
  }, []); // 빈 의존성 배열: 컴포넌트 마운트 시 한 번만 실행
  const [selected_payment_statuses, set_selected_payment_statuses] = useState<
    WithdrawalPaymentStatus[]
  >([]);
  const [selected_member_types, set_selected_member_types] = useState<WithdrawalMemberType[]>([]);
  const [selected_normal_statuses, set_selected_normal_statuses] = useState<NormalStatus[]>([]);

  return (
    <div className={styles.container}>
      <div className={styles.main_content}>
        {/* 페이지 제목 */}
        <ManagerPageTitle title="출금 현황" />

        {/* 통계 카드 섹션 */}
        <WithdrawalStatCardsSection
          search_query={search_query}
          selected_date_range={selected_date_range}
          selected_payment_statuses={selected_payment_statuses}
          selected_member_types={selected_member_types}
          selected_normal_statuses={selected_normal_statuses}
        />

        {/* 필터 섹션 */}
        <WithdrawalFilterSection
          search_query={search_query}
          on_search_change={set_search_query}
          selected_date_range={selected_date_range}
          on_date_range_change={set_selected_date_range}
          selected_payment_statuses={selected_payment_statuses}
          on_payment_statuses_change={set_selected_payment_statuses}
          selected_member_types={selected_member_types}
          on_member_types_change={set_selected_member_types}
          selected_normal_statuses={selected_normal_statuses}
          on_normal_statuses_change={set_selected_normal_statuses}
        />

        {/* 출금 현황 테이블 */}
        <WithdrawalTable
          search_query={search_query}
          selected_date_range={selected_date_range}
          selected_payment_statuses={selected_payment_statuses}
          selected_member_types={selected_member_types}
          selected_normal_statuses={selected_normal_statuses}
        />
      </div>
    </div>
  );
}
