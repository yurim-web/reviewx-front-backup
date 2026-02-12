/* ========================================
   📄 파트너 FAQ 상세 페이지
   ======================================== */

/**
 * 파트너 FAQ 상세 페이지
 *
 * 목적: 파트너가 FAQ 상세 내용을 확인할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/faq/[id]
 *
 * 사용 컴포넌트:
 * - FAQDetailPageClient (공통 컴포넌트)
 * - PartnerSubHeader (파트너 전용 서브헤더)
 */

import FAQDetailPageClient from "@/components/common/faq/FAQDetailPageClient";
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";

/**
 * 파트너 FAQ 상세 페이지 컴포넌트
 *
 * @returns 파트너 FAQ 상세 페이지 JSX 요소
 */
export default function PartnerFAQDetailPage() {
  return (
    <FAQDetailPageClient
      target="partner"
      header_component={<PartnerSubHeader />}
    />
  );
}
