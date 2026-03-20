"use client";

/* ========================================
   공지사항 상세 페이지 컴포넌트 (공통)

   사용 페이지:
   - /user/notice/[id] (유저 공지사항 상세)
   - /partner/notice/[id] (파트너 공지사항 상세)
   ======================================== */

import { useParams } from "next/navigation";
import { useEffect, useState, useMemo, type ReactNode } from "react";
import { type NoticeDetail, type NoticeTarget } from "@/data/user/notice/noticesData";
import { posts_data } from "@/data/manager_ga/community/postsData";
import { convertPostsToNotices } from "@/utils/notice/convertPostToNotice";
import { get_post_detail } from "@/data/manager_ga/community/postsData";
import PostDetailPageCommon, {
  type PostDetailData,
} from "@/components/common/post/PostDetailPageCommon";
import PageTitle from "@/components/fragments/PageTitle";
import Loading from "@/app/loading";
import styles from "@/styles/user/notice/notice.module.css";

/** API 모드에서 전달하는 상세 데이터 */
interface ApiNoticeDetailData {
  item: {
    boardId: number;
    boardCategory: string;
    title: string;
    content: string;
    createdAt: string;
  } | null;
  isLoading: boolean;
  categoryLabel: string;
}

interface NoticeDetailPageClientProps {
  target?: NoticeTarget;
  header_component?: ReactNode;
  /** API 데이터 (파트너 등 API 연동 시 전달) */
  api_detail?: ApiNoticeDetailData;
}

export default function NoticeDetailPageClient({
  target = "user",
  header_component,
  api_detail,
}: NoticeDetailPageClientProps) {
  const params = useParams();
  const notice_id = params?.id as string;
  const is_api_mode = !!api_detail;

  // ── localStorage 모드 전용 ──
  const [notice_detail, set_notice_detail] = useState<NoticeDetail | null>(null);

  const allNotices = useMemo(() => {
    if (is_api_mode) return [];
    const notices = convertPostsToNotices(posts_data);
    return notices.map((notice) => {
      const postDetail = get_post_detail(notice.id.toString());
      return { ...notice, content: postDetail?.content || notice.content || "" };
    });
  }, [is_api_mode]);

  useEffect(() => {
    if (is_api_mode || !notice_id) return;
    const numericId = Number(notice_id);
    if (Number.isNaN(numericId)) {
      set_notice_detail(null);
      return;
    }
    const detail = allNotices.find((notice) => notice.id === numericId) || null;
    set_notice_detail(detail);
  }, [notice_id, allNotices, is_api_mode]);

  const back_path = target === "partner" ? "/partner/notice" : "/user/notice";

  // ── 로딩 ──
  if (is_api_mode && api_detail.isLoading) {
    return (
      <div className={styles.notice_container}>
        {header_component}
        <Loading />
      </div>
    );
  }

  // ── 데이터 결정 ──
  let post_detail_data: PostDetailData | null = null;

  if (is_api_mode) {
    if (api_detail.item) {
      const format_date = (d: string) =>
        d.includes("T") ? d.split("T")[0].replace(/-/g, ".") : d.split(" ")[0].replace(/-/g, ".");

      post_detail_data = {
        title: api_detail.item.title,
        content: api_detail.item.content,
        meta_label: api_detail.categoryLabel,
        date: format_date(api_detail.item.createdAt),
        division_title: undefined,
      };
    }
  } else if (notice_detail) {
    post_detail_data = {
      title: notice_detail.title,
      content: notice_detail.content,
      meta_label: notice_detail.category,
      date: notice_detail.date,
      division_title: undefined,
    };
  }

  return (
    <div className={styles.notice_container}>
      {header_component}
      <main className={styles.main_content}>
        <PageTitle title="공지사항" />
        <PostDetailPageCommon
          post_detail={post_detail_data}
          back_path={back_path}
          loading_message="공지사항을 불러오는 중..."
          header_component={<></>}
          aria_label="공지사항 상세 정보"
        />
      </main>
    </div>
  );
}
