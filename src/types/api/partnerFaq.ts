/**
 * 파트너 FAQ API 타입 정의
 * 백엔드 API 기준: 38. FAQ (리뷰어 /user/faq → 파트너 /partner/boards/faqs)
 */

// ========================================
// board_category ENUM — 백엔드 ERD 기준 12개
// ========================================

export type FaqBoardCategory =
  | "ALL"
  | "IMPORTANT"
  | "NEWS"
  | "EXPERIENCE_GROUP"
  | "EVENT"
  | "UPDATE"
  | "ORDER_SHIPPING"
  | "EXCHANGE_RETURN"
  | "SIGNUP_LOGIN"
  | "CANCEL_REFUND"
  | "POINT"
  | "ETC";

export type FaqTarget = "ALL" | "REVIEWER" | "PARTNER" | "ADMIN";

// ========================================
// GET /partner/boards/faqs
// ========================================

/** FAQ 목록 요청 파라미터 */
export interface FaqListParams {
  board_category?: FaqBoardCategory;
}

/** FAQ 항목 */
export interface FaqItem {
  boardId: number;
  division: "QUESTIONS";
  boardCategory: FaqBoardCategory;
  title: string;
  content: string;
  target: FaqTarget;
  createdAt: string;
}

/** FAQ 목록 응답 */
export interface FaqListResponse {
  result: string;
  generatedAt: string;
  totalCount: number;
  items: FaqItem[];
}
