/* ========================================
   자주 묻는 질문 페이지
   ======================================== */

/**
 * 자주 묻는 질문 페이지
 *
 * 목적: 사용자들이 자주 묻는 질문과 답변을 카테고리별로 정리하여 보여주는 FAQ 페이지입니다.
 *
 * 사용 페이지:
 * - /faq
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "../../styles/user/faq/faq.module.css";
import richtext_styles from "@/styles/common/html_richtext_content.module.css";
import { sanitizeRichHtml } from "@/utils/security/sanitize";
import SubHeader from "@/components/fragments/SubHeader";
import PageTitle from "@/components/fragments/PageTitle";
import { useFAQData } from "@/hooks/common/useFAQData";

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const { faqs, categories, isLoading } = useFAQData();

  const handleToggleExpand = (id: number) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  /**
   * FAQ 필터링
   * - 카테고리별 필터링
   * - 정렬 규칙:
   *   1. 고정글(핀된 항목)은 상단 배치, 고정글끼리는 최신순
   *   2. 일반 글은 최신순 정렬
   */
  const filteredFAQs = (
    selectedCategory === "전체" ? faqs : faqs.filter((faq) => faq.category === selectedCategory)
  ).sort((a, b) => {
    // 1. 핀된 FAQ를 맨 위로 정렬
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;

    // 2. 둘 다 핀되어 있거나 둘 다 핀 안 되어 있으면 날짜 내림차순 (최신순)
    const date_a = new Date(a.date).getTime();
    const date_b = new Date(b.date).getTime();
    return date_b - date_a;
  });

  return (
    <div className={styles.faq_container}>
      {/* 서브헤더 */}
      <SubHeader />

      <main className={styles.main_content}>
        {/* 페이지 제목 */}
        <PageTitle title="자주 묻는 질문" />
        <section className={styles.section_container}>
          {/* 카테고리 필터 */}
          <div className={styles.category_container}>
            {categories.map((category) => (
              <button
                key={category}
                className={`${styles.category_item} ${
                  selectedCategory === category ? styles.active : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ 목록 또는 빈 상태 */}
          {isLoading ? (
            <div className={styles.empty_state}>
              <p className={styles.empty_text}>로딩 중...</p>
            </div>
          ) : filteredFAQs.length > 0 ? (
            <div className={styles.faq_list}>
              {filteredFAQs.map((faq) => (
                <div key={faq.id} className={styles.faq_item}>
                  <button
                    className={styles.faq_question}
                    onClick={() => handleToggleExpand(faq.id)}
                  >
                    <div className={styles.question_content}>
                      <span
                        className={`${styles.question_number} ${
                          expandedItems.includes(faq.id) ? styles.expanded_question : ""
                        }`}
                      >
                        Q.
                      </span>
                      <span
                        className={`${styles.question_text} ${
                          expandedItems.includes(faq.id) ? styles.expanded_question : ""
                        }`}
                      >
                        {faq.question}
                      </span>
                    </div>
                    <div
                      className={`${styles.expand_icon} ${
                        expandedItems.includes(faq.id) ? styles.expanded : ""
                      }`}
                    >
                      {/* 토글 버튼 아이콘  */}
                      <Image
                        src="/images/icons/dropdown_arrow.svg"
                        alt="펼치기/접기"
                        width={16}
                        height={16}
                      />
                    </div>
                  </button>

                  {/* 답변 내용 */}
                  {expandedItems.includes(faq.id) && (
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
