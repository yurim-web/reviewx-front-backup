/* ========================================
   📋 GA 관리자 신고내역 페이지
   ======================================== */

/**
 * GA 관리자 신고내역 페이지
 *
 * 목적: GA 관리자가 캠페인 신고 내역을 확인하고 관리할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_ga/campaign/reported
 *
 * 주요 기능:
 * - 신고 코드 안내 섹션 (각 신고 코드의 카테고리와 사유 표시)
 * - 신고 내역 통계 섹션 (신고 코드별 신고 횟수 집계)
 * - 필터 섹션 (날짜, 신고 코드, 검색, 정렬, 차단)
 * - 신고 내역 목록 테이블 (캠페인 번호, 캠페인명, 신고 코드, 신고 사유, 검수자, 대상자, 처리일, 신고 횟수, 사유 확인하기)
 *
 */

'use client';

import { useState } from 'react';
import styles from '@/styles/manager_ga/campaign/reported/page.module.css';
import ReportCodeInfoSection from '@/components/manager_ga/campaign/reported/section/ReportCodeInfoSection';
import ReportStatsSection from '@/components/manager_ga/campaign/reported/section/ReportStatsSection';
import FilterSection from '@/components/manager_ga/campaign/reported/section/FilterSection';
import ReportedCampaignTable from '@/components/manager_ga/campaign/reported/section/ReportedCampaignTable';
import type { ReportCode } from '@/data/manager_ga/reported';

/**
 * 신고내역 페이지 컴포넌트
 *
 * 목적: GA 관리자가 캠페인 신고 내역을 확인하고 관리할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_ga/campaign/reported
 *
 * 주요 기능:
 * - 신고 코드 안내 섹션 (각 신고 코드의 카테고리와 사유 표시)
 * - 신고 내역 통계 섹션 (신고 코드별 신고 횟수 집계)
 * - 필터 섹션 (날짜, 신고 코드, 검색, 정렬, 차단)
 * - 신고 내역 목록 테이블 (캠페인 번호, 캠페인명, 신고 코드, 신고 사유, 검수자, 대상자, 처리일, 신고 횟수, 사유 확인하기)
 *
 * 컴포넌트 구조:
 * - ReportCodeInfoSection: 신고 코드 안내 섹션
 * - ReportStatsSection: 신고 내역 통계 섹션
 * - FilterSection: 필터 섹션
 * - ReportedCampaignTable: 신고내역 테이블
 *
 *
 * @returns 신고내역 페이지 JSX
 */
export default function ReportedPage() {
  // 검색어 상태 관리
  // useState는 React의 Hook으로, 컴포넌트의 상태를 관리합니다
  // [현재 값, 값을 변경하는 함수] 형태로 반환됩니다
  const [search_query, set_search_query] = useState<string>('');

  // 신고 코드 필터 상태 관리 (배열로 변경)
  const [selected_report_codes, set_selected_report_codes] = useState<
    ReportCode[]
  >([]);

  return (
    <div className={styles.container}>
      <div className={styles.main_content}>
        {/* 페이지 제목 */}
        <h1 className={styles.page_title}>캠페인 신고 내역</h1>

        {/* 신고 코드 안내 섹션 */}
        <ReportCodeInfoSection />

        {/* 신고 내역 섹션 제목 */}
        <h2 className={styles.section_title}>신고 내역</h2>

        {/* 필터 섹션 */}
        <FilterSection
          search_query={search_query}
          on_search_change={set_search_query}
          selected_report_codes={selected_report_codes}
          on_report_codes_change={set_selected_report_codes}
        />

        {/* 신고 내역 통계 섹션 */}
        <ReportStatsSection />

        {/* 신고내역 테이블 */}
        <ReportedCampaignTable
          search_query={search_query}
          selected_report_codes={selected_report_codes}
        />
      </div>
    </div>
  );
}
