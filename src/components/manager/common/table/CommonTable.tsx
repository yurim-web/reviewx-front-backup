/* ========================================
   📋 범용 테이블 컴포넌트 (CommonTable)
   ======================================== */

/**
 * 범용 테이블 컴포넌트
 *
 * 목적: 여러 테이블 컴포넌트에서 공통으로 사용되는 테이블 구조를 제공하는 범용 컴포넌트입니다.
 *
 * 주요 기능:
 * - 테이블 헤더와 바디 구조 제공
 * - 커스텀 셀 렌더링 지원 (render prop 패턴)
 * - 체크박스 선택 기능 (선택사항)
 * - 호버 기능 (선택사항)
 * - 빈 상태 메시지 표시
 * - 정렬 아이콘 표시 (선택사항)
 *
 * 사용 위치:
 * - src/components/manager/common/community/posts/section/PostTable.tsx (게시글 테이블)
 * - src/components/manager/common/campaign/progress/table/CampaignTable.tsx (캠페인 진행 상황 테이블)
 * - src/components/manager/common/member/blacklist/BlacklistTable.tsx (블랙리스트 테이블)
 * - src/components/manager/common/table/CommonTableWithTooltip.tsx (툴팁 기능이 포함된 범용 테이블 컴포넌트)
 *
 */

"use client";

import { useState, ReactNode } from "react";

/* ========================================
   📌 타입 정의
   ======================================== */

// 테이블 헤더 컬럼 정의
export interface TableColumn {
  key: string; // 컬럼 고유 키
  label: string; // 헤더에 표시될 텍스트
  sortable?: boolean; // 정렬 가능 여부 (정렬 아이콘 표시)
  className?: string; // 추가 CSS 클래스명
}

// 테이블 행 데이터 타입 (제네릭)
export type TableRowData = {
  id: string; // 각 행의 고유 ID (필수)
  [key: string]: any; // 기타 데이터 필드들
};

// 셀 렌더링 함수 타입
// row: 현재 행의 데이터
// column: 현재 컬럼 정보
// index: 행 인덱스
export type CellRenderer<T extends TableRowData> = (
  row: T,
  column: TableColumn,
  index: number
) => ReactNode;

// 테이블 컴포넌트 Props 타입
export interface CommonTableProps<T extends TableRowData> {
  // 필수 props
  columns: TableColumn[]; // 테이블 컬럼 정의
  data: T[]; // 테이블 데이터 배열
  render_cell: CellRenderer<T>; // 각 셀을 렌더링하는 함수
  styles: Record<string, string>; // CSS 모듈 스타일 객체

  // 선택 props
  enable_checkbox?: boolean; // 체크박스 활성화 여부
  empty_message?: string; // 데이터가 없을 때 표시할 메시지
  container_class_name?: string; // 컨테이너 추가 CSS 클래스명
  header_class_name?: string; // 헤더 추가 CSS 클래스명
  body_class_name?: string; // 바디 추가 CSS 클래스명
  row_class_name?: string; // 행 추가 CSS 클래스명

  // 체크박스 관련 props (enable_checkbox가 true일 때 사용)
  selected_ids?: string[]; // 선택된 행 ID 배열
  on_select_change?: (selected_ids: string[]) => void; // 선택 상태 변경 핸들러
  on_select_all?: (is_all_selected: boolean) => void; // 전체 선택/해제 핸들러

  // 호버 기능 관련 props
  enable_hover?: boolean; // 호버 효과 활성화 여부
  on_row_hover?: (row_id: string | null) => void; // 행 호버 이벤트 핸들러

  // 커스텀 헤더 렌더링 (기본 헤더 대신 사용)
  render_header?: () => ReactNode;

  // 커스텀 행 래퍼 (각 행을 감쌀 요소, 툴팁 등 추가 기능용)
  render_row_wrapper?: (
    row: T,
    row_content: ReactNode,
    index: number
  ) => ReactNode;
}

/* ========================================
   📋 범용 테이블 컴포넌트
   ======================================== */

/**
 * 범용 테이블 컴포넌트
 *
 * @template T - 테이블 행 데이터 타입 (TableRowData를 확장해야 함)
 *
 * 사용 예시:
 * ```tsx
 * <CommonTable
 *   columns={columns}
 *   data={table_data}
 *   render_cell={(row, column) => <div>{row[column.key]}</div>}
 *   styles={table_styles}
 *   enable_checkbox={true}
 *   empty_message="데이터가 없습니다."
 * />
 * ```
 */
export default function CommonTable<T extends TableRowData>({
  columns,
  data,
  render_cell,
  styles,
  enable_checkbox = false,
  empty_message = "데이터가 없습니다.",
  container_class_name = "",
  header_class_name = "",
  body_class_name = "",
  row_class_name = "",
  selected_ids = [],
  on_select_change,
  on_select_all,
  enable_hover = false,
  on_row_hover,
  render_header,
  render_row_wrapper,
}: CommonTableProps<T>) {
  /* ========================================
     📌 상태 관리 (State Management)
     ======================================== */

  // 전체 선택 상태 관리
  const [is_all_selected, set_is_all_selected] = useState(false);

  // 호버된 행 ID 관리
  const [hovered_row_id, set_hovered_row_id] = useState<string | null>(null);

  /* ========================================
     🛠️ 이벤트 핸들러 (Event Handlers)
     ======================================== */

  // 체크박스 개별 선택/해제 핸들러
  const handle_checkbox_toggle = (row_id: string) => {
    if (!on_select_change) return;

    const new_selected_ids = selected_ids.includes(row_id)
      ? selected_ids.filter((id) => id !== row_id) // 이미 선택된 경우 제거
      : [...selected_ids, row_id]; // 선택되지 않은 경우 추가

    on_select_change(new_selected_ids);

    // 전체 선택 상태 업데이트
    set_is_all_selected(
      new_selected_ids.length === data.length && data.length > 0
    );
  };

  // 전체 선택/해제 핸들러
  const handle_select_all = () => {
    if (!on_select_change || !on_select_all) return;

    if (is_all_selected) {
      // 전체 해제
      on_select_change([]);
      set_is_all_selected(false);
      on_select_all(false);
    } else {
      // 전체 선택
      const all_ids = data.map((row) => row.id);
      on_select_change(all_ids);
      set_is_all_selected(true);
      on_select_all(true);
    }
  };

  // 행 호버 핸들러
  const handle_row_mouse_enter = (row_id: string) => {
    if (!enable_hover) return;
    set_hovered_row_id(row_id);
    if (on_row_hover) {
      on_row_hover(row_id);
    }
  };

  const handle_row_mouse_leave = () => {
    if (!enable_hover) return;
    set_hovered_row_id(null);
    if (on_row_hover) {
      on_row_hover(null);
    }
  };

  /* ========================================
     🎨 렌더링 (Rendering)
     ======================================== */

  // 테이블 헤더 렌더링
  const render_table_header = () => {
    // 커스텀 헤더가 있으면 그것을 사용
    if (render_header) {
      return render_header();
    }

    return (
      <div className={`${styles.table_header} ${header_class_name}`}>
        {/* 체크박스 컬럼 (enable_checkbox가 true일 때만 표시) */}
        {enable_checkbox && (
          <div className={styles.table_cell_checkbox}>
            <input
              type="checkbox"
              checked={is_all_selected}
              onChange={handle_select_all}
              className={styles.checkbox}
              aria-label="전체 선택"
            />
          </div>
        )}

        {/* 일반 컬럼들 */}
        {columns.map((column) => (
          <div
            key={column.key}
            className={`${styles.table_header_cell} ${column.className || ""}`}
          >
            <span>{column.label}</span>
            {/* 정렬 가능한 컬럼은 화살표 아이콘 표시 */}
            {column.sortable && (
              <img
                src="/images/icons/table_arrow.svg"
                alt="정렬"
                className={styles.table_header_arrow || styles.sort_icon}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  // 테이블 행 렌더링
  const render_table_row = (row: T, index: number) => {
    const is_selected = selected_ids.includes(row.id);
    const is_hovered = hovered_row_id === row.id;

    // 각 셀 렌더링
    const row_content = (
      <div
        className={`${styles.table_row} ${row_class_name}`}
        onMouseEnter={() => handle_row_mouse_enter(row.id)}
        onMouseLeave={handle_row_mouse_leave}
      >
        {/* 체크박스 셀 (enable_checkbox가 true일 때만 표시) */}
        {enable_checkbox && (
          <div
            className={styles.table_cell_checkbox}
            onClick={(e) => {
              // 체크박스 클릭 시 행 클릭 이벤트가 발생하지 않도록 이벤트 전파를 막습니다
              // stopPropagation: 이벤트 버블링을 방지하는 메서드입니다
              e.stopPropagation();
            }}
          >
            <input
              type="checkbox"
              checked={is_selected}
              onChange={() => handle_checkbox_toggle(row.id)}
              className={styles.checkbox}
              aria-label={`${row.id} 선택`}
            />
          </div>
        )}

        {/* 각 컬럼에 대한 셀 렌더링 */}
        {columns.map((column) => (
          <div
            key={column.key}
            className={`${styles.table_cell} ${column.className || ""}`}
          >
            {render_cell(row, column, index)}
          </div>
        ))}
      </div>
    );

    // 커스텀 행 래퍼가 있으면 그것으로 감싸기 (툴팁 등 추가 기능용)
    if (render_row_wrapper) {
      return render_row_wrapper(row, row_content, index);
    }

    return row_content;
  };

  // 테이블 바디 렌더링
  const render_table_body = () => {
    // 데이터가 없으면 빈 상태 메시지 표시
    if (data.length === 0) {
      return (
        <div className={styles.empty_message || styles.table_body}>
          {empty_message}
        </div>
      );
    }

    // 데이터가 있으면 각 행 렌더링
    return (
      <div className={`${styles.table_body} ${body_class_name}`}>
        {data.map((row, index) => (
          <div key={row.id}>{render_table_row(row, index)}</div>
        ))}
      </div>
    );
  };

  // 메인 렌더링
  return (
    <div
      className={`${
        styles.table_container || styles.table_section
      } ${container_class_name}`}
    >
      {/* 테이블 헤더 */}
      {render_table_header()}

      {/* 테이블 바디 */}
      {render_table_body()}
    </div>
  );
}
