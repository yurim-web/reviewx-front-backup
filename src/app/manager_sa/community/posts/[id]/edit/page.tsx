/* ========================================
   📝 SA 관리자 게시글 수정 페이지
   ======================================== */

/**
 * SA 관리자 게시글 수정 페이지
 *
 * 목적: SA 관리자가 커뮤니티 게시글을 수정할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_sa/community/posts/[id]/edit
 *
 * 주요 기능:
 * - 게시글 수정 폼 제공
 * - ToastUI Editor를 사용한 게시글 본문 수정
 * - 기존 게시글 데이터를 불러와서 폼에 표시
 *
 * 컴포넌트 구조:
 * - PostFormPageClient: 게시글 작성/수정 공통 컴포넌트
 *   - mode="edit": 수정 모드
 *   - manager_type="sa": SA 관리자 타입
 *   - initial_data: 기존 게시글 데이터
 *
 * @returns 게시글 수정 페이지 JSX
 */

import type { Metadata } from "next";
import PostFormPageClient from "@/components/manager/common/community/posts/form/PostFormPageClient";
// 게시글 상세 정보를 가져오는 함수 import
import { get_post_detail } from "@/data/manager_ga/community/postsData";

// Next.js의 Metadata API를 사용하여 페이지 메타데이터 설정
// SEO 최적화를 위해 페이지 제목을 설정합니다
export const metadata: Metadata = {
  title: "게시글 수정 | ReviewX 관리자",
};

/**
 * 페이지 Props 타입 정의
 *
 * Next.js 13+ App Router에서는 params를 props로 받습니다.
 * params는 동적 라우트 파라미터를 포함합니다.
 * 예: /manager_sa/community/posts/123/edit → params.id = "123"
 */
interface PageProps {
  params: { id: string };
}

/**
 * 게시글 수정 페이지 컴포넌트
 *
 * 이 컴포넌트는 서버 컴포넌트입니다.
 * - 서버 컴포넌트: 서버에서 렌더링되어 클라이언트로 전송됩니다
 * - 동적 라우트 파라미터([id])를 통해 게시글 ID를 받습니다
 * - 서버에서 게시글 데이터를 조회하여 클라이언트 컴포넌트로 전달합니다
 *
 */
export default function EditPostPage({ params }: PageProps) {
  // 서버 컴포넌트에서 게시글 상세 정보를 조회합니다.
  // get_post_detail: 게시글 ID로 상세 정보를 가져오는 함수입니다.
  const post_detail = get_post_detail(params.id);

  // 게시글이 없을 경우 에러 처리
  // 조건부 렌더링: 게시글이 없으면 에러 메시지를 표시합니다.
  if (!post_detail) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  // PostFormPageClient에 수정 모드와 초기 데이터 전달
  // PostFormPageClient는 "use client" 지시어가 있는 클라이언트 컴포넌트입니다
  // mode="edit": 게시글 수정 모드
  // manager_type="sa": SA 관리자 타입
  // post_id: 수정할 게시글 ID
  // initial_data: 기존 게시글 데이터를 폼에 미리 채워넣기 위한 초기값
  return (
    <PostFormPageClient
      mode="edit"
      post_id={params.id}
      manager_type="sa"
      initial_data={{
        // division: 게시글 구분 (공지사항/자주 묻는 질문)
        category_type: post_detail.division || "",
        // category: 게시글 카테고리
        category: post_detail.category || "",
        // target: 게시글 대상 (전체/리뷰어/파트너/관리자)
        target: post_detail.target || "",
        // title: 게시글 제목
        title: post_detail.title,
        // content: 게시글 본문 내용
        body: post_detail.content,
      }}
    />
  );
}
