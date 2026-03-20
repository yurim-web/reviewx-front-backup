/**
 * 파트너 공지사항 API 타입 정의
 * 백엔드 API 기준: 37. 공지사항 조회
 */

// ========================================
// board_category ENUM — 백엔드 ERD 기준 12개
// ========================================

export type NoticeBoardCategory =
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

export type NoticeTarget = "ALL" | "REVIEWER" | "PARTNER" | "ADMIN";

// ========================================
// GET /partner/boards/notices
// ========================================

/** 공지사항 목록 요청 파라미터 */
export interface NoticeListParams {
  board_category?: NoticeBoardCategory;
}

/** 공지사항 항목 */
export interface NoticeItem {
  boardId: number;
  division: "NOTICES";
  boardCategory: NoticeBoardCategory;
  title: string;
  content: string;
  target: NoticeTarget;
  createdAt: string;
}

/** 공지사항 목록 응답 */
export interface NoticeListResponse {
  result: string;
  generatedAt: string;
  totalCount: number;
  items: NoticeItem[];
}

// ========================================
// GET /partner/boards/notices/{boardId}
// ========================================

/** 공지사항 상세 응답 */
export interface NoticeDetailResponse {
  result: string;
  generatedAt: string;
  item: NoticeItem;
}
