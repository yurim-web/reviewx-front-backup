/* ========================================
   포탈 드롭다운 메뉴 훅
   ======================================== */

/**
 * usePortalDropdownMenu
 *
 * 목적: 테이블 행 내 ... 메뉴 버튼의 Portal 드롭다운 상태·위치·이벤트를 관리
 *
 * 사용 페이지:
 * - /manager_sa/settlement/payment_history (결제 내역 테이블)
 */

import { useState, useEffect, useRef, useCallback } from "react";

interface PortalDropdownConfig {
  /** Portal 드롭다운의 data-dropdown-menu 속성 값 */
  data_attribute: string;
  /** 드롭다운 예상 높이 (위로 열기 판단용) */
  estimated_height?: number;
}

export default function usePortalDropdownMenu({
  data_attribute,
  estimated_height = 145,
}: PortalDropdownConfig) {
  const [open_row_id, set_open_row_id] = useState<string | null>(null);
  const [dropdown_rect, set_dropdown_rect] = useState<{ left: number; top: number } | null>(null);
  const menu_wrapper_ref = useRef<HTMLDivElement | null>(null);
  const trigger_button_ref = useRef<HTMLButtonElement | null>(null);

  const GAP = 4;
  const HORIZONTAL_PADDING = 8;
  const MIN_WIDTH = 163;
  const OPEN_ABOVE_OFFSET = 24;

  /** 드롭다운 위치 계산 */
  const get_position = useCallback(
    (trigger_rect: DOMRect) => {
      const space_below =
        typeof window !== "undefined" ? window.innerHeight - trigger_rect.bottom - GAP : 0;
      const open_above = space_below < estimated_height;
      const top = open_above
        ? trigger_rect.top - estimated_height - GAP + OPEN_ABOVE_OFFSET
        : trigger_rect.bottom + GAP;
      let left = trigger_rect.left;
      if (typeof window !== "undefined") {
        const max_left = window.innerWidth - MIN_WIDTH - HORIZONTAL_PADDING;
        if (left > max_left) left = max_left;
        if (left < HORIZONTAL_PADDING) left = HORIZONTAL_PADDING;
      }
      return { left, top };
    },
    [estimated_height]
  );

  /** 메뉴 토글 (행의 ... 버튼 클릭 시) */
  const toggle_menu = useCallback(
    (row_id: string, trigger_rect: DOMRect) => {
      if (open_row_id === row_id) {
        set_open_row_id(null);
        set_dropdown_rect(null);
      } else {
        set_dropdown_rect(get_position(trigger_rect));
        set_open_row_id(row_id);
      }
    },
    [open_row_id, get_position]
  );

  /** 메뉴 닫기 */
  const close_menu = useCallback(() => {
    set_open_row_id(null);
    set_dropdown_rect(null);
  }, []);

  /** 외부 클릭 시 닫기 */
  useEffect(() => {
    if (open_row_id === null) return;
    const handle_click_outside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (menu_wrapper_ref.current?.contains(target)) return;
      if (target.closest?.(`[data-dropdown-menu="${data_attribute}"]`)) return;
      close_menu();
    };
    document.addEventListener("mousedown", handle_click_outside);
    return () => document.removeEventListener("mousedown", handle_click_outside);
  }, [open_row_id, data_attribute, close_menu]);

  /** 스크롤/리사이즈 시 위치 갱신 */
  useEffect(() => {
    if (open_row_id === null) return;
    const trigger = trigger_button_ref.current;
    if (!trigger) return;

    const update = () => {
      const rect = trigger.getBoundingClientRect();
      set_dropdown_rect(get_position(rect));
    };

    const scroll_parents: Element[] = [];
    let el: Element | null = trigger.parentElement;
    while (el) {
      const { scrollHeight, clientHeight, scrollWidth, clientWidth } = el;
      if (scrollHeight > clientHeight || scrollWidth > clientWidth) {
        el.addEventListener("scroll", update, { passive: true });
        scroll_parents.push(el);
      }
      el = el.parentElement;
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      scroll_parents.forEach((p) => p.removeEventListener("scroll", update));
    };
  }, [open_row_id, get_position]);

  return {
    open_row_id,
    dropdown_rect,
    menu_wrapper_ref,
    trigger_button_ref,
    toggle_menu,
    close_menu,
  };
}
