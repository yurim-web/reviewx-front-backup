/* ========================================
   단일 날짜 선택 캘린더 스타일 적용 훅
   ======================================== */

/**
 * useSingleCalendarStyles
 *
 * 목적: SingleCalendar 컴포넌트의 DOM 기반 날짜 스타일 적용 로직을 관리합니다.
 *       선택된 날짜(핑크 원형)와 오늘 날짜(핑크 테두리)를 react-day-picker DOM에 직접 적용합니다.
 *
 * 사용 페이지:
 * - SingleCalendar.tsx (단일 날짜 선택 캘린더)
 */

import { useRef, useCallback, useEffect, type RefObject } from "react";

// ========================================
// 단일 날짜 스타일 적용 훅
// ========================================

export function useSingleCalendarStyles(
  selected: Date | undefined
): RefObject<HTMLDivElement | null> {
  const calendar_ref = useRef<HTMLDivElement>(null);
  const is_applying_styles_ref = useRef(false);

  // ========================================
  // 오늘 날짜 스타일 적용
  // ========================================

  const apply_today_styles = useCallback(() => {
    if (!calendar_ref.current) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const today_year = today.getFullYear();
    const today_month = today.getMonth();
    const today_date = today.getDate();

    const all_day_elements = calendar_ref.current.querySelectorAll("td.rdp-day, .rdp-day");

    all_day_elements.forEach((day_element) => {
      const element = day_element as HTMLElement;
      const class_list = element.classList;

      if (class_list.contains("rdp-day_selected")) return;

      const button = element.querySelector("button") as HTMLElement;
      if (!button) return;

      const button_text = button.textContent?.trim();
      if (!button_text) return;

      const day_number = parseInt(button_text, 10);
      if (isNaN(day_number) || day_number < 1 || day_number > 31) return;

      const month_container = element.closest(".rdp-month");
      if (!month_container) return;

      const caption = month_container.querySelector(".rdp-caption_label");
      if (!caption) return;

      const caption_text = caption.textContent?.trim() || "";
      const year_match = caption_text.match(/(\d{4})년/);
      const month_match = caption_text.match(/(\d{1,2})월/);

      if (!year_match || !month_match) return;

      const display_year = parseInt(year_match[1], 10);
      const display_month = parseInt(month_match[1], 10) - 1;

      if (
        display_year === today_year &&
        display_month === today_month &&
        day_number === today_date
      ) {
        if (selected) {
          const button_date = new Date(display_year, display_month, day_number);
          button_date.setHours(0, 0, 0, 0);
          const selected_date = new Date(selected);
          selected_date.setHours(0, 0, 0, 0);

          if (button_date.getTime() === selected_date.getTime()) return;
        }

        const isMobile = window.innerWidth <= 768;
        const todaySize = isMobile ? "28px" : "32px";

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
  }, [selected]);

  // ========================================
  // 선택된 날짜 스타일 적용
  // ========================================

  const apply_selected_styles = useCallback(() => {
    if (is_applying_styles_ref.current) return;

    is_applying_styles_ref.current = true;
    if (!calendar_ref.current) {
      is_applying_styles_ref.current = false;
      return;
    }

    // 모든 날짜 스타일 초기화
    const all_days = calendar_ref.current.querySelectorAll(
      "td.rdp-day, .rdp-day, [class*='rdp-day']"
    );
    all_days.forEach((day) => {
      const element = day as HTMLElement;
      const button = element.querySelector("button") as HTMLElement;
      const class_list = element.classList;

      const is_today_not_selected =
        class_list.contains("rdp-day_today") &&
        !class_list.contains("rdp-day_selected") &&
        !class_list.contains("rdp-day_outside");

      if (!is_today_not_selected) {
        element.style.removeProperty("background-color");
        element.style.removeProperty("color");
        element.style.removeProperty("border-radius");
        element.style.removeProperty("font-weight");
        element.style.removeProperty("position");
        element.style.removeProperty("height");
        element.style.removeProperty("min-height");
        element.style.removeProperty("max-height");
        element.style.removeProperty("padding");
        element.style.removeProperty("border");
        element.style.removeProperty("width");
      }

      if (button && !is_today_not_selected) {
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

        const circle = button.querySelector(".selected-date-circle");
        if (circle) circle.remove();

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

    // 방법 1: rdp-day_selected 클래스로 찾기
    const selected_days_by_class = calendar_ref.current.querySelectorAll(
      ".rdp-day_selected, [class*='rdp-day_selected']"
    );

    // 방법 2: selected prop 기반으로 직접 날짜 찾기
    let selected_day_element: HTMLElement | null = null;
    if (selected) {
      const selected_year = selected.getFullYear();
      const selected_month = selected.getMonth();
      const selected_date = selected.getDate();

      const all_day_elements = calendar_ref.current.querySelectorAll("td.rdp-day, .rdp-day");

      all_day_elements.forEach((day_element) => {
        const element = day_element as HTMLElement;
        const button = element.querySelector("button") as HTMLElement;
        if (!button) return;

        const button_text = button.textContent?.trim();
        if (!button_text) return;

        const day_number = parseInt(button_text, 10);
        if (isNaN(day_number) || day_number < 1 || day_number > 31) return;

        const month_container = element.closest(".rdp-month");
        if (!month_container) return;

        const caption = month_container.querySelector(".rdp-caption_label");
        if (!caption) return;

        const caption_text = caption.textContent?.trim() || "";
        const year_match = caption_text.match(/(\d{4})년/);
        const month_match = caption_text.match(/(\d{1,2})월/);

        if (!year_match || !month_match) return;

        const display_year = parseInt(year_match[1], 10);
        const display_month = parseInt(month_match[1], 10) - 1;

        if (
          display_year === selected_year &&
          display_month === selected_month &&
          day_number === selected_date
        ) {
          selected_day_element = element;
        }
      });
    }

    const all_selected_days: HTMLElement[] = [];
    selected_days_by_class.forEach((day) => {
      all_selected_days.push(day as HTMLElement);
    });
    if (selected_day_element && !all_selected_days.includes(selected_day_element)) {
      all_selected_days.push(selected_day_element);
    }

    all_selected_days.forEach((day) => {
      const element = day as HTMLElement;
      const button = element.querySelector("button") as HTMLElement;
      const class_list = element.classList;

      if (
        (class_list.contains("rdp-day_selected") || selected_day_element === element) &&
        !class_list.contains("rdp-day_range_start") &&
        !class_list.contains("rdp-day_range_end") &&
        !class_list.contains("rdp-day_range_middle")
      ) {
        element.style.setProperty("background-color", "transparent", "important");
        element.style.setProperty("color", "#444444", "important");
        element.style.setProperty("border-radius", "50%", "important");
        element.style.setProperty("font-weight", "500", "important");
        element.style.setProperty("position", "relative", "important");
        element.style.setProperty("height", "var(--rdp-cell-size)", "important");
        element.style.setProperty("min-height", "var(--rdp-cell-size)", "important");
        element.style.setProperty("max-height", "var(--rdp-cell-size)", "important");
        element.style.setProperty("padding", "0", "important");

        if (button) {
          const isMobile = window.innerWidth <= 768;
          const buttonSize = isMobile ? "28px" : "32px";

          button.style.setProperty("background-color", "#ff5694", "important");
          button.style.setProperty("color", "white", "important");
          button.style.setProperty("border-radius", "50%", "important");
          button.style.setProperty("width", buttonSize, "important");
          button.style.setProperty("height", buttonSize, "important");
          button.style.setProperty("border", "none", "important");
          button.style.setProperty("padding", "0", "important");
          button.style.setProperty("margin", "0", "important");
          button.style.setProperty("font-weight", "500", "important");
          button.style.setProperty("display", "flex", "important");
          button.style.setProperty("align-items", "center", "important");
          button.style.setProperty("justify-content", "center", "important");
          button.style.setProperty("outline", "none", "important");
          button.style.setProperty("position", "relative", "important");
          button.style.setProperty("z-index", "2", "important");

          let circle = button.querySelector(".selected-date-circle") as HTMLElement;
          if (!circle) {
            circle = document.createElement("div");
            circle.className = "selected-date-circle";
            circle.style.setProperty("position", "absolute", "important");
            circle.style.setProperty("width", buttonSize, "important");
            circle.style.setProperty("height", buttonSize, "important");
            circle.style.setProperty("background-color", "#ff5694", "important");
            circle.style.setProperty("border-radius", "50%", "important");
            circle.style.setProperty("left", "50%", "important");
            circle.style.setProperty("top", "50%", "important");
            circle.style.setProperty("transform", "translate(-50%, -50%)", "important");
            circle.style.setProperty("z-index", "1", "important");
            button.appendChild(circle);
          } else {
            circle.style.setProperty("width", buttonSize, "important");
            circle.style.setProperty("height", buttonSize, "important");
          }
          circle.style.setProperty("display", "block", "important");

          const button_children = button.querySelectorAll("*");
          button_children.forEach((child) => {
            const child_element = child as HTMLElement;
            if (!child_element.classList.contains("selected-date-circle")) {
              child_element.style.setProperty("color", "white", "important");
              child_element.style.setProperty("position", "relative", "important");
              child_element.style.setProperty("z-index", "2", "important");
            }
          });

          const apply_white_text = () => {
            button.style.setProperty("color", "white", "important");
            button.style.setProperty("z-index", "2", "important");
            button.style.setProperty("background-color", "#ff5694", "important");

            const all_elements = button.querySelectorAll("*");
            all_elements.forEach((el) => {
              const html_element = el as HTMLElement;
              if (
                !html_element.classList.contains("selected-date-circle") &&
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

            text_nodes.forEach((tn) => {
              const parent = tn.parentElement;
              if (parent && parent !== button) {
                if (!parent.classList.contains("range-text-wrapper")) {
                  const wrapper = document.createElement("span");
                  wrapper.className = "range-text-wrapper";
                  wrapper.style.setProperty("color", "white", "important");
                  wrapper.style.setProperty("position", "relative", "important");
                  wrapper.style.setProperty("z-index", "2", "important");
                  wrapper.style.setProperty("display", "inline-block", "important");
                  tn.parentNode?.insertBefore(wrapper, tn);
                  wrapper.appendChild(tn);
                }
              } else if (parent === button) {
                const wrapper = document.createElement("span");
                wrapper.className = "range-text-wrapper";
                wrapper.style.setProperty("color", "white", "important");
                wrapper.style.setProperty("position", "relative", "important");
                wrapper.style.setProperty("z-index", "2", "important");
                wrapper.style.setProperty("display", "inline-block", "important");
                button.insertBefore(wrapper, tn);
                wrapper.appendChild(tn);
              }
            });
          };

          apply_white_text();
          setTimeout(apply_white_text, 0);
          setTimeout(apply_white_text, 50);
          setTimeout(apply_white_text, 100);
          setTimeout(apply_white_text, 200);
          setTimeout(apply_white_text, 300);
        }
      }
    });

    apply_today_styles();

    requestAnimationFrame(() => {
      apply_today_styles();
      is_applying_styles_ref.current = false;
    });
  }, [apply_today_styles, selected]);

  // ========================================
  // Effects
  // ========================================

  // selected 변경 시 스타일 적용
  useEffect(() => {
    if (is_applying_styles_ref.current) return;

    apply_selected_styles();

    const timeout1 = setTimeout(() => apply_selected_styles(), 0);
    const timeout2 = setTimeout(() => apply_selected_styles(), 50);
    const timeout3 = setTimeout(() => apply_selected_styles(), 100);
    const timeout4 = setTimeout(() => apply_selected_styles(), 200);
    const timeout5 = setTimeout(() => apply_selected_styles(), 300);
    const timeout6 = setTimeout(() => apply_selected_styles(), 500);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      clearTimeout(timeout4);
      clearTimeout(timeout5);
      clearTimeout(timeout6);
    };
  }, [selected, apply_selected_styles]);

  // DOM 변경 감지 및 스타일 자동 적용
  useEffect(() => {
    if (!calendar_ref.current) return;

    let debounce_timer: NodeJS.Timeout | null = null;

    const observer = new MutationObserver((mutations) => {
      if (is_applying_styles_ref.current) return;

      const has_selected_class_added = mutations.some((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          const target = mutation.target as HTMLElement;
          if (target.classList.contains("rdp-day_selected")) return true;
        }
        if (mutation.type === "childList") {
          return Array.from(mutation.addedNodes).some(
            (node) =>
              node instanceof HTMLElement &&
              (node.classList.contains("rdp-day_selected") ||
                node.querySelector?.(".rdp-day_selected"))
          );
        }
        return false;
      });

      const is_our_change = mutations.some((mutation) => {
        if (mutation.type === "childList") {
          return Array.from(mutation.addedNodes).some(
            (node) =>
              node instanceof HTMLElement &&
              (node.classList.contains("range-text-wrapper") ||
                node.classList.contains("selected-date-circle"))
          );
        }
        if (mutation.type === "attributes") {
          const target = mutation.target as HTMLElement;
          if (
            target.classList.contains("range-text-wrapper") ||
            target.classList.contains("selected-date-circle")
          ) {
            return true;
          }
        }
        return false;
      });

      if (has_selected_class_added || (!is_our_change && !has_selected_class_added)) {
        if (debounce_timer) clearTimeout(debounce_timer);

        if (has_selected_class_added) {
          setTimeout(() => {
            if (!is_applying_styles_ref.current) apply_selected_styles();
          }, 0);
          setTimeout(() => {
            if (!is_applying_styles_ref.current) apply_selected_styles();
          }, 50);
        }

        debounce_timer = setTimeout(() => {
          if (!is_applying_styles_ref.current) apply_selected_styles();
        }, 150);
      }
    });

    observer.observe(calendar_ref.current, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });

    const apply_initial_styles = () => {
      requestAnimationFrame(() => {
        apply_selected_styles();
        setTimeout(() => apply_selected_styles(), 100);
      });
    };

    apply_initial_styles();

    return () => {
      observer.disconnect();
      if (debounce_timer) clearTimeout(debounce_timer);
    };
  }, [apply_selected_styles]);

  return calendar_ref;
}
