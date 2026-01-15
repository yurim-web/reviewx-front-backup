"use client";
/* ========================================
   📄 게시글 상세 페이지 컴포넌트 (공통)
   ======================================== */

/**
 * 게시글 상세 페이지 컴포넌트 (공통)
 *
 * 목적: GA/SA 관리자 게시글 상세 페이지에서 공통으로 사용하는 게시글 상세 조회 컴포넌트입니다.
 *       동적 라우트를 통해 게시글 ID를 받아 상세 정보를 표시합니다.
 *
 * 사용 페이지:
 * - /manager_ga/community/posts/[id] (GA 관리자 게시글 상세 페이지)
 * - /manager_sa/community/posts/[id] (SA 관리자 게시글 상세 페이지)
 */

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  get_post_detail,
  type PostDetail,
} from "@/data/manager_ga/community/postsData";
import PostDetailPageCommon, {
  type PostDetailData,
} from "@/components/common/post/PostDetailPageCommon";
import sidebarStyles from "@/styles/common/post/post_detail_page.module.css";

// 사이드바 메뉴 데이터
const sideMenuItems = [
  { label: "홈", isActive: false },
  { label: "캠페인", isActive: false },
  { label: "정산", isActive: false },
  { label: "회원", isActive: false },
  { label: "커뮤니티", isActive: false },
  { label: "대시보드", isActive: false },
  { label: "진행 현황", isActive: false },
  { label: "출금 현황", isActive: false },
  { label: "출금 요청", isActive: false },
  { label: "결제 내역", isActive: false },
  { label: "리뷰어 목록", isActive: false },
  { label: "파트너 목록", isActive: false },
  { label: "관리자 목록", isActive: false },
  { label: "차단 내역", isActive: false },
  { label: "게시글 목록", isActive: true },
  { label: "카테고리 관리", isActive: false },
];

interface PostDetailPageClientProps {
  manager_type: "ga" | "sa";
}

export default function PostDetailPageClient({
  manager_type,
}: PostDetailPageClientProps) {
  // useParams: Next.js의 동적 라우트 파라미터를 가져오는 Hook입니다.
  // 클라이언트 컴포넌트에서는 useParams를 사용하여 [id]와 같은 동적 라우트 값을 가져옵니다.
  const params = useParams();
  const post_id = params?.id as string;

  // manager_type에 따른 base path 설정
  const base_path =
    manager_type === "ga"
      ? "/manager_ga/community/posts"
      : "/manager_sa/community/posts";

  // 게시글 상세 정보 상태 관리
  // useState는 React의 Hook으로, 컴포넌트의 상태를 관리합니다.
  // [현재 값, 값을 변경하는 함수] 형태로 반환됩니다.
  const [post_detail, set_post_detail] = useState<PostDetail | null>(null);

  // useEffect: 컴포넌트가 마운트될 때 게시글 상세 정보를 가져옵니다.
  // useEffect는 React의 Hook으로, 컴포넌트의 생명주기와 관련된 작업을 수행합니다.
  // post_id가 변경될 때마다 실행됩니다.
  useEffect(() => {
    if (!post_id) return;

    // 게시글 ID로 상세 정보를 가져옵니다.
    const detail = get_post_detail(post_id);
    set_post_detail(detail);
  }, [post_id]);

  // PostDetail을 PostDetailData로 변환
  // meta_label에는 실제 카테고리 정보를 사용합니다
  const post_detail_data: PostDetailData | null = post_detail
    ? {
        title: post_detail.title,
        content: post_detail.content,
        meta_label: post_detail.category, // 실제 카테고리 정보 사용
        date: post_detail.updated_date || post_detail.registered_date,
        division_title: post_detail.division,
      }
    : null;

  // 사이드바 렌더링
  const sidebar_content = (
    <>
      {/* 배열 map 메서드를 사용하여 메뉴 아이템을 렌더링합니다. */}
      {sideMenuItems.map((item) => (
        <p
          key={item.label}
          className={`${sidebarStyles.sidebar_item} ${
            item.isActive ? sidebarStyles.sidebar_item_active : ""
          }`}
        >
          {item.label}
        </p>
      ))}
    </>
  );

  return (
    <PostDetailPageCommon
      post_detail={post_detail_data}
      back_path={base_path}
      loading_message="게시글을 불러오는 중..."
      sidebar={sidebar_content}
      aria_label="게시글 상세 정보"
    />
  );
}
