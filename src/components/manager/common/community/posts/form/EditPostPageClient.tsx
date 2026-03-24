/* ========================================
   게시글 수정 페이지 클라이언트 컴포넌트
   ======================================== */

/**
 * EditPostPageClient
 *
 * 목적: API에서 게시글 상세 데이터를 로드하여 수정 폼에 전달
 *
 * 사용 페이지:
 * - /manager_ga/community/posts/[id]/edit (GA 게시글 수정)
 * - /manager_sa/community/posts/[id]/edit (SA 게시글 수정)
 */

"use client";

import Loading from "@/app/loading";
import PostFormPageClient from "./PostFormPageClient";
import { useBoardDetail } from "@/hooks/manager/ga/useAdminPosts";

interface EditPostPageClientProps {
  post_id: string;
  manager_type: "ga" | "sa";
}

export default function EditPostPageClient({ post_id, manager_type }: EditPostPageClientProps) {
  const { data: detailRes, isLoading } = useBoardDetail(Number(post_id));
  const board = detailRes?.data;

  if (isLoading) {
    return <Loading />;
  }

  if (!board) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  const initial_form_data = {
    category_type: board.division || "",
    category: board.boardCategory || "",
    target: board.target || "",
    title: board.title,
    body: board.content,
  };

  return (
    <PostFormPageClient
      mode="edit"
      post_id={post_id}
      manager_type={manager_type}
      initial_data={initial_form_data}
    />
  );
}
