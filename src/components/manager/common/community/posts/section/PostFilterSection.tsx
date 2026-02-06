/* ========================================
   🔍 게시글 목록 필터 섹션 컴포넌트
   ======================================== */

/**
 * 게시글 목록 필터 섹션 컴포넌트
 *
 * 목적: 게시글 목록을 필터링하기 위한 필터 버튼들을 표시하는 섹션입니다.
 *
 * 사용 페이지:
 * - /manager_ga/community/posts (GA 관리자 게시글 목록 페이지)
 * - /manager_sa/community/posts (SA 관리자 게시글 목록 페이지)
 *
 * 주요 기능:
 * - 선택 기간 조회 필터
 * - 구분 필터 (공지사항/자주 묻는 질문/이벤트)
 * - 검색어 필터
 * - 고정 버튼
 * - 해제 버튼
 * - 수정 버튼
 * - 등록 버튼
 * - 삭제 버튼
 * - 정렬 필터 (최신순)
 *
 */

"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import BaseFilterSection, {
  type FilterTag,
} from "@/components/manager/ga/common/filter/BaseFilterSection";
import DateFilterButton from "@/components/manager/ga/common/filter/DateFilterButton";
import FilterButton from "@/components/manager/ga/common/filter/FilterButton";
import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";
import type { PostDivision, PostTarget } from "@/data/manager_ga/community/postsData";
import DivisionFilterDropdown from "@/components/manager/common/community/posts/filter/DivisionFilterDropdown";
import TargetFilterDropdown from "@/components/manager/common/community/posts/filter/TargetFilterDropdown";
import filterStyles from "@/styles/manager/common/section/filter_section.module.css";
import filterButtonStyles from "@/styles/manager_ga/common/filter/filter_button.module.css";

interface PostFilterSectionProps {
  // 검색어 상태를 props로 받습니다
  search_query: string;
  // 검색어 변경 핸들러를 props로 받습니다
  on_search_change: (query: string) => void;
  // 구분 필터 상태와 변경 함수
  selected_divisions: PostDivision[];
  on_divisions_change: (divisions: PostDivision[]) => void;
  // 대상 필터 상태와 변경 함수
  selected_targets: PostTarget[];
  on_targets_change: (targets: PostTarget[]) => void;
  // 날짜 범위 필터 상태와 변경 함수
  selected_date_range: DateRange | undefined;
  on_date_range_change: (range: DateRange | undefined) => void;
  // 선택된 게시글들에 대해 고정/해제를 수행하는 핸들러
  on_pin_selected?: () => void;
  on_unpin_selected?: () => void;
  // 선택된 게시글들에 대해 삭제를 수행하는 핸들러
  on_delete_selected?: () => void;
  // 관리자 타입 ('ga' | 'sa')
  manager_type: "ga" | "sa";
}

export default function PostFilterSection({
  search_query,
  on_search_change,
  selected_divisions,
  on_divisions_change,
  selected_targets,
  on_targets_change,
  selected_date_range,
  on_date_range_change,
  on_pin_selected,
  on_unpin_selected,
  on_delete_selected,
  manager_type,
}: PostFilterSectionProps) {
  const router = useRouter();

  // manager_type에 따른 base path 설정
  const base_path =
    manager_type === "ga"
      ? "/manager_ga/community/posts"
      : "/manager_sa/community/posts";

  // 드롭다운 열림/닫힘 상태 관리
  const [is_division_dropdown_open, set_is_division_dropdown_open] =
    useState(false);
  const [is_target_dropdown_open, set_is_target_dropdown_open] =
    useState(false);
  const division_filter_button_ref = useRef<HTMLDivElement | null>(null);
  const target_filter_button_ref = useRef<HTMLDivElement | null>(null);
  const [selected_sort, set_selected_sort] = useState("최신순");

  /* ========================================
     🔧 구분(division) 필터 관련 핸들러
     - 구분 모달 열기/적용/제거
     ======================================== */

  const handle_division_apply = (divisions: PostDivision[]) => {
    on_divisions_change(divisions);
  };

  const handle_remove_division = (division: PostDivision) => {
    on_divisions_change(selected_divisions.filter((d) => d !== division));
  };

  /* ========================================
     🎯 대상(target) 필터 관련 핸들러
     - 대상 모달 열기/적용/제거
     ======================================== */

  const handle_target_apply = (targets: PostTarget[]) => {
    on_targets_change(targets);
  };

  const handle_remove_target = (target: PostTarget) => {
    on_targets_change(selected_targets.filter((t) => t !== target));
  };

  /* ========================================
     📌 게시글 고정 / 고정 해제 액션 핸들러
     - 상단 '고정', '해제' 버튼 클릭 시
     - 부모 컴포넌트(페이지)에서 실제 is_pinned 업데이트
     ======================================== */

  // 고정 버튼 핸들러
  const handle_pin = () => {
    on_pin_selected?.();
  };

  // 해제 버튼 핸들러
  const handle_unpin = () => {
    on_unpin_selected?.();
  };

  /* ========================================
     ✏️ 수정 / 등록 / 삭제 액션 핸들러
     - 선택된 게시글 수정 (미구현)
     - 새 게시글 등록 페이지로 이동
     - 선택된 게시글 삭제 (미구현)
     ======================================== */

  // 수정 버튼 핸들러
  const handle_edit = () => {
    // TODO: 선택된 게시글 수정 기능 구현
  };

  // 등록 버튼 핸들러
  const handle_create = () => {
    // 게시글 작성 페이지로 이동
    router.push(`${base_path}/create`);
  };

  // 삭제 버튼 핸들러
  const handle_delete = () => {
    on_delete_selected?.();
  };

  /* ========================================
     🔽 정렬 / 날짜 범위 필터 관련 핸들러
     - 정렬 옵션 변경 (최신순 / 오래된순)
     - DateRangePicker로부터 날짜 범위 전달
     ======================================== */

  // 정렬 옵션
  const sort_options = ["최신순", "오래된순"];

  // 정렬 옵션 선택 핸들러
  const handle_sort_change = (sort: string) => {
    set_selected_sort(sort);
    // TODO: 정렬 로직 구현
  };

  // 날짜 범위 변경 핸들러
  // DateFilterButton에서 날짜 범위가 변경될 때 호출됩니다
  const handle_date_range_change = (range: DateRange | undefined) => {
    on_date_range_change(range);
  };

  /* ========================================
     🏷️ 활성 필터 태그(구분, 대상) 관리
     - 선택된 구분과 대상을 상단 태그로 표시
     - 태그 X 버튼 클릭 시 해당 필터 제거
     ======================================== */

  const active_filter_tags: FilterTag<string>[] = [
    ...selected_divisions.map((division) => ({
      value: division,
      label: division,
    })),
    ...selected_targets.map((target) => ({
      value: target,
      label: target,
    })),
  ];

  // 필터 태그 제거 핸들러
  const handle_filter_tag_remove = (value: string) => {
    // 구분인지 대상인지 확인
    if (selected_divisions.includes(value as PostDivision)) {
      handle_remove_division(value as PostDivision);
    } else if (selected_targets.includes(value as PostTarget)) {
      handle_remove_target(value as PostTarget);
    }
  };

  /* ========================================
     🎨 렌더링
     - BaseFilterSection 공통 컴포넌트에 필터/액션 버튼 주입
     - 구분 필터 모달(DivisionFilterModal) 렌더링
     ======================================== */

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
        // 필터 드롭다운 버튼 (구분, 대상 필터)
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
                  filter_item: filterStyles.filter_item,
                  checkbox_icon: filterStyles.checkbox_icon,
                  checkbox_icon_checked: filterButtonStyles.checkbox_icon_checked,
                  filter_text: filterStyles.filter_text,
                  dropdown_arrow: filterStyles.dropdown_arrow,
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
              ref={target_filter_button_ref}
              className={filterButtonStyles.filter_button_dropdown_wrapper}
            >
              <FilterButton
                label="대상"
                onClick={() => set_is_target_dropdown_open((prev) => !prev)}
                isActive={selected_targets.length > 0}
                styles={{
                  filter_item: filterStyles.filter_item,
                  checkbox_icon: filterStyles.checkbox_icon,
                  checkbox_icon_checked: filterButtonStyles.checkbox_icon_checked,
                  filter_text: filterStyles.filter_text,
                  dropdown_arrow: filterStyles.dropdown_arrow,
                  filter_item_active: filterButtonStyles.filter_item_active,
                  filter_text_active: filterButtonStyles.filter_text_active,
                  dropdown_arrow_active: filterButtonStyles.dropdown_arrow_active,
                }}
              />
              <TargetFilterDropdown
                is_open={is_target_dropdown_open}
                on_close={() => set_is_target_dropdown_open(false)}
                selected_targets={selected_targets}
                on_apply={handle_target_apply}
                container_ref={target_filter_button_ref}
              />
            </div>
          </>
        }
        // 검색어 필터 뒤에 오는 버튼들 (고정, 해제)
        search_after_buttons={
          on_pin_selected && on_unpin_selected ? (
            <>
              {/* 고정 버튼 */}
              <div
                key="pin"
                className={filterStyles.filter_item}
                onClick={handle_pin}
              >
                <img
                  src="/images/icons/pin_table_icon.svg"
                  alt="고정"
                  className={filterStyles.action_icon}
                />
                <span className={filterStyles.pin_action_text}>고정</span>
              </div>
              {/* 해제 버튼 */}
              <div
                key="unpin"
                className={filterStyles.filter_item}
                onClick={handle_unpin}
              >
                <img
                  src="/images/icons/pin_icon_grey.svg"
                  alt="해제"
                  className={filterStyles.action_icon}
                />
                <span className={filterStyles.pin_action_text}>해제</span>
              </div>
            </>
          ) : undefined
        }
        // 오른쪽 액션 버튼들 (등록, 삭제)
        right_buttons={
          <>
            <div
              key="create"
              className={filterStyles.filter_item}
              onClick={handle_create}
            >
              <img
                src="/images/icons/sign_plus.svg"
                alt="등록"
                className={filterStyles.action_icon}
              />
              <span className={filterStyles.post_action_text}>등록</span>
            </div>
            <div
              key="delete"
              className={filterStyles.filter_item}
              onClick={handle_delete}
            >
              <img
                src="/images/icons/sign_x.svg"
                alt="삭제"
                className={filterStyles.action_icon}
              />
              <span className={filterStyles.post_action_text}>삭제</span>
            </div>
          </>
        }
        // 활성 필터 태그들
        active_filter_tags={active_filter_tags}
        on_filter_tag_remove={handle_filter_tag_remove}
      />

      {/* 구분 필터 모달 (드롭다운으로 대체) */}
      {/* DivisionFilterModal은 드롭다운으로 대체되었습니다 */}
    </div>
  );
}
