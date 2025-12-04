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
    sortable: true,
    className: styles.table_cell_name,
  },
  {
    key: "user_id",
    label: "아이디",
    sortable: true,
    className: styles.table_cell_user_id,
  },
  {
    key: "division",
    label: "구분",
    className: styles.table_cell_division,
  },
  {
    key: "current_points",
    label: "보유 포인트",
    sortable: true,
    className: styles.table_cell_points,
  },
  {
    key: "ip_address",
    label: "아이피",
    sortable: true,
    className: styles.table_cell_ip,
  },
  {
    key: "block_code",
    label: "차단 코드",
    sortable: true,
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
    sortable: true,
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

  const format_number = (num: number): string => {
    return num.toLocaleString();
  };

  return (
    <CommonTable<BlacklistTableRowData>
      columns={columns}
      data={filtered_blacklist}
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
