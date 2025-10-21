/* ========================================
   📋 FAQ 데이터
   ======================================== */

/**
 * FAQ 데이터 타입 정의
 */
export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

/**
 * FAQ 목업 데이터
 * TODO: 실제로는 API에서 데이터를 가져와야 함
 */
export const faqData: FAQItem[] = [
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
    question: "미션형 신청은 어떻게 하나요?",
    answer:
      "메인 페이지의 미션형 캠페인을 확인하시고, 관심 있는 상품의 '미션형 신청' 버튼을 클릭하여 신청하실 수 있습니다.",
    category: "미션형",
  },
  {
    id: 6,
    question: "페이백은 언제 되나요?",
    answer:
      "미션형 리뷰 작성 완료 후 7일 이내에 페이백이 지급됩니다. 리뷰 승인 후 지급 일정은 개별 안내드립니다.",
    category: "포인트",
  },
  {
    id: 7,
    question: "포인트는 어떻게 적립되나요?",
    answer:
      "미션형 리뷰 작성 완료, 추천인 가입, 이벤트 참여 등을 통해 포인트를 적립하실 수 있습니다. 자세한 내용은 포인트 정책을 확인해 주세요.",
    category: "포인트",
  },
  {
    id: 8,
    question: "리뷰 작성 시 주의사항이 있나요?",
    answer:
      "정확하고 솔직한 리뷰를 작성해 주세요. 허위 리뷰나 광고성 리뷰는 삭제될 수 있으며, 계정 제재를 받을 수 있습니다.",
    category: "리뷰",
  },
  {
    id: 9,
    question: "캠페인 신청 후 취소할 수 있나요?",
    answer:
      "캠페인 선정 전까지는 언제든지 취소 가능합니다. 선정 후 취소 시 패널티가 부과될 수 있으니 신중히 신청해 주세요.",
    category: "캠페인",
  },
  {
    id: 10,
    question: "고객센터 운영시간은 어떻게 되나요?",
    answer:
      "고객센터는 평일 09:00~18:00 운영됩니다. 주말 및 공휴일에는 운영하지 않으며, 문의사항은 이메일로 남겨주시면 빠른 시일 내에 답변드리겠습니다.",
    category: "고객센터",
  },
];

/**
 * FAQ 카테고리 목록
 */
export const faqCategories = [
  "전체",
  "회원가입/로그인",
  "주문/배송",
  "미션형",
  "포인트",
  "리뷰",
  "캠페인",
  "고객센터",
] as const;

/**
 * 카테고리별 FAQ 필터링 함수
 */
export const getFAQsByCategory = (category: string): FAQItem[] => {
  if (category === "전체") {
    return faqData;
  }
  return faqData.filter((faq) => faq.category === category);
};

/**
 * FAQ 검색 함수
 */
export const searchFAQs = (query: string): FAQItem[] => {
  const lowercaseQuery = query.toLowerCase();
  return faqData.filter(
    (faq) =>
      faq.question.toLowerCase().includes(lowercaseQuery) ||
      faq.answer.toLowerCase().includes(lowercaseQuery)
  );
};
