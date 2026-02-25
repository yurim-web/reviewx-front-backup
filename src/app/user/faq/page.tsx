/* ========================================
   ❓ 유저 FAQ 페이지
   ======================================== */

/**
 * 유저 FAQ 페이지
 *
 * 목적: 리뷰어(유저) 대상 FAQ를 카테고리별로 정리하여 보여주는 FAQ 페이지입니다.
 *
 * 사용 페이지:
 * - /user/faq (유저 FAQ 페이지)
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
    <FAQPageClient header_component={<SubHeader />} target="user" detail_page_path="/user/faq" />
  );
}
