/* ========================================
   🚫 GA 관리자 차단 이력 페이지
   ======================================== */

/**
 * GA 관리자 차단 이력 페이지
 *
 * 목적: GA 관리자가 차단된 회원 목록을 확인하고 관리할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_ga/member/blacklist
 *
 * 주요 기능:
 * - 필터 섹션 (선택 기간 조회, 구분, 차단 코드, 검색어, 정렬, 삭제)
 * - 차단 이력 테이블 (체크박스, 이름/상호명, 구분, 보유 포인트, 등급, 차단 코드, 차단 사유, 등록일, 등록자)
 *
 * 컴포넌트 구조:
 * - BlacklistFilterSection: 필터 섹션
 * - BlacklistTable: 차단 이력 테이블
 *
 * @returns 차단 이력 페이지 JSX
 */

"use client";

import { useState } from "react";
import { startOfMonth, endOfMonth } from "date-fns";
import styles from "@/styles/manager/common/manager_common_page.module.css";
import ManagerPageTitle from "@/components/manager/common/fragments/ManagerPageTitle";
import BlacklistFilterSection from "@/components/manager/common/member/blacklist/BlacklistFilterSection";
import BlacklistTable from "@/components/manager/common/member/blacklist/BlacklistTable";
import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";
import type {
  BlacklistDivision,
  BlockCode,
} from "@/data/manager_ga/common/filterOptions";

export default function BlacklistPage() {
  // 검색어 상태 관리
  // useState는 React의 Hook으로, 컴포넌트의 상태를 관리합니다
  // [현재 값, 값을 변경하는 함수] 형태로 반환됩니다
  const [search_query, set_search_query] = useState<string>("");

  // 필터 상태 관리
  // 각 필터의 선택된 값들을 관리합니다
  // 날짜 범위 필터 기본값: 이번 달 (오늘 날짜 기준 이번 달의 첫날 ~ 마지막날)
  // startOfMonth: 주어진 날짜의 월의 첫날을 반환합니다 (예: 2026-01-13 -> 2026-01-01)
  // endOfMonth: 주어진 날짜의 월의 마지막날을 반환합니다 (예: 2026-01-13 -> 2026-01-31)
  const [selected_date_range, set_selected_date_range] = useState<
    DateRange | undefined
  >(() => {
    const today = new Date();
    return {
      from: startOfMonth(today),
      to: endOfMonth(today),
    };
  });
  const [selected_divisions, set_selected_divisions] = useState<
    BlacklistDivision[]
  >([]);
  const [selected_block_codes, set_selected_block_codes] = useState<
    BlockCode[]
  >([]);

  return (
    <div className={styles.container}>
      <div className={styles.main_content}>
        {/* 페이지 제목 */}
        <ManagerPageTitle title="이용 제한 내역" />

        {/* 필터 섹션 */}
        <BlacklistFilterSection
          search_query={search_query}
          on_search_change={set_search_query}
          selected_date_range={selected_date_range}
          on_date_range_change={set_selected_date_range}
          selected_divisions={selected_divisions}
          on_divisions_change={set_selected_divisions}
          selected_block_codes={selected_block_codes}
          on_block_codes_change={set_selected_block_codes}
        />

        {/* 차단 이력 테이블 */}
        <BlacklistTable
          search_query={search_query}
          selected_date_range={selected_date_range}
          selected_divisions={selected_divisions}
          selected_block_codes={selected_block_codes}
        />
      </div>
    </div>
  );
}
