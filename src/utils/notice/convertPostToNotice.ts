/* ========================================
   관리자 게시글을 공지사항으로 변환하는 유틸 함수
   ======================================== */

/**
 * convertPostToNotice
 *
 * 목적: 관리자 게시글(PostItem)을 공지사항(NoticeDetail) 형식으로 변환
 *
 * 사용 페이지:
 * - 공지사항 목록 조회 (관리자 게시글 연동 시)
 */

import type { PostItem } from "@/data/manager_ga/community/postsData";
import type { NoticeDetail, NoticeTarget } from "@/data/user/notice/noticesData";

/**
 * 관리자 게시글의 target을 공지사항 target으로 변환
 * @param postTarget - 관리자 게시글의 target ("리뷰어" | "파트너" | "관리자" | "전체")
 * @returns 공지사항 target ("user" | "partner" | "all")
 *
 * 참고: "전체" 대상은 "all"로 변환하여 양쪽 페이지에서 별도로 처리합니다.
 */
function convertPostTargetToNoticeTarget(postTarget: string): NoticeTarget | "all" {
  switch (postTarget) {
    case "리뷰어":
      return "user";
    case "파트너":
      return "partner";
    case "전체":
      // 전체 대상인 경우 "all" 반환 (양쪽 모두 표시)
      return "all";
    default:
      return "all";
  }
}

/**
 * 관리자 게시글의 카테고리를 공지사항 카테고리로 변환
 *
 * 변경 사항: 관리자에서 등록한 실제 카테고리명을 그대로 사용합니다.
 * 이제 하드코딩된 카테고리 변환이 아닌, 실제 카테고리명을 그대로 반환합니다.
 *
 * @param postCategory - 관리자 게시글의 카테고리 (실제 카테고리명)
 * @returns 공지사항 카테고리 (실제 카테고리명 그대로 반환)
 */
function convertPostCategoryToNoticeCategory(postCategory: string): string {
  // 관리자에서 등록한 실제 카테고리명을 그대로 사용
  return postCategory;
}

/**
 * 관리자 게시글을 공지사항으로 변환
 * @param post - 관리자 게시글 데이터 (PostItem)
 * @returns 공지사항 데이터 (NoticeDetail) 또는 null (공지사항이 아닌 경우)
 */
export function convertPostToNotice(post: PostItem): NoticeDetail | null {
  // division이 "NOTICE"(공지사항)가 아닌 경우 null 반환
  if (post.division !== "NOTICE") {
    return null;
  }

  // target 변환
  const noticeTarget = convertPostTargetToNoticeTarget(post.target);

  // 카테고리 변환
  const noticeCategory = convertPostCategoryToNoticeCategory(post.category);

  // 공지사항 데이터 생성
  // target이 "all"인 경우 undefined로 저장 (양쪽 모두 표시)
  const notice: NoticeDetail = {
    id: Number(post.id),
    title: post.title,
    date: post.registered_date.split(" ")[0], // 날짜만 추출 (시간 제거)
    category: noticeCategory, // 변환된 카테고리 사용
    content: "", // 본문 내용은 별도로 가져와야 함 (PostDetail에서)
    is_pinned: post.is_pinned,
    target: noticeTarget === "all" ? undefined : noticeTarget, // "all"은 undefined로 변환
  };

  return notice;
}

/**
 * 관리자 게시글 목록을 공지사항 목록으로 변환
 * @param posts - 관리자 게시글 목록
 * @returns 공지사항 목록
 */
export function convertPostsToNotices(posts: PostItem[]): NoticeDetail[] {
  return posts.map(convertPostToNotice).filter((notice): notice is NoticeDetail => notice !== null);
}
