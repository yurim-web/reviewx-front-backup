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
 */

"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useMemo, type ReactNode } from "react";
import styles from "@/styles/user/faq/faq_detail_page.module.css";
import { sanitizeRichHtml } from "@/utils/security/sanitize";
import { posts_data } from "@/data/manager_ga/community/postsData";
import { get_post_detail } from "@/data/manager_ga/community/postsData";
import { convertPostsToFAQs, type FAQItem, type FAQTarget } from "@/utils/faq/convertPostToFAQ";
import Loading from "@/app/loading";

/** API 모드에서 전달하는 상세 데이터 */
interface ApiFaqDetailData {
  item: {
    boardId: number;
    boardCategory: string;
    title: string;
    content: string;
    createdAt: string;
  } | null;
  isLoading: boolean;
  categoryLabel: string;
}

interface FAQDetailPageClientProps {
  target?: FAQTarget; // "user" | "partner" (기본값: "user")
  header_component?: ReactNode; // 헤더 컴포넌트 (선택적, 없으면 기본 뒤로가기 버튼 사용)
  /** API 데이터 (API 연동 시 전달) */
  api_detail?: ApiFaqDetailData;
}

export default function FAQDetailPageClient({
  target = "user",
  header_component,
  api_detail,
}: FAQDetailPageClientProps) {
  const router = useRouter();
  const params = useParams();
  const faq_id = params?.id as string;
  const is_api_mode = !!api_detail;

  // ── localStorage 모드 전용 ──
  const [faq_detail, set_faq_detail] = useState<FAQItem | null>(null);

  const allFAQs = useMemo(() => {
    if (is_api_mode) return [];
    const faqs = convertPostsToFAQs(posts_data, get_post_detail);
    return faqs;
  }, [is_api_mode]);

  useEffect(() => {
    if (is_api_mode || !faq_id) return;

    const numericId = Number(faq_id);
    if (Number.isNaN(numericId)) {
      set_faq_detail(null);
      return;
    }

    const detail = allFAQs.find((faq) => faq.id === numericId) || null;
    set_faq_detail(detail);
  }, [faq_id, allFAQs, is_api_mode]);

  const handle_back_click = () => {
    if (target === "partner") {
      router.push("/partner/faq");
    } else {
      router.push("/user/faq");
    }
  };

  // ── 로딩 ──
  if (is_api_mode && api_detail.isLoading) {
    return (
      <main className={styles.container}>
        {header_component}
        <Loading />
      </main>
    );
  }

  // ── 데이터 결정 ──
  let display_category = "";
  let display_date = "";
  let display_question = "";
  let display_answer = "";
  let has_data = false;

  if (is_api_mode) {
    if (api_detail.item) {
      has_data = true;
      display_category = api_detail.categoryLabel;
      display_question = api_detail.item.title;
      display_answer = api_detail.item.content;
      const d = api_detail.item.createdAt;
      display_date = d.includes("T")
        ? d.split("T")[0].replace(/-/g, ".")
        : d.split(" ")[0].replace(/-/g, ".");
    }
  } else if (faq_detail) {
    has_data = true;
    display_category = faq_detail.category;
    display_date = faq_detail.date;
    display_question = faq_detail.question;
    display_answer = faq_detail.answer;
  }

  if (!has_data) {
    return (
      <main className={styles.container}>
        <div className={styles.loading_message}>FAQ를 불러오는 중...</div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      {header_component}

      {/* 메인 콘텐츠 영역 */}
      <section className={styles.main_content}>
        {!header_component && (
          <div className={styles.page_header_wrapper}>
            <h1 className={styles.division_title}>자주 묻는 질문</h1>
            <button
              className={styles.back_button}
              onClick={handle_back_click}
              aria-label="뒤로가기"
            >
              뒤로가기
            </button>
          </div>
        )}

        {/* FAQ 상세 카드 */}
        <div className={styles.faq_card} aria-label="FAQ 상세 정보">
          <div className={styles.faq_header_box}>
            <div className={styles.faq_meta}>
              <span className={styles.category_label}>{display_category}</span>
              <span className={styles.faq_date}>{display_date}</span>
            </div>
            <div className={styles.question_section}>
              <span className={styles.question_label}>Q.</span>
              <h2 className={styles.question_text}>{display_question}</h2>
            </div>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.answer_section}>
            <span className={styles.answer_label}>A.</span>
            <div
              className={styles.answer_text}
              dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(display_answer) }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
