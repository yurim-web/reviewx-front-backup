/* ========================================
   👥 GA 관리자 리뷰어 목록 페이지
   ======================================== */

/**
 * GA 관리자 리뷰어 목록 페이지
 *
 * 목적: GA 관리자가 리뷰어 목록을 확인하고 관리할 수 있는 페이지
 *
 * 사용 페이지:
 * - /manager_ga/member/reviewers
 */

"use client";

import { useState, useRef } from "react";
import styles from "@/styles/manager/common/manager_common_page.module.css";
import ManagerPageTitle from "@/components/manager/common/fragments/ManagerPageTitle";
import ReviewerStatsSection from "@/components/manager/common/member/reviewers/ReviewerStatsSection";
import ReviewerFilterSection from "@/components/manager/common/member/reviewers/ReviewerFilterSection";
import ReviewerTable from "@/components/manager/common/member/reviewers/ReviewerTable";
import type { Channel } from "@/data/manager/common/filterOptions";
import type { ReviewerStatus, ReviewerStatusType } from "@/data/manager_ga/common/filterOptions";
import type { ReviewerGrade } from "@/components/manager/common/member/reviewers/filter/GradeFilterModal";

export default function ReviewersPage() {
  // 검색어 상태 관리
  // useState는 React의 Hook으로, 컴포넌트의 상태를 관리합니다
  // [현재 값, 값을 변경하는 함수] 형태로 반환됩니다
  const [search_query, set_search_query] = useState<string>("");

  // 필터 상태 관리
  // 각 필터의 선택된 값들을 배열로 관리합니다
  const [selected_channels, set_selected_channels] = useState<Channel[]>([]);
  const [selected_grades, set_selected_grades] = useState<ReviewerGrade[]>([]);
  const [selected_types, set_selected_types] = useState<ReviewerStatusType[]>([]);
  const [selected_statuses, set_selected_statuses] = useState<ReviewerStatus[]>([]);

  // 테이블 참조 (모달 열기 함수 호출용)
  const table_ref = useRef<{ open_restriction_modal: () => void }>(null);

  // 이용 제한 버튼 클릭 핸들러
  // 필터 섹션의 "이용 제한" 버튼 클릭 시 테이블의 모달을 엽니다
  const handle_restriction_click = () => {
    table_ref.current?.open_restriction_modal();
  };

  return (
    <div className={styles.container}>
      <div className={styles.main_content}>
        {/* 페이지 제목 */}
        <ManagerPageTitle title="리뷰어 목록" />

        {/* 리뷰어 통계 섹션 */}
        <ReviewerStatsSection />

        {/* 필터 섹션 */}
        <ReviewerFilterSection
          search_query={search_query}
          on_search_change={set_search_query}
          selected_channels={selected_channels}
          on_channels_change={set_selected_channels}
          selected_grades={selected_grades}
          on_grades_change={set_selected_grades}
          selected_types={selected_types}
          on_types_change={set_selected_types}
          selected_statuses={selected_statuses}
          on_statuses_change={set_selected_statuses}
          on_restriction_click={handle_restriction_click}
        />

        {/* 리뷰어 목록 테이블 */}
        <ReviewerTable
          ref={table_ref}
          search_query={search_query}
          selected_channels={selected_channels}
          selected_grades={selected_grades}
          selected_types={selected_types}
          selected_statuses={selected_statuses}
          detail_path="/manager_ga/member/reviewers"
        />
      </div>
    </div>
  );
}
