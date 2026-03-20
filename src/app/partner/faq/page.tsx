/* ========================================
   파트너 FAQ 페이지
   ======================================== */

"use client";

import { withPartnerAuth } from "@/components/auth/withAuth";
import FAQPageClient from "@/components/common/faq/FAQPageClient";
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";
import { usePartnerFaqList } from "@/hooks/partner/usePartnerFaq";
import type { FaqBoardCategory } from "@/types/api/partnerFaq";

/** board_category ENUM → 화면 표시명 매핑 */
const CATEGORY_LABELS: Record<FaqBoardCategory, string> = {
  ALL: "전체",
  IMPORTANT: "중요",
  NEWS: "새소식",
  EXPERIENCE_GROUP: "체험단",
  EVENT: "이벤트",
  UPDATE: "업데이트",
  ORDER_SHIPPING: "주문/배송",
  EXCHANGE_RETURN: "교환/반품",
  SIGNUP_LOGIN: "회원가입/로그인",
  CANCEL_REFUND: "취소/환불",
  POINT: "포인트",
  ETC: "기타",
};

/** 카테고리 탭 순서 (명세서 기준) */
const CATEGORY_ORDER: FaqBoardCategory[] = [
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

function PartnerFAQPage() {
  // 전체 FAQ를 한번에 조회 → 카테고리 필터링은 FAQPageClient에서 클라이언트 처리
  const { data, isLoading } = usePartnerFaqList("ALL");

  return (
    <FAQPageClient
      header_component={<PartnerSubHeader />}
      target="partner"
      detail_page_path="/partner/faq"
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

export default withPartnerAuth(PartnerFAQPage);
