/* ========================================
   대시보드 날짜 필터 커스텀 훅
   ======================================== */

/**
 * useDashboardDateFilter
 *
 * 목적: 관리자 대시보드의 날짜 필터 상태 관리 로직을 재사용 가능한 훅으로 추상화합니다.
 *
 * 사용 페이지:
 * - /manager_sa (최고관리자 대시보드)
 * - /manager_ga (일반관리자 대시보드)
 */

"use client";

import { useState, useMemo, useCallback } from "react";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import type { DateFilter } from "@/components/manager/ga/dashboard/section/DateFilterSection";
import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";

interface UseDashboardDateFilterReturn {
  dateFilter: DateFilter;
  dateRange: DateRange;
  handleDateFilterChange: (filter: DateFilter) => void;
  handleDateRangeChange: (range: DateRange | undefined) => void;
}

export function useDashboardDateFilter(
  initialFilter: DateFilter = "month"
): UseDashboardDateFilterReturn {
  const [dateFilter, setDateFilter] = useState<DateFilter>(initialFilter);
  const [custom_date_range, setCustomDateRange] = useState<DateRange | undefined>(undefined);

  const handleDateFilterChange = useCallback((filter: DateFilter) => {
    setDateFilter(filter);
    setCustomDateRange(undefined);
  }, []);

  const handleDateRangeChange = useCallback((range: DateRange | undefined) => {
    setCustomDateRange(range);
  }, []);

  const dateRange = useMemo<DateRange>(() => {
    if (custom_date_range) return custom_date_range;

    const today = new Date();
    switch (dateFilter) {
      case "today":
        return { from: startOfDay(today), to: endOfDay(today) };
      case "week":
        return {
          from: startOfWeek(today, { weekStartsOn: 0 }),
          to: endOfWeek(today, { weekStartsOn: 0 }),
        };
      case "month":
        return { from: startOfMonth(today), to: endOfMonth(today) };
    }
  }, [dateFilter, custom_date_range]);

  return {
    dateFilter,
    dateRange,
    handleDateFilterChange,
    handleDateRangeChange,
  };
}
