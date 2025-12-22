import type { Metadata } from "next";
import PostFormPageClient from "@/components/manager/common/community/posts/form/PostFormPageClient";

// 서버 컴포넌트: metadata 선언 + 클라이언트 페이지 래핑
export const metadata: Metadata = {
  title: "게시글 작성 | ReviewX 관리자",
};

export default function CreatePostPage() {
  // 서버 컴포넌트에서 클라이언트 전용 페이지를 전달만 수행
  return <PostFormPageClient mode="create" manager_type="ga" />;
}
