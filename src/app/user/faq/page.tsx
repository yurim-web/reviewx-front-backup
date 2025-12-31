/* ========================================
   ❓ 유저 FAQ 페이지
   ======================================== */

/**
 * 유저 FAQ 페이지
 *
 * 목적: 리뷰어(유저) 대상 FAQ를 카테고리별로 정리하여 보여주는 FAQ 페이지입니다.
 *
 * 페이지 경로:
 * - /user/faq
 *
 * 사용 컴포넌트:
 * - FAQPageClient (공통 컴포넌트)
 * - SubHeader (헤더 컴포넌트)
 *
 * 주요 기능:
 * - 카테고리별 FAQ 필터링
 * - 리뷰어 대상 FAQ만 표시
 * - FAQ 목록 표시 (질문, 답변)
 * - 핀된 FAQ 맨 위 고정
 */

import FAQPageClient from "@/components/common/faq/FAQPageClient";
import SubHeader from "@/components/fragments/SubHeader";

/**
 * 유저 FAQ 페이지 컴포넌트
 *
 * @returns 유저 FAQ 페이지 JSX 요소
 */
export default function UserFAQPage() {
  return (
    <FAQPageClient
      header_component={<SubHeader />}
      target="user"
      detail_page_path="/user/faq"
    />
  );
}

