/* ========================================
   📝 SA 관리자 카테고리 등록 페이지
   ======================================== */

/**
 * SA 관리자 카테고리 등록 페이지
 *
 * 목적: SA 관리자가 새로운 카테고리를 등록할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_sa/community/categories/create
 *
 * 주요 기능:
 * - 구분 선택 (드롭다운)
 * - 카테고리명 입력
 * - 등록 버튼
 *
 * 컴포넌트 구조:
 * - CategoryForm: 공통 카테고리 등록/수정 폼 컴포넌트
 *
 * @returns 카테고리 등록 페이지 JSX
 */

import CategoryForm from "@/components/manager/common/community/categories/form/CategoryForm";

export default function CategoryCreatePage() {
  return <CategoryForm mode="create" manager_type="sa" />;
}
