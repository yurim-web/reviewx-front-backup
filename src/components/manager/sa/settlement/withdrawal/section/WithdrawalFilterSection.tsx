/* ========================================
   🔍 출금 현황 필터 섹션 컴포넌트
   ======================================== */

/**
 * 출금 현황 필터 섹션 컴포넌트
 *
 * 목적: 출금 현황 페이지의 필터 옵션들을 표시합니다.
 *
 * 사용 위치:
 * - /manager_sa/settlement/withdrawal (출금 현황 페이지)
 *
 * 주요 기능:
 * - 날짜 필터
 * - 지급 필터 (드롭다운)
 * - 상태 필터 (드롭다운)
 * - 검색 입력창
 * - 활성 필터 태그 표시 및 제거
 * - 신청자 원천징수 양식 다운로드 버튼
 */

"use client";

import { useState, useRef } from "react";
import BaseFilterSection, {
  type FilterTag,
} from "@/components/manager/ga/common/filter/BaseFilterSection";
import DateFilterButton from "@/components/manager/ga/common/filter/DateFilterButton";
import FilterButton from "@/components/manager/ga/common/filter/FilterButton";
import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";
import PaymentStatusFilterDropdown from "@/components/manager/sa/settlement/withdrawal/filter/PaymentStatusFilterDropdown";
import NormalStatusFilterDropdown, {
  type NormalStatus,
} from "@/components/manager/sa/settlement/withdrawal/filter/NormalStatusFilterDropdown";
import type { WithdrawalPaymentStatus } from "@/data/manager_sa/common/filterOptions";
import { withdrawal_payment_status_label_map } from "@/data/manager_sa/common/filterOptions";
import baseFilterStyles from "@/styles/manager/common/section/filter_section.module.css";
import styles from "@/styles/manager_sa/settlement/withdrawal/filter_section.module.css";
import filterButtonStyles from "@/styles/manager_ga/common/filter/filter_button.module.css";

interface WithdrawalFilterSectionProps {
  // 검색어 상태
  search_query?: string;
  on_search_change?: (query: string) => void;
  // 필터 상태
  selected_date_range?: DateRange | undefined;
  on_date_range_change?: (range: DateRange | undefined) => void;
  selected_payment_statuses?: WithdrawalPaymentStatus[];
  on_payment_statuses_change?: (statuses: WithdrawalPaymentStatus[]) => void;
  selected_normal_statuses?: NormalStatus[];
  on_normal_statuses_change?: (statuses: NormalStatus[]) => void;
}

export default function WithdrawalFilterSection({
  search_query = "",
  on_search_change,
  selected_date_range,
  on_date_range_change,
  selected_payment_statuses = [],
  on_payment_statuses_change,
  selected_normal_statuses = [],
  on_normal_statuses_change,
}: WithdrawalFilterSectionProps) {
  // 지급 필터 드롭다운 열림/닫힘 상태
  const [is_payment_dropdown_open, set_is_payment_dropdown_open] = useState(false);
  
  // 지급 필터 버튼 컨테이너 ref (드롭다운 위치 계산용)
  const payment_filter_button_ref = useRef<HTMLDivElement>(null);

  // 상태 필터 드롭다운 열림/닫힘 상태
  const [is_normal_dropdown_open, set_is_normal_dropdown_open] = useState(false);
  
  // 상태 필터 버튼 컨테이너 ref (드롭다운 위치 계산용)
  const normal_filter_button_ref = useRef<HTMLDivElement>(null);

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

  // 지급 필터 핸들러
  const handle_payment_status_apply = (statuses: WithdrawalPaymentStatus[]) => {
    on_payment_statuses_change?.(statuses);
  };

  // 상태 필터 핸들러
  const handle_normal_status_apply = (statuses: NormalStatus[]) => {
    on_normal_statuses_change?.(statuses);
  };

  // 지급 필터 태그 제거 핸들러
  const handle_remove_payment_status = (status: WithdrawalPaymentStatus) => {
    on_payment_statuses_change?.(
      selected_payment_statuses.filter((s) => s !== status)
    );
  };

  // 상태 필터 태그 제거 핸들러
  const handle_remove_normal_status = (status: NormalStatus) => {
    on_normal_statuses_change?.(
      selected_normal_statuses.filter((s) => s !== status)
    );
  };

  // 활성 필터 태그 목록 생성
  const active_filter_tags: FilterTag<string>[] = [
    ...selected_payment_statuses.map((status) => ({
      value: status,
      label: withdrawal_payment_status_label_map[status],
    })),
    ...selected_normal_statuses.map((status) => ({
      value: status,
      label: status,
    })),
  ];

  // 필터 태그 제거 핸들러
  const handle_filter_tag_remove = (value: string) => {
    // 지급 필터 태그인지 확인
    if (selected_payment_statuses.includes(value as WithdrawalPaymentStatus)) {
      handle_remove_payment_status(value as WithdrawalPaymentStatus);
    }
    // 상태 필터 태그인지 확인
    else if (selected_normal_statuses.includes(value as NormalStatus)) {
      handle_remove_normal_status(value as NormalStatus);
    }
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
            {/* 지급 필터 (드롭다운 사용) */}
            <div
              ref={payment_filter_button_ref}
              className={filterButtonStyles.filter_button_dropdown_wrapper}
            >
              <FilterButton
                label="지급"
                onClick={() => set_is_payment_dropdown_open((prev) => !prev)}
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
              {/* 지급 필터 드롭다운 */}
              <PaymentStatusFilterDropdown
                is_open={is_payment_dropdown_open}
                on_close={() => set_is_payment_dropdown_open(false)}
                selected_statuses={selected_payment_statuses}
                on_apply={handle_payment_status_apply}
                container_ref={payment_filter_button_ref}
              />
            </div>

            {/* 상태 필터 (드롭다운 사용) */}
            <div
              ref={normal_filter_button_ref}
              className={filterButtonStyles.filter_button_dropdown_wrapper}
            >
              <FilterButton
                label="상태"
                onClick={() => set_is_normal_dropdown_open((prev) => !prev)}
                isActive={selected_normal_statuses.length > 0}
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
              {/* 상태 필터 드롭다운 */}
              <NormalStatusFilterDropdown
                is_open={is_normal_dropdown_open}
                on_close={() => set_is_normal_dropdown_open(false)}
                selected_statuses={selected_normal_statuses}
                on_apply={handle_normal_status_apply}
                container_ref={normal_filter_button_ref}
              />
            </div>
          </>
        }
        // 활성 필터 태그들
        active_filter_tags={active_filter_tags}
        on_filter_tag_remove={handle_filter_tag_remove}
        // 오른쪽 버튼: 원천징수 양식 다운로드 버튼
        right_buttons={
          <div className={styles.download_button}>
            <img
              src="/images/excel_icon.png"
              alt="다운로드"
              className={styles.download_icon}
            />
            <span className={styles.download_text}>
              신청자 원천징수 양식 다운로드
            </span>
          </div>
        }
      />

      {/* 필터 모달들 (모두 드롭다운으로 대체) */}
      {/* PaymentStatusFilterModal, NormalStatusFilterModal은 각각 드롭다운으로 대체되었습니다 */}
    </div>
  );
}
