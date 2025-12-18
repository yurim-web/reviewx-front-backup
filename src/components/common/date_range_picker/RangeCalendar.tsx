"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  DayPicker,
  type DateRange as DayPickerDateRange,
} from "react-day-picker";
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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.6759 18.7071C16.0664 18.3166 16.0664 17.6834 15.6759 17.2929L10.383 12L15.6759 6.7071C16.0664 6.31658 16.0664 5.68342 15.6759 5.29289C15.2853 4.90237 14.6522 4.90237 14.2616 5.29289L8.36771 11.1868C7.91861 11.6359 7.9186 12.3641 8.36771 12.8132L14.2616 18.7071C14.6522 19.0976 15.2853 19.0976 15.6759 18.7071Z"
        fill="#444444"
      />
    </svg>
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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.32414 18.7071C7.93362 18.3166 7.93362 17.6834 8.32414 17.2929L13.617 12L8.32414 6.7071C7.93362 6.31658 7.93362 5.68342 8.32414 5.29289C8.71467 4.90237 9.34783 4.90237 9.73836 5.29289L15.6323 11.1868C16.0814 11.6359 16.0814 12.3641 15.6323 12.8132L9.73836 18.7071C9.34783 19.0976 8.71467 19.0976 8.32414 18.7071Z"
        fill="#444444"
      />
    </svg>
  );
}

// ========================================
// 타입 정의
// ========================================

export type DateRange = DayPickerDateRange;

interface RangeCalendarProps {
  selected: DateRange | undefined;
  on_select: (range: DateRange | undefined) => void;
  number_of_months?: number;
  show_outside_days?: boolean;
}

// ========================================
// 날짜 범위 선택 캘린더 컴포넌트
// ========================================

export default function RangeCalendar({
  selected,
  on_select,
  number_of_months = 2,
  show_outside_days = false,
}: RangeCalendarProps) {
  // ========================================
  // Refs
  // ========================================

  const calendar_ref = useRef<HTMLDivElement>(null);
  const is_applying_styles_ref = useRef(false);
  const observer_ref = useRef<MutationObserver | null>(null);

  // ========================================
  // 날짜 선택 핸들러
  // ========================================

  const handle_date_select = (range: DateRange | undefined) => {
    if (!range) {
      on_select(undefined);
      return;
    }

    if (range.from && !range.to) {
      on_select({ from: range.from, to: undefined });
      return;
    }

    if (range.from && range.to) {
      if (range.from > range.to) {
        on_select({ from: range.to, to: range.from });
      } else {
        on_select({ from: range.from, to: range.to });
      }
      return;
    }

    on_select(undefined);
  };

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
    all_days.forEach((day) => {
      const element = day as HTMLElement;
      const button = element.querySelector("button") as HTMLElement;
      const class_list = element.classList;

      // 오늘 날짜이면서 선택되지 않고 range에 포함되지 않은 경우는 스타일 제거하지 않음
      const is_today_not_selected =
        class_list.contains("rdp-day_today") &&
        !class_list.contains("rdp-day_selected") &&
        !class_list.contains("rdp-day_range_start") &&
        !class_list.contains("rdp-day_range_end") &&
        !class_list.contains("rdp-day_range_middle") &&
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

      if (
        class_list.contains("rdp-day_range_middle") ||
        class_list.toString().includes("range_middle")
      ) {
        element.style.setProperty(
          "background-color",
          "transparent",
          "important"
        );
        element.style.setProperty("color", "#444444", "important");
        element.style.setProperty("border-radius", "0", "important");

        if (button) {
          button.style.setProperty("background-color", "#f5f5f5", "important");
          button.style.setProperty("color", "#444444", "important");
          button.style.setProperty("border", "none", "important");
          button.style.setProperty("border-radius", "0", "important");
          button.style.setProperty("width", "100%", "important");
          button.style.setProperty("height", "100%", "important");
          button.style.setProperty("display", "flex", "important");
          button.style.setProperty("align-items", "center", "important");
          button.style.setProperty("justify-content", "center", "important");
        }
      } else if (
        class_list.contains("rdp-day_range_start") ||
        class_list.toString().includes("range_start")
      ) {
        element.style.setProperty(
          "background-color",
          "transparent",
          "important"
        );
        element.style.setProperty("color", "#444444", "important");
        element.style.setProperty("border-radius", "0", "important");
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
          button.style.setProperty("background-color", "#f5f5f5", "important");
          button.style.setProperty("color", "white", "important");
          button.style.setProperty("border-radius", "50% 0 0 50%", "important");
          button.style.setProperty("width", "100%", "important");
          button.style.setProperty("height", "24px", "important");
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
            child_element.style.setProperty(
              "position",
              "relative",
              "important"
            );
            child_element.style.setProperty("z-index", "2", "important");
          });

          button.style.setProperty("color", "white", "important");
          button.style.setProperty("z-index", "2", "important");

          let circle = button.querySelector(
            ".range-start-circle"
          ) as HTMLElement;
          if (!circle) {
            circle = document.createElement("div");
            circle.className = "range-start-circle";
            circle.style.setProperty("position", "absolute", "important");
            circle.style.setProperty("width", "28px", "important");
            circle.style.setProperty("height", "28px", "important");
            circle.style.setProperty(
              "background-color",
              "#444444",
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
                html_element.style.setProperty(
                  "position",
                  "relative",
                  "important"
                );
                html_element.style.setProperty("z-index", "2", "important");
              }
            });

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

          apply_white_text_start();
          setTimeout(apply_white_text_start, 0);
          setTimeout(apply_white_text_start, 50);
          setTimeout(apply_white_text_start, 100);
          setTimeout(apply_white_text_start, 200);
          setTimeout(apply_white_text_start, 300);
        }
      } else if (
        class_list.contains("rdp-day_range_end") ||
        class_list.toString().includes("range_end")
      ) {
        element.style.setProperty(
          "background-color",
          "transparent",
          "important"
        );
        element.style.setProperty("color", "#444444", "important");
        element.style.setProperty("border-radius", "0", "important");
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
          button.style.setProperty("background-color", "#f5f5f5", "important");
          button.style.setProperty("color", "white", "important");
          button.style.setProperty("border-radius", "0 50% 50% 0", "important");
          button.style.setProperty("width", "100%", "important");
          button.style.setProperty("height", "24px", "important");
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
            child_element.style.setProperty(
              "position",
              "relative",
              "important"
            );
            child_element.style.setProperty("z-index", "2", "important");
          });

          button.style.setProperty("color", "white", "important");
          button.style.setProperty("z-index", "2", "important");

          let circle = button.querySelector(".range-end-circle") as HTMLElement;
          if (!circle) {
            circle = document.createElement("div");
            circle.className = "range-end-circle";
            circle.style.setProperty("position", "absolute", "important");
            circle.style.setProperty("width", "28px", "important");
            circle.style.setProperty("height", "28px", "important");
            circle.style.setProperty(
              "background-color",
              "#444444",
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
                html_element.style.setProperty(
                  "position",
                  "relative",
                  "important"
                );
                html_element.style.setProperty("z-index", "2", "important");
              }
            });

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

          apply_white_text_end();
          setTimeout(apply_white_text_end, 0);
          setTimeout(apply_white_text_end, 50);
          setTimeout(apply_white_text_end, 100);
          setTimeout(apply_white_text_end, 200);
          setTimeout(apply_white_text_end, 300);
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
      const all_day_elements = calendar_ref.current.querySelectorAll(
        "td.rdp-day, .rdp-day"
      );

      all_day_elements.forEach((day_element) => {
        const element = day_element as HTMLElement;
        const class_list = element.classList;

        // 선택되거나 range에 포함된 날짜는 제외
        // 클래스명에 range 관련 문자열이 포함되어 있는지도 확인
        const has_range_class =
          class_list.contains("rdp-day_selected") ||
          class_list.contains("rdp-day_range_start") ||
          class_list.contains("rdp-day_range_end") ||
          class_list.contains("rdp-day_range_middle") ||
          class_list.toString().includes("range_start") ||
          class_list.toString().includes("range_end") ||
          class_list.toString().includes("range_middle") ||
          class_list.contains("rdp-day_outside");

        if (has_range_class) {
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
            !selected.to &&
            selected.from.getTime() === button_date_time;

          // 종료일만 선택된 경우
          const is_end_date =
            selected &&
            !selected.from &&
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
          const has_range_class_again =
            class_list.contains("rdp-day_selected") ||
            class_list.contains("rdp-day_range_start") ||
            class_list.contains("rdp-day_range_end") ||
            class_list.contains("rdp-day_range_middle") ||
            class_list.toString().includes("range_start") ||
            class_list.toString().includes("range_end") ||
            class_list.toString().includes("range_middle");

          if (has_range_class_again) {
            return;
          }

          // 해당 날짜 셀에 검정 테두리와 완만한(라운드) 테두리 적용, 배경색 없음, 글자색 진회색 (#444)
          element.style.setProperty("border-radius", "50%", "important");
          element.style.setProperty(
            "background-color",
            "transparent",
            "important"
          );
          element.style.setProperty("color", "#444444", "important");
          element.style.setProperty("box-sizing", "border-box", "important");
          element.style.setProperty("width", "32px", "important");
          element.style.setProperty("height", "32px", "important");
          element.style.setProperty("min-width", "32px", "important");
          element.style.setProperty("min-height", "32px", "important");
          element.style.setProperty("max-width", "32px", "important");
          element.style.setProperty("max-height", "32px", "important");
          element.style.setProperty("padding", "0", "important");
          element.style.setProperty("margin", "0", "important");

          // 버튼(숫자 포함)에도 동일하게 적용
          button.style.setProperty("border", "1px solid #444444", "important");
          button.style.setProperty("border-radius", "50%", "important");
          button.style.setProperty(
            "background-color",
            "transparent",
            "important"
          );
          button.style.setProperty("color", "#444444", "important");
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
    };

    // 오늘 날짜 스타일 적용 (여러 번 호출하여 확실하게 적용)
    apply_today_styles();
    setTimeout(apply_today_styles, 0);
    setTimeout(apply_today_styles, 50);
    setTimeout(apply_today_styles, 100);
    setTimeout(apply_today_styles, 200);
    setTimeout(apply_today_styles, 300);

    requestAnimationFrame(() => {
      // requestAnimationFrame 내에서도 한 번 더 적용
      apply_today_styles();
      is_applying_styles_ref.current = false;
      if (observer_ref.current && calendar_ref.current) {
        observer_ref.current.observe(calendar_ref.current, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["class"],
        });
      }
    });
  }, []);

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
            day_element.style.setProperty(
              "pointer-events",
              "none",
              "important"
            );
            day_element.style.setProperty("width", "0", "important");
            day_element.style.setProperty("height", "0", "important");
            day_element.style.setProperty("padding", "0", "important");
            day_element.style.setProperty("margin", "0", "important");
          }
        }
      });
    }
  }, []);

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
  // DOM 변경 감지 및 스타일 자동 적용
  // ========================================

  useEffect(() => {
    if (!calendar_ref.current) return;

    let debounce_timer: NodeJS.Timeout | null = null;

    const observer = new MutationObserver((mutations) => {
      if (is_applying_styles_ref.current) return;

      const is_our_change = mutations.some((mutation) => {
        if (mutation.type === "childList") {
          return Array.from(mutation.addedNodes).some(
            (node) =>
              node instanceof HTMLElement &&
              (node.classList.contains("range-start-circle") ||
                node.classList.contains("range-end-circle") ||
                node.classList.contains("range-text-wrapper"))
          );
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
      if (debounce_timer) {
        clearTimeout(debounce_timer);
      }
    };
  }, [apply_range_styles, hide_previous_month_days]);

  // ========================================
  // 렌더링
  // ========================================

  return (
    <div ref={calendar_ref} className={styles.calendar_wrapper}>
      <DayPicker
        mode="range"
        selected={selected}
        onSelect={handle_date_select}
        locale={ko}
        showOutsideDays={show_outside_days}
        numberOfMonths={number_of_months}
        className={styles.calendar}
        components={{
          Chevron: ({ orientation }) =>
            orientation === "left" ? <PreviousMonthIcon /> : <NextMonthIcon />,
        }}
      />
    </div>
  );
}
