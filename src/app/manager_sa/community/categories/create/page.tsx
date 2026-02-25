/* ========================================
   📝 SA 관리자 카테고리 등록 페이지
   ======================================== */

/**
 * SA 관리자 카테고리 등록 페이지
 *
 * 목적: SA 관리자가 새로운 카테고리를 등록할 수 있는 페이지입니다.
 *
 * 사용 페이지:
 * - /manager_sa/community/categories/create
 */

import type { Metadata } from "next";
import CategoryForm from "@/components/manager/common/community/categories/form/CategoryForm";

// Next.js의 Metadata API를 사용하여 페이지 메타데이터 설정
// SEO 최적화를 위해 페이지 제목을 설정합니다
export const metadata: Metadata = {
  title: "카테고리 등록 | ReviewX 관리자",
};

/**
 * 카테고리 등록 페이지 컴포넌트
 *
 * 이 컴포넌트는 서버 컴포넌트입니다.
 * - 서버 컴포넌트: 서버에서 렌더링되어 클라이언트로 전송됩니다
 * - 클라이언트 컴포넌트(CategoryForm)를 래핑하여 사용합니다
 * - mode="create": 카테고리 등록 모드
 * - manager_type="sa": SA 관리자 타입
 */
export default function CategoryCreatePage() {
  return <CategoryForm mode="create" manager_type="sa" />;
}
