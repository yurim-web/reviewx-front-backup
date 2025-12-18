/* ========================================
   📝 GA 관리자 게시글 목록 페이지
   ======================================== */

/**
 * GA 관리자 게시글 목록 페이지
 *
 * 목적: GA 관리자가 커뮤니티 게시글 목록을 확인하고 관리할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_ga/community/posts
 *
 * 주요 기능:
 * - 필터 섹션 (선택 기간 조회, 구분, 검색어, 고정, 삭제, 수정, 등록, 답변, 정렬)
 * - 게시글 목록 테이블 (체크박스, 번호, 구분, 카테고리, 제목, 조회수, 등록일, 등록자)
 *
 * 컴포넌트 구조:
 * - PostFilterSection: 필터 섹션
 * - PostTable: 게시글 테이블
 *
 *
 * @returns 게시글 목록 페이지 JSX
 */

'use client';

import { useState } from 'react';
import styles from '@/styles/manager_ga/community/posts/page.module.css';
import ManagerPageTitle from '@/components/manager/common/fragments/ManagerPageTitle';
import PostFilterSection from '@/components/manager/common/community/posts/section/PostFilterSection';
import PostTable from '@/components/manager/common/community/posts/section/PostTable';
import type { PostDivision } from '@/data/manager_ga/community/postsData';
import type { DateRange } from '@/components/manager/ga/dashboard/section/DateRangePickerModal';

export default function PostsPage() {
  // 검색어 상태 관리
  // useState는 React의 Hook으로, 컴포넌트의 상태를 관리합니다
  // [현재 값, 값을 변경하는 함수] 형태로 반환됩니다
  const [search_query, set_search_query] = useState<string>('');

  // 구분 필터 상태 관리
  const [selected_divisions, set_selected_divisions] = useState<PostDivision[]>([]);

  // 날짜 범위 필터 상태 관리
  const [selected_date_range, set_selected_date_range] = useState<DateRange | undefined>(undefined);

  // 검색어 변경 핸들러
  // 화살표 함수로 이벤트 핸들러를 정의합니다
  const handle_search_change = (query: string) => {
    set_search_query(query);
  };

  return (
    <div className={styles.container}>
      <div className={styles.main_content}>
        {/* 페이지 제목 */}
        <ManagerPageTitle title="게시글 목록" />

        {/* 필터 섹션 컴포넌트 */}
        <PostFilterSection
          search_query={search_query}
          on_search_change={handle_search_change}
          selected_divisions={selected_divisions}
          on_divisions_change={set_selected_divisions}
          selected_date_range={selected_date_range}
          on_date_range_change={set_selected_date_range}
        />

        {/* 게시글 테이블 컴포넌트 */}
        <PostTable
          search_query={search_query}
          selected_divisions={selected_divisions}
          selected_date_range={selected_date_range}
        />
      </div>
    </div>
  );
}
