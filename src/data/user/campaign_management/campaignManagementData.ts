/* ========================================
   📊 유저 캠페인 관리 임시 데이터
   ======================================== */

/**
 * 유저 캠페인 관리 임시 데이터
 *
 * 목적: 유저 캠페인 관리 페이지에서 사용할 테스트 데이터
 *
 * 사용 위치:
 * - /user/campaign_management 페이지의 캠페인 목록 표시
 *
 * 주요 기능:
 * - 다양한 상태와 서브상태의 캠페인 데이터 제공
 * - 각 캠페인마다 다른 statusMessage 제공
 * - 실제 날짜 기반 remainingDays 계산
 */

import type { CampaignApplication } from "@/types/user/user";

// 임시 유저 캠페인 관리 데이터 (신청 > 선정 > 완료 > 취소/반려 순서)
export const campaignManagementData: CampaignApplication[] = [
  // 신청 상태 캠페인들 (id: 1-5) - 다양한 타입 추가
  // 실제 캠페인 데이터와 매칭: delivery_1
  {
    id: "delivery_1",
    title: "세르프 (박신혜리프팅)",
    category: "네이버블로그",
    image: "/images/main/campaign_img/eximg_9.png",
    status: "신청",
    remainingDays: 5,
    statusMessage: "캠페인 선정 발표까지 1일 남았습니다.",
    type: "배송형",
    isUrgent: false,
    subStatus: undefined,
    hasContent: false,
    isPenalty: false,
  },
  // 실제 캠페인 데이터와 매칭: mission_2
  {
    id: "mission_2",
    title: "헬스케어 미션형",
    category: "", // 미션형은 카테고리 없음 (고정 아이콘 사용)
    image: "/images/main/campaign_img/eximg_2.png",
    status: "신청",
    remainingDays: 2,
    statusMessage: "캠페인 선정 발표까지 2일 남았습니다.",
    type: "미션형",
    isUrgent: true,
    subStatus: undefined,
    hasContent: false,
    isPenalty: false,
  },
  // 실제 캠페인 데이터와 매칭: reporter_1
  {
    id: "reporter_1",
    title: "테크 기자단",
    category: "유튜브",
    image: "/images/main/campaign_img/eximg_1.png",
    status: "신청",
    remainingDays: 3,
    statusMessage: "캠페인 선정 발표까지 3일 남았습니다.",
    type: "기자단",
    isUrgent: false,
    subStatus: undefined,
    hasContent: false,
    isPenalty: false,
  },
  // 실제 캠페인 데이터와 매칭: review_2
  {
    id: "review_2",
    title: "화장품 구매평 리뷰",
    category: "", // 구매평은 카테고리 없음 (고정 아이콘 사용)
    image: "/images/main/campaign_img/eximg_2.png",
    status: "신청",
    remainingDays: 1,
    statusMessage: "캠페인 선정 발표까지 1일 남았습니다.",
    type: "구매평",
    isUrgent: true,
    subStatus: undefined,
    hasContent: false,
    isPenalty: false,
  },
  // 실제 캠페인 데이터와 매칭: visit_15
  {
    id: "visit_15",
    title: "노래방 방문 체험",
    category: "유튜브",
    image: "/images/main/campaign_img/eximg_9.png",
    status: "신청",
    remainingDays: 4,
    statusMessage: "캠페인 선정 발표까지 4일 남았습니다.",
    type: "방문형",
    isUrgent: false,
    subStatus: undefined,
    hasContent: false,
    isPenalty: false,
  },

  // 선정 상태 캠페인들 (id: 3-8, 16-17, 21-30) - 각 유형별 Type 1, Type 2 추가

  // ========== 미션형 ==========
  // Type 1: 콘텐츠 등록하기 (링크만)
  // 실제 캠페인 데이터와 매칭: mission_3
  {
    id: "mission_3",
    title: "홈데코 미션형",
    category: "", // 미션형은 카테고리 없음 (고정 아이콘 사용)
    image: "/images/main/campaign_img/eximg_3.png",
    status: "선정",
    remainingDays: 12,
    statusMessage: "콘텐츠를 등록해주세요.",
    type: "미션형",
    isUrgent: false,
    subStatus: "content_not_registered",
    hasContent: false,
    isPenalty: false,
    contentType: "link", // 링크만 입력하는 ContentRegistrationModal 사용
  },
  // Type 2: 콘텐츠 수정하기 (링크만)
  // 실제 캠페인 데이터와 매칭: mission_1
  {
    id: "mission_1",
    title: "스킨케어 미션형",
    category: "", // 미션형은 카테고리 없음 (고정 아이콘 사용)
    image: "/images/main/campaign_img/eximg_1.png",
    status: "선정",
    remainingDays: 9,
    statusMessage: "콘텐츠가 등록되었습니다.",
    type: "미션형",
    isUrgent: false,
    subStatus: "content_registered",
    hasContent: true,
    isPenalty: false,
    contentType: "link", // 링크만 입력하는 ContentRegistrationModal 사용
  },
  // Type 1: 콘텐츠 등록하기 (이미지만)
  // 실제 캠페인 데이터와 매칭: mission_6
  {
    id: "mission_6",
    title: "디지털 미션형",
    category: "", // 미션형은 카테고리 없음 (고정 아이콘 사용)
    image: "/images/main/campaign_img/eximg_6.png",
    status: "선정",
    remainingDays: 10,
    statusMessage: "이미지 콘텐츠를 등록해주세요.",
    type: "미션형",
    isUrgent: false,
    subStatus: "content_not_registered",
    hasContent: false,
    isPenalty: false,
    contentType: "image", // 이미지만 업로드하는 ImageUploadModal 사용
  },
  // Type 2: 콘텐츠 수정하기 (이미지만)
  // 실제 캠페인 데이터와 매칭: mission_7
  {
    id: "mission_7",
    title: "반려동물 미션형",
    category: "", // 미션형은 카테고리 없음 (고정 아이콘 사용)
    image: "/images/main/campaign_img/eximg_7.png",
    status: "선정",
    remainingDays: 8,
    statusMessage: "이미지 콘텐츠가 등록되었습니다.",
    type: "미션형",
    isUrgent: false,
    subStatus: "content_registered",
    hasContent: true,
    isPenalty: false,
    contentType: "image", // 이미지만 업로드하는 ImageUploadModal 사용
  },
  // Type 1: 콘텐츠 등록하기 (링크 + 이미지)
  // 실제 캠페인 데이터와 매칭: mission_8
  {
    id: "mission_8",
    title: "스포츠 미션형",
    category: "", // 미션형은 카테고리 없음 (고정 아이콘 사용)
    image: "/images/main/campaign_img/eximg_8.png",
    status: "선정",
    remainingDays: 11,
    statusMessage: "콘텐츠를 등록해주세요.",
    type: "미션형",
    isUrgent: false,
    subStatus: "content_not_registered",
    hasContent: false,
    isPenalty: false,
    contentType: "both", // 링크 + 이미지 모두 업로드하는 CombinedContentModal 사용
  },
  // Type 2: 콘텐츠 수정하기 (링크 + 이미지)
  // 실제 캠페인 데이터와 매칭: mission_9
  {
    id: "mission_9",
    title: "뷰티 미션형",
    category: "", // 미션형은 카테고리 없음 (고정 아이콘 사용)
    image: "/images/main/campaign_img/eximg_9.png",
    status: "선정",
    remainingDays: 7,
    statusMessage: "콘텐츠가 등록되었습니다.",
    type: "미션형",
    isUrgent: false,
    subStatus: "content_registered",
    hasContent: true,
    isPenalty: false,
    contentType: "both", // 링크 + 이미지 모두 업로드하는 CombinedContentModal 사용
  },

  // ========== 배송형 ==========
  // Type 1: 콘텐츠 등록하기
  // 실제 캠페인 데이터와 매칭: delivery_3
  {
    id: "delivery_3",
    title: "가죽 여권 케이스+네임택 실미션형 모집",
    category: "인스타그램",
    image: "/images/main/campaign_img/eximg_13.png",
    status: "선정",
    remainingDays: 10,
    statusMessage: "콘텐츠를 등록해주세요.",
    type: "배송형",
    isUrgent: false,
    subStatus: "content_not_registered",
    hasContent: false,
    isPenalty: false,
  },
  // Type 2: 콘텐츠 수정하기
  // 실제 캠페인 데이터와 매칭: delivery_7
  {
    id: "delivery_7",
    title: "유튜브 크리에이터 키트",
    category: "유튜브",
    image: "/images/main/campaign_img/eximg_6.png",
    status: "선정",
    remainingDays: 15,
    statusMessage: "콘텐츠가 등록되었습니다.",
    type: "배송형",
    isUrgent: false,
    subStatus: "content_registered",
    hasContent: true,
    isPenalty: false,
  },

  // ========== 방문형 ==========
  // Type 1: 콘텐츠 등록하기
  // 실제 캠페인 데이터와 매칭: visit_2
  {
    id: "visit_2",
    title: "카페 방문 체험",
    category: "인스타그램",
    image: "/images/main/campaign_img/eximg_9.png",
    status: "선정",
    remainingDays: 7,
    statusMessage: "방문 후 콘텐츠를 등록해주세요.",
    type: "방문형",
    isUrgent: false,
    subStatus: "content_not_registered",
    hasContent: false,
    isPenalty: false,
  },
  // Type 2: 콘텐츠 수정하기
  // 실제 캠페인 데이터와 매칭: visit_1
  {
    id: "visit_1",
    title: "식당 방문 리뷰",
    category: "네이버블로그",
    image: "/images/main/campaign_img/eximg_8.png",
    status: "선정",
    remainingDays: 8,
    statusMessage: "콘텐츠를 검수 중입니다.",
    type: "방문형",
    isUrgent: true,
    subStatus: "content_registered",
    hasContent: true,
    isPenalty: false,
  },

  // ========== 기자단 ==========
  // Type 1: 콘텐츠 등록하기
  // 실제 캠페인 데이터와 매칭: reporter_2
  {
    id: "reporter_2",
    title: "뷰티 기자단",
    category: "네이버블로그",
    image: "/images/main/campaign_img/eximg_2.png",
    status: "선정",
    remainingDays: 14,
    statusMessage: "기자단 활동을 시작해주세요.",
    type: "기자단",
    isUrgent: false,
    subStatus: "content_not_registered",
    hasContent: false,
    isPenalty: false,
  },
  // Type 2: 콘텐츠 수정하기
  // 실제 캠페인 데이터와 매칭: reporter_3
  {
    id: "reporter_3",
    title: "패션 기자단",
    category: "네이버블로그",
    image: "/images/main/campaign_img/eximg_3.png",
    status: "선정",
    remainingDays: 11,
    statusMessage: "기자단 활동 콘텐츠가 등록되었습니다.",
    type: "기자단",
    isUrgent: false,
    subStatus: "content_registered",
    hasContent: true,
    isPenalty: false,
  },

  // ========== 구매평 ==========
  // Type 1: 구매 영수증 등록하기
  // 실제 캠페인 데이터와 매칭: review_3
  {
    id: "review_3",
    title: "가전제품 구매평 리뷰",
    category: "", // 구매평은 카테고리 없음 (고정 아이콘 사용)
    image: "/images/main/campaign_img/eximg_3.png",
    status: "선정",
    remainingDays: 5,
    statusMessage: "구매 영수증을 등록해주세요.",
    type: "구매평",
    isUrgent: true,
    subStatus: "receipt_not_registered",
    hasContent: false,
    isPenalty: false,
  },
  // Type 2: 구매 영수증 수정하기
  // 실제 캠페인 데이터와 매칭: review_4
  {
    id: "review_4",
    title: "의류 구매평 리뷰",
    category: "", // 구매평은 카테고리 없음 (고정 아이콘 사용)
    image: "/images/main/campaign_img/eximg_4.png",
    status: "선정",
    remainingDays: 4,
    statusMessage: "구매 영수증이 등록되었습니다.",
    type: "구매평",
    isUrgent: false,
    subStatus: "receipt_registered",
    hasContent: false,
    isPenalty: false,
  },
  // Type 1: 콘텐츠 등록하기
  // 실제 캠페인 데이터와 매칭: review_5
  {
    id: "review_5",
    title: "식품 구매평 리뷰",
    category: "", // 구매평은 카테고리 없음 (고정 아이콘 사용)
    image: "/images/main/campaign_img/eximg_5.png",
    status: "선정",
    remainingDays: 6,
    statusMessage: "구매평 작성을 완료해주세요.",
    type: "구매평",
    isUrgent: true,
    subStatus: "content_not_registered",
    hasContent: false,
    isPenalty: false,
  },
  // Type 2: 콘텐츠 수정하기
  // 실제 캠페인 데이터와 매칭: review_6
  {
    id: "review_6",
    title: "책 구매평 리뷰",
    category: "", // 구매평은 카테고리 없음 (고정 아이콘 사용)
    image: "/images/main/campaign_img/eximg_6.png",
    status: "선정",
    remainingDays: 3,
    statusMessage: "구매평 콘텐츠가 등록되었습니다.",
    type: "구매평",
    isUrgent: false,
    subStatus: "content_registered",
    hasContent: true,
    isPenalty: false,
  },

  // 완료 상태 캠페인들 (id: 7-10) - 다양한 타입 추가
  // 실제 캠페인 데이터와 매칭: delivery_2
  {
    id: "delivery_2",
    title: "닥터뮬 뮬차 붓기차",
    category: "네이버블로그",
    image: "/images/main/campaign_img/eximg_10.png",
    status: "완료",
    remainingDays: -7,
    statusMessage: "캠페인이 완료되었습니다.",
    type: "배송형",
    isUrgent: false,
    subStatus: "content_registered",
    hasContent: true,
    isPenalty: false,
    // 모든 기준 충족 (모두 초록색)
    missionItems: [
      {
        id: "1",
        text: "글자 수 1,500자 이상",
        isCompleted: true,
      },
      {
        id: "2",
        text: "사진 10장 이상",
        isCompleted: true,
      },
      {
        id: "3",
        text: "동영상 1개 이상, 120초 이상",
        isCompleted: true,
      },
      {
        id: "4",
        text: "본문 내 링크 첨부",
        isCompleted: true,
      },
      {
        id: "5",
        text: "본문 내 키워드/태그 첨부",
        isCompleted: true,
      },
    ],
  },
  // 실제 캠페인 데이터와 매칭: delivery_10
  {
    id: "delivery_10",
    title: "유기농 과일 주스 세트",
    category: "유튜브",
    image: "/images/main/campaign_img/eximg_3.png",
    status: "완료",
    remainingDays: -3,
    statusMessage: "캠페인이 완료되었습니다.",
    type: "배송형",
    isUrgent: false,
    subStatus: "content_registered",
    hasContent: true,
    isPenalty: false,
    // 일부만 충족 (일부 초록색/일부 빨간색)
    missionItems: [
      {
        id: "1",
        text: "글자 수 1,500자 이상",
        isCompleted: true,
      },
      {
        id: "2",
        text: "사진 10장 이상",
        isCompleted: true,
      },
      {
        id: "3",
        text: "동영상 1개 이상, 120초 이상",
        isCompleted: false,
      },
      {
        id: "4",
        text: "본문 내 링크 첨부",
        isCompleted: false,
      },
      {
        id: "5",
        text: "본문 내 키워드/태그 첨부",
        isCompleted: true,
      },
    ],
  },
  // 실제 캠페인 데이터와 매칭: mission_4
  {
    id: "mission_4",
    title: "패션 미션형",
    category: "", // 미션형은 카테고리 없음 (고정 아이콘 사용)
    image: "/images/main/campaign_img/eximg_4.png",
    status: "완료",
    remainingDays: -5,
    statusMessage: "캠페인이 완료되었습니다.",
    type: "미션형",
    isUrgent: false,
    subStatus: "content_registered",
    hasContent: true,
    isPenalty: false,
    // 모두 미충족 (모두 빨간색)
    missionItems: [
      {
        id: "1",
        text: "글자 수 1,500자 이상",
        isCompleted: false,
      },
      {
        id: "2",
        text: "사진 10장 이상",
        isCompleted: false,
      },
      {
        id: "3",
        text: "동영상 1개 이상, 120초 이상",
        isCompleted: false,
      },
      {
        id: "4",
        text: "본문 내 링크 첨부",
        isCompleted: false,
      },
      {
        id: "5",
        text: "본문 내 키워드/태그 첨부",
        isCompleted: false,
      },
    ],
  },
  // 실제 캠페인 데이터와 매칭: reporter_4
  {
    id: "reporter_4",
    title: "푸드 기자단",
    category: "네이버블로그",
    image: "/images/main/campaign_img/eximg_4.png",
    status: "완료",
    remainingDays: -2,
    statusMessage: "캠페인이 완료되었습니다.",
    type: "기자단",
    isUrgent: false,
    subStatus: "content_registered",
    hasContent: true,
    isPenalty: false,
    // 일부만 충족 (다른 조합)
    missionItems: [
      {
        id: "1",
        text: "글자 수 1,500자 이상",
        isCompleted: false,
      },
      {
        id: "2",
        text: "사진 10장 이상",
        isCompleted: true,
      },
      {
        id: "3",
        text: "동영상 1개 이상, 120초 이상",
        isCompleted: true,
      },
      {
        id: "4",
        text: "본문 내 링크 첨부",
        isCompleted: true,
      },
      {
        id: "5",
        text: "본문 내 키워드/태그 첨부",
        isCompleted: false,
      },
    ],
  },
  // 실제 캠페인 데이터와 매칭: delivery_11
  {
    id: "delivery_11",
    title: "스마트 워치 프로",
    category: "네이버블로그",
    image: "/images/main/campaign_img/eximg_8.png",
    status: "완료",
    remainingDays: -10,
    statusMessage: "캠페인이 완료되었습니다.",
    type: "배송형",
    isUrgent: false,
    subStatus: "content_registered",
    hasContent: true,
    isPenalty: false,
    // 모든 기준 충족 (모두 초록색) - 두 번째 케이스
    missionItems: [
      {
        id: "1",
        text: "글자 수 1,500자 이상",
        isCompleted: true,
      },
      {
        id: "2",
        text: "사진 10장 이상",
        isCompleted: true,
      },
      {
        id: "3",
        text: "동영상 1개 이상, 120초 이상",
        isCompleted: true,
      },
      {
        id: "4",
        text: "본문 내 링크 첨부",
        isCompleted: true,
      },
      {
        id: "5",
        text: "본문 내 키워드/태그 첨부",
        isCompleted: true,
      },
    ],
  },

  // 취소/반려 상태 캠페인들 (id: 9-12) - 다양한 타입 추가
  // 실제 캠페인 데이터와 매칭: delivery_5
  {
    id: "delivery_5",
    title: "유기농 아기용 세제",
    category: "인스타그램",
    image: "/images/main/campaign_img/eximg_4.png",
    status: "취소/반려",
    remainingDays: -1,
    statusMessage:
      "등록한 콘텐츠가 반려되었습니다. 반려 사유 확인 후 다시 등록해 주세요.",
    type: "배송형",
    isUrgent: false,
    subStatus: "content_rejected,re_register",
    hasContent: true,
    isPenalty: false,
  },
  // 실제 캠페인 데이터와 매칭: visit_3
  {
    id: "visit_3",
    title: "뷰티샵 방문 체험",
    category: "네이버블로그",
    image: "/images/main/campaign_img/eximg_2.png",
    status: "취소/반려",
    remainingDays: -2,
    statusMessage:
      "등록한 콘텐츠가 반려되었습니다. 반려 사유 확인 후 다시 등록해 주세요.",
    type: "방문형",
    isUrgent: false,
    subStatus: "content_rejected,re_register",
    hasContent: true,
    isPenalty: false,
  },
  // 실제 캠페인 데이터와 매칭: review_7
  {
    id: "review_7",
    title: "운동화 구매평 리뷰",
    category: "", // 구매평은 카테고리 없음 (고정 아이콘 사용)
    image: "/images/main/campaign_img/eximg_7.png",
    status: "취소/반려",
    remainingDays: -3,
    statusMessage: "콘텐츠 등록 기간이 지났습니다.",
    type: "구매평",
    isUrgent: false,
    subStatus: "penalty",
    hasContent: false,
    isPenalty: true,
  },
  // 실제 캠페인 데이터와 매칭: mission_5
  {
    id: "mission_5",
    title: "식품 미션형",
    category: "", // 미션형은 카테고리 없음 (고정 아이콘 사용)
    image: "/images/main/campaign_img/eximg_5.png",
    status: "취소/반려",
    remainingDays: -4,
    statusMessage:
      "콘텐츠 등록 기간이 지났습니다. 미션을 완료하신 뒤 콘텐츠를 등록해주세요",
    type: "미션형",
    isUrgent: false,
    subStatus: "penalty,content_rejected",
    hasContent: false,
    isPenalty: true,
  },
  // 실제 캠페인 데이터와 매칭: reporter_5
  {
    id: "reporter_5",
    title: "여행 기자단",
    category: "네이버블로그",
    image: "/images/main/campaign_img/eximg_5.png",
    status: "취소/반려",
    remainingDays: -6,
    statusMessage: "기자단 활동이 반려되었습니다.",
    type: "기자단",
    isUrgent: false,
    subStatus: "content_rejected,re_register",
    hasContent: true,
    isPenalty: false,
  },
];

// 탭별 캠페인 필터링 함수
export const getCampaignsByTab = (tab: string): CampaignApplication[] => {
  switch (tab) {
    case "신청":
      return campaignManagementData.filter(
        (campaign) => campaign.status === "신청"
      );
    case "선정":
      return campaignManagementData.filter(
        (campaign) => campaign.status === "선정"
      );
    case "완료":
      return campaignManagementData.filter(
        (campaign) => campaign.status === "완료"
      );
    case "취소/반려":
      return campaignManagementData.filter(
        (campaign) => campaign.status === "취소/반려"
      );
    case "패널티":
      return campaignManagementData.filter(
        (campaign) => campaign.isPenalty === true
      );
    default:
      return campaignManagementData;
  }
};

// 캠페인 통계 데이터
export const campaignManagementStats = {
  신청: campaignManagementData.filter((c) => c.status === "신청").length,
  선정: campaignManagementData.filter((c) => c.status === "선정").length,
  완료: campaignManagementData.filter((c) => c.status === "완료").length,
  "취소/반려": campaignManagementData.filter((c) => c.status === "취소/반려")
    .length,
  패널티: campaignManagementData.filter((c) => c.isPenalty === true).length,
};
