import type { Metadata } from "next";
import EditPostPageClient from "@/components/manager/common/community/posts/form/EditPostPageClient";

// 서버 컴포넌트: metadata 선언 + 클라이언트 페이지 래핑
export const metadata: Metadata = {
  title: "게시글 수정 | ReviewX 관리자",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;
  // 클라이언트 컴포넌트로 위임 (localStorage 접근을 위해)
  return <EditPostPageClient post_id={id} manager_type="ga" />;
}
