/* ========================================
   🎯 미션형 콘텐츠 더미 데이터 & 조회 함수
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
    actionType: partial.actionType,
    missionType: partial.missionType,
  };
}

export function getMissionContentsById(campaignId: string): ContentByTab {
  // 진행 중인데 콘텐츠 없는 캠페인
  // 16은 콘텐츠 있음, 963은 콘텐츠 없음
  // 종료/취소 탭 데이터(미션형): 904 매핑
  if (campaignId === "904") {
    return (
      getClosedContentsById(campaignId) ?? { reviewing: [], completed: [] }
    );
  }
  if (campaignId === "963") {
    return { reviewing: [], completed: [] };
  }

  // 진행 탭에 추가한 새 미션형 캠페인(965) 더미 데이터
  if (campaignId === "965") {
    const reviewing: ContentItem[] = [
      makeItem({
        id: "965-r-1",
        createdAt: "2025-11-03T10:00:00.000Z",
        status: "검수",
        userType: "리뷰어",
        nickname: "965-검수-이미지+링크",
        channelId: "ms_965_r_1",
        channel: "네이버블로그",
        actionType: 2,
        missionType: 1,
      }),
      makeItem({
        id: "965-r-2",
        createdAt: "2025-11-03T10:20:00.000Z",
        status: "검수",
        userType: "리뷰어",
        nickname: "965-검수-이미지",
        channelId: "ms_965_r_2",
        channel: "네이버블로그",
        actionType: 3,
        missionType: 2,
        updatedAt: "2025-11-03T10:40:00.000Z",
      }),
      makeItem({
        id: "965-r-3",
        createdAt: "2025-11-03T10:35:00.000Z",
        status: "검수",
        userType: "인플루언서",
        nickname: "965-검수-링크",
        channelId: "ms_965_r_3",
        channel: "인스타그램",
        actionType: 4,
        missionType: 3,
      }),
      // 반려 처리 케이스 2종
      makeItem({
        id: "965-r-4",
        createdAt: "2025-11-03T11:00:00.000Z",
        status: "검수",
        userType: "리뷰어",
        nickname: "965-반려처리-이미지+링크",
        channelId: "ms_965_r_4",
        channel: "네이버블로그",
        actionType: 2,
        missionType: 4,
        isRejected: true,
      }),
      makeItem({
        id: "965-r-5",
        createdAt: "2025-11-03T11:15:00.000Z",
        status: "검수",
        userType: "인플루언서",
        nickname: "965-반려처리-링크",
        channelId: "ms_965_r_5",
        channel: "인스타그램",
        actionType: 4,
        missionType: 6,
        isRejected: true,
      }),
    ];

    const completed: ContentItem[] = [
      makeItem({
        id: "965-c-1",
        createdAt: "2025-11-02T18:40:00.000Z",
        status: "완료",
        userType: "리뷰어",
        nickname: "965-완료-이미지+링크",
        channelId: "ms_965_c_1",
        channel: "네이버블로그",
        actionType: 2,
        missionType: 7,
      }),
      makeItem({
        id: "965-c-2",
        createdAt: "2025-11-02T19:00:00.000Z",
        status: "완료",
        userType: "리뷰어",
        nickname: "965-완료-이미지",
        channelId: "ms_965_c_2",
        channel: "네이버블로그",
        actionType: 3,
        missionType: 8,
        updatedAt: "2025-11-02T19:20:00.000Z",
      }),
      makeItem({
        id: "965-c-3",
        createdAt: "2025-11-02T19:30:00.000Z",
        status: "완료",
        userType: "인플루언서",
        nickname: "965-완료-링크",
        channelId: "ms_965_c_3",
        channel: "인스타그램",
        actionType: 4,
        missionType: 9,
        isLate: true,
      }),
    ];

    return { reviewing, completed };
  }

  const reviewing: ContentItem[] = [
    makeItem({
      id: "m-r-1",
      createdAt: "2025-01-15T16:00:00.000Z",
      status: "검수",
      userType: "리뷰어",
      nickname: "미션리뷰어1",
      channelId: "mission_user_001",
      channel: "네이버블로그",
      actionType: 1,
      missionType: 1,
    }),
    makeItem({
      id: "m-r-2",
      createdAt: "2025-01-15T16:30:00.000Z",
      status: "검수",
      userType: "인플루언서",
      nickname: "미션인플루언서1",
      channelId: "mission_user_002",
      channel: "인스타그램",
      actionType: 2,
      missionType: 1,
      updatedAt: "2025-01-15T17:00:00.000Z",
    }),
    makeItem({
      id: "m-r-3",
      createdAt: "2025-01-15T17:15:00.000Z",
      status: "검수",
      userType: "리뷰어",
      nickname: "미션리뷰어2",
      channelId: "mission_user_003",
      channel: "네이버블로그",
      actionType: 3,
      missionType: 5, // 이미지-only 반려 처리 카드
      isRejected: true,
    }),
    makeItem({
      id: "m-r-4",
      createdAt: "2025-01-15T17:45:00.000Z",
      status: "검수",
      userType: "인플루언서",
      nickname: "미션인플루언서2",
      channelId: "mission_user_004",
      channel: "인스타그램",
      actionType: 4,
      missionType: 3,
      isLate: true,
    }),
    // 반려 처리 카드 추가 샘플 (이미지+링크 조합)
    makeItem({
      id: "m-r-5",
      createdAt: "2025-01-15T18:10:00.000Z",
      status: "검수",
      userType: "리뷰어",
      nickname: "미션리뷰어3",
      channelId: "mission_user_005",
      channel: "네이버블로그",
      actionType: 2,
      missionType: 4,
      isRejected: true,
    }),
    // 반려 처리 카드 추가 샘플 (링크만)
    makeItem({
      id: "m-r-6",
      createdAt: "2025-01-15T18:30:00.000Z",
      status: "검수",
      userType: "인플루언서",
      nickname: "미션인플루언서3",
      channelId: "mission_user_006",
      channel: "인스타그램",
      actionType: 4,
      missionType: 6,
      isRejected: true,
    }),
  ];

  const completed: ContentItem[] = [
    makeItem({
      id: "m-c-1",
      createdAt: "2025-01-13T09:00:00.000Z",
      status: "완료",
      userType: "리뷰어",
      nickname: "미션완료리뷰어1",
      channelId: "mission_user_005",
      channel: "네이버블로그",
      actionType: 2,
      missionType: 7,
    }),
    makeItem({
      id: "m-c-2",
      createdAt: "2025-01-13T10:00:00.000Z",
      status: "완료",
      userType: "인플루언서",
      nickname: "미션완료인플루언서1",
      channelId: "mission_user_006",
      channel: "인스타그램",
      actionType: 1,
      missionType: 7,
      updatedAt: "2025-01-13T11:00:00.000Z",
    }),
    makeItem({
      id: "m-c-3",
      createdAt: "2025-01-13T11:30:00.000Z",
      status: "완료",
      userType: "리뷰어",
      nickname: "미션완료리뷰어2",
      channelId: "mission_user_007",
      channel: "네이버블로그",
      actionType: 4,
      missionType: 9,
      isLate: true,
    }),
  ];

  return { reviewing, completed };
}
