/* ========================================
   📝 관리자 카테고리 관리 페이지 (공통 컴포넌트)
   ======================================== */

/**
 * 관리자 카테고리 관리 페이지 (공통 컴포넌트)
 *
 * 목적: GA/SA 관리자 카테고리 관리 페이지에서 공통으로 사용하는 페이지 컴포넌트입니다.
 *
 * 두 가지 사용 위치:
 * - /manager_ga/community/categories (GA 관리자 카테고리 관리 페이지)
 * - /manager_sa/community/categories (SA 관리자 카테고리 관리 페이지)
 */

"use client";

import { useState } from "react";
import styles from "@/styles/manager/common/manager_common_page.module.css";
import ManagerPageTitle from "@/components/manager/common/fragments/ManagerPageTitle";
import CategoryFilterSection from "@/components/manager/common/community/categories/section/CategoryFilterSection";
import CategoryTable from "@/components/manager/common/community/categories/section/CategoryTable";
import type { CategoryDivision } from "@/data/manager_ga/community/categoriesData";

// 관리자 타입 정의
export type ManagerType = "ga" | "sa";

/**
 * CategoriesPageCommon 컴포넌트의 Props 타입 정의
 *
 * @property manager_type - 관리자 타입 ('ga' | 'sa')
 */
interface CategoriesPageCommonProps {
  manager_type: ManagerType;
}

/**
 * 관리자 카테고리 관리 페이지 공통 컴포넌트
 *
 * @param props - CategoriesPageCommonProps 객체
 * @param props.manager_type - 관리자 타입 ('ga' 또는 'sa')
 * @returns 카테고리 관리 페이지 JSX 요소
 */
export default function CategoriesPageCommon({ manager_type }: CategoriesPageCommonProps) {
  // 검색어 상태 관리
  const [search_query, set_search_query] = useState<string>("");

  // 선택된 카테고리 ID 목록 상태 관리
  const [selected_category_ids, set_selected_category_ids] = useState<string[]>([]);

  // 구분 필터 상태 관리 (CategoryFilterSection → CategoryTable로 공유하기 위해 상위에서 관리)
  const [selected_divisions, set_selected_divisions] = useState<CategoryDivision[]>([]);

  // 삭제 후 리프레시를 위한 카운터
  const [refresh_key, set_refresh_key] = useState(0);

  // 삭제 완료 콜백
  const handle_delete_complete = () => {
    set_selected_category_ids([]);
    set_refresh_key((prev) => prev + 1);
  };

  // 검색어 변경 핸들러
  const handle_search_change = (query: string) => {
    set_search_query(query);
  };

  return (
    <div className={styles.container}>
      <div className={styles.main_content}>
        {/* 페이지 제목 */}
        <ManagerPageTitle title="카테고리 관리" />

        {/* 필터 섹션 컴포넌트 */}
        <CategoryFilterSection
          search_query={search_query}
          on_search_change={handle_search_change}
          manager_type={manager_type}
          selected_category_ids={selected_category_ids}
          selected_divisions={selected_divisions}
          on_divisions_change={set_selected_divisions}
          on_delete_complete={handle_delete_complete}
        />

        {/* 카테고리 테이블 컴포넌트 */}
        <CategoryTable
          key={refresh_key}
          search_query={search_query}
          manager_type={manager_type}
          selected_category_ids={selected_category_ids}
          on_selected_category_ids_change={set_selected_category_ids}
          selected_divisions={selected_divisions}
        />
      </div>
    </div>
  );
}
