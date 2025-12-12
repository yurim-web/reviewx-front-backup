/* ========================================
   📌 SA 관리자 카테고리 관리 페이지
   ======================================== */

/**
 * SA 관리자 카테고리 관리 페이지
 *
 * 목적: SA 관리자가 커뮤니티 카테고리 목록을 확인하고 관리할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_sa/community/categories
 *
 * 주요 기능:
 * - 필터 섹션 (구분, 검색어, 등록, 삭제)
 * - 카테고리 목록 테이블 (체크박스, 번호, 구분, 카테고리명, 수정)
 *
 * 컴포넌트 구조:
 * - CategoryFilterSection: 필터 섹션
 * - CategoryTable: 카테고리 테이블
 *
 *
 * @returns 카테고리 관리 페이지 JSX
 */

"use client";

import { useState } from "react";
import styles from "@/styles/manager_ga/community/categories/page.module.css";
import ManagerPageTitle from "@/components/manager/common/fragments/ManagerPageTitle";
import CategoryFilterSection from "@/components/manager/common/community/categories/section/CategoryFilterSection";
import CategoryTable from "@/components/manager/common/community/categories/section/CategoryTable";

export default function CategoriesPage() {
  // 검색어 상태 관리
  // useState는 React의 Hook으로, 컴포넌트의 상태를 관리합니다
  // [현재 값, 값을 변경하는 함수] 형태로 반환됩니다
  const [search_query, set_search_query] = useState<string>("");

  // 검색어 변경 핸들러
  // 화살표 함수로 이벤트 핸들러를 정의합니다
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
          manager_type="sa"
        />

        {/* 카테고리 테이블 컴포넌트 */}
        <CategoryTable search_query={search_query} manager_type="sa" />
      </div>
    </div>
  );
}

