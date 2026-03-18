"use client";

/* ========================================
   📄 게시글 상세 페이지 공통 컴포넌트
   ======================================== */

/**
 * 게시글 상세 페이지 공통 컴포넌트
 *
 * 목적: 관리자 게시글 상세 페이지와 유저/파트너 공지사항 상세 페이지에서
 *       공통으로 사용하는 게시글 상세 조회 컴포넌트입니다.
 *
 * 사용 페이지:
 * - PostDetailPageClient (관리자 게시글 상세)
 * - NoticeDetailPageClient (유저/파트너 공지사항 상세)
 */

import { useRouter } from "next/navigation";
import { type ReactNode } from "react";
import styles from "@/styles/common/post/post_detail_page.module.css";
import { sanitizeRichHtml } from "@/utils/security/sanitize";
import richtext_styles from "@/styles/common/html_richtext_content.module.css";
import Loading from "@/app/loading";

/**
 * 게시글 상세 정보 타입
 * - title: 제목
 * - content: 본문 내용 (HTML 형식)
 * - meta_label: 메타 정보 라벨 (예: "업데이트", "중요", "공지사항" 등)
 * - date: 날짜
 * - division_title?: 구분 제목 (공지사항/자주 묻는 질문/이벤트) - 선택적
 */
export interface PostDetailData {
  title: string;
  content: string;
  meta_label: string; // "업데이트" 또는 카테고리명
  date: string;
  division_title?: string; // division 제목 (관리자 페이지에서만 사용)
}

interface PostDetailPageCommonProps {
  // 게시글 상세 데이터
  post_detail: PostDetailData | null;

  // 뒤로가기 경로
  back_path: string;

  // 로딩 메시지
  loading_message?: string;

  // 사이드바 (관리자 페이지에서만 사용)
  sidebar?: ReactNode;

  // 헤더 컴포넌트 (유저/파트너 페이지에서 사용)
  header_component?: ReactNode;

  // aria-label
  aria_label?: string;
}

/**
 * 게시글 상세 페이지 공통 컴포넌트
 *
 * @param props - PostDetailPageCommonProps 객체
 */
export default function PostDetailPageCommon({
  post_detail,
  back_path,
  loading_message: _loading_message = "게시글을 불러오는 중...",
  sidebar,
  header_component,
  aria_label = "게시글 상세 정보",
}: PostDetailPageCommonProps) {
  const router = useRouter();

  // 뒤로가기 버튼 클릭 핸들러
  const handle_back_click = () => {
    router.push(back_path);
  };

  // 게시글이 없을 경우 로딩 표시
  if (!post_detail) {
    return <Loading />;
  }

  return (
    <main className={styles.container}>
      {/* 사이드바 영역 (관리자 페이지에서만 표시) */}
      {sidebar && (
        <aside className={styles.sidebar} aria-label="관리자 메뉴">
          {sidebar}
        </aside>
      )}

      {/* 헤더 컴포넌트 (유저/파트너 페이지에서 사용) */}
      {header_component}

      {/* 메인 콘텐츠 영역 */}
      <section className={sidebar ? styles.main_content_with_sidebar : styles.main_content}>
        {/* 상단 헤더 영역 (구분 제목 + 뒤로가기 버튼) */}
        {/* header_component가 없을 때만 표시 */}
        {!header_component && (
          <div
            className={
              sidebar ? styles.page_header_wrapper_with_sidebar : styles.page_header_wrapper
            }
          >
            {/* 구분 제목 (division_title이 있으면 표시, 없으면 표시하지 않음) */}
            {post_detail.division_title && (
              <h1 className={styles.division_title}>{post_detail.division_title}</h1>
            )}

            {/* 뒤로가기 버튼 */}
            <button
              className={styles.back_button}
              onClick={handle_back_click}
              aria-label="뒤로가기"
            >
              뒤로가기
            </button>
          </div>
        )}

        {/* 게시글 상세 카드 */}
        <div className={styles.post_card} aria-label={aria_label}>
          {/* 게시글 헤더 박스 (메타 정보 + 제목) */}
          <div className={styles.post_header_box}>
            {/* 게시글 메타 정보 (라벨 + 날짜) */}
            <div className={styles.post_meta}>
              <span className={styles.update_label}>{post_detail.meta_label}</span>
              <span className={styles.post_date}>{post_detail.date}</span>
            </div>

            {/* 게시글 제목 */}
            <h2 className={styles.post_title}>{post_detail.title}</h2>
          </div>

          {/* 게시글 본문 내용 */}
          {/* dangerouslySetInnerHTML: React에서 HTML 문자열을 직접 렌더링할 때 사용합니다. */}
          {/* 주의: XSS 공격에 취약할 수 있으므로 신뢰할 수 있는 데이터만 사용해야 합니다. */}
          <div
            className={`${styles.post_content} ${richtext_styles.richtext_content}`}
            dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(post_detail.content) }}
          />
        </div>
      </section>
    </main>
  );
}
