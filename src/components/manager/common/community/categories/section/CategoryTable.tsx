/* ========================================
   카테고리 목록 테이블 컴포넌트
   ======================================== */
/* eslint-disable @next/next/no-img-element */

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
 * - API로 카테고리 목록 조회 (React Query)
 * - 검색어 + 구분 필터 적용
 * - 체크박스로 카테고리를 선택
 * - 행 호버 시 맨 오른쪽에 수정 버튼 표시
 */

"use client";

import { useState } from "react";
import { useTableSort } from "@/hooks/table/useTableSort";
import type { SortColumnConfig } from "@/utils/table/sort";
import SortableTableHeader from "@/components/manager/common/table/SortableTableHeader";
import styles from "@/styles/manager/common/community/categories/category_table.module.css";
import Loading from "@/app/loading";
import {
  type CategoryApiItem,
  type CategoryDivision,
  DIVISION_LABEL_MAP,
} from "@/lib/api/categories";
import { useAdminCategories } from "@/hooks/manager/ga/useAdminCategories";
import { useSAAdminCategories } from "@/hooks/manager/sa/community/useSAAdminCategories";
import type { SACategoryListParams } from "@/lib/api/sa-categories";
import CommonTableWithTooltip, {
  type TooltipConfig,
} from "@/components/manager/common/table/CommonTableWithTooltip";
import type { TableColumn, TableRowData } from "@/components/manager/common/table/CommonTable";
import { useRouter } from "next/navigation";

interface CategoryTableProps {
  search_query: string;
  manager_type: "ga" | "sa";
  selected_category_ids: string[];
  on_selected_category_ids_change: (ids: string[]) => void;
  selected_divisions: CategoryDivision[];
}

/** API 데이터를 테이블 행 형태로 변환 */
interface CategoryTableRowData extends TableRowData {
  id: string;
  categoryId: number;
  number: string;
  division: CategoryDivision;
  divisionLabel: string;
  categoryName: string;
}

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
  selected_category_ids,
  on_selected_category_ids_change,
  selected_divisions,
}: CategoryTableProps) {
  const router = useRouter();
  const [hovered_row_id, set_hovered_row_id] = useState<string | null>(null);

  const is_sa = manager_type === "sa";

  // API 파라미터 구성 (구분 필터가 1개일 때만 서버에 전달, 복수는 클라이언트 필터)
  const apiParams = selected_divisions.length === 1 ? { division: selected_divisions[0] } : {};
  const queryParams = search_query ? { ...apiParams, keyword: search_query } : apiParams;

  // GA/SA 훅 모두 무조건 호출 (React hooks 규칙) — 각 모드에서만 활성화
  const gaResult = useAdminCategories(queryParams);
  const saResult = useSAAdminCategories(queryParams as SACategoryListParams, { enabled: is_sa });
  const { data: response, isLoading } = is_sa ? saResult : gaResult;

  const categories = response?.data?.categories ?? [];

  // API 데이터 → 테이블 행 변환
  const tableRows: CategoryTableRowData[] = categories
    .filter((cat) => {
      // 복수 구분 필터 클라이언트 적용
      if (selected_divisions.length > 1 && !selected_divisions.includes(cat.division)) {
        return false;
      }
      return true;
    })
    .map((cat: CategoryApiItem) => ({
      id: String(cat.categoryId),
      categoryId: cat.categoryId,
      number: String(cat.categoryId).padStart(6, "0"),
      division: cat.division,
      divisionLabel: DIVISION_LABEL_MAP[cat.division] || cat.division,
      categoryName: cat.categoryName,
    }));

  // 컬럼별 타입 설정
  const column_config: SortColumnConfig = {
    number: "string",
  };

  const {
    sort_state,
    handle_sort,
    sorted_data: sorted_categories,
  } = useTableSort<CategoryTableRowData>({
    data: tableRows,
    initial_column_key: "number",
    initial_direction: "desc",
    column_config,
  });

  // 커스텀 헤더 렌더링
  const render_table_header = () => {
    const is_all_selected =
      sorted_categories.length > 0 && selected_category_ids.length === sorted_categories.length;

    const handle_select_all = () => {
      if (is_all_selected) {
        on_selected_category_ids_change([]);
      } else {
        const all_ids = sorted_categories.map((category) => category.id);
        on_selected_category_ids_change(all_ids);
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

  const tooltip_config: TooltipConfig = {
    column_key: "all",
    exclude_column_keys: ["edit"],
  };

  if (isLoading) return <Loading />;

  return (
    <CommonTableWithTooltip<CategoryTableRowData>
      columns={columns}
      data={sorted_categories}
      tooltip_config={tooltip_config}
      enable_hover={true}
      on_row_hover={(row_id) => {
        set_hovered_row_id(row_id);
      }}
      render_cell={(row, column) => {
        switch (column.key) {
          case "number":
            return <span>{row.number}</span>;
          case "division":
            return <span>{row.divisionLabel}</span>;
          case "category_name":
            return <span>{row.categoryName}</span>;
          case "edit":
            const is_hovered = hovered_row_id === row.id;
            return is_hovered ? (
              <button
                className={styles.edit_button}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(
                    `/manager_${manager_type}/community/categories/${row.categoryId}/edit`
                  );
                }}
                aria-label="수정"
              >
                <img src="/images/icons/pencil_icon.svg" alt="수정" className={styles.edit_icon} />
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
      on_select_change={on_selected_category_ids_change}
      empty_message="카테고리가 없습니다."
    />
  );
}
