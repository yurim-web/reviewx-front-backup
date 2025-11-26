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

 */

'use client';

import { useState } from 'react';
import layoutStyles from '@/styles/manager_ga/layout/layout.module.css';
import DateFilterSection, {
  DateFilter,
} from '@/components/manager_ga/dashboard/section/DateFilterSection';
import CampaignSummarySection from '@/components/manager_ga/dashboard/section/CampaignSummarySection';
import ChartsSection from '@/components/manager_ga/dashboard/ChartsSection';
import MemberStatsSection from '@/components/manager_ga/dashboard/MemberStatsSection';
import { campaignStats } from '@/data/manager_ga/dashboard/dashboardData';

export default function ManagerGAPage() {
  // 날짜 필터 상태 관리
  // useState는 React의 Hook으로, 컴포넌트의 상태를 관리합니다
  // [현재 값, 값을 변경하는 함수] 형태로 반환됩니다
  const [dateFilter, setDateFilter] = useState<DateFilter>('month');

  // 날짜 필터 변경 핸들러
  // 화살표 함수로 이벤트 핸들러를 정의합니다
  const handleDateFilterChange = (filter: DateFilter) => {
    setDateFilter(filter);
  };

  return (
    <div className={layoutStyles.container}>
      <div className={layoutStyles.main_content}>
        {/* 페이지 헤더 - 제목과 필터를 같은 줄에 배치 */}
        <div className={layoutStyles.page_header}>
          {/* 페이지 제목 */}
          <h1 className={layoutStyles.page_title}>대시보드</h1>

          {/* 날짜 필터 섹션 컴포넌트 */}
          <DateFilterSection
            dateFilter={dateFilter}
            onFilterChange={handleDateFilterChange}
          />
        </div>

        {/* 캠페인 관리 요약 통계 섹션 컴포넌트 */}
        <CampaignSummarySection stats={campaignStats} />

        {/* 차트 섹션 컴포넌트 */}
        <ChartsSection />

        {/* 회원 통계 섹션 컴포넌트 */}
        <MemberStatsSection />
      </div>
    </div>
  );
}
