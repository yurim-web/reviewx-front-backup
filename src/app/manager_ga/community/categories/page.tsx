/* ========================================
   📝 GA 관리자 카테고리 관리 페이지
   ======================================== */

/**
 * GA 관리자 카테고리 관리 페이지
 *
 * 목적: GA 관리자가 커뮤니티 카테고리 목록을 확인하고 관리할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_ga/community/categories
 *
 * 실무에서 사용하는 패턴:
 * - 공통 페이지 컴포넌트(CategoriesPageCommon)를 사용하여 코드 중복을 제거합니다
 * - manager_type='ga'를 전달하여 GA 관리자에 맞는 동작을 사용합니다
 *
 * @returns 카테고리 관리 페이지 JSX
 */

import CategoriesPageCommon from "@/components/manager/common/community/categories/CategoriesPageCommon";

export default function CategoriesPage() {
  return <CategoriesPageCommon manager_type="ga" />;
}
