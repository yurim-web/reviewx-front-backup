/* ========================================
   💳 결제 요약 섹션 컴포넌트
   ======================================== */

/**
 * 결제 요약 섹션 컴포넌트
 *
 * 목적: 결제 요약 통계와 결제 금액 통계 차트를 한 박스 안에 표시하는 섹션 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /manager_sa (대시보드 페이지)
 */

"use client";

import { useMemo, useState, useEffect } from "react";
import styles from "@/styles/manager_sa/dashboard/sections/summary_section.module.css";
import StatCard, { StatCardData } from "../StatCard";
import AmountChart from "../chart/AmountChart";
import {
  getPaymentHistoryList,
  type PaymentHistoryItem,
} from "@/data/manager_sa/settlement/paymentHistoryData";
import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";
import type { SAPaymentSummary } from "@/types/api/admin";
import { parseFormattedAmount, formatCurrency } from "@/utils/formatting/amount";
import { isDateInRange } from "@/utils/formatting/date";
import {
  format,
  parse,
  eachDayOfInterval,
  differenceInDays,
  startOfWeek,
  endOfWeek,
  subDays,
} from "date-fns";

// PaymentSummarySection 컴포넌트의 props 타입 정의
interface PaymentSummarySectionProps {
  // 날짜 범위 (필터에 따라 변경됨)
  dateRange: DateRange;
  apiData?: SAPaymentSummary | null;
}

// 통계 카드 title 고정값
const PAYMENT_STAT_TITLES: readonly string[] = [
  "총 결제 금액",
  "입금 총액",
  "카드 결제 총액",
  "예상 수수료",
] as const;

export default function PaymentSummarySection({ dateRange, apiData }: PaymentSummarySectionProps) {
  // 결제 내역 데이터 로드
  const [payment_history, set_payment_history] = useState<PaymentHistoryItem[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const history = getPaymentHistoryList();
        set_payment_history(history);
      } catch (_error) {}
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
      total_payment: formatCurrency(apiData.totalPaymentAmount),
      deposit_increase: formatCurrency(apiData.completedPaymentAmount),
      card_payment: formatCurrency(apiData.pendingPaymentAmount),
      expected_fee: formatCurrency(Math.floor(apiData.totalPaymentAmount * 0.03)),
      total_payment_change: "- 0%",
      deposit_increase_change: "- 0%",
      card_payment_change: "- 0%",
      expected_fee_change: "- 0%",
      total_payment_changeType: "neutral" as const,
      deposit_increase_changeType: "neutral" as const,
      card_payment_changeType: "neutral" as const,
      expected_fee_changeType: "neutral" as const,
    };
  }, [apiData]);

  // API 차트 데이터 변환
  const apiChartData = useMemo(() => {
    if (!apiData?.paymentChart) return null;
    return apiData.paymentChart.map((item) => ({
      date: item.month,
      value: item.amount,
    }));
  }, [apiData]);

  // Fallback: 날짜 범위에 따라 통계 계산
  const stats = useMemo(() => {
    if (apiStats) return apiStats;
    if (!dateRange.from || !dateRange.to) {
      return {
        total_payment: "0원",
        deposit_increase: "0원",
        card_payment: "0원",
        expected_fee: "0원",
        total_payment_change: "- 0%",
        deposit_increase_change: "- 0%",
        card_payment_change: "- 0%",
        expected_fee_change: "- 0%",
        total_payment_changeType: "neutral" as const,
        deposit_increase_changeType: "neutral" as const,
        card_payment_changeType: "neutral" as const,
        expected_fee_changeType: "neutral" as const,
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

    // 현재 기간의 완료된 결제만 필터링
    const completed_items = payment_history.filter(
      (item) =>
        item.paymentStatus === "완료" && isDateInRange(item.approvalDate, start_date, end_date)
    );

    // 이전 기간의 완료된 결제만 필터링
    const previous_completed_items = payment_history.filter(
      (item) =>
        item.paymentStatus === "완료" &&
        isDateInRange(item.approvalDate, previous_start_date, previous_end_date)
    );

    // 1. 총결제 금액: 완료된 모든 결제의 chargedPoints 합계
    const total_payment = completed_items.reduce(
      (sum, item) => sum + parseFormattedAmount(item.chargedPoints),
      0
    );
    const previous_total_payment = previous_completed_items.reduce(
      (sum, item) => sum + parseFormattedAmount(item.chargedPoints),
      0
    );
    const total_payment_change = calculate_change_percentage(total_payment, previous_total_payment);

    // 2. 입금 총액: 무통장 입금이고 완료된 항목들의 chargedPoints 합계
    const deposit_items = completed_items.filter((item) => item.paymentMethod === "무통장 입금");
    const deposit_increase = deposit_items.reduce(
      (sum, item) => sum + parseFormattedAmount(item.chargedPoints),
      0
    );
    const previous_deposit_items = previous_completed_items.filter(
      (item) => item.paymentMethod === "무통장 입금"
    );
    const previous_deposit_increase = previous_deposit_items.reduce(
      (sum, item) => sum + parseFormattedAmount(item.chargedPoints),
      0
    );
    const deposit_increase_change = calculate_change_percentage(
      deposit_increase,
      previous_deposit_increase
    );

    // 3. 카드 결제 금액: 카드 결제 또는 포인트 충전이고 완료된 항목들의 chargedPoints 합계
    const card_items = completed_items.filter(
      (item) => item.paymentMethod === "카드 결제" || item.paymentMethod === "포인트 충전"
    );
    const card_payment = card_items.reduce(
      (sum, item) => sum + parseFormattedAmount(item.chargedPoints),
      0
    );
    const previous_card_items = previous_completed_items.filter(
      (item) => item.paymentMethod === "카드 결제" || item.paymentMethod === "포인트 충전"
    );
    const previous_card_payment = previous_card_items.reduce(
      (sum, item) => sum + parseFormattedAmount(item.chargedPoints),
      0
    );
    const card_payment_change = calculate_change_percentage(card_payment, previous_card_payment);

    // 4. 예상 수수료: 총결제 금액의 3% (또는 적절한 비율)
    const expected_fee = Math.floor(total_payment * 0.03);
    const previous_expected_fee = Math.floor(previous_total_payment * 0.03);
    const expected_fee_change = calculate_change_percentage(expected_fee, previous_expected_fee);

    return {
      total_payment: formatCurrency(total_payment),
      deposit_increase: formatCurrency(deposit_increase),
      card_payment: formatCurrency(card_payment),
      expected_fee: formatCurrency(expected_fee),
      total_payment_change: total_payment_change.change,
      deposit_increase_change: deposit_increase_change.change,
      card_payment_change: card_payment_change.change,
      expected_fee_change: expected_fee_change.change,
      total_payment_changeType: total_payment_change.changeType,
      deposit_increase_changeType: deposit_increase_change.changeType,
      card_payment_changeType: card_payment_change.changeType,
      expected_fee_changeType: expected_fee_change.changeType,
    };
  }, [dateRange, payment_history]);

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

    // 날짜별로 결제 완료 금액 집계 (approvalDate 기준)
    const date_map = new Map<string, number>();
    all_dates.forEach((date) => {
      const date_key = format(date, "M/d");
      date_map.set(date_key, 0);
    });

    payment_history.forEach((item) => {
      if (item.paymentStatus === "완료" && item.approvalDate) {
        const approval_date_str = item.approvalDate.split(" ")[0];
        const approval_date = parse(approval_date_str, "yyyy-MM-dd", new Date());
        approval_date.setHours(0, 0, 0, 0);

        if (approval_date >= chart_start_date && approval_date <= chart_end_date) {
          const date_key = format(approval_date, "M/d");
          const current = date_map.get(date_key) || 0;
          date_map.set(date_key, current + parseFormattedAmount(item.chargedPoints));
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
  }, [dateRange, payment_history]);

  // 통계 카드 데이터 생성
  const stat_cards_data: StatCardData[] = [
    {
      title: PAYMENT_STAT_TITLES[0],
      value: stats.total_payment,
      change: stats.total_payment_change,
      changeType: stats.total_payment_changeType,
    },
    {
      title: PAYMENT_STAT_TITLES[1],
      value: stats.deposit_increase,
      change: stats.deposit_increase_change,
      changeType: stats.deposit_increase_changeType,
    },
    {
      title: PAYMENT_STAT_TITLES[2],
      value: stats.card_payment,
      change: stats.card_payment_change,
      changeType: stats.card_payment_changeType,
    },
    {
      title: PAYMENT_STAT_TITLES[3],
      value: stats.expected_fee,
      change: stats.expected_fee_change,
      changeType: stats.expected_fee_changeType,
    },
  ];

  return (
    <div className={styles.summary_section_container}>
      {/* 섹션 제목 */}
      <h2 className={styles.summary_section_title}>결제 요약</h2>

      {/* 통계 카드 그리드 */}
      <div
        className={`${styles.summary_section_stats_grid} ${styles.summary_section_stats_grid_payment}`}
      >
        {stat_cards_data.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* 결제 금액 통계 차트 제목 */}
      <h2 className={styles.summary_section_chart_title}>결제 금액 통계</h2>

      {/* 차트 영역 */}
      <div className={styles.summary_section_chart_container}>
        <AmountChart
          data={chart_data}
          gradientId="paymentGradient"
          chartAreaClass="chart_area_payment"
          dateRange={dateRange}
        />
      </div>
    </div>
  );
}
