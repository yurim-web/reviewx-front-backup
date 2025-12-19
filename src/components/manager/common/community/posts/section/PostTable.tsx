/* ========================================
   📋 게시글 목록 테이블 컴포넌트
   ======================================== */

/**
 * 게시글 목록 테이블 컴포넌트
 *
 * 목적: 관리자 게시글 목록 페이지의 게시글 목록을 테이블 형태로 표시합니다.
 *
 * 사용 위치:
 * - /manager_ga/community/posts (GA 관리자 게시글 목록 페이지)
 * - /manager_sa/community/posts (SA 관리자 게시글 목록 페이지)
 *
 * 주요 기능:
 * - 게시글 목록을 테이블로 표시합니다
 * - 검색어 필터를 적용합니다
 * - 체크박스로 게시글을 선택할 수 있습니다
 * - 구분과 카테고리를 일반 텍스트로 표시합니다
 * - 대상(리뷰어/파트너/관리자/전체) 태그를 표시합니다
 * - 고정된 게시글은 제목 옆에 고정 아이콘을 표시합니다
 * - 행 호버 시 맨 오른쪽에 수정 버튼이 나타납니다
 * - 조회수를 천 단위로 포맷팅하여 표시합니다
 *
 */

"use client";

import { useState } from "react";
import { useTableSort } from "@/hooks/table/useTableSort";
import type { SortColumnConfig } from "@/utils/table/sort";
import SortableTableHeader from "@/components/manager/common/table/SortableTableHeader";
import styles from "@/styles/manager_ga/community/posts/post_table.module.css";
import {
  posts_data,
  type PostItem,
} from "@/data/manager_ga/community/postsData";
import CommonTable, {
  type TableColumn,
  type TableRowData,
} from "@/components/manager/common/table/CommonTable";
import { useRouter } from "next/navigation";
import UserTypeTag, {
  type UserType,
} from "@/components/manager/common/tags/UserTypeTag";
import type { PostDivision } from "@/data/manager_ga/community/postsData";
import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";

interface PostTableProps {
  search_query: string;
  selected_divisions?: PostDivision[];
  selected_date_range?: DateRange | undefined;
  posts: PostItem[];
  selected_post_ids: string[];
  on_selected_post_ids_change: (ids: string[]) => void;
}

// PostItem이 TableRowData를 확장하도록 확장
interface PostTableRowData extends PostItem, TableRowData {}

// 컬럼 정의 (기획 순서: 체크박스 | 구분 | 카테고리 | 대상 | 제목 | 조회수 | 등록일 | 등록자 | 수정)
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
    key: "category",
    label: "카테고리",
    className: styles.table_cell_category,
  },
  {
    key: "target",
    label: "대상",
    className: styles.table_cell_target,
  },
  {
    key: "title",
    label: "제목",
    className: styles.table_cell_title,
  },
  {
    key: "view_count",
    label: "조회수",
    sortable: true,
    className: styles.table_cell_view_count,
  },
  {
    key: "registered_date",
    label: "등록일",
    sortable: true,
    className: styles.table_cell_registered_date,
  },
  {
    key: "registered_by",
    label: "등록자",
    className: styles.table_cell_registered_by,
  },
  {
    key: "edit",
    label: "",
    className: styles.table_cell_edit,
  },
];

export default function PostTable({
  search_query,
  selected_divisions = [],
  selected_date_range,
  posts = [],
  selected_post_ids = [],
  on_selected_post_ids_change,
}: PostTableProps) {
  const router = useRouter();
  const [hovered_row_id, set_hovered_row_id] = useState<string | null>(null);

  const filtered_posts = posts.filter((item) => {
    // 검색어 필터
    if (search_query) {
      const query = search_query.toLowerCase();
      if (!item.title.toLowerCase().includes(query)) {
        return false;
      }
    }

    // 구분 필터
    if (
      selected_divisions.length > 0 &&
      !selected_divisions.includes(item.division)
    ) {
      return false;
    }

    // 날짜 범위 필터
    if (selected_date_range?.from && selected_date_range?.to) {
      // registered_date 형식: "2025-08-01 18:56"
      const registered_date_str = item.registered_date.split(" ")[0]; // 날짜 부분만 추출
      const registered_date = new Date(registered_date_str);
      const from_date = new Date(selected_date_range.from);
      const to_date = new Date(selected_date_range.to);
      to_date.setHours(23, 59, 59, 999); // 종료일의 끝 시간까지 포함

      // 날짜 비교 시 시간 부분을 제거하여 날짜만 비교
      registered_date.setHours(0, 0, 0, 0);
      from_date.setHours(0, 0, 0, 0);

      if (registered_date < from_date || registered_date > to_date) {
        return false;
      }
    }

    return true;
  });

  const format_number = (num: number): string => {
    return num.toLocaleString();
  };

  // 컬럼별 타입 설정
  const column_config: SortColumnConfig = {
    number: "string",
    view_count: "number",
    registered_date: "date",
  };

  // 정렬 훅 사용
  const {
    sort_state,
    handle_sort,
    sorted_data: sorted_posts,
  } = useTableSort<PostTableRowData>({
    data: filtered_posts,
    initial_column_key: "number",
    initial_direction: "asc",
    column_config,
  });

  // 커스텀 헤더 렌더링 (SortableTableHeader 공통 컴포넌트 사용)
  const render_table_header = () => {
    const is_all_selected =
      sorted_posts.length > 0 &&
      selected_post_ids.length === sorted_posts.length;

    const handle_select_all = () => {
      if (is_all_selected) {
        on_selected_post_ids_change([]);
      } else {
        const all_ids = sorted_posts.map((post) => post.id);
        on_selected_post_ids_change(all_ids);
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
    <CommonTable<PostTableRowData>
      columns={columns}
      data={sorted_posts}
      enable_hover={true}
      on_row_hover={(row_id) => {
        set_hovered_row_id(row_id);
      }}
      render_cell={(row, column) => {
        switch (column.key) {
          case "number":
            return <span>{row.number}</span>;
          case "division":
            // 구분은 일반 텍스트로 표시 (태그 스타일 제거)
            return <span>{row.division}</span>;
          case "category":
            // 카테고리는 일반 텍스트로 표시 (태그 스타일 제거)
            return <span>{row.category}</span>;
          case "target":
            return (
              <UserTypeTag
                type={row.target as UserType | "전체"}
                styles={styles}
              />
            );
          case "title":
            // 제목과 고정 아이콘을 함께 표시
            // 제목 클릭 시 상세 페이지로 이동
            return (
              <div className={styles.title_wrapper}>
                <button
                  className={styles.title_button}
                  onClick={(e) => {
                    // 이벤트 전파를 막아서 행 클릭 이벤트가 발생하지 않도록 함
                    e.stopPropagation();
                    // 게시글 상세 페이지로 이동
                    router.push(`/manager_ga/community/posts/${row.id}`);
                  }}
                  aria-label={`${row.title} 게시글 상세 보기`}
                >
                  <span className={styles.title_text}>{row.title}</span>
                  {/* 고정된 게시글인 경우 제목 바로 옆에 고정 아이콘 표시 */}
                  {row.is_pinned && (
                    <img
                      src="/images/icons/pin_table_icon.svg"
                      alt="고정"
                      className={styles.pin_icon}
                    />
                  )}
                </button>
              </div>
            );
          case "view_count":
            return <span>{format_number(row.view_count)}</span>;
          case "registered_date":
            return <span>{row.registered_date}</span>;
          case "registered_by":
            return <span>{row.registered_by}</span>;
          case "edit":
            // 호버된 행에만 수정 버튼 표시
            const is_hovered = hovered_row_id === row.id;
            return (
              <div
                data-edit-cell="true"
                style={{ width: "100%", height: "100%" }}
              >
                {is_hovered ? (
                  <button
                    className={styles.edit_button}
                    onClick={(e) => {
                      // 이벤트 전파를 막아서 행 클릭 이벤트가 발생하지 않도록 함
                      e.stopPropagation();
                      // 게시글 수정 페이지로 이동
                      router.push(`/manager_ga/community/posts/${row.id}/edit`);
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

            // 수정 컬럼 영역(data-edit-cell 또는 table_cell_edit) 클릭 시 상세 페이지로 이동하지 않음
            const is_click_in_edit_cell =
              target.closest('[data-edit-cell="true"]') ||
              target.closest(`.${styles.table_cell_edit}`);

            if (is_click_in_edit_cell) {
              event.stopPropagation();
              return;
            }

            router.push(`/manager_ga/community/posts/${row.id}`);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              router.push(`/manager_ga/community/posts/${row.id}`);
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
