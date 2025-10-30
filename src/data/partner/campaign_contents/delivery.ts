/* ========================================
   🚚 배송형 콘텐츠 더미 데이터 & 조회 함수
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

export function getDeliveryContentsById(campaignId: string): ContentByTab {
  // 종료/취소 탭 데이터(배송형): 902 매핑
  if (campaignId === "902") {
    return (
      getClosedContentsById(campaignId) ?? { reviewing: [], completed: [] }
    );
  }
  // 진행 중인데 콘텐츠 없는 캠페인 (963)
  if (campaignId === "963") {
    return { reviewing: [], completed: [] };
  }

  const reviewing: ContentItem[] = [
    makeItem({
      id: "d-r-1",
      createdAt: "2025-01-15T10:00:00.000Z",
      status: "검수",
      userType: "리뷰어",
      nickname: "배송리뷰어1",
      channelId: "blog_user_001",
      channel: "네이버블로그",
    }),
    makeItem({
      id: "d-r-2",
      createdAt: "2025-01-15T11:30:00.000Z",
      status: "검수",
      userType: "인플루언서",
      nickname: "배송인플루언서1",
      channelId: "insta_user_001",
      channel: "인스타그램",
      updatedAt: "2025-01-15T12:00:00.000Z",
    }),
    makeItem({
      id: "d-r-3",
      createdAt: "2025-01-15T13:15:00.000Z",
      status: "검수",
      userType: "리뷰어",
      nickname: "배송리뷰어2",
      channelId: "blog_user_002",
      channel: "네이버블로그",
      isRejected: true,
    }),
    makeItem({
      id: "d-r-4",
      createdAt: "2025-01-15T14:45:00.000Z",
      status: "검수",
      userType: "인플루언서",
      nickname: "배송인플루언서2",
      channelId: "insta_user_002",
      channel: "인스타그램",
      isLate: true,
    }),
  ];

  const completed: ContentItem[] = [
    makeItem({
      id: "d-c-1",
      createdAt: "2025-01-10T09:00:00.000Z",
      status: "완료",
      userType: "리뷰어",
      nickname: "배송완료리뷰어1",
      channelId: "blog_user_003",
      channel: "네이버블로그",
    }),
    makeItem({
      id: "d-c-2",
      createdAt: "2025-01-10T10:20:00.000Z",
      status: "완료",
      userType: "인플루언서",
      nickname: "배송완료인플루언서1",
      channelId: "insta_user_003",
      channel: "인스타그램",
      updatedAt: "2025-01-10T11:00:00.000Z",
    }),
    makeItem({
      id: "d-c-3",
      createdAt: "2025-01-10T12:30:00.000Z",
      status: "완료",
      userType: "리뷰어",
      nickname: "배송완료리뷰어2",
      channelId: "blog_user_004",
      channel: "네이버블로그",
      isLate: true,
    }),
  ];

  return { reviewing, completed };
}
