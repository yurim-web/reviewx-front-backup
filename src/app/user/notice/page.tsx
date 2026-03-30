/* ========================================
   리뷰어 공지사항 페이지
   ======================================== */

/**
 * UserNoticePage
 *
 * 목적: 리뷰어(유저) 대상 공지사항을 카테고리별로 정리하여 보여주는 공지사항 페이지
 *
 * 사용 페이지:
 * - /user/notice (유저 공지사항 페이지)
 *
 * API:
 * - 37번: GET /user/notice (공지사항 목록)
 */

"use client";

import NoticePageClient from "@/components/common/notice/NoticePageClient";
import SubHeader from "@/components/fragments/SubHeader";
import { useUserNoticeList } from "@/hooks/user/notice/useUserNotices";
import type { NoticeBoardCategory } from "@/types/api/partnerNotice";

/** board_category ENUM → 화면 표시명 매핑 */
const CATEGORY_LABELS: Record<NoticeBoardCategory, string> = {
  ALL: "전체",
  IMPORTANT: "중요",
  NEWS: "소식",
  EXPERIENCE_GROUP: "체험단",
  EVENT: "이벤트",
  UPDATE: "업데이트",
  ORDER_SHIPPING: "주문/배송",
  EXCHANGE_RETURN: "교환/반품",
  SIGNUP_LOGIN: "가입/로그인",
  CANCEL_REFUND: "취소/환불",
  POINT: "포인트",
  ETC: "기타",
};

/** 카테고리 탭 순서 (명세서 기준) */
const CATEGORY_ORDER: NoticeBoardCategory[] = [
  "ALL",
  "IMPORTANT",
  "NEWS",
  "EXPERIENCE_GROUP",
  "EVENT",
  "UPDATE",
  "ORDER_SHIPPING",
  "EXCHANGE_RETURN",
  "SIGNUP_LOGIN",
  "CANCEL_REFUND",
  "POINT",
  "ETC",
];

export default function UserNoticePage() {
  const { data, isLoading } = useUserNoticeList("ALL");

  return (
    <NoticePageClient
      header_component={<SubHeader />}
      target="user"
      detail_page_path="/user/notice"
      api_data={{
        items: (data?.items ?? []).map((item) => ({
          boardId: item.boardId,
          title: item.title,
          content: item.content,
          boardCategory: CATEGORY_LABELS[item.boardCategory] ?? item.boardCategory,
          createdAt: item.createdAt,
        })),
        isLoading,
        categories: CATEGORY_ORDER.map((key) => CATEGORY_LABELS[key]),
      }}
    />
  );
}
