/* ========================================
   📝 GA 관리자 카테고리 수정 페이지
   ======================================== */

/**
 * GA 관리자 카테고리 수정 페이지
 *
 * 목적: GA 관리자가 기존 카테고리를 수정할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_ga/community/categories/[id]/edit
 *
 * 주요 기능:
 * - 구분 선택 (드롭다운)
 * - 카테고리명 입력
 * - 저장 버튼
 *
 * 컴포넌트 구조:
 * - CategoryForm: 공통 카테고리 등록/수정 폼 컴포넌트
 *
 * @returns 카테고리 수정 페이지 JSX
 */

import CategoryForm from "@/components/manager/common/community/categories/form/CategoryForm";

interface PageProps {
  params: {
    id: string;
  };
}

export default function CategoryEditPage({ params }: PageProps) {
  return <CategoryForm mode="edit" manager_type="ga" category_id={params.id} />;
}
