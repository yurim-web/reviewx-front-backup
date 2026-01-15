/* ========================================
   🔍 반려 이력 필터 섹션 컴포넌트
   ======================================== */

/**
 * 캠페인 반려 이력 필터 섹션 컴포넌트
 *
 * 목적: GA 관리자 반려 이력 페이지에서 필터 섹션을 표시합니다.
 *
 * 사용 위치:
 * - /manager_ga/campaign/rejected (반려 이력 페이지)
 *
 * 주요 기능:
 * - 날짜 필터
 * - 반려 코드 필터
 * - 검색어 필터
 *
 */

"use client";

import { useState, useEffect, useRef } from "react";
import styles from "@/styles/manager/common/section/filter_section.module.css";
import filterButtonStyles from "@/styles/manager_ga/common/filter/filter_button.module.css";
import BaseFilterSection, {
  type FilterTag,
} from "@/components/manager/ga/common/filter/BaseFilterSection";
import DateFilterButton from "@/components/manager/ga/common/filter/DateFilterButton";
import FilterButton from "@/components/manager/ga/common/filter/FilterButton";
import BaseFilterDropdown from "@/components/manager/ga/common/filter/BaseFilterDropdown";
import type { FilterOption } from "@/components/manager/ga/common/filter/BaseFilterModal";
import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";
import { reject_code_info, type RejectCode } from "@/data/manager_ga/rejected";

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
  // 내부에서 관리하는 선택된 반려 코드들
  const [selected_codes, set_selected_codes] = useState<RejectCode[]>(
    selected_reject_codes
  );

  // 드롭다운 열림/닫힘 상태 관리
  const [is_reject_code_dropdown_open, set_is_reject_code_dropdown_open] =
    useState<boolean>(false);

  // 필터 버튼 컨테이너 ref (드롭다운 위치 계산용)
  const reject_code_filter_button_ref = useRef<HTMLDivElement>(null);

  // 날짜 범위 변경 핸들러
  const handle_date_range_change = (range: DateRange | undefined) => {
    on_date_range_change?.(range);
  };

  // 외부에서 selected_reject_codes가 변경되면 내부 상태도 업데이트
  // useEffect: 컴포넌트가 렌더링된 후에 실행되는 Hook입니다
  // 의존성 배열 [selected_reject_codes]: selected_reject_codes가 변경될 때마다 함수가 실행됩니다
  useEffect(() => {
    set_selected_codes(selected_reject_codes);
  }, [selected_reject_codes]);

  // 반려 코드 필터 버튼 클릭 핸들러
  const handle_reject_code_filter_click = () => {
    set_is_reject_code_dropdown_open((prev) => !prev);
  };

  // 반려 코드 드롭다운 닫기 핸들러
  const handle_reject_code_dropdown_close = () => {
    set_is_reject_code_dropdown_open(false);
  };

  // 반려 코드 필터 적용 핸들러 (드롭다운에서 직접 호출)
  const handle_reject_code_apply = (codes: RejectCode[]) => {
    set_selected_codes(codes);
    on_reject_codes_change?.(codes);
  };

  // 반려 코드 태그 제거 핸들러
  const handle_remove_reject_code = (code: RejectCode) => {
    const new_codes = selected_codes.filter((c) => c !== code);
    set_selected_codes(new_codes);
    on_reject_codes_change?.(new_codes);
  };

  // 반려 코드 옵션을 FilterOption 형태로 변환
  const reject_code_dropdown_options = get_reject_code_options();

  // 활성 필터 태그 목록 생성
  // map 함수: 배열을 순회하며 각 요소를 변환한 새로운 배열을 만듭니다
  const active_filter_tags: FilterTag<RejectCode>[] = selected_codes.map(
    (code) => ({
      value: code,
      label: code,
    })
  );

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
                reject_code_filter_button_ref as React.RefObject<HTMLDivElement>
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
