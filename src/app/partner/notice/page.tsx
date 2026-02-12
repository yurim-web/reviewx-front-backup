/* ========================================
   📢 파트너 공지사항 페이지
   ======================================== */

/**
 * 파트너 공지사항 페이지
 *
 * 목적: 파트너 대상 공지사항을 카테고리별로 정리하여 보여주는 공지사항 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/notice
 *
 * 사용 컴포넌트:
 * - NoticePageClient (공통 컴포넌트)
 * - PartnerHeader (헤더 컴포넌트)
 *
 * 주요 기능:
 * - 카테고리별 공지사항 필터링
 * - 파트너 대상 공지사항만 표시
 * - 공지사항 목록 표시 (제목, 날짜, 카테고리)
 * - 핀된 공지사항 맨 위 고정
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
