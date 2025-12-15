/* ========================================
   🔍 결제 내역 필터 섹션 컴포넌트
   ======================================== */

/**
 * 결제 내역 필터 섹션 컴포넌트
 *
 * 목적: 결제 내역 페이지의 필터 옵션들을 표시합니다.
 *
 * 사용 위치:
 * - /manager_sa/settlement/payment_history (결제 내역 페이지)
 *
 * 주요 기능:
 * - 날짜 필터 (날짜 범위 선택)
 * - 구분 필터 (드롭다운)
 * - 결제 수단 필터 (드롭다운)
 * - 세금계산서 발행 필터 (체크박스)
 * - 결제 필터 (드롭다운)
 * - 상태 필터 (드롭다운)
 * - 검색 입력창
 * - 활성 필터 태그 표시 및 제거
 * - 세금계산서 발행 양식 다운로드 버튼
 *
 */

"use client";

import { useState } from "react";
import BaseFilterSection, {
  type FilterTag,
} from "@/components/manager/ga/common/filter/BaseFilterSection";
import DateFilterButton from "@/components/manager/ga/common/filter/DateFilterButton";
import FilterButton from "@/components/manager/ga/common/filter/FilterButton";
import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";
import BusinessTypeFilterModal from "@/components/manager/sa/settlement/payment_history/filter/BusinessTypeFilterModal";
import PaymentMethodFilterModal from "@/components/manager/sa/settlement/payment_history/filter/PaymentMethodFilterModal";
import PaymentStatusFilterModal from "@/components/manager/sa/settlement/payment_history/filter/PaymentStatusFilterModal";
import AccountStatusFilterModal from "@/components/manager/sa/settlement/payment_history/filter/AccountStatusFilterModal";
import type { BusinessType } from "@/components/manager/sa/settlement/payment_history/filter/BusinessTypeFilterModal";
import type { PaymentMethod } from "@/data/manager_sa/common/filterOptions";
import type { PaymentStatus } from "@/components/manager/sa/settlement/payment_history/filter/PaymentStatusFilterModal";
import type { AccountStatus } from "@/components/manager/sa/settlement/payment_history/filter/AccountStatusFilterModal";
import baseFilterStyles from "@/styles/manager_ga/campaign/progress/filter_section.module.css";
import styles from "@/styles/manager_sa/settlement/payment_history/filter_section.module.css";

interface PaymentHistoryFilterSectionProps {
  // 검색어 상태
  search_query?: string;
  on_search_change?: (query: string) => void;
  // 필터 상태
  selected_date_range?: DateRange | undefined;
  on_date_range_change?: (range: DateRange | undefined) => void;
  selected_business_types?: BusinessType[];
  on_business_types_change?: (types: BusinessType[]) => void;
  selected_payment_methods?: PaymentMethod[];
  on_payment_methods_change?: (methods: PaymentMethod[]) => void;
  tax_invoice_only?: boolean;
  on_tax_invoice_change?: (value: boolean) => void;
  selected_payment_statuses?: PaymentStatus[];
  on_payment_statuses_change?: (statuses: PaymentStatus[]) => void;
  selected_account_statuses?: AccountStatus[];
  on_account_statuses_change?: (statuses: AccountStatus[]) => void;
}

export default function PaymentHistoryFilterSection({
  search_query = "",
  on_search_change,
  selected_date_range,
  on_date_range_change,
  selected_business_types = [],
  on_business_types_change,
  selected_payment_methods = [],
  on_payment_methods_change,
  tax_invoice_only = false,
  on_tax_invoice_change,
  selected_payment_statuses = [],
  on_payment_statuses_change,
  selected_account_statuses = [],
  on_account_statuses_change,
}: PaymentHistoryFilterSectionProps) {
  const [is_business_type_modal_open, set_is_business_type_modal_open] =
    useState(false);
  const [is_payment_method_modal_open, set_is_payment_method_modal_open] =
    useState(false);
  const [is_payment_status_modal_open, set_is_payment_status_modal_open] =
    useState(false);
  const [is_account_status_modal_open, set_is_account_status_modal_open] =
    useState(false);

  // 내부 검색어 상태 (props가 없을 때 사용)
  const [internal_search_query, set_internal_search_query] = useState("");
  const current_search_query =
    search_query !== undefined ? search_query : internal_search_query;
  const handle_search_change = (query: string) => {
    if (on_search_change) {
      on_search_change(query);
    } else {
      set_internal_search_query(query);
    }
  };

  // 날짜 범위 변경 핸들러
  const handle_date_range_change = (range: DateRange | undefined) => {
    on_date_range_change?.(range);
  };

  // 구분 필터 핸들러
  const handle_business_type_apply = (types: BusinessType[]) => {
    on_business_types_change?.(types);
  };

  // 결제 수단 필터 핸들러
  const handle_payment_method_apply = (methods: PaymentMethod[]) => {
    on_payment_methods_change?.(methods);
  };

  // 세금계산서 발행 필터 핸들러
  const handle_tax_invoice_change = (checked: boolean) => {
    on_tax_invoice_change?.(checked);
  };

  // 결제 필터 핸들러
  const handle_payment_status_apply = (statuses: PaymentStatus[]) => {
    on_payment_statuses_change?.(statuses);
  };

  // 상태 필터 핸들러
  const handle_account_status_apply = (statuses: AccountStatus[]) => {
    on_account_statuses_change?.(statuses);
  };

  // 구분 필터 태그 제거 핸들러
  const handle_remove_business_type = (type: BusinessType) => {
    on_business_types_change?.(
      selected_business_types.filter((t) => t !== type)
    );
  };

  // 결제 수단 필터 태그 제거 핸들러
  const handle_remove_payment_method = (method: PaymentMethod) => {
    on_payment_methods_change?.(
      selected_payment_methods.filter((m) => m !== method)
    );
  };

  // 결제 필터 태그 제거 핸들러
  const handle_remove_payment_status = (status: PaymentStatus) => {
    on_payment_statuses_change?.(
      selected_payment_statuses.filter((s) => s !== status)
    );
  };

  // 상태 필터 태그 제거 핸들러
  const handle_remove_account_status = (status: AccountStatus) => {
    on_account_statuses_change?.(
      selected_account_statuses.filter((s) => s !== status)
    );
  };

  // 활성 필터 태그 목록 생성
  const active_filter_tags: FilterTag<string>[] = [
    ...selected_business_types.map((type) => ({
      value: type,
      label: type,
    })),
    ...selected_payment_methods.map((method) => ({
      value: method,
      label: method,
    })),
    ...(tax_invoice_only
      ? [{ value: "tax_invoice", label: "세금계산서 발행" }]
      : []),
    ...selected_payment_statuses.map((status) => ({
      value: status,
      label: status,
    })),
    ...selected_account_statuses.map((status) => ({
      value: status,
      label: status,
    })),
  ];

  // 필터 태그 제거 핸들러
  const handle_filter_tag_remove = (value: string) => {
    // 세금계산서 발행 태그인지 확인
    if (value === "tax_invoice") {
      handle_tax_invoice_change(false);
    }
    // 구분 필터 태그인지 확인
    else if (selected_business_types.includes(value as BusinessType)) {
      handle_remove_business_type(value as BusinessType);
    }
    // 결제 수단 필터 태그인지 확인
    else if (selected_payment_methods.includes(value as PaymentMethod)) {
      handle_remove_payment_method(value as PaymentMethod);
    }
    // 결제 필터 태그인지 확인
    else if (selected_payment_statuses.includes(value as PaymentStatus)) {
      handle_remove_payment_status(value as PaymentStatus);
    }
    // 상태 필터 태그인지 확인
    else if (selected_account_statuses.includes(value as AccountStatus)) {
      handle_remove_account_status(value as AccountStatus);
    }
  };

  /**
   * 세금계산서 발행 양식 다운로드 핸들러
   *
   * 세금계산서 발행 양식을 다운로드합니다.
   * 실제 구현에서는 API를 호출하여 파일을 다운로드합니다.
   */
  const handle_download_click = () => {
    // TODO: 실제 다운로드 로직 구현
    console.log("세금계산서 발행 양식 다운로드");
  };

  return (
    <div>
      {/* BaseFilterSection 공통 컴포넌트 사용 */}
      <BaseFilterSection<string>
        search_query={current_search_query}
        on_search_change={handle_search_change}
        // 날짜 필터 - DateFilterButton 컴포넌트 사용
        date_filter={
          <DateFilterButton
            selected_range={selected_date_range}
            on_range_change={handle_date_range_change}
          />
        }
        // 필터 모달 버튼들
        filter_modal_button={
          <>
            {/* 구분 필터 */}
            <FilterButton
              label="구분"
              onClick={() => set_is_business_type_modal_open(true)}
              isActive={selected_business_types.length > 0}
              styles={{
                filter_item: baseFilterStyles.filter_item,
                checkbox_icon: baseFilterStyles.checkbox_icon,
                filter_text: baseFilterStyles.filter_text,
                dropdown_arrow: baseFilterStyles.dropdown_arrow,
              }}
            />

            {/* 결제 수단 필터 */}
            <FilterButton
              label="결제 수단"
              onClick={() => set_is_payment_method_modal_open(true)}
              isActive={selected_payment_methods.length > 0}
              styles={{
                filter_item: baseFilterStyles.filter_item,
                checkbox_icon: baseFilterStyles.checkbox_icon,
                filter_text: baseFilterStyles.filter_text,
                dropdown_arrow: baseFilterStyles.dropdown_arrow,
              }}
            />

            {/* 세금계산서 발행 필터 */}
            <div
              className={styles.filter_dropdown}
              onClick={() => handle_tax_invoice_change(!tax_invoice_only)}
            >
              <input
                type="checkbox"
                className={styles.filter_checkbox}
                checked={tax_invoice_only}
                onChange={(e) => handle_tax_invoice_change(e.target.checked)}
                onClick={(e) => e.stopPropagation()}
              />
              <span className={styles.filter_label}>세금계산서 발행</span>
            </div>

            {/* 결제 필터 */}
            <FilterButton
              label="결제"
              onClick={() => set_is_payment_status_modal_open(true)}
              isActive={selected_payment_statuses.length > 0}
              styles={{
                filter_item: baseFilterStyles.filter_item,
                checkbox_icon: baseFilterStyles.checkbox_icon,
                filter_text: baseFilterStyles.filter_text,
                dropdown_arrow: baseFilterStyles.dropdown_arrow,
              }}
            />

            {/* 상태 필터 */}
            <FilterButton
              label="상태"
              onClick={() => set_is_account_status_modal_open(true)}
              isActive={selected_account_statuses.length > 0}
              styles={{
                filter_item: baseFilterStyles.filter_item,
                checkbox_icon: baseFilterStyles.checkbox_icon,
                filter_text: baseFilterStyles.filter_text,
                dropdown_arrow: baseFilterStyles.dropdown_arrow,
              }}
            />
          </>
        }
        // 활성 필터 태그들
        active_filter_tags={active_filter_tags}
        on_filter_tag_remove={handle_filter_tag_remove}
        // 오른쪽 버튼: 세금계산서 발행 양식 다운로드 버튼
        right_buttons={
          <div
            className={styles.download_button}
            onClick={handle_download_click}
          >
            <img
              src="/images/excel_icon.png"
              alt="다운로드"
              className={styles.download_icon}
            />
            <span className={styles.download_text}>
              세금계산서 발행 양식 다운로드
            </span>
          </div>
        }
      />

      {/* 필터 모달들 */}
      <BusinessTypeFilterModal
        is_open={is_business_type_modal_open}
        on_close={() => set_is_business_type_modal_open(false)}
        selected_types={selected_business_types}
        on_apply={handle_business_type_apply}
      />

      <PaymentMethodFilterModal
        is_open={is_payment_method_modal_open}
        on_close={() => set_is_payment_method_modal_open(false)}
        selected_methods={selected_payment_methods}
        on_apply={handle_payment_method_apply}
      />

      <PaymentStatusFilterModal
        is_open={is_payment_status_modal_open}
        on_close={() => set_is_payment_status_modal_open(false)}
        selected_statuses={selected_payment_statuses}
        on_apply={handle_payment_status_apply}
      />

      <AccountStatusFilterModal
        is_open={is_account_status_modal_open}
        on_close={() => set_is_account_status_modal_open(false)}
        selected_statuses={selected_account_statuses}
        on_apply={handle_account_status_apply}
      />
    </div>
  );
}
