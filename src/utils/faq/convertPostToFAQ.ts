/* ========================================
   🔄 관리자 게시글을 FAQ로 변환하는 유틸 함수
   ======================================== */

/**
 * 관리자 게시글을 FAQ로 변환하는 유틸 함수
 *
 * 목적: 관리자가 게시글 목록에서 등록한 게시글을 FAQ 데이터 형식으로 변환합니다.
 *
 * 사용 위치:
 * - 관리자 게시글 등록/수정 시
 * - FAQ 목록 조회 시 (API 연동 시)
 *
 * 주요 기능:
 * - PostItem을 FAQItem 형식으로 변환
 * - target 필드 매핑 (리뷰어 → user, 파트너 → partner)
 * - division이 "자주 묻는 질문"인 경우만 변환
 */

import type { PostItem, PostDetail } from "@/data/manager_ga/community/postsData";

/**
 * FAQ 타입 정의
 */
export type FAQTarget = "user" | "partner";

export interface FAQItem {
  id: number; // FAQ ID
  question: string; // 질문 (제목)
  answer: string; // 답변 (본문)
  category: string; // 카테고리
  target?: FAQTarget; // 대상 (user: 리뷰어, partner: 파트너)
  date: string; // 등록일
  is_pinned?: boolean; // 핀 설정 여부
}

/**
 * 관리자 게시글의 target을 FAQ target으로 변환
 * @param postTarget - 관리자 게시글의 target ("리뷰어" | "파트너" | "관리자" | "전체")
 * @returns FAQ target ("user" | "partner" | undefined)
 *
 * 참고: "전체" 대상은 undefined로 변환하여 양쪽 페이지에서 별도로 처리합니다.
 */
function convertPostTargetToFAQTarget(postTarget: string): FAQTarget | undefined {
  switch (postTarget) {
    case "REVIEWER":
      return "user";
    case "PARTNER":
      return "partner";
    case "ALL":
      // 전체 대상인 경우 undefined 반환 (양쪽 모두 표시)
      return undefined;
    default:
      return undefined;
  }
}

/**
 * 관리자 게시글을 FAQ로 변환
 * @param post - 관리자 게시글 데이터 (PostItem)
 * @param postDetail - 관리자 게시글 상세 데이터 (PostDetail | null, 선택적)
 * @returns FAQ 데이터 (FAQItem) 또는 null (FAQ가 아닌 경우)
 */
export function convertPostToFAQ(post: PostItem, postDetail?: PostDetail | null): FAQItem | null {
  // division이 "QUESTIONS"(자주 묻는 질문)이 아닌 경우 null 반환
  if (post.division !== "QUESTIONS") {
    return null;
  }

  // target 변환
  const faqTarget = convertPostTargetToFAQTarget(post.target);

  // FAQ 데이터 생성
  // target이 undefined인 경우 양쪽 모두 표시
  const faq: FAQItem = {
    id: Number(post.id),
    question: post.title, // 제목을 질문으로 사용
    answer: postDetail?.content || "", // 본문을 답변으로 사용
    category: post.category, // 카테고리 그대로 사용
    target: faqTarget, // 변환된 target 사용
    date: post.registered_date, // 등록일시 전체 사용 (최신순 정렬을 위해)
    is_pinned: post.is_pinned, // 핀 설정 여부
  };

  return faq;
}

/**
 * 관리자 게시글 목록을 FAQ 목록으로 변환
 * @param posts - 관리자 게시글 목록
 * @param getPostDetail - 게시글 상세 조회 함수 (선택적)
 * @returns FAQ 목록
 */
export function convertPostsToFAQs(
  posts: PostItem[],
  getPostDetail?: (id: string) => PostDetail | null
): FAQItem[] {
  return posts
    .map((post) => {
      const postDetail = getPostDetail ? getPostDetail(post.id) : undefined;
      return convertPostToFAQ(post, postDetail);
    })
    .filter((faq): faq is FAQItem => faq !== null);
}
