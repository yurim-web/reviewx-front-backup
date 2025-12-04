/* ========================================
   📋 범용 테이블 컴포넌트 (툴팁 기능 포함)
   ======================================== */

/**
 * 범용 테이블 컴포넌트 (툴팁 기능 포함)
 *
 * 목적: 툴팁 기능이 필요한 테이블 컴포넌트에서 사용하는 범용 테이블 컴포넌트입니다.
 *
 * 주요 기능:
 * - CommonTable의 모든 기능 포함
 * - 텍스트 오버플로우 자동 감지
 * - 툴팁 자동 표시 (텍스트가 잘린 경우에만)
 * - 툴팁 위치 자동 계산
 *
 * 사용 위치:
 * - src/components/manager/ga/campaign/rejected/section/RejectedCampaignTable.tsx (반려 이력 테이블)
 * - src/components/manager/ga/campaign/reported/section/ReportedCampaignTable.tsx (신고 내역 테이블)
 *
 */

"use client";

import { useState, useRef, ReactNode } from "react";
import CommonTable, {
  type TableColumn,
  type TableRowData,
  type CommonTableProps,
  type CellRenderer,
} from "./CommonTable";

/* ========================================
   📌 타입 정의
   ======================================== */

// 툴팁 설정
export interface TooltipConfig {
  column_key: string; // 툴팁을 표시할 컬럼 키
  tooltip_content?: (row: any) => ReactNode; // 커스텀 툴팁 내용 (기본값: 컬럼 값)
  tooltip_class_name?: string; // 툴팁 CSS 클래스명
  text_class_name?: string; // 텍스트 span CSS 클래스명
}

// CommonTableWithTooltip Props 타입
export interface CommonTableWithTooltipProps<T extends TableRowData>
  extends Omit<CommonTableProps<T>, "render_cell"> {
  render_cell: CellRenderer<T>;
  tooltip_config?: TooltipConfig; // 툴팁 설정 (선택사항)
  on_row_wrapper_hover?: (row_id: string | null) => void; // row_wrapper 호버 이벤트 (신고 아이콘 등용)
}

/* ========================================
   📋 범용 테이블 컴포넌트 (툴팁 기능 포함)
   ======================================== */

export default function CommonTableWithTooltip<T extends TableRowData>({
  columns,
  data,
  render_cell,
  styles,
  tooltip_config,
  render_row_wrapper,
  on_row_wrapper_hover,
  ...rest_props
}: CommonTableWithTooltipProps<T>) {
  /* ========================================
     📌 상태 관리 (State Management)
     ======================================== */

  // 호버된 행의 ID를 관리하는 상태 (툴팁용)
  const [tooltip_hovered_row_id, set_tooltip_hovered_row_id] = useState<
    string | null
  >(null);

  // 툴팁 위치 정보를 관리하는 상태
  const [tooltip_position, set_tooltip_position] = useState<{
    left: number;
    top: number;
    width: number;
  } | null>(null);

  /* ========================================
     🛠️ 유틸리티 함수 (Utility Functions)
     ======================================== */

  // 텍스트가 잘렸는지 확인하는 함수
  const is_text_overflow = (element: HTMLSpanElement | null): boolean => {
    if (!element) return false;
    return element.scrollWidth > element.clientWidth + 1;
  };

  // 툴팁 컬럼 텍스트 호버 이벤트 핸들러
  const handle_tooltip_column_mouse_enter = (
    row_id: string,
    event: React.MouseEvent<HTMLSpanElement>
  ) => {
    if (!tooltip_config) return;

    const text_element = event.currentTarget;

    // 텍스트가 잘린 경우에만 툴팁 표시
    if (is_text_overflow(text_element)) {
      set_tooltip_hovered_row_id(row_id);

      // 텍스트 셀의 위치와 너비를 계산하여 툴팁 위치 설정
      const rect = text_element.getBoundingClientRect();
      // 테이블 행 래퍼의 위치를 기준으로 상대 위치 계산
      const row_wrapper = text_element.closest(
        `.${styles.table_row_wrapper || ""}`
      );
      if (row_wrapper) {
        const wrapper_rect = row_wrapper.getBoundingClientRect();
        set_tooltip_position({
          left: rect.left - wrapper_rect.left,
          top: rect.bottom - wrapper_rect.top + 4,
          width: rect.width,
        });
      } else {
        set_tooltip_position({
          left: rect.left,
          top: rect.bottom + 4,
          width: rect.width,
        });
      }
    }
  };

  // 툴팁 컬럼 셀에서 마우스가 벗어났을 때 호출됩니다
  const handle_tooltip_column_mouse_leave = () => {
    set_tooltip_hovered_row_id(null);
    set_tooltip_position(null);
  };

  /* ========================================
     🎨 렌더링 (Rendering)
     ======================================== */

  // 툴팁이 적용된 셀 렌더링
  const render_cell_with_tooltip: CellRenderer<T> = (row, column, index) => {
    // 기본 셀 렌더링
    const cell_content = render_cell(row, column, index);

    // 툴팁 설정이 있고, 현재 컬럼이 툴팁 대상인 경우
    if (tooltip_config && column.key === tooltip_config.column_key) {
      return (
        <span
          className={
            tooltip_config.text_class_name ||
            styles.campaign_name_text ||
            styles.tooltip_text ||
            ""
          }
          onMouseEnter={(e) => handle_tooltip_column_mouse_enter(row.id, e)}
          onMouseLeave={handle_tooltip_column_mouse_leave}
        >
          {cell_content}
        </span>
      );
    }

    // 툴팁이 없는 경우 기본 렌더링
    return cell_content;
  };

  // 커스텀 행 래퍼 (툴팁 포함)
  const render_row_wrapper_with_tooltip = (
    row: T,
    row_content: ReactNode,
    index: number
  ): ReactNode => {
    const is_tooltip_hovered = tooltip_hovered_row_id === row.id;

    // 툴팁 렌더링
    const tooltip_element =
      is_tooltip_hovered && tooltip_position && tooltip_config ? (
        <div
          className={
            tooltip_config.tooltip_class_name ||
            styles.tooltip_box ||
            styles.tooltip ||
            ""
          }
          style={{
            left: `${tooltip_position.left}px`,
            top: `${tooltip_position.top}px`,
            position: "absolute",
          }}
        >
          {tooltip_config.tooltip_content
            ? tooltip_config.tooltip_content(row)
            : row[tooltip_config.column_key]}
        </div>
      ) : null;

    // 기존 render_row_wrapper가 있으면 그것을 사용
    if (render_row_wrapper) {
      const wrapped_content = render_row_wrapper(row, row_content, index);
      // render_row_wrapper가 반환한 구조 안에 툴팁 추가
      // table_row_wrapper 구조를 직접 만들어서 툴팁 포함
      return (
        <div
          className={styles.table_row_wrapper || ""}
          style={{ position: "relative" }}
          onMouseEnter={() => {
            if (on_row_wrapper_hover) {
              on_row_wrapper_hover(row.id);
            }
          }}
          onMouseLeave={() => {
            if (on_row_wrapper_hover) {
              on_row_wrapper_hover(null);
            }
          }}
        >
          {wrapped_content}
          {tooltip_element}
        </div>
      );
    }

    // row_wrapper가 없는 경우 기본 wrapper 생성
    return (
      <div
        className={styles.table_row_wrapper || ""}
        style={{ position: "relative" }}
        onMouseEnter={() => {
          if (on_row_wrapper_hover) {
            on_row_wrapper_hover(row.id);
          }
        }}
        onMouseLeave={() => {
          if (on_row_wrapper_hover) {
            on_row_wrapper_hover(null);
          }
        }}
      >
        {row_content}
        {tooltip_element}
      </div>
    );
  };

  return (
    <CommonTable<T>
      {...rest_props}
      columns={columns}
      data={data}
      render_cell={render_cell_with_tooltip}
      styles={styles}
      render_row_wrapper={
        tooltip_config ? render_row_wrapper_with_tooltip : render_row_wrapper
      }
    />
  );
}
