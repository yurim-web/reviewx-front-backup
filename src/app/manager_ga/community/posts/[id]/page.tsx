import type { Metadata } from "next";
import PostDetailPageClient from "@/components/manager/common/community/posts/detail/PostDetailPageClient";

// 서버 컴포넌트: metadata 선언 + 클라이언트 페이지 래핑
export const metadata: Metadata = {
  title: "게시글 상세 | ReviewX 관리자",
};

export default function PostDetailPage() {
  // 서버 컴포넌트에서 클라이언트 전용 페이지를 전달만 수행
  // 클라이언트 컴포넌트에서 useParams를 사용하여 동적 라우트 값을 가져옵니다.
  return <PostDetailPageClient />;
}
