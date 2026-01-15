"use client";

/* ========================================

   📄 공지사항 상세 페이지 컴포넌트 (공통)

   사용 컴포넌트:
   - 공지사항 상세 페이지 클라이언트 컴포넌트

   사용 페이지:
   - /user/notice/[id] (유저 공지사항 상세)
   - /partner/notice/[id] (파트너 공지사항 상세)

   ======================================== */

import { useParams } from "next/navigation";

import { useEffect, useState, useMemo, type ReactNode } from "react";

import {
  type NoticeDetail,
  type NoticeTarget,
} from "@/data/user/notice/noticesData";
import { posts_data } from "@/data/manager_ga/community/postsData";
import { convertPostsToNotices } from "@/utils/notice/convertPostToNotice";
import { get_post_detail } from "@/data/manager_ga/community/postsData";
import PostDetailPageCommon, {
  type PostDetailData,
} from "@/components/common/post/PostDetailPageCommon";

interface NoticeDetailPageClientProps {
  target?: NoticeTarget; // "user" | "partner" (기본값: "user")
  header_component?: ReactNode; // 헤더 컴포넌트 (선택적, 없으면 기본 뒤로가기 버튼 사용)
}

export default function NoticeDetailPageClient({
  target = "user",
  header_component,
}: NoticeDetailPageClientProps) {
  const params = useParams();

  const notice_id = params?.id as string;

  const [notice_detail, set_notice_detail] = useState<NoticeDetail | null>(
    null
  );

  /**
   * 관리자 게시글 데이터를 공지사항으로 변환하여 조회
   * - division이 "공지사항"인 게시글만 변환
   * - PostDetail의 content도 포함하여 변환
   */
  const allNotices = useMemo(() => {
    const notices = convertPostsToNotices(posts_data);

    // content 추가 (PostDetail에서 가져오기)
    return notices.map((notice) => {
      const postDetail = get_post_detail(notice.id.toString());
      return {
        ...notice,
        content: postDetail?.content || notice.content || "",
      };
    });
  }, []);

  useEffect(() => {
    if (!notice_id) return;

    // 관리자 게시글 데이터에서 공지사항 찾기
    const numericId = Number(notice_id);
    if (Number.isNaN(numericId)) {
      set_notice_detail(null);
      return;
    }

    const detail = allNotices.find((notice) => notice.id === numericId) || null;
    set_notice_detail(detail);
  }, [notice_id, allNotices]);

  // 뒤로가기 경로 결정
  const back_path = target === "partner" ? "/partner/notice" : "/user/notice";

  // NoticeDetail을 PostDetailData로 변환
  const post_detail_data: PostDetailData | null = notice_detail
    ? {
        title: notice_detail.title,
        content: notice_detail.content,
        meta_label: notice_detail.category,
        date: notice_detail.date,
        // header_component가 없을 때만 "공지사항" 제목 표시
        division_title: header_component ? undefined : "공지사항",
      }
    : null;

  return (
    <PostDetailPageCommon
      post_detail={post_detail_data}
      back_path={back_path}
      loading_message="공지사항을 불러오는 중..."
      header_component={header_component}
      aria_label="공지사항 상세 정보"
    />
  );
}
