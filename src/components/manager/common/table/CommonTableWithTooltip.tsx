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

import { useState, useEffect, useRef, ReactNode } from "react";
import { createPortal } from "react-dom";
import CommonTable, {
  type TableRowData,
  type CommonTableProps,
  type CellRenderer,
} from "./CommonTable";
import shared_tooltip_styles from "@/styles/manager/common/table/table_tooltip.module.css";

/* ========================================
   📌 타입 정의
   ======================================== */

// 툴팁 설정
export interface TooltipConfig {
  /** 툴팁을 표시할 컬럼: 단일 키, 또는 "all"이면 말줄임표 있는 모든 셀에 툴팁 */
  column_key: string | "all";
  /** 툴팁에서 제외할 컬럼 키 (column_key가 "all"일 때만 사용) */
  exclude_column_keys?: string[];
  /** 커스텀 툴팁 내용. (row, column_key) => ReactNode. column_key가 "all"일 때 두 번째 인자 전달 */
  tooltip_content?: (row: TableRowData, column_key?: string) => ReactNode;
  tooltip_class_name?: string;
  text_class_name?: string;
  /** 컬럼별 overflow 검사 대상 CSS 선택자. 말줄임이 내부 요소(예: .title_text)에서 나는 경우 해당 선택자로 요소를 찾아 검사 */
  overflow_selector_by_column?: Record<string, string>;
}

// CommonTableWithTooltip Props 타입
export interface CommonTableWithTooltipProps<T extends TableRowData> extends Omit<
  CommonTableProps<T>,
  "render_cell"
> {
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

  // 호버된 셀 (행 ID + 컬럼 키). "all" 모드에서 어떤 셀에 툴팁을 띄울지 구분
  const [tooltip_hovered_cell, set_tooltip_hovered_cell] = useState<{
    row_id: string;
    column_key: string;
  } | null>(null);

  // 툴팁 위치 (viewport 기준, 포탈용)
  const [tooltip_position, set_tooltip_position] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const [mounted, set_mounted] = useState(false);
  const table_container_ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    set_mounted(true);
  }, []);

  // 스크롤 시 툴팁 즉시 숨김 (윈도우 + 테이블을 감싼 스크롤 컨테이너 모두 감지)
  const hide_tooltip = () => {
    set_tooltip_hovered_cell(null);
    set_tooltip_position(null);
  };

  useEffect(() => {
    if (!tooltip_config) return;
    const on_scroll = () => {
      set_tooltip_hovered_cell(null);
      set_tooltip_position(null);
    };
    const scrollables: (Window | HTMLElement)[] = [window];
    const root = table_container_ref.current;
    if (root) {
      let el: HTMLElement | null = root;
      while (el && el !== document.body) {
        const style = getComputedStyle(el);
        const overflow_y = style.overflowY;
        if (
          (overflow_y === "auto" || overflow_y === "scroll" || overflow_y === "overlay") &&
          el.scrollHeight > el.clientHeight
        ) {
          scrollables.push(el);
        }
        el = el.parentElement;
      }
    }
    scrollables.forEach((target) => {
      target.addEventListener("scroll", on_scroll, { passive: true });
    });
    return () => {
      scrollables.forEach((target) => {
        target.removeEventListener("scroll", on_scroll);
      });
    };
  }, [tooltip_config]);

  /* ========================================
     🛠️ 유틸리티 함수 (Utility Functions)
     ======================================== */

  // 텍스트가 잘렸는지 확인하는 함수
  const is_text_overflow = (element: HTMLElement | null): boolean => {
    if (!element) return false;
    return element.scrollWidth > element.clientWidth + 1;
  };

  // overflow 검사 및 위치 계산에 쓸 요소 (제목처럼 내부 요소에서 말줄임 나는 경우 대비)
  const get_overflow_element = (wrapper: HTMLElement, column_key: string): HTMLElement => {
    const selector = tooltip_config?.overflow_selector_by_column?.[column_key];
    if (selector) {
      const el = wrapper.querySelector<HTMLElement>(selector);
      if (el) return el;
    }
    return wrapper;
  };

  // 툴팁 셀 호버 이벤트 (단일 컬럼 / all 공통)
  const handle_tooltip_cell_mouse_enter = (
    row_id: string,
    column_key: string,
    event: React.MouseEvent<HTMLSpanElement>
  ) => {
    if (!tooltip_config) return;

    const wrapper = event.currentTarget;
    const overflow_el = get_overflow_element(wrapper, column_key);
    if (!is_text_overflow(overflow_el)) return;

    set_tooltip_hovered_cell({ row_id, column_key });

    const rect = overflow_el.getBoundingClientRect();
    set_tooltip_position({
      left: rect.left,
      top: rect.bottom + 4,
    });
  };

  const handle_tooltip_cell_mouse_leave = () => {
    hide_tooltip();
  };

  /* ========================================
     🎨 렌더링 (Rendering)
     ======================================== */

  // 툴팁 대상 컬럼인지 (단일 키 또는 "all"이고 제외 목록에 없음)
  const is_tooltip_column = (column_key: string): boolean => {
    if (!tooltip_config) return false;
    if (tooltip_config.column_key === "all") {
      const exclude = tooltip_config.exclude_column_keys ?? [];
      return !exclude.includes(column_key);
    }
    return tooltip_config.column_key === column_key;
  };

  // 툴팁이 적용된 셀 렌더링
  const render_cell_with_tooltip: CellRenderer<T> = (row, column, index) => {
    const cell_content = render_cell(row, column, index);

    if (tooltip_config && is_tooltip_column(column.key)) {
      const text_class =
        tooltip_config.text_class_name ||
        styles.cell_text ||
        styles.campaign_name_text ||
        styles.tooltip_text ||
        shared_tooltip_styles.tooltip_text ||
        "";
      return (
        <span
          className={text_class || ""}
          style={
            text_class
              ? undefined
              : {
                  display: "block",
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }
          }
          onMouseEnter={(e) => handle_tooltip_cell_mouse_enter(row.id, column.key, e)}
          onMouseLeave={handle_tooltip_cell_mouse_leave}
        >
          {cell_content}
        </span>
      );
    }

    return cell_content;
  };

  // 툴팁 내용 계산 (단일 컬럼 / all 공통)
  const get_tooltip_content = (row: T, column_key: string): ReactNode => {
    if (!tooltip_config) return null;
    if (tooltip_config.tooltip_content) {
      return tooltip_config.tooltip_content(row, column_key);
    }
    const value = (row as Record<string, unknown>)[column_key];
    return value !== undefined && value !== null ? String(value) : "";
  };

  // 커스텀 행 래퍼 (툴팁은 포탈로 별도 렌더링)
  const render_row_wrapper_with_tooltip = (
    row: T,
    row_content: ReactNode,
    index: number
  ): ReactNode => {
    if (render_row_wrapper) {
      const wrapped_content = render_row_wrapper(row, row_content, index);
      return (
        <div
          className={styles.table_row_wrapper || ""}
          data-table-row-wrapper
          onMouseEnter={() => {
            if (on_row_wrapper_hover) on_row_wrapper_hover(row.id);
          }}
          onMouseLeave={() => {
            if (on_row_wrapper_hover) on_row_wrapper_hover(null);
          }}
        >
          {wrapped_content}
        </div>
      );
    }
    return (
      <div
        className={styles.table_row_wrapper || ""}
        data-table-row-wrapper
        onMouseEnter={() => {
          if (on_row_wrapper_hover) on_row_wrapper_hover(row.id);
        }}
        onMouseLeave={() => {
          if (on_row_wrapper_hover) on_row_wrapper_hover(null);
        }}
      >
        {row_content}
      </div>
    );
  };

  const container_class =
    tooltip_config != null
      ? `${rest_props.container_class_name || ""} ${shared_tooltip_styles.tooltip_container_visible || ""}`.trim()
      : rest_props.container_class_name;

  const tooltip_box_class =
    tooltip_config?.tooltip_class_name ||
    styles?.tooltip_box ||
    styles?.tooltip ||
    shared_tooltip_styles.tooltip_box ||
    "";

  const hovered_row =
    tooltip_hovered_cell && data ? data.find((r) => r.id === tooltip_hovered_cell.row_id) : null;

  const tooltip_portal =
    mounted &&
    tooltip_hovered_cell &&
    tooltip_position &&
    hovered_row &&
    tooltip_config &&
    typeof document !== "undefined" &&
    createPortal(
      <div
        role="tooltip"
        className={tooltip_box_class}
        style={{
          position: "fixed",
          left: `${tooltip_position.left}px`,
          top: `${tooltip_position.top}px`,
          zIndex: 99999,
        }}
      >
        {get_tooltip_content(hovered_row, tooltip_hovered_cell.column_key)}
      </div>,
      document.body
    );

  return (
    <>
      <div ref={table_container_ref}>
        <CommonTable<T>
          {...rest_props}
          container_class_name={container_class}
          columns={columns}
          data={data}
          render_cell={render_cell_with_tooltip}
          styles={styles}
          render_row_wrapper={tooltip_config ? render_row_wrapper_with_tooltip : render_row_wrapper}
        />
      </div>
      {tooltip_portal}
    </>
  );
}
