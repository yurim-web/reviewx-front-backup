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

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/manager/common/community/posts/post_filter_section.module.css";
import BaseFilterSection, {
  type FilterTag,
} from "@/components/manager/ga/common/filter/BaseFilterSection";
import DateFilterButton from "@/components/manager/ga/common/filter/DateFilterButton";
import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";
import type { PostDivision } from "@/data/manager_ga/community/postsData";
import DivisionFilterModal from "@/components/manager/common/community/posts/filter/DivisionFilterModal";

interface PostFilterSectionProps {
  // 검색어 상태를 props로 받습니다
  search_query: string;
  // 검색어 변경 핸들러를 props로 받습니다
  on_search_change: (query: string) => void;
  // 구분 필터 상태와 변경 함수
  selected_divisions: PostDivision[];
  on_divisions_change: (divisions: PostDivision[]) => void;
  // 날짜 범위 필터 상태와 변경 함수
  selected_date_range: DateRange | undefined;
  on_date_range_change: (range: DateRange | undefined) => void;
  // 선택된 게시글들에 대해 고정/해제를 수행하는 핸들러 (GA만 사용)
  on_pin_selected?: () => void;
  on_unpin_selected?: () => void;
  // 관리자 타입 ('ga' | 'sa')
  manager_type: "ga" | "sa";
}

export default function PostFilterSection({
  search_query,
  on_search_change,
  selected_divisions,
  on_divisions_change,
  selected_date_range,
  on_date_range_change,
  on_pin_selected,
  on_unpin_selected,
  manager_type,
}: PostFilterSectionProps) {
  const router = useRouter();

  // manager_type에 따른 base path 설정
  const base_path =
    manager_type === "ga"
      ? "/manager_ga/community/posts"
      : "/manager_sa/community/posts";

  // 모달 열림/닫힘 상태 관리
  const [is_division_modal_open, set_is_division_modal_open] = useState(false);
  const [selected_sort, set_selected_sort] = useState("최신순");

  /* ========================================
     🔧 구분(division) 필터 관련 핸들러
     - 구분 모달 열기/적용/제거
     ======================================== */

  const handle_division_apply = (divisions: PostDivision[]) => {
    on_divisions_change(divisions);
    set_is_division_modal_open(false);
  };

  const handle_remove_division = (division: PostDivision) => {
    on_divisions_change(selected_divisions.filter((d) => d !== division));
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
    // TODO: 선택된 게시글 삭제 기능 구현
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
     🏷️ 활성 필터 태그(구분) 관리
     - 선택된 구분들을 상단 태그로 표시
     - 태그 X 버튼 클릭 시 해당 구분 필터 제거
     ======================================== */

  const active_filter_tags: FilterTag<string>[] = selected_divisions.map(
    (division) => ({
      value: division,
      label: division,
    })
  );

  // 필터 태그 제거 핸들러
  const handle_filter_tag_remove = (value: string) => {
    handle_remove_division(value as PostDivision);
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
        // 필터 모달 버튼 (구분 필터만)
        filter_modal_button={
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
        }
        // 검색어 필터 뒤에 오는 버튼들 (고정, 해제) - GA만 사용
        search_after_buttons={
          manager_type === "ga" && on_pin_selected && on_unpin_selected ? (
            <>
              {/* 고정 버튼 */}
              <div
                key="pin"
                className={styles.filter_item}
                onClick={handle_pin}
              >
                <img
                  src="/images/icons/pin_icon_black.svg"
                  alt="고정"
                  className={styles.action_icon}
                />
                <span className={styles.filter_text}>고정</span>
              </div>
              {/* 해제 버튼 */}
              <div
                key="unpin"
                className={styles.filter_item}
                onClick={handle_unpin}
              >
                <img
                  src="/images/icons/pin_icon_grey.svg"
                  alt="해제"
                  className={styles.action_icon}
                />
                <span className={styles.filter_text}>해제</span>
              </div>
            </>
          ) : undefined
        }
        // 오른쪽 액션 버튼들 (등록, 삭제)
        right_buttons={
          <>
            <div
              key="create"
              className={styles.filter_item}
              onClick={handle_create}
            >
              <img
                src="/images/icons/sign_plus.svg"
                alt="등록"
                className={styles.action_icon}
              />
              <span className={styles.filter_text}>등록</span>
            </div>
            <div
              key="delete"
              className={styles.filter_item}
              onClick={handle_delete}
            >
              <img
                src="/images/icons/sign_x.svg"
                alt="삭제"
                className={styles.action_icon}
              />
              <span className={styles.filter_text}>삭제</span>
            </div>
          </>
        }
        // 활성 필터 태그들
        active_filter_tags={active_filter_tags}
        on_filter_tag_remove={handle_filter_tag_remove}
      />

      {/* 구분 필터 모달 */}
      <DivisionFilterModal
        is_open={is_division_modal_open}
        on_close={() => set_is_division_modal_open(false)}
        selected_divisions={selected_divisions}
        on_apply={handle_division_apply}
      />
    </div>
  );
}
