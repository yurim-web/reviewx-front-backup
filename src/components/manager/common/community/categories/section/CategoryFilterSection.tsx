/* ========================================
   🔍 카테고리 목록 필터 섹션 컴포넌트
   ======================================== */
/* eslint-disable @next/next/no-img-element */

/**
 * 카테고리 목록 필터 섹션 컴포넌트
 *
 * 목적: 카테고리 목록을 필터링하기 위한 필터 버튼들을 표시하는 섹션입니다.
 *
 * 사용 페이지:
 * - /manager_ga/community/categories (GA 관리자 카테고리 관리 페이지)
 * - /manager_sa/community/categories (SA 관리자 카테고리 관리 페이지)
 *
 * 주요 기능:
 * - 구분 필터 (공지사항/자주 묻는 질문/이벤트)
 * - 검색어 필터
 * - 등록 버튼
 * - 삭제 버튼
 *
 */

"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import BaseFilterSection, {
  type FilterTag,
} from "@/components/manager/ga/common/filter/BaseFilterSection";
import BaseModal from "@/components/common/modal/BaseModal";
import FilterButton from "@/components/manager/ga/common/filter/FilterButton";
import type { CategoryDivision } from "@/data/manager_ga/community/categoriesData";
import { categories_data, delete_categories } from "@/data/manager_ga/community/categoriesData";
import { posts_data, initialize_posts_data } from "@/data/manager_ga/community/postsData";
import DivisionFilterDropdown from "@/components/manager/common/community/categories/filter/DivisionFilterDropdown";
import filterStyles from "@/styles/manager/common/section/filter_section.module.css";
import filterButtonStyles from "@/styles/manager_ga/common/filter/filter_button.module.css";

interface CategoryFilterSectionProps {
  // 검색어 상태를 props로 받습니다
  search_query: string;
  // 검색어 변경 핸들러를 props로 받습니다
  on_search_change: (query: string) => void;
  // manager_type: "ga" | "sa" - GA 또는 SA 관리자 구분
  manager_type: "ga" | "sa";
  // selected_category_ids: 선택된 카테고리 ID 목록
  selected_category_ids: string[];
  // selected_divisions: 상위 컴포넌트에서 관리하는 구분 필터 상태
  selected_divisions: CategoryDivision[];
  // on_divisions_change: 구분 필터 변경 시 상위 컴포넌트에 알리는 핸들러
  on_divisions_change: (divisions: CategoryDivision[]) => void;
}

export default function CategoryFilterSection({
  search_query,
  on_search_change,
  manager_type,
  selected_category_ids,
  selected_divisions,
  on_divisions_change,
}: CategoryFilterSectionProps) {
  // Next.js 라우터 사용
  // useRouter: Next.js에서 페이지 이동을 위한 Hook입니다
  const router = useRouter();

  // 구분 필터 드롭다운 열림/닫힘 상태 관리
  const [is_division_dropdown_open, set_is_division_dropdown_open] = useState(false);
  const division_filter_button_ref = useRef<HTMLDivElement>(null);

  // 게시글 존재 모달 열림/닫힘 상태 관리
  // useState: React Hook으로 게시글 존재 모달의 열림/닫힘 상태를 관리합니다
  const [is_post_exists_modal_open, set_is_post_exists_modal_open] = useState(false);

  // 삭제 확인 모달 열림/닫힘 상태 관리
  const [is_delete_confirm_modal_open, set_is_delete_confirm_modal_open] = useState(false);

  // 구분 필터 적용 핸들러 — 상위 컴포넌트로 전달
  const handle_division_apply = (divisions: CategoryDivision[]) => {
    on_divisions_change(divisions);
  };

  // 등록 버튼 핸들러
  // 화살표 함수로 이벤트 핸들러를 정의합니다
  // 카테고리 등록 페이지로 이동합니다
  const handle_create = () => {
    // router.push: Next.js에서 페이지를 이동하는 메서드입니다
    router.push(`/manager_${manager_type}/community/categories/create`);
  };

  // 삭제 버튼 핸들러
  // 화살표 함수로 이벤트 핸들러를 정의합니다
  const handle_delete = () => {
    // 선택된 카테고리가 없으면 삭제할 수 없습니다
    if (selected_category_ids.length === 0) {
      return;
    }

    // 게시글 데이터를 최신 상태로 업데이트
    // initialize_posts_data: localStorage에서 최신 게시글 데이터를 불러옵니다
    initialize_posts_data();

    // 선택된 카테고리들 중에 게시글이 있는지 확인
    // find(): 배열에서 조건에 맞는 첫 번째 요소를 찾습니다
    // some(): 배열의 요소 중 하나라도 조건을 만족하면 true를 반환합니다
    const has_posts = selected_category_ids.some((category_id) => {
      // 카테고리 ID로 카테고리 정보 찾기
      const category = categories_data.find((item) => item.id === category_id);
      if (!category) return false;

      // 해당 카테고리명과 구분을 가진 게시글이 있는지 확인
      // posts_data에서 category 필드가 카테고리명과 일치하는 게시글을 찾습니다
      const post_exists = posts_data.some(
        (post) => post.category === category.category_name && post.division === category.division
      );

      return post_exists;
    });

    // 게시글이 있으면 삭제 불가 모달 표시
    if (has_posts) {
      set_is_post_exists_modal_open(true);
      return;
    }

    // 게시글이 없으면 삭제 확인 모달 표시
    set_is_delete_confirm_modal_open(true);
  };

  // 삭제 확인 핸들러
  const handle_delete_confirm = () => {
    // delete_categories: 선택된 카테고리들을 삭제하는 함수입니다
    delete_categories(selected_category_ids);
    // 삭제 후 페이지 새로고침하여 업데이트된 목록 표시
    // window.location.reload(): 페이지를 새로고침합니다
    window.location.reload();
  };

  // 활성 필터 태그 목록 생성
  // 배열 map 메서드를 사용하여 필터 태그를 생성합니다
  // selected_divisions 배열의 각 구분에 대해 필터 태그를 생성합니다
  const active_filter_tags: FilterTag<CategoryDivision>[] = selected_divisions.map((division) => ({
    value: division,
    label: division, // "구분: " 접두사 제거
  }));

  // 필터 태그 제거 핸들러 — 상위 컴포넌트로 전달
  const handle_filter_tag_remove = (value: CategoryDivision) => {
    on_divisions_change(selected_divisions.filter((division) => division !== value));
  };

  return (
    <div>
      {/* BaseFilterSection 공통 컴포넌트 사용 */}
      <BaseFilterSection<CategoryDivision>
        search_query={search_query}
        on_search_change={on_search_change}
        // 필터 드롭다운 버튼 (구분 필터)
        filter_modal_button={
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
        }
        // 오른쪽 액션 버튼들 (등록, 삭제)
        right_buttons={
          <>
            {/* 등록 버튼 */}
            <div
              className={filterStyles.filter_item}
              onClick={handle_create}
              aria-label="카테고리 등록"
            >
              <img
                src="/images/icons/sign_plus.svg"
                alt="등록"
                className={filterStyles.action_icon}
              />
              <span className={filterStyles.post_action_text}>등록</span>
            </div>
            {/* 삭제 버튼 */}
            <div
              className={filterStyles.filter_item}
              onClick={handle_delete}
              aria-label="카테고리 삭제"
            >
              <img src="/images/icons/sign_x.svg" alt="삭제" className={filterStyles.action_icon} />
              <span className={filterStyles.post_action_text}>삭제</span>
            </div>
          </>
        }
        // 활성 필터 태그 목록
        active_filter_tags={active_filter_tags}
        // 필터 태그 제거 핸들러
        on_filter_tag_remove={handle_filter_tag_remove}
      />

      {/* 구분 필터 모달 (드롭다운으로 대체) */}
      {/* DivisionFilterModal은 드롭다운으로 대체되었습니다 */}

      {/* 게시글 존재 모달 */}
      {/* BaseModal: 게시글이 등록된 상태에서는 삭제할 수 없다는 메시지를 표시하는 모달 */}
      <BaseModal
        is_open={is_post_exists_modal_open}
        on_close={() => set_is_post_exists_modal_open(false)}
        message="게시글이 등록된 상태에서는 삭제할 수 없습니다.<br>게시글을 삭제한 후 진행해 주세요."
        buttons={["닫기"]}
      />

      {/* 삭제 확인 모달 */}
      <BaseModal
        is_open={is_delete_confirm_modal_open}
        on_close={() => set_is_delete_confirm_modal_open(false)}
        message="선택한 내역을 삭제하시겠습니까?"
        buttons={["취소", "확인"]}
        on_cancel={() => set_is_delete_confirm_modal_open(false)}
        on_confirm={handle_delete_confirm}
      />
    </div>
  );
}
