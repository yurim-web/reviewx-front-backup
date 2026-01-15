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

import { useEffect, useState } from "react";
import { startOfMonth, endOfMonth } from "date-fns";
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
import {
  apply_pinned_state_to_posts,
  extract_pinned_state_from_posts,
  load_pinned_posts_state,
  save_pinned_posts_state,
} from "@/utils/community/posts/pinnedPostsLocalStorage";

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
  // 기본값: 이번 달 (오늘 날짜 기준 이번 달의 첫날 ~ 마지막날)
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

  // 게시글 목록 상태 (고정 여부 등 변경을 위해 목업 데이터를 상태로 관리)
  // Hydration 오류 방지: 초기 상태는 항상 posts_data로 시작 (서버/클라이언트 동일)
  // useState의 초기값을 함수로 전달하여 클라이언트에서만 localStorage를 읽도록 함
  const [posts, set_posts] = useState<PostItem[]>(() => {
    // 서버 사이드에서는 항상 기본 posts_data 반환
    if (typeof window === "undefined") {
      return posts_data;
    }

    // 클라이언트 사이드에서는 localStorage에서 고정 상태를 불러와서 적용
    const pinned_state = load_pinned_posts_state();
    if (!pinned_state || Object.keys(pinned_state).length === 0) {
      return posts_data;
    }

    return apply_pinned_state_to_posts(posts_data, pinned_state);
  });

  // 테이블에서 선택된 게시글 ID 목록 상태
  const [selected_post_ids, set_selected_post_ids] = useState<string[]>([]);

  /* ========================================
     🔄 게시글 고정 상태 변경 공통 함수
     - 고정/해제 이후 변경된 posts 상태를
       localStorage에도 함께 반영합니다.
     ======================================== */

  const update_posts_and_persist_pins = (
    updater: (posts: PostItem[]) => PostItem[]
  ) => {
    set_posts((previous_posts) => {
      const updated_posts = updater(previous_posts);

      // 변경된 게시글 목록에서 고정 상태만 추출하여 localStorage에 저장
      const pinned_state = extract_pinned_state_from_posts(updated_posts);
      save_pinned_posts_state(pinned_state);

      return updated_posts;
    });
  };

  // 검색어 변경 핸들러
  const handle_search_change = (query: string) => {
    set_search_query(query);
  };

  // 선택된 게시글 고정 처리
  const handle_pin_selected_posts = () => {
    if (selected_post_ids.length === 0) return;

    update_posts_and_persist_pins((previous_posts) =>
      previous_posts.map((post) =>
        selected_post_ids.includes(post.id)
          ? { ...post, is_pinned: true }
          : post
      )
    );
  };

  // 선택된 게시글 고정 해제 처리
  const handle_unpin_selected_posts = () => {
    if (selected_post_ids.length === 0) return;

    update_posts_and_persist_pins((previous_posts) =>
      previous_posts.map((post) =>
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
          on_pin_selected={handle_pin_selected_posts}
          on_unpin_selected={handle_unpin_selected_posts}
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
