/* ========================================
   ❓ FAQ 페이지 컴포넌트 (공통)
   ======================================== */

/**
 * FAQ 페이지 컴포넌트 (공통)
 *
 * 목적: 유저와 파트너 FAQ 페이지에서 공통으로 사용하는 컴포넌트입니다.
 *
 * 사용 위치:
 * - /user/faq (유저 FAQ 페이지)
 * - /partner/faq (파트너 FAQ 페이지)
 *
 * 주요 기능:
 * - 카테고리별 FAQ 필터링
 * - 아코디언 형태의 Q&A 표시
 * - 질문 클릭 시 답변 펼치기/접기
 * - 핀된 FAQ 맨 위 고정
 *
 * Props 설명:
 * - header_component: 헤더 컴포넌트 (SubHeader 또는 PartnerHeader)
 * - target: FAQ 대상 ("user" | "partner")
 * - detail_page_path: 상세 페이지 경로 (현재는 사용하지 않지만 호환성을 위해 유지)
 */

"use client";

import React, { useState, useMemo, useEffect, type ReactNode } from "react";
import Image from "next/image";
import styles from "@/styles/user/faq/faq.module.css";
import richtext_styles from "@/styles/common/html_richtext_content.module.css";
import PageTitle from "@/components/fragments/PageTitle";
import {
  posts_data,
  initialize_posts_data,
  get_post_detail,
  type PostItem,
} from "@/data/manager_ga/community/postsData";
import {
  convertPostsToFAQs,
  type FAQItem,
  type FAQTarget,
} from "@/utils/faq/convertPostToFAQ";
import {
  categories_data,
  initialize_categories_data,
  type CategoryItem,
} from "@/data/manager_ga/community/categoriesData";
import {
  apply_pinned_state_to_posts,
  load_pinned_posts_state,
} from "@/utils/community/posts/pinnedPostsLocalStorage";

/**
 * FAQPageClient 컴포넌트의 Props 타입 정의
 *
 * @property header_component - 헤더 컴포넌트 (ReactNode)
 * @property target - FAQ 대상 ("user" | "partner")
 * @property detail_page_path - 상세 페이지 경로 (예: "/user/faq" 또는 "/partner/faq")
 */
interface FAQPageClientProps {
  header_component: ReactNode; // 헤더 컴포넌트 (SubHeader 또는 PartnerHeader)
  target: FAQTarget; // FAQ 대상 ("user" | "partner")
  detail_page_path: string; // 상세 페이지 경로
}

/**
 * FAQ 페이지 공통 컴포넌트
 *
 * @param props - FAQPageClientProps 객체
 * @param props.header_component - 헤더 컴포넌트
 * @param props.target - FAQ 대상 ("user" | "partner")
 * @param props.detail_page_path - 상세 페이지 경로
 * @returns FAQ 페이지 JSX 요소
 */
export default function FAQPageClient({
  header_component,
  target,
  detail_page_path,
}: FAQPageClientProps) {
  // 선택된 카테고리 상태 관리
  const [selected_category, set_selected_category] = useState("전체");

  // 펼쳐진 FAQ 항목 ID 목록 (아코디언 상태 관리)
  const [expanded_items, set_expanded_items] = useState<number[]>([]);

  // 관리자 게시글 목록 상태 (FAQ 변환용)
  // - 초기에는 posts_data(기본 목업 데이터)를 그대로 사용합니다.
  // - 클라이언트 마운트 후 localStorage에 저장된 고정 상태를 적용합니다.
  const [posts_for_faq, set_posts_for_faq] = useState<PostItem[]>(() => {
    // 서버 사이드에서는 기본 데이터 반환
    if (typeof window === "undefined") {
      return posts_data;
    }
    return posts_data;
  });

  // 카테고리 목록 상태 관리
  // useState: React Hook으로 컴포넌트의 카테고리 목록 상태를 관리합니다
  // 관리자에서 새로 등록한 카테고리가 즉시 반영되도록 상태로 관리합니다
  // Hydration 오류 방지를 위해 초기값은 빈 배열로 설정하고, useEffect에서 로드합니다
  const [categories, set_categories] = useState<string[]>([]);

  /**
   * 💾 localStorage에 저장된 게시글 데이터 및 고정 상태 적용
   * - 컴포넌트가 클라이언트에서 마운트된 후에만 실행됩니다.
   * - 서버 렌더링 시에는 localStorage에 접근하지 않으므로
   *   Hydration 오류를 방지할 수 있습니다.
   * - 주기적으로 최신 게시글 데이터를 가져와서 관리자에서 새로 등록한 게시글이 즉시 반영되도록 합니다
   */
  useEffect(() => {
    // 서버 사이드에서는 실행하지 않음
    if (typeof window === "undefined") {
      return;
    }

    // 게시글 목록 업데이트 함수
    const update_posts = () => {
      // 게시글 데이터 초기화 (localStorage에서 최신 데이터 불러오기)
      initialize_posts_data();

      // localStorage에서 고정 상태를 불러와서 적용
      const pinned_state = load_pinned_posts_state();
      if (!pinned_state || Object.keys(pinned_state).length === 0) {
        set_posts_for_faq([...posts_data]);
        return;
      }

      const updated_posts = apply_pinned_state_to_posts(
        posts_data,
        pinned_state
      );
      set_posts_for_faq(updated_posts);
    };

    // 초기 마운트 시 게시글 목록 업데이트
    update_posts();

    // 주기적으로 게시글 목록 업데이트 (1초마다)
    // 관리자에서 새로 등록한 게시글이 즉시 반영되도록 합니다
    const interval_id = setInterval(update_posts, 1000);

    // 페이지가 포커스될 때도 업데이트
    const handle_focus = () => {
      update_posts();
    };
    window.addEventListener("focus", handle_focus);

    // 컴포넌트가 언마운트될 때 interval과 이벤트 리스너 정리
    return () => {
      clearInterval(interval_id);
      window.removeEventListener("focus", handle_focus);
    };
  }, []);

  /**
   * 관리자에서 등록한 카테고리 목록을 동적으로 업데이트
   * - division이 "자주 묻는 질문"인 카테고리만 필터링
   * - "전체" 카테고리를 맨 앞에 추가
   * - 컴포넌트가 클라이언트에서 마운트된 후에만 실행됩니다
   * - Hydration 오류를 방지하기 위해 useEffect 내에서만 카테고리를 로드합니다
   * - 주기적으로 최신 카테고리 데이터를 가져와서 관리자에서 새로 등록한 카테고리가 즉시 반영되도록 합니다
   */
  useEffect(() => {
    // 서버 사이드에서는 실행하지 않음 (Hydration 오류 방지)
    if (typeof window === "undefined") {
      return;
    }

    // 카테고리 데이터 초기화 (localStorage에서 불러오기)
    // 클라이언트에서만 실행되어 Hydration 오류를 방지합니다
    initialize_categories_data();

    // 카테고리 목록 업데이트 함수
    const update_categories = () => {
      // division이 "자주 묻는 질문"인 카테고리만 필터링
      const faq_categories = categories_data
        .filter(
          (category: CategoryItem) => category.division === "자주 묻는 질문"
        )
        .map((category: CategoryItem) => category.category_name);

      // 중복 제거
      const unique_categories = Array.from(new Set(faq_categories));

      // "전체"를 맨 앞에 추가
      set_categories(["전체", ...unique_categories]);
    };

    // 초기 마운트 시 카테고리 목록 업데이트
    update_categories();

    // 주기적으로 카테고리 목록 업데이트 (1초마다)
    // 관리자에서 새로 등록한 카테고리가 즉시 반영되도록 합니다
    const interval_id = setInterval(update_categories, 1000);

    // 컴포넌트가 언마운트될 때 interval 정리
    return () => clearInterval(interval_id);
  }, []);

  /**
   * 아코디언 토글 핸들러
   * - FAQ 항목을 펼치거나 접습니다
   *
   * @param id - FAQ ID
   */
  const handle_toggle_expand = (id: number) => {
    set_expanded_items((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  /**
   * 관리자 게시글 데이터를 FAQ로 변환
   * - division이 "자주 묻는 질문"인 게시글만 변환
   * - PostDetail의 content도 포함하여 변환
   * - useMemo를 사용하여 데이터가 변경될 때만 재계산
   */
  const converted_faqs = useMemo(() => {
    // convertPostsToFAQs: 관리자 게시글을 FAQ 형식으로 변환하는 함수
    const faqs = convertPostsToFAQs(posts_for_faq, get_post_detail);

    return faqs;
  }, [posts_for_faq]);

  /**
   * FAQ 필터링 및 정렬
   * - target에 따라 필터링 (user 또는 partner)
   *   - target이 일치하는 경우: 해당 대상 전용
   *   - target이 undefined인 경우: 전체 대상 (양쪽 모두 표시)
   * - 카테고리별 필터링
   * - 정렬 규칙:
   *   1. 고정글(핀된 항목)은 상단 배치, 고정글끼리는 최신순
   *   2. 일반 글은 최신순 정렬 (등록일시 기준 내림차순)
   */
  const filtered_faqs = (
    selected_category === "전체"
      ? converted_faqs.filter(
          // filter: 조건에 맞는 FAQ만 추출합니다
          (faq) => !faq.target || faq.target === target
        )
      : converted_faqs.filter(
          (faq) =>
            (!faq.target || faq.target === target) &&
            faq.category === selected_category
        )
  ).sort((a, b) => {
    // sort: 배열을 정렬합니다
    // 1. 핀된 FAQ를 맨 위로 정렬
    if (a.is_pinned && !b.is_pinned) return -1; // a가 앞으로
    if (!a.is_pinned && b.is_pinned) return 1; // b가 앞으로

    // 2. 둘 다 핀되어 있거나 둘 다 핀 안 되어 있으면 등록일시 내림차순 (최신순)
    // registered_date 형식: "YYYY-MM-DD HH:mm"
    // 같은 날짜라도 시간까지 비교하여 정확한 최신순 정렬
    const date_a = new Date(a.date.replace(" ", "T")).getTime(); // ISO 형식으로 변환
    const date_b = new Date(b.date.replace(" ", "T")).getTime();
    return date_b - date_a; // 내림차순 (최신순)
  });

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
          <div className={styles.category_container}>
            {/* map: 카테고리 배열을 순회하며 버튼을 생성합니다 */}
            {categories.map((category) => (
              <button
                key={category}
                className={`${styles.category_item} ${
                  selected_category === category ? styles.active : ""
                }`}
                onClick={() => set_selected_category(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ 목록 또는 빈 상태 */}
          {filtered_faqs.length > 0 ? (
            <div className={styles.faq_list}>
              {/* map: 필터링된 FAQ 배열을 순회하며 목록 아이템을 생성합니다 */}
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
                          expanded_items.includes(faq.id)
                            ? styles.expanded_question
                            : ""
                        }`}
                      >
                        Q.
                      </span>
                      <span
                        className={`${styles.question_text} ${
                          expanded_items.includes(faq.id)
                            ? styles.expanded_question
                            : ""
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
                          dangerouslySetInnerHTML={{ __html: faq.answer }}
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
