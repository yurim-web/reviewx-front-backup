/* ========================================
   📋 GA 관리자 반려내역 페이지
   ======================================== */

/**
 * GA 관리자 반려내역 페이지
 *
 * 목적: GA 관리자가 캠페인 반려 내역을 확인하고 관리할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_ga/campaign/rejected
 *
 * 주요 기능:
 * - 반려 코드 안내 섹션 (각 반려 코드의 카테고리와 사유 표시)
 * - 반려 내역 통계 섹션 (반려 코드별 반려 횟수 집계)
 * - 필터 섹션 (날짜, 반려 코드, 검색, 정렬, 신고)
 * - 반려 내역 목록 테이블 (캠페인 번호, 캠페인명, 반려 코드, 반려 사유, 검수자, 대상자, 처리일, 반려 횟수, 사유 확인하기)

 */

'use client';

import { useState } from 'react';
import styles from '@/styles/manager_ga/campaign/rejected/page.module.css';
import RejectCodeInfoSection from '@/components/manager_ga/campaign/rejected/section/RejectCodeInfoSection';
import RejectStatsSection from '@/components/manager_ga/campaign/rejected/section/RejectStatsSection';
import FilterSection from '@/components/manager_ga/campaign/rejected/section/FilterSection';
import RejectedCampaignTable from '@/components/manager_ga/campaign/rejected/section/RejectedCampaignTable';
import type { RejectCode } from '@/data/manager_ga/rejected';

/**
 * 반려내역 페이지 컴포넌트
 *
 * 목적: GA 관리자가 캠페인 반려 내역을 확인하고 관리할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_ga/campaign/rejected
 *
 * 주요 기능:
 * - 반려 코드 안내 섹션 (각 반려 코드의 카테고리와 사유 표시)
 * - 반려 내역 통계 섹션 (반려 코드별 반려 횟수 집계)
 * - 필터 섹션 (날짜, 반려 코드, 검색, 정렬, 신고)
 * - 반려 내역 목록 테이블 (캠페인 번호, 캠페인명, 반려 코드, 반려 사유, 검수자, 대상자, 처리일, 반려 횟수, 사유 확인하기)
 *
 * 컴포넌트 구조:
 * - RejectCodeInfoSection: 반려 코드 안내 섹션
 * - RejectStatsSection: 반려 내역 통계 섹션
 * - FilterSection: 필터 섹션
 * - RejectedCampaignTable: 반려내역 테이블
 *
 *
 * @returns 반려내역 페이지 JSX
 */
export default function RejectedPage() {
  // 검색어 상태 관리
  // useState는 React의 Hook으로, 컴포넌트의 상태를 관리합니다
  // [현재 값, 값을 변경하는 함수] 형태로 반환됩니다
  const [search_query, set_search_query] = useState<string>('');

  // 반려 코드 필터 상태 관리 (배열로 변경)
  const [selected_reject_codes, set_selected_reject_codes] = useState<
    RejectCode[]
  >([]);

  return (
    <div className={styles.container}>
      <div className={styles.main_content}>
        {/* 페이지 제목 */}
        <h1 className={styles.page_title}>캠페인 반려 내역</h1>

        {/* 반려 코드 안내 섹션 */}
        <RejectCodeInfoSection />

        {/* 반려 내역 섹션 제목 */}
        <h2 className={styles.section_title}>반려 내역</h2>

        {/* 필터 섹션 */}
        <FilterSection
          search_query={search_query}
          on_search_change={set_search_query}
          selected_reject_codes={selected_reject_codes}
          on_reject_codes_change={set_selected_reject_codes}
        />

        {/* 반려 내역 통계 섹션 */}
        <RejectStatsSection />

        {/* 반려내역 테이블 */}
        <RejectedCampaignTable
          search_query={search_query}
          selected_reject_codes={selected_reject_codes}
        />
      </div>
    </div>
  );
}
