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
 * - 커스텀 날짜 선택기
 *
 * 학습 포인트:
 * - props: 부모 컴포넌트에서 전달받은 데이터와 함수
 * - useState: React의 상태 관리 Hook
 * - 이벤트 핸들러: onClick으로 버튼 클릭 이벤트 처리
 * - 조건부 렌더링: 삼항 연산자로 활성화된 버튼에 다른 스타일 적용
 */

'use client';

import styles from '@/styles/manager_ga/dashboard/sections/date_filter_section.module.css';

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
  return (
    <div className={styles.date_filter_section}>
      {/* 날짜 필터 버튼 그룹 */}
      <div className={styles.date_filter_section_button_group}>
        <button
          className={`${styles.date_filter_section_button} ${
            dateFilter === 'today' ? styles.date_filter_section_button_active : ''
          }`}
          onClick={() => onFilterChange('today')}
        >
          오늘
        </button>
        <button
          className={`${styles.date_filter_section_button} ${
            dateFilter === 'week' ? styles.date_filter_section_button_active : ''
          }`}
          onClick={() => onFilterChange('week')}
        >
          이번 주
        </button>
        <button
          className={`${styles.date_filter_section_button} ${
            dateFilter === 'month' ? styles.date_filter_section_button_active : ''
          }`}
          onClick={() => onFilterChange('month')}
        >
          이번 달
        </button>
      </div>

      {/* 날짜 선택기 */}
      <div className={styles.date_filter_section_picker}>
        <div className={styles.date_filter_section_picker_icon}></div>
        <span>2025-11-01 ~ 2025-11-11</span>
      </div>
    </div>
  );
}
