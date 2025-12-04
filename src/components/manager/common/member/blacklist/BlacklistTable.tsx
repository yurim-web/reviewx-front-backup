/* ========================================
   📋 차단 내역 테이블 컴포넌트 (공통)
   ======================================== */

/**
 * 차단 내역 테이블 컴포넌트 (공통)
 *
 * 목적: GA/SA 관리자 차단 내역 페이지의 차단 내역 목록을 테이블 형태로 표시합니다.
 *
 * 사용 위치:
 * - /manager_ga/member/blacklist (GA 관리자 차단 내역 페이지)
 * - /manager_sa/member/blacklist (SA 관리자 차단 내역 페이지)
 *
 * 주요 기능:
 * - 차단 내역 목록을 테이블로 표시합니다
 * - 검색어 필터를 적용합니다
 * - 체크박스로 차단 내역을 선택할 수 있습니다
 * - 구분 태그를 표시합니다 (파트너/리뷰어/관리자)
 * - 차단 코드와 차단 사유를 표시합니다
 *
 */

"use client";

import { useState } from "react";
import styles from "@/styles/manager_ga/member/blacklist/blacklist_table.module.css";
import {
  blacklist_data,
  type BlacklistItem,
  type BlacklistDivision,
} from "@/data/manager_ga/member/blacklist";
import CommonTable, {
  type TableColumn,
  type TableRowData,
} from "@/components/manager/common/table/CommonTable";
import { useTableSort } from "@/hooks/table/useTableSort";
import {
  get_sort_arrow_transform,
  get_sort_arrow_alt,
  type SortColumnConfig,
} from "@/utils/table/sort";

interface BlacklistTableProps {
  search_query: string;
}

// BlacklistItem이 TableRowData를 확장하도록 확장
interface BlacklistTableRowData extends BlacklistItem, TableRowData {}

// 구분 태그 스타일 매핑
const division_style_map: Record<BlacklistDivision, string> = {
  파트너: styles.division_tag_partner,
  리뷰어: styles.division_tag_reviewer,
  관리자: styles.division_tag_admin,
};

// 컬럼 정의
const columns: TableColumn[] = [
  {
    key: "name",
    label: "이름/상호명",
    className: styles.table_cell_name,
  },
  {
    key: "division",
    label: "구분",
    sortable: true,
    className: styles.table_cell_division,
  },
  {
    key: "user_id",
    label: "아이디",
    className: styles.table_cell_user_id,
  },
  {
    key: "ip_address",
    label: "아이피",
    className: styles.table_cell_ip,
  },
  {
    key: "current_points",
    label: "보유 포인트",
    sortable: true,
    className: styles.table_cell_points,
  },
  {
    key: "block_code",
    label: "차단 코드",
    className: styles.table_cell_block_code,
  },
  {
    key: "block_reason",
    label: "차단 사유",
    className: styles.table_cell_block_reason,
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
];

export default function BlacklistTable({ search_query }: BlacklistTableProps) {
  const [selected_blacklist_ids, set_selected_blacklist_ids] = useState<
    string[]
  >([]);

  const filtered_blacklist = blacklist_data.filter((item) => {
    if (!search_query) return true;
    return (
      item.name.toLowerCase().includes(search_query.toLowerCase()) ||
      item.user_id.toLowerCase().includes(search_query.toLowerCase())
    );
  });

  // 컬럼별 타입 설정
  const column_config: SortColumnConfig = {
    division: "string",
    current_points: "number",
    registered_date: "date",
  };

  // 정렬 훅 사용
  const {
    sort_state,
    handle_sort,
    sorted_data: sorted_blacklist,
  } = useTableSort({
    data: filtered_blacklist,
    initial_column_key: "division",
    initial_direction: "asc",
    column_config,
  });

  const format_number = (num: number): string => {
    return num.toLocaleString();
  };

  // 커스텀 헤더 렌더링 함수
  const render_custom_header = () => {
    return (
      <div className={styles.table_header}>
        {/* 체크박스 컬럼 */}
        <div className={styles.table_cell_checkbox}>
          <input
            type="checkbox"
            checked={
              sorted_blacklist.length > 0 &&
              selected_blacklist_ids.length === sorted_blacklist.length
            }
            onChange={(e) => {
              if (e.target.checked) {
                set_selected_blacklist_ids(
                  sorted_blacklist.map((item) => item.id)
                );
              } else {
                set_selected_blacklist_ids([]);
              }
            }}
            className={styles.checkbox}
            aria-label="전체 선택"
          />
        </div>

        {/* 이름/상호명 */}
        <div className={styles.table_cell_name}>
          <span>이름/상호명</span>
        </div>

        {/* 구분 */}
        <div className={styles.table_cell_division}>
          <span>구분</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handle_sort("division");
            }}
            aria-label="구분 정렬"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            <img
              src="/images/icons/table_arrow.svg"
              alt={get_sort_arrow_alt(sort_state, "division")}
              className={styles.sort_icon}
              style={{
                transform: get_sort_arrow_transform(sort_state, "division"),
                transition: "transform 0.2s",
              }}
            />
          </button>
        </div>

        {/* 아이디 */}
        <div className={styles.table_cell_user_id}>
          <span>아이디</span>
        </div>

        {/* 아이피 */}
        <div className={styles.table_cell_ip}>
          <span>아이피</span>
        </div>

        {/* 보유 포인트 */}
        <div className={styles.table_cell_points}>
          <span>보유 포인트</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handle_sort("current_points");
            }}
            aria-label="보유 포인트 정렬"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            <img
              src="/images/icons/table_arrow.svg"
              alt={get_sort_arrow_alt(sort_state, "current_points")}
              className={styles.sort_icon}
              style={{
                transform: get_sort_arrow_transform(
                  sort_state,
                  "current_points"
                ),
                transition: "transform 0.2s",
              }}
            />
          </button>
        </div>

        {/* 차단 코드 */}
        <div className={styles.table_cell_block_code}>
          <span>차단 코드</span>
        </div>

        {/* 차단 사유 */}
        <div className={styles.table_cell_block_reason}>
          <span>차단 사유</span>
        </div>

        {/* 등록일 */}
        <div className={styles.table_cell_registered_date}>
          <span>등록일</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handle_sort("registered_date");
            }}
            aria-label="등록일 정렬"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            <img
              src="/images/icons/table_arrow.svg"
              alt={get_sort_arrow_alt(sort_state, "registered_date")}
              className={styles.sort_icon}
              style={{
                transform: get_sort_arrow_transform(
                  sort_state,
                  "registered_date"
                ),
                transition: "transform 0.2s",
              }}
            />
          </button>
        </div>

        {/* 등록자 */}
        <div className={styles.table_cell_registered_by}>
          <span>등록자</span>
        </div>
      </div>
    );
  };

  return (
    <CommonTable<BlacklistTableRowData>
      columns={columns}
      data={sorted_blacklist}
      render_header={render_custom_header}
      render_cell={(row, column) => {
        switch (column.key) {
          case "name":
            return <span>{row.name}</span>;
          case "user_id":
            return <span>{row.user_id}</span>;
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
          case "current_points":
            return <span>{format_number(row.current_points)}</span>;
          case "ip_address":
            return <span>{row.ip_address}</span>;
          case "block_code":
            return <span>{row.block_code}</span>;
          case "block_reason":
            return <span>{row.block_reason}</span>;
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
      selected_ids={selected_blacklist_ids}
      on_select_change={set_selected_blacklist_ids}
      empty_message="차단 내역이 없습니다."
    />
  );
}
