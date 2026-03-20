/* ========================================
   공지사항 페이지 컴포넌트 (공통)
   ======================================== */

/**
 * NoticePageClient
 *
 * 목적: 유저·파트너 공지사항 페이지 공통 컴포넌트
 *
 * 사용 페이지:
 * - /user/notice (유저 공지사항) — localStorage 모드
 * - /partner/notice (파트너 공지사항) — API 모드
 */

"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "@/styles/user/notice/notice.module.css";
import PageTitle from "@/components/fragments/PageTitle";
import Loading from "@/app/loading";
import { type NoticeDetail, type NoticeTarget } from "@/data/user/notice/noticesData";
import {
  posts_data,
  initialize_posts_data,
  type PostItem,
} from "@/data/manager_ga/community/postsData";
import { convertPostsToNotices } from "@/utils/notice/convertPostToNotice";
import { get_post_detail } from "@/data/manager_ga/community/postsData";
import {
  categories_data,
  initialize_categories_data,
  type CategoryItem,
} from "@/data/manager_ga/community/categoriesData";
import {
  apply_pinned_state_to_posts,
  load_pinned_posts_state,
} from "@/utils/community/posts/pinnedPostsLocalStorage";

/** API 모드에서 전달하는 공지사항 데이터 */
interface ApiNoticeData {
  items: Array<{
    boardId: number;
    title: string;
    content: string;
    boardCategory: string;
    createdAt: string;
  }>;
  isLoading: boolean;
  categories: string[];
}

interface NoticePageClientProps {
  header_component: ReactNode;
  target: NoticeTarget;
  detail_page_path: string;
  /** API 데이터 (파트너 등 API 연동 시 전달) — 전달되면 localStorage 로직 건너뜀 */
  api_data?: ApiNoticeData;
}

export default function NoticePageClient({
  header_component,
  target,
  detail_page_path,
  api_data,
}: NoticePageClientProps) {
  const router = useRouter();
  const is_api_mode = !!api_data;

  // 선택된 카테고리 상태 관리
  const [selected_category, set_selected_category] = useState("전체");

  // ── 카테고리 탭 마우스 드래그 스크롤 ──
  const category_ref = useRef<HTMLDivElement>(null);
  const is_dragging = useRef(false);
  const drag_start_x = useRef(0);
  const scroll_start = useRef(0);
  const has_moved = useRef(false);

  const handle_mouse_down = useCallback((e: React.MouseEvent) => {
    if (!category_ref.current) return;
    is_dragging.current = true;
    has_moved.current = false;
    drag_start_x.current = e.pageX;
    scroll_start.current = category_ref.current.scrollLeft;
  }, []);

  useEffect(() => {
    const handle_mouse_move = (e: MouseEvent) => {
      if (!is_dragging.current || !category_ref.current) return;
      const dx = e.pageX - drag_start_x.current;
      if (Math.abs(dx) > 3) has_moved.current = true;
      category_ref.current.scrollLeft = scroll_start.current - dx;
    };

    const handle_mouse_up = () => {
      is_dragging.current = false;
    };

    document.addEventListener("mousemove", handle_mouse_move);
    document.addEventListener("mouseup", handle_mouse_up);
    return () => {
      document.removeEventListener("mousemove", handle_mouse_move);
      document.removeEventListener("mouseup", handle_mouse_up);
    };
  }, []);

  // ── localStorage 모드 전용 상태 ──
  const [posts_for_notice, set_posts_for_notice] = useState<PostItem[]>(() => posts_data);
  const [local_categories, set_local_categories] = useState<string[]>([]);

  // localStorage 게시글 데이터 로드 (유저 모드에서만)
  useEffect(() => {
    if (is_api_mode || typeof window === "undefined") return;

    const update_posts = () => {
      initialize_posts_data();
      const pinned_state = load_pinned_posts_state();
      if (!pinned_state || Object.keys(pinned_state).length === 0) {
        set_posts_for_notice([...posts_data]);
        return;
      }
      const updated_posts = apply_pinned_state_to_posts(posts_data, pinned_state);
      set_posts_for_notice(updated_posts);
    };

    update_posts();

    const handle_focus = () => update_posts();
    const handle_visibility = () => {
      if (!document.hidden) update_posts();
    };
    const handle_storage = (e: StorageEvent) => {
      if (e.key?.includes("post")) update_posts();
    };

    window.addEventListener("focus", handle_focus);
    document.addEventListener("visibilitychange", handle_visibility);
    window.addEventListener("storage", handle_storage);

    return () => {
      window.removeEventListener("focus", handle_focus);
      document.removeEventListener("visibilitychange", handle_visibility);
      window.removeEventListener("storage", handle_storage);
    };
  }, [is_api_mode]);

  // localStorage 카테고리 로드 (유저 모드에서만)
  useEffect(() => {
    if (is_api_mode || typeof window === "undefined") return;

    initialize_categories_data();

    const update_categories = () => {
      const notice_categories = categories_data
        .filter((category: CategoryItem) => category.division === "공지사항")
        .map((category: CategoryItem) => category.category_name);
      const unique_categories = Array.from(new Set(notice_categories));
      set_local_categories(["전체", ...unique_categories]);
    };

    update_categories();

    const handle_focus = () => update_categories();
    const handle_visibility = () => {
      if (!document.hidden) update_categories();
    };
    const handle_storage = (e: StorageEvent) => {
      if (e.key?.includes("categor")) update_categories();
    };

    window.addEventListener("focus", handle_focus);
    document.addEventListener("visibilitychange", handle_visibility);
    window.addEventListener("storage", handle_storage);

    return () => {
      window.removeEventListener("focus", handle_focus);
      document.removeEventListener("visibilitychange", handle_visibility);
      window.removeEventListener("storage", handle_storage);
    };
  }, [is_api_mode]);

  // ── 카테고리 목록 결정 ──
  const categories = is_api_mode ? api_data.categories : local_categories;

  // ── 공지사항 데이터 결정 ──
  const notice_items: Array<{
    id: number;
    title: string;
    date: string;
    category: string;
    is_pinned?: boolean;
  }> = useMemo(() => {
    if (is_api_mode) {
      return api_data.items.map((item) => ({
        id: item.boardId,
        title: item.title,
        date: item.createdAt,
        category: item.boardCategory,
      }));
    }

    // localStorage 모드
    const converted = convertPostsToNotices(posts_for_notice);
    const with_content = converted.map((notice) => {
      const post_detail = get_post_detail(notice.id.toString());
      return {
        ...notice,
        content: post_detail?.content || notice.content || "",
      };
    });

    return with_content
      .filter((notice: NoticeDetail) => !notice.target || notice.target === target)
      .map((notice: NoticeDetail) => ({
        id: notice.id,
        title: notice.title,
        date: notice.date,
        category: notice.category,
        is_pinned: notice.is_pinned,
      }));
  }, [is_api_mode, api_data, posts_for_notice, target]);

  // ── 필터링 + 정렬 ──
  const filtered_notices = useMemo(() => {
    const filtered =
      selected_category === "전체"
        ? notice_items
        : notice_items.filter((n) => n.category === selected_category);

    return filtered.sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      const date_a = new Date(a.date).getTime();
      const date_b = new Date(b.date).getTime();
      return date_b - date_a;
    });
  }, [notice_items, selected_category]);

  /** 날짜 포맷 (API: ISO 8601 → YYYY.MM.DD) */
  const format_date = (date_str: string) => {
    if (date_str.includes("T")) {
      return date_str.split("T")[0].replace(/-/g, ".");
    }
    return date_str.split(" ")[0].replace(/-/g, ".");
  };

  // 로딩 상태
  if (is_api_mode && api_data.isLoading) {
    return (
      <div className={styles.notice_container}>
        {header_component}
        <Loading />
      </div>
    );
  }

  return (
    <div className={styles.notice_container}>
      {header_component}

      <main className={styles.main_content}>
        <PageTitle title="공지사항" />

        <section className={styles.section_container}>
          {/* 카테고리 필터 */}
          <div
            ref={category_ref}
            className={styles.category_container}
            onMouseDown={handle_mouse_down}
          >
            {categories.map((category) => (
              <button
                key={category}
                className={`${styles.category_item} ${
                  selected_category === category ? styles.active : ""
                }`}
                onClick={() => {
                  if (has_moved.current) return;
                  set_selected_category(category);
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* 공지사항 목록 또는 빈 상태 */}
          {filtered_notices.length > 0 ? (
            <div className={styles.notice_list}>
              {filtered_notices.map((notice) => (
                <button
                  key={notice.id}
                  type="button"
                  className={styles.notice_item}
                  onClick={() => router.push(`${detail_page_path}/${notice.id}`)}
                >
                  <div className={styles.notice_content}>
                    <div className={styles.notice_title_wrapper}>
                      <div className={styles.notice_title}>{notice.title}</div>
                      {notice.is_pinned && (
                        <Image
                          src="/images/mypage/pin_pink.svg"
                          alt="핀"
                          width={20}
                          height={20}
                          className={styles.pin_icon}
                        />
                      )}
                    </div>
                    <div className={styles.notice_date}>{format_date(notice.date)}</div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className={styles.empty_state}>
              <p className={styles.empty_text}>공지사항이 없습니다.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
