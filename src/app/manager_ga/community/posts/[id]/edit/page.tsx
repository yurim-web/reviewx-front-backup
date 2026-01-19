import type { Metadata } from "next";
import EditPostPageClient from "@/components/manager/common/community/posts/form/EditPostPageClient";

// 서버 컴포넌트: metadata 선언 + 클라이언트 페이지 래핑
export const metadata: Metadata = {
  title: "게시글 수정 | ReviewX 관리자",
};

interface PageProps {
  params: { id: string };
}

export default function EditPostPage({ params }: PageProps) {
  // 클라이언트 컴포넌트로 위임 (localStorage 접근을 위해)
  return (
    <EditPostPageClient post_id={params.id} manager_type="ga" />
  );
}
