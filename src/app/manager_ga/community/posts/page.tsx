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
 * - 필터 섹션 (선택 기간 조회, 구분, 검색, 고정, 해제, 수정, 등록, 삭제, 정렬)
 * - 게시글 목록 테이블 (체크박스, 번호, 구분, 카테고리, 제목, 조회수, 등록일, 등록자)
 *
 * 컴포넌트 구조:
 * - PostFilterSection: 필터 섹션
 * - PostTable: 게시글 테이블
 *
 * 학습 포인트:
 * - 컴포넌트 분리: 큰 컴포넌트를 작은 컴포넌트로 나누어 재사용성과 유지보수성을 높입니다
 * - 컴포넌트 조합: 여러 컴포넌트를 조합하여 복잡한 UI를 구성합니다
 * - 상태 관리: useState를 사용하여 검색어와 필터 상태를 관리합니다
 *
 * @returns 게시글 목록 페이지 JSX
 */

'use client';

import { useState } from 'react';
import styles from '@/styles/manager_ga/community/posts/page.module.css';
import PostFilterSection from '@/components/manager_ga/community/posts/section/PostFilterSection';
import PostTable from '@/components/manager_ga/community/posts/section/PostTable';

export default function PostsPage() {
  // 검색어 상태 관리
  // useState는 React의 Hook으로, 컴포넌트의 상태를 관리합니다
  // [현재 값, 값을 변경하는 함수] 형태로 반환됩니다
  const [search_query, set_search_query] = useState<string>('');

  // 검색어 변경 핸들러
  // 화살표 함수로 이벤트 핸들러를 정의합니다
  const handle_search_change = (query: string) => {
    set_search_query(query);
  };

  return (
    <div className={styles.container}>
      <div className={styles.main_content}>
        {/* 페이지 제목 */}
        <h1 className={styles.page_title}>게시글 목록</h1>

        {/* 필터 섹션 컴포넌트 */}
        <PostFilterSection
          search_query={search_query}
          on_search_change={handle_search_change}
        />

        {/* 게시글 테이블 컴포넌트 */}
        <PostTable search_query={search_query} />
      </div>
    </div>
  );
}

