/* ========================================
   🔍 필터 섹션 컴포넌트 (공통)
   ======================================== */

/**
 * 캠페인 진행 상황 필터 섹션 컴포넌트
 *
 * 목적: GA/SA 관리자 진행 상황 페이지에서 필터 섹션을 표시합니다.
 *
 * 두 가지 사용 위치:
 * - /manager_ga/campaign/progress (GA 관리자 진행 상황 페이지)
 * - /manager_sa/campaign/progress (SA 관리자 진행 상황 페이지)
 *
 * 주요 기능:
 * - 날짜 필터
 * - 검색 필터
 * - 상태 필터
 * - 유형 필터
 * - 채널 필터
 * - 정렬 필터
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
import StatusFilterDropdown from "../filter/StatusFilterDropdown";
import TypeFilterDropdown from "../filter/TypeFilterDropdown";
import ChannelFilterDropdown, {
  channel_label_map,
} from "../filter/ChannelFilterDropdown";
import type { CampaignStatus } from "../filter/StatusFilterModal";
import type { CampaignType } from "../filter/TypeFilterModal";
import type { Channel } from "../filter/ChannelFilterModal";
import filterButtonStyles from "@/styles/manager_ga/common/filter/filter_button.module.css";

interface CampaignProgressFilterSectionProps {
  // CSS 모듈 스타일 객체
  styles: Record<string, string> & {
    filter_item: string;
    filter_icon: string;
    filter_text: string;
    checkbox_icon: string;
    dropdown_arrow: string;
    report_icon: string;
  };
  // 필터 상태 (부모 컴포넌트에서 관리)
  search_query: string;
  on_search_change: (query: string) => void;
  selected_statuses: CampaignStatus[];
  on_statuses_change: (statuses: CampaignStatus[]) => void;
  selected_types: CampaignType[];
  on_types_change: (types: CampaignType[]) => void;
  selected_channels: Channel[];
  on_channels_change: (channels: Channel[]) => void;
  selected_date_range: DateRange | undefined;
  on_date_range_change: (range: DateRange | undefined) => void;
  // 필터 초기화 함수 (선택적)
  on_filter_reset?: () => void;
}

export default function CampaignProgressFilterSection({
  styles,
  search_query,
  on_search_change,
  selected_statuses,
  on_statuses_change,
  selected_types,
  on_types_change,
  selected_channels,
  on_channels_change,
  selected_date_range,
  on_date_range_change,
  on_filter_reset,
}: CampaignProgressFilterSectionProps) {
  /* ========================================
     📌 상태 관리 (State Management)
     ======================================== */

  // 상태 필터 드롭다운 열림/닫힘 상태
  const [is_status_dropdown_open, set_is_status_dropdown_open] =
    useState(false);

  // 상태 필터 버튼 컨테이너 ref (드롭다운 위치 계산용)
  // useRef: DOM 요소에 직접 접근하기 위한 React Hook
  const status_filter_button_ref = useRef<HTMLDivElement>(null);

  // 유형 필터 드롭다운 열림/닫힘 상태
  const [is_type_dropdown_open, set_is_type_dropdown_open] = useState(false);

  // 유형 필터 버튼 컨테이너 ref (드롭다운 위치 계산용)
  const type_filter_button_ref = useRef<HTMLDivElement>(null);

  // 채널 필터 드롭다운 열림/닫힘 상태
  const [is_channel_dropdown_open, set_is_channel_dropdown_open] =
    useState(false);

  // 채널 필터 버튼 컨테이너 ref (드롭다운 위치 계산용)
  const channel_filter_button_ref = useRef<HTMLDivElement>(null);

  // 선택된 정렬 옵션
  const [selected_sort, set_selected_sort] = useState<string>("최신순");

  // 정렬 옵션 목록
  const sort_options = ["최신순", "오래된순"];

  /* ========================================
     🎯 이벤트 핸들러 (Event Handlers)
     ======================================== */

  // 상태 필터 드롭다운 열기/닫기 토글
  const handle_status_filter_click = () => {
    set_is_status_dropdown_open((prev) => !prev); // 이전 상태의 반대로 변경 (토글)
  };

  // 상태 필터 드롭다운 닫기
  const handle_status_dropdown_close = () => {
    set_is_status_dropdown_open(false);
  };

  // 상태 필터 적용
  const handle_status_apply = (statuses: CampaignStatus[]) => {
    on_statuses_change(statuses);
    // 드롭다운은 선택 시 즉시 적용되므로 닫지 않음 (BaseFilterDropdown에서 처리)
  };

  // 상태 태그 제거 핸들러
  const handle_remove_status = (status: CampaignStatus) => {
    on_statuses_change(selected_statuses.filter((s) => s !== status));
  };

  // 유형 필터 드롭다운 열기/닫기 토글
  const handle_type_filter_click = () => {
    set_is_type_dropdown_open((prev) => !prev); // 이전 상태의 반대로 변경 (토글)
  };

  // 유형 필터 드롭다운 닫기
  const handle_type_dropdown_close = () => {
    set_is_type_dropdown_open(false);
  };

  // 유형 필터 적용
  const handle_type_apply = (types: CampaignType[]) => {
    on_types_change(types);
    // 드롭다운은 선택 시 즉시 적용되므로 닫지 않음 (BaseFilterDropdown에서 처리)
  };

  // 유형 태그 제거 핸들러
  const handle_remove_type = (type: CampaignType) => {
    on_types_change(selected_types.filter((t) => t !== type));
  };

  // 채널 필터 드롭다운 열기/닫기 토글
  const handle_channel_filter_click = () => {
    set_is_channel_dropdown_open((prev) => !prev); // 이전 상태의 반대로 변경 (토글)
  };

  // 채널 필터 드롭다운 닫기
  const handle_channel_dropdown_close = () => {
    set_is_channel_dropdown_open(false);
  };

  // 채널 필터 적용
  const handle_channel_apply = (channels: Channel[]) => {
    on_channels_change(channels);
    // 드롭다운은 선택 시 즉시 적용되므로 닫지 않음 (BaseFilterDropdown에서 처리)
  };

  // 채널 태그 제거 핸들러
  const handle_remove_channel = (channel: Channel) => {
    on_channels_change(selected_channels.filter((c) => c !== channel));
  };

  // 정렬 옵션 선택 핸들러
  const handle_sort_select = (sort: string) => {
    set_selected_sort(sort);
    // TODO: 정렬 로직 구현
  };

  // 날짜 범위 변경 핸들러
  // DateFilterButton에서 날짜 범위가 변경될 때 호출됩니다
  const handle_date_range_change = (range: DateRange | undefined) => {
    on_date_range_change(range);
  };

  // 활성 필터 태그 목록 생성
  const active_filter_tags: FilterTag<string>[] = [
    ...selected_statuses.map((status) => ({ value: status, label: status })),
    ...selected_types.map((type) => ({ value: type, label: type })),
    ...selected_channels.map((channel) => ({
      value: channel,
      label: channel_label_map[channel],
    })),
  ];

  // 필터 태그 제거 핸들러
  const handle_filter_tag_remove = (value: string) => {
    // 상태 필터 태그인지 확인
    if (selected_statuses.includes(value as CampaignStatus)) {
      handle_remove_status(value as CampaignStatus);
    }
    // 유형 필터 태그인지 확인
    else if (selected_types.includes(value as CampaignType)) {
      handle_remove_type(value as CampaignType);
    }
    // 채널 필터 태그인지 확인
    else if (selected_channels.includes(value as Channel)) {
      handle_remove_channel(value as Channel);
    }
  };

  return (
    <div>
      {/* BaseFilterSection 공통 컴포넌트 사용 */}
      <BaseFilterSection<string>
        search_query={search_query}
        on_search_change={on_search_change}
        // 검색어 초기화 버튼 숨기기
        // 날짜 필터 - DateFilterButton 컴포넌트 사용
        // DateFilterButton은 BaseFilterSection의 date_filter prop으로 전달됩니다
        date_filter={
          <DateFilterButton
            selected_range={selected_date_range}
            on_range_change={handle_date_range_change}
          />
        }
        // 필터 모달 버튼들 (여러 개를 Fragment로 묶어서 전달)
        // FilterButton 공통 컴포넌트 사용으로 코드 중복 제거
        filter_modal_button={
          <>
            {/* 상태 필터 (드롭다운 사용) */}
            {/* filter_button_dropdown_wrapper: FilterButton과 드롭다운을 함께 감싸는 래퍼 */}
            {/* position: relative로 설정하여 드롭다운의 위치 기준점이 됩니다 */}
            <div
              ref={status_filter_button_ref}
              className={filterButtonStyles.filter_button_dropdown_wrapper}
            >
              <FilterButton
                label="상태"
                onClick={handle_status_filter_click}
                isActive={selected_statuses.length > 0}
                styles={{
                  ...styles,
                  checkbox_icon_checked:
                    filterButtonStyles.checkbox_icon_checked,
                  filter_item_active: filterButtonStyles.filter_item_active,
                  filter_text_active: filterButtonStyles.filter_text_active,
                  dropdown_arrow_active:
                    filterButtonStyles.dropdown_arrow_active,
                }}
              />
              {/* 상태 필터 드롭다운 */}
              <StatusFilterDropdown
                is_open={is_status_dropdown_open}
                on_close={handle_status_dropdown_close}
                selected_statuses={selected_statuses}
                on_apply={handle_status_apply}
                container_ref={status_filter_button_ref}
              />
            </div>

            {/* 유형 필터 (드롭다운 사용) */}
            <div
              ref={type_filter_button_ref}
              className={filterButtonStyles.filter_button_dropdown_wrapper}
            >
              <FilterButton
                label="유형"
                onClick={handle_type_filter_click}
                isActive={selected_types.length > 0}
                styles={{
                  ...styles,
                  checkbox_icon_checked:
                    filterButtonStyles.checkbox_icon_checked,
                  filter_item_active: filterButtonStyles.filter_item_active,
                  filter_text_active: filterButtonStyles.filter_text_active,
                  dropdown_arrow_active:
                    filterButtonStyles.dropdown_arrow_active,
                }}
              />
              {/* 유형 필터 드롭다운 */}
              <TypeFilterDropdown
                is_open={is_type_dropdown_open}
                on_close={handle_type_dropdown_close}
                selected_types={selected_types}
                on_apply={handle_type_apply}
                container_ref={type_filter_button_ref}
              />
            </div>

            {/* 채널 필터 (드롭다운 사용) */}
            <div
              ref={channel_filter_button_ref}
              className={filterButtonStyles.filter_button_dropdown_wrapper}
            >
              <FilterButton
                label="채널"
                onClick={handle_channel_filter_click}
                isActive={selected_channels.length > 0}
                styles={{
                  ...styles,
                  checkbox_icon_checked:
                    filterButtonStyles.checkbox_icon_checked,
                  filter_item_active: filterButtonStyles.filter_item_active,
                  filter_text_active: filterButtonStyles.filter_text_active,
                  dropdown_arrow_active:
                    filterButtonStyles.dropdown_arrow_active,
                }}
              />
              {/* 채널 필터 드롭다운 */}
              <ChannelFilterDropdown
                is_open={is_channel_dropdown_open}
                on_close={handle_channel_dropdown_close}
                selected_channels={selected_channels}
                on_apply={handle_channel_apply}
                container_ref={channel_filter_button_ref}
              />
            </div>
          </>
        }
        // 활성 필터 태그들
        active_filter_tags={active_filter_tags}
        on_filter_tag_remove={handle_filter_tag_remove}
        // 필터 초기화 함수
        on_filter_reset={on_filter_reset}
      />

      {/* 필터 모달들 (모두 드롭다운으로 대체) */}
      {/* StatusFilterModal, TypeFilterModal, ChannelFilterModal은 각각 드롭다운으로 대체되었습니다 */}
    </div>
  );
}
