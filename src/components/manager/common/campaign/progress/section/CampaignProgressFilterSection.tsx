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

import { useState } from "react";
import BaseFilterSection, {
  type FilterTag,
} from "@/components/manager/ga/common/filter/BaseFilterSection";
import DateFilterButton from "@/components/manager/ga/common/filter/DateFilterButton";
import FilterButton from "@/components/manager/ga/common/filter/FilterButton";
import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";
import StatusFilterModal from "../filter/StatusFilterModal";
import TypeFilterModal from "../filter/TypeFilterModal";
import ChannelFilterModal, {
  channel_label_map,
} from "../filter/ChannelFilterModal";
import type { CampaignStatus } from "../filter/StatusFilterModal";
import type { CampaignType } from "../filter/TypeFilterModal";
import type { Channel } from "../filter/ChannelFilterModal";

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

  // 상태 필터 모달 열림/닫힘 상태
  const [is_status_modal_open, set_is_status_modal_open] = useState(false);

  // 유형 필터 모달 열림/닫힘 상태
  const [is_type_modal_open, set_is_type_modal_open] = useState(false);

  // 채널 필터 모달 열림/닫힘 상태
  const [is_channel_modal_open, set_is_channel_modal_open] = useState(false);

  // 선택된 정렬 옵션
  const [selected_sort, set_selected_sort] = useState<string>("최신순");

  // 정렬 옵션 목록
  const sort_options = ["최신순", "오래된순"];

  /* ========================================
     🎯 이벤트 핸들러 (Event Handlers)
     ======================================== */

  // 상태 필터 모달 열기
  const handle_status_filter_click = () => {
    set_is_status_modal_open(true);
  };

  // 상태 필터 모달 닫기
  const handle_status_modal_close = () => {
    set_is_status_modal_open(false);
  };

  // 상태 필터 적용
  const handle_status_apply = (statuses: CampaignStatus[]) => {
    on_statuses_change(statuses);
  };

  // 상태 태그 제거 핸들러
  const handle_remove_status = (status: CampaignStatus) => {
    on_statuses_change(selected_statuses.filter((s) => s !== status));
  };

  // 유형 필터 모달 열기
  const handle_type_filter_click = () => {
    set_is_type_modal_open(true);
  };

  // 유형 필터 모달 닫기
  const handle_type_modal_close = () => {
    set_is_type_modal_open(false);
  };

  // 유형 필터 적용
  const handle_type_apply = (types: CampaignType[]) => {
    on_types_change(types);
  };

  // 유형 태그 제거 핸들러
  const handle_remove_type = (type: CampaignType) => {
    on_types_change(selected_types.filter((t) => t !== type));
  };

  // 채널 필터 모달 열기
  const handle_channel_filter_click = () => {
    set_is_channel_modal_open(true);
  };

  // 채널 필터 모달 닫기
  const handle_channel_modal_close = () => {
    set_is_channel_modal_open(false);
  };

  // 채널 필터 적용
  const handle_channel_apply = (channels: Channel[]) => {
    on_channels_change(channels);
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
            {/* 상태 필터 */}
            <FilterButton
              label="상태"
              onClick={handle_status_filter_click}
              isActive={selected_statuses.length > 0}
              styles={styles}
            />

            {/* 유형 필터 */}
            <FilterButton
              label="유형"
              onClick={handle_type_filter_click}
              isActive={selected_types.length > 0}
              styles={styles}
            />

            {/* 채널 필터 */}
            <FilterButton
              label="채널"
              onClick={handle_channel_filter_click}
              isActive={selected_channels.length > 0}
              styles={styles}
            />
          </>
        }
        // 활성 필터 태그들
        active_filter_tags={active_filter_tags}
        on_filter_tag_remove={handle_filter_tag_remove}
        // 필터 초기화 함수
        on_filter_reset={on_filter_reset}
      />

      {/* 필터 모달들 */}
      <StatusFilterModal
        is_open={is_status_modal_open}
        on_close={handle_status_modal_close}
        selected_statuses={selected_statuses}
        on_apply={handle_status_apply}
      />

      <TypeFilterModal
        is_open={is_type_modal_open}
        on_close={handle_type_modal_close}
        selected_types={selected_types}
        on_apply={handle_type_apply}
      />

      <ChannelFilterModal
        is_open={is_channel_modal_open}
        on_close={handle_channel_modal_close}
        selected_channels={selected_channels}
        on_apply={handle_channel_apply}
      />
    </div>
  );
}
