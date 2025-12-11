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
import styles from "@/styles/manager_ga/community/posts/post_filter_section.module.css";
import BaseFilterSection, {
  type FilterTag,
} from "@/components/manager/ga/common/filter/BaseFilterSection";
import DateFilterButton from "@/components/manager/ga/common/filter/DateFilterButton";
import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";
import type { PostDivision } from "@/data/manager_ga/community/postsData";

interface PostFilterSectionProps {
  // 검색어 상태를 props로 받습니다
  search_query: string;
  // 검색어 변경 핸들러를 props로 받습니다
  on_search_change: (query: string) => void;
}

export default function PostFilterSection({
  search_query,
  on_search_change,
}: PostFilterSectionProps) {
  // 모달 열림/닫힘 상태 관리
  const [is_division_modal_open, set_is_division_modal_open] = useState(false);

  // 날짜 범위 상태
  // useState: React Hook으로 컴포넌트의 날짜 범위 상태를 관리합니다
  // [현재 값, 값을 변경하는 함수] = useState(초기값)
  // DateRange | undefined: 날짜 범위가 선택되지 않았을 수도 있으므로 undefined 허용
  const [selected_date_range, set_selected_date_range] = useState<
    DateRange | undefined
  >(undefined);

  // 선택된 필터 상태 관리
  const [selected_divisions, set_selected_divisions] = useState<PostDivision[]>(
    []
  );
  const [selected_sort, set_selected_sort] = useState("최신순");

  // 구분 필터 핸들러
  const handle_division_apply = (divisions: PostDivision[]) => {
    set_selected_divisions(divisions);
  };

  const handle_remove_division = (division: PostDivision) => {
    set_selected_divisions(selected_divisions.filter((d) => d !== division));
  };

  // 고정 버튼 핸들러
  const handle_pin = () => {
    // TODO: 선택된 게시글 고정 기능 구현
  };

  // 해제 버튼 핸들러
  const handle_unpin = () => {
    // TODO: 선택된 게시글 고정 해제 기능 구현
  };

  // 수정 버튼 핸들러
  const handle_edit = () => {
    // TODO: 선택된 게시글 수정 기능 구현
  };

  // 등록 버튼 핸들러
  const handle_create = () => {
    // TODO: 새 게시글 등록 기능 구현
  };

  // 삭제 버튼 핸들러
  const handle_delete = () => {
    // TODO: 선택된 게시글 삭제 기능 구현
  };

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
    set_selected_date_range(range);
    // TODO: 날짜 범위에 따른 필터링 로직 구현
  };

  // 활성 필터 태그 목록 생성
  const active_filter_tags: FilterTag<string>[] = selected_divisions.map(
    (division) => ({
      value: division,
      label: `구분: ${division}`,
    })
  );

  // 필터 태그 제거 핸들러
  const handle_filter_tag_remove = (value: string) => {
    handle_remove_division(value as PostDivision);
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
        // 검색어 필터 뒤에 오는 버튼들 (고정, 해제)
        search_after_buttons={
          <>
            {/* 고정 버튼 */}
            <div key="pin" className={styles.filter_item} onClick={handle_pin}>
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
        }
        // 활성 필터 태그들
        active_filter_tags={active_filter_tags}
        on_filter_tag_remove={handle_filter_tag_remove}
      />

      {/* 구분 필터 모달 - TODO: BaseFilterModal로 리팩토링 필요 */}
      {is_division_modal_open && (
        <div
          className={styles.modal_overlay}
          onClick={() => set_is_division_modal_open(false)}
        >
          <div
            className={styles.modal_content}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>구분 선택</h3>
            <div className={styles.modal_options}>
              {(["공지사항", "자주 묻는 질문", "이벤트"] as PostDivision[]).map(
                (division) => (
                  <label key={division} className={styles.modal_option}>
                    <input
                      type="checkbox"
                      checked={selected_divisions.includes(division)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          set_selected_divisions([
                            ...selected_divisions,
                            division,
                          ]);
                        } else {
                          set_selected_divisions(
                            selected_divisions.filter((d) => d !== division)
                          );
                        }
                      }}
                    />
                    <span>{division}</span>
                  </label>
                )
              )}
            </div>
            <div className={styles.modal_actions}>
              <button
                onClick={() => {
                  handle_division_apply(selected_divisions);
                  set_is_division_modal_open(false);
                }}
              >
                적용
              </button>
              <button onClick={() => set_is_division_modal_open(false)}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
