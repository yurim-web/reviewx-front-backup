/* ========================================
   ❓ 파트너 FAQ 페이지
   ======================================== */

/**
 * 파트너 FAQ 페이지
 *
 * 목적: 파트너 대상 FAQ를 카테고리별로 정리하여 보여주는 FAQ 페이지입니다.
 *
 * 사용 페이지:
 * - /partner/faq
 */

"use client";

import { withPartnerAuth } from "@/components/auth/withAuth";
import FAQPageClient from "@/components/common/faq/FAQPageClient";
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";

/**
 * 파트너 FAQ 페이지 컴포넌트
 *
 * @returns 파트너 FAQ 페이지 JSX 요소
 */
function PartnerFAQPage() {
  return (
    <FAQPageClient
      header_component={<PartnerSubHeader />}
      target="partner"
      detail_page_path="/partner/faq"
    />
  );
}

export default withPartnerAuth(PartnerFAQPage);
