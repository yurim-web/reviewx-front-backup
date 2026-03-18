/* ========================================
   📄 파트너 공지사항 상세 페이지
   ======================================== */

/**
 * 파트너 공지사항 상세 페이지
 *
 * 목적: 파트너가 공지사항 상세 내용을 확인할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/notice/[id]
 *
 * 사용 컴포넌트:
 * - NoticeDetailPageClient (공통 컴포넌트)
 * - PartnerSubHeader (파트너 전용 서브헤더)
 */

"use client";

import { withPartnerAuth } from "@/components/auth/withAuth";
import NoticeDetailPageClient from "@/components/common/notice/NoticeDetailPageClient";
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";

/**
 * 파트너 공지사항 상세 페이지 컴포넌트
 *
 * @returns 파트너 공지사항 상세 페이지 JSX 요소
 */
function PartnerNoticeDetailPage() {
  return <NoticeDetailPageClient target="partner" header_component={<PartnerSubHeader />} />;
}

export default withPartnerAuth(PartnerNoticeDetailPage);
