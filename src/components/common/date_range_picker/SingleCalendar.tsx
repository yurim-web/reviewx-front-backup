/* ========================================
   단일 날짜 선택 캘린더 컴포넌트
   ======================================== */

/**
 * SingleCalendar
 *
 * 목적: react-day-picker 기반 단일 날짜 선택 캘린더
 *
 * 사용 페이지:
 * - src/components/manager/common/campaign/ (관리자 캠페인 날짜 필터)
 */

"use client";

import { DayPicker } from "react-day-picker";
import { ko } from "date-fns/locale";
import styles from "./range_calendar.module.css";
import { PreviousMonthIcon, NextMonthIcon } from "./CalendarIcons";

// ========================================
// 타입 정의
// ========================================

interface SingleCalendarProps {
  selected: Date | undefined;
  on_select: (date: Date | undefined) => void;
  show_outside_days?: boolean;
}

// ========================================
// 단일 날짜 선택 캘린더 컴포넌트
// ========================================

export default function SingleCalendar({
  selected,
  on_select,
  show_outside_days = false,
}: SingleCalendarProps) {
  return (
    <div className={styles.single_calendar_wrapper}>
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={on_select}
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
