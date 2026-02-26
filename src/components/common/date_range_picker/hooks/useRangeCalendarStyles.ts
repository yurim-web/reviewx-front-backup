/* ========================================
   캘린더 범위 스타일 적용 훅
   ======================================== */

/**
 * useRangeCalendarStyles
 *
 * 목적: RangeCalendar 컴포넌트의 날짜 범위 DOM 스타일 적용 로직을 분리한 커스텀 훅
 *
 * 사용 페이지:
 * - RangeCalendar.tsx (날짜 범위 선택 캘린더)
 */

import { useRef, useCallback, useEffect, type RefObject } from "react";
import type { DateRange } from "react-day-picker";

export function useRangeCalendarStyles(
  selected: DateRange | undefined,
  calendar_ref: RefObject<HTMLDivElement>
): void {
  const is_applying_styles_ref = useRef(false);
  const observer_ref = useRef<MutationObserver | null>(null);
  const last_apply_time_ref = useRef(0);
  const reconnect_timer_ref = useRef<NodeJS.Timeout | null>(null);

  // ========================================
  // 날짜 범위 스타일 적용 함수
  // ========================================

  const apply_range_styles = useCallback(() => {
    if (is_applying_styles_ref.current) return;

    is_applying_styles_ref.current = true;
    if (!calendar_ref.current) {
      is_applying_styles_ref.current = false;
      return;
    }

    if (observer_ref.current) {
      observer_ref.current.disconnect();
    }

    const all_days = calendar_ref.current.querySelectorAll(
      "td.rdp-day, .rdp-day, [class*='rdp-day']"
    );

    // react-day-picker v9: rdp-range_start, rdp-selected / v8: rdp-day_range_start, rdp-day_selected 등
    const has_range_class = (el: DOMTokenList, name: string) =>
      el.contains(`rdp-${name}`) ||
      el.contains(`rdp-day_range_${name.replace("range_", "")}`) ||
      el.toString().includes(name);
    const is_selected = (el: DOMTokenList) =>
      el.contains("rdp-selected") || el.contains("rdp-day_selected");

    all_days.forEach((day) => {
      const element = day as HTMLElement;
      const button = element.querySelector("button") as HTMLElement;
      const class_list = element.classList;

      // 시작일만 선택된 경우: 시작+끝이 동일한 날 (from === to)
      const has_both_start_and_end =
        has_range_class(class_list, "range_start") &&
        has_range_class(class_list, "range_end") &&
        !has_range_class(class_list, "range_middle");

      const is_outside_first = class_list.contains("rdp-day_outside");
      const is_single_selected =
        !is_outside_first &&
        (has_both_start_and_end ||
          (selected &&
            selected.from &&
            selected.to == null &&
            class_list.contains("rdp-day_selected") &&
            !has_range_class(class_list, "range_start") &&
            !has_range_class(class_list, "range_end") &&
            !has_range_class(class_list, "range_middle")));

      // 오늘 날짜이면서 선택되지 않고 range에 포함되지 않은 경우는 스타일 제거하지 않음
      const is_today_not_selected =
        class_list.contains("rdp-day_today") &&
        !is_selected(class_list) &&
        !has_range_class(class_list, "range_start") &&
        !has_range_class(class_list, "range_end") &&
        !has_range_class(class_list, "range_middle") &&
        !class_list.contains("rdp-day_outside");

      // 오늘 날짜가 아니고 시작일만 선택된 경우가 아닌 경우에만 스타일 제거
      if (!is_today_not_selected && !is_single_selected) {
        element.style.removeProperty("background-color");
        element.style.removeProperty("color");
        element.style.removeProperty("border-radius");
        element.style.removeProperty("font-weight");
        element.style.removeProperty("position");
        element.style.removeProperty("height");
        element.style.removeProperty("min-height");
        element.style.removeProperty("max-height");
        element.style.removeProperty("padding");
      }

      if (button && !is_today_not_selected && !is_single_selected) {
        button.style.removeProperty("background-color");
        button.style.removeProperty("color");
        button.style.removeProperty("border-radius");
        button.style.removeProperty("width");
        button.style.removeProperty("height");
        button.style.removeProperty("min-width");
        button.style.removeProperty("min-height");
        button.style.removeProperty("max-width");
        button.style.removeProperty("max-height");
        button.style.removeProperty("border");
        button.style.removeProperty("padding");
        button.style.removeProperty("margin");
        button.style.removeProperty("font-weight");
        button.style.removeProperty("display");
        button.style.removeProperty("align-items");
        button.style.removeProperty("justify-content");
        button.style.removeProperty("outline");
        button.style.removeProperty("position");
        button.style.removeProperty("z-index");

        const start_circle = button.querySelector(".range-start-circle");
        const end_circle = button.querySelector(".range-end-circle");
        if (start_circle) start_circle.remove();
        if (end_circle) end_circle.remove();

        const text_wrappers = button.querySelectorAll(".range-text-wrapper");
        text_wrappers.forEach((wrapper) => {
          const parent = wrapper.parentElement;
          if (parent) {
            while (wrapper.firstChild) {
              parent.insertBefore(wrapper.firstChild, wrapper);
            }
            wrapper.remove();
          }
        });
      }
    });

    all_days.forEach((day) => {
      const element = day as HTMLElement;
      const button = element.querySelector("button") as HTMLElement;
      const class_list = element.classList;

      // has_both_start_and_end를 먼저 정의 (range 조건에서도 사용)
      const has_both_start_and_end =
        has_range_class(class_list, "range_start") &&
        has_range_class(class_list, "range_end") &&
        !has_range_class(class_list, "range_middle");

      // 전월/다음달 날짜(rdp-day_outside)는 스타일 적용 제외
      const is_outside = class_list.contains("rdp-day_outside");

      // 시작일만 선택된 경우: from === to 또는 to가 undefined (시작일만 선택)
      const is_single_selected =
        !is_outside &&
        (has_both_start_and_end ||
          (selected &&
            selected.from &&
            (selected.to == null || selected.from.getTime() === selected.to.getTime()) &&
            is_selected(class_list) &&
            !has_range_class(class_list, "range_start") &&
            !has_range_class(class_list, "range_end") &&
            !has_range_class(class_list, "range_middle")));

      if (is_single_selected) {
        const isMobile = window.innerWidth <= 768;
        const circleSize = isMobile ? "20px" : "32px";

        element.style.setProperty("background-color", "transparent", "important");
        element.style.setProperty("position", "relative", "important");
        element.style.setProperty("color", "#444444", "important");
        element.style.setProperty("border-radius", "50%", "important");
        element.style.setProperty("font-weight", "500", "important");

        if (button) {
          // 시작일만 선택 시 range-start-circle만 사용 (버튼 배경은 투명 - 중복 원 방지)
          button.style.setProperty("background-color", "transparent", "important");
          button.style.setProperty("color", "white", "important");
          button.style.setProperty("border-radius", "50%", "important");
          button.style.setProperty("width", circleSize, "important");
          button.style.setProperty("height", circleSize, "important");
          button.style.setProperty("min-width", circleSize, "important");
          button.style.setProperty("min-height", circleSize, "important");
          button.style.setProperty("max-width", circleSize, "important");
          button.style.setProperty("max-height", circleSize, "important");
          button.style.setProperty("border", "none", "important");
          button.style.setProperty("padding", "0", "important");
          button.style.setProperty("margin", "0", "important");
          button.style.setProperty("font-weight", "500", "important");
          button.style.setProperty("display", "flex", "important");
          button.style.setProperty("align-items", "center", "important");
          button.style.setProperty("justify-content", "center", "important");
          button.style.setProperty("position", "relative", "important");
          button.style.setProperty("z-index", "2", "important");
          button.style.setProperty("outline", "none", "important");

          // range-start-circle 사용 (시작일 선택 시)
          const old_circle = button.querySelector(".selected-date-circle");
          if (old_circle) old_circle.remove();
          let circle = button.querySelector(".range-start-circle") as HTMLElement;
          if (!circle) {
            circle = document.createElement("div");
            circle.className = "range-start-circle";
            circle.style.setProperty("position", "absolute", "important");
            circle.style.setProperty("width", circleSize, "important");
            circle.style.setProperty("height", circleSize, "important");
            circle.style.setProperty("background-color", "#ff5694", "important");
            circle.style.setProperty("border-radius", "50%", "important");
            circle.style.setProperty("left", "calc(50% - 1px)", "important");
            circle.style.setProperty("top", "50%", "important");
            circle.style.setProperty("transform", "translate(-50%, -50%)", "important");
            circle.style.setProperty("z-index", "0", "important");
            circle.style.setProperty("pointer-events", "none", "important");
            circle.style.setProperty("display", "block", "important");
            button.prepend(circle);
          } else {
            circle.style.setProperty("width", circleSize, "important");
            circle.style.setProperty("height", circleSize, "important");
            circle.style.setProperty("left", "calc(50% - 1px)", "important");
            circle.style.setProperty("transform", "translate(-50%, -50%)", "important");
            circle.style.setProperty("pointer-events", "none", "important");
          }
          circle.style.setProperty("display", "block", "important");

          // 날짜 텍스트가 원 위에 보이도록 (모바일에서 absolute로 확실히 위에 배치)
          const apply_text_on_top = () => {
            const button_children = button.querySelectorAll("*");
            button_children.forEach((child) => {
              const child_element = child as HTMLElement;
              if (!child_element.classList.contains("range-start-circle")) {
                child_element.style.setProperty("color", "white", "important");
                child_element.style.setProperty("position", "relative", "important");
                child_element.style.setProperty("z-index", "10", "important");
                child_element.style.setProperty("font-size", "inherit", "important");
                child_element.style.setProperty("pointer-events", "none", "important");
              }
            });
            // 텍스트 노드를 span으로 감싸서 원 위에 절대 위치로 표시
            const walker = document.createTreeWalker(button, NodeFilter.SHOW_TEXT, null);
            let text_node;
            const text_nodes: Text[] = [];
            while ((text_node = walker.nextNode())) {
              if (
                text_node.textContent?.trim() &&
                !text_node.parentElement?.classList.contains("range-text-wrapper")
              ) {
                text_nodes.push(text_node as Text);
              }
            }
            text_nodes.forEach((text_node) => {
              const wrapper = document.createElement("span");
              wrapper.className = "range-text-wrapper";
              wrapper.style.setProperty("color", "white", "important");
              wrapper.style.setProperty("position", "absolute", "important");
              wrapper.style.setProperty("left", "0", "important");
              wrapper.style.setProperty("right", "0", "important");
              wrapper.style.setProperty("top", "0", "important");
              wrapper.style.setProperty("bottom", "0", "important");
              wrapper.style.setProperty("display", "flex", "important");
              wrapper.style.setProperty("align-items", "center", "important");
              wrapper.style.setProperty("justify-content", "center", "important");
              wrapper.style.setProperty("z-index", "10", "important");
              wrapper.style.setProperty("font-size", "inherit", "important");
              wrapper.style.setProperty("pointer-events", "none", "important");
              wrapper.style.setProperty("transform", "translateX(-1px)", "important");
              text_node.parentNode?.insertBefore(wrapper, text_node);
              wrapper.appendChild(text_node);
            });
          };
          apply_text_on_top();
          setTimeout(apply_text_on_top, 0);
          setTimeout(apply_text_on_top, 100);
        }
      } else if (!is_outside && has_range_class(class_list, "range_middle")) {
        element.style.setProperty("background-color", "transparent", "important");
        element.style.setProperty("color", "#444444", "important");
        element.style.setProperty("border-radius", "0", "important");

        if (button) {
          const isMobile = window.innerWidth <= 768;
          const buttonHeight = isMobile ? "18px" : "28px";
          button.style.setProperty("background-color", "rgba(255,86,148,0.1)", "important");
          button.style.setProperty("color", "#444444", "important");
          button.style.setProperty("border", "none", "important");
          button.style.setProperty("border-radius", "0", "important");
          button.style.setProperty("width", "100%", "important");
          button.style.setProperty("height", buttonHeight, "important");
          button.style.setProperty("min-height", buttonHeight, "important");
          button.style.setProperty("max-height", buttonHeight, "important");
          button.style.setProperty("display", "flex", "important");
          button.style.setProperty("align-items", "center", "important");
          button.style.setProperty("justify-content", "center", "important");
        }
      } else if (
        !is_outside &&
        has_range_class(class_list, "range_start") &&
        !has_both_start_and_end
      ) {
        const isMobile = window.innerWidth <= 768;
        const elementHeight = isMobile ? "18px" : "var(--rdp-cell-size)";

        element.style.setProperty("background-color", "transparent", "important");
        element.style.setProperty("color", "#444444", "important");
        element.style.setProperty("border-radius", "0", "important");
        element.style.setProperty("font-weight", "500", "important");
        element.style.setProperty("position", "relative", "important");
        element.style.setProperty("height", elementHeight, "important");
        element.style.setProperty("min-height", elementHeight, "important");
        element.style.setProperty("max-height", elementHeight, "important");
        element.style.setProperty("padding", "0", "important");

        if (button) {
          const buttonHeight = isMobile ? "18px" : "28px";
          button.style.setProperty("background-color", "rgba(255,86,148,0.1)", "important");
          button.style.setProperty("color", "white", "important");
          button.style.setProperty("border-radius", "50% 0 0 50%", "important");
          button.style.setProperty("width", "100%", "important");
          button.style.setProperty("height", buttonHeight, "important");
          button.style.setProperty("border", "none", "important");
          button.style.setProperty("padding", "0", "important");
          button.style.setProperty("margin", "0", "important");
          button.style.setProperty("font-weight", "500", "important");
          button.style.setProperty("display", "flex", "important");
          button.style.setProperty("align-items", "center", "important");
          button.style.setProperty("justify-content", "center", "important");
          button.style.setProperty("outline", "none", "important");
          button.style.setProperty("position", "relative", "important");

          const button_children = button.querySelectorAll("*");
          button_children.forEach((child) => {
            const child_element = child as HTMLElement;
            if (!child_element.classList.contains("range-start-circle")) {
              child_element.style.setProperty("color", "white", "important");
              child_element.style.setProperty("position", "relative", "important");
              child_element.style.setProperty("z-index", "10", "important");
            }
          });

          button.style.setProperty("color", "white", "important");
          button.style.setProperty("z-index", "2", "important");

          const circle_size_range = isMobile ? "20px" : "32px";
          let circle = button.querySelector(".range-start-circle") as HTMLElement;
          if (!circle) {
            circle = document.createElement("div");
            circle.className = "range-start-circle";
            circle.style.setProperty("position", "absolute", "important");
            circle.style.setProperty("width", circle_size_range, "important");
            circle.style.setProperty("height", circle_size_range, "important");
            circle.style.setProperty("background-color", "#ff5694", "important");
            circle.style.setProperty("border-radius", "50%", "important");
            circle.style.setProperty("left", "calc(50% - 1px)", "important");
            circle.style.setProperty("top", "50%", "important");
            circle.style.setProperty("transform", "translate(-50%, -50%)", "important");
            circle.style.setProperty("z-index", "0", "important");
            circle.style.setProperty("pointer-events", "none", "important");
            circle.style.setProperty("display", "block", "important");
            button.prepend(circle);
          } else {
            circle.style.setProperty("width", circle_size_range, "important");
            circle.style.setProperty("height", circle_size_range, "important");
            circle.style.setProperty("left", "calc(50% - 1px)", "important");
            circle.style.setProperty("transform", "translate(-50%, -50%)", "important");
            circle.style.setProperty("pointer-events", "none", "important");
          }
          circle.style.setProperty("display", "block", "important");

          const apply_white_text_start = () => {
            button.style.setProperty("color", "white", "important");
            button.style.setProperty("z-index", "2", "important");

            const all_elements = button.querySelectorAll("*");
            all_elements.forEach((element) => {
              const html_element = element as HTMLElement;
              if (
                !html_element.classList.contains("range-end-circle") &&
                !html_element.classList.contains("range-start-circle") &&
                !html_element.classList.contains("range-text-wrapper")
              ) {
                html_element.style.setProperty("color", "white", "important");
                html_element.style.setProperty("position", "relative", "important");
                html_element.style.setProperty("z-index", "2", "important");
              }
            });

            const walker = document.createTreeWalker(button, NodeFilter.SHOW_TEXT, null);
            let text_node;
            const text_nodes: Text[] = [];

            while ((text_node = walker.nextNode())) {
              if (text_node.textContent && text_node.textContent.trim()) {
                const parent = text_node.parentElement;
                if (parent && !parent.classList.contains("range-text-wrapper")) {
                  text_nodes.push(text_node as Text);
                }
              }
            }

            text_nodes.forEach((text_node) => {
              const parent = text_node.parentElement;
              if (parent && parent !== button) {
                if (!parent.classList.contains("range-text-wrapper")) {
                  const wrapper = document.createElement("span");
                  wrapper.className = "range-text-wrapper";
                  wrapper.style.setProperty("color", "white", "important");
                  wrapper.style.setProperty("position", "absolute", "important");
                  wrapper.style.setProperty("left", "0", "important");
                  wrapper.style.setProperty("right", "0", "important");
                  wrapper.style.setProperty("top", "0", "important");
                  wrapper.style.setProperty("bottom", "0", "important");
                  wrapper.style.setProperty("display", "flex", "important");
                  wrapper.style.setProperty("align-items", "center", "important");
                  wrapper.style.setProperty("justify-content", "center", "important");
                  wrapper.style.setProperty("z-index", "10", "important");
                  wrapper.style.setProperty("font-size", "inherit", "important");
                  wrapper.style.setProperty("transform", "translateX(-1px)", "important");
                  text_node.parentNode?.insertBefore(wrapper, text_node);
                  wrapper.appendChild(text_node);
                }
              } else if (parent === button) {
                const wrapper = document.createElement("span");
                wrapper.className = "range-text-wrapper";
                wrapper.style.setProperty("color", "white", "important");
                wrapper.style.setProperty("position", "absolute", "important");
                wrapper.style.setProperty("left", "0", "important");
                wrapper.style.setProperty("right", "0", "important");
                wrapper.style.setProperty("top", "0", "important");
                wrapper.style.setProperty("bottom", "0", "important");
                wrapper.style.setProperty("display", "flex", "important");
                wrapper.style.setProperty("align-items", "center", "important");
                wrapper.style.setProperty("justify-content", "center", "important");
                wrapper.style.setProperty("z-index", "10", "important");
                wrapper.style.setProperty("font-size", "inherit", "important");
                wrapper.style.setProperty("transform", "translateX(-1px)", "important");
                button.insertBefore(wrapper, text_node);
                wrapper.appendChild(text_node);
              }
            });
          };

          apply_white_text_start();
          setTimeout(apply_white_text_start, 0);
          setTimeout(apply_white_text_start, 100);
        }
      } else if (
        !is_outside &&
        has_range_class(class_list, "range_end") &&
        !has_both_start_and_end
      ) {
        const isMobile = window.innerWidth <= 768;
        const elementHeight = isMobile ? "18px" : "var(--rdp-cell-size)";

        element.style.setProperty("background-color", "transparent", "important");
        element.style.setProperty("color", "#444444", "important");
        element.style.setProperty("border-radius", "0", "important");
        element.style.setProperty("font-weight", "500", "important");
        element.style.setProperty("position", "relative", "important");
        element.style.setProperty("height", elementHeight, "important");
        element.style.setProperty("min-height", elementHeight, "important");
        element.style.setProperty("max-height", elementHeight, "important");
        element.style.setProperty("padding", "0", "important");

        if (button) {
          const buttonHeight = isMobile ? "18px" : "28px";
          button.style.setProperty("background-color", "rgba(255,86,148,0.1)", "important");
          button.style.setProperty("color", "white", "important");
          button.style.setProperty("border-radius", "0 50% 50% 0", "important");
          button.style.setProperty("width", "100%", "important");
          button.style.setProperty("height", buttonHeight, "important");
          button.style.setProperty("border", "none", "important");
          button.style.setProperty("padding", "0", "important");
          button.style.setProperty("margin", "0", "important");
          button.style.setProperty("font-weight", "500", "important");
          button.style.setProperty("display", "flex", "important");
          button.style.setProperty("align-items", "center", "important");
          button.style.setProperty("justify-content", "center", "important");
          button.style.setProperty("outline", "none", "important");
          button.style.setProperty("position", "relative", "important");

          const button_children = button.querySelectorAll("*");
          button_children.forEach((child) => {
            const child_element = child as HTMLElement;
            child_element.style.setProperty("color", "white", "important");
            child_element.style.setProperty("position", "relative", "important");
            child_element.style.setProperty("z-index", "2", "important");
          });

          button.style.setProperty("color", "white", "important");
          button.style.setProperty("z-index", "2", "important");

          let circle = button.querySelector(".range-end-circle") as HTMLElement;
          if (!circle) {
            circle = document.createElement("div");
            circle.className = "range-end-circle";
            const isMobile = window.innerWidth <= 768;
            const circleSize = isMobile ? "20px" : "32px";
            circle.style.setProperty("position", "absolute", "important");
            circle.style.setProperty("width", circleSize, "important");
            circle.style.setProperty("height", circleSize, "important");
            circle.style.setProperty("background-color", "#ff5694", "important");
            circle.style.setProperty("border-radius", "50%", "important");
            circle.style.setProperty("left", "50%", "important");
            circle.style.setProperty("top", "50%", "important");
            circle.style.setProperty("transform", "translate(-50%, -50%)", "important");
            circle.style.setProperty("z-index", "0", "important");
            circle.style.setProperty("pointer-events", "none", "important");
            button.prepend(circle);
          } else {
            const isMobile = window.innerWidth <= 768;
            const circleSize = isMobile ? "20px" : "32px";
            circle.style.setProperty("width", circleSize, "important");
            circle.style.setProperty("height", circleSize, "important");
            circle.style.setProperty("pointer-events", "none", "important");
          }
          circle.style.setProperty("display", "block", "important");

          const apply_white_text_end = () => {
            button.style.setProperty("color", "white", "important");
            button.style.setProperty("z-index", "2", "important");

            const all_elements = button.querySelectorAll("*");
            all_elements.forEach((element) => {
              const html_element = element as HTMLElement;
              if (
                !html_element.classList.contains("range-end-circle") &&
                !html_element.classList.contains("range-start-circle") &&
                !html_element.classList.contains("range-text-wrapper")
              ) {
                html_element.style.setProperty("color", "white", "important");
                html_element.style.setProperty("position", "relative", "important");
                html_element.style.setProperty("z-index", "10", "important");
              }
            });

            const walker = document.createTreeWalker(button, NodeFilter.SHOW_TEXT, null);
            let text_node;
            const text_nodes: Text[] = [];

            while ((text_node = walker.nextNode())) {
              if (text_node.textContent && text_node.textContent.trim()) {
                const parent = text_node.parentElement;
                if (parent && !parent.classList.contains("range-text-wrapper")) {
                  text_nodes.push(text_node as Text);
                }
              }
            }

            text_nodes.forEach((text_node) => {
              const parent = text_node.parentElement;
              if (parent && parent !== button) {
                if (!parent.classList.contains("range-text-wrapper")) {
                  const wrapper = document.createElement("span");
                  wrapper.className = "range-text-wrapper";
                  wrapper.style.setProperty("color", "white", "important");
                  wrapper.style.setProperty("position", "absolute", "important");
                  wrapper.style.setProperty("left", "0", "important");
                  wrapper.style.setProperty("right", "0", "important");
                  wrapper.style.setProperty("top", "0", "important");
                  wrapper.style.setProperty("bottom", "0", "important");
                  wrapper.style.setProperty("display", "flex", "important");
                  wrapper.style.setProperty("align-items", "center", "important");
                  wrapper.style.setProperty("justify-content", "center", "important");
                  wrapper.style.setProperty("z-index", "10", "important");
                  wrapper.style.setProperty("font-size", "inherit", "important");
                  text_node.parentNode?.insertBefore(wrapper, text_node);
                  wrapper.appendChild(text_node);
                }
              } else if (parent === button) {
                const wrapper = document.createElement("span");
                wrapper.className = "range-text-wrapper";
                wrapper.style.setProperty("color", "white", "important");
                wrapper.style.setProperty("position", "absolute", "important");
                wrapper.style.setProperty("left", "0", "important");
                wrapper.style.setProperty("right", "0", "important");
                wrapper.style.setProperty("top", "0", "important");
                wrapper.style.setProperty("bottom", "0", "important");
                wrapper.style.setProperty("display", "flex", "important");
                wrapper.style.setProperty("align-items", "center", "important");
                wrapper.style.setProperty("justify-content", "center", "important");
                wrapper.style.setProperty("z-index", "10", "important");
                wrapper.style.setProperty("font-size", "inherit", "important");
                button.insertBefore(wrapper, text_node);
                wrapper.appendChild(text_node);
              }
            });
          };

          apply_white_text_end();
          setTimeout(apply_white_text_end, 0);
          setTimeout(apply_white_text_end, 100);
        }
      }
    });

    // ========================================
    // 오늘 날짜 스타일 적용
    // ========================================

    /**
     * 오늘 날짜 스타일 적용 함수
     *
     * 오늘 날짜를 직접 계산하여 진한 회색 배경과 흰색 텍스트를 적용합니다.
     * react-day-picker의 클래스에 의존하지 않고 직접 날짜를 비교합니다.
     * 단, 선택된 날짜나 range 범위에 포함된 날짜는 제외합니다.
     *
     * 여러 번 호출하여 확실하게 스타일이 적용되도록 합니다.
     */
    const apply_today_styles = () => {
      if (!calendar_ref.current) return;

      // 오늘 날짜 계산 (시간 부분 제거)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const today_year = today.getFullYear();
      const today_month = today.getMonth();
      const today_date = today.getDate();
      // 모든 날짜 요소를 순회하면서 오늘 날짜 찾기
      const all_day_elements = calendar_ref.current.querySelectorAll("td.rdp-day, .rdp-day");

      all_day_elements.forEach((day_element) => {
        const element = day_element as HTMLElement;
        const class_list = element.classList;

        // 선택되거나 range에 포함된 날짜는 제외
        const is_range_or_selected =
          class_list.contains("rdp-day_selected") ||
          class_list.contains("rdp-range_start") ||
          class_list.contains("rdp-range_end") ||
          class_list.contains("rdp-range_middle") ||
          class_list.contains("rdp-day_range_start") ||
          class_list.contains("rdp-day_range_end") ||
          class_list.contains("rdp-day_range_middle") ||
          class_list.contains("rdp-day_outside");

        if (is_range_or_selected) {
          return;
        }

        // 버튼에서 날짜 정보 가져오기
        const button = element.querySelector("button") as HTMLElement;
        if (!button) return;

        // button의 aria-label이나 data 속성에서 날짜 정보 가져오기
        // 또는 button의 텍스트 내용에서 날짜 추출
        const button_text = button.textContent?.trim();
        if (!button_text) return;

        // 날짜 숫자 추출 (1-31)
        const day_number = parseInt(button_text, 10);
        if (isNaN(day_number) || day_number < 1 || day_number > 31) return;

        // 현재 표시 중인 월 정보 가져오기
        // 캘린더 헤더에서 월 정보 추출
        const month_container = element.closest(".rdp-month");
        if (!month_container) return;

        const caption = month_container.querySelector(".rdp-caption_label");
        if (!caption) return;

        const caption_text = caption.textContent?.trim() || "";
        // "2025년 12월" 형식에서 년도와 월 추출
        const year_match = caption_text.match(/(\d{4})년/);
        const month_match = caption_text.match(/(\d{1,2})월/);

        if (!year_match || !month_match) return;

        const display_year = parseInt(year_match[1], 10);
        const display_month = parseInt(month_match[1], 10) - 1; // 월은 0부터 시작

        // 오늘 날짜인지 확인
        if (
          display_year === today_year &&
          display_month === today_month &&
          day_number === today_date
        ) {
          // 오늘 날짜가 선택된 기간에 포함되어 있는지 확인
          const button_date = new Date(display_year, display_month, day_number);
          button_date.setHours(0, 0, 0, 0);
          const button_date_time = button_date.getTime();

          // 시작일만 선택된 경우
          const is_start_date =
            selected &&
            selected.from &&
            selected.to == null &&
            selected.from.getTime() === button_date_time;

          // 종료일만 선택된 경우
          const is_end_date =
            selected &&
            selected.from == null &&
            selected.to &&
            selected.to.getTime() === button_date_time;

          // 범위가 선택된 경우 (시작일 ~ 종료일)
          const is_in_range =
            selected &&
            selected.from &&
            selected.to &&
            selected.from.getTime() <= button_date_time &&
            button_date_time <= selected.to.getTime();

          // 시작일, 종료일, 또는 범위에 포함되어 있으면 오늘 날짜 스타일 적용하지 않음
          if (is_start_date || is_end_date || is_in_range) {
            return;
          }

          // 클래스 체크를 한 번 더 확인 (혹시 모를 경우를 대비)
          const is_range_or_selected_again =
            class_list.contains("rdp-day_selected") ||
            class_list.contains("rdp-range_start") ||
            class_list.contains("rdp-range_end") ||
            class_list.contains("rdp-range_middle") ||
            class_list.contains("rdp-day_range_start") ||
            class_list.contains("rdp-day_range_end") ||
            class_list.contains("rdp-day_range_middle");

          if (is_range_or_selected_again) {
            return;
          }

          // 해당 날짜 셀에 핑크색 테두리와 완만한(라운드) 테두리 적용, 배경색 없음, 글자색 핑크 (#FF5694)
          const isMobile = window.innerWidth <= 768;
          const todaySize = isMobile ? "20px" : "32px";

          element.style.setProperty("border-radius", "50%", "important");
          element.style.setProperty("background-color", "transparent", "important");
          element.style.setProperty("color", "#FF5694", "important");
          element.style.setProperty("box-sizing", "border-box", "important");
          element.style.setProperty("width", todaySize, "important");
          element.style.setProperty("height", todaySize, "important");
          element.style.setProperty("min-width", todaySize, "important");
          element.style.setProperty("min-height", todaySize, "important");
          element.style.setProperty("max-width", todaySize, "important");
          element.style.setProperty("max-height", todaySize, "important");
          element.style.setProperty("padding", "0", "important");
          element.style.setProperty("margin", "0", "important");

          // 버튼(숫자 포함)에도 동일하게 적용
          button.style.setProperty("border", "1px solid #FF5694", "important");
          button.style.setProperty("border-radius", "50%", "important");
          button.style.setProperty("background-color", "transparent", "important");
          button.style.setProperty("color", "#FF5694", "important");
          button.style.setProperty("box-sizing", "border-box", "important");
          button.style.setProperty("width", todaySize, "important");
          button.style.setProperty("height", todaySize, "important");
          button.style.setProperty("min-width", todaySize, "important");
          button.style.setProperty("min-height", todaySize, "important");
          button.style.setProperty("max-width", todaySize, "important");
          button.style.setProperty("max-height", todaySize, "important");
          button.style.setProperty("padding", "0", "important");
          button.style.setProperty("margin", "0", "important");
          button.style.setProperty("display", "flex", "important");
          button.style.setProperty("align-items", "center", "important");
          button.style.setProperty("justify-content", "center", "important");
        }
      });
    };

    // 오늘 날짜 스타일 적용 (react-day-picker 비동기 렌더 대응을 위해 0, 100ms에 한 번씩)
    apply_today_styles();
    setTimeout(apply_today_styles, 0);
    setTimeout(apply_today_styles, 100);

    requestAnimationFrame(() => {
      apply_today_styles();
      is_applying_styles_ref.current = false;
      last_apply_time_ref.current = Date.now();
      // 모바일: observer 재연결 지연으로 DOM 업데이트 완료 후 감시 시작 (깜빡임 감소)
      if (reconnect_timer_ref.current) {
        clearTimeout(reconnect_timer_ref.current);
        reconnect_timer_ref.current = null;
      }
      const reconnect = () => {
        reconnect_timer_ref.current = null;
        if (observer_ref.current && calendar_ref.current) {
          observer_ref.current.observe(calendar_ref.current, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["class"],
          });
        }
      };
      const reconnect_delay = window.innerWidth <= 768 ? 350 : 0;
      if (reconnect_delay > 0) {
        reconnect_timer_ref.current = setTimeout(reconnect, reconnect_delay);
      } else {
        reconnect();
      }
    });
  }, [selected, calendar_ref]);

  // ========================================
  // 전달 날짜 숨기기 함수
  // ========================================

  const hide_previous_month_days = useCallback(() => {
    if (!calendar_ref.current) return;

    const months = calendar_ref.current.querySelectorAll(".rdp-month");

    if (months.length >= 2) {
      const second_month = months[1] as HTMLElement;
      const outside_days = second_month.querySelectorAll(".rdp-day_outside");

      outside_days.forEach((day) => {
        const day_element = day as HTMLElement;
        const row = day_element.closest("tr");
        if (row) {
          const rows = Array.from(second_month.querySelectorAll("tbody tr"));
          const row_index = rows.indexOf(row);
          if (row_index === 0) {
            day_element.style.setProperty("display", "none", "important");
            day_element.style.setProperty("visibility", "hidden", "important");
            day_element.style.setProperty("opacity", "0", "important");
            day_element.style.setProperty("pointer-events", "none", "important");
            day_element.style.setProperty("width", "0", "important");
            day_element.style.setProperty("height", "0", "important");
            day_element.style.setProperty("padding", "0", "important");
            day_element.style.setProperty("margin", "0", "important");
          }
        }
      });
    }
  }, [calendar_ref]);

  // ========================================
  // selected 변경 시 스타일 적용
  // ========================================

  useEffect(() => {
    if (is_applying_styles_ref.current) return;

    const timeout_id = setTimeout(() => {
      apply_range_styles();
      hide_previous_month_days();
    }, 50);

    return () => {
      clearTimeout(timeout_id);
    };
  }, [selected, apply_range_styles, hide_previous_month_days]);

  // ========================================
  // 윈도우 리사이즈 시 스타일 재적용
  // ========================================

  useEffect(() => {
    let resize_timer: NodeJS.Timeout | null = null;
    const handle_resize = () => {
      if (resize_timer) clearTimeout(resize_timer);
      resize_timer = setTimeout(() => {
        resize_timer = null;
        if (!is_applying_styles_ref.current) {
          apply_range_styles();
          hide_previous_month_days();
        }
      }, 150);
    };

    window.addEventListener("resize", handle_resize);

    return () => {
      window.removeEventListener("resize", handle_resize);
      if (resize_timer) clearTimeout(resize_timer);
    };
  }, [apply_range_styles, hide_previous_month_days]);

  // ========================================
  // DOM 변경 감지 및 스타일 자동 적용
  // ========================================

  useEffect(() => {
    if (!calendar_ref.current) return;

    let debounce_timer: NodeJS.Timeout | null = null;

    const observer = new MutationObserver((mutations) => {
      if (is_applying_styles_ref.current) return;

      const is_our_change = mutations.some((mutation) => {
        if (mutation.type === "childList") {
          // 추가된 노드가 우리 컴포넌트 요소인지
          const added_is_ours = Array.from(mutation.addedNodes).some(
            (node) =>
              node instanceof HTMLElement &&
              (node.classList.contains("range-start-circle") ||
                node.classList.contains("range-end-circle") ||
                node.classList.contains("range-text-wrapper"))
          );
          if (added_is_ours) return true;
          // appendChild로 텍스트를 wrapper에 넣을 때 target이 range-text-wrapper가 됨 (우리 변경)
          const target = mutation.target as HTMLElement;
          if (
            target?.classList?.contains?.("range-text-wrapper") ||
            target?.closest?.(".range-start-circle") ||
            target?.closest?.(".range-end-circle")
          ) {
            return true;
          }
          return false;
        }
        if (mutation.type === "attributes") {
          const target = mutation.target as HTMLElement;
          if (
            target.classList.contains("range-start-circle") ||
            target.classList.contains("range-end-circle") ||
            target.classList.contains("range-text-wrapper")
          ) {
            return true;
          }
        }
        return false;
      });

      if (!is_our_change) {
        if (debounce_timer) {
          clearTimeout(debounce_timer);
        }
        debounce_timer = setTimeout(() => {
          // selected 변경으로 최근에 적용했으면 중복 실행 방지 (깜빡임 방지)
          // 모바일은 렌더가 느려 쿨다운을 더 길게
          const cooldown_ms = window.innerWidth <= 768 ? 600 : 400;
          if (Date.now() - last_apply_time_ref.current < cooldown_ms) return;
          if (!is_applying_styles_ref.current) {
            apply_range_styles();
            hide_previous_month_days();
          }
        }, 150);
      }
    });

    observer_ref.current = observer;
    observer.observe(calendar_ref.current, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });

    const initial_timeout = setTimeout(() => {
      apply_range_styles();
      hide_previous_month_days();
    }, 100);

    return () => {
      observer.disconnect();
      observer_ref.current = null;
      clearTimeout(initial_timeout);
      if (debounce_timer) clearTimeout(debounce_timer);
      if (reconnect_timer_ref.current) {
        clearTimeout(reconnect_timer_ref.current);
        reconnect_timer_ref.current = null;
      }
    };
  }, [apply_range_styles, hide_previous_month_days, calendar_ref]);
}
