/* ========================================
   🏠 GA 관리자 대시보드 메인 페이지
   ======================================== */

/**
 * GA 관리자 대시보드 메인 페이지
 *
 * 목적: GA 관리자의 대시보드로, 주요 통계와 현황을 한눈에 볼 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_ga
 *
 * 주요 기능:
 * - 날짜 필터 (오늘/이번 주/이번 달, 커스텀 날짜 선택)
 * - 캠페인 관리 요약 통계 (모집률, 달성률, 반려율, 신고율)
 * - 캠페인 모집 통계 차트
 * - 반려/신고 통계 차트
 * - 접속 통계 및 디바이스 통계
 * - 전체 회원 통계 (활성화 비율, 파트너/리뷰어 통계)
 * - 채널별 회원 통계
 *
 */

'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
} from 'date-fns';
import layoutStyles from '@/styles/manager_ga/layout/layout.module.css';
import ManagerPageTitle from '@/components/manager/common/fragments/ManagerPageTitle';
import DateFilterSection, {
  DateFilter,
} from '@/components/manager/ga/dashboard/section/DateFilterSection';
import CampaignSummarySection from '@/components/manager/ga/dashboard/section/CampaignSummarySection';
import ChartsSection from '@/components/manager/ga/dashboard/ChartsSection';
import MemberStatsSection from '@/components/manager/ga/dashboard/MemberStatsSection';
import type { DateRange } from '@/components/manager/ga/dashboard/section/DateRangePickerModal';

export default function ManagerGAPage() {
  // 날짜 필터 상태 관리
  // useState는 React의 Hook으로, 컴포넌트의 상태를 관리합니다
  // [현재 값, 값을 변경하는 함수] 형태로 반환됩니다
  const [dateFilter, setDateFilter] = useState<DateFilter>('month');

  // 커스텀 날짜 범위 상태 관리
  // 사용자가 날짜 선택기에서 직접 날짜 범위를 선택한 경우 사용
  const [custom_date_range, setCustomDateRange] = useState<
    DateRange | undefined
  >(undefined);

  // 날짜 필터 변경 핸들러
  // 이벤트 핸들러 함수로, 사용자가 필터를 변경할 때 호출됩니다
  const handleDateFilterChange = (filter: DateFilter) => {
    setDateFilter(filter);
    // 필터 버튼을 클릭하면 커스텀 날짜 범위 초기화
    setCustomDateRange(undefined);
  };

  // 커스텀 날짜 범위 변경 핸들러
  // 사용자가 날짜 선택기에서 직접 날짜 범위를 선택했을 때 호출됩니다
  // useCallback으로 메모이제이션하여 무한 루프 방지
  const handleDateRangeChange = useCallback((range: DateRange | undefined) => {
    setCustomDateRange(range);
  }, []);

  // 최종 날짜 범위 계산
  // 커스텀 날짜 범위가 있으면 그것을 사용하고, 없으면 dateFilter에 따라 계산
  const dateRange = useMemo<DateRange>(() => {
    // 커스텀 날짜 범위가 있으면 그것을 사용
    if (custom_date_range) {
      return custom_date_range;
    }

    // 커스텀 날짜 범위가 없으면 dateFilter에 따라 계산
    const today = new Date();

    switch (dateFilter) {
      case 'today':
        return {
          from: startOfDay(today),
          to: endOfDay(today),
        };
      case 'week':
        return {
          from: startOfWeek(today, { weekStartsOn: 0 }),
          to: endOfWeek(today, { weekStartsOn: 0 }),
        };
      case 'month':
        return {
          from: startOfMonth(today),
          to: endOfMonth(today),
        };
    }
  }, [dateFilter, custom_date_range]);

  return (
    <div className={layoutStyles.container}>
      <div className={layoutStyles.main_content}>
        <div className={layoutStyles.page_header}>
          {/* 페이지 제목 */}
          {/* no_padding prop을 true로 설정하여 page_header의 padding-bottom 사용 */}
          <ManagerPageTitle title="대시보드" no_padding={true} />

          {/* 날짜 필터 섹션 컴포넌트 */}
          <DateFilterSection
            dateFilter={dateFilter}
            onFilterChange={handleDateFilterChange}
            onDateRangeChange={handleDateRangeChange}
          />
        </div>

        {/* 캠페인 관리 요약 통계 섹션 컴포넌트 */}
        <CampaignSummarySection dateRange={dateRange} />

        {/* 차트 섹션 컴포넌트 */}
        <ChartsSection dateRange={dateRange} />

        {/* 회원 통계 섹션 컴포넌트 */}
        <MemberStatsSection dateRange={dateRange} />
      </div>
    </div>
  );
}
