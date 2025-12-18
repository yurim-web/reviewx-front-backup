"use client";

/* ========================================

   📄 공지사항 상세 페이지 컴포넌트 (공통)

   사용 컴포넌트:
   - 공지사항 상세 페이지 클라이언트 컴포넌트

   사용 페이지:
   - /notice/[id] (사용자 공지사항 상세)
   - (향후) 파트너/관리자 공지 상세 페이지

   ======================================== */

import { useRouter, useParams } from "next/navigation";

import { useEffect, useState } from "react";

import styles from "@/styles/user/notice/notice_detail_page.module.css";

import {
  get_notice_detail,
  type NoticeDetail,
} from "@/data/user/notice/noticesData";

export default function NoticeDetailPageClient() {
  const router = useRouter();

  const params = useParams();

  const notice_id = params?.id as string;

  const [notice_detail, set_notice_detail] = useState<NoticeDetail | null>(
    null
  );

  useEffect(() => {
    if (!notice_id) return;

    const detail = get_notice_detail(notice_id);

    set_notice_detail(detail);
  }, [notice_id]);

  const handle_back_click = () => {
    router.push("/notice");
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

          <div className={styles.post_content}>{notice_detail.content}</div>
        </div>
      </section>
    </main>
  );
}
