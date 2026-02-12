/* ========================================
   📊 결제 내역 통계 카드 섹션 컴포넌트
   ======================================== */

/**
 * 결제 내역 통계 카드 섹션 컴포넌트
 *
 * 목적: 결제 내역 페이지의 상단 통계 카드들을 표시합니다.
 *
 * 사용 위치:
 * - /manager_sa/settlement/payment_history (결제 내역 페이지)
 *
 * 주요 기능:
 * - 통계 카드 3개를 표시합니다
 * - 이번 주 입금 내역: 무통장 입금 + 완료 상태
 * - 이번 주 카드 결제 금액: 카드 결제 + 완료 상태
 * - 이번 달 총 합계: 전체 + 완료 상태
 * - 테이블 데이터를 기반으로 실시간 계산
 * - 0건이면 0원으로 표시
 *
 */

"use client";

import { useMemo } from "react";
import styles from '@/styles/manager/common/settlement/stat_cards_section.module.css';
import { getPaymentHistoryList, type PaymentHistoryItem } from '@/data/manager_sa/settlement/paymentHistoryData';
import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";
import type { BusinessType } from "@/components/manager/sa/settlement/payment_history/filter/BusinessTypeFilterModal";
import type { PaymentMethod } from "@/data/manager_sa/common/filterOptions";
import type { PaymentStatus } from "@/components/manager/sa/settlement/payment_history/filter/PaymentStatusFilterModal";
import type { AccountStatus } from "@/components/manager/sa/settlement/payment_history/filter/AccountStatusFilterDropdown";
import type { TaxInvoiceType } from "@/components/manager/sa/settlement/payment_history/filter/TaxInvoiceTypeFilterDropdown";
import type { MemberType } from "@/components/manager/sa/settlement/payment_history/filter/MemberTypeFilterDropdown";

interface StatCardsSectionProps {
  // 필터 상태 (테이블과 동일한 필터 사용)
  selected_date_range?: DateRange | undefined;
  selected_business_types?: BusinessType[];
  selected_payment_methods?: PaymentMethod[];
  selected_tax_invoice_types?: TaxInvoiceType[];
  selected_payment_statuses?: PaymentStatus[];
  selected_member_types?: MemberType[];
  selected_account_statuses?: AccountStatus[];
}

/**
 * 문자열 금액을 숫자로 변환하는 함수
 * 
 * @param amountStr - "10,000" 형식의 문자열
 * @returns 숫자 (예: 10000)
 * 
 * 학습 포인트:
 * - replace(/,/g, ''): 모든 쉼표를 제거합니다 (g 플래그는 전역 검색)
 * - parseInt(): 문자열을 정수로 변환합니다
 * - || 0: 변환 실패 시 0을 반환합니다
 */
function parse_amount(amount_str: string): number {
  return parseInt(amount_str.replace(/,/g, ''), 10) || 0;
}

/**
 * 숫자를 금액 형식 문자열로 변환하는 함수
 * 
 * @param amount - 숫자 금액
 * @returns "10,000원" 형식의 문자열
 * 
 * 학습 포인트:
 * - toLocaleString(): 숫자를 천 단위 구분 기호가 있는 문자열로 변환합니다
 * - 'ko-KR': 한국 로케일을 사용합니다
 */
function format_amount(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`;
}

/**
 * 날짜가 주어진 기간 내에 있는지 확인하는 함수
 * 
 * @param date_str - "2025-12-01 14:32" 형식의 날짜 문자열
 * @param start_date - 시작 날짜
 * @param end_date - 종료 날짜
 * @returns 기간 내에 있으면 true
 */
function is_date_in_range(date_str: string, start_date: Date, end_date: Date): boolean {
  const item_date_str = date_str.split(" ")[0]; // "2025-12-01"
  const item_date = new Date(item_date_str);
  item_date.setHours(0, 0, 0, 0);
  
  const start = new Date(start_date);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(end_date);
  end.setHours(23, 59, 59, 999);
  
  return item_date >= start && item_date <= end;
}

/**
 * 이번 주의 시작일과 종료일을 계산하는 함수
 * 
 * @returns 이번 주의 시작일과 종료일
 */
function get_current_week_range(): { start: Date; end: Date } {
  const now = new Date();
  const day_of_week = now.getDay(); // 0: 일요일, 6: 토요일
  const days_to_monday = day_of_week === 0 ? 6 : day_of_week - 1; // 월요일까지의 일수
  
  const start = new Date(now);
  start.setDate(now.getDate() - days_to_monday);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
}

/**
 * 이번 달의 시작일과 종료일을 계산하는 함수
 * 
 * @returns 이번 달의 시작일과 종료일
 */
function get_current_month_range(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
}

export default function StatCardsSection({
  selected_date_range,
  selected_business_types = [],
  selected_payment_methods = [],
  selected_tax_invoice_types = [],
  selected_payment_statuses = [],
  selected_member_types = [],
  selected_account_statuses = [],
}: StatCardsSectionProps) {
  // 필터링된 데이터를 계산하는 useMemo
  // 학습 포인트:
  // - useMemo: 의존성 배열의 값이 변경될 때만 함수를 실행하여 성능을 최적화합니다
  // - 테이블과 동일한 필터링 로직을 사용합니다
  const filtered_data = useMemo(() => {
    const list = getPaymentHistoryList();
    return list.filter((item) => {
      // 날짜 범위 필터 (신청일 기준)
      if (selected_date_range?.from && selected_date_range?.to) {
        if (!is_date_in_range(item.requestDate, selected_date_range.from, selected_date_range.to)) {
          return false;
        }
      }

      // 구분 필터
      if (selected_business_types.length > 0) {
        if (!selected_business_types.includes(item.businessType)) return false;
      }

      // 결제 수단 필터
      if (selected_payment_methods.length > 0) {
        if (!selected_payment_methods.includes(item.paymentMethod)) return false;
      }

      // 세금계산서 발행 필터
      if (selected_tax_invoice_types.length > 0) {
        const item_tax_invoice_type: TaxInvoiceType | null =
          item.taxInvoice === "O"
            ? "세금계산서"
            : item.taxInvoice === "X"
            ? "미발행"
            : null;

        if (!item_tax_invoice_type || !selected_tax_invoice_types.includes(item_tax_invoice_type)) {
          return false;
        }
      }

      // 결제 상태 필터
      if (selected_payment_statuses.length > 0) {
        if (!selected_payment_statuses.includes(item.paymentStatus)) return false;
      }

      // 회원 유형 필터
      if (selected_member_types.length > 0) {
        const item_member_type: MemberType | null =
          item.memberType === "모범 회원"
            ? "일반 회원"
            : item.memberType === "주의 회원"
            ? "주의 회원"
            : item.memberType === "이용 제한 회원"
            ? "이용 제한 회원"
            : null;

        if (!item_member_type || !selected_member_types.includes(item_member_type)) {
          return false;
        }
      }

      // 계정 상태 필터
      if (selected_account_statuses.length > 0) {
        // item.accountStatus를 AccountStatus로 변환
        // 데이터에서는 띄어쓰기 없이 되어 있지만 필터에서는 띄어쓰기가 있습니다
        const item_account_status: AccountStatus | null =
          item.accountStatus === "정상"
            ? "정상"
            : item.accountStatus === "일시정지"
            ? "일시 정지"
            : item.accountStatus === "영구정지"
            ? "영구 정지"
            : item.accountStatus === "탈퇴"
            ? "탈퇴"
            : null;

        if (!item_account_status || !selected_account_statuses.includes(item_account_status)) {
          return false;
        }
      }

      return true;
    });
  }, [
    selected_date_range,
    selected_business_types,
    selected_payment_methods,
    selected_tax_invoice_types,
    selected_payment_statuses,
    selected_member_types,
    selected_account_statuses,
  ]);

  // 이번 주 범위 계산
  const week_range = useMemo(() => get_current_week_range(), []);

  // 이번 달 범위 계산
  const month_range = useMemo(() => get_current_month_range(), []);

  // 통계 계산
  const stats = useMemo(() => {
    // 완료 상태만 필터링
    const completed_items = filtered_data.filter((item) => item.paymentStatus === "완료");

    // 1. 이번 주 입금 내역: 무통장 입금 + 완료 + 이번 주
    const week_deposit_items = completed_items.filter(
      (item) =>
        item.paymentMethod === "무통장 입금" &&
        is_date_in_range(item.requestDate, week_range.start, week_range.end)
    );

    // 2. 이번 주 카드 결제: 카드 결제 또는 포인트 충전 + 완료 + 이번 주
    const week_card_items = completed_items.filter(
      (item) =>
        (item.paymentMethod === "카드 결제" || item.paymentMethod === "포인트 충전") &&
        is_date_in_range(item.requestDate, week_range.start, week_range.end)
    );

    // 3. 이번 달 총 합계: 전체 + 완료 + 이번 달
    const month_total_items = completed_items.filter((item) =>
      is_date_in_range(item.requestDate, month_range.start, month_range.end)
    );

    // 금액 계산
    const calculate_total_amount = (items: PaymentHistoryItem[]): number => {
      return items.reduce((sum, item) => sum + parse_amount(item.chargedPoints), 0);
    };

    const week_deposit_count = week_deposit_items.length;
    const week_deposit_amount = calculate_total_amount(week_deposit_items);

    const week_card_count = week_card_items.length;
    const week_card_amount = calculate_total_amount(week_card_items);

    const month_total_count = month_total_items.length;
    const month_total_amount = calculate_total_amount(month_total_items);

    return {
      weekDeposit: {
        label: "이번 주 입금 내역",
        count: `${week_deposit_count}건`,
        amount: week_deposit_count > 0 ? format_amount(week_deposit_amount) : "0원",
      },
      weekCardPayment: {
        label: "이번 주 카드 결제 금액",
        amount: week_card_count > 0 ? format_amount(week_card_amount) : "0원",
        count: `${week_card_count}건`,
      },
      monthTotal: {
        label: "이번 달 총 합계",
        count: `${month_total_count}건`,
        amount: month_total_count > 0 ? format_amount(month_total_amount) : "0원",
      },
    };
  }, [filtered_data, week_range, month_range]);

  return (
    <div className={styles.stat_cards_section_three}>
      {/* 1. 이번 주 입금 내역 */}
      <div className={styles.stat_card}>
        <p className={styles.stat_card_title}>{stats.weekDeposit.label}</p>
        <div className={styles.stat_card_value_row}>
          <p className={styles.stat_card_count}>{stats.weekDeposit.count}</p>
          <p className={styles.stat_card_value}>{stats.weekDeposit.amount}</p>
        </div>
      </div>

      {/* 2. 이번 주 카드 결제 금액 */}
      <div className={styles.stat_card}>
        <p className={styles.stat_card_title}>{stats.weekCardPayment.label}</p>
        <div className={styles.stat_card_value_row}>
          <p className={styles.stat_card_value}>{stats.weekCardPayment.amount}</p>
          <p className={styles.stat_card_count}>{stats.weekCardPayment.count}</p>
        </div>
      </div>

      {/* 3. 이번 달 총 합계 */}
      <div className={styles.stat_card}>
        <p className={styles.stat_card_title}>{stats.monthTotal.label}</p>
        <div className={styles.stat_card_value_row}>
          <p className={styles.stat_card_count}>{stats.monthTotal.count}</p>
          <p className={styles.stat_card_value}>{stats.monthTotal.amount}</p>
        </div>
      </div>
    </div>
  );
}

