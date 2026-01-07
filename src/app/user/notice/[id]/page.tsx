/* ========================================
   📄 유저 공지사항 상세 페이지
   ======================================== */

/**
 * 유저 공지사항 상세 페이지
 *
 * 목적: 리뷰어(유저)가 공지사항 상세 내용을 확인할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /user/notice/[id]
 *
 * 사용 컴포넌트:
 * - NoticeDetailPageClient (공통 컴포넌트)
 */

import NoticeDetailPageClient from "@/components/common/notice/NoticeDetailPageClient";

/**
 * 유저 공지사항 상세 페이지 컴포넌트
 *
 * @returns 유저 공지사항 상세 페이지 JSX 요소
 */
export default function UserNoticeDetailPage() {
  return <NoticeDetailPageClient target="user" />;
}





