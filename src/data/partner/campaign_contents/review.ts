/* ========================================
   🛒 구매평 콘텐츠 더미 데이터 & 조회 함수
   ======================================== */
import { ContentByTab, ContentItem } from "./types";
import { getClosedContentsById } from "../sharedCampaigns";

const now = new Date();

function makeItem(partial: Partial<ContentItem>): ContentItem {
  return {
    id: partial.id ?? "content-1",
    createdAt: partial.createdAt ?? now.toISOString(),
    status: partial.status ?? "검수",
    userType: partial.userType ?? "리뷰어",
    nickname: partial.nickname ?? "참여자",
    channelId: partial.channelId ?? "id",
    thumbnailSrc: partial.thumbnailSrc,
    channel: partial.channel ?? "네이버블로그",
  };
}

export function getPurchaseReviewContentsById(
  campaignId: string
): ContentByTab {
  // 종료/취소 탭 데이터(구매평): 903 매핑
  if (campaignId === "903") {
    return (
      getClosedContentsById(campaignId) ?? { reviewing: [], completed: [] }
    );
  }
  // 18, 964는 콘텐츠 있음/없음 구분 필요하지 않음 (964는 콘텐츠 없음)
  if (campaignId === "964") {
    return { reviewing: [], completed: [] };
  }

  const reviewing: ContentItem[] = [
    makeItem({
      id: "pr-r-1",
      createdAt: "2025-01-15T14:00:00.000Z",
      status: "검수",
      userType: "리뷰어",
      nickname: "구매평리뷰어1",
      channelId: "review_user_001",
      channel: "네이버블로그",
      actionType: 1, // 영수증 확인
    }),
    makeItem({
      id: "pr-r-2",
      createdAt: "2025-01-15T14:30:00.000Z",
      status: "검수",
      userType: "인플루언서",
      nickname: "구매평인플루언서1",
      channelId: "review_user_002",
      channel: "인스타그램",
      actionType: 2, // 링크 + 이미지
      updatedAt: "2025-01-15T15:00:00.000Z",
    }),
    makeItem({
      id: "pr-r-3",
      createdAt: "2025-01-15T15:15:00.000Z",
      status: "검수",
      userType: "리뷰어",
      nickname: "구매평리뷰어2",
      channelId: "review_user_003",
      channel: "네이버블로그",
      actionType: 3, // 이미지 확인
      isRejected: true,
    }),
    makeItem({
      id: "pr-r-4",
      createdAt: "2025-01-15T15:45:00.000Z",
      status: "검수",
      userType: "인플루언서",
      nickname: "구매평인플루언서2",
      channelId: "review_user_004",
      channel: "인스타그램",
      actionType: 4, // 링크 확인
      isLate: true,
    }),
  ];

  const completed: ContentItem[] = [
    makeItem({
      id: "pr-c-1",
      createdAt: "2025-01-12T10:00:00.000Z",
      status: "완료",
      userType: "리뷰어",
      nickname: "구매평완료리뷰어1",
      channelId: "review_user_005",
      channel: "네이버블로그",
      actionType: 1,
    }),
    makeItem({
      id: "pr-c-2",
      createdAt: "2025-01-12T11:00:00.000Z",
      status: "완료",
      userType: "인플루언서",
      nickname: "구매평완료인플루언서1",
      channelId: "review_user_006",
      channel: "인스타그램",
      actionType: 2,
      updatedAt: "2025-01-12T12:00:00.000Z",
    }),
    makeItem({
      id: "pr-c-3",
      createdAt: "2025-01-12T12:30:00.000Z",
      status: "완료",
      userType: "리뷰어",
      nickname: "구매평완료리뷰어2",
      channelId: "review_user_007",
      channel: "네이버블로그",
      actionType: 4,
      isLate: true,
    }),
  ];

  return { reviewing, completed };
}
