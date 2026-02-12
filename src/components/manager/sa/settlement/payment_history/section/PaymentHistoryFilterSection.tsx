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
 * - 세금계산서 발행 필터 (드롭다운)
 * - 결제 필터 (드롭다운)
 * - 유형 필터 (드롭다운)
 * - 상태 필터 (드롭다운)
 * - 검색 입력창
 * - 활성 필터 태그 표시 및 제거
 * - 세금계산서 발행 양식 다운로드 버튼
 *
 */

"use client";

import { useState, useRef } from "react";
import BaseFilterSection, {
  type FilterTag,
} from "@/components/manager/ga/common/filter/BaseFilterSection";
import DateFilterButton from "@/components/manager/ga/common/filter/DateFilterButton";
import FilterButton from "@/components/manager/ga/common/filter/FilterButton";
import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";
import BusinessTypeFilterDropdown, {
  type BusinessType,
} from "@/components/manager/sa/settlement/payment_history/filter/BusinessTypeFilterDropdown";
import PaymentMethodFilterDropdown from "@/components/manager/sa/settlement/payment_history/filter/PaymentMethodFilterDropdown";
import PaymentStatusFilterDropdown, {
  type PaymentStatus,
} from "@/components/manager/sa/settlement/payment_history/filter/PaymentStatusFilterDropdown";
import AccountStatusFilterDropdown, {
  type AccountStatus,
} from "@/components/manager/sa/settlement/payment_history/filter/AccountStatusFilterDropdown";
import TaxInvoiceTypeFilterDropdown, {
  type TaxInvoiceType,
} from "@/components/manager/sa/settlement/payment_history/filter/TaxInvoiceTypeFilterDropdown";
import MemberTypeFilterDropdown, {
  type MemberType,
} from "@/components/manager/sa/settlement/payment_history/filter/MemberTypeFilterDropdown";
import type { PaymentMethod } from "@/data/manager_sa/common/filterOptions";
import baseFilterStyles from "@/styles/manager/common/section/filter_section.module.css";
import styles from "@/styles/manager_sa/settlement/payment_history/filter_section.module.css";
import filterButtonStyles from "@/styles/manager_ga/common/filter/filter_button.module.css";

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
  selected_tax_invoice_types?: TaxInvoiceType[];
  on_tax_invoice_types_change?: (types: TaxInvoiceType[]) => void;
  selected_payment_statuses?: PaymentStatus[];
  on_payment_statuses_change?: (statuses: PaymentStatus[]) => void;
  selected_member_types?: MemberType[];
  on_member_types_change?: (types: MemberType[]) => void;
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
  selected_tax_invoice_types = [],
  on_tax_invoice_types_change,
  selected_payment_statuses = [],
  on_payment_statuses_change,
  selected_member_types = [],
  on_member_types_change,
  selected_account_statuses = [],
  on_account_statuses_change,
}: PaymentHistoryFilterSectionProps) {
  // 구분 필터 드롭다운 열림/닫힘 상태
  const [is_business_type_dropdown_open, set_is_business_type_dropdown_open] =
    useState(false);
  const business_type_filter_button_ref = useRef<HTMLDivElement>(null);

  // 결제 수단 필터 드롭다운 열림/닫힘 상태
  const [is_payment_method_dropdown_open, set_is_payment_method_dropdown_open] =
    useState(false);
  const payment_method_filter_button_ref = useRef<HTMLDivElement>(null);

  // 결제 필터 드롭다운 열림/닫힘 상태
  const [is_payment_status_dropdown_open, set_is_payment_status_dropdown_open] =
    useState(false);
  const payment_status_filter_button_ref = useRef<HTMLDivElement>(null);

  // 세금계산서 발행 필터 드롭다운 열림/닫힘 상태
  const [is_tax_invoice_type_dropdown_open, set_is_tax_invoice_type_dropdown_open] =
    useState(false);
  const tax_invoice_type_filter_button_ref = useRef<HTMLDivElement>(null);

  // 유형 필터 드롭다운 열림/닫힘 상태
  const [is_member_type_dropdown_open, set_is_member_type_dropdown_open] =
    useState(false);
  const member_type_filter_button_ref = useRef<HTMLDivElement>(null);

  // 상태 필터 드롭다운 열림/닫힘 상태
  const [is_account_status_dropdown_open, set_is_account_status_dropdown_open] =
    useState(false);
  const account_status_filter_button_ref = useRef<HTMLDivElement>(null);

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
  const handle_tax_invoice_type_apply = (types: TaxInvoiceType[]) => {
    on_tax_invoice_types_change?.(types);
  };

  // 결제 필터 핸들러
  const handle_payment_status_apply = (statuses: PaymentStatus[]) => {
    on_payment_statuses_change?.(statuses);
  };

  // 유형 필터 핸들러
  const handle_member_type_apply = (types: MemberType[]) => {
    on_member_types_change?.(types);
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

  // 세금계산서 발행 필터 태그 제거 핸들러
  const handle_remove_tax_invoice_type = (type: TaxInvoiceType) => {
    on_tax_invoice_types_change?.(
      selected_tax_invoice_types.filter((t) => t !== type)
    );
  };

  // 결제 필터 태그 제거 핸들러
  const handle_remove_payment_status = (status: PaymentStatus) => {
    on_payment_statuses_change?.(
      selected_payment_statuses.filter((s) => s !== status)
    );
  };

  // 유형 필터 태그 제거 핸들러
  const handle_remove_member_type = (type: MemberType) => {
    on_member_types_change?.(
      selected_member_types.filter((t) => t !== type)
    );
  };

  // 상태 필터 태그 제거 핸들러
  const handle_remove_account_status = (status: AccountStatus) => {
    on_account_statuses_change?.(
      selected_account_statuses.filter((s) => s !== status)
    );
  };

  // 활성 필터 태그 목록 생성
  // 학습 포인트:
  // - 스프레드 연산자(...): 배열을 펼쳐서 새로운 배열에 포함시킵니다
  // - map(): 각 항목을 FilterTag 형태로 변환합니다
  const active_filter_tags: FilterTag<string>[] = [
    ...selected_business_types.map((type) => ({
      value: type,
      label: type,
    })),
    ...selected_payment_methods.map((method) => ({
      value: method,
      label: method,
    })),
    ...selected_tax_invoice_types.map((type) => ({
      value: type,
      label: type,
    })),
    ...selected_payment_statuses.map((status) => ({
      value: status,
      label: status,
    })),
    ...selected_member_types.map((type) => ({
      value: type,
      label: type,
    })),
    ...selected_account_statuses.map((status) => ({
      value: status,
      label: status,
    })),
  ];

  // 필터 태그 제거 핸들러
  // 학습 포인트:
  // - 조건문 체인: if-else if로 어떤 필터인지 판단합니다
  // - 타입 단언(as): string을 특정 타입으로 변환합니다
  // - includes(): 배열에 특정 값이 포함되어 있는지 확인합니다
  const handle_filter_tag_remove = (value: string) => {
    // 구분 필터 태그인지 확인
    if (selected_business_types.includes(value as BusinessType)) {
      handle_remove_business_type(value as BusinessType);
    }
    // 결제 수단 필터 태그인지 확인
    else if (selected_payment_methods.includes(value as PaymentMethod)) {
      handle_remove_payment_method(value as PaymentMethod);
    }
    // 세금계산서 발행 필터 태그인지 확인
    else if (selected_tax_invoice_types.includes(value as TaxInvoiceType)) {
      handle_remove_tax_invoice_type(value as TaxInvoiceType);
    }
    // 결제 필터 태그인지 확인
    else if (selected_payment_statuses.includes(value as PaymentStatus)) {
      handle_remove_payment_status(value as PaymentStatus);
    }
    // 유형 필터 태그인지 확인
    else if (selected_member_types.includes(value as MemberType)) {
      handle_remove_member_type(value as MemberType);
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
        // 필터 드롭다운 버튼들
        filter_modal_button={
          <>
            {/* 구분 필터 (드롭다운 사용) */}
            <div
              ref={business_type_filter_button_ref}
              className={filterButtonStyles.filter_button_dropdown_wrapper}
            >
              <FilterButton
                label="구분"
                onClick={() => set_is_business_type_dropdown_open((prev) => !prev)}
                isActive={selected_business_types.length > 0}
                styles={{
                  filter_item: baseFilterStyles.filter_item,
                  checkbox_icon: baseFilterStyles.checkbox_icon,
                  checkbox_icon_checked: filterButtonStyles.checkbox_icon_checked,
                  filter_text: baseFilterStyles.filter_text,
                  dropdown_arrow: baseFilterStyles.dropdown_arrow,
                  filter_item_active: filterButtonStyles.filter_item_active,
                  filter_text_active: filterButtonStyles.filter_text_active,
                  dropdown_arrow_active: filterButtonStyles.dropdown_arrow_active,
                }}
              />
              <BusinessTypeFilterDropdown
                is_open={is_business_type_dropdown_open}
                on_close={() => set_is_business_type_dropdown_open(false)}
                selected_types={selected_business_types}
                on_apply={handle_business_type_apply}
                container_ref={business_type_filter_button_ref}
              />
            </div>

            {/* 결제 수단 필터 (드롭다운 사용) */}
            <div
              ref={payment_method_filter_button_ref}
              className={filterButtonStyles.filter_button_dropdown_wrapper}
            >
              <FilterButton
                label="결제 수단"
                onClick={() => set_is_payment_method_dropdown_open((prev) => !prev)}
                isActive={selected_payment_methods.length > 0}
                styles={{
                  filter_item: baseFilterStyles.filter_item,
                  checkbox_icon: baseFilterStyles.checkbox_icon,
                  checkbox_icon_checked: filterButtonStyles.checkbox_icon_checked,
                  filter_text: baseFilterStyles.filter_text,
                  dropdown_arrow: baseFilterStyles.dropdown_arrow,
                  filter_item_active: filterButtonStyles.filter_item_active,
                  filter_text_active: filterButtonStyles.filter_text_active,
                  dropdown_arrow_active: filterButtonStyles.dropdown_arrow_active,
                }}
              />
              <PaymentMethodFilterDropdown
                is_open={is_payment_method_dropdown_open}
                on_close={() => set_is_payment_method_dropdown_open(false)}
                selected_methods={selected_payment_methods}
                on_apply={handle_payment_method_apply}
                container_ref={payment_method_filter_button_ref}
              />
            </div>

            {/*  발행 필터 (드롭다운 사용) */}
            <div
              ref={tax_invoice_type_filter_button_ref}
              className={filterButtonStyles.filter_button_dropdown_wrapper}
            >
              <FilterButton
                label="발행"
                onClick={() =>
                  set_is_tax_invoice_type_dropdown_open((prev) => !prev)
                }
                isActive={selected_tax_invoice_types.length > 0}
                styles={{
                  filter_item: baseFilterStyles.filter_item,
                  checkbox_icon: baseFilterStyles.checkbox_icon,
                  checkbox_icon_checked: filterButtonStyles.checkbox_icon_checked,
                  filter_text: baseFilterStyles.filter_text,
                  dropdown_arrow: baseFilterStyles.dropdown_arrow,
                  filter_item_active: filterButtonStyles.filter_item_active,
                  filter_text_active: filterButtonStyles.filter_text_active,
                  dropdown_arrow_active: filterButtonStyles.dropdown_arrow_active,
                }}
              />
              <TaxInvoiceTypeFilterDropdown
                is_open={is_tax_invoice_type_dropdown_open}
                on_close={() => set_is_tax_invoice_type_dropdown_open(false)}
                selected_types={selected_tax_invoice_types}
                on_apply={handle_tax_invoice_type_apply}
                container_ref={tax_invoice_type_filter_button_ref}
              />
            </div>

            {/* 결제 필터 (드롭다운 사용) */}
            <div
              ref={payment_status_filter_button_ref}
              className={filterButtonStyles.filter_button_dropdown_wrapper}
            >
              <FilterButton
                label="결제"
                onClick={() => set_is_payment_status_dropdown_open((prev) => !prev)}
                isActive={selected_payment_statuses.length > 0}
                styles={{
                  filter_item: baseFilterStyles.filter_item,
                  checkbox_icon: baseFilterStyles.checkbox_icon,
                  checkbox_icon_checked: filterButtonStyles.checkbox_icon_checked,
                  filter_text: baseFilterStyles.filter_text,
                  dropdown_arrow: baseFilterStyles.dropdown_arrow,
                  filter_item_active: filterButtonStyles.filter_item_active,
                  filter_text_active: filterButtonStyles.filter_text_active,
                  dropdown_arrow_active: filterButtonStyles.dropdown_arrow_active,
                }}
              />
              <PaymentStatusFilterDropdown
                is_open={is_payment_status_dropdown_open}
                on_close={() => set_is_payment_status_dropdown_open(false)}
                selected_statuses={selected_payment_statuses}
                on_apply={handle_payment_status_apply}
                container_ref={payment_status_filter_button_ref}
              />
            </div>

            {/* 유형 필터 (드롭다운 사용) */}
            <div
              ref={member_type_filter_button_ref}
              className={filterButtonStyles.filter_button_dropdown_wrapper}
            >
              <FilterButton
                label="유형"
                onClick={() => set_is_member_type_dropdown_open((prev) => !prev)}
                isActive={selected_member_types.length > 0}
                styles={{
                  filter_item: baseFilterStyles.filter_item,
                  checkbox_icon: baseFilterStyles.checkbox_icon,
                  checkbox_icon_checked: filterButtonStyles.checkbox_icon_checked,
                  filter_text: baseFilterStyles.filter_text,
                  dropdown_arrow: baseFilterStyles.dropdown_arrow,
                  filter_item_active: filterButtonStyles.filter_item_active,
                  filter_text_active: filterButtonStyles.filter_text_active,
                  dropdown_arrow_active: filterButtonStyles.dropdown_arrow_active,
                }}
              />
              <MemberTypeFilterDropdown
                is_open={is_member_type_dropdown_open}
                on_close={() => set_is_member_type_dropdown_open(false)}
                selected_types={selected_member_types}
                on_apply={handle_member_type_apply}
                container_ref={member_type_filter_button_ref}
              />
            </div>

            {/* 상태 필터 (드롭다운 사용) */}
            <div
              ref={account_status_filter_button_ref}
              className={filterButtonStyles.filter_button_dropdown_wrapper}
            >
              <FilterButton
                label="상태"
                onClick={() => set_is_account_status_dropdown_open((prev) => !prev)}
                isActive={selected_account_statuses.length > 0}
                styles={{
                  filter_item: baseFilterStyles.filter_item,
                  checkbox_icon: baseFilterStyles.checkbox_icon,
                  checkbox_icon_checked: filterButtonStyles.checkbox_icon_checked,
                  filter_text: baseFilterStyles.filter_text,
                  dropdown_arrow: baseFilterStyles.dropdown_arrow,
                  filter_item_active: filterButtonStyles.filter_item_active,
                  filter_text_active: filterButtonStyles.filter_text_active,
                  dropdown_arrow_active: filterButtonStyles.dropdown_arrow_active,
                }}
              />
              <AccountStatusFilterDropdown
                is_open={is_account_status_dropdown_open}
                on_close={() => set_is_account_status_dropdown_open(false)}
                selected_statuses={selected_account_statuses}
                on_apply={handle_account_status_apply}
                container_ref={account_status_filter_button_ref}
              />
            </div>
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

    
    </div>
  );
}
