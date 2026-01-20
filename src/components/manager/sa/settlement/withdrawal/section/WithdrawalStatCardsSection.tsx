/* ========================================
   📊 출금 현황 통계 카드 섹션 컴포넌트
   ======================================== */

/**
 * 출금 현황 통계 카드 섹션 컴포넌트
 *
 * 목적: 출금 현황 페이지의 상단 통계 카드들을 표시합니다.
 *
 * 사용 위치:
 * - /manager_sa/settlement/withdrawal (출금 현황 페이지)
 *
 * 주요 기능:
 * - 통계 카드 4개를 표시합니다
 * - 이번 달 출금 합계, 이번 주 출금 예정, 긴급 정산, 예치금 총 합계
 * - 실제 테이블 데이터를 기반으로 통계를 계산합니다
 *
 * React 학습 포인트:
 * - 배열 메서드: filter, reduce를 사용하여 데이터를 필터링하고 집계합니다
 * - 날짜 계산: Date 객체를 사용하여 이번 달, 이번 주를 계산합니다
 * - 숫자 포맷팅: toLocaleString을 사용하여 천 단위 구분 기호를 추가합니다
 */

"use client";

import { useMemo } from "react";
import styles from "@/styles/manager_sa/settlement/withdrawal/stat_cards_section.module.css";
import { withdrawalList } from "@/data/manager_sa/settlement/withdrawalData";

/**
 * 금액 문자열을 숫자로 변환하는 함수
 *
 * 설명:
 * - "1,500,000" 형식의 문자열에서 쉼표를 제거하고 숫자로 변환합니다.
 * - 예: "1,500,000" → 1500000
 *
 * JavaScript 학습 포인트:
 * - replace(/,/g, ""): 정규표현식을 사용하여 모든 쉼표를 제거합니다.
 *   /,/g: 쉼표를 찾는 정규표현식, g 플래그는 모든 일치 항목을 찾습니다.
 * - parseInt(): 문자열을 정수로 변환합니다.
 */
const parse_amount = (amount_str: string): number => {
  // 쉼표를 제거하고 숫자로 변환
  return parseInt(amount_str.replace(/,/g, ""), 10) || 0;
};

/**
 * 숫자를 금액 형식 문자열로 변환하는 함수
 *
 * 설명:
 * - 숫자를 "1,500,000원" 형식의 문자열로 변환합니다.
 * - toLocaleString(): 숫자를 로케일 형식으로 변환합니다 (천 단위 구분 기호 추가).
 *
 * JavaScript 학습 포인트:
 * - toLocaleString("ko-KR"): 한국어 형식으로 숫자를 포맷팅합니다.
 * - || 0: NaN이나 undefined인 경우 0을 반환합니다.
 */
const format_amount = (amount: number): string => {
  return `${(amount || 0).toLocaleString("ko-KR")}원`;
};

/**
 * 이번 달의 시작일과 종료일을 계산하는 함수
 *
 * 설명:
 * - 현재 날짜를 기준으로 이번 달의 첫 번째 날(1일)과 마지막 날을 계산합니다.
 */
const get_current_month_range = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const first_day = new Date(year, month, 1);
  const last_day = new Date(year, month + 1, 0);
  return { first_day, last_day };
};

/**
 * 이번 주의 시작일과 종료일을 계산하는 함수
 *
 * 설명:
 * - 현재 날짜를 기준으로 이번 주(월요일~일요일)의 시작일과 종료일을 계산합니다.
 * - getDay(): 요일을 반환합니다 (0 = 일요일, 1 = 월요일, ..., 6 = 토요일).
 */
const get_current_week_range = () => {
  const now = new Date();
  const day = now.getDay(); // 0 (일요일) ~ 6 (토요일)
  // 월요일을 기준으로 계산 (일요일이면 -6, 월요일이면 -0)
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return { start: monday, end: sunday };
};

/**
 * 날짜 문자열이 특정 날짜 범위 내에 있는지 확인하는 함수
 *
 * 설명:
 * - "2026-01-15 14:30" 형식의 날짜 문자열이 주어진 범위 내에 있는지 확인합니다.
 */
const is_date_in_range = (
  date_str: string,
  start_date: Date,
  end_date: Date
): boolean => {
  const item_date_str = date_str.split(" ")[0]; // "2026-01-15"
  const item_date = new Date(item_date_str);
  item_date.setHours(0, 0, 0, 0);
  return item_date >= start_date && item_date <= end_date;
};

export default function WithdrawalStatCardsSection() {
  // useMemo: 계산 비용이 큰 연산을 메모이제이션합니다.
  // 의존성 배열이 비어있으므로 컴포넌트 마운트 시 한 번만 계산됩니다.
  // 📌 React 학습 포인트:
  // - useMemo: 계산 결과를 캐싱하여 불필요한 재계산을 방지합니다.
  // - 의존성 배열 []: 빈 배열이므로 한 번만 계산됩니다.
  const stats = useMemo(() => {
    // 이번 달 범위 계산
    const { first_day, last_day } = get_current_month_range();

    // 이번 주 범위 계산
    const { start: week_start, end: week_end } = get_current_week_range();

    // 1. 긴급 정산: paymentStatus가 "urgent"인 항목들
    const urgent_items = withdrawalList.filter(
      (item) => item.paymentStatus === "urgent"
    );
    const urgent_amount = urgent_items.reduce(
      (sum, item) => sum + parse_amount(item.amount),
      0
    );
    const urgent_count = urgent_items.length;

    // 2. 이번 주 출금 예정: 이번 주에 신청된 항목 중 paymentStatus가 "request"인 항목들
    const week_scheduled_items = withdrawalList.filter(
      (item) =>
        item.paymentStatus === "request" &&
        is_date_in_range(item.requestDate, week_start, week_end)
    );
    const week_scheduled_amount = week_scheduled_items.reduce(
      (sum, item) => sum + parse_amount(item.amount),
      0
    );

    // 3. 이번 달 출금 합계: 이번 달에 신청된 모든 항목들
    const month_items = withdrawalList.filter((item) =>
      is_date_in_range(item.requestDate, first_day, last_day)
    );
    const month_total_amount = month_items.reduce(
      (sum, item) => sum + parse_amount(item.amount),
      0
    );
    const month_total_count = month_items.length;

    // 4. 예치금 총 합계: 모든 항목의 remaining 합계
    const total_deposit = withdrawalList.reduce(
      (sum, item) => sum + parse_amount(item.remaining),
      0
    );

    return {
      urgent: {
        amount: format_amount(urgent_amount),
        count: `${urgent_count}건`,
      },
      weekScheduled: {
        amount: format_amount(week_scheduled_amount),
      },
      monthTotal: {
        amount: format_amount(month_total_amount),
        count: `${month_total_count}건`,
      },
      totalDeposit: {
        amount: format_amount(total_deposit),
      },
    };
  }, []); // 빈 의존성 배열: 컴포넌트 마운트 시 한 번만 계산
  return (
    <div className={styles.stat_cards_section}>
      {/* 1. 긴급 정산 */}
      <div className={styles.stat_card}>
        <p className={styles.stat_card_title}>긴급 정산</p>
        <div className={styles.stat_card_value_row}>
          <p
            className={`${styles.stat_card_value} ${styles.stat_card_value_urgent}`}
          >
            {stats.urgent.amount}
          </p>
          <p
            className={`${styles.stat_card_count} ${styles.stat_card_count_urgent}`}
          >
            {stats.urgent.count}
          </p>
        </div>
      </div>

      {/* 2. 이번 주 출금 예정 */}
      <div className={styles.stat_card}>
        <p className={styles.stat_card_title}>이번 주 출금 예정</p>
        <p className={styles.stat_card_value}>{stats.weekScheduled.amount}</p>
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
