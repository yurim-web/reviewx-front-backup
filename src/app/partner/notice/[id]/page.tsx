/* ========================================
   파트너 공지사항 상세 페이지
   ======================================== */

"use client";

import { useParams } from "next/navigation";
import { withPartnerAuth } from "@/components/auth/withAuth";
import NoticeDetailPageClient from "@/components/common/notice/NoticeDetailPageClient";
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";
import { usePartnerNoticeDetail } from "@/hooks/partner/usePartnerNotice";
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

function PartnerNoticeDetailPage() {
  const params = useParams();
  const boardId = Number(params?.id);
  const { data, isLoading } = usePartnerNoticeDetail(boardId);

  const item = data?.item ?? null;
  const categoryLabel = item ? (CATEGORY_LABELS[item.boardCategory] ?? item.boardCategory) : "";

  return (
    <NoticeDetailPageClient
      target="partner"
      header_component={<PartnerSubHeader />}
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

export default withPartnerAuth(PartnerNoticeDetailPage);
