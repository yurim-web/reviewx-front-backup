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
 * - 삭제 버튼
 *
 */

"use client";

import { useState } from "react";
import styles from "@/styles/manager_ga/member/blacklist/blacklist_filter_section.module.css";
import BaseFilterSection, {
  type FilterTag,
} from "@/components/manager/ga/common/filter/BaseFilterSection";
import DateFilterButton from "@/components/manager/ga/common/filter/DateFilterButton";
import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";
import DivisionFilterModal from "@/components/manager/common/member/blacklist/filter/DivisionFilterModal";
import BlockCodeFilterModal from "@/components/manager/common/member/blacklist/filter/BlockCodeFilterModal";
import type {
  BlacklistDivision,
  BlockCode,
} from "@/data/manager_ga/member/blacklist";

interface BlacklistFilterSectionProps {
  search_query: string;
  on_search_change: (query: string) => void;
}

export default function BlacklistFilterSection({
  search_query,
  on_search_change,
}: BlacklistFilterSectionProps) {
  const [is_division_modal_open, set_is_division_modal_open] = useState(false);
  const [is_block_code_modal_open, set_is_block_code_modal_open] =
    useState(false);

  // 날짜 범위 상태
  // useState: React Hook으로 컴포넌트의 날짜 범위 상태를 관리합니다
  // [현재 값, 값을 변경하는 함수] = useState(초기값)
  // DateRange | undefined: 날짜 범위가 선택되지 않았을 수도 있으므로 undefined 허용
  const [selected_date_range, set_selected_date_range] = useState<
    DateRange | undefined
  >(undefined);

  const [selected_divisions, set_selected_divisions] = useState<
    BlacklistDivision[]
  >([]);
  const [selected_block_codes, set_selected_block_codes] = useState<
    BlockCode[]
  >([]);
  const [selected_sort, set_selected_sort] = useState("최신순");

  const handle_division_apply = (divisions: BlacklistDivision[]) => {
    set_selected_divisions(divisions);
  };

  const handle_remove_division = (division: BlacklistDivision) => {
    set_selected_divisions(selected_divisions.filter((d) => d !== division));
  };

  const handle_block_code_apply = (block_codes: BlockCode[]) => {
    set_selected_block_codes(block_codes);
  };

  const handle_remove_block_code = (block_code: BlockCode) => {
    set_selected_block_codes(
      selected_block_codes.filter((c) => c !== block_code)
    );
  };

  const handle_unblock = () => {
    // TODO: 선택된 차단 이력 삭제 기능 구현
  };

  const sort_options = ["최신순", "오래된순"];

  const handle_sort_change = (sort: string) => {
    set_selected_sort(sort);
    // TODO: 정렬 로직 구현
  };

  // 날짜 범위 변경 핸들러
  // DateFilterButton에서 날짜 범위가 변경될 때 호출됩니다
  const handle_date_range_change = (range: DateRange | undefined) => {
    set_selected_date_range(range);
    // TODO: 날짜 범위에 따른 필터링 로직 구현
  };

  const active_filter_tags: FilterTag<string>[] = [
    ...selected_divisions.map((division) => ({
      value: division,
      label: `구분: ${division}`,
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
              className={styles.filter_item}
              onClick={() => set_is_division_modal_open(true)}
            >
              <div
                className={`${styles.checkbox_icon} ${
                  selected_divisions.length > 0
                    ? styles.checkbox_icon_checked
                    : ""
                }`}
              ></div>
              <span className={styles.filter_text}>구분</span>
              <img
                src="/images/icons/dropdown_arrow.svg"
                alt="드롭다운"
                className={styles.dropdown_arrow}
              />
            </div>

            <div
              className={styles.filter_item}
              onClick={() => set_is_block_code_modal_open(true)}
            >
              <div
                className={`${styles.checkbox_icon} ${
                  selected_block_codes.length > 0
                    ? styles.checkbox_icon_checked
                    : ""
                }`}
              ></div>
              <span className={styles.filter_text}>차단 코드</span>
              <img
                src="/images/icons/dropdown_arrow.svg"
                alt="드롭다운"
                className={styles.dropdown_arrow}
              />
            </div>
          </>
        }
        // 오른쪽에 위치할 버튼 (해제)
        right_buttons={
          <div className={styles.filter_item} onClick={handle_unblock}>
            <img
              src="/images/icons/clear_icon.svg"
              alt="해제"
              className={styles.unblock_icon}
            />
            <span className={styles.filter_text}>해제</span>
          </div>
        }
        active_filter_tags={active_filter_tags}
        on_filter_tag_remove={handle_filter_tag_remove}
      />

      <DivisionFilterModal
        is_open={is_division_modal_open}
        on_close={() => set_is_division_modal_open(false)}
        selected_divisions={selected_divisions}
        on_apply={handle_division_apply}
      />

      <BlockCodeFilterModal
        is_open={is_block_code_modal_open}
        on_close={() => set_is_block_code_modal_open(false)}
        selected_block_codes={selected_block_codes}
        on_apply={handle_block_code_apply}
      />
    </div>
  );
}
