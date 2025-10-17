/* ========================================
   ❓ 자주 묻는 질문 페이지
   ======================================== */

/**
 * 자주 묻는 질문 페이지
 *
 * 목적: 사용자들이 자주 묻는 질문과 답변을 카테고리별로 정리하여 보여주는 FAQ 페이지입니다.
 *
 * 페이지 경로:
 * - /user/faq
 *
 * 사용 파일:
 * - 컴포넌트: SubHeader
 * - CSS: faq.module.css
 *
 * 주요 기능:
 * - 카테고리별 FAQ 필터링 (전체, 체험단, 주문/배송, 교환/반품, 회원가입/로그인, 취소/환불, 포인트, 기타)
 * - 아코디언 형태의 Q&A 표시
 * - 질문 클릭 시 답변 펼치기/접기
 * - 메인 헤더 숨김 처리
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../../styles/user/faq/faq.module.css";
import SubHeader from "@/components/fragments/SubHeader";
import {
  faqData,
  faqCategories,
  getFAQsByCategory,
  type FAQItem,
} from "@/data/user/faq/faqData";

// 카테고리는 faqData.ts에서 import

export default function FAQPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  // 메인 헤더 숨기고 서브헤더만 표시
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) header.style.display = "none";
    return () => {
      if (header) header.style.display = "block";
    };
  }, []);

  const handleBackClick = () => {
    router.back();
  };

  const handleToggleExpand = (id: number) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFAQs = getFAQsByCategory(selectedCategory);

  return (
    <div className={styles.faq_container}>
      {/* 서브헤더 */}
      <SubHeader />

      <main className={styles.main_content}>
        {/* 페이지 제목 */}
        <h1 className={styles.page_title}>자주 묻는 질문</h1>
        <div className={styles.divider} />
        <section className={styles.section_container}>
          {/* 카테고리 필터 */}
          <div className={styles.category_container}>
            {faqCategories.map((category) => (
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

          {/* FAQ 목록 */}
          <div className={styles.faq_list}>
            {filteredFAQs.map((faq) => (
              <div key={faq.id} className={styles.faq_item}>
                <button
                  className={styles.faq_question}
                  onClick={() => handleToggleExpand(faq.id)}
                >
                  <div className={styles.question_content}>
                    <span className={styles.question_number}>Q.</span>
                    <span className={styles.question_text}>{faq.question}</span>
                  </div>
                  <div
                    className={`${styles.expand_icon} ${
                      expandedItems.includes(faq.id) ? styles.expanded : ""
                    }`}
                  >
                    {/* 토글 버튼 아이콘  */}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M2.40462 4.7013C2.34097 4.64116 2.2661 4.59414 2.18428 4.56293C2.10246 4.53172 2.0153 4.51693 1.92776 4.5194C1.84023 4.52188 1.75404 4.54157 1.67411 4.57736C1.59419 4.61315 1.5221 4.66432 1.46195 4.72797C1.40181 4.79162 1.35479 4.86649 1.32358 4.94831C1.29236 5.03013 1.27758 5.11729 1.28005 5.20483C1.28253 5.29236 1.30222 5.37855 1.33801 5.45848C1.37379 5.5384 1.42497 5.61049 1.48862 5.67064L7.48862 11.3373C7.6124 11.4543 7.77628 11.5195 7.94662 11.5195C8.11696 11.5195 8.28084 11.4543 8.40462 11.3373L14.4053 5.67064C14.4703 5.61089 14.5228 5.53881 14.5598 5.45859C14.5967 5.37838 14.6174 5.29162 14.6205 5.20335C14.6237 5.11509 14.6092 5.02708 14.5781 4.94445C14.5469 4.86181 14.4996 4.78619 14.439 4.72197C14.3784 4.65776 14.3056 4.60623 14.2248 4.57039C14.1441 4.53454 14.0571 4.5151 13.9688 4.51317C13.8805 4.51125 13.7927 4.52689 13.7105 4.55919C13.6283 4.59148 13.5533 4.63979 13.49 4.7013L7.94662 9.93597L2.40462 4.7013Z"
                        fill="#A8A8A8"
                      />
                    </svg>
                  </div>
                </button>

                {expandedItems.includes(faq.id) && (
                  <div className={styles.faq_answer}>
                    <div className={styles.answer_content}>
                      <span className={styles.answer_number}>A.</span>
                      <span className={styles.answer_text}>{faq.answer}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

