/* ========================================
   게시글 목록 테이블 컴포넌트
   ======================================== */
/* eslint-disable @next/next/no-img-element */

/**
 * PostTable
 *
 * 목적: GA/SA 관리자 게시글 목록 테이블 (체크박스 선택, 고정 표시, 수정)
 *
 * 사용 페이지:
 * - /manager_ga/community/posts (GA 게시글 목록)
 * - /manager_sa/community/posts (SA 게시글 목록)
 */

"use client";

import { useState } from "react";
import { useTableSort } from "@/hooks/table/useTableSort";
import type { SortColumnConfig } from "@/utils/table/sort";
import SortableTableHeader from "@/components/manager/common/table/SortableTableHeader";
import styles from "@/styles/manager/common/community/posts/post_table.module.css";
import CommonTableWithTooltip, {
  type TooltipConfig,
} from "@/components/manager/common/table/CommonTableWithTooltip";
import type { TableColumn, TableRowData } from "@/components/manager/common/table/CommonTable";
import { useRouter } from "next/navigation";
import UserTypeTag, { type UserType } from "@/components/manager/common/tags/UserTypeTag";
import type { BoardApiItem } from "@/lib/api/posts";
import {
  BOARD_DIVISION_LABEL_MAP,
  BOARD_TARGET_LABEL_MAP,
  type BoardDivision,
  type BoardTarget,
} from "@/lib/api/posts";

// 테이블 행 데이터 타입
interface PostTableRow extends TableRowData {
  id: string;
  boardId: number;
  number: string;
  division: string;
  division_label: string;
  boardCategory: string;
  target: string;
  target_label: string;
  title: string;
  viewCount: number;
  createdAt: string;
  createdBy: string;
  isFixed: boolean;
}

interface PostTableProps {
  boards: BoardApiItem[];
  selected_divisions?: BoardDivision[];
  selected_targets?: BoardTarget[];
  selected_post_ids: string[];
  on_selected_post_ids_change: (ids: string[]) => void;
  manager_type: "ga" | "sa";
}

// 컬럼 정의
const columns: TableColumn[] = [
  { key: "number", label: "번호", sortable: true, className: styles.table_cell_number },
  { key: "division", label: "구분", className: styles.table_cell_division },
  { key: "category", label: "카테고리", className: styles.table_cell_category },
  { key: "target", label: "대상", className: styles.table_cell_target },
  { key: "title", label: "제목", className: styles.table_cell_title },
  { key: "view_count", label: "조회수", sortable: true, className: styles.table_cell_view_count },
  {
    key: "registered_date",
    label: "등록일",
    sortable: true,
    className: styles.table_cell_registered_date,
  },
  { key: "registered_by", label: "등록자", className: styles.table_cell_registered_by },
  { key: "edit", label: "", className: styles.table_cell_edit },
];

// target enum → UserTypeTag 매핑
const targetToUserType: Record<string, UserType | "전체"> = {
  ALL: "전체",
  REVIEWER: "리뷰어",
  PARTNER: "파트너",
  ADMIN: "관리자",
};

export default function PostTable({
  boards = [],
  selected_divisions = [],
  selected_targets = [],
  selected_post_ids = [],
  on_selected_post_ids_change,
  manager_type,
}: PostTableProps) {
  const router = useRouter();
  const base_path =
    manager_type === "ga" ? "/manager_ga/community/posts" : "/manager_sa/community/posts";
  const [hovered_row_id, set_hovered_row_id] = useState<string | null>(null);

  // API 데이터 → 테이블 행 변환
  const rows: PostTableRow[] = boards.map((b) => ({
    id: String(b.boardId),
    boardId: b.boardId,
    number: String(b.boardId).padStart(6, "0"),
    division: b.division,
    division_label: BOARD_DIVISION_LABEL_MAP[b.division] || b.division,
    boardCategory: b.boardCategory,
    target: b.target,
    target_label: BOARD_TARGET_LABEL_MAP[b.target] || b.target,
    title: b.title,
    viewCount: b.viewCount,
    createdAt: b.createdAt,
    createdBy: b.createdBy,
    isFixed: b.isFixed,
  }));

  // 복수 필터 클라이언트 처리 (단일 필터는 서버에서 처리됨)
  const filtered_rows = rows.filter((row) => {
    if (
      selected_divisions.length > 1 &&
      !selected_divisions.includes(row.division as BoardDivision)
    ) {
      return false;
    }
    if (selected_targets.length > 1 && !selected_targets.includes(row.target as BoardTarget)) {
      return false;
    }
    return true;
  });

  const format_number = (num: number): string => num.toLocaleString();

  const column_config: SortColumnConfig = {
    number: "string",
    view_count: "number",
    registered_date: "date",
  };

  // viewCount와 createdAt을 정렬 키에 매핑
  const sortable_rows = filtered_rows.map((r) => ({
    ...r,
    view_count: r.viewCount,
    registered_date: r.createdAt,
  }));

  const {
    sort_state,
    handle_sort,
    sorted_data: sorted_posts,
  } = useTableSort<PostTableRow & { view_count: number; registered_date: string }>({
    data: sortable_rows,
    initial_column_key: "number",
    initial_direction: "desc",
    column_config,
  });

  const render_table_header = () => {
    const is_all_selected =
      sorted_posts.length > 0 && selected_post_ids.length === sorted_posts.length;

    const handle_select_all = () => {
      if (is_all_selected) {
        on_selected_post_ids_change([]);
      } else {
        on_selected_post_ids_change(sorted_posts.map((post) => post.id));
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
    overflow_selector_by_column: { title: `.${styles.title_text}` },
  };

  return (
    <CommonTableWithTooltip<PostTableRow & { view_count: number; registered_date: string }>
      columns={columns}
      data={sorted_posts}
      tooltip_config={tooltip_config}
      enable_hover={true}
      on_row_hover={(row_id) => set_hovered_row_id(row_id)}
      render_cell={(row, column) => {
        switch (column.key) {
          case "number":
            return <span>{row.number}</span>;
          case "division":
            return <span>{row.division_label}</span>;
          case "category":
            return <span>{row.boardCategory}</span>;
          case "target":
            return <UserTypeTag type={targetToUserType[row.target] || "전체"} />;
          case "title":
            return (
              <div className={styles.title_wrapper}>
                <button
                  className={styles.title_button}
                  type="button"
                  onClick={() => {}}
                  aria-label={`${row.title} 게시글 상세 보기`}
                >
                  <span className={styles.title_text}>{row.title}</span>
                  {row.isFixed && (
                    <img
                      src="/images/icons/pin_table_icon.svg"
                      alt="고정"
                      className={styles.pin_icon}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      style={{ cursor: "default" }}
                    />
                  )}
                </button>
              </div>
            );
          case "view_count":
            return <span>{format_number(row.viewCount)}</span>;
          case "registered_date":
            return <span>{row.createdAt}</span>;
          case "registered_by":
            return <span>{row.createdBy}</span>;
          case "edit": {
            const is_hovered = hovered_row_id === row.id;
            return (
              <div
                data-edit-cell="true"
                className={styles.table_cell_edit_wrapper}
                style={{ width: "100%", height: "100%", cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`${base_path}/${row.boardId}/edit`);
                }}
              >
                {is_hovered ? (
                  <button
                    className={styles.edit_button}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`${base_path}/${row.boardId}/edit`);
                    }}
                    aria-label="수정"
                  >
                    <img
                      src="/images/icons/pencil_icon.svg"
                      alt="수정"
                      className={styles.edit_icon}
                    />
                  </button>
                ) : null}
              </div>
            );
          }
          default:
            return null;
        }
      }}
      render_header={render_table_header}
      render_row_wrapper={(row, row_content) => (
        <div
          role="button"
          tabIndex={0}
          onClick={(event) => {
            const target = event.target as HTMLElement;
            const is_click_in_edit_cell =
              target.closest('[data-edit-cell="true"]') ||
              target.closest(`.${styles.table_cell_edit}`);
            if (is_click_in_edit_cell) {
              event.stopPropagation();
              return;
            }
            router.push(`${base_path}/${row.boardId}`);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              router.push(`${base_path}/${row.boardId}`);
            }
          }}
        >
          {row_content}
        </div>
      )}
      styles={styles}
      enable_checkbox={true}
      selected_ids={selected_post_ids}
      on_select_change={on_selected_post_ids_change}
      empty_message="게시글이 없습니다."
    />
  );
}
