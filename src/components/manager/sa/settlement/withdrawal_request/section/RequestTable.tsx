/* ========================================
   📋 출금 요청 테이블 컴포넌트
   ======================================== */

/**
 * 출금 요청 테이블 컴포넌트
 *
 * 목적: 출금 요청 목록을 테이블 형태로 표시합니다.
 *
 * 사용 위치:
 * - /manager_sa/settlement/withdrawal_request (출금 요청 페이지)
 *
 * 주요 기능:
 * - 체크박스로 출금 요청 선택/해제
 * - 전체 선택/해제 기능
 * - 출금 요청 정보 표시 (번호, 회차, 이름, 계좌번호, 주민등록번호, 출금 포인트, 신청일, 유형, 상태)
 * - 출금 액션 버튼 (승인/반려)
 * - 합계 행 표시
 * - 정렬 기능 (번호, 이름, 출금 포인트, 신청일)
 *
 * 기술 스택:
 * - CommonTable: 범용 테이블 컴포넌트를 사용하여 테이블 구조 제공
 * - Render Props 패턴: render_cell 함수를 통해 각 셀을 커스텀 렌더링
 * - useTableSort: 테이블 정렬 기능 제공
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import CommonTable, {
  type TableColumn,
  type TableRowData,
} from "@/components/manager/common/table/CommonTable";
import { useTableSort } from "@/hooks/table/useTableSort";
import type { SortColumnConfig } from "@/utils/table/sort";
import SortableTableHeader from "@/components/manager/common/table/SortableTableHeader";
import styles from "@/styles/manager_sa/settlement/withdrawal_request/request_table.module.css";
import {
  calculate_total_amount,
  type WithdrawalRequestItem,
} from "@/data/manager_sa/settlement/withdrawalRequestData";
import WithdrawalRejectModal from "@/components/manager/sa/settlement/withdrawal_request/modal/WithdrawalRejectModal";
import MemberStatusTag, {
  type MemberStatus,
} from "@/components/manager/common/tags/MemberStatusTag";

// WithdrawalRequestItem을 TableRowData로 확장
interface RequestTableRowData extends TableRowData, WithdrawalRequestItem {}

/**
 * RequestTable 컴포넌트 Props 인터페이스
 *
 * 각 속성 설명:
 * - title: 섹션 제목 (예: "긴급", "이번 회차 정산")
 * - data: 표시할 출금 요청 목록
 * - show_total: 합계 행 표시 여부
 * - filter_section: 제목 아래에 표시할 필터 섹션 (선택적)
 */
interface RequestTableProps {
  title: string;
  data: WithdrawalRequestItem[];
  show_total?: boolean;
  filter_section?: ReactNode;
}

export default function RequestTable({
  title,
  data,
  show_total = true,
  filter_section,
}: RequestTableProps) {
  // 긴급 테이블 여부 확인
  const is_emergency = title === "긴급";

  // 선택된 항목 ID 배열 관리 (CommonTable과 호환을 위해 배열로 변경)
  // 페이지 로드 시 모든 체크박스는 체크 해제 상태로 시작
  const [selected_ids, setSelectedIds] = useState<string[]>([]);

  /**
   * 반려 모달 제어 상태
   *
   * - is_reject_modal_open: 모달 표시 여부 (조건부 렌더링으로 제어)
   *
   */
  const [is_reject_modal_open, setIsRejectModalOpen] = useState(false);

  // 컬럼별 타입 설정 (정렬을 위한 컬럼 타입 정의)
  // numeric_string: 숫자처럼 보이는 문자열 (예: "1,500,000")
  // date: 날짜 형식의 문자열 (예: "2025-08-01 18:56")
  // string: 일반 문자열
  const column_config: SortColumnConfig = {
    number: "numeric_string",
    name: "string",
    amount: "numeric_string",
    requestDate: "date",
  };

  // 정렬 훅 사용 (정렬 상태와 정렬된 데이터 관리)
  // 페이지 로드 시 "번호" 컬럼 기준 오름차순으로 기본 정렬
  const {
    sort_state,
    handle_sort,
    sorted_data: sorted_request_list,
  } = useTableSort({
    data,
    initial_column_key: "number", // 기본 정렬: 번호 컬럼
    initial_direction: "asc", // 오름차순
    column_config,
  });

  // 테이블 컬럼 정의 (긴급/회차 정산에 따라 다름)
  // key: 데이터 필드명, label: 헤더에 표시될 텍스트, sortable: 정렬 가능 여부, className: CSS 클래스명
  const columns: TableColumn[] = useMemo(() => {
    const base_columns: TableColumn[] = [
      {
        key: "number",
        label: "번호",
        sortable: true,
        className: styles.table_cell_number,
      },
    ];

    // 회차 정산 테이블에만 회차 컬럼 추가
    if (!is_emergency) {
      base_columns.push({
        key: "round",
        label: "회차",
        sortable: true,
        className: styles.table_cell_round,
      });
    }

    // 나머지 컬럼 추가
    base_columns.push(
      {
        key: "name",
        label: "이름",
        sortable: true,
        className: styles.table_cell_name,
      },
      {
        key: "account",
        label: "계좌번호",
        className: styles.table_cell_account,
      },
      {
        key: "ssn",
        label: "주민등록번호",
        className: styles.table_cell_ssn,
      },
      {
        key: "amount",
        label: "출금 포인트",
        sortable: true,
        className: styles.table_cell_amount,
      },
      {
        key: "requestDate",
        label: "신청일",
        sortable: true,
        className: styles.table_cell_request_date,
      },
      {
        key: "type",
        label: "유형",
        className: styles.table_cell_type,
      },
      {
        key: "status",
        label: "상태",
        className: styles.table_cell_status,
      },
      {
        key: "action",
        label: "출금",
        className: styles.table_cell_action,
      }
    );

    return base_columns;
  }, [is_emergency]);

  // 전체 선택/해제 핸들러 (CommonTable과 호환)
  const handle_select_all = (is_all_selected: boolean) => {
    if (is_all_selected) {
      setSelectedIds(sorted_request_list.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  /**
   * 출금 승인 핸들러
   *
   * 선택된 출금 요청을 승인합니다.
   * 실제 구현에서는 API를 호출하여 승인 처리를 합니다.
   */
  const handle_approve = (id: string) => {
    // TODO: 실제 승인 로직 구현
    console.log("승인:", id);
  };

  /**
   * 출금 반려 핸들러
   *
   * 선택된 출금 요청을 반려합니다.
   * 실제 구현에서는 API를 호출하여 반려 처리를 합니다.
   */
  const handle_reject = (item: WithdrawalRequestItem) => {
    // 모달을 엽니다.
    setIsRejectModalOpen(true);
  };

  /**
   * 모달 닫기 핸들러
   *
   * - setIsRejectModalOpen(false)로 모달을 닫습니다.
   */
  const handle_close_reject_modal = () => {
    setIsRejectModalOpen(false);
  };

  /**
   * 모달에서 반려 확정 핸들러
   *
   * - 실제 서비스에서는 여기서 API를 호출해 반려 처리를 진행합니다.
   * - 데모 단계에서는 콘솔 로그 후 모달을 닫습니다.
   */
  const handle_confirm_reject = (reason: string) => {
    // TODO: 실제 반려 API 호출
    console.log("반려 사유:", reason);
    setIsRejectModalOpen(false);
  };

  // 합계 금액 계산
  const total_amount = show_total
    ? calculate_total_amount(sorted_request_list)
    : 0;

  /**
   * 선택된 항목 합계/건수 계산
   *
   * 학습 포인트:
   * - 배열의 filter 메서드를 사용해서 `selected_ids`에 포함된 행만 골라냅니다.
   * - includes 메서드는 배열에 특정 값이 존재하는지 검사할 때 사용합니다.
   * - useMemo를 사용해서 의존성이 바뀔 때만 다시 계산하도록 최적화합니다.
   */
  const selected_items = useMemo(
    () => sorted_request_list.filter((item) => selected_ids.includes(item.id)),
    [sorted_request_list, selected_ids]
  );

  // 선택된 항목들의 출금 포인트 합계 (체크된 항목만 합산)
  const selected_total_amount = show_total
    ? calculate_total_amount(selected_items)
    : 0;

  // 선택된 건수 (체크된 행의 개수)
  const selected_count = selected_items.length;

  // 테이블 바디 스타일 계산
  // 긴급 테이블: 5개 항목만 보이도록 높이 제한 (5 * 76px = 380px)
  // 이번 회차 정산 테이블: 더 많은 항목이 보이도록 높이 제한 (약 520px)
  // CSS에서 직접 적용하도록 변경

  /**
   * 테이블 레이아웃(컬럼) 정의
   *
   * 긴급: 체크 | 번호 | 이름 | 계좌번호 | 주민등록번호 | 출금 포인트 | 신청일 | 유형 | 상태 | 출금
   * 회차 정산: 체크 | 번호 | 회차 | 이름 | 계좌번호 | 주민등록번호 | 출금 포인트 | 신청일 | 유형 | 상태 | 출금
   */
  const grid_template_columns = is_emergency
    ? "0.5fr 0.8fr 1.2fr 2.4fr 1.6fr 1.6fr 1.4fr 1fr 1fr 1.1fr"
    : "0.5fr 0.8fr 0.8fr 1.2fr 2.2fr 1.5fr 1.5fr 1.4fr 1fr 1fr 1.1fr";

  // 커스텀 헤더 렌더링 (SortableTableHeader 공통 컴포넌트 사용)
  // 동적 gridTemplateColumns를 container_style로 전달
  const render_table_header = () => {
    const is_all_selected =
      sorted_request_list.length > 0 &&
      selected_ids.length === sorted_request_list.length;

    const handle_select_all_click = () => {
      if (is_all_selected) {
        setSelectedIds([]);
      } else {
        setSelectedIds(sorted_request_list.map((item) => item.id));
      }
    };

    return (
      <SortableTableHeader
        columns={columns}
        sort_state={sort_state}
        handle_sort={handle_sort}
        handle_select_all={handle_select_all_click}
        is_all_selected={is_all_selected}
        styles={styles}
        container_style={{ gridTemplateColumns: grid_template_columns }}
      />
    );
  };

  // 각 셀 렌더링 함수 (Render Props 패턴)
  // row: 현재 행의 데이터, column: 현재 컬럼 정보, index: 행 인덱스
  const render_cell = (
    row: RequestTableRowData,
    column: TableColumn
  ): ReactNode => {
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
        // 주의: column.className에 이미 table_cell_amount가 적용되므로 여기서는 div만 사용
        return (
          <>
            <span className={styles.cell_text}>{row.amount}</span>
            <span className={styles.cell_text_secondary}>
              잔여 {row.remaining}
            </span>
          </>
        );
      case "requestDate":
        return <span className={styles.cell_text}>{row.requestDate}</span>;
      case "type":
        return <span className={styles.cell_text}>{row.type}</span>;
      case "status":
        // 상태 열: 상태 태그 컴포넌트 표시
        // MemberStatusTag 컴포넌트를 사용하여 상태에 맞는 스타일을 적용합니다.
        // row.status는 문자열이므로, 타입 단언(as)을 사용하여 MemberStatus 타입으로 변환합니다.
        // MemberStatusTag는 공백 없는 형태("일시정지")도 처리할 수 있으므로 타입 단언 사용
        // 데이터의 status 값이 "일시정지" 형태일 수 있지만, MemberStatusTag가 내부에서 정규화하여 처리합니다.
        return <MemberStatusTag status={row.status as any as MemberStatus} />;
      case "action":
        // 출금 액션 열: 승인/반려 버튼 표시
        return (
          <div className={styles.table_cell_action}>
            <button
              className={styles.action_button_approve}
              onClick={() => handle_approve(row.id)}
              type="button"
              aria-label="승인"
            >
              <img
                src="/images/icons/sign_ok.svg"
                alt="승인"
                className={styles.action_icon}
              />
            </button>
            <button
              className={styles.action_button_reject}
              onClick={() => handle_reject(row)}
              type="button"
              aria-label="반려"
            >
              <img
                src="/images/icons/sign_x.svg"
                alt="반려"
                className={styles.action_icon}
              />
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.table_section}>
      {/* 섹션 제목 */}
      <h2 className={styles.section_title}>{title}</h2>
      {/* 필터 섹션 (제목 아래) */}
      {filter_section && <div>{filter_section}</div>}
      {/* 테이블 컨테이너 */}
      <div className={styles.table_container}>
        {/* CommonTable 컴포넌트 사용 */}
        <CommonTable<RequestTableRowData>
          columns={columns}
          data={sorted_request_list as RequestTableRowData[]}
          render_cell={render_cell}
          styles={styles}
          enable_checkbox={true}
          selected_ids={selected_ids}
          on_select_change={setSelectedIds}
          on_select_all={handle_select_all}
          render_header={render_table_header}
          empty_message="출금 요청 내역이 없습니다."
          container_class_name=""
          header_class_name=""
          body_class_name={`${styles.table_body} ${
            is_emergency ? styles.table_body_emergency : styles.table_body_round
          }`}
          row_class_name={`${styles.table_row} ${
            is_emergency ? styles.table_row_emergency : styles.table_row_round
          }`}
        />

        {/* 합계 행 */}
        {show_total && (
          <div className={styles.table_footer}>
            <div
              className={styles.table_footer_row}
              style={{ gridTemplateColumns: grid_template_columns }}
            >
              {/* 빈 공간들 */}
              {is_emergency ? (
                <>
                  {/* 긴급 테이블: 체크 | 번호 | 이름 | 계좌번호 | 주민등록번호 | 출금 포인트 | 신청일 | 유형 | 상태 | 출금 */}
                  {/* 왼쪽(첫 번째 컬럼)에 라벨, 출금 포인트 컬럼 위치에 금액을 배치합니다. */}
                  <div className={styles.table_cell_total_label}>
                    <span className={styles.total_label}>전체 합계</span>
                    {/* 선택된 항목이 있을 때만 선택 합계 표시 */}
                    {selected_ids.length > 0 && (
                      <span className={styles.total_label}>
                        선택 합계 ({selected_count.toLocaleString()}건)
                      </span>
                    )}
                  </div>
                  <div></div>
                  <div></div>
                  <div></div>
                  {/* 출금 포인트 컬럼 위치에 전체/선택 합계 금액 표시 */}
                  <div className={styles.table_cell_total_amount}>
                    <span className={styles.total_amount_main}>
                      {total_amount.toLocaleString()}
                    </span>
                    {/* 선택된 항목이 있을 때만 선택 합계 금액 표시 */}
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
                </>
              ) : (
                <>
                  {/* 회차 정산 테이블: 체크 | 번호 | 회차 | 이름 | 계좌번호 | 주민등록번호 | 출금 포인트 | 신청일 | 유형 | 상태 | 출금 */}
                  {/* 왼쪽(첫 번째 컬럼)에 라벨, 출금 포인트 컬럼 위치에 금액을 배치합니다. */}
                  <div className={styles.table_cell_total_label}>
                    <span className={styles.total_label}>전체 합계</span>
                    {/* 선택된 항목이 있을 때만 선택 합계 표시 */}
                    {selected_ids.length > 0 && (
                      <span className={styles.total_label}>
                        선택 합계 ({selected_count.toLocaleString()}건)
                      </span>
                    )}
                  </div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  {/* 출금 포인트 컬럼 위치에 전체/선택 합계 금액 표시 */}
                  <div className={styles.table_cell_total_amount}>
                    <span className={styles.total_amount_main}>
                      {total_amount.toLocaleString()}
                    </span>
                    {/* 선택된 항목이 있을 때만 선택 합계 금액 표시 */}
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
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 반려 모달 (조건부 렌더링) */}
      <WithdrawalRejectModal
        is_open={is_reject_modal_open}
        on_close={handle_close_reject_modal}
        on_confirm={handle_confirm_reject}
      />
    </div>
  );
}
