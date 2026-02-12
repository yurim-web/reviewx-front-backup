/* ========================================
   말줄임표 툴팁 래퍼 (테이블 셀용)
   ======================================== */

/**
 * 말줄임표가 적용된 텍스트에 마우스 오버 시 하단에 툴팁을 표시합니다.
 * CommonTable을 쓰지 않는 테이블(ReviewerTable, PartnerTable 등)에서 사용합니다.
 */

"use client";

import { useState, useRef, ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import tooltip_styles from "@/styles/manager/common/table/table_tooltip.module.css";

interface EllipsisTooltipProps {
  /** 셀에 표시할 내용 */
  children: ReactNode;
  /** 툴팁에 표시할 전체 텍스트 (말줄임된 경우 보여줄 값) */
  content: string | number | ReactNode;
  /** 셀 래퍼에 쓸 CSS 클래스명 */
  className?: string;
  /** 툴팁 박스에 쓸 CSS 클래스명 (미지정 시 공용 table_tooltip 스타일 사용) */
  tooltip_class_name?: string;
}

export default function EllipsisTooltip({
  children,
  content,
  className = "",
  tooltip_class_name,
}: EllipsisTooltipProps) {
  const box_class = tooltip_class_name ?? tooltip_styles.tooltip_box;
  const [show_tooltip, set_show_tooltip] = useState(false);
  const [position, set_position] = useState({ left: 0, top: 0 });
  const [mounted, set_mounted] = useState(false);

  useEffect(() => {
    set_mounted(true);
  }, []);

  const is_overflow = (el: HTMLSpanElement | null) =>
    el ? el.scrollWidth > el.clientWidth + 1 : false;

  const handle_mouse_enter = (e: React.MouseEvent<HTMLSpanElement>) => {
    const span = e.currentTarget;
    if (!is_overflow(span)) return;
    const rect = span.getBoundingClientRect();
    set_position({
      left: rect.left,
      top: rect.bottom + 4,
    });
    set_show_tooltip(true);
  };

  const handle_mouse_leave = () => {
    set_show_tooltip(false);
  };

  return (
    <div className={className} style={{ minWidth: 0 }}>
      <span
        style={{
          display: "block",
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={handle_mouse_enter}
        onMouseLeave={handle_mouse_leave}
      >
        {children}
      </span>
      {show_tooltip &&
        mounted &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="tooltip"
            className={box_class}
            style={{
              position: "fixed",
              left: `${position.left}px`,
              top: `${position.top}px`,
              zIndex: 99999,
            }}
          >
            {typeof content === "string" || typeof content === "number"
              ? String(content)
              : content}
          </div>,
          document.body
        )}
    </div>
  );
}
