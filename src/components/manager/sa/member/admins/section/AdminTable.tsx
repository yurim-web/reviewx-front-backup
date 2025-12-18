/* ========================================
   📋 관리자 목록 테이블 컴포넌트
   ======================================== */

/**
 * 관리자 목록 테이블 컴포넌트
 *
 * 목적: SA 관리자 관리자 목록 페이지의 관리자 목록을 테이블 형태로 표시합니다.
 *
 * 사용 위치:
 * - /manager_sa/member/admins (관리자 목록 페이지)
 *
 * 주요 기능:
 * - 관리자 목록을 테이블로 표시합니다
 * - 검색어 필터를 적용합니다
 * - 체크박스로 관리자를 선택할 수 있습니다
 * - 관리자 상태 태그를 표시합니다 (정상/일시 정지/영구 정지)
 * - 정렬 기능 제공 (번호, 이름, 신고 횟수, 차단 횟수, 접속일, 가입일)
 *
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTableSort } from "@/hooks/table/useTableSort";
import type { SortColumnConfig } from "@/utils/table/sort";
import SortableTableHeader from "@/components/manager/common/table/SortableTableHeader";
import CommonTable, {
  type TableColumn,
  type TableRowData,
} from "@/components/manager/common/table/CommonTable";
import styles from "@/styles/manager_sa/member/admins/admin_table.module.css";
import tag_styles from "@/styles/common/tags.module.css";
import {
  admin_list,
  type AdminItem,
  type AdminStatus,
} from "@/data/manager_sa/member/admins";
import MemberStatusTag from "@/components/manager/common/tags/MemberStatusTag";

interface AdminTableProps {
  // 검색어 상태를 props로 받습니다
  search_query: string;
  // 필터 상태
  selected_statuses?: AdminStatus[];
}

// AdminItem이 TableRowData를 확장하도록 확장
interface AdminTableRowData extends AdminItem, TableRowData {}

// 컬럼 정의
const columns: TableColumn[] = [
  {
    key: "number",
    label: "번호",
    sortable: true,
  },
  {
    key: "name",
    label: "이름",
    sortable: true,
  },
  {
    key: "report_count",
    label: "신고 횟수",
    sortable: true,
  },
  {
    key: "block_count",
    label: "차단 횟수",
    sortable: true,
  },
  {
    key: "last_access_date",
    label: "접속일",
    sortable: true,
  },
  {
    key: "join_date",
    label: "가입일",
    sortable: true,
  },
  {
    key: "status",
    label: "상태",
    sortable: false,
  },
  {
    key: "edit",
    label: "",
    sortable: false,
    className: styles.edit_column,
  },
];

export default function AdminTable({
  search_query,
  selected_statuses = [],
}: AdminTableProps) {
  // Next.js의 useRouter 훅을 사용하여 페이지 이동 기능 가져오기
  const router = useRouter();

  // 선택된 관리자 ID 목록 상태 관리
  const [selected_admin_ids, set_selected_admin_ids] = useState<string[]>([]);

  // 검색어 및 필터로 필터링된 관리자 목록
  const filtered_admins = admin_list.filter((admin) => {
    // 검색어 필터
    if (search_query) {
      const matches_search = admin.name
        .toLowerCase()
        .includes(search_query.toLowerCase());
      if (!matches_search) return false;
    }

    // 상태 필터
    if (selected_statuses.length > 0) {
      if (!selected_statuses.includes(admin.status)) return false;
    }

    return true;
  });

  // 컬럼별 타입 설정
  const column_config: SortColumnConfig = {
    number: "numeric_string",
    name: "string",
    report_count: "number",
    block_count: "number",
    last_access_date: "date",
    join_date: "date",
  };

  // 정렬 훅 사용
  const {
    sort_state,
    handle_sort,
    sorted_data: sorted_admins,
  } = useTableSort<AdminTableRowData>({
    data: filtered_admins,
    initial_column_key: "number",
    initial_direction: "asc",
    column_config,
  });

  // 전체 선택/해제 핸들러
  const handle_select_all = () => {
    if (is_all_selected) {
      set_selected_admin_ids([]);
    } else {
      const all_ids = sorted_admins.map((admin) => admin.id);
      set_selected_admin_ids(all_ids);
    }
  };

  // 전체 선택 상태 계산
  const is_all_selected =
    sorted_admins.length > 0 &&
    selected_admin_ids.length === sorted_admins.length;

  // 개별 체크박스 변경 핸들러
  const handle_select_change = (selected_ids: string[]) => {
    set_selected_admin_ids(selected_ids);
  };

  // 숫자를 천 단위로 포맷팅하는 함수
  const format_number = (num: number): string => {
    return num.toLocaleString();
  };

  // 커스텀 헤더 렌더링 (SortableTableHeader 공통 컴포넌트 사용)
  // edit 컬럼은 헤더에 빈 셀로 표시하여 그리드 정렬 유지
  const render_custom_header_cell = (column: TableColumn) => {
    if (column.key === "edit") {
      // edit 컬럼은 헤더에 빈 셀로 표시 (그리드 정렬을 위해 공간은 확보)
      return <div className={styles.edit_column}></div>;
    }
    return null;
  };

  const render_table_header = () => {
    return (
      <SortableTableHeader
        columns={columns}
        sort_state={sort_state}
        handle_sort={handle_sort}
        handle_select_all={handle_select_all}
        is_all_selected={is_all_selected}
        styles={styles}
        use_header_row={false}
        render_custom_cell={render_custom_header_cell}
      />
    );
  };

  return (
    <CommonTable<AdminTableRowData>
      columns={columns}
      data={sorted_admins}
      render_cell={(row, column) => {
        switch (column.key) {
          case "number":
            return <span>{row.number}</span>;
          case "name":
            return <span>{row.name}</span>;
          case "report_count":
            return <span>{format_number(row.report_count)}회</span>;
          case "block_count":
            return <span>{format_number(row.block_count)}회</span>;
          case "last_access_date":
            return <span>{row.last_access_date}</span>;
          case "join_date":
            return <span>{row.join_date}</span>;
          case "status":
            return (
              <MemberStatusTag
                status={row.status as "정상" | "일시 정지" | "영구 정지"}
                styles={tag_styles}
              />
            );
          case "edit":
            return (
              <button
                className={styles.edit_button}
                onClick={(e) => {
                  // 이벤트 전파를 막아서 행 클릭 이벤트가 발생하지 않도록 함
                  e.stopPropagation();
                  // 관리자 수정 페이지로 이동
                  router.push(`/manager_sa/member/admins/${row.id}/edit`);
                }}
                aria-label="수정"
              >
                <img
                  src="/images/icons/pencil_icon.svg"
                  alt="수정"
                  className={styles.edit_icon}
                />
              </button>
            );
          default:
            return null;
        }
      }}
      styles={styles}
      enable_checkbox={true}
      selected_ids={selected_admin_ids}
      on_select_change={handle_select_change}
      on_select_all={handle_select_all}
      render_header={render_table_header}
      container_class_name={styles.table_container}
      empty_message="관리자가 없습니다."
    />
  );
}
