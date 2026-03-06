/* ========================================
   결제 내역 통계 카드 섹션 컴포넌트
   ======================================== */

/**
 * StatCardsSection
 *
 * 목적: 결제 내역 페이지의 상단 통계 카드들을 표시합니다.
 *
 * 사용 페이지:
 * - /manager_sa/settlement/payment_history (결제 내역 페이지)
 */

"use client";

import { useMemo } from "react";
import styles from "@/styles/manager/common/settlement/stat_cards_section.module.css";
import { type PaymentHistoryItem } from "@/data/manager_sa/settlement/paymentHistoryData";
import { useAdminPayments } from "@/hooks/manager/ga/useAdminPayments";
import { parseFormattedAmount, formatCurrency } from "@/utils/formatting/amount";
import { isDateInRange, getCurrentWeekRange, getCurrentMonthRange } from "@/utils/formatting/date";
import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";
import type { BusinessType } from "@/components/manager/sa/settlement/payment_history/filter/BusinessTypeFilterModal";
import type { PaymentMethod } from "@/data/manager_sa/common/filterOptions";
import type { PaymentStatus } from "@/components/manager/sa/settlement/payment_history/filter/PaymentStatusFilterModal";
import type { AccountStatus } from "@/components/manager/sa/settlement/payment_history/filter/AccountStatusFilterDropdown";
import type { TaxInvoiceType } from "@/components/manager/sa/settlement/payment_history/filter/TaxInvoiceTypeFilterDropdown";
import type { MemberType } from "@/components/manager/sa/settlement/payment_history/filter/MemberTypeFilterDropdown";

interface StatCardsSectionProps {
  selected_date_range?: DateRange | undefined;
  selected_business_types?: BusinessType[];
  selected_payment_methods?: PaymentMethod[];
  selected_tax_invoice_types?: TaxInvoiceType[];
  selected_payment_statuses?: PaymentStatus[];
  selected_member_types?: MemberType[];
  selected_account_statuses?: AccountStatus[];
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
  // API 또는 static fallback 데이터
  const { payments: api_payments } = useAdminPayments();

  // 필터링된 데이터를 계산하는 useMemo
  const filtered_data = useMemo(() => {
    const list = api_payments;
    return list.filter((item) => {
      // 날짜 범위 필터 (신청일 기준)
      if (selected_date_range?.from && selected_date_range?.to) {
        if (!isDateInRange(item.requestDate, selected_date_range.from, selected_date_range.to)) {
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
          item.taxInvoiceType === "세금계산서"
            ? "세금계산서"
            : item.taxInvoiceType === "미발행"
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
    api_payments,
    selected_date_range,
    selected_business_types,
    selected_payment_methods,
    selected_tax_invoice_types,
    selected_payment_statuses,
    selected_member_types,
    selected_account_statuses,
  ]);

  // 이번 주 범위 계산
  const week_range = useMemo(() => getCurrentWeekRange(), []);

  // 이번 달 범위 계산
  const month_range = useMemo(() => getCurrentMonthRange(), []);

  // 통계 계산
  const stats = useMemo(() => {
    // 완료 상태만 필터링
    const completed_items = filtered_data.filter((item) => item.paymentStatus === "완료");

    // 1. 이번 주 입금 내역: 무통장 입금 + 완료 + 이번 주
    const week_deposit_items = completed_items.filter(
      (item) =>
        item.paymentMethod === "무통장 입금" &&
        isDateInRange(item.requestDate, week_range.start, week_range.end)
    );

    // 2. 이번 주 카드 결제: 카드 결제 또는 포인트 충전 + 완료 + 이번 주
    const week_card_items = completed_items.filter(
      (item) =>
        (item.paymentMethod === "카드 결제" || item.paymentMethod === "포인트 충전") &&
        isDateInRange(item.requestDate, week_range.start, week_range.end)
    );

    // 3. 이번 달 총 합계: 전체 + 완료 + 이번 달
    const month_total_items = completed_items.filter((item) =>
      isDateInRange(item.requestDate, month_range.start, month_range.end)
    );

    // 금액 계산
    const calculate_total_amount = (items: PaymentHistoryItem[]): number => {
      return items.reduce((sum, item) => sum + parseFormattedAmount(item.chargedPoints), 0);
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
        amount: week_deposit_count > 0 ? formatCurrency(week_deposit_amount) : "0원",
      },
      weekCardPayment: {
        label: "이번 주 카드 결제 금액",
        amount: week_card_count > 0 ? formatCurrency(week_card_amount) : "0원",
        count: `${week_card_count}건`,
      },
      monthTotal: {
        label: "이번 달 총 합계",
        count: `${month_total_count}건`,
        amount: month_total_count > 0 ? formatCurrency(month_total_amount) : "0원",
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
