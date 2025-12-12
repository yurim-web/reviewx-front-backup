/* ========================================
   📝 GA 관리자 카테고리 목록 목업 데이터
   ======================================== */

/**
 * GA 관리자 카테고리 목록 목업 데이터
 *
 * 목적: GA 관리자 카테고리 관리 페이지에서 사용하는 임시 목업 데이터입니다.
 *
 * 사용 페이지:
 * - /manager_ga/community/categories (카테고리 관리 페이지)
 * - /manager_sa/community/categories (카테고리 관리 페이지)
 *
 * 주요 기능:
 * - 카테고리 목록 데이터
 *
 */

// 게시글 구분 타입 정의 (공지사항, 자주 묻는 질문, 이벤트)
export type CategoryDivision = "공지사항" | "자주 묻는 질문" | "이벤트";

// 카테고리 아이템 타입 정의
export interface CategoryItem {
  id: string; // 카테고리 ID
  number: string; // 번호 (예: 000001)
  division: CategoryDivision; // 구분 (공지사항/자주 묻는 질문/이벤트)
  category_name: string; // 카테고리명
}

// 카테고리 목록 데이터
export const categories_data: CategoryItem[] = [
  {
    id: "1",
    number: "000001",
    division: "공지사항",
    category_name: "이벤트",
  },
  {
    id: "2",
    number: "000001",
    division: "공지사항",
    category_name: "공지사항",
  },
  {
    id: "3",
    number: "000001",
    division: "자주 묻는 질문",
    category_name: "캠페인",
  },
  {
    id: "4",
    number: "000001",
    division: "자주 묻는 질문",
    category_name: "기타",
  },
  {
    id: "5",
    number: "000001",
    division: "자주 묻는 질문",
    category_name: "포인트",
  },
  {
    id: "6",
    number: "000022",
    division: "자주 묻는 질문",
    category_name: "취소/환불",
  },
  {
    id: "7",
    number: "000001",
    division: "자주 묻는 질문",
    category_name: "회원가입/로그인",
  },
  {
    id: "8",
    number: "000001",
    division: "자주 묻는 질문",
    category_name: "교환/반품",
  },
  {
    id: "9",
    number: "000001",
    division: "자주 묻는 질문",
    category_name: "주문/배송",
  },
];
