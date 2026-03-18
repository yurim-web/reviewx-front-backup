/* ========================================
   🚫 GA 관리자 전체 반려 내역 페이지
   ======================================== */

/**
 * GA 관리자 전체 반려 내역 페이지
 *
 * 목적: GA 관리자가 캠페인 반려 이력을 확인하고 관리할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_ga/campaign/rejected
 *
 * 주요 기능:
 * - 반려 코드 안내 섹션 (각 반려 코드와 카테고리의 의미 표시)
 * - 반려 이력 통계 섹션 (반려 코드별 반려 횟수 집계)
 * - 필터 섹션 (날짜, 반려 코드, 검색어, 정렬, 고고)
 * - 반려 이력 목록 테이블 (캠페인 번호, 캠페인명, 반려 코드, 반려 사유, 검토자, 등록자, 처리일, 반려 횟수, 사유 확인하기)
 *
 */

"use client";

import { useState } from "react";
import { startOfMonth, endOfMonth } from "date-fns";
import styles from "@/styles/manager_ga/campaign/campaign_common.module.css";
import ManagerPageTitle from "@/components/manager/common/fragments/ManagerPageTitle";
import RejectCodeInfoSection from "@/components/manager/ga/campaign/rejected/section/RejectCodeInfoSection";
import RejectStatsSection from "@/components/manager/ga/campaign/rejected/section/RejectStatsSection";
import CampaignRejectedFilterSection from "@/components/manager/ga/campaign/rejected/section/CampaignRejectedFilterSection";
import RejectedCampaignTable from "@/components/manager/ga/campaign/rejected/section/RejectedCampaignTable";
import Loading from "@/app/loading";
import { useAdminRejections } from "@/hooks/manager/ga/useAdminRejections";
import type { RejectCode } from "@/data/manager_ga/rejected";
import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";

/**
 * 전체 반려 내역 페이지 컴포넌트
 *
 * 목적: GA 관리자가 캠페인 반려 이력을 확인하고 관리할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_ga/campaign/rejected
 *
 * 주요 기능:
 * - 반려 코드 안내 섹션 (각 반려 코드와 카테고리의 의미 표시)
 * - 반려 이력 통계 섹션 (반려 코드별 반려 횟수 집계)
 * - 필터 섹션 (날짜, 반려 코드, 검색어, 정렬, 고고)
 * - 반려 이력 목록 테이블 (캠페인 번호, 캠페인명, 반려 코드, 반려 사유, 검토자, 등록자, 처리일, 반려 횟수, 사유 확인하기)
 *
 * 컴포넌트 구조:
 * - RejectCodeInfoSection: 반려 코드 안내 섹션
 * - RejectStatsSection: 반려 이력 통계 섹션
 * - CampaignRejectedFilterSection: 필터 섹션
 * - RejectedCampaignTable: 반려 이력 테이블
 *
 *
 * @returns 전체 반려 내역 페이지 JSX
 */
export default function RejectedPage() {
  const { rejections, isLoading } = useAdminRejections();

  // 검색어 상태 관리
  const [search_query, set_search_query] = useState<string>("");

  // 반려 코드 필터 상태 관리 (배열로 변경)
  const [selected_reject_codes, set_selected_reject_codes] = useState<RejectCode[]>([]);

  // 날짜 범위 필터 상태 관리
  // 기본값: 이번 달 (오늘 날짜 기준 이번 달의 첫날 ~ 마지막날)
  // startOfMonth: 주어진 날짜의 월의 첫날을 반환합니다 (예: 2026-01-13 -> 2026-01-01)
  // endOfMonth: 주어진 날짜의 월의 마지막날을 반환합니다 (예: 2026-01-13 -> 2026-01-31)
  const [selected_date_range, set_selected_date_range] = useState<DateRange | undefined>(() => {
    const today = new Date();
    return {
      from: startOfMonth(today),
      to: endOfMonth(today),
    };
  });

  if (isLoading) return <Loading />;

  return (
    <div className={styles.page_container}>
      <div className={styles.page_main_content}>
        {/* 페이지 제목 */}
        <ManagerPageTitle title="전체 반려 내역" />

        {/* 반려 코드 안내 섹션 */}
        <RejectCodeInfoSection />

        {/* 반려 이력 섹션 제목 */}
        <h2 className={styles.page_section_title}>반려 내역</h2>

        {/* 필터 섹션 */}
        <CampaignRejectedFilterSection
          search_query={search_query}
          on_search_change={set_search_query}
          selected_reject_codes={selected_reject_codes}
          on_reject_codes_change={set_selected_reject_codes}
          selected_date_range={selected_date_range}
          on_date_range_change={set_selected_date_range}
        />

        {/* 반려 이력 통계 섹션 */}
        {/* 필터에 따라 동적으로 통계를 계산하여 표시 */}
        <RejectStatsSection
          rejections={rejections}
          search_query={search_query}
          selected_reject_codes={selected_reject_codes}
          selected_date_range={selected_date_range}
        />

        {/* 반려 이력 테이블 */}
        <RejectedCampaignTable
          rejections={rejections}
          search_query={search_query}
          selected_reject_codes={selected_reject_codes}
          selected_date_range={selected_date_range}
        />
      </div>
    </div>
  );
}
