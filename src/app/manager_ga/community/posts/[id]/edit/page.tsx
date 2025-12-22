import type { Metadata } from "next";
import PostFormPageClient from "@/components/manager/common/community/posts/form/PostFormPageClient";
import { get_post_detail } from "@/data/manager_ga/community/postsData";

// 서버 컴포넌트: metadata 선언 + 클라이언트 페이지 래핑
export const metadata: Metadata = {
  title: "게시글 수정 | ReviewX 관리자",
};

interface PageProps {
  params: { id: string };
}

export default function EditPostPage({ params }: PageProps) {
  // 서버 컴포넌트에서 게시글 상세 정보를 조회합니다.
  const post_detail = get_post_detail(params.id);

  // 게시글이 없을 경우 에러 처리
  if (!post_detail) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  // PostFormPageClient에 수정 모드와 초기 데이터 전달
  return (
    <PostFormPageClient
      mode="edit"
      post_id={params.id}
      manager_type="ga"
      initial_data={{
        category_type: post_detail.division || "",
        category: post_detail.category || "",
        target: post_detail.target || "",
        title: post_detail.title,
        body: post_detail.content,
      }}
    />
  );
}
