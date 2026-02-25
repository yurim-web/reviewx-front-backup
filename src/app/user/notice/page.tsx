/* ========================================
   📢 유저 공지사항 페이지
   ======================================== */

/**
 * 유저 공지사항 페이지
 *
 * 목적: 리뷰어(유저) 대상 공지사항을 카테고리별로 정리하여 보여주는 공지사항 페이지입니다.
 *
 * 사용 페이지:
 * - /user/notice (유저 공지사항 페이지)
 */

import NoticePageClient from "@/components/common/notice/NoticePageClient";
import SubHeader from "@/components/fragments/SubHeader";

/**
 * 유저 공지사항 페이지 컴포넌트
 *
 * @returns 유저 공지사항 페이지 JSX 요소
 */
export default function UserNoticePage() {
  return (
    <NoticePageClient
      header_component={<SubHeader />}
      target="user"
      detail_page_path="/user/notice"
    />
  );
}
