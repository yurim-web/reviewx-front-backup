/* ========================================
   📝 게시글 수정 페이지 클라이언트 컴포넌트
   ======================================== */

/**
 * 게시글 수정 페이지 클라이언트 컴포넌트
 *
 * 목적: localStorage에서 게시글 데이터를 로드하여 수정 폼에 전달합니다.
 *       서버 컴포넌트에서는 localStorage에 접근할 수 없으므로
 *       클라이언트 컴포넌트로 분리했습니다.
 */

"use client";

import { useEffect, useState } from "react";
import PostFormPageClient from "./PostFormPageClient";
import {
  get_post_detail,
  initialize_posts_data,
} from "@/data/manager_ga/community/postsData";

interface EditPostPageClientProps {
  post_id: string;
  manager_type: "ga" | "sa";
}

export default function EditPostPageClient({
  post_id,
  manager_type,
}: EditPostPageClientProps) {
  const [post_detail, set_post_detail] = useState<ReturnType<
    typeof get_post_detail
  > | null>(null);
  const [is_loading, set_is_loading] = useState(true);

  useEffect(() => {
    // 클라이언트에서만 실행
    if (typeof window === "undefined") {
      return;
    }

    // 게시글 데이터 초기화 (localStorage에서 최신 데이터 불러오기)
    initialize_posts_data();

    // 게시글 상세 정보 가져오기
    const detail = get_post_detail(post_id);
    set_post_detail(detail);
    set_is_loading(false);
  }, [post_id]);

  // 로딩 중일 때
  if (is_loading) {
    return <div>로딩 중...</div>;
  }

  // 게시글이 없을 경우
  if (!post_detail) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  // PostFormPageClient에 수정 모드와 초기 데이터 전달
  return (
    <PostFormPageClient
      mode="edit"
      post_id={post_id}
      manager_type={manager_type}
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

