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
import type { SortColumnConfig } from "@/utils/table/sort";
import SortableTableHeader from "@/components/manager/common/table/SortableTableHeader";
import UserTypeTag from "@/components/manager/common/tags/UserTypeTag";
import type { UserType } from "@/components/manager/common/tags/UserTypeTag";

import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";
import type {
  BlacklistDivision,
  BlockCode,
} from "@/data/manager_ga/common/filterOptions";

interface BlacklistTableProps {
  search_query: string;
  // 필터 상태
  selected_date_range?: DateRange | undefined;
  selected_divisions?: BlacklistDivision[];
  selected_block_codes?: BlockCode[];
}

// BlacklistItem이 TableRowData를 확장하도록 확장
interface BlacklistTableRowData extends BlacklistItem, TableRowData {}

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

export default function BlacklistTable({
  search_query,
  selected_date_range,
  selected_divisions = [],
  selected_block_codes = [],
}: BlacklistTableProps) {
  const [selected_blacklist_ids, set_selected_blacklist_ids] = useState<
    string[]
  >([]);

  // 검색어 및 필터로 필터링된 차단 내역 목록
  const filtered_blacklist = blacklist_data.filter((item) => {
    // 검색어 필터
    if (search_query) {
      const matches_search =
        item.name.toLowerCase().includes(search_query.toLowerCase()) ||
        item.user_id.toLowerCase().includes(search_query.toLowerCase());
      if (!matches_search) return false;
    }

    // 날짜 범위 필터
    if (selected_date_range?.from && selected_date_range?.to) {
      // item.registered_date는 "2025-08-01 18:56" 형식
      // 날짜 부분만 추출하여 비교
      const item_date_str = item.registered_date.split(" ")[0]; // "2025-08-01"
      const item_date = new Date(item_date_str);
      
      const start_date = new Date(selected_date_range.from);
      const end_date = new Date(selected_date_range.to);
      
      // 시간 부분을 제거하고 날짜만 비교
      start_date.setHours(0, 0, 0, 0);
      end_date.setHours(23, 59, 59, 999);
      item_date.setHours(0, 0, 0, 0);

      if (item_date < start_date || item_date > end_date) return false;
    }

    // 구분 필터
    if (selected_divisions.length > 0) {
      if (!selected_divisions.includes(item.division)) return false;
    }

    // 차단 코드 필터
    if (selected_block_codes.length > 0) {
      if (!selected_block_codes.includes(item.block_code)) return false;
    }

    return true;
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

  // 커스텀 헤더 렌더링 함수 (SortableTableHeader 공통 컴포넌트 사용)
  const render_custom_header = () => {
    const is_all_selected =
      sorted_blacklist.length > 0 &&
      selected_blacklist_ids.length === sorted_blacklist.length;

    const handle_select_all = () => {
      if (is_all_selected) {
        set_selected_blacklist_ids([]);
      } else {
        set_selected_blacklist_ids(sorted_blacklist.map((item) => item.id));
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
              <UserTypeTag type={row.division as UserType} styles={styles} />
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
