/* ========================================
   리뷰어 FAQ 상세 페이지
   ======================================== */

/**
 * UserFAQDetailPage
 *
 * 목적: 리뷰어(유저)가 FAQ 상세 내용을 확인할 수 있는 페이지
 *
 * 페이지 경로:
 * - /user/faq/[id]
 *
 * API:
 * - 38번: GET /user/faq (목록에서 boardId로 조회 — 상세 API 없음)
 */

"use client";

import { useParams } from "next/navigation";
import FAQDetailPageClient from "@/components/common/faq/FAQDetailPageClient";
import SubHeader from "@/components/fragments/SubHeader";
import { useUserFaqList } from "@/hooks/user/faq/useUserFaqs";
import type { FaqBoardCategory } from "@/types/api/partnerFaq";

/** board_category ENUM → 화면 표시명 매핑 */
const CATEGORY_LABELS: Record<FaqBoardCategory, string> = {
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

export default function UserFAQDetailPage() {
  const params = useParams();
  const boardId = Number(params?.id);

  // 상세 API 없음 — 목록 전체를 조회하여 boardId로 찾기
  const { data, isLoading } = useUserFaqList("ALL");

  const item = data?.items?.find((i) => i.boardId === boardId) ?? null;
  const categoryLabel = item ? (CATEGORY_LABELS[item.boardCategory] ?? item.boardCategory) : "";

  return (
    <FAQDetailPageClient
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
