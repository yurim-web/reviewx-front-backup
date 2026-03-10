/* ========================================
   출금 요청 테이블 컴포넌트
   ======================================== */

/**
 * RequestTable
 *
 * 목적: 출금 요청 목록을 테이블 형태로 표시합니다.
 *
 * 사용 페이지:
 * - /manager_sa/settlement/withdrawal_request (출금 요청 페이지)
 */

"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import type { ReactNode, ReactElement } from "react";
import CommonTableWithTooltip from "@/components/manager/common/table/CommonTableWithTooltip";
import type { TableColumn, TableRowData } from "@/components/manager/common/table/CommonTable";
import { useTableSort } from "@/hooks/table/useTableSort";
import type { SortColumnConfig } from "@/utils/table/sort";
import SortableTableHeader from "@/components/manager/common/table/SortableTableHeader";
import styles from "@/styles/manager_sa/settlement/withdrawal_request/request_table.module.css";
import { calculate_total_amount } from "@/data/manager_sa/settlement/withdrawalRequestData";
import type { AdminWithdrawalRequestItem } from "@/types/api/admin";
import WithdrawalRejectModal from "@/components/manager/sa/settlement/withdrawal_request/modal/WithdrawalRejectModal";
import MemberStatusTag, {
  type MemberStatus,
} from "@/components/manager/common/tags/MemberStatusTag";
import BaseModal from "@/components/common/modal/BaseModal";
import { useWithdrawalApprove } from "@/hooks/manager/sa/settlement/useWithdrawalApprove";
import { useWithdrawalReject } from "@/hooks/manager/sa/settlement/useWithdrawalReject";

interface RequestTableRowData extends TableRowData, AdminWithdrawalRequestItem {}

interface FilterSectionInjectedProps {
  on_approve_selected?: () => void;
  on_reject_selected?: () => void;
}

interface RequestTableProps {
  title: string;
  data: AdminWithdrawalRequestItem[];
  show_total?: boolean;
  filter_section?: ReactNode;
}

export default function RequestTable({
  title,
  data,
  show_total = true,
  filter_section,
}: RequestTableProps) {
  const is_emergency = title === "긴급";
  const [selected_ids, setSelectedIds] = useState<string[]>([]);

  const column_config: SortColumnConfig = {
    number: "numeric_string",
    name: "string",
    amount: "numeric_string",
    requestDate: "date",
  };

  const {
    sort_state,
    handle_sort,
    sorted_data: sorted_request_list,
  } = useTableSort({
    data,
    initial_column_key: "number",
    initial_direction: "desc",
    column_config,
  });

  // 승인/반려 훅
  const {
    pending_approve_items,
    is_approve_confirm_modal_open,
    is_approve_success_modal_open,
    handle_approve,
    handle_confirm_approve,
    handle_close_approve_confirm_modal,
    handle_close_approve_success_modal,
  } = useWithdrawalApprove({ sorted_request_list, selected_ids, setSelectedIds });

  const { is_reject_modal_open, handle_reject, handle_confirm_reject, handle_close_reject_modal } =
    useWithdrawalReject({ selected_ids, setSelectedIds });

  const columns: TableColumn[] = useMemo(() => {
    const base_columns: TableColumn[] = [
      { key: "number", label: "번호", sortable: true, className: styles.table_cell_number },
    ];

    if (!is_emergency) {
      base_columns.push({
        key: "round",
        label: "회차",
        sortable: true,
        className: styles.table_cell_round,
      });
    }

    base_columns.push(
      { key: "name", label: "이름", sortable: true, className: styles.table_cell_name },
      { key: "account", label: "계좌번호", className: styles.table_cell_account },
      { key: "ssn", label: "주민등록번호", className: styles.table_cell_ssn },
      { key: "amount", label: "출금 포인트", sortable: true, className: styles.table_cell_amount },
      {
        key: "requestDate",
        label: "신청일",
        sortable: true,
        className: styles.table_cell_request_date,
      },
      { key: "type", label: "유형", className: styles.table_cell_type },
      { key: "status", label: "상태", className: styles.table_cell_status },
      { key: "action", label: "출금", className: styles.table_cell_action }
    );

    return base_columns;
  }, [is_emergency]);

  const handle_select_all = (is_all_selected: boolean) => {
    setSelectedIds(is_all_selected ? sorted_request_list.map((item) => item.id) : []);
  };

  // 회차 정산 출금 승인/반려 가능 여부 (수요일 16시 KST 이후만 허용)
  const is_round_action_available = useMemo(() => {
    if (is_emergency) return true;
    const now_utc = new Date();
    const now_kst = new Date(
      now_utc.getTime() + now_utc.getTimezoneOffset() * 60000 + 9 * 60 * 60000
    );
    const day = now_kst.getDay();
    const hour = now_kst.getHours();
    if (day < 3) return false;
    if (day === 3 && hour < 16) return false;
    return true;
  }, [is_emergency]);

  // 합계 계산
  const total_amount = show_total ? calculate_total_amount(sorted_request_list) : 0;
  const selected_items = useMemo(
    () => sorted_request_list.filter((item) => selected_ids.includes(item.id)),
    [sorted_request_list, selected_ids]
  );
  const selected_total_amount = show_total ? calculate_total_amount(selected_items) : 0;
  const selected_count = selected_items.length;

  // 테이블 헤더 렌더링
  const render_table_header = () => {
    const is_all_selected =
      sorted_request_list.length > 0 && selected_ids.length === sorted_request_list.length;

    return (
      <SortableTableHeader
        columns={columns}
        sort_state={sort_state}
        handle_sort={handle_sort}
        handle_select_all={() =>
          setSelectedIds(is_all_selected ? [] : sorted_request_list.map((item) => item.id))
        }
        is_all_selected={is_all_selected}
        styles={styles}
        container_class_name={
          is_emergency ? styles.table_header_emergency : styles.table_header_round
        }
        use_header_row={true}
      />
    );
  };

  // 셀 렌더링
  const render_cell = (row: RequestTableRowData, column: TableColumn): ReactNode => {
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
        return (
          <>
            <span className={styles.cell_text}>{row.amount}</span>
            <span className={styles.cell_text_secondary}>잔여 {row.remaining}</span>
          </>
        );
      case "requestDate":
        return row.requestDate;
      case "type":
        return row.type;
      case "status":
        return <MemberStatusTag status={row.status as MemberStatus} />;
      case "action": {
        const is_action_disabled = !is_round_action_available;
        return (
          <div className={styles.table_cell_action}>
            <button
              className={styles.action_button_approve}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handle_approve(row.id);
              }}
              disabled={is_action_disabled}
              type="button"
              aria-label="승인"
            >
              <Image
                src={
                  is_action_disabled
                    ? "/images/icons/sign_ok_grey.svg"
                    : "/images/icons/sign_ok.svg"
                }
                alt={is_action_disabled ? "승인 불가" : "승인"}
                width={20}
                height={20}
                className={styles.action_icon}
              />
            </button>
            <button
              className={styles.action_button_reject}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handle_reject(row);
              }}
              disabled={is_action_disabled}
              type="button"
              aria-label="반려"
            >
              <Image
                src={
                  is_action_disabled ? "/images/icons/sign_x_grey.svg" : "/images/icons/sign_x.svg"
                }
                alt={is_action_disabled ? "반려 불가" : "반려"}
                width={20}
                height={20}
                className={styles.action_icon}
              />
            </button>
          </div>
        );
      }
      default:
        return null;
    }
  };

  const render_row_wrapper = (row: RequestTableRowData, row_content: ReactNode): ReactNode => (
    <div
      role="button"
      tabIndex={0}
      onClick={() => {
        setSelectedIds(
          selected_ids.includes(row.id)
            ? selected_ids.filter((id) => id !== row.id)
            : [...selected_ids, row.id]
        );
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setSelectedIds(
            selected_ids.includes(row.id)
              ? selected_ids.filter((id) => id !== row.id)
              : [...selected_ids, row.id]
          );
        }
      }}
      style={{ cursor: "pointer" }}
    >
      {row_content}
    </div>
  );

  // 필터 섹션에 승인/반려 콜백 주입
  const enhance_filter_section = (section?: ReactNode): ReactNode => {
    if (!section || !React.isValidElement(section)) return section;
    const element = section as ReactElement<FilterSectionInjectedProps>;

    return React.cloneElement(element, {
      on_approve_selected: () => {
        if (!is_round_action_available || selected_ids.length === 0) return;
        const items = sorted_request_list.filter((item) => selected_ids.includes(item.id));
        if (items.length > 0) handle_approve(items[0].id);
      },
      on_reject_selected: () => {
        if (!is_round_action_available || selected_ids.length === 0) return;
        handle_reject(sorted_request_list.find((item) => selected_ids.includes(item.id))!);
      },
    });
  };

  const enhanced_filter_section = enhance_filter_section(filter_section);

  // 합계 푸터 spacer 개수 (긴급: 3, 회차: 4)
  const empty_spacer_count = is_emergency ? 3 : 4;

  return (
    <div className={styles.table_section}>
      <h2 className={styles.section_title}>{title}</h2>
      {enhanced_filter_section && <div>{enhanced_filter_section}</div>}

      <div className={styles.table_container}>
        <CommonTableWithTooltip<RequestTableRowData>
          columns={columns}
          data={sorted_request_list as RequestTableRowData[]}
          tooltip_config={{ column_key: "all" }}
          render_cell={render_cell}
          styles={styles}
          enable_checkbox={true}
          selected_ids={selected_ids}
          on_select_change={setSelectedIds}
          on_select_all={handle_select_all}
          render_header={render_table_header}
          render_row_wrapper={render_row_wrapper}
          empty_message="출금 요청 내역이 없습니다."
          container_class_name=""
          header_class_name=""
          body_class_name={`${styles.table_body} ${is_emergency ? styles.table_body_emergency : styles.table_body_round}`}
          row_class_name={`${styles.table_row} ${is_emergency ? styles.table_row_emergency : styles.table_row_round}`}
        />

        {show_total && (
          <div className={styles.table_footer}>
            <div
              className={`${styles.table_footer_row} ${is_emergency ? styles.table_footer_row_emergency : styles.table_footer_row_round}`}
            >
              <div className={styles.table_cell_total_label}>
                <span className={styles.total_label}>전체 합계</span>
                {selected_ids.length > 0 && (
                  <span className={styles.total_label}>
                    선택 합계 ({selected_count.toLocaleString()}건)
                  </span>
                )}
              </div>
              {Array.from({ length: empty_spacer_count }, (_, i) => (
                <div key={i}></div>
              ))}
              <div className={styles.table_cell_total_amount}>
                <span className={styles.total_amount_main}>{total_amount.toLocaleString()}</span>
                {selected_ids.length > 0 && (
                  <span className={styles.total_amount_selected}>
                    {selected_total_amount.toLocaleString()}
                  </span>
                )}
              </div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        )}
      </div>

      <WithdrawalRejectModal
        is_open={is_reject_modal_open}
        on_close={handle_close_reject_modal}
        on_confirm={handle_confirm_reject}
      />

      <BaseModal
        is_open={is_approve_confirm_modal_open}
        on_close={handle_close_approve_confirm_modal}
        message={
          pending_approve_items.length > 0
            ? pending_approve_items.length === 1
              ? `해당 건을 출금 완료 처리하시겠습니까?<br />처리 후 되돌릴 수 없습니다.<br /><span style="color: #FF5694;">[${pending_approve_items[0].name} - ${pending_approve_items[0].amount}원]</span>`
              : `선택된 ${pending_approve_items.length}건을 출금 완료 처리하시겠습니까?<br />처리 후 되돌릴 수 없습니다.<br /><span style="color: #FF5694;">[${pending_approve_items.length}건 - ${calculate_total_amount(pending_approve_items).toLocaleString()}원]</span>`
            : ""
        }
        buttons={["취소", "확인"]}
        on_confirm={handle_confirm_approve}
        type="center"
        close_on_overlay_click={true}
        close_on_escape={true}
      />

      <BaseModal
        is_open={is_approve_success_modal_open}
        on_close={handle_close_approve_success_modal}
        message="출금 완료 처리되었습니다."
        buttons={["닫기"]}
        type="center"
        close_on_overlay_click={true}
        close_on_escape={true}
      />
    </div>
  );
}
