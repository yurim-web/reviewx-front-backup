/* ========================================
   카테고리 목록 필터 섹션 컴포넌트
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
 * - 구분 필터 (NOTICE/QUESTIONS)
 * - 검색어 필터
 * - 등록 버튼
 * - 삭제 버튼 (API 호출, 409 에러 시 게시글 존재 모달)
 */

"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import BaseFilterSection, {
  type FilterTag,
} from "@/components/manager/ga/common/filter/BaseFilterSection";
import BaseModal from "@/components/common/modal/BaseModal";
import FilterButton from "@/components/manager/ga/common/filter/FilterButton";
import type { CategoryDivision } from "@/lib/api/categories";
import { DIVISION_LABEL_MAP } from "@/lib/api/categories";
import { useDeleteCategory } from "@/hooks/manager/ga/useAdminCategories";
import DivisionFilterDropdown from "@/components/manager/common/community/categories/filter/DivisionFilterDropdown";
import filterStyles from "@/styles/manager/common/section/filter_section.module.css";
import filterButtonStyles from "@/styles/manager_ga/common/filter/filter_button.module.css";

interface CategoryFilterSectionProps {
  search_query: string;
  on_search_change: (query: string) => void;
  manager_type: "ga" | "sa";
  selected_category_ids: string[];
  selected_divisions: CategoryDivision[];
  on_divisions_change: (divisions: CategoryDivision[]) => void;
  on_delete_complete?: () => void;
}

export default function CategoryFilterSection({
  search_query,
  on_search_change,
  manager_type,
  selected_category_ids,
  selected_divisions,
  on_divisions_change,
  on_delete_complete,
}: CategoryFilterSectionProps) {
  const router = useRouter();
  const deleteMutation = useDeleteCategory();

  const [is_division_dropdown_open, set_is_division_dropdown_open] = useState(false);
  const division_filter_button_ref = useRef<HTMLDivElement>(null);

  // 게시글 존재 모달 (409 CATEGORY_HAS_BOARDS)
  const [is_post_exists_modal_open, set_is_post_exists_modal_open] = useState(false);

  // 삭제 확인 모달
  const [is_delete_confirm_modal_open, set_is_delete_confirm_modal_open] = useState(false);

  const handle_division_apply = (divisions: CategoryDivision[]) => {
    on_divisions_change(divisions);
  };

  const handle_create = () => {
    router.push(`/manager_${manager_type}/community/categories/create`);
  };

  const handle_delete = () => {
    if (selected_category_ids.length === 0) return;
    set_is_delete_confirm_modal_open(true);
  };

  /** 삭제 확인 → API 순차 호출 */
  const handle_delete_confirm = async () => {
    set_is_delete_confirm_modal_open(false);

    for (const id of selected_category_ids) {
      try {
        await deleteMutation.mutateAsync(Number(id));
      } catch (error) {
        const status = (error as { response?: { status?: number } })?.response?.status;
        if (status === 409) {
          // 게시글이 존재하는 카테고리
          set_is_post_exists_modal_open(true);
          return;
        }
        // 다른 에러는 무시하고 계속 진행
      }
    }
    on_delete_complete?.();
  };

  // 활성 필터 태그 목록
  const active_filter_tags: FilterTag<CategoryDivision>[] = selected_divisions.map((division) => ({
    value: division,
    label: DIVISION_LABEL_MAP[division] || division,
  }));

  const handle_filter_tag_remove = (value: CategoryDivision) => {
    on_divisions_change(selected_divisions.filter((division) => division !== value));
  };

  return (
    <div>
      <BaseFilterSection<CategoryDivision>
        search_query={search_query}
        on_search_change={on_search_change}
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
        right_buttons={
          <>
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
        active_filter_tags={active_filter_tags}
        on_filter_tag_remove={handle_filter_tag_remove}
      />

      {/* 게시글 존재 모달 (409 CATEGORY_HAS_BOARDS) */}
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
