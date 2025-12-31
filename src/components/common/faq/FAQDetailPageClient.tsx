/* ========================================
   📄 FAQ 상세 페이지 컴포넌트 (공통)
   ======================================== */

/**
 * FAQ 상세 페이지 컴포넌트 (공통)
 *
 * 목적: 유저와 파트너 FAQ 상세 페이지에서 공통으로 사용하는 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /user/faq/[id] (유저 FAQ 상세)
 * - /partner/faq/[id] (파트너 FAQ 상세)
 *
 * 주요 기능:
 * - FAQ 상세 내용 표시 (질문 + 답변)
 * - 뒤로가기 기능
 * - 카테고리 및 날짜 표시
 */

"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import styles from "@/styles/user/faq/faq_detail_page.module.css";
import { posts_data } from "@/data/manager_ga/community/postsData";
import { get_post_detail } from "@/data/manager_ga/community/postsData";
import {
  convertPostsToFAQs,
  type FAQItem,
  type FAQTarget,
} from "@/utils/faq/convertPostToFAQ";

interface FAQDetailPageClientProps {
  target?: FAQTarget; // "user" | "partner" (기본값: "user")
}

export default function FAQDetailPageClient({
  target = "user",
}: FAQDetailPageClientProps) {
  const router = useRouter();
  const params = useParams();
  const faq_id = params?.id as string;

  const [faq_detail, set_faq_detail] = useState<FAQItem | null>(null);

  /**
   * 관리자 게시글 데이터를 FAQ로 변환하여 조회
   * - division이 "자주 묻는 질문"인 게시글만 변환
   * - PostDetail의 content도 포함하여 변환
   */
  const allFAQs = useMemo(() => {
    const faqs = convertPostsToFAQs(posts_data, get_post_detail);
    return faqs;
  }, []);

  useEffect(() => {
    if (!faq_id) return;

    // 관리자 게시글 데이터에서 FAQ 찾기
    const numericId = Number(faq_id);
    if (Number.isNaN(numericId)) {
      set_faq_detail(null);
      return;
    }

    const detail = allFAQs.find((faq) => faq.id === numericId) || null;
    set_faq_detail(detail);
  }, [faq_id, allFAQs]);

  const handle_back_click = () => {
    // target에 따라 뒤로가기 경로 결정
    if (target === "partner") {
      router.push("/partner/faq");
    } else {
      router.push("/user/faq");
    }
  };

  if (!faq_detail) {
    return (
      <main className={styles.container}>
        <div className={styles.loading_message}>FAQ를 불러오는 중...</div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      {/* 메인 콘텐츠 영역 */}
      <section className={styles.main_content}>
        {/* 상단 헤더 영역 (구분 제목 + 뒤로가기 버튼) */}
        <div className={styles.page_header_wrapper}>
          {/* 페이지 제목 (자주 묻는 질문 고정) */}
          <h1 className={styles.division_title}>자주 묻는 질문</h1>

          {/* 뒤로가기 버튼 */}
          <button
            className={styles.back_button}
            onClick={handle_back_click}
            aria-label="뒤로가기"
          >
            뒤로가기
          </button>
        </div>

        {/* FAQ 상세 카드 */}
        <div className={styles.faq_card} aria-label="FAQ 상세 정보">
          {/* 헤더 박스 (메타 정보 + 질문) */}
          <div className={styles.faq_header_box}>
            <div className={styles.faq_meta}>
              <span className={styles.category_label}>{faq_detail.category}</span>
              <span className={styles.faq_date}>{faq_detail.date}</span>
            </div>

            {/* 질문 영역 */}
            <div className={styles.question_section}>
              <span className={styles.question_label}>Q.</span>
              <h2 className={styles.question_text}>{faq_detail.question}</h2>
            </div>
          </div>

          {/* 구분선 */}
          <div className={styles.divider}></div>

          {/* 답변 영역 */}
          <div className={styles.answer_section}>
            <span className={styles.answer_label}>A.</span>
            <div
              className={styles.answer_text}
              dangerouslySetInnerHTML={{ __html: faq_detail.answer }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

