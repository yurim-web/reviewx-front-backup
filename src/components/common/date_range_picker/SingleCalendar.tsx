/* ========================================
   📅 단일 날짜 선택 캘린더 컴포넌트
   ======================================== */

/**
 * 단일 날짜 선택 캘린더 컴포넌트
 *
 * 목적: 하나의 날짜만 선택할 수 있는 캘린더입니다.
 *       RangeCalendar와 달리 날짜 범위가 아닌 단일 날짜를 선택합니다.
 *
 * 주요 기능:
 * - 단일 날짜 선택 (하나의 날짜만 선택 가능)
 * - 달력 한 개만 표시 (number_of_months=1)
 * - 한국어 로케일 지원
 */

"use client";

import { useRef, useEffect, useCallback } from "react";
import { DayPicker } from "react-day-picker";
import { ko } from "date-fns/locale";
import styles from "./range_calendar.module.css";

// ========================================
// 커스텀 아이콘 컴포넌트
// ========================================

/**
 * 이전 달 버튼 아이콘
 *
 * 왼쪽을 가리키는 화살표 아이콘입니다.
 * react-day-picker의 이전 달 버튼에 사용됩니다.
 */
function PreviousMonthIcon() {
  return (
    <img
      src="/images/calendar/calendar_left.svg"
      alt="이전 달"
      width="24"
      height="24"
    />
  );
}

/**
 * 다음 달 버튼 아이콘
 *
 * 오른쪽을 가리키는 화살표 아이콘입니다.
 * react-day-picker의 다음 달 버튼에 사용됩니다.
 */
function NextMonthIcon() {
  return (
    <img
      src="/images/calendar/calendar_right.svg"
      alt="다음 달"
      width="24"
      height="24"
    />
  );
}

// ========================================
// 타입 정의
// ========================================

interface SingleCalendarProps {
  /** 선택된 날짜 */
  selected: Date | undefined;
  /** 날짜 선택 시 호출되는 콜백 함수 */
  on_select: (date: Date | undefined) => void;
  /** 이전/다음 달 날짜 표시 여부 (기본값: false) */
  show_outside_days?: boolean;
}

// ========================================
// 단일 날짜 선택 캘린더 컴포넌트
// ========================================

/**
 * 단일 날짜 선택 캘린더 컴포넌트
 *
 * 설명:
 * - 하나의 날짜만 선택할 수 있는 캘린더입니다.
 * - 달력 한 개만 표시됩니다 (number_of_months=1).
 * - RangeCalendar와 달리 날짜 범위가 아닌 단일 날짜를 선택합니다.
 *
 * @param {SingleCalendarProps} props - 컴포넌트 props
 */
export default function SingleCalendar({
  selected,
  on_select,
  show_outside_days = false,
}: SingleCalendarProps) {
  // useRef: 캘린더 컨테이너의 참조를 저장
  // 설명: DOM 요소에 직접 접근하기 위해 사용합니다.
  const calendar_ref = useRef<HTMLDivElement>(null);
  const is_applying_styles_ref = useRef(false);

  /**
   * 날짜 선택 핸들러
   *
   * 설명:
   * - DayPicker에서 날짜를 선택했을 때 호출됩니다.
   * - 선택된 날짜를 on_select 콜백 함수로 전달합니다.
   */
  const handle_date_select = (date: Date | undefined) => {
    on_select(date);
  };

  /**
   * 오늘 날짜 스타일 적용 함수
   *
   * 설명:
   * - 오늘 날짜를 직접 계산하여 검정 테두리와 원형 스타일을 적용합니다.
   * - 선택된 날짜가 아닌 경우에만 적용합니다.
   * - RangeCalendar의 apply_today_styles와 동일한 로직입니다.
   */
  const apply_today_styles = useCallback(() => {
    if (!calendar_ref.current) return;

    // 오늘 날짜 계산 (시간 부분 제거)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const today_year = today.getFullYear();
    const today_month = today.getMonth();
    const today_date = today.getDate();

    // 모든 날짜 요소를 순회하면서 오늘 날짜 찾기
    const all_day_elements = calendar_ref.current.querySelectorAll(
      "td.rdp-day, .rdp-day"
    );

    all_day_elements.forEach((day_element) => {
      const element = day_element as HTMLElement;
      const class_list = element.classList;

      // 선택된 날짜는 제외
      if (class_list.contains("rdp-day_selected")) {
        return;
      }

      // 버튼에서 날짜 정보 가져오기
      const button = element.querySelector("button") as HTMLElement;
      if (!button) return;

      const button_text = button.textContent?.trim();
      if (!button_text) return;

      // 날짜 숫자 추출 (1-31)
      const day_number = parseInt(button_text, 10);
      if (isNaN(day_number) || day_number < 1 || day_number > 31) return;

      // 현재 표시 중인 월 정보 가져오기
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
        // 선택된 날짜인지 확인
        if (selected) {
          const button_date = new Date(display_year, display_month, day_number);
          button_date.setHours(0, 0, 0, 0);
          const selected_date = new Date(selected);
          selected_date.setHours(0, 0, 0, 0);

          if (button_date.getTime() === selected_date.getTime()) {
            // 선택된 날짜이면 오늘 날짜 스타일 적용하지 않음
            return;
          }
        }

        // 오늘 날짜 스타일 적용: 핑크색 테두리, 원형, 핑크색 텍스트
        element.style.setProperty("border-radius", "50%", "important");
        element.style.setProperty(
          "background-color",
          "transparent",
          "important"
        );
        element.style.setProperty("color", "#FF5694", "important");
        element.style.setProperty("box-sizing", "border-box", "important");
        element.style.setProperty("width", "32px", "important");
        element.style.setProperty("height", "32px", "important");
        element.style.setProperty("min-width", "32px", "important");
        element.style.setProperty("min-height", "32px", "important");
        element.style.setProperty("max-width", "32px", "important");
        element.style.setProperty("max-height", "32px", "important");
        element.style.setProperty("padding", "0", "important");
        element.style.setProperty("margin", "0", "important");

        // 버튼에도 동일하게 적용
        button.style.setProperty("border", "1px solid #FF5694", "important");
        button.style.setProperty("border-radius", "50%", "important");
        button.style.setProperty(
          "background-color",
          "transparent",
          "important"
        );
        button.style.setProperty("color", "#FF5694", "important");
        button.style.setProperty("box-sizing", "border-box", "important");
        button.style.setProperty("width", "32px", "important");
        button.style.setProperty("height", "32px", "important");
        button.style.setProperty("min-width", "32px", "important");
        button.style.setProperty("min-height", "32px", "important");
        button.style.setProperty("max-width", "32px", "important");
        button.style.setProperty("max-height", "32px", "important");
        button.style.setProperty("padding", "0", "important");
        button.style.setProperty("margin", "0", "important");
        button.style.setProperty("display", "flex", "important");
        button.style.setProperty("align-items", "center", "important");
        button.style.setProperty("justify-content", "center", "important");
      }
    });
  }, [selected]);

  /**
   * 선택된 날짜 스타일 적용 함수
   *
   * 설명:
   * - 선택된 날짜에 핑크색 배경(#ff5694)과 흰색 텍스트를 적용합니다.
   * - 원형 스타일을 적용합니다.
   * - RangeCalendar의 range_start 스타일과 동일합니다.
   */
  const apply_selected_styles = useCallback(() => {
    if (is_applying_styles_ref.current) return;

    is_applying_styles_ref.current = true;
    if (!calendar_ref.current) {
      is_applying_styles_ref.current = false;
      return;
    }

    // 모든 날짜 요소를 순회하면서 스타일 초기화
    const all_days = calendar_ref.current.querySelectorAll(
      "td.rdp-day, .rdp-day, [class*='rdp-day']"
    );
    all_days.forEach((day) => {
      const element = day as HTMLElement;
      const button = element.querySelector("button") as HTMLElement;
      const class_list = element.classList;

      // 오늘 날짜이면서 선택되지 않은 경우는 스타일 제거하지 않음
      const is_today_not_selected =
        class_list.contains("rdp-day_today") &&
        !class_list.contains("rdp-day_selected") &&
        !class_list.contains("rdp-day_outside");

      // 오늘 날짜가 아닌 경우에만 스타일 제거
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

        // 선택된 날짜 원형 배경 요소 제거
        const circle = button.querySelector(".selected-date-circle");
        if (circle) {
          circle.remove();
        }

        // 텍스트 wrapper 제거
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

    // 선택된 날짜에 스타일 적용
    // 방법 1: rdp-day_selected 클래스로 찾기
    const selected_days_by_class = calendar_ref.current.querySelectorAll(
      ".rdp-day_selected, [class*='rdp-day_selected']"
    );

    // 방법 2: selected prop을 기반으로 직접 날짜 찾기
    let selected_day_element: HTMLElement | null = null;
    if (selected) {
      const selected_year = selected.getFullYear();
      const selected_month = selected.getMonth();
      const selected_date = selected.getDate();

      // 모든 날짜 요소를 순회하면서 선택된 날짜 찾기
      const all_day_elements = calendar_ref.current.querySelectorAll(
        "td.rdp-day, .rdp-day"
      );

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

    // 선택된 날짜 요소들을 배열로 합치기
    const all_selected_days: HTMLElement[] = [];
    selected_days_by_class.forEach((day) => {
      all_selected_days.push(day as HTMLElement);
    });
    if (
      selected_day_element &&
      !all_selected_days.includes(selected_day_element)
    ) {
      all_selected_days.push(selected_day_element);
    }

    // 선택된 날짜에 스타일 적용
    all_selected_days.forEach((day) => {
      const element = day as HTMLElement;
      const button = element.querySelector("button") as HTMLElement;
      const class_list = element.classList;

      // 선택된 날짜인 경우 (range 클래스가 없는 경우만)
      if (
        (class_list.contains("rdp-day_selected") ||
          selected_day_element === element) &&
        !class_list.contains("rdp-day_range_start") &&
        !class_list.contains("rdp-day_range_end") &&
        !class_list.contains("rdp-day_range_middle")
      ) {
        element.style.setProperty(
          "background-color",
          "transparent",
          "important"
        );
        element.style.setProperty("color", "#444444", "important");
        element.style.setProperty("border-radius", "50%", "important");
        element.style.setProperty("font-weight", "500", "important");
        element.style.setProperty("position", "relative", "important");
        element.style.setProperty(
          "height",
          "var(--rdp-cell-size)",
          "important"
        );
        element.style.setProperty(
          "min-height",
          "var(--rdp-cell-size)",
          "important"
        );
        element.style.setProperty(
          "max-height",
          "var(--rdp-cell-size)",
          "important"
        );
        element.style.setProperty("padding", "0", "important");

        if (button) {
          // 선택된 날짜 버튼: 핑크색 배경, 흰색 텍스트, 원형
          button.style.setProperty("background-color", "#ff5694", "important");
          button.style.setProperty("color", "white", "important");
          button.style.setProperty("border-radius", "50%", "important");
          button.style.setProperty("width", "32px", "important");
          button.style.setProperty("height", "32px", "important");
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

          // 원형 배경 요소 추가 (RangeCalendar의 circle과 유사)
          let circle = button.querySelector(
            ".selected-date-circle"
          ) as HTMLElement;
          if (!circle) {
            circle = document.createElement("div");
            circle.className = "selected-date-circle";
            circle.style.setProperty("position", "absolute", "important");
            circle.style.setProperty("width", "32px", "important");
            circle.style.setProperty("height", "32px", "important");
            circle.style.setProperty(
              "background-color",
              "#ff5694",
              "important"
            );
            circle.style.setProperty("border-radius", "50%", "important");
            circle.style.setProperty("left", "50%", "important");
            circle.style.setProperty("top", "50%", "important");
            circle.style.setProperty(
              "transform",
              "translate(-50%, -50%)",
              "important"
            );
            circle.style.setProperty("z-index", "1", "important");
            button.appendChild(circle);
          }
          circle.style.setProperty("display", "block", "important");

          // 버튼 내부 모든 요소에 흰색 텍스트 적용
          const button_children = button.querySelectorAll("*");
          button_children.forEach((child) => {
            const child_element = child as HTMLElement;
            if (!child_element.classList.contains("selected-date-circle")) {
              child_element.style.setProperty("color", "white", "important");
              child_element.style.setProperty(
                "position",
                "relative",
                "important"
              );
              child_element.style.setProperty("z-index", "2", "important");
            }
          });

          // 텍스트 노드를 wrapper로 감싸서 흰색 텍스트 확실히 적용
          const apply_white_text = () => {
            button.style.setProperty("color", "white", "important");
            button.style.setProperty("z-index", "2", "important");
            button.style.setProperty(
              "background-color",
              "#ff5694",
              "important"
            );

            const all_elements = button.querySelectorAll("*");
            all_elements.forEach((element) => {
              const html_element = element as HTMLElement;
              if (
                !html_element.classList.contains("selected-date-circle") &&
                !html_element.classList.contains("range-text-wrapper")
              ) {
                html_element.style.setProperty("color", "white", "important");
                html_element.style.setProperty(
                  "position",
                  "relative",
                  "important"
                );
                html_element.style.setProperty("z-index", "2", "important");
              }
            });

            // 텍스트 노드를 wrapper로 감싸기
            const walker = document.createTreeWalker(
              button,
              NodeFilter.SHOW_TEXT,
              null
            );
            let text_node;
            const text_nodes: Text[] = [];

            while ((text_node = walker.nextNode())) {
              if (text_node.textContent && text_node.textContent.trim()) {
                const parent = text_node.parentElement;
                if (
                  parent &&
                  !parent.classList.contains("range-text-wrapper")
                ) {
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
                  wrapper.style.setProperty(
                    "position",
                    "relative",
                    "important"
                  );
                  wrapper.style.setProperty("z-index", "2", "important");
                  wrapper.style.setProperty(
                    "display",
                    "inline-block",
                    "important"
                  );

                  text_node.parentNode?.insertBefore(wrapper, text_node);
                  wrapper.appendChild(text_node);
                }
              } else if (parent === button) {
                const wrapper = document.createElement("span");
                wrapper.className = "range-text-wrapper";
                wrapper.style.setProperty("color", "white", "important");
                wrapper.style.setProperty("position", "relative", "important");
                wrapper.style.setProperty("z-index", "2", "important");
                wrapper.style.setProperty(
                  "display",
                  "inline-block",
                  "important"
                );

                button.insertBefore(wrapper, text_node);
                wrapper.appendChild(text_node);
              }
            });
          };

          // 여러 번 호출하여 확실하게 적용
          apply_white_text();
          setTimeout(apply_white_text, 0);
          setTimeout(apply_white_text, 50);
          setTimeout(apply_white_text, 100);
          setTimeout(apply_white_text, 200);
          setTimeout(apply_white_text, 300);
        }
      }
    });

    // 오늘 날짜 스타일 적용
    apply_today_styles();

    requestAnimationFrame(() => {
      // requestAnimationFrame 내에서도 한 번 더 적용
      apply_today_styles();
      is_applying_styles_ref.current = false;
    });
  }, [apply_today_styles]);

  // selected 변경 시 스타일 적용
  useEffect(() => {
    if (is_applying_styles_ref.current) return;

    // 즉시 적용
    apply_selected_styles();

    // 여러 번 호출하여 확실하게 적용
    const timeout1 = setTimeout(() => {
      apply_selected_styles();
    }, 0);

    const timeout2 = setTimeout(() => {
      apply_selected_styles();
    }, 50);

    const timeout3 = setTimeout(() => {
      apply_selected_styles();
    }, 100);

    const timeout4 = setTimeout(() => {
      apply_selected_styles();
    }, 200);

    const timeout5 = setTimeout(() => {
      apply_selected_styles();
    }, 300);

    const timeout6 = setTimeout(() => {
      apply_selected_styles();
    }, 500);

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

      // rdp-day_selected 클래스가 추가되었는지 확인
      const has_selected_class_added = mutations.some((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          const target = mutation.target as HTMLElement;
          if (target.classList.contains("rdp-day_selected")) {
            return true;
          }
        }
        if (mutation.type === "childList") {
          // 새로 추가된 노드에 rdp-day_selected 클래스가 있는지 확인
          return Array.from(mutation.addedNodes).some(
            (node) =>
              node instanceof HTMLElement &&
              (node.classList.contains("rdp-day_selected") ||
                node.querySelector?.(".rdp-day_selected"))
          );
        }
        return false;
      });

      // 우리가 만든 wrapper 변경은 무시
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

      // 선택된 날짜 클래스가 추가되었거나, 우리 변경이 아닌 경우 스타일 적용
      if (
        has_selected_class_added ||
        (!is_our_change && !has_selected_class_added)
      ) {
        if (debounce_timer) {
          clearTimeout(debounce_timer);
        }
        // 선택된 클래스가 추가된 경우 즉시 적용
        if (has_selected_class_added) {
          setTimeout(() => {
            if (!is_applying_styles_ref.current) {
              apply_selected_styles();
            }
          }, 0);
          setTimeout(() => {
            if (!is_applying_styles_ref.current) {
              apply_selected_styles();
            }
          }, 50);
        }
        debounce_timer = setTimeout(() => {
          if (!is_applying_styles_ref.current) {
            apply_selected_styles();
          }
        }, 150);
      }
    });

    observer.observe(calendar_ref.current, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });

    // 초기 마운트 시 스타일 적용
    // MutationObserver가 DOM 변경을 감지하지만, 초기 렌더링이 완료될 때까지 기다리기 위해
    // requestAnimationFrame과 setTimeout을 조합하여 적용
    const apply_initial_styles = () => {
      requestAnimationFrame(() => {
        apply_selected_styles();
        // 브라우저 렌더링 사이클 후 한 번 더 확인
        setTimeout(() => {
          apply_selected_styles();
        }, 100);
      });
    };

    // 초기 스타일 적용 시작
    apply_initial_styles();

    return () => {
      observer.disconnect();
      if (debounce_timer) {
        clearTimeout(debounce_timer);
      }
    };
  }, [apply_selected_styles]);

  // ========================================
  // 렌더링
  // ========================================

  return (
    <div ref={calendar_ref} className={styles.calendar_wrapper}>
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={handle_date_select}
        locale={ko}
        showOutsideDays={show_outside_days}
        numberOfMonths={1}
        className={styles.calendar}
        components={{
          Chevron: ({ orientation }) =>
            orientation === "left" ? <PreviousMonthIcon /> : <NextMonthIcon />,
        }}
      />
    </div>
  );
}
