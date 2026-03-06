/* ========================================
   출금 현황 통계 카드 섹션 컴포넌트
   ======================================== */

/**
 * WithdrawalStatCardsSection
 *
 * 목적: 출금 현황 페이지의 상단 통계 카드들을 표시합니다.
 *
 * 사용 페이지:
 * - /manager_sa/settlement/withdrawal (출금 현황 페이지)
 */

"use client";

import { useMemo, useState, useEffect } from "react";
import styles from "@/styles/manager/common/settlement/stat_cards_section.module.css";
import { type WithdrawalItem } from "@/data/manager_sa/settlement/withdrawalData";
import { useAdminWithdrawal } from "@/hooks/manager/ga/useAdminWithdrawal";
import { parseFormattedAmount, formatCurrency } from "@/utils/formatting/amount";
import { isDateInRange, getCurrentWeekRange, getCurrentMonthRange } from "@/utils/formatting/date";
import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";
import type { WithdrawalPaymentStatus } from "@/data/manager_sa/common/filterOptions";
import type { NormalStatus } from "@/components/manager/sa/settlement/withdrawal/filter/NormalStatusFilterDropdown";
import type { WithdrawalMemberType } from "@/components/manager/sa/settlement/withdrawal/filter/MemberTypeFilterDropdown";

interface WithdrawalStatCardsSectionProps {
  search_query?: string;
  selected_date_range?: DateRange | undefined;
  selected_payment_statuses?: WithdrawalPaymentStatus[];
  selected_member_types?: WithdrawalMemberType[];
  selected_normal_statuses?: NormalStatus[];
}

export default function WithdrawalStatCardsSection({
  search_query = "",
  selected_date_range,
  selected_payment_statuses = [],
  selected_member_types = [],
  selected_normal_statuses = [],
}: WithdrawalStatCardsSectionProps) {
  // API 또는 static fallback 데이터
  const { withdrawals: api_withdrawals } = useAdminWithdrawal();

  // localStorage에서 출금 완료 내역 로드
  const [withdrawal_history, set_withdrawal_history] = useState<WithdrawalItem[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedHistory = localStorage.getItem("withdrawal_history");
        if (storedHistory) {
          const history = JSON.parse(storedHistory);
          set_withdrawal_history(history);
        }
      } catch (_error) {
        // 출금 내역 로드 실패 시 빈 배열 유지
      }
    }
  }, []);

  // useMemo: 계산 비용이 큰 연산을 메모이제이션합니다.
  // 필터가 변경될 때마다 재계산됩니다.
  // 📌 React 학습 포인트:
  // - useMemo: 계산 결과를 캐싱하여 불필요한 재계산을 방지합니다.
  // - 의존성 배열: 필터 값들이 변경될 때마다 재계산됩니다.
  const stats = useMemo(() => {
    // API 데이터(또는 static fallback)와 localStorage 내역 합치기
    const all_withdrawal_list = [...api_withdrawals, ...withdrawal_history];

    // 검색어 및 필터로 필터링된 출금 현황 목록 (WithdrawalTable과 동일한 로직)
    const filtered_withdrawal_list = all_withdrawal_list.filter((item) => {
      // 검색어 필터 (이름, 계좌번호, 주민등록번호)
      if (search_query) {
        const q = search_query.toLowerCase();
        const matches_search =
          item.name.toLowerCase().includes(q) ||
          item.account.toLowerCase().includes(q) ||
          (item.ssn && item.ssn.toLowerCase().includes(q));
        if (!matches_search) return false;
      }

      // 날짜 범위 필터 (지급 신청일 기준)
      if (selected_date_range?.from && selected_date_range?.to) {
        const item_date_str = item.requestDate.split(" ")[0]; // "2025-08-05"
        const item_date = new Date(item_date_str);
        const start_date = new Date(selected_date_range.from);
        const end_date = new Date(selected_date_range.to);
        start_date.setHours(0, 0, 0, 0);
        end_date.setHours(23, 59, 59, 999);
        item_date.setHours(0, 0, 0, 0);
        if (item_date < start_date || item_date > end_date) return false;
      }

      // 지급 상태 필터
      if (selected_payment_statuses.length > 0) {
        if (!selected_payment_statuses.includes(item.paymentStatus)) return false;
      }

      // 유형 필터
      if (selected_member_types.length > 0) {
        if (!selected_member_types.includes(item.type as WithdrawalMemberType)) return false;
      }

      // 상태 필터
      if (selected_normal_statuses.length > 0) {
        if (!selected_normal_statuses.includes(item.status as NormalStatus)) return false;
      }

      return true;
    });

    // 이번 달 범위 계산
    const { start: first_day, end: last_day } = getCurrentMonthRange();

    // 이번 주 범위 계산
    const { start: week_start, end: week_end } = getCurrentWeekRange();

    // 1. 긴급 정산: paymentStatus가 "urgent"인 항목들 (필터링된 데이터 기준)
    const urgent_items = filtered_withdrawal_list.filter((item) => item.paymentStatus === "urgent");
    const urgent_amount = urgent_items.reduce(
      (sum, item) => sum + parseFormattedAmount(item.amount),
      0
    );
    const urgent_count = urgent_items.length;

    // 2. 이번 주 출금 예정: 이번 주에 신청된 항목 중 paymentStatus가 "request"인 항목들 (필터링된 데이터 기준)
    const week_scheduled_items = filtered_withdrawal_list.filter(
      (item) =>
        item.paymentStatus === "request" && isDateInRange(item.requestDate, week_start, week_end)
    );
    const week_scheduled_amount = week_scheduled_items.reduce(
      (sum, item) => sum + parseFormattedAmount(item.amount),
      0
    );
    const week_scheduled_count = week_scheduled_items.length;

    // 3. 이번 달 출금 합계: 이번 달에 신청된 모든 항목들 (필터링된 데이터 기준)
    const month_items = filtered_withdrawal_list.filter((item) =>
      isDateInRange(item.requestDate, first_day, last_day)
    );
    const month_total_amount = month_items.reduce(
      (sum, item) => sum + parseFormattedAmount(item.amount),
      0
    );
    const month_total_count = month_items.length;

    // 4. 예치금 총 합계: 모든 항목의 remaining 합계 (필터링된 데이터 기준)
    const total_deposit = filtered_withdrawal_list.reduce(
      (sum, item) => sum + parseFormattedAmount(item.remaining),
      0
    );

    return {
      urgent: {
        amount: formatCurrency(urgent_amount),
        count: `${urgent_count}건`,
      },
      weekScheduled: {
        amount: formatCurrency(week_scheduled_amount),
        count: `${week_scheduled_count}건`,
      },
      monthTotal: {
        amount: formatCurrency(month_total_amount),
        count: `${month_total_count}건`,
      },
      totalDeposit: {
        amount: formatCurrency(total_deposit),
      },
    };
  }, [
    api_withdrawals,
    search_query,
    selected_date_range,
    selected_payment_statuses,
    selected_member_types,
    selected_normal_statuses,
    withdrawal_history,
  ]); // 필터 값들이 변경될 때마다 재계산
  return (
    <div className={styles.stat_cards_section_four}>
      {/* 1. 긴급 정산 */}
      <div className={styles.stat_card}>
        <p className={styles.stat_card_title}>긴급 정산</p>
        <div className={styles.stat_card_value_row}>
          <p className={`${styles.stat_card_value} ${styles.stat_card_value_urgent}`}>
            {stats.urgent.amount}
          </p>
          <p className={`${styles.stat_card_count} ${styles.stat_card_count_urgent}`}>
            {stats.urgent.count}
          </p>
        </div>
      </div>

      {/* 2. 이번 주 출금 예정 */}
      <div className={styles.stat_card}>
        <p className={styles.stat_card_title}>이번 주 출금 예정</p>
        <div className={styles.stat_card_value_row}>
          <p className={styles.stat_card_value}>{stats.weekScheduled.amount}</p>
          <p className={styles.stat_card_count}>{stats.weekScheduled.count}</p>
        </div>
      </div>

      {/* 3. 이번 달 출금 합계 */}
      <div className={styles.stat_card}>
        <p className={styles.stat_card_title}>이번 달 출금 합계</p>
        <div className={styles.stat_card_value_row}>
          <p className={styles.stat_card_value}>{stats.monthTotal.amount}</p>
          <p className={styles.stat_card_count}>{stats.monthTotal.count}</p>
        </div>
      </div>

      {/* 4. 예치금 총 합계 */}
      <div className={styles.stat_card}>
        <p className={styles.stat_card_title}>예치금 총 합계</p>
        <p className={styles.stat_card_value}>{stats.totalDeposit.amount}</p>
      </div>
    </div>
  );
}
