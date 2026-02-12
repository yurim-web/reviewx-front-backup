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

import { useState, useRef } from "react";
import React from "react";
import BaseFilterSection, {
  type FilterTag,
} from "@/components/manager/ga/common/filter/BaseFilterSection";
import FilterButton from "@/components/manager/ga/common/filter/FilterButton";
import filterStyles from "@/styles/manager/common/section/filter_section.module.css";
import filterButtonStyles from "@/styles/manager_ga/common/filter/filter_button.module.css";

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
  // 이용 제한 버튼 클릭 핸들러 (선택적)
  on_restriction_click?: () => void;
  // 채널 필터 관련
  channel_name_map: Record<string, string>;
  ChannelFilterDropdown: React.ComponentType<any>;
  // 등급/구분 필터 관련 (리뷰어는 등급, 파트너는 구분)
  grade_or_division_label: string; // "등급" 또는 "구분"
  GradeOrDivisionFilterDropdown: React.ComponentType<any>;
  // 유형 필터 관련
  TypeFilterDropdown: React.ComponentType<any>;
  // 상태 필터 관련
  StatusFilterDropdown: React.ComponentType<any>;
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
  on_restriction_click,
  channel_name_map,
  ChannelFilterDropdown,
  grade_or_division_label,
  GradeOrDivisionFilterDropdown,
  TypeFilterDropdown,
  StatusFilterDropdown,
  download_button_text,
}: MemberFilterSectionProps<TChannel, TGradeOrDivision, TType, TStatus>) {
  // 필터 드롭다운 열림/닫힘 상태 관리
  const [is_channel_dropdown_open, set_is_channel_dropdown_open] =
    useState(false);
  const channel_filter_button_ref = useRef<HTMLDivElement>(null);

  const [
    is_grade_or_division_dropdown_open,
    set_is_grade_or_division_dropdown_open,
  ] = useState(false);
  const grade_or_division_filter_button_ref = useRef<HTMLDivElement>(null);

  const [is_type_dropdown_open, set_is_type_dropdown_open] = useState(false);
  const type_filter_button_ref = useRef<HTMLDivElement>(null);

  const [is_status_dropdown_open, set_is_status_dropdown_open] =
    useState(false);
  const status_filter_button_ref = useRef<HTMLDivElement>(null);

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

  // 리뷰어/파트너 구분: grade_or_division_label이 "등급"이면 리뷰어, "구분"이면 파트너입니다
  // 이 정보를 사용하여 alert 메시지를 다르게 표시합니다
  const member_type = grade_or_division_label === "등급" ? "리뷰어" : "파트너";

  // 목록 다운로드 핸들러
  // TODO: 엑셀 파일 다운로드 기능 구현 예정
  // 현재는 임시로 alert를 표시합니다
  const handle_download_click = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    // alert를 사용하여 사용자에게 알림을 표시합니다
    alert(`${member_type} 목록 다운로드 기능은 준비 중입니다.`);
  };

  return (
    <div>
      {/* BaseFilterSection 공통 컴포넌트 사용 */}
      <BaseFilterSection<string>
        search_query={search_query}
        on_search_change={on_search_change}
        // 필터 드롭다운 버튼들
        filter_modal_button={
          <>
            {/* 채널 필터 (드롭다운 사용) */}
            <div
              ref={channel_filter_button_ref}
              className={filterButtonStyles.filter_button_dropdown_wrapper}
            >
              <FilterButton
                label="채널"
                onClick={() => set_is_channel_dropdown_open((prev) => !prev)}
                isActive={selected_channels.length > 0}
                styles={{
                  filter_item: filterStyles.filter_item,
                  checkbox_icon: filterStyles.checkbox_icon,
                  checkbox_icon_checked:
                    filterButtonStyles.checkbox_icon_checked,
                  filter_text: filterStyles.filter_text,
                  dropdown_arrow: filterStyles.dropdown_arrow,
                  filter_item_active: filterButtonStyles.filter_item_active,
                  filter_text_active: filterButtonStyles.filter_text_active,
                  dropdown_arrow_active:
                    filterButtonStyles.dropdown_arrow_active,
                }}
              />
              <ChannelFilterDropdown
                is_open={is_channel_dropdown_open}
                on_close={() => set_is_channel_dropdown_open(false)}
                selected_channels={selected_channels}
                on_apply={handle_channel_apply}
                container_ref={channel_filter_button_ref}
              />
            </div>

            {/* 등급/구분 필터 (드롭다운 사용) */}
            <div
              ref={grade_or_division_filter_button_ref}
              className={filterButtonStyles.filter_button_dropdown_wrapper}
            >
              <FilterButton
                label={grade_or_division_label}
                onClick={() =>
                  set_is_grade_or_division_dropdown_open((prev) => !prev)
                }
                isActive={selected_divisions.length > 0}
                styles={{
                  filter_item: filterStyles.filter_item,
                  checkbox_icon: filterStyles.checkbox_icon,
                  checkbox_icon_checked:
                    filterButtonStyles.checkbox_icon_checked,
                  filter_text: filterStyles.filter_text,
                  dropdown_arrow: filterStyles.dropdown_arrow,
                  filter_item_active: filterButtonStyles.filter_item_active,
                  filter_text_active: filterButtonStyles.filter_text_active,
                  dropdown_arrow_active:
                    filterButtonStyles.dropdown_arrow_active,
                }}
              />
              {React.createElement(GradeOrDivisionFilterDropdown, {
                is_open: is_grade_or_division_dropdown_open,
                on_close: () => set_is_grade_or_division_dropdown_open(false),
                [grade_or_division_label === "등급"
                  ? "selected_grades"
                  : "selected_divisions"]: selected_divisions,
                on_apply: handle_grade_or_division_apply,
                container_ref: grade_or_division_filter_button_ref,
              } as any)}
            </div>

            {/* 유형 필터 (드롭다운 사용) */}
            <div
              ref={type_filter_button_ref}
              className={filterButtonStyles.filter_button_dropdown_wrapper}
            >
              <FilterButton
                label="유형"
                onClick={() => set_is_type_dropdown_open((prev) => !prev)}
                isActive={selected_types.length > 0}
                styles={{
                  filter_item: filterStyles.filter_item,
                  checkbox_icon: filterStyles.checkbox_icon,
                  checkbox_icon_checked:
                    filterButtonStyles.checkbox_icon_checked,
                  filter_text: filterStyles.filter_text,
                  dropdown_arrow: filterStyles.dropdown_arrow,
                  filter_item_active: filterButtonStyles.filter_item_active,
                  filter_text_active: filterButtonStyles.filter_text_active,
                  dropdown_arrow_active:
                    filterButtonStyles.dropdown_arrow_active,
                }}
              />
              <TypeFilterDropdown
                is_open={is_type_dropdown_open}
                on_close={() => set_is_type_dropdown_open(false)}
                selected_types={selected_types}
                on_apply={handle_type_apply}
                container_ref={type_filter_button_ref}
              />
            </div>

            {/* 상태 필터 (드롭다운 사용) */}
            <div
              ref={status_filter_button_ref}
              className={filterButtonStyles.filter_button_dropdown_wrapper}
            >
              <FilterButton
                label="상태"
                onClick={() => set_is_status_dropdown_open((prev) => !prev)}
                isActive={selected_statuses.length > 0}
                styles={{
                  filter_item: filterStyles.filter_item,
                  checkbox_icon: filterStyles.checkbox_icon,
                  checkbox_icon_checked:
                    filterButtonStyles.checkbox_icon_checked,
                  filter_text: filterStyles.filter_text,
                  dropdown_arrow: filterStyles.dropdown_arrow,
                  filter_item_active: filterButtonStyles.filter_item_active,
                  filter_text_active: filterButtonStyles.filter_text_active,
                  dropdown_arrow_active:
                    filterButtonStyles.dropdown_arrow_active,
                }}
              />
              <StatusFilterDropdown
                is_open={is_status_dropdown_open}
                on_close={() => set_is_status_dropdown_open(false)}
                selected_statuses={selected_statuses}
                on_apply={handle_status_apply}
                container_ref={status_filter_button_ref}
              />
            </div>
          </>
        }
        // 검색 필터 뒤에 올 버튼 (목록 다운로드)
        search_after_buttons={
          <div
            className={filterStyles.filter_item}
            onClick={handle_download_click}
            style={{
              cursor: "pointer",
            }}
            aria-label={`${download_button_text} 다운로드`}
          >
            <img
              src="/images/excel_icon.png"
              alt="다운로드"
              className={filterStyles.download_icon}
            />
            <span className={filterStyles.download_button_text}>
              {download_button_text}
            </span>
          </div>
        }
        // 오른쪽에 위치할 버튼 (차단--> 이용제한)
        right_buttons={
          <div
            className={filterStyles.filter_item}
            onClick={(e) => {
              // 이벤트 전파 방지
              e.stopPropagation();
              // 클릭 핸들러가 있으면 실행
              if (on_restriction_click) {
                on_restriction_click();
              }
            }}
            style={{
              cursor: on_restriction_click ? "pointer" : "default",
            }}
            role="button"
            tabIndex={on_restriction_click ? 0 : -1}
            onKeyDown={(e) => {
              // 키보드 접근성: Enter 키나 Space 키를 누르면 클릭과 동일하게 동작합니다
              if (
                on_restriction_click &&
                (e.key === "Enter" || e.key === " ")
              ) {
                e.preventDefault();
                on_restriction_click();
              }
            }}
            aria-label="이용 제한"
          >
            <img
              src="/images/icons/block_btn_icon.svg"
              alt="차단"
              className={filterStyles.block_icon}
            />
            <span className={filterStyles.restriction_button_text}>
              이용 제한
            </span>
          </div>
        }
        // 활성 필터 태그들
        active_filter_tags={active_filter_tags}
        on_filter_tag_remove={handle_filter_tag_remove}
      />
    </div>
  );
}
