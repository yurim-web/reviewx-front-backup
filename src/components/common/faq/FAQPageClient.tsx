/* ========================================
   FAQ 페이지 컴포넌트 (공통)
   ======================================== */

/**
 * FAQPageClient
 *
 * 목적: 유저·파트너 FAQ 페이지 공통 컴포넌트
 *
 * 사용 페이지:
 * - /user/faq (유저 FAQ) — localStorage 모드
 * - /partner/faq (파트너 FAQ) — API 모드
 */

"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback, type ReactNode } from "react";
import Image from "next/image";
import styles from "@/styles/user/faq/faq.module.css";
import richtext_styles from "@/styles/common/html_richtext_content.module.css";
import { sanitizeRichHtml } from "@/utils/security/sanitize";
import PageTitle from "@/components/fragments/PageTitle";
import Loading from "@/app/loading";
import {
  posts_data,
  initialize_posts_data,
  get_post_detail,
  type PostItem,
} from "@/data/manager_ga/community/postsData";
import { convertPostsToFAQs, type FAQTarget } from "@/utils/faq/convertPostToFAQ";
import type { FAQItem } from "@/utils/faq/convertPostToFAQ";
import {
  categories_data,
  initialize_categories_data,
  type CategoryItem,
} from "@/data/manager_ga/community/categoriesData";
import {
  apply_pinned_state_to_posts,
  load_pinned_posts_state,
} from "@/utils/community/posts/pinnedPostsLocalStorage";

/** API 모드에서 전달하는 FAQ 데이터 */
interface ApiFaqData {
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

interface FAQPageClientProps {
  header_component: ReactNode;
  target: FAQTarget;
  detail_page_path: string;
  /** API 데이터 (파트너 등 API 연동 시 전달) — 전달되면 localStorage 로직 건너뜀 */
  api_data?: ApiFaqData;
}

export default function FAQPageClient({
  header_component,
  target,
  detail_page_path: _detail_page_path,
  api_data,
}: FAQPageClientProps) {
  const is_api_mode = !!api_data;

  // 선택된 카테고리 상태 관리
  const [selected_category, set_selected_category] = useState("전체");

  // 펼쳐진 FAQ 항목 ID 목록 (아코디언 상태 관리)
  const [expanded_items, set_expanded_items] = useState<number[]>([]);

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
  const [posts_for_faq, set_posts_for_faq] = useState<PostItem[]>(() => posts_data);
  const [local_categories, set_local_categories] = useState<string[]>([]);

  // localStorage 게시글 데이터 로드 (유저 모드에서만)
  useEffect(() => {
    if (is_api_mode || typeof window === "undefined") return;

    const update_posts = () => {
      initialize_posts_data();
      const pinned_state = load_pinned_posts_state();
      if (!pinned_state || Object.keys(pinned_state).length === 0) {
        set_posts_for_faq([...posts_data]);
        return;
      }
      const updated_posts = apply_pinned_state_to_posts(posts_data, pinned_state);
      set_posts_for_faq(updated_posts);
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
      const faq_categories = categories_data
        .filter((category: CategoryItem) => category.division === "자주 묻는 질문")
        .map((category: CategoryItem) => category.category_name);
      const unique_categories = Array.from(new Set(faq_categories));
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

  // ── FAQ 데이터 결정 ──
  const faq_items: Array<{
    id: number;
    question: string;
    answer: string;
    category: string;
    date: string;
    is_pinned?: boolean;
  }> = useMemo(() => {
    if (is_api_mode) {
      return api_data.items.map((item) => ({
        id: item.boardId,
        question: item.title,
        answer: item.content,
        category: item.boardCategory,
        date: item.createdAt,
      }));
    }

    // localStorage 모드: 관리자 게시글 → FAQ 변환
    const converted = convertPostsToFAQs(posts_for_faq, get_post_detail);
    return converted
      .filter((faq: FAQItem) => !faq.target || faq.target === target)
      .map((faq: FAQItem) => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        date: faq.date,
        is_pinned: faq.is_pinned,
      }));
  }, [is_api_mode, api_data, posts_for_faq, target]);

  // ── 필터링 ──
  const filtered_faqs = useMemo(() => {
    const filtered =
      selected_category === "전체"
        ? faq_items
        : faq_items.filter((faq) => faq.category === selected_category);

    return filtered.sort((a, b) => {
      // 핀된 FAQ를 맨 위로 (localStorage 모드에서만 해당)
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;

      // 최신순 정렬
      const date_a = new Date(a.date.replace(" ", "T")).getTime();
      const date_b = new Date(b.date.replace(" ", "T")).getTime();
      return date_b - date_a;
    });
  }, [faq_items, selected_category]);

  /**
   * 아코디언 토글 핸들러
   */
  const handle_toggle_expand = (id: number) => {
    set_expanded_items((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 로딩 상태
  if (is_api_mode && api_data.isLoading) {
    return (
      <div className={styles.faq_container}>
        {header_component}
        <Loading />
      </div>
    );
  }

  return (
    <div className={styles.faq_container}>
      {/* 헤더 컴포넌트 (SubHeader 또는 PartnerHeader) */}
      {header_component}

      <main className={styles.main_content}>
        {/* 페이지 제목 */}
        <div className={styles.faq_page_title_wrapper}>
          <PageTitle title="자주 묻는 질문" />
        </div>

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
                  // 드래그 중에는 클릭 무시
                  if (has_moved.current) return;
                  set_selected_category(category);
                  set_expanded_items([]);
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ 목록 또는 빈 상태 */}
          {filtered_faqs.length > 0 ? (
            <div className={styles.faq_list}>
              {filtered_faqs.map((faq) => (
                <div key={faq.id} className={styles.faq_item}>
                  {/* 질문 영역 버튼 */}
                  <button
                    className={styles.faq_question}
                    onClick={() => handle_toggle_expand(faq.id)}
                  >
                    <div className={styles.question_content}>
                      <span
                        className={`${styles.question_number} ${
                          expanded_items.includes(faq.id) ? styles.expanded_question : ""
                        }`}
                      >
                        Q.
                      </span>
                      <span
                        className={`${styles.question_text} ${
                          expanded_items.includes(faq.id) ? styles.expanded_question : ""
                        }`}
                      >
                        {faq.question}
                      </span>
                    </div>
                    {/* 드롭다운 화살표 아이콘 */}
                    <div
                      className={`${styles.expand_icon} ${
                        expanded_items.includes(faq.id) ? styles.expanded : ""
                      }`}
                    >
                      <Image
                        src="/images/icons/dropdown_arrow.svg"
                        alt="펼치기/접기"
                        width={16}
                        height={16}
                      />
                    </div>
                  </button>

                  {/* 답변 내용 (아코디언) */}
                  {expanded_items.includes(faq.id) && (
                    <div className={styles.faq_answer}>
                      <div className={styles.answer_content}>
                        <span className={styles.answer_number}>A.</span>
                        <div
                          className={`${styles.answer_text} ${richtext_styles.richtext_content}`}
                          dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(faq.answer) }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.empty_state}>
              <p className={styles.empty_text}>자주 묻는 질문이 없습니다.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
