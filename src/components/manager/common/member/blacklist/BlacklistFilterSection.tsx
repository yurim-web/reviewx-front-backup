/* ========================================
   🔍 차단 이력 필터 섹션 컴포넌트 (공통)
   ======================================== */

/**
 * 차단 이력 필터 섹션 컴포넌트 (공통)
 *
 * 목적: GA/SA 관리자 차단 이력 목록을 필터링하기 위한 필터 버튼들을 표시하는 섹션입니다.
 *
 * 사용 페이지:
 * - /manager_ga/member/blacklist (GA 관리자 차단 이력 페이지)
 * - /manager_sa/member/blacklist (SA 관리자 차단 이력 페이지)
 *
 * 주요 기능:
 * - 선택 기간 조회 필터
 * - 구분 필터 (파트너/리뷰어/관리자)
 * - 차단 코드 필터
 * - 검색어 필터
 * - 정렬 필터 (최신순)
 *
 */

"use client";

import { useState, useRef } from "react";
import styles from "@/styles/manager/common/member/blacklist/blacklist_filter_section.module.css";
import BaseFilterSection, {
  type FilterTag,
} from "@/components/manager/ga/common/filter/BaseFilterSection";
import DateFilterButton from "@/components/manager/ga/common/filter/DateFilterButton";
import FilterButton from "@/components/manager/ga/common/filter/FilterButton";
import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";
import DivisionFilterDropdown from "@/components/manager/common/member/blacklist/filter/DivisionFilterDropdown";
import BlockCodeFilterDropdown from "@/components/manager/common/member/blacklist/filter/BlockCodeFilterDropdown";
import type {
  BlacklistDivision,
  BlockCode,
} from "@/data/manager_ga/common/filterOptions";
import baseFilterStyles from "@/styles/manager/common/campaign/progress/filter_section.module.css";
import filterButtonStyles from "@/styles/manager_ga/common/filter/filter_button.module.css";

interface BlacklistFilterSectionProps {
  search_query: string;
  on_search_change: (query: string) => void;
  // 필터 상태
  selected_date_range?: DateRange | undefined;
  on_date_range_change?: (range: DateRange | undefined) => void;
  selected_divisions: BlacklistDivision[];
  on_divisions_change: (divisions: BlacklistDivision[]) => void;
  selected_block_codes: BlockCode[];
  on_block_codes_change: (block_codes: BlockCode[]) => void;
}

export default function BlacklistFilterSection({
  search_query,
  on_search_change,
  selected_date_range,
  on_date_range_change,
  selected_divisions,
  on_divisions_change,
  selected_block_codes,
  on_block_codes_change,
}: BlacklistFilterSectionProps) {
  const [is_division_dropdown_open, set_is_division_dropdown_open] = useState(false);
  const division_filter_button_ref = useRef<HTMLDivElement>(null);
  
  const [is_block_code_dropdown_open, set_is_block_code_dropdown_open] =
    useState(false);
  const block_code_filter_button_ref = useRef<HTMLDivElement>(null);

  const [selected_sort, set_selected_sort] = useState("최신순");

  const handle_division_apply = (divisions: BlacklistDivision[]) => {
    on_divisions_change(divisions);
  };

  const handle_remove_division = (division: BlacklistDivision) => {
    on_divisions_change(selected_divisions.filter((d) => d !== division));
  };

  const handle_block_code_apply = (block_codes: BlockCode[]) => {
    on_block_codes_change(block_codes);
  };

  const handle_remove_block_code = (block_code: BlockCode) => {
    on_block_codes_change(selected_block_codes.filter((c) => c !== block_code));
  };

  const sort_options = ["최신순", "오래된순"];

  const handle_sort_change = (sort: string) => {
    set_selected_sort(sort);
    // TODO: 정렬 로직 구현
  };

  // 날짜 범위 변경 핸들러
  // DateFilterButton에서 날짜 범위가 변경될 때 호출됩니다
  const handle_date_range_change = (range: DateRange | undefined) => {
    on_date_range_change?.(range);
  };

  const active_filter_tags: FilterTag<string>[] = [
    ...selected_divisions.map((division) => ({
      value: division,
      label: division,
    })),
    ...selected_block_codes.map((block_code) => ({
      value: block_code,
      label: `차단 코드: ${block_code}`,
    })),
  ];

  const handle_filter_tag_remove = (value: string) => {
    if (selected_divisions.includes(value as BlacklistDivision)) {
      handle_remove_division(value as BlacklistDivision);
    } else if (selected_block_codes.includes(value as BlockCode)) {
      handle_remove_block_code(value as BlockCode);
    }
  };

  return (
    <div>
      <BaseFilterSection<string>
        search_query={search_query}
        on_search_change={on_search_change}
        // 날짜 필터 - DateFilterButton 컴포넌트 사용
        // DateFilterButton은 BaseFilterSection의 date_filter prop으로 전달됩니다
        date_filter={
          <DateFilterButton
            selected_range={selected_date_range}
            on_range_change={handle_date_range_change}
          />
        }
        filter_modal_button={
          <>
            <div
              ref={division_filter_button_ref}
              className={filterButtonStyles.filter_button_dropdown_wrapper}
            >
              <FilterButton
                label="구분"
                onClick={() => set_is_division_dropdown_open((prev) => !prev)}
                isActive={selected_divisions.length > 0}
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
              <DivisionFilterDropdown
                is_open={is_division_dropdown_open}
                on_close={() => set_is_division_dropdown_open(false)}
                selected_divisions={selected_divisions}
                on_apply={handle_division_apply}
                container_ref={division_filter_button_ref}
              />
            </div>

            <div
              ref={block_code_filter_button_ref}
              className={filterButtonStyles.filter_button_dropdown_wrapper}
            >
              <FilterButton
                label="차단 코드"
                onClick={() => set_is_block_code_dropdown_open((prev) => !prev)}
                isActive={selected_block_codes.length > 0}
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
              <BlockCodeFilterDropdown
                is_open={is_block_code_dropdown_open}
                on_close={() => set_is_block_code_dropdown_open(false)}
                selected_block_codes={selected_block_codes}
                on_apply={handle_block_code_apply}
                container_ref={block_code_filter_button_ref}
              />
            </div>
          </>
        }
        active_filter_tags={active_filter_tags}
        on_filter_tag_remove={handle_filter_tag_remove}
      />

      {/* 필터 모달들 (모두 드롭다운으로 대체) */}
      {/* DivisionFilterModal, BlockCodeFilterModal은 각각 드롭다운으로 대체되었습니다 */}
    </div>
  );
}
