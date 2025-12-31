/* ========================================
   📄 SA 관리자 게시글 상세 페이지
   ======================================== */

/**
 * SA 관리자 게시글 상세 페이지
 *
 * 목적: SA 관리자가 게시글 상세 내용을 확인할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_sa/community/posts/[id]
 *
 * 실무에서 사용하는 패턴:
 * - 공통 상세 페이지 컴포넌트(PostDetailPageClient)를 사용하여 코드 중복을 제거합니다
 * - manager_type='sa'를 전달하여 SA 관리자에 맞는 동작을 사용합니다
 *
 * @returns 게시글 상세 페이지 JSX
 */

import type { Metadata } from "next";
import PostDetailPageClient from "@/components/manager/common/community/posts/detail/PostDetailPageClient";

// 서버 컴포넌트: metadata 선언 + 클라이언트 페이지 래핑
export const metadata: Metadata = {
  title: "게시글 상세 | ReviewX 관리자",
};

export default function PostDetailPage() {
  // 서버 컴포넌트에서 클라이언트 전용 페이지를 전달만 수행
  // 클라이언트 컴포넌트에서 useParams를 사용하여 동적 라우트 값을 가져옵니다.
  return <PostDetailPageClient manager_type="sa" />;
}

