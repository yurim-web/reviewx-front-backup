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
 */

import NoticeDetailPageClient from "@/components/common/notice/NoticeDetailPageClient";

export default function PartnerNoticeDetailPage() {
  return <NoticeDetailPageClient target="partner" />;
}
