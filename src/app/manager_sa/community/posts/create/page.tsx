/* ========================================
   📝 SA 관리자 게시글 작성 페이지
   ======================================== */

/**
 * SA 관리자 게시글 작성 페이지
 *
 * 목적: SA 관리자가 커뮤니티 게시글을 작성할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_sa/community/posts/create
 *
 * 주요 기능:
 * - 게시글 작성 폼 제공
 * - ToastUI Editor를 사용한 게시글 본문 작성
 * - 카테고리, 대상, 제목, 본문 입력
 *
 * 컴포넌트 구조:
 * - PostFormPageClient: 게시글 작성/수정 공통 컴포넌트
 *   - mode="create": 작성 모드
 *   - manager_type="sa": SA 관리자 타입
 *
 * 학습 포인트:
 * - Next.js 서버 컴포넌트에서 클라이언트 컴포넌트를 래핑하는 패턴
 * - metadata를 사용한 SEO 최적화
 * - 공통 컴포넌트를 재사용하여 코드 중복 제거
 *
 * @returns 게시글 작성 페이지 JSX
 */

import type { Metadata } from "next";
import PostFormPageClient from "@/components/manager/common/community/posts/form/PostFormPageClient";

// Next.js의 Metadata API를 사용하여 페이지 메타데이터 설정
// SEO 최적화를 위해 페이지 제목을 설정합니다
export const metadata: Metadata = {
  title: "게시글 작성 | ReviewX 관리자",
};

/**
 * 게시글 작성 페이지 컴포넌트
 *
 * 이 컴포넌트는 서버 컴포넌트입니다.
 * - 서버 컴포넌트: 서버에서 렌더링되어 클라이언트로 전송됩니다
 * - 클라이언트 컴포넌트(PostFormPageClient)를 래핑하여 사용합니다
 *
 * React 학습 포인트:
 * - 서버 컴포넌트와 클라이언트 컴포넌트의 차이
 * - props를 통해 데이터를 전달하는 방법
 */
export default function CreatePostPage() {
  // 서버 컴포넌트에서 클라이언트 전용 페이지를 전달만 수행
  // PostFormPageClient는 "use client" 지시어가 있는 클라이언트 컴포넌트입니다
  // mode="create": 게시글 작성 모드
  // manager_type="sa": SA 관리자 타입
  return <PostFormPageClient mode="create" manager_type="sa" />;
}
