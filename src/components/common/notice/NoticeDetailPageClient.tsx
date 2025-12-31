"use client";

/* ========================================

   📄 공지사항 상세 페이지 컴포넌트 (공통)

   사용 컴포넌트:
   - 공지사항 상세 페이지 클라이언트 컴포넌트

   사용 페이지:
   - /user/notice/[id] (유저 공지사항 상세)
   - /partner/notice/[id] (파트너 공지사항 상세)

   ======================================== */

import { useRouter, useParams } from "next/navigation";

import { useEffect, useState, useMemo } from "react";

import styles from "@/styles/user/notice/notice_detail_page.module.css";

import {
  type NoticeDetail,
  type NoticeTarget,
} from "@/data/user/notice/noticesData";
import { posts_data } from "@/data/manager_ga/community/postsData";
import { convertPostsToNotices } from "@/utils/notice/convertPostToNotice";
import { get_post_detail } from "@/data/manager_ga/community/postsData";

interface NoticeDetailPageClientProps {
  target?: NoticeTarget; // "user" | "partner" (기본값: "user")
}

export default function NoticeDetailPageClient({
  target = "user",
}: NoticeDetailPageClientProps) {
  const router = useRouter();

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

  const handle_back_click = () => {
    // target에 따라 뒤로가기 경로 결정
    if (target === "partner") {
      router.push("/partner/notice");
    } else {
      router.push("/user/notice");
    }
  };

  if (!notice_detail) {
    return (
      <main className={styles.container}>
        <div className={styles.loading_message}>공지사항을 불러오는 중...</div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      {/* 메인 콘텐츠 영역 */}

      <section className={styles.main_content}>
        {/* 상단 헤더 영역 (구분 제목 + 뒤로가기 버튼) */}

        <div className={styles.page_header_wrapper}>
          {/* 페이지 제목 (공지사항 고정) */}

          <h1 className={styles.division_title}>공지사항</h1>

          {/* 뒤로가기 버튼 */}

          <button
            className={styles.back_button}
            onClick={handle_back_click}
            aria-label="뒤로가기"
          >
            뒤로가기
          </button>
        </div>

        {/* 공지사항 상세 카드 */}

        <div className={styles.post_card} aria-label="공지사항 상세 정보">
          {/* 헤더 박스 (메타 정보 + 제목) */}

          <div className={styles.post_header_box}>
            <div className={styles.post_meta}>
              <span className={styles.update_label}>공지사항</span>

              <span className={styles.post_date}>{notice_detail.date}</span>
            </div>

            <h2 className={styles.post_title}>{notice_detail.title}</h2>
          </div>

          {/* 본문 내용 */}
          {/* dangerouslySetInnerHTML: HTML 태그를 실제로 렌더링하기 위해 사용 */}
          {/* 관리자가 작성한 HTML 콘텐츠가 올바르게 표시됩니다 */}
          <div
            className={styles.post_content}
            dangerouslySetInnerHTML={{ __html: notice_detail.content }}
          />
        </div>
      </section>
    </main>
  );
}
