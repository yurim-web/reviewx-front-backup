/* ========================================
   파트너 공지사항 페이지
   ======================================== */

"use client";

import { withPartnerAuth } from "@/components/auth/withAuth";
import NoticePageClient from "@/components/common/notice/NoticePageClient";
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";
import { usePartnerNoticeList } from "@/hooks/partner/usePartnerNotice";
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

function PartnerNoticePage() {
  // 전체 공지사항을 한번에 조회 → 카테고리 필터링은 클라이언트 처리
  const { data, isLoading } = usePartnerNoticeList("ALL");

  return (
    <NoticePageClient
      header_component={<PartnerSubHeader />}
      target="partner"
      detail_page_path="/partner/notice"
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

export default withPartnerAuth(PartnerNoticePage);
