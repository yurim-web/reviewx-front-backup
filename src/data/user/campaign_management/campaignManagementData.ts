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
  {
    id: "1",
    title: "프리미엄 헤드폰 리뷰 캠페인",
    category: "쿠팡",
    categoryIcon: "/images/brand_logo/coupang.svg",
    image: "/images/main/campaign_img/eximg_1.png",
    status: "신청",
    remainingDays: 5,
    statusMessage: "캠페인 선정 발표까지 1일 남았습니다.",
    type: "배송형",
    isUrgent: false,
    subStatus: undefined,
    hasContent: false,
    isPenalty: false,
  },
  {
    id: "2",
    title: "유튜브 쇼츠 제작",
    category: "유튜브",
    categoryIcon: "/images/brand_logo/youtube.svg",
    image: "/images/main/campaign_img/eximg_9.png",
    status: "신청",
    remainingDays: 2,
    statusMessage: "캠페인 선정 발표까지 2일 남았습니다.",
    type: "미션형",
    isUrgent: true,
    subStatus: undefined,
    hasContent: false,
    isPenalty: false,
  },
  {
    id: "13",
    title: "맛집 탐방 기자단 모집",
    category: "네이버블로그",
    categoryIcon: "/images/brand_logo/naverblog.svg",
    image: "/images/main/campaign_img/eximg_3.png",
    status: "신청",
    remainingDays: 3,
    statusMessage: "캠페인 선정 발표까지 3일 남았습니다.",
    type: "기자단",
    isUrgent: false,
    subStatus: undefined,
    hasContent: false,
    isPenalty: false,
  },
  {
    id: "14",
    title: "화장품 구매평 작성 이벤트",
    category: "올리브영",
    categoryIcon: "/images/brand_logo/oliveyoung.svg",
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
  {
    id: "15",
    title: "카페 방문 후기 작성",
    category: "인스타그램",
    categoryIcon: "/images/brand_logo/insta.svg",
    image: "/images/main/campaign_img/eximg_5.png",
    status: "신청",
    remainingDays: 4,
    statusMessage: "캠페인 선정 발표까지 4일 남았습니다.",
    type: "방문형",
    isUrgent: false,
    subStatus: undefined,
    hasContent: false,
    isPenalty: false,
  },

  // 선정 상태 캠페인들 (id: 3-8) - 다양한 타입 추가
  {
    id: "3",
    title: "스킨케어 세트 미션형",
    category: "올리브영",
    categoryIcon: "/images/brand_logo/oliveyoung.svg",
    image: "/images/main/campaign_img/eximg_2.png",
    status: "선정",
    remainingDays: 12,
    statusMessage:
      "캠페인 마감까지 7일 남았습니다. 미션을 완료하고 콘텐츠를 등록해 주세요. ",
    type: "미션형",
    isUrgent: false,
    subStatus: "content_not_registered",
    hasContent: false,
    isPenalty: false,
  },
  {
    id: "4",
    title: "맛집 탐방 블로그 포스팅",
    category: "네이버블로그",
    categoryIcon: "/images/brand_logo/naverblog.svg",
    image: "/images/main/campaign_img/eximg_3.png",
    status: "선정",
    remainingDays: 8,
    statusMessage: "콘텐츠를 검수 중입니다.",
    type: "방문형",
    isUrgent: true,
    subStatus: "content_registered",
    hasContent: true,
    isPenalty: false,
  },
  {
    id: "5",
    title: "스포츠 용품 리뷰",
    category: "쿠팡",
    categoryIcon: "/images/brand_logo/coupang.svg",
    image: "/images/main/campaign_img/eximg_7.png",
    status: "선정",
    remainingDays: 15,
    statusMessage: "제품 구매 기간입니다.",
    type: "배송형",
    isUrgent: false,
    subStatus: "receipt_registered",
    hasContent: false,
    isPenalty: false,
  },
  {
    id: "6",
    title: "게이밍 의자 리뷰",
    category: "쿠팡",
    categoryIcon: "/images/brand_logo/coupang.svg",
    image: "/images/main/campaign_img/eximg_4.png",
    status: "선정",
    remainingDays: 10,
    statusMessage: "구매 영수증을 검수 중입니다.",
    type: "배송형",
    isUrgent: false,
    subStatus: "content_not_registered",
    hasContent: false,
    isPenalty: false,
  },
  {
    id: "16",
    title: "기자단 활동 - 신제품 체험",
    category: "네이버블로그",
    categoryIcon: "/images/brand_logo/naverblog.svg",
    image: "/images/main/campaign_img/eximg_6.png",
    status: "선정",
    remainingDays: 14,
    statusMessage: "기자단 활동을 시작해주세요.",
    type: "기자단",
    isUrgent: false,
    subStatus: "content_not_registered",
    hasContent: false,
    isPenalty: false,
  },
  {
    id: "17",
    title: "화장품 구매평 작성",
    category: "올리브영",
    categoryIcon: "/images/brand_logo/oliveyoung.svg",
    image: "/images/main/campaign_img/eximg_8.png",
    status: "선정",
    remainingDays: 6,
    statusMessage: "구매평 작성을 완료해주세요.",
    type: "구매평",
    isUrgent: true,
    subStatus: "content_not_registered",
    hasContent: false,
    isPenalty: false,
  },

  // 완료 상태 캠페인들 (id: 7-10) - 다양한 타입 추가
  {
    id: "7",
    title: "카카오프렌즈 굿즈 리뷰",
    category: "카카오프렌즈",
    categoryIcon: "/images/brand_logo/kakaopre.svg",
    image: "/images/main/campaign_img/eximg_10.png",
    status: "완료",
    remainingDays: -7,
    statusMessage: "캠페인이 완료되었습니다.",
    type: "배송형",
    isUrgent: false,
    subStatus: "content_registered",
    hasContent: true,
    isPenalty: false,
  },
  {
    id: "8",
    title: "홈카페 원두 추천",
    category: "네이버쇼핑",
    categoryIcon: "/images/brand_logo/navershop.svg",
    image: "/images/main/campaign_img/eximg_5.png",
    status: "완료",
    remainingDays: -3,
    statusMessage: "캠페인이 완료되었습니다.",
    type: "배송형",
    isUrgent: false,
    subStatus: "content_registered",
    hasContent: true,
    isPenalty: false,
  },
  {
    id: "18",
    title: "미션형 캠페인 - 브랜드 체험",
    category: "인스타그램",
    categoryIcon: "/images/brand_logo/insta.svg",
    image: "/images/main/campaign_img/eximg_1.png",
    status: "완료",
    remainingDays: -5,
    statusMessage: "캠페인이 완료되었습니다.",
    type: "미션형",
    isUrgent: false,
    subStatus: "content_registered",
    hasContent: true,
    isPenalty: false,
  },
  {
    id: "19",
    title: "기자단 활동 완료",
    category: "네이버블로그",
    categoryIcon: "/images/brand_logo/naverblog.svg",
    image: "/images/main/campaign_img/eximg_9.png",
    status: "완료",
    remainingDays: -2,
    statusMessage: "캠페인이 완료되었습니다.",
    type: "기자단",
    isUrgent: false,
    subStatus: "content_registered",
    hasContent: true,
    isPenalty: false,
  },

  // 취소/반려 상태 캠페인들 (id: 9-12) - 다양한 타입 추가
  {
    id: "9",
    title:
      "[정가 26,900원] 분아메티 강아지 모유 구강 유산균 영양제 프로바이오틱스템스",
    category: "쿠팡",
    categoryIcon: "/images/brand_logo/coupang.svg",
    image: "/images/main/campaign_img/eximg_6.png",
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
  {
    id: "10",
    title:
      "[구매량10자] (워크온비디오프) 베르노 세미 오버핏 카라 니트 [블랙] 25FW",
    category: "네이버블로그",
    categoryIcon: "/images/brand_logo/naverblog.svg",
    image: "/images/main/campaign_img/eximg_7.png",
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
  {
    id: "11",
    title:
      "[쿠팡 와우회원만, 별정구매평 09월 27일 구매 필수] 조조모모 브라이트닝 레디 톤업",
    category: "올리브영",
    categoryIcon: "/images/brand_logo/oliveyoung.svg",
    image: "/images/main/campaign_img/eximg_8.png",
    status: "취소/반려",
    remainingDays: -3,
    statusMessage: "콘텐츠 등록 기간이 지났습니다.",
    type: "구매평",
    isUrgent: false,
    subStatus: "penalty",
    hasContent: false,
    isPenalty: true,
  },
  {
    id: "12",
    title: "[이야온] 진동클렌지",
    category: "네이버블로그",
    categoryIcon: "/images/brand_logo/naverblog.svg",
    image: "/images/main/campaign_img/eximg_9.png",
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
  {
    id: "20",
    title: "기자단 활동 반려",
    category: "네이버블로그",
    categoryIcon: "/images/brand_logo/naverblog.svg",
    image: "/images/main/campaign_img/eximg_10.png",
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
