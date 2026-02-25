/* ========================================
   📌 SA 관리자 게시글 목록 페이지
   ======================================== */

/**
 * SA 관리자 게시글 목록 페이지
 *
 * 목적: SA 관리자가 커뮤니티 게시글 목록을 확인하고 관리할 수 있는 페이지입니다.
 *
 * 사용 페이지:
 * - /manager_sa/community/posts
 */

import PostsPageCommon from "@/components/manager/common/community/posts/PostsPageCommon";

export default function PostsPage() {
  return <PostsPageCommon manager_type="sa" />;
}
