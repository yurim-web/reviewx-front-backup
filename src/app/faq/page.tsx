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
 * - 카테고리별 FAQ 필터링 (전체, 미션형, 주문/배송, 교환/반품, 회원가입/로그인, 취소/환불, 포인트, 기타)
 * - 아코디언 형태의 Q&A 표시
 * - 질문 클릭 시 답변 펼치기/접기
 * - 메인 헤더 숨김 처리
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "../../styles/user/faq/faq.module.css";
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

  // 🔍 빈 상태 테스트: 아래 주석을 해제하면 빈 상태를 확인할 수 있습니다
  // const filteredFAQs: FAQItem[] = [];
  const filteredFAQs = getFAQsByCategory(selectedCategory);

  return (
    <div className={styles.faq_container}>
      {/* 서브헤더 */}
      <SubHeader />

      <main className={styles.main_content}>
        {/* 페이지 제목 */}
        <h1 className={styles.page_title}>자주 묻는 질문</h1>
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

          {/* FAQ 목록 또는 빈 상태 */}
          {filteredFAQs.length > 0 ? (
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
                        <span className={styles.answer_text}>{faq.answer}</span>
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
