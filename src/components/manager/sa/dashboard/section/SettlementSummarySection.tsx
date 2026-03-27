/* ========================================
   정산 요약 섹션 컴포넌트
   ======================================== */

/**
 * SettlementSummarySection
 *
 * 목적: 정산 요약 통계와 정산 금액 통계 차트를 한 박스 안에 표시하는 섹션 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /manager_sa (최고관리자 대시보드)
 */

"use client";

import { useMemo, useState, useEffect } from "react";
import styles from "@/styles/manager_sa/dashboard/sections/summary_section.module.css";
import StatCard, { StatCardData } from "../StatCard";
import AmountChart from "../chart/AmountChart";
import { withdrawalList, type WithdrawalItem } from "@/data/manager_sa/settlement/withdrawalData";
import { parseFormattedAmount, formatCurrency } from "@/utils/formatting/amount";
import { isDateInRange } from "@/utils/formatting/date";
import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";
import type { SASettlementSummary } from "@/types/api/admin";
import {
  format,
  parse,
  eachDayOfInterval,
  differenceInDays,
  startOfWeek,
  endOfWeek,
  subDays,
} from "date-fns";

interface SettlementSummarySectionProps {
  dateRange: DateRange;
  apiData?: SASettlementSummary | null;
}

const SETTLEMENT_STAT_TITLES: readonly string[] = [
  "출금 요청 금액",
  "출금 완료 총액",
  "총 예치금 잔액",
] as const;

export default function SettlementSummarySection({
  dateRange,
  apiData,
}: SettlementSummarySectionProps) {
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

  // 증감률 계산 함수
  const calculate_change_percentage = (
    current: number,
    previous: number
  ): { change: string; changeType: "positive" | "negative" | "neutral" } => {
    if (previous === 0) {
      if (current === 0) {
        return { change: "- 0%", changeType: "neutral" };
      }
      return { change: "↑ 100%", changeType: "positive" };
    }

    const percentage = Math.round(((current - previous) / previous) * 100);

    if (percentage > 0) {
      return { change: `↑ ${percentage}%`, changeType: "positive" };
    } else if (percentage < 0) {
      return { change: `↓ ${Math.abs(percentage)}%`, changeType: "negative" };
    } else {
      return { change: "- 0%", changeType: "neutral" };
    }
  };

  // API 데이터가 있으면 우선 사용
  const apiStats = useMemo(() => {
    if (!apiData) return null;
    return {
      request_amount: formatCurrency(apiData.withdrawalRequestAmount),
      completed_amount: formatCurrency(apiData.withdrawalCompleteAmount),
      total_deposit: formatCurrency(apiData.totalDepositBalance),
      request_amount_change: "- 0%",
      completed_amount_change: "- 0%",
      total_deposit_change: "- 0%",
      request_amount_changeType: "neutral" as const,
      completed_amount_changeType: "neutral" as const,
      total_deposit_changeType: "neutral" as const,
    };
  }, [apiData]);

  // API 차트 데이터 변환
  const apiChartData = useMemo(() => {
    if (!apiData?.settlementChart) return null;
    return apiData.settlementChart.map((item) => ({
      date: item.month,
      value: item.amount,
    }));
  }, [apiData]);

  // Fallback: 날짜 범위에 따라 통계 계산
  const stats = useMemo(() => {
    if (apiStats) return apiStats;
    if (!dateRange.from || !dateRange.to) {
      return {
        request_amount: "0원",
        completed_amount: "0원",
        total_deposit: "0원",
        request_amount_change: "- 0%",
        completed_amount_change: "- 0%",
        total_deposit_change: "- 0%",
        request_amount_changeType: "neutral" as const,
        completed_amount_changeType: "neutral" as const,
        total_deposit_changeType: "neutral" as const,
      };
    }

    // 날짜 범위 설정
    const start_date = new Date(dateRange.from);
    start_date.setHours(0, 0, 0, 0);
    const end_date = new Date(dateRange.to);
    end_date.setHours(23, 59, 59, 999);

    // 전월 대비 증감 계산을 위한 이전 기간 계산
    const period_days = differenceInDays(end_date, start_date) + 1;
    const previous_start_date = subDays(start_date, period_days);
    const previous_end_date = subDays(start_date, 1);
    previous_start_date.setHours(0, 0, 0, 0);
    previous_end_date.setHours(23, 59, 59, 999);

    // 모든 출금 데이터 합치기
    const all_withdrawal_list = [...withdrawalList, ...withdrawal_history];

    // 현재 기간 데이터 필터링
    const filtered_list = all_withdrawal_list.filter((item) =>
      isDateInRange(item.requestDate, start_date, end_date)
    );

    // 이전 기간 데이터 필터링
    const previous_filtered_list = all_withdrawal_list.filter((item) =>
      isDateInRange(item.requestDate, previous_start_date, previous_end_date)
    );

    // 1. 출금 요청 금액: paymentStatus가 "request" 또는 "urgent"인 항목들의 amount 합계
    const request_items = filtered_list.filter(
      (item) => item.paymentStatus === "request" || item.paymentStatus === "urgent"
    );
    const request_amount = request_items.reduce(
      (sum, item) => sum + parseFormattedAmount(item.amount),
      0
    );

    const previous_request_items = previous_filtered_list.filter(
      (item) => item.paymentStatus === "request" || item.paymentStatus === "urgent"
    );
    const previous_request_amount = previous_request_items.reduce(
      (sum, item) => sum + parseFormattedAmount(item.amount),
      0
    );

    const request_change = calculate_change_percentage(request_amount, previous_request_amount);

    // 2. 출금 완료 총액: paymentStatus가 "completed"인 항목들의 amount 합계
    const completed_items = filtered_list.filter((item) => item.paymentStatus === "completed");
    const completed_amount = completed_items.reduce(
      (sum, item) => sum + parseFormattedAmount(item.amount),
      0
    );

    const previous_completed_items = previous_filtered_list.filter(
      (item) => item.paymentStatus === "completed"
    );
    const previous_completed_amount = previous_completed_items.reduce(
      (sum, item) => sum + parseFormattedAmount(item.amount),
      0
    );

    const completed_change = calculate_change_percentage(
      completed_amount,
      previous_completed_amount
    );

    // 3. 총 예치금 잔액: 모든 항목의 remaining 합계
    const total_deposit = filtered_list.reduce(
      (sum, item) => sum + parseFormattedAmount(item.remaining),
      0
    );

    const previous_total_deposit = previous_filtered_list.reduce(
      (sum, item) => sum + parseFormattedAmount(item.remaining),
      0
    );

    const deposit_change = calculate_change_percentage(total_deposit, previous_total_deposit);

    return {
      request_amount: formatCurrency(request_amount),
      completed_amount: formatCurrency(completed_amount),
      total_deposit: formatCurrency(total_deposit),
      request_amount_change: request_change.change,
      completed_amount_change: completed_change.change,
      total_deposit_change: deposit_change.change,
      request_amount_changeType: request_change.changeType,
      completed_amount_changeType: completed_change.changeType,
      total_deposit_changeType: deposit_change.changeType,
    };
  }, [dateRange, withdrawal_history]);

  // 차트 데이터 생성 (날짜 범위에 따라) — API 데이터 우선
  const chart_data = useMemo(() => {
    if (apiChartData) return apiChartData;
    if (!dateRange.from || !dateRange.to) {
      return [];
    }

    // 날짜 범위의 일수 계산
    const days_count = differenceInDays(dateRange.to, dateRange.from) + 1;

    // 오늘(1일)을 선택했을 경우 이번 주 범위로 확장
    let chart_start_date: Date;
    let chart_end_date: Date;
    if (days_count === 1) {
      chart_start_date = startOfWeek(dateRange.from, { weekStartsOn: 0 });
      chart_end_date = endOfWeek(dateRange.from, { weekStartsOn: 0 });
    } else {
      chart_start_date = dateRange.from;
      chart_end_date = dateRange.to;
    }

    // 날짜 범위의 모든 날짜 생성
    const all_dates = eachDayOfInterval({
      start: chart_start_date,
      end: chart_end_date,
    });

    // 모든 출금 데이터 합치기
    const all_withdrawal_list = [...withdrawalList, ...withdrawal_history];

    // 날짜별로 출금 완료 금액 집계
    const date_map = new Map<string, number>();
    all_dates.forEach((date) => {
      const date_key = format(date, "M/d");
      date_map.set(date_key, 0);
    });

    all_withdrawal_list.forEach((item) => {
      if (item.paymentStatus === "completed" && item.paymentDate !== "-") {
        const payment_date_str = item.paymentDate.split(" ")[0];
        const payment_date = parse(payment_date_str, "yyyy-MM-dd", new Date());
        payment_date.setHours(0, 0, 0, 0);

        if (payment_date >= chart_start_date && payment_date <= chart_end_date) {
          const date_key = format(payment_date, "M/d");
          const current = date_map.get(date_key) || 0;
          date_map.set(date_key, current + parseFormattedAmount(item.amount));
        }
      }
    });

    // Map을 배열로 변환하고 날짜 순으로 정렬
    return all_dates.map((date) => {
      const date_key = format(date, "M/d");
      return {
        date: date_key,
        value: date_map.get(date_key) || 0,
      };
    });
  }, [dateRange, withdrawal_history]);

  // 통계 카드 데이터 생성
  const stat_cards_data: StatCardData[] = [
    {
      title: SETTLEMENT_STAT_TITLES[0],
      value: stats.request_amount,
      change: stats.request_amount_change,
      changeType: stats.request_amount_changeType,
    },
    {
      title: SETTLEMENT_STAT_TITLES[1],
      value: stats.completed_amount,
      change: stats.completed_amount_change,
      changeType: stats.completed_amount_changeType,
    },
    {
      title: SETTLEMENT_STAT_TITLES[2],
      value: stats.total_deposit,
      change: stats.total_deposit_change,
      changeType: stats.total_deposit_changeType,
    },
  ];

  return (
    <div className={styles.summary_section_container}>
      {/* 섹션 제목 */}
      <h2 className={styles.summary_section_title}>정산 요약</h2>

      {/* 통계 카드 그리드 */}
      <div
        className={`${styles.summary_section_stats_grid} ${styles.summary_section_stats_grid_settlement}`}
      >
        {stat_cards_data.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* 정산 금액 통계 차트 제목 */}
      <h2 className={styles.summary_section_chart_title}>정산 금액 통계</h2>

      {/* 차트 영역 */}
      <div className={styles.summary_section_chart_container}>
        <AmountChart
          data={chart_data}
          gradientId="settlementGradient"
          chartAreaClass="chart_area_settlement"
          dateRange={dateRange}
        />
      </div>
    </div>
  );
}
