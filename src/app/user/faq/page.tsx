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

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const mockFAQs: FAQItem[] = [
  {
    id: 1,
    question: "회원정보는 어디서 변경하나요?",
    answer:
      "마이페이지 > 프로필 편집에서 회원정보를 변경하실 수 있습니다. 프로필 사진, 닉네임, 연락처 등을 수정할 수 있습니다.",
    category: "전체",
  },
  {
    id: 2,
    question: "아이디와 비밀번호를 분실했어요.",
    answer:
      "로그인 페이지에서 '아이디/비밀번호 찾기'를 클릭하시면 이메일 또는 휴대폰 번호로 찾기 기능을 이용하실 수 있습니다.",
    category: "회원가입/로그인",
  },
  {
    id: 3,
    question:
      "리뷰X에서 주문하지 않았는데 주문 및 출고 알림톡이 왔어요. 어떻게 된 건가요? 만약 너무 길어서 두 줄이 될 경우 참고로 보여드리는 예시입니다.",
    answer:
      "타인의 개인정보를 사용하여 주문한 경우이거나, 개인정보가 도용된 가능성이 있습니다. 즉시 고객센터로 문의해 주시기 바랍니다.",
    category: "주문/배송",
  },
  {
    id: 4,
    question: "현금 영수증을 받고 싶어요.",
    answer:
      "주문 완료 후 주문 상세 페이지에서 현금영수증 발급을 신청하실 수 있습니다. 휴대폰 번호나 현금영수증 카드 번호를 입력해 주세요.",
    category: "주문/배송",
  },
  {
    id: 5,
    question: "체험단 신청은 어떻게 하나요?",
    answer:
      "메인 페이지의 체험단 캠페인을 확인하시고, 관심 있는 상품의 '체험단 신청' 버튼을 클릭하여 신청하실 수 있습니다.",
    category: "체험단",
  },
  {
    id: 6,
    question: "페이백은 언제 되나요?",
    answer:
      "체험단 리뷰 작성 완료 후 7일 이내에 페이백이 지급됩니다. 리뷰 승인 후 지급 일정은 개별 안내드립니다.",
    category: "포인트",
  },
];

const categories = [
  "전체",
  "체험단",
  "주문/배송",
  "교환/반품",
  "회원가입/로그인",
  "취소/환불",
  "포인트",
  "기타",
];

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

  const filteredFAQs =
    selectedCategory === "전체"
      ? mockFAQs
      : mockFAQs.filter((faq) => faq.category === selectedCategory);

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
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M4 6L8 10L12 6"
                        stroke="#848484"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
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
