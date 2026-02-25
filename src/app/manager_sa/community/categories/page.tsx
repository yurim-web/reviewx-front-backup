/* ========================================
   📌 SA 관리자 카테고리 관리 페이지
   ======================================== */

/**
 * SA 관리자 카테고리 관리 페이지
 *
 * 목적: SA 관리자가 커뮤니티 카테고리 목록을 확인하고 관리할 수 있는 페이지입니다.
 *
 * 사용 페이지:
 * - /manager_sa/community/categories
 */

import CategoriesPageCommon from "@/components/manager/common/community/categories/CategoriesPageCommon";

export default function CategoriesPage() {
  return <CategoriesPageCommon manager_type="sa" />;
}
