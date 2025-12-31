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

import React, { useState, useMemo, type ReactNode } from "react";
import Image from "next/image";
import styles from "@/styles/user/faq/faq.module.css";
import PageTitle from "@/components/fragments/PageTitle";
import { posts_data } from "@/data/manager_ga/community/postsData";
import { get_post_detail } from "@/data/manager_ga/community/postsData";
import {
  convertPostsToFAQs,
  type FAQItem,
  type FAQTarget,
} from "@/utils/faq/convertPostToFAQ";
import {
  categories_data,
  type CategoryItem,
} from "@/data/manager_ga/community/categoriesData";

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

  /**
   * 관리자에서 등록한 카테고리 목록을 동적으로 가져오기
   * - division이 "자주 묻는 질문"인 카테고리만 필터링
   * - "전체" 카테고리를 맨 앞에 추가
   * - useMemo를 사용하여 카테고리 데이터가 변경될 때만 재계산
   */
  const categories = useMemo(() => {
    // division이 "자주 묻는 질문"인 카테고리만 필터링
    const faq_categories = categories_data
      .filter(
        (category: CategoryItem) => category.division === "자주 묻는 질문"
      )
      .map((category: CategoryItem) => category.category_name);

    // 중복 제거
    const unique_categories = Array.from(new Set(faq_categories));

    // "전체"를 맨 앞에 추가
    return ["전체", ...unique_categories];
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
    const faqs = convertPostsToFAQs(posts_data, get_post_detail);

    return faqs;
  }, []);

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
        <PageTitle title="자주 묻는 질문" />

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
                          className={styles.answer_text}
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
