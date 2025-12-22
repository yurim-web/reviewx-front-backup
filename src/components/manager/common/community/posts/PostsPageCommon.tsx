/* ========================================
   📝 관리자 게시글 목록 페이지 (공통 컴포넌트)
   ======================================== */

/**
 * 관리자 게시글 목록 페이지 (공통 컴포넌트)
 *
 * 목적: GA/SA 관리자 게시글 목록 페이지에서 공통으로 사용하는 페이지 컴포넌트입니다.
 *       manager_type에 따라 URL 경로를 동적으로 결정합니다.
 *
 * 두 가지 사용 위치:
 * - /manager_ga/community/posts (GA 관리자 게시글 목록 페이지)
 * - /manager_sa/community/posts (SA 관리자 게시글 목록 페이지)
 */

"use client";

import { useState } from "react";
import styles from "@/styles/manager/common/community/posts/page.module.css";
import ManagerPageTitle from "@/components/manager/common/fragments/ManagerPageTitle";
import PostFilterSection from "@/components/manager/common/community/posts/section/PostFilterSection";
import PostTable from "@/components/manager/common/community/posts/section/PostTable";
import {
  posts_data,
  type PostDivision,
  type PostItem,
} from "@/data/manager_ga/community/postsData";
import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";

// 관리자 타입 정의
export type ManagerType = "ga" | "sa";

/**
 * PostsPageCommon 컴포넌트의 Props 타입 정의
 *
 * @property manager_type - 관리자 타입 ('ga' | 'sa')
 */
interface PostsPageCommonProps {
  manager_type: ManagerType;
}

/**
 * 관리자 게시글 목록 페이지 공통 컴포넌트
 *
 * @param props - PostsPageCommonProps 객체
 * @param props.manager_type - 관리자 타입 ('ga' 또는 'sa')
 * @returns 게시글 목록 페이지 JSX 요소
 */
export default function PostsPageCommon({
  manager_type,
}: PostsPageCommonProps) {
  // 검색어 상태 관리
  const [search_query, set_search_query] = useState<string>("");

  // 구분 필터 상태 관리
  const [selected_divisions, set_selected_divisions] = useState<PostDivision[]>(
    []
  );

  // 날짜 범위 필터 상태 관리
  const [selected_date_range, set_selected_date_range] = useState<
    DateRange | undefined
  >(undefined);

  // 게시글 목록 상태 (고정 여부 등 변경을 위해 목업 데이터를 상태로 관리)
  const [posts, set_posts] = useState<PostItem[]>(posts_data);

  // 테이블에서 선택된 게시글 ID 목록 상태
  const [selected_post_ids, set_selected_post_ids] = useState<string[]>([]);

  // 검색어 변경 핸들러
  const handle_search_change = (query: string) => {
    set_search_query(query);
  };

  // 선택된 게시글 고정 처리 (GA만 사용)
  const handle_pin_selected_posts = () => {
    if (selected_post_ids.length === 0) return;

    set_posts((prev_posts) =>
      prev_posts.map((post) =>
        selected_post_ids.includes(post.id)
          ? { ...post, is_pinned: true }
          : post
      )
    );
  };

  // 선택된 게시글 고정 해제 처리 (GA만 사용)
  const handle_unpin_selected_posts = () => {
    if (selected_post_ids.length === 0) return;

    set_posts((prev_posts) =>
      prev_posts.map((post) =>
        selected_post_ids.includes(post.id)
          ? { ...post, is_pinned: false }
          : post
      )
    );
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
          on_pin_selected={
            manager_type === "ga" ? handle_pin_selected_posts : undefined
          }
          on_unpin_selected={
            manager_type === "ga" ? handle_unpin_selected_posts : undefined
          }
          manager_type={manager_type}
        />

        {/* 게시글 테이블 컴포넌트 */}
        <PostTable
          posts={posts}
          search_query={search_query}
          selected_divisions={selected_divisions}
          selected_date_range={selected_date_range}
          selected_post_ids={selected_post_ids}
          on_selected_post_ids_change={set_selected_post_ids}
          manager_type={manager_type}
        />
      </div>
    </div>
  );
}
