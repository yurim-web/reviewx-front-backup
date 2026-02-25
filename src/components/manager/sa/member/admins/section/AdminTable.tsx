/* ========================================
   관리자 목록 테이블 컴포넌트
   ======================================== */

/**
 * AdminTable
 *
 * 목적: SA 관리자 관리자 목록 페이지의 관리자 목록을 테이블 형태로 표시합니다.
 *
 * 사용 페이지:
 * - /manager_sa/member/admins (관리자 목록 페이지)
 */

"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTableSort } from "@/hooks/table/useTableSort";
import type { SortColumnConfig } from "@/utils/table/sort";
import SortableTableHeader from "@/components/manager/common/table/SortableTableHeader";
import CommonTableWithTooltip, {
  type TooltipConfig,
} from "@/components/manager/common/table/CommonTableWithTooltip";
import type { TableColumn, TableRowData } from "@/components/manager/common/table/CommonTable";
import styles from "@/styles/manager_sa/member/admins/admin_table.module.css";
import {
  get_admin_list_from_storage,
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

// 테이블에서 외부로 노출할 함수들의 타입 정의
export interface AdminTableRef {
  // 선택된 관리자 ID 목록을 반환하는 함수
  get_selected_admin_ids: () => string[];
  // 선택된 관리자 정보를 반환하는 함수
  get_selected_admin: () => AdminItem | null;
}

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
    label: "이용 제한 횟수",
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

const AdminTable = forwardRef<AdminTableRef, AdminTableProps>(function AdminTable(
  { search_query, selected_statuses = [] },
  ref
) {
  // Next.js의 useRouter 훅을 사용하여 페이지 이동 기능 가져오기
  const router = useRouter();

  // 선택된 관리자 ID 목록 상태 관리
  const [selected_admin_ids, set_selected_admin_ids] = useState<string[]>([]);

  // localStorage에서 관리자 목록 가져오기
  // useState: 관리자 목록을 상태로 관리합니다
  const [admin_list_data, set_admin_list_data] = useState<AdminItem[]>([]);

  // 컴포넌트가 마운트될 때 localStorage에서 관리자 목록 가져오기
  // useEffect: 컴포넌트가 렌더링된 후 실행되는 훅입니다
  // 의존성 배열이 빈 배열 []이므로 컴포넌트가 처음 마운트될 때 한 번만 실행됩니다
  useEffect(() => {
    // localStorage에서 관리자 목록 가져오기
    const stored_admin_list = get_admin_list_from_storage();
    set_admin_list_data(stored_admin_list);
  }, []);

  // 페이지가 포커스될 때마다 localStorage에서 최신 데이터 가져오기
  // (다른 페이지에서 관리자를 추가/수정한 후 돌아왔을 때 최신 데이터를 표시하기 위함)
  useEffect(() => {
    const handle_focus = () => {
      const stored_admin_list = get_admin_list_from_storage();
      set_admin_list_data(stored_admin_list);
    };

    // window에 focus 이벤트 리스너 추가
    window.addEventListener("focus", handle_focus);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거 (메모리 누수 방지)
    return () => {
      window.removeEventListener("focus", handle_focus);
    };
  }, []);

  // 검색어 및 필터로 필터링된 관리자 목록
  const filtered_admins = admin_list_data.filter((admin) => {
    // 검색어 필터
    if (search_query) {
      const matches_search = admin.name.toLowerCase().includes(search_query.toLowerCase());
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
    initial_direction: "desc", // 번호 최신순
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
    sorted_admins.length > 0 && selected_admin_ids.length === sorted_admins.length;

  // 개별 체크박스 변경 핸들러
  const handle_select_change = (selected_ids: string[]) => {
    set_selected_admin_ids(selected_ids);
  };

  // 외부에서 선택된 관리자 정보에 접근할 수 있도록 ref를 통해 함수 노출
  // useImperativeHandle: 부모 컴포넌트에서 자식 컴포넌트의 특정 함수나 값에 접근할 수 있게 해주는 React Hook입니다
  useImperativeHandle(
    ref,
    () => ({
      // 선택된 관리자 ID 목록을 반환하는 함수
      get_selected_admin_ids: () => selected_admin_ids,
      // 선택된 관리자가 정확히 1명일 때 해당 관리자 정보를 반환하는 함수
      get_selected_admin: () => {
        if (selected_admin_ids.length !== 1) return null;
        const selected_id = selected_admin_ids[0];
        return admin_list_data.find((admin) => admin.id === selected_id) || null;
      },
    }),
    [selected_admin_ids, admin_list_data]
  );

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

  const tooltip_config: TooltipConfig = {
    column_key: "all",
    exclude_column_keys: ["edit"],
  };

  return (
    <CommonTableWithTooltip<AdminTableRowData>
      columns={columns}
      data={sorted_admins}
      tooltip_config={tooltip_config}
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
            return <MemberStatusTag status={row.status as "정상" | "일시 정지" | "영구 정지"} />;
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
                <Image
                  src="/images/icons/pencil_icon.svg"
                  alt="수정"
                  className={styles.edit_icon}
                  width={16}
                  height={16}
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
});

export default AdminTable;
