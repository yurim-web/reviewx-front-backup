/* ========================================
   출금 현황 테이블 컴포넌트
   ======================================== */

/**
 * WithdrawalTable
 *
 * 목적: 출금 현황 페이지의 출금 목록을 테이블 형태로 표시합니다.
 *
 * 사용 페이지:
 * - /manager_sa/settlement/withdrawal (출금 현황 페이지)
 */

"use client";

import { useState, useEffect } from "react";
import CommonTableWithTooltip, {
  type TooltipConfig,
} from "@/components/manager/common/table/CommonTableWithTooltip";
import type { TableColumn, TableRowData } from "@/components/manager/common/table/CommonTable";
import { useTableSort } from "@/hooks/table/useTableSort";
import type { SortColumnConfig } from "@/utils/table/sort";
import SortableTableHeader from "@/components/manager/common/table/SortableTableHeader";
import styles from "@/styles/manager_sa/settlement/withdrawal/withdrawal_table.module.css";
import { withdrawalList, type WithdrawalItem } from "@/data/manager_sa/settlement/withdrawalData";
import MemberStatusTag from "@/components/manager/common/tags/MemberStatusTag";
import type { MemberStatus } from "@/components/manager/common/tags/MemberStatusTag";
import PayoutStatusTag from "@/components/manager/common/tags/PayoutStatusTag";
import type { PayoutStatus } from "@/components/manager/common/tags/PayoutStatusTag";
import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";
import type { WithdrawalPaymentStatus } from "@/data/manager_sa/common/filterOptions";
import type { NormalStatus } from "@/components/manager/sa/settlement/withdrawal/filter/NormalStatusFilterDropdown";
import type { WithdrawalMemberType } from "@/components/manager/sa/settlement/withdrawal/filter/MemberTypeFilterDropdown";

// WithdrawalItem을 TableRowData로 확장
interface WithdrawalTableRowData extends TableRowData, WithdrawalItem {}

interface WithdrawalTableProps {
  search_query?: string;
  selected_date_range?: DateRange | undefined;
  selected_payment_statuses?: WithdrawalPaymentStatus[];
  selected_member_types?: WithdrawalMemberType[];
  selected_normal_statuses?: NormalStatus[];
}

export default function WithdrawalTable({
  search_query = "",
  selected_date_range,
  selected_payment_statuses = [],
  selected_member_types = [],
  selected_normal_statuses = [],
}: WithdrawalTableProps) {
  // 선택된 항목 ID 배열 관리
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // localStorage에서 출금 완료 내역 로드
  const [withdrawal_history, set_withdrawal_history] = useState<WithdrawalItem[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedHistory = localStorage.getItem("withdrawal_history");
        if (storedHistory) {
          const history = JSON.parse(storedHistory);
          set_withdrawal_history(history);
        }
      } catch (_error) {
        // 로컬 스토리지 로드 실패 시 무시
      }
    }
  }, []);

  // 컬럼별 타입 설정 (정렬을 위한 컬럼 타입 정의)
  // numeric_string: 숫자처럼 보이는 문자열 (예: "1,500,000")
  // date: 날짜 형식의 문자열 (예: "2025-08-01 18:56")
  // string: 일반 문자열
  const column_config: SortColumnConfig = {
    number: "numeric_string",
    name: "string",
    amount: "numeric_string",
    requestDate: "date",
    paymentDate: "date",
  };

  // 목업 데이터와 실제 데이터 합치기
  const all_withdrawal_list = [...withdrawalList, ...withdrawal_history];

  // 검색어 및 필터로 필터링된 출금 현황 목록
  const filtered_withdrawal_list = all_withdrawal_list.filter((item) => {
    // 검색어 필터 (이름, 계좌번호, 주민등록번호)
    if (search_query) {
      const q = search_query.toLowerCase();
      const matches_search =
        item.name.toLowerCase().includes(q) ||
        item.account.toLowerCase().includes(q) ||
        (item.ssn && item.ssn.toLowerCase().includes(q));
      if (!matches_search) return false;
    }

    // 날짜 범위 필터 (지급 신청일 기준)
    if (selected_date_range?.from && selected_date_range?.to) {
      const item_date_str = item.requestDate.split(" ")[0]; // "2025-08-05"
      const item_date = new Date(item_date_str);
      const start_date = new Date(selected_date_range.from);
      const end_date = new Date(selected_date_range.to);
      start_date.setHours(0, 0, 0, 0);
      end_date.setHours(23, 59, 59, 999);
      item_date.setHours(0, 0, 0, 0);
      if (item_date < start_date || item_date > end_date) return false;
    }

    // 지급 상태 필터
    if (selected_payment_statuses.length > 0) {
      if (!selected_payment_statuses.includes(item.paymentStatus)) return false;
    }

    // 유형 필터
    if (selected_member_types.length > 0) {
      if (!selected_member_types.includes(item.type as WithdrawalMemberType)) return false;
    }

    // 상태 필터
    if (selected_normal_statuses.length > 0) {
      if (!selected_normal_statuses.includes(item.status as NormalStatus)) return false;
    }

    return true;
  });

  // 정렬 훅 사용 (정렬 상태와 정렬된 데이터 관리)
  // 페이지 로드 시 "번호" 컬럼 기준 오름차순으로 기본 정렬
  const {
    sort_state,
    handle_sort,
    sorted_data: sorted_withdrawal_list,
  } = useTableSort({
    data: filtered_withdrawal_list,
    initial_column_key: "number", // 기본 정렬: 번호 컬럼
    initial_direction: "desc", // 번호 최신순
    column_config,
  });

  // 테이블 컬럼 정의
  // key: 데이터 필드명, label: 헤더에 표시될 텍스트, sortable: 정렬 가능 여부, className: CSS 클래스명
  const columns: TableColumn[] = [
    {
      key: "number",
      label: "번호",
      sortable: true,
      className: styles.table_cell_number,
    },
    { key: "round", label: "회차", className: styles.table_cell_round },
    {
      key: "name",
      label: "이름",
      sortable: true,
      className: styles.table_cell_name,
    },
    { key: "account", label: "계좌번호", className: styles.table_cell_account },
    { key: "ssn", label: "주민등록번호", className: styles.table_cell_ssn },
    {
      key: "amount",
      label: "출금 포인트",
      sortable: true,
      className: styles.table_cell_amount,
    },
    {
      key: "paymentStatus",
      label: "지급",
      className: styles.table_cell_payment,
    },
    {
      key: "requestDate",
      label: "신청일",
      sortable: true,
      className: styles.table_cell_request_date,
    },
    {
      key: "paymentDate",
      label: "지급일",
      sortable: true,
      className: styles.table_cell_payment_date,
    },
    { key: "type", label: "유형", className: styles.table_cell_type },
    { key: "status", label: "상태", className: styles.table_cell_status },
  ];

  // 출금 처리 상태를 한글 상태로 변환하는 함수
  const convert_payment_status_to_payout_status = (
    paymentStatus: WithdrawalItem["paymentStatus"]
  ): PayoutStatus => {
    switch (paymentStatus) {
      case "urgent":
        return "긴급";
      case "request":
        return "신청";
      case "completed":
        return "완료";
      case "rejected":
        return "반려";
      default:
        return "신청";
    }
  };

  // 커스텀 헤더 렌더링 (정렬 기능 포함)
  // SortableTableHeader 공통 컴포넌트를 사용하여 헤더 렌더링
  const render_table_header = () => {
    const is_all_selected =
      sorted_withdrawal_list.length > 0 && selectedIds.length === sorted_withdrawal_list.length;

    const handle_select_all = () => {
      if (is_all_selected) {
        setSelectedIds([]);
      } else {
        setSelectedIds(sorted_withdrawal_list.map((item) => item.id));
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
      />
    );
  };

  // 각 셀 렌더링 함수 (Render Props 패턴)
  // row: 현재 행의 데이터, column: 현재 컬럼 정의
  // 툴팁이 적용되는 텍스트 셀은 span으로 감싸지 않고 직접 반환 (CommonTableWithTooltip이 자동으로 처리)
  const render_cell = (row: WithdrawalTableRowData, column: TableColumn) => {
    switch (column.key) {
      case "number":
        return row.number;
      case "round":
        return row.round;
      case "name":
        return row.name;
      case "account":
        return row.account;
      case "ssn":
        return row.ssn;
      case "amount":
        // 출금 포인트 열: 금액과 잔여 금액을 세로로 표시
        return (
          <div className={styles.amount_container}>
            <span className={styles.cell_text}>{row.amount}</span>
            <span className={styles.cell_text_secondary}>잔여 {row.remaining}</span>
          </div>
        );
      case "paymentStatus":
        // 지급 열: 출금 처리 상태 태그 표시
        return (
          <PayoutStatusTag status={convert_payment_status_to_payout_status(row.paymentStatus)} />
        );
      case "requestDate":
        return row.requestDate;
      case "paymentDate":
        return row.paymentDate;
      case "type":
        // 유형 열: 회원 유형 일반 텍스트 표시
        return row.type;
      case "status":
        // 상태 열: 회원 상태 태그 표시
        return <MemberStatusTag status={row.status as MemberStatus} />;
      default:
        return null;
    }
  };

  // 전체 선택/해제 핸들러
  const handle_select_all = (is_all_selected: boolean) => {
    if (is_all_selected) {
      setSelectedIds(sorted_withdrawal_list.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const tooltip_config: TooltipConfig = { column_key: "all" };

  return (
    <CommonTableWithTooltip<WithdrawalTableRowData>
      columns={columns}
      data={sorted_withdrawal_list as WithdrawalTableRowData[]}
      tooltip_config={tooltip_config}
      render_cell={render_cell}
      styles={styles}
      enable_checkbox={true}
      selected_ids={selectedIds}
      on_select_change={setSelectedIds}
      on_select_all={handle_select_all}
      render_header={render_table_header}
      empty_message="출금 내역이 없습니다."
    />
  );
}
