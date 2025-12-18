/* ========================================
   🔍 신고 이력 필터 섹션 컴포넌트
   ======================================== */

/**
 * 캠페인 신고 이력 필터 섹션 컴포넌트
 *
 * 목적: GA 관리자 신고 이력 페이지에서 필터 섹션을 표시합니다.
 *
 * 사용 위치:
 * - /manager_ga/campaign/reported (신고 이력 페이지)
 *
 * 주요 기능:
 * - 날짜 필터
 * - 신고 코드 필터
 * - 검색어 필터
 * - 차단 필터
 *
 */

"use client";

import { useState } from "react";
import styles from "@/styles/manager_ga/campaign/progress/filter_section.module.css";
import BaseFilterSection, {
  type FilterTag,
} from "@/components/manager/ga/common/filter/BaseFilterSection";
import DateFilterButton from "@/components/manager/ga/common/filter/DateFilterButton";
import FilterButton from "@/components/manager/ga/common/filter/FilterButton";
import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";
import ReportCodeFilterModal from "../filter/ReportCodeFilterModal";
import type { ReportCode } from "@/data/manager_ga/reported";

interface CampaignReportedFilterSectionProps {
  // 검색어 상태와 변경 함수를 props로 받습니다
  search_query: string;
  on_search_change: (query: string) => void;
  // 선택된 신고 코드 필터 상태와 변경 함수
  selected_report_codes?: ReportCode[];
  on_report_codes_change?: (codes: ReportCode[]) => void;
  // 날짜 범위 필터 상태와 변경 함수
  selected_date_range?: DateRange | undefined;
  on_date_range_change?: (range: DateRange | undefined) => void;
}

export default function CampaignReportedFilterSection({
  search_query,
  on_search_change,
  selected_report_codes = [],
  on_report_codes_change,
  selected_date_range,
  on_date_range_change,
}: CampaignReportedFilterSectionProps) {

  // 신고 코드 필터 모달 열림/닫힘 상태
  const [is_report_code_modal_open, set_is_report_code_modal_open] =
    useState(false);

  // 내부에서 관리하는 선택된 신고 코드들
  const [selected_codes, set_selected_codes] = useState<ReportCode[]>(
    selected_report_codes
  );

  // 선택된 정렬 옵션
  const [selected_sort, set_selected_sort] = useState<string>("최신순");

  // 정렬 옵션 목록
  const sort_options = ["최신순", "오래된순"];

  // 신고 코드 필터 모달 열기
  const handle_report_code_filter_click = () => {
    set_is_report_code_modal_open(true);
  };

  // 신고 코드 필터 모달 닫기
  const handle_report_code_modal_close = () => {
    set_is_report_code_modal_open(false);
  };

  // 신고 코드 필터 적용
  const handle_report_code_apply = (codes: ReportCode[]) => {
    set_selected_codes(codes);
    on_report_codes_change?.(codes);
  };

  // 신고 코드 태그 제거 핸들러
  const handle_remove_report_code = (code: ReportCode) => {
    const new_codes = selected_codes.filter((c) => c !== code);
    set_selected_codes(new_codes);
    on_report_codes_change?.(new_codes);
  };

  // 정렬 옵션 선택 핸들러
  const handle_sort_select = (sort: string) => {
    set_selected_sort(sort);
    // TODO: 정렬 로직 구현
  };

  // 날짜 범위 변경 핸들러
  // DateFilterButton에서 날짜 범위가 변경될 때 호출됩니다
  const handle_date_range_change = (range: DateRange | undefined) => {
    on_date_range_change?.(range);
  };

  // 활성 필터 태그 목록 생성
  // map 함수: 배열을 순회하며 각 요소를 변환한 새로운 배열을 만듭니다
  const active_filter_tags: FilterTag<ReportCode>[] = selected_codes.map(
    (code) => ({
      value: code,
      label: code,
    })
  );

  return (
    <div>
      {/* BaseFilterSection 공통 컴포넌트 사용 */}
      <BaseFilterSection<ReportCode>
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
        // 신고 코드 필터 모달 버튼
        filter_modal_button={
          <FilterButton
            label="신고 코드"
            onClick={handle_report_code_filter_click}
            isActive={selected_codes.length > 0}
            styles={styles}
          />
        }
        // 검색 필터 뒤에 올 버튼 (차단 필터)
        search_after_buttons={
          <div className={styles.filter_item}>
            <img
              src="/images/icons/rerport_icon.svg"
              alt="차단"
              className={styles.report_icon}
            />
            <span className={styles.filter_text}>차단</span>
          </div>
        }
        // 활성 필터 태그들
        active_filter_tags={active_filter_tags}
        on_filter_tag_remove={handle_remove_report_code}
      />

      {/* 신고 코드 필터 모달 */}
      <ReportCodeFilterModal
        is_open={is_report_code_modal_open}
        on_close={handle_report_code_modal_close}
        selected_codes={selected_codes}
        on_apply={handle_report_code_apply}
      />
    </div>
  );
}
