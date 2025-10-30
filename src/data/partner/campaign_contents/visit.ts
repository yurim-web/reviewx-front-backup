/* ========================================
   🏬 방문형 콘텐츠 더미 데이터 & 조회 함수
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

export function getVisitContentsById(campaignId: string): ContentByTab {
  // 종료/취소 탭 데이터(방문형): 901 매핑
  if (campaignId === "901") {
    return (
      getClosedContentsById(campaignId) ?? { reviewing: [], completed: [] }
    );
  }
  // 106은 콘텐츠 있음, 963은 콘텐츠 없음
  if (campaignId === "963") {
    return { reviewing: [], completed: [] };
  }

  const reviewing: ContentItem[] = [
    makeItem({
      id: "v-r-1",
      createdAt: "2025-01-15T08:30:00.000Z",
      status: "검수",
      userType: "리뷰어",
      nickname: "방문리뷰어1",
      channelId: "visit_blog_001",
      channel: "네이버블로그",
    }),
    makeItem({
      id: "v-r-2",
      createdAt: "2025-01-15T09:15:00.000Z",
      status: "검수",
      userType: "인플루언서",
      nickname: "방문인플루언서1",
      channelId: "visit_insta_001",
      channel: "인스타그램",
      updatedAt: "2025-01-15T10:00:00.000Z",
    }),
    makeItem({
      id: "v-r-3",
      createdAt: "2025-01-15T10:45:00.000Z",
      status: "검수",
      userType: "리뷰어",
      nickname: "방문리뷰어2",
      channelId: "visit_blog_002",
      channel: "네이버블로그",
      isRejected: true,
    }),
    makeItem({
      id: "v-r-4",
      createdAt: "2025-01-15T11:20:00.000Z",
      status: "검수",
      userType: "인플루언서",
      nickname: "방문인플루언서2",
      channelId: "visit_insta_002",
      channel: "인스타그램",
      isLate: true,
    }),
  ];

  const completed: ContentItem[] = [
    makeItem({
      id: "v-c-1",
      createdAt: "2025-01-10T07:00:00.000Z",
      status: "완료",
      userType: "리뷰어",
      nickname: "방문완료리뷰어1",
      channelId: "visit_blog_003",
      channel: "네이버블로그",
    }),
    makeItem({
      id: "v-c-2",
      createdAt: "2025-01-10T08:30:00.000Z",
      status: "완료",
      userType: "인플루언서",
      nickname: "방문완료인플루언서1",
      channelId: "visit_insta_003",
      channel: "인스타그램",
      updatedAt: "2025-01-10T09:00:00.000Z",
    }),
    makeItem({
      id: "v-c-3",
      createdAt: "2025-01-10T10:00:00.000Z",
      status: "완료",
      userType: "리뷰어",
      nickname: "방문완료리뷰어2",
      channelId: "visit_blog_004",
      channel: "네이버블로그",
      isLate: true,
    }),
  ];

  return { reviewing, completed };
}
