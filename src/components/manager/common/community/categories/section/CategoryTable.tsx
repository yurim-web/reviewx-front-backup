/* ========================================
   📋 카테고리 목록 테이블 컴포넌트
   ======================================== */

/**
 * 카테고리 목록 테이블 컴포넌트
 *
 * 목적: 관리자 카테고리 관리 페이지의 카테고리 목록을 테이블 형태로 표시합니다.
 *
 * 사용 위치:
 * - /manager_ga/community/categories (GA 관리자 카테고리 관리 페이지)
 * - /manager_sa/community/categories (SA 관리자 카테고리 관리 페이지)
 *
 * 주요 기능:
 * - 카테고리 목록을 테이블로 표시합니다
 * - 검색어 필터를 적용합니다
 * - 체크박스로 카테고리를 선택할 수 있습니다
 * - 구분을 일반 텍스트로 표시합니다
 * - 행 호버 시 맨 오른쪽에 수정 버튼이 나타납니다
 *
 */

"use client";

import { useState } from "react";
import { useTableSort } from "@/hooks/table/useTableSort";
import type { SortColumnConfig } from "@/utils/table/sort";
import SortableTableHeader from "@/components/manager/common/table/SortableTableHeader";
import styles from "@/styles/manager/common/community/categories/category_table.module.css";
import {
  categories_data,
  type CategoryItem,
} from "@/data/manager_ga/community/categoriesData";
import CommonTable, {
  type TableColumn,
  type TableRowData,
} from "@/components/manager/common/table/CommonTable";
import { useRouter } from "next/navigation";

interface CategoryTableProps {
  search_query: string;
  // manager_type: "ga" | "sa" - GA 또는 SA 관리자 구분
  manager_type: "ga" | "sa";
}

// CategoryItem이 TableRowData를 확장하도록 확장
interface CategoryTableRowData extends CategoryItem, TableRowData {}

// 컬럼 정의 (기획 순서: 체크박스 | 번호 | 구분 | 카테고리명 | 수정)
const columns: TableColumn[] = [
  {
    key: "number",
    label: "번호",
    sortable: true,
    className: styles.table_cell_number,
  },
  {
    key: "division",
    label: "구분",
    className: styles.table_cell_division,
  },
  {
    key: "category_name",
    label: "카테고리명",
    className: styles.table_cell_category_name,
  },
  {
    key: "edit",
    label: "",
    className: styles.table_cell_edit,
  },
];

export default function CategoryTable({
  search_query,
  manager_type,
}: CategoryTableProps) {
  // Next.js 라우터: 수정 페이지로 이동에 사용
  // useRouter: Next.js에서 페이지 이동을 위한 Hook입니다
  const router = useRouter();

  // 선택된 카테고리 ID 목록 상태 관리
  // useState: React Hook으로 컴포넌트의 선택된 카테고리 ID 목록 상태를 관리합니다
  const [selected_category_ids, set_selected_category_ids] = useState<string[]>(
    []
  );

  // 호버된 행 ID 상태 관리
  // useState: React Hook으로 컴포넌트의 호버된 행 ID 상태를 관리합니다
  const [hovered_row_id, set_hovered_row_id] = useState<string | null>(null);

  // 검색어로 카테고리 필터링
  // 배열 filter 메서드를 사용하여 검색어에 맞는 카테고리만 필터링합니다
  const filtered_categories = categories_data.filter((item) => {
    if (!search_query) return true;
    // 검색어가 카테고리명 또는 구분에 포함되어 있는지 확인합니다
    return (
      item.category_name.toLowerCase().includes(search_query.toLowerCase()) ||
      item.division.toLowerCase().includes(search_query.toLowerCase())
    );
  });

  // 컬럼별 타입 설정
  // SortColumnConfig: 정렬 가능한 컬럼의 타입을 정의합니다
  const column_config: SortColumnConfig = {
    number: "string",
  };

  // 정렬 훅 사용
  // useTableSort: 테이블 정렬 기능을 제공하는 커스텀 Hook입니다
  const {
    sort_state,
    handle_sort,
    sorted_data: sorted_categories,
  } = useTableSort<CategoryTableRowData>({
    data: filtered_categories,
    initial_column_key: "number",
    initial_direction: "asc",
    column_config,
  });

  // 커스텀 헤더 렌더링 (SortableTableHeader 공통 컴포넌트 사용)
  const render_table_header = () => {
    // 전체 선택 여부 확인
    // 배열 length 속성을 사용하여 전체 개수를 확인합니다
    const is_all_selected =
      sorted_categories.length > 0 &&
      selected_category_ids.length === sorted_categories.length;

    // 전체 선택/해제 핸들러
    // 화살표 함수로 이벤트 핸들러를 정의합니다
    const handle_select_all = () => {
      if (is_all_selected) {
        // 전체 해제: 빈 배열로 설정
        set_selected_category_ids([]);
      } else {
        // 전체 선택: 모든 카테고리 ID를 배열로 설정
        // 배열 map 메서드를 사용하여 모든 카테고리의 ID를 추출합니다
        const all_ids = sorted_categories.map((category) => category.id);
        set_selected_category_ids(all_ids);
      }
    };

    return (
      <SortableTableHeader
        columns={columns}
        sort_state={sort_state}
        handle_sort={handle_sort}
        handle_select_all={handle_select_all}
        is_all_selected={is_all_selected}
        styles={styles}
        use_header_row={false}
      />
    );
  };

  return (
    <CommonTable<CategoryTableRowData>
      columns={columns}
      data={sorted_categories}
      enable_hover={true}
      on_row_hover={(row_id) => {
        set_hovered_row_id(row_id);
      }}
      render_cell={(row, column) => {
        // switch 문: 컬럼 키에 따라 다른 내용을 렌더링합니다
        switch (column.key) {
          case "number":
            // 번호는 일반 텍스트로 표시
            return <span>{row.number}</span>;
          case "division":
            // 구분은 일반 텍스트로 표시
            return <span>{row.division}</span>;
          case "category_name":
            // 카테고리명은 일반 텍스트로 표시
            return <span>{row.category_name}</span>;
          case "edit":
            // 호버된 행에만 수정 버튼 표시
            // 삼항 연산자를 사용하여 조건부 렌더링을 수행합니다
            const is_hovered = hovered_row_id === row.id;
            return is_hovered ? (
              <button
                className={styles.edit_button}
                onClick={(e) => {
                  // 이벤트 전파를 막아서 행 클릭 이벤트가 발생하지 않도록 함
                  // stopPropagation: 이벤트 버블링을 방지합니다
                  e.stopPropagation();
                  // 카테고리 수정 페이지로 이동
                  // router.push: Next.js에서 페이지를 이동하는 메서드입니다
                  router.push(
                    `/manager_${manager_type}/community/categories/${row.id}/edit`
                  );
                }}
                aria-label="수정"
              >
                <img
                  src="/images/icons/pencil_icon.svg"
                  alt="수정"
                  className={styles.edit_icon}
                />
              </button>
            ) : null;
          default:
            return null;
        }
      }}
      render_header={render_table_header}
      styles={styles}
      enable_checkbox={true}
      selected_ids={selected_category_ids}
      on_select_change={set_selected_category_ids}
      empty_message="카테고리가 없습니다."
    />
  );
}
