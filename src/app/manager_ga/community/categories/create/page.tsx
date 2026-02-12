/* ========================================
   📝 GA 관리자 카테고리 등록 페이지
   ======================================== */

/**
 * GA 관리자 카테고리 등록 페이지
 *
 * 목적: GA 관리자가 새로운 카테고리를 등록할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_ga/community/categories/create
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
 * - manager_type="ga": GA 관리자 타입
 */
export default function CategoryCreatePage() {
  return <CategoryForm mode="create" manager_type="ga" />;
}

