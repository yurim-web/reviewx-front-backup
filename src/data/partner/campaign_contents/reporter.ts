/* ========================================
   📰 기자단 콘텐츠 더미 데이터 & 조회 함수
   ======================================== */
import { ContentByTab, ContentItem } from "./types";

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

export function getReporterContentsById(campaignId: string): ContentByTab {
  // 961, 962는 콘텐츠 있음, 나머지 진행 캠페인은 콘텐츠 없음
  const hasContentIds = ["961", "962"];
  if (!hasContentIds.includes(campaignId)) {
    return { reviewing: [], completed: [] };
  }

  const reviewing: ContentItem[] = [
    makeItem({
      id: "rp-r-1",
      createdAt: "2025-01-15T13:00:00.000Z",
      status: "검수",
      userType: "리뷰어",
      nickname: "기자단리뷰어1",
      channelId: "reporter_001",
      channel: "네이버블로그",
    }),
    makeItem({
      id: "rp-r-2",
      createdAt: "2025-01-15T13:40:00.000Z",
      status: "검수",
      userType: "인플루언서",
      nickname: "기자단인플루언서1",
      channelId: "reporter_002",
      channel: "인스타그램",
      updatedAt: "2025-01-15T14:10:00.000Z",
    }),
    makeItem({
      id: "rp-r-3",
      createdAt: "2025-01-15T14:50:00.000Z",
      status: "검수",
      userType: "리뷰어",
      nickname: "기자단리뷰어2",
      channelId: "reporter_003",
      channel: "네이버블로그",
      isRejected: true,
    }),
    makeItem({
      id: "rp-r-4",
      createdAt: "2025-01-15T15:30:00.000Z",
      status: "검수",
      userType: "인플루언서",
      nickname: "기자단인플루언서2",
      channelId: "reporter_004",
      channel: "인스타그램",
      isLate: true,
    }),
  ];

  const completed: ContentItem[] = [
    makeItem({
      id: "rp-c-1",
      createdAt: "2025-01-11T09:00:00.000Z",
      status: "완료",
      userType: "리뷰어",
      nickname: "기자단완료리뷰어1",
      channelId: "reporter_005",
      channel: "네이버블로그",
    }),
    makeItem({
      id: "rp-c-2",
      createdAt: "2025-01-11T10:30:00.000Z",
      status: "완료",
      userType: "인플루언서",
      nickname: "기자단완료인플루언서1",
      channelId: "reporter_006",
      channel: "인스타그램",
      updatedAt: "2025-01-11T11:00:00.000Z",
    }),
    makeItem({
      id: "rp-c-3",
      createdAt: "2025-01-11T11:45:00.000Z",
      status: "완료",
      userType: "리뷰어",
      nickname: "기자단완료리뷰어2",
      channelId: "reporter_007",
      channel: "네이버블로그",
      isLate: true,
    }),
  ];

  return { reviewing, completed };
}
