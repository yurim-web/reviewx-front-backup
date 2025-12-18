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

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "@/styles/manager_ga/community/posts/post_detail_page.module.css";
import {
  get_post_detail,
  type PostDetail,
} from "@/data/manager_ga/community/postsData";

// 사이드바 메뉴 데이터 (리스트 렌더링 학습용)
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

export default function PostDetailPageClient() {
  // Next.js 라우터: 페이지 이동에 사용
  // useRouter는 Next.js의 클라이언트 사이드 라우팅을 위한 Hook입니다.
  const router = useRouter();

  // useParams: Next.js의 동적 라우트 파라미터를 가져오는 Hook입니다.
  // 클라이언트 컴포넌트에서는 useParams를 사용하여 [id]와 같은 동적 라우트 값을 가져옵니다.
  const params = useParams();
  const post_id = params?.id as string;

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

  // 뒤로가기 버튼 클릭 핸들러
  // 화살표 함수로 이벤트 핸들러를 정의합니다.
  const handle_back_click = () => {
    // router.push: Next.js에서 페이지를 이동하는 메서드입니다.
    router.push("/manager_ga/community/posts");
  };

  // 게시글이 없을 경우 로딩 또는 에러 메시지 표시
  if (!post_detail) {
    return (
      <main className={styles.container}>
        <div className={styles.loading_message}>게시글을 불러오는 중...</div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      {/* 사이드바 영역 */}
      <aside className={styles.sidebar} aria-label="관리자 메뉴">
        {/* 배열 map 메서드를 사용하여 메뉴 아이템을 렌더링합니다. */}
        {sideMenuItems.map((item) => (
          <p
            key={item.label}
            className={`${styles.sidebar_item} ${
              item.isActive ? styles.sidebar_item_active : ""
            }`}
          >
            {item.label}
          </p>
        ))}
      </aside>

      {/* 메인 콘텐츠 영역 */}
      <section className={styles.main_content}>
        {/* 상단 헤더 영역 (구분 제목 + 뒤로가기 버튼) */}
        <div className={styles.page_header_wrapper}>
          {/* 구분 제목 (공지사항/자주 묻는 질문/이벤트) */}
          <h1 className={styles.division_title}>{post_detail.division}</h1>

          {/* 뒤로가기 버튼 */}
          <button
            className={styles.back_button}
            onClick={handle_back_click}
            aria-label="게시글 목록으로 돌아가기"
          >
            뒤로가기
          </button>
        </div>

        {/* 게시글 상세 카드 */}
        <div className={styles.post_card} aria-label="게시글 상세 정보">
          {/* 게시글 헤더 박스 (메타 정보 + 제목 + 구분선) */}
          <div className={styles.post_header_box}>
            {/* 게시글 메타 정보 (업데이트 + 날짜) */}
            <div className={styles.post_meta}>
              <span className={styles.update_label}>업데이트</span>
              <span className={styles.post_date}>
                {post_detail.updated_date || post_detail.registered_date}
              </span>
            </div>

            {/* 게시글 제목 */}
            <h2 className={styles.post_title}>{post_detail.title}</h2>
          </div>

          {/* 게시글 본문 내용 */}
          {/* dangerouslySetInnerHTML: React에서 HTML 문자열을 직접 렌더링할 때 사용합니다. */}
          {/* 주의: XSS 공격에 취약할 수 있으므로 신뢰할 수 있는 데이터만 사용해야 합니다. */}
          <div
            className={styles.post_content}
            dangerouslySetInnerHTML={{ __html: post_detail.content }}
          />
        </div>
      </section>
    </main>
  );
}
