/* ========================================
   📋 출금 현황 테이블 컴포넌트
   ======================================== */

/**
 * 출금 현황 테이블 컴포넌트
 *
 * 목적: 출금 현황 페이지의 출금 목록을 테이블 형태로 표시합니다.
 *
 * 사용 위치:
 * - /manager_sa/settlement/withdrawal (출금 현황 페이지)
 *
 * 주요 기능:
 * - 체크박스로 출금 항목 선택/해제
 * - 전체 선택/해제 기능
 * - 출금 정보 표시 (번호, 회차, 이름, 계좌번호, 주민등록번호, 출금 포인트, 지급, 신청일, 지급일, 유형, 상태)
 * - 출금 포인트 열에 금액과 잔여 금액 표시
 * - 지급 열에 상태 태그 (긴급, 신청, 완료, 반려) 표시
 * - 상태 열에 정상 태그 표시
 *
 * 기술 스택:
 * - CommonTable: 범용 테이블 컴포넌트를 사용하여 테이블 구조 제공
 * - Render Props 패턴: render_cell 함수를 통해 각 셀을 커스텀 렌더링
 */

"use client";

import { useState } from "react";
import CommonTable, {
  type TableColumn,
  type TableRowData,
} from "@/components/manager/common/table/CommonTable";
import { useTableSort } from "@/hooks/table/useTableSort";
import type { SortColumnConfig } from "@/utils/table/sort";
import SortableTableHeader from "@/components/manager/common/table/SortableTableHeader";
import styles from "@/styles/manager_sa/settlement/withdrawal/withdrawal_table.module.css";
import {
  withdrawalList,
  type WithdrawalItem,
} from "@/data/manager_sa/settlement/withdrawalData";
import MemberStatusTag from "@/components/manager/common/tags/MemberStatusTag";
import type { MemberStatus } from "@/components/manager/common/tags/MemberStatusTag";
import PayoutStatusTag from "@/components/manager/common/tags/PayoutStatusTag";
import type { PayoutStatus } from "@/components/manager/common/tags/PayoutStatusTag";
import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";
import type { WithdrawalPaymentStatus } from "@/data/manager_sa/common/filterOptions";
import type { NormalStatus } from "@/components/manager/sa/settlement/withdrawal/filter/NormalStatusFilterModal";

// WithdrawalItem을 TableRowData로 확장
interface WithdrawalTableRowData extends TableRowData, WithdrawalItem {}

interface WithdrawalTableProps {
  search_query?: string;
  selected_date_range?: DateRange | undefined;
  selected_payment_statuses?: WithdrawalPaymentStatus[];
  selected_normal_statuses?: NormalStatus[];
}

export default function WithdrawalTable({
  search_query = "",
  selected_date_range,
  selected_payment_statuses = [],
  selected_normal_statuses = [],
}: WithdrawalTableProps) {
  // 선택된 항목 ID 배열 관리
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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

  // 검색어 및 필터로 필터링된 출금 현황 목록
  const filtered_withdrawal_list = withdrawalList.filter((item) => {
    // 검색어 필터
    if (search_query) {
      const matches_search =
        item.name.toLowerCase().includes(search_query.toLowerCase()) ||
        item.account.toLowerCase().includes(search_query.toLowerCase());
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

    // 정상 상태 필터
    if (selected_normal_statuses.length > 0) {
      const item_status: NormalStatus = item.isNormal ? "정상" : "비정상";
      if (!selected_normal_statuses.includes(item_status)) return false;
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
    initial_direction: "asc", // 오름차순
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
      sorted_withdrawal_list.length > 0 &&
      selectedIds.length === sorted_withdrawal_list.length;

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
  // row: 현재 행의 데이터, column: 현재 컬럼 정보, index: 행 인덱스
  const render_cell = (row: WithdrawalTableRowData, column: TableColumn) => {
    switch (column.key) {
      case "number":
        return <span className={styles.cell_text}>{row.number}</span>;
      case "round":
        return <span className={styles.cell_text}>{row.round}</span>;
      case "name":
        return <span className={styles.cell_text}>{row.name}</span>;
      case "account":
        return <span className={styles.cell_text}>{row.account}</span>;
      case "ssn":
        return <span className={styles.cell_text}>{row.ssn}</span>;
      case "amount":
        // 출금 포인트 열: 금액과 잔여 금액을 세로로 표시
        return (
          <div className={styles.amount_container}>
            <span className={styles.cell_text}>{row.amount}</span>
            <span className={styles.cell_text_secondary}>
              잔여 {row.remaining}
            </span>
          </div>
        );
      case "paymentStatus":
        // 지급 열: 출금 처리 상태 태그 표시
        return (
          <PayoutStatusTag
            status={convert_payment_status_to_payout_status(row.paymentStatus)}
          />
        );
      case "requestDate":
        return <span className={styles.cell_text}>{row.requestDate}</span>;
      case "paymentDate":
        return <span className={styles.cell_text}>{row.paymentDate}</span>;
      case "type":
        return <span className={styles.cell_text}>{row.type}</span>;
      case "status":
        // 상태 열: 회원 상태 태그 표시 (isNormal이 true일 때만)
        return (
          <>
            {row.isNormal && <MemberStatusTag status="정상" />}
          </>
        );
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

  return (
    <CommonTable<WithdrawalTableRowData>
      columns={columns}
      data={sorted_withdrawal_list as WithdrawalTableRowData[]}
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
