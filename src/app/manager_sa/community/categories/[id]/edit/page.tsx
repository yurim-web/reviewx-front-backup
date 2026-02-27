/* ========================================
   📝 SA 관리자 카테고리 수정 페이지
   ======================================== */

/**
 * SA 관리자 카테고리 수정 페이지
 *
 * 목적: SA 관리자가 기존 카테고리를 수정할 수 있는 페이지입니다.
 *
 * 사용 페이지:
 * - /manager_sa/community/categories/[id]/edit
 */

import type { Metadata } from "next";
import CategoryForm from "@/components/manager/common/community/categories/form/CategoryForm";

// Next.js의 Metadata API를 사용하여 페이지 메타데이터 설정
// SEO 최적화를 위해 페이지 제목을 설정합니다
export const metadata: Metadata = {
  title: "카테고리 수정 | ReviewX 관리자",
};

/**
 * 페이지 Props 타입 정의
 *
 * Next.js 13+ App Router에서는 params를 props로 받습니다.
 * params는 동적 라우트 파라미터를 포함합니다.
 * 예: /manager_sa/community/categories/123/edit → params.id = "123"
 */
interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * 카테고리 수정 페이지 컴포넌트
 *
 * 이 컴포넌트는 서버 컴포넌트입니다.
 * - 서버 컴포넌트: 서버에서 렌더링되어 클라이언트로 전송됩니다
 * - 동적 라우트 파라미터([id])를 통해 카테고리 ID를 받습니다
 * - 클라이언트 컴포넌트로 위임하여 localStorage에서 카테고리 데이터를 로드합니다
 */
export default async function CategoryEditPage({ params }: PageProps) {
  const { id } = await params;
  return <CategoryForm mode="edit" manager_type="sa" category_id={id} />;
}
