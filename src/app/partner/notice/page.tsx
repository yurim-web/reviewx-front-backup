/* ========================================
   📢 파트너 공지사항 페이지
   ======================================== */

/**
 * 파트너 공지사항 페이지
 *
 * 목적: 파트너 대상 공지사항을 카테고리별로 정리하여 보여주는 공지사항 페이지입니다.
 *
 * 사용 페이지:
 * - /partner/notice
 */

import NoticePageClient from "@/components/common/notice/NoticePageClient";
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";

/**
 * 파트너 공지사항 페이지 컴포넌트
 *
 * @returns 파트너 공지사항 페이지 JSX 요소
 */
export default function PartnerNoticePage() {
  return (
    <NoticePageClient
      header_component={<PartnerSubHeader />}
      target="partner"
      detail_page_path="/partner/notice"
    />
  );
}
