/* ========================================
   🔍 카테고리 목록 필터 섹션 컴포넌트
   ======================================== */

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

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/manager/common/community/categories/category_filter_section.module.css";
import BaseFilterSection, {
  type FilterTag,
} from "@/components/manager/ga/common/filter/BaseFilterSection";
import type { CategoryDivision } from "@/data/manager_ga/community/categoriesData";
import DivisionFilterModal from "@/components/manager/common/community/categories/filter/DivisionFilterModal";

interface CategoryFilterSectionProps {
  // 검색어 상태를 props로 받습니다
  search_query: string;
  // 검색어 변경 핸들러를 props로 받습니다
  on_search_change: (query: string) => void;
  // manager_type: "ga" | "sa" - GA 또는 SA 관리자 구분
  manager_type: "ga" | "sa";
}

export default function CategoryFilterSection({
  search_query,
  on_search_change,
  manager_type,
}: CategoryFilterSectionProps) {
  // Next.js 라우터 사용
  // useRouter: Next.js에서 페이지 이동을 위한 Hook입니다
  const router = useRouter();

  // 구분 필터 상태 관리 (다중 선택을 위해 배열로 변경)
  // useState: React Hook으로 컴포넌트의 구분 필터 상태를 관리합니다
  // [현재 값, 값을 변경하는 함수] = useState(초기값)
  // 배열로 관리하여 여러 구분을 선택할 수 있도록 합니다
  const [selected_divisions, set_selected_divisions] = useState<
    CategoryDivision[]
  >([]);

  // 구분 필터 모달 열림/닫힘 상태 관리
  // useState: React Hook으로 모달의 열림/닫힘 상태를 관리합니다
  const [is_division_modal_open, set_is_division_modal_open] = useState(false);

  // 구분 필터 적용 핸들러
  // 화살표 함수로 이벤트 핸들러를 정의합니다
  // 선택된 구분들을 상태에 저장하고 모달을 닫습니다
  const handle_division_apply = (divisions: CategoryDivision[]) => {
    set_selected_divisions(divisions);
    set_is_division_modal_open(false);
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
    // TODO: 선택된 카테고리 삭제 기능 구현
  };

  // 활성 필터 태그 목록 생성
  // 배열 map 메서드를 사용하여 필터 태그를 생성합니다
  // selected_divisions 배열의 각 구분에 대해 필터 태그를 생성합니다
  const active_filter_tags: FilterTag<CategoryDivision>[] =
    selected_divisions.map((division) => ({
      value: division,
      label: division, // "구분: " 접두사 제거
    }));

  // 필터 태그 제거 핸들러
  // 화살표 함수로 이벤트 핸들러를 정의합니다
  // 특정 구분을 선택된 목록에서 제거합니다
  const handle_filter_tag_remove = (value: CategoryDivision) => {
    // filter 메서드: 조건에 맞는 요소만 남긴 새로운 배열을 반환합니다
    set_selected_divisions(
      selected_divisions.filter((division) => division !== value)
    );
  };

  return (
    <div>
      {/* BaseFilterSection 공통 컴포넌트 사용 */}
      <BaseFilterSection<CategoryDivision>
        search_query={search_query}
        on_search_change={on_search_change}
        // 필터 모달 버튼 (구분 필터)
        // 필터 버튼을 클릭하면 모달이 열리도록 합니다
        filter_modal_button={
          <div
            className={styles.filter_item}
            onClick={() => set_is_division_modal_open(true)}
          >
            {/* 체크박스 아이콘 */}
            <div className={styles.checkbox_icon}></div>
            {/* 필터 텍스트 */}
            <span className={styles.filter_text}>구분</span>
            {/* 드롭다운 화살표 아이콘 */}
            <img
              src="/images/icons/dropdown_arrow.svg"
              alt="드롭다운"
              className={styles.dropdown_arrow}
            />
          </div>
        }
        // 오른쪽 액션 버튼들 (등록, 삭제)
        right_buttons={
          <>
            {/* 등록 버튼 */}
            <div
              className={styles.action_button}
              onClick={handle_create}
              aria-label="카테고리 등록"
            >
              <div className={styles.action_button_icon_wrapper}>
                <img
                  src="/images/icons/sign_plus.svg"
                  alt="등록"
                  className={styles.action_button_icon}
                />
              </div>
              <span className={styles.action_button_text}>등록</span>
            </div>
            {/* 삭제 버튼 */}
            <div
              className={styles.action_button}
              onClick={handle_delete}
              aria-label="카테고리 삭제"
            >
              <div className={styles.action_button_icon_wrapper}>
                <img
                  src="/images/icons/sign_x.svg"
                  alt="삭제"
                  className={styles.action_button_icon}
                />
              </div>
              <span className={styles.action_button_text}>삭제</span>
            </div>
          </>
        }
        // 활성 필터 태그 목록
        active_filter_tags={active_filter_tags}
        // 필터 태그 제거 핸들러
        on_filter_tag_remove={handle_filter_tag_remove}
      />

      {/* 구분 필터 모달 */}
      {/* DivisionFilterModal: 구분을 선택할 수 있는 모달 컴포넌트 */}
      <DivisionFilterModal
        is_open={is_division_modal_open}
        on_close={() => set_is_division_modal_open(false)}
        selected_divisions={selected_divisions}
        on_apply={handle_division_apply}
      />
    </div>
  );
}
