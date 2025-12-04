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
 * - 구분 태그를 표시합니다 (공지사항/자주 묻는 질문/이벤트)
 * - 카테고리 태그를 표시합니다
 * - 조회수를 천 단위로 포맷팅하여 표시합니다
 *
 */

"use client";

import { useState } from "react";
import styles from "@/styles/manager_ga/community/posts/post_table.module.css";
import {
  posts_data,
  type PostItem,
  type PostDivision,
} from "@/data/manager_ga/community/postsData";
import CommonTable, {
  type TableColumn,
  type TableRowData,
} from "@/components/manager/common/table/CommonTable";

interface PostTableProps {
  search_query: string;
}

// PostItem이 TableRowData를 확장하도록 확장
interface PostTableRowData extends PostItem, TableRowData {}

// 구분 태그 스타일 매핑
const division_style_map: Record<PostDivision, string> = {
  공지사항: styles.division_tag_notice,
  "자주 묻는 질문": styles.division_tag_faq,
  이벤트: styles.division_tag_event,
};

// 컬럼 정의
const columns: TableColumn[] = [
  { key: "number", label: "번호", className: styles.table_cell_number },
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
    sortable: true,
    className: styles.table_cell_registered_by,
  },
];

export default function PostTable({ search_query }: PostTableProps) {
  const [selected_post_ids, set_selected_post_ids] = useState<string[]>([]);

  const filtered_posts = posts_data.filter((item) => {
    if (!search_query) return true;
    return item.title.toLowerCase().includes(search_query.toLowerCase());
  });

  const format_number = (num: number): string => {
    return num.toLocaleString();
  };

  return (
    <CommonTable<PostTableRowData>
      columns={columns}
      data={filtered_posts}
      render_cell={(row, column) => {
        switch (column.key) {
          case "number":
            return <span>{row.number}</span>;
          case "division":
            return (
              <span
                className={`${styles.division_tag} ${
                  division_style_map[row.division]
                }`}
              >
                {row.division}
              </span>
            );
          case "category":
            return <span className={styles.category_tag}>{row.category}</span>;
          case "title":
            return <span className={styles.title_text}>{row.title}</span>;
          case "view_count":
            return <span>{format_number(row.view_count)}</span>;
          case "registered_date":
            return <span>{row.registered_date}</span>;
          case "registered_by":
            return <span>{row.registered_by}</span>;
          default:
            return null;
        }
      }}
      styles={styles}
      enable_checkbox={true}
      selected_ids={selected_post_ids}
      on_select_change={set_selected_post_ids}
      empty_message="게시글이 없습니다."
    />
  );
}
