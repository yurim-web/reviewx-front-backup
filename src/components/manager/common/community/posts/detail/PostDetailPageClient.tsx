"use client";
/* ========================================
   게시글 상세 페이지 컴포넌트 (공통)
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
import { useBoardDetail } from "@/hooks/manager/ga/useAdminPosts";
import { useSABoardDetail } from "@/hooks/manager/sa/community/useSAAdminPosts";
import { BOARD_DIVISION_LABEL_MAP } from "@/lib/api/posts";
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

export default function PostDetailPageClient({ manager_type }: PostDetailPageClientProps) {
  const params = useParams();
  const post_id = params?.id as string;

  const base_path =
    manager_type === "ga" ? "/manager_ga/community/posts" : "/manager_sa/community/posts";

  const is_sa = manager_type === "sa";
  const gaDetail = useBoardDetail(Number(post_id));
  const saDetail = useSABoardDetail(Number(post_id));
  const { data: detailRes, isLoading } = is_sa ? saDetail : gaDetail;
  const board = detailRes?.data;

  const post_detail_data: PostDetailData | null = board
    ? {
        title: board.title,
        content: board.content,
        meta_label: board.boardCategory,
        date: board.updatedAt || board.createdAt,
        division_title: BOARD_DIVISION_LABEL_MAP[board.division] || board.division,
      }
    : null;

  const sidebar_content = (
    <>
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
      post_detail={isLoading ? null : post_detail_data}
      back_path={base_path}
      loading_message="게시글을 불러오는 중..."
      sidebar={sidebar_content}
      aria_label="게시글 상세 정보"
    />
  );
}
