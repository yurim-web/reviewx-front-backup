/* ========================================
   📊 GA 관리자 진행 상황 페이지
   ======================================== */

/**
 * GA 관리자 진행 상황 페이지
 *
 * 목적: GA 관리자가 캠페인 진행 상황을 확인하고 관리할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_ga/campaign/progress
 *
 * 주요 기능:
 * - 상단 통계 카드 (오픈 예정, 진행 중, 신청 중, 전체, 종료, 취소)
 * - 필터 섹션 (날짜, 검색, 상태, 유형, 채널, 정렬, 저장)
 * - 캠페인 목록 테이블 (체크박스, 번호, 파트너명, 캠페인명, 유형, 채널, 상태, 모집 수, 신청 수, 지급 포인트)
 *
 * 컴포넌트 구조:
 * - StatCardsSection: 통계 카드 섹션
 * - FilterSection: 필터 섹션
 * - CampaignTable: 캠페인 테이블
 */

'use client';

import styles from '@/styles/manager_ga/campaign/progress/page.module.css';
import StatCardsSection from '@/components/manager/ga/campaign/progress/section/StatCardsSection';
import FilterSection from '@/components/manager/ga/campaign/progress/section/FilterSection';
import CampaignTable from '@/components/manager/ga/campaign/progress/section/CampaignTable';

export default function ProgressPage() {
  return (
    <div className={styles.container}>
      <div className={styles.main_content}>
        {/* 페이지 제목 */}
        <h1 className={styles.page_title}>캠페인 진행 상황</h1>

        {/* 통계 카드 섹션 */}
        <StatCardsSection />

        {/* 필터 섹션 */}
        <FilterSection />

        {/* 캠페인 테이블 */}
        <CampaignTable />
      </div>
    </div>
  );
}
