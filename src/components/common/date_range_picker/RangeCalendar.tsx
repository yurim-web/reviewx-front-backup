/* ========================================
   날짜 범위 선택 캘린더 컴포넌트
   ======================================== */

/**
 * RangeCalendar
 *
 * 목적: react-day-picker 기반 날짜 범위 선택 캘린더 (시작일·종료일 선택)
 *
 * 사용 페이지:
 * - src/app/partner/campaign/edit/* (캠페인 날짜 설정)
 * - src/components/manager/common/campaign/ (관리자 캠페인 날짜 필터)
 */

"use client";

import { DayPicker, type DateRange as DayPickerDateRange } from "react-day-picker";
import { ko } from "date-fns/locale";
import styles from "./range_calendar.module.css";
import { PreviousMonthIcon, NextMonthIcon } from "./CalendarIcons";

// ========================================
// 타입 정의
// ========================================

export type DateRange = DayPickerDateRange;

interface RangeCalendarProps {
  selected: DateRange | undefined;
  on_select: (range: DateRange | undefined) => void;
  on_validation_error?: () => void; // 날짜 순서가 잘못되었을 때 호출
  number_of_months?: number;
  show_outside_days?: boolean;
}

// ========================================
// 날짜 범위 선택 캘린더 컴포넌트
// ========================================

export default function RangeCalendar({
  selected,
  on_select,
  on_validation_error,
  number_of_months = 2,
  show_outside_days = false,
}: RangeCalendarProps) {
  // ========================================
  // 날짜 선택 핸들러
  // ========================================

  const handle_date_select = (range: DateRange | undefined) => {
    if (!range) {
      on_select(undefined);
      return;
    }

    // 범위가 이미 완성되어 있는 경우 (from, to 모두 존재하고 다른 날짜)
    // -> 어떤 날짜를 클릭하든 무조건 초기화 후 새 시작일로 설정
    if (
      selected &&
      selected.from &&
      selected.to &&
      selected.from.getTime() !== selected.to.getTime()
    ) {
      if (range.from && range.to) {
        // 시작일을 다시 클릭한 경우: 기간 취소하고 해당 날짜만 선택
        if (
          range.from.getTime() === selected.from.getTime() &&
          range.to.getTime() === selected.from.getTime()
        ) {
          on_select({ from: selected.from, to: selected.from });
          return;
        }

        const clicked_date =
          range.from.getTime() === selected.from.getTime() ? range.to : range.from;
        on_select({ from: clicked_date, to: clicked_date });
        return;
      } else if (range.from) {
        on_select({ from: range.from, to: range.from });
        return;
      }
    }

    // 시작일만 선택된 상태(from === to)에서 종료일 선택
    if (
      selected &&
      selected.from &&
      selected.to &&
      selected.from.getTime() === selected.to.getTime()
    ) {
      if (range.from && range.to) {
        if (range.from.getTime() !== selected.from.getTime()) {
          if (on_validation_error) {
            on_validation_error();
          }
          return;
        }
        on_select({ from: range.from, to: range.to });
        return;
      }
    }

    // 첫 번째 선택: 시작일만 선택 (from과 to를 동일하게)
    if (range.from && !range.to) {
      on_select({ from: range.from, to: range.from });
      return;
    }

    // 범위 완성 (시작일 → 종료일 선택 완료)
    if (range.from && range.to) {
      on_select({ from: range.from, to: range.to });
      return;
    }

    on_select(undefined);
  };

  // ========================================
  // 렌더링
  // ========================================

  return (
    <div className={styles.calendar_wrapper}>
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
