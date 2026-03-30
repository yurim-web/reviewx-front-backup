/* ========================================
   리뷰어 공지사항 상세 페이지
   ======================================== */

/**
 * UserNoticeDetailPage
 *
 * 목적: 리뷰어(유저)가 공지사항 상세 내용을 확인할 수 있는 페이지
 *
 * 페이지 경로:
 * - /user/notice/[id]
 *
 * API:
 * - 37번: GET /user/notice/:boardId (공지사항 상세)
 */

"use client";

import { useParams } from "next/navigation";
import NoticeDetailPageClient from "@/components/common/notice/NoticeDetailPageClient";
import SubHeader from "@/components/fragments/SubHeader";
import { useUserNoticeDetail } from "@/hooks/user/notice/useUserNotices";
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

export default function UserNoticeDetailPage() {
  const params = useParams();
  const boardId = Number(params?.id);
  const { data, isLoading } = useUserNoticeDetail(boardId);

  const item = data?.item ?? null;
  const categoryLabel = item ? (CATEGORY_LABELS[item.boardCategory] ?? item.boardCategory) : "";

  return (
    <NoticeDetailPageClient
      target="user"
      header_component={<SubHeader />}
      api_detail={{
        item: item
          ? {
              boardId: item.boardId,
              boardCategory: item.boardCategory,
              title: item.title,
              content: item.content,
              createdAt: item.createdAt,
            }
          : null,
        isLoading,
        categoryLabel,
      }}
    />
  );
}
