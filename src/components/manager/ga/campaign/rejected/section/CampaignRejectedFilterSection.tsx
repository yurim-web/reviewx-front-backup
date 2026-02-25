/* ========================================
   캠페인 반려 필터 섹션
   ======================================== */

/**
 * 캠페인 반려 이력 필터 섹션 컴포넌트
 *
 * 목적: GA 관리자 반려 이력 페이지에서 필터 섹션을 표시합니다.
 *
 * 사용 페이지:
 * - /manager_ga/campaign/rejected (반려 이력 페이지)
 *
 */

"use client";

import styles from "@/styles/manager/common/section/filter_section.module.css";
import filterButtonStyles from "@/styles/manager_ga/common/filter/filter_button.module.css";
import BaseFilterSection from "@/components/manager/ga/common/filter/BaseFilterSection";
import { useCodeFilterState } from "@/hooks/manager/ga/common/useCodeFilterState";
import DateFilterButton from "@/components/manager/ga/common/filter/DateFilterButton";
import FilterButton from "@/components/manager/ga/common/filter/FilterButton";
import BaseFilterDropdown from "@/components/manager/ga/common/filter/BaseFilterDropdown";
import type { FilterOption } from "@/components/manager/ga/common/filter/BaseFilterModal";
import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";
import type { RejectCode } from "@/data/manager_ga/rejected";

interface CampaignRejectedFilterSectionProps {
  // 검색어 상태와 변경 함수를 props로 받습니다
  search_query: string;
  on_search_change: (query: string) => void;
  // 선택된 반려 코드 필터 상태와 변경 함수
  selected_reject_codes?: RejectCode[];
  on_reject_codes_change?: (codes: RejectCode[]) => void;
  // 날짜 범위 필터 상태와 변경 함수
  selected_date_range?: DateRange | undefined;
  on_date_range_change?: (range: DateRange | undefined) => void;
}

// 반려 코드 필터 옵션
const reject_code_options: RejectCode[] = [
  "R001",
  "R002",
  "R003",
  "R004",
  "R005",
  "R006",
  "R007",
  "R008",
];

// 반려 코드 정보를 FilterOption 형태로 변환하는 함수
// map 함수: 배열을 순회하며 각 요소를 변환한 새로운 배열을 만듭니다
const get_reject_code_options = (): FilterOption<RejectCode>[] => {
  return reject_code_options.map((code) => {
    return {
      value: code,
      label: code,
    };
  });
};

export default function CampaignRejectedFilterSection({
  search_query,
  on_search_change,
  selected_reject_codes = [],
  on_reject_codes_change,
  selected_date_range,
  on_date_range_change,
}: CampaignRejectedFilterSectionProps) {
  // 코드 필터 공통 훅 (선택 상태·드롭다운·태그·핸들러)
  const {
    local_selected_codes: selected_codes,
    is_code_dropdown_open: is_reject_code_dropdown_open,
    filter_button_ref: reject_code_filter_button_ref,
    filter_tags: active_filter_tags,
    handle_code_filter_click: handle_reject_code_filter_click,
    handle_dropdown_close: handle_reject_code_dropdown_close,
    handle_code_apply: handle_reject_code_apply,
    handle_remove_code: handle_remove_reject_code,
  } = useCodeFilterState<RejectCode>({
    selected_codes: selected_reject_codes,
    on_codes_change: on_reject_codes_change,
  });

  // 날짜 범위 변경 핸들러
  const handle_date_range_change = (range: DateRange | undefined) => {
    on_date_range_change?.(range);
  };

  // 반려 코드 옵션을 FilterOption 형태로 변환
  const reject_code_dropdown_options = get_reject_code_options();

  return (
    <div>
      {/* BaseFilterSection 공통 컴포넌트 사용 */}
      <BaseFilterSection<RejectCode>
        search_query={search_query}
        on_search_change={on_search_change}
        // 날짜 필터 - DateFilterButton 컴포넌트 사용
        date_filter={
          <DateFilterButton
            selected_range={selected_date_range}
            on_range_change={handle_date_range_change}
          />
        }
        // 반려 코드 필터 드롭다운 버튼
        filter_modal_button={
          <div
            ref={reject_code_filter_button_ref}
            className={filterButtonStyles.filter_button_dropdown_wrapper}
          >
            <FilterButton
              label="반려 코드"
              onClick={handle_reject_code_filter_click}
              isActive={selected_codes.length > 0}
              styles={{
                filter_item: styles.filter_item,
                checkbox_icon: styles.checkbox_icon,
                checkbox_icon_checked: filterButtonStyles.checkbox_icon_checked,
                filter_text: styles.filter_text,
                dropdown_arrow: styles.dropdown_arrow,
                filter_item_active: filterButtonStyles.filter_item_active,
                filter_text_active: filterButtonStyles.filter_text_active,
                dropdown_arrow_active: filterButtonStyles.dropdown_arrow_active,
              }}
            />
            {/* 반려 코드 필터 드롭다운 */}
            <BaseFilterDropdown<RejectCode>
              is_open={is_reject_code_dropdown_open}
              on_close={handle_reject_code_dropdown_close}
              selected_values={selected_codes}
              on_apply={handle_reject_code_apply}
              options={reject_code_dropdown_options}
              container_ref={
                reject_code_filter_button_ref as React.RefObject<HTMLDivElement | null>
              }
            />
          </div>
        }
        // 활성 필터 태그들
        active_filter_tags={active_filter_tags}
        on_filter_tag_remove={handle_remove_reject_code}
      />
    </div>
  );
}
