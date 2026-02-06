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
import styles from "@/styles/manager/common/page.module.css";
import ManagerPageTitle from "@/components/manager/common/fragments/ManagerPageTitle";
import CategoryFilterSection from "@/components/manager/common/community/categories/section/CategoryFilterSection";
import CategoryTable from "@/components/manager/common/community/categories/section/CategoryTable";

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
export default function CategoriesPageCommon({
  manager_type,
}: CategoriesPageCommonProps) {
  // 검색어 상태 관리
  const [search_query, set_search_query] = useState<string>("");

  // 선택된 카테고리 ID 목록 상태 관리
  // useState: React Hook으로 컴포넌트의 선택된 카테고리 ID 목록 상태를 관리합니다
  // CategoryTable과 CategoryFilterSection에서 공유하기 위해 상위 컴포넌트에서 관리합니다
  const [selected_category_ids, set_selected_category_ids] = useState<string[]>(
    []
  );

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
        />

        {/* 카테고리 테이블 컴포넌트 */}
        <CategoryTable
          search_query={search_query}
          manager_type={manager_type}
          selected_category_ids={selected_category_ids}
          on_selected_category_ids_change={set_selected_category_ids}
        />
      </div>
    </div>
  );
}
