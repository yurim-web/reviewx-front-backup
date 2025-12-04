/* ========================================
   📅 날짜 필터 섹션 컴포넌트
   ======================================== */

/**
 * 날짜 필터 섹션 컴포넌트
 *
 * 목적: 대시보드 페이지의 날짜 필터 기능을 제공하는 컴포넌트입니다.
 *
 * 주요 기능:
 * - 날짜 필터 버튼 (오늘/이번 주/이번 달)
 * - 커스텀 날짜 선택기 (스카이스캐너 스타일)
 * - 날짜 범위 선택 모달
 *
 */

'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import styles from '@/styles/manager_ga/dashboard/sections/date_filter_section.module.css';
import DateRangePickerModal, { type DateRange } from './DateRangePickerModal';

// 날짜 필터 타입 정의
export type DateFilter = 'today' | 'week' | 'month';

// DateFilterSection 컴포넌트의 props 타입 정의
interface DateFilterSectionProps {
  // 현재 선택된 날짜 필터
  dateFilter: DateFilter;
  // 날짜 필터 변경 함수
  onFilterChange: (filter: DateFilter) => void;
}

export default function DateFilterSection({
  dateFilter,
  onFilterChange,
}: DateFilterSectionProps) {
  // useState: 모달 열림/닫힘 상태를 관리하는 React Hook
  // [상태값, 상태를 변경하는 함수] = useState(초기값)
  const [is_date_modal_open, setIsDateModalOpen] = useState(false);

  // useState: 선택된 날짜 범위를 관리하는 상태
  const [selected_date_range, setSelectedDateRange] = useState<
    DateRange | undefined
  >(undefined);

  // 날짜 범위 적용 핸들러
  // 모달에서 날짜 범위를 선택하고 "적용" 버튼을 클릭했을 때 호출됩니다
  const handle_date_range_apply = (range: DateRange | undefined) => {
    setSelectedDateRange(range);
    // TODO: 실제로 날짜 필터링 로직을 부모 컴포넌트로 전달할 수 있습니다
    // 예: onDateRangeChange?.(range);
  };

  // 날짜 선택기 클릭 핸들러
  // 날짜 선택기를 클릭하면 모달을 엽니다
  const handle_picker_click = () => {
    setIsDateModalOpen(true);
  };

  // 날짜 범위 포맷팅 함수
  // 선택된 날짜 범위를 "YYYY-MM-DD ~ YYYY-MM-DD" 형식으로 변환합니다
  const format_date_range = (range: DateRange | undefined): string => {
    if (!range) {
      // 날짜 범위가 없으면 기본 텍스트 표시
      return '날짜를 선택해주세요';
    }

    if (range.from && range.to) {
      // 시작일과 종료일이 모두 있으면 범위 형식으로 표시
      return `${format(range.from, 'yyyy-MM-dd')} ~ ${format(
        range.to,
        'yyyy-MM-dd',
      )}`;
    } else if (range.from) {
      // 시작일만 있으면 시작일만 표시
      return `${format(range.from, 'yyyy-MM-dd')} ~`;
    } else {
      // 아무것도 선택하지 않았으면 기본 텍스트 표시
      return '날짜를 선택해주세요';
    }
  };

  return (
    <div className={styles.date_filter_section}>
      {/* 날짜 필터 버튼 그룹 */}
      <div className={styles.date_filter_section_button_group}>
        <button
          className={`${styles.date_filter_section_button} ${
            dateFilter === 'today'
              ? styles.date_filter_section_button_active
              : ''
          }`}
          onClick={() => onFilterChange('today')}
        >
          오늘
        </button>
        <button
          className={`${styles.date_filter_section_button} ${
            dateFilter === 'week'
              ? styles.date_filter_section_button_active
              : ''
          }`}
          onClick={() => onFilterChange('week')}
        >
          이번 주
        </button>
        <button
          className={`${styles.date_filter_section_button} ${
            dateFilter === 'month'
              ? styles.date_filter_section_button_active
              : ''
          }`}
          onClick={() => onFilterChange('month')}
        >
          이번 달
        </button>
      </div>

      {/* 날짜 선택기 - 클릭하면 모달이 열립니다 */}
      <div
        className={styles.date_filter_section_picker}
        onClick={handle_picker_click}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          // 키보드 접근성: Enter나 Space 키로도 모달을 열 수 있습니다
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsDateModalOpen(true);
          }
        }}
        aria-label="날짜 범위 선택"
      >
        {/* 날짜 선택 아이콘 */}
        <div className={styles.date_filter_section_picker_icon}></div>
        {/* 선택된 날짜 범위를 동적으로 표시 */}
        <span>{format_date_range(selected_date_range)}</span>
      </div>

      {/* 날짜 범위 선택 모달 */}
      <DateRangePickerModal
        is_open={is_date_modal_open}
        on_close={() => setIsDateModalOpen(false)}
        selected_range={selected_date_range}
        on_apply={handle_date_range_apply}
      />
    </div>
  );
}
