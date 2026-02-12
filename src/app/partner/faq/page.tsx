/* ========================================
   ❓ 파트너 FAQ 페이지
   ======================================== */

/**
 * 파트너 FAQ 페이지
 *
 * 목적: 파트너 대상 FAQ를 카테고리별로 정리하여 보여주는 FAQ 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/faq
 *
 * 사용 컴포넌트:
 * - FAQPageClient (공통 컴포넌트)
 * - PartnerHeader (헤더 컴포넌트)
 *
 * 주요 기능:
 * - 카테고리별 FAQ 필터링
 * - 파트너 대상 FAQ만 표시
 * - FAQ 목록 표시 (질문, 답변)
 * - 핀된 FAQ 맨 위 고정
 */

import FAQPageClient from "@/components/common/faq/FAQPageClient";
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";

/**
 * 파트너 FAQ 페이지 컴포넌트
 *
 * @returns 파트너 FAQ 페이지 JSX 요소
 */
export default function PartnerFAQPage() {
  return (
    <FAQPageClient
      header_component={<PartnerSubHeader />}
      target="partner"
      detail_page_path="/partner/faq"
    />
  );
}
