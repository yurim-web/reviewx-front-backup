/* ========================================
   🔍 회원 필터 섹션 컴포넌트 (공통)
   ======================================== */

/**
 * 회원 필터 섹션 컴포넌트 (공통)
 *
 * 목적: 리뷰어/파트너 목록 페이지에서 필터링을 위한 필터 버튼들을 표시하는 섹션입니다.
 *
 * 사용 위치:
 * - /manager_ga/member/reviewers (GA 관리자 리뷰어 목록 페이지)
 * - /manager_sa/member/reviewers (SA 관리자 리뷰어 목록 페이지)
 * - /manager_ga/member/partners (GA 관리자 파트너 목록 페이지)
 * - /manager_sa/member/partners (SA 관리자 파트너 목록 페이지)
 *
 * 주요 기능:
 * - 채널 필터
 * - 등급/구분 필터 (리뷰어는 등급, 파트너는 구분)
 * - 유형 필터
 * - 상태 필터
 * - 검색어 필터
 * - 정렬 필터 (최신순)
 * - 차단 버튼
 * - 목록 다운로드 버튼
 *
 */

"use client";

import { useState } from "react";
import React from "react";
import BaseFilterSection, {
  type FilterTag,
} from "@/components/manager/ga/common/filter/BaseFilterSection";

// 필터 모달 컴포넌트 타입 정의 (유연하게 받기 위해 any 사용)
// 실제 필터 모달들은 selected_channels, selected_grades 등 다양한 prop 이름을 사용합니다
type FilterModalComponent<T> = React.ComponentType<any>;

interface MemberFilterSectionProps<TChannel, TGradeOrDivision, TType, TStatus> {
  // 검색어 상태와 변경 함수
  search_query: string;
  on_search_change: (query: string) => void;
  // 필터 상태와 변경 함수 (외부에서 관리, 선택적)
  selected_channels?: TChannel[];
  on_channels_change?: (channels: TChannel[]) => void;
  selected_divisions?: TGradeOrDivision[];
  on_divisions_change?: (divisions: TGradeOrDivision[]) => void;
  selected_types?: TType[];
  on_types_change?: (types: TType[]) => void;
  selected_statuses?: TStatus[];
  on_statuses_change?: (statuses: TStatus[]) => void;
  // CSS 모듈 스타일 객체
  styles: Record<string, string> & {
    filter_item: string;
    checkbox_icon: string;
    checkbox_icon_checked: string;
    filter_text: string;
    dropdown_arrow: string;
    download_icon: string;
    report_icon: string;
    block_icon: string;
  };
  // 채널 필터 관련
  channel_name_map: Record<string, string>;
  ChannelFilterModal: React.ComponentType<FilterModalComponent<TChannel>>;
  // 등급/구분 필터 관련 (리뷰어는 등급, 파트너는 구분)
  grade_or_division_label: string; // "등급" 또는 "구분"
  GradeOrDivisionFilterModal: React.ComponentType<
    FilterModalComponent<TGradeOrDivision>
  >;
  // 유형 필터 관련
  TypeFilterModal: React.ComponentType<FilterModalComponent<TType>>;
  // 상태 필터 관련
  StatusFilterModal: React.ComponentType<FilterModalComponent<TStatus>>;
  // 다운로드 버튼 텍스트
  download_button_text: string;
}

export default function MemberFilterSection<
  TChannel extends string,
  TGradeOrDivision extends string,
  TType extends string,
  TStatus extends string
>({
  search_query,
  on_search_change,
  selected_channels = [],
  on_channels_change,
  selected_divisions = [],
  on_divisions_change,
  selected_types = [],
  on_types_change,
  selected_statuses = [],
  on_statuses_change,
  styles: cssStyles,
  channel_name_map,
  ChannelFilterModal,
  grade_or_division_label,
  GradeOrDivisionFilterModal,
  TypeFilterModal,
  StatusFilterModal,
  download_button_text,
}: MemberFilterSectionProps<TChannel, TGradeOrDivision, TType, TStatus>) {
  // 필터 모달 열림/닫힘 상태 관리
  const [is_channel_modal_open, set_is_channel_modal_open] = useState(false);
  const [is_grade_or_division_modal_open, set_is_grade_or_division_modal_open] =
    useState(false);
  const [is_type_modal_open, set_is_type_modal_open] = useState(false);
  const [is_status_modal_open, set_is_status_modal_open] = useState(false);

  const [selected_sort, set_selected_sort] = useState("최신순");

  // 채널 필터 핸들러
  const handle_channel_apply = (channels: TChannel[]) => {
    on_channels_change?.(channels);
  };

  const handle_remove_channel = (channel: TChannel) => {
    if (on_channels_change) {
      on_channels_change(selected_channels.filter((c) => c !== channel));
    }
  };

  // 등급/구분 필터 핸들러
  const handle_grade_or_division_apply = (values: TGradeOrDivision[]) => {
    on_divisions_change?.(values);
  };

  const handle_remove_grade_or_division = (value: TGradeOrDivision) => {
    if (on_divisions_change) {
      on_divisions_change(selected_divisions.filter((v) => v !== value));
    }
  };

  // 유형 필터 핸들러
  const handle_type_apply = (types: TType[]) => {
    on_types_change?.(types);
  };

  const handle_remove_type = (type: TType) => {
    if (on_types_change) {
      on_types_change(selected_types.filter((t) => t !== type));
    }
  };

  // 상태 필터 핸들러
  const handle_status_apply = (statuses: TStatus[]) => {
    on_statuses_change?.(statuses);
  };

  const handle_remove_status = (status: TStatus) => {
    if (on_statuses_change) {
      on_statuses_change(selected_statuses.filter((s) => s !== status));
    }
  };

  // 정렬 옵션
  const sort_options = ["최신순", "오래된순"];

  // 정렬 옵션 선택 핸들러
  const handle_sort_change = (sort: string) => {
    set_selected_sort(sort);
    // TODO: 정렬 로직 구현
  };

  // 활성 필터 태그 목록 생성
  const active_filter_tags: FilterTag<string>[] = [
    ...selected_channels.map((channel) => ({
      value: channel as string,
      label: channel_name_map[channel],
    })),
    ...selected_divisions.map((value) => ({
      value: value as string,
      label: value as string,
    })),
    ...selected_types.map((type) => ({
      value: type as string,
      label: type as string,
    })),
    ...selected_statuses.map((status) => ({
      value: status as string,
      label: status as string,
    })),
  ];

  // 필터 태그 제거 핸들러
  const handle_filter_tag_remove = (value: string) => {
    // 채널인지 확인
    if (selected_channels.includes(value as TChannel)) {
      handle_remove_channel(value as TChannel);
    }
    // 등급/구분인지 확인
    else if (selected_divisions.includes(value as TGradeOrDivision)) {
      handle_remove_grade_or_division(value as TGradeOrDivision);
    }
    // 유형인지 확인
    else if (selected_types.includes(value as TType)) {
      handle_remove_type(value as TType);
    }
    // 상태인지 확인
    else if (selected_statuses.includes(value as TStatus)) {
      handle_remove_status(value as TStatus);
    }
  };

  return (
    <div>
      {/* BaseFilterSection 공통 컴포넌트 사용 */}
      <BaseFilterSection<string>
        search_query={search_query}
        on_search_change={on_search_change}
        // 필터 모달 버튼들
        filter_modal_button={
          <>
            {/* 채널 필터 */}
            <div
              className={cssStyles.filter_item}
              onClick={() => set_is_channel_modal_open(true)}
            >
              <div
                className={`${cssStyles.checkbox_icon} ${
                  selected_channels.length > 0
                    ? cssStyles.checkbox_icon_checked
                    : ""
                }`}
              ></div>
              <span className={cssStyles.filter_text}>채널</span>
              <img
                src="/images/icons/dropdown_arrow.svg"
                alt="드롭다운"
                className={cssStyles.dropdown_arrow}
              />
            </div>

            {/* 등급/구분 필터 */}
            <div
              className={cssStyles.filter_item}
              onClick={() => set_is_grade_or_division_modal_open(true)}
            >
              <div
                className={`${cssStyles.checkbox_icon} ${
                  selected_divisions.length > 0
                    ? cssStyles.checkbox_icon_checked
                    : ""
                }`}
              ></div>
              <span className={cssStyles.filter_text}>
                {grade_or_division_label}
              </span>
              <img
                src="/images/icons/dropdown_arrow.svg"
                alt="드롭다운"
                className={cssStyles.dropdown_arrow}
              />
            </div>

            {/* 유형 필터 */}
            <div
              className={cssStyles.filter_item}
              onClick={() => set_is_type_modal_open(true)}
            >
              <div
                className={`${cssStyles.checkbox_icon} ${
                  selected_types.length > 0
                    ? cssStyles.checkbox_icon_checked
                    : ""
                }`}
              ></div>
              <span className={cssStyles.filter_text}>유형</span>
              <img
                src="/images/icons/dropdown_arrow.svg"
                alt="드롭다운"
                className={cssStyles.dropdown_arrow}
              />
            </div>

            {/* 상태 필터 */}
            <div
              className={cssStyles.filter_item}
              onClick={() => set_is_status_modal_open(true)}
            >
              <div
                className={`${cssStyles.checkbox_icon} ${
                  selected_statuses.length > 0
                    ? cssStyles.checkbox_icon_checked
                    : ""
                }`}
              ></div>
              <span className={cssStyles.filter_text}>상태</span>
              <img
                src="/images/icons/dropdown_arrow.svg"
                alt="드롭다운"
                className={cssStyles.dropdown_arrow}
              />
            </div>
          </>
        }
        // 검색 필터 뒤에 올 버튼 (목록 다운로드)
        search_after_buttons={
          <div className={cssStyles.filter_item}>
            <img
              src="/images/excel_icon.png"
              alt="다운로드"
              className={cssStyles.download_icon}
            />
            <span className={cssStyles.filter_text}>
              {download_button_text}
            </span>
          </div>
        }
        // 오른쪽에 위치할 버튼 (차단--> 이용제한)
        right_buttons={
          <div className={cssStyles.filter_item}>
            <img
              src="/images/icons/block_btn_icon.svg"
              alt="차단"
              className={cssStyles.block_icon}
            />
            <span className={cssStyles.filter_text}>이용 제한</span>
          </div>
        }
        // 활성 필터 태그들
        active_filter_tags={active_filter_tags}
        on_filter_tag_remove={handle_filter_tag_remove}
      />

      {/* 필터 모달들 */}
      {/* 필터 모달 컴포넌트들은 각각 다른 prop 이름을 사용하므로 동적으로 전달 */}
      {React.createElement(ChannelFilterModal, {
        is_open: is_channel_modal_open,
        on_close: () => set_is_channel_modal_open(false),
        selected_channels: selected_channels,
        on_apply: handle_channel_apply,
      } as any)}

      {React.createElement(GradeOrDivisionFilterModal, {
        is_open: is_grade_or_division_modal_open,
        on_close: () => set_is_grade_or_division_modal_open(false),
        [grade_or_division_label === "등급"
          ? "selected_grades"
          : "selected_divisions"]: selected_divisions,
        on_apply: handle_grade_or_division_apply,
      } as any)}

      {React.createElement(TypeFilterModal, {
        is_open: is_type_modal_open,
        on_close: () => set_is_type_modal_open(false),
        selected_types: selected_types,
        on_apply: handle_type_apply,
      } as any)}

      {React.createElement(StatusFilterModal, {
        is_open: is_status_modal_open,
        on_close: () => set_is_status_modal_open(false),
        selected_statuses: selected_statuses,
        on_apply: handle_status_apply,
      } as any)}
    </div>
  );
}
