/* ========================================
   📊 파트너 캠페인 임시 데이터
   ======================================== */

/**
 * 파트너 캠페인 임시 데이터
 *
 * 목적: 파트너 캠페인 관리 페이지에서 사용할 테스트 데이터
 *
 * 사용 위치:
 * - /partner 페이지의 캠페인 목록 표시
 *
 * 주요 기능:
 * - 다양한 상태의 캠페인 데이터 제공
 * - 각 캠페인마다 다른 statusMessage 제공
 * - 실제 날짜 기반 remainingDays 계산
 */

import type { PartnerCampaign } from "@/types/partner";

// 임시 파트너 캠페인 데이터
export const partnerCampaigns: PartnerCampaign[] = [
  {
    id: "1",
    title: "신제품 스마트워치 리뷰 캠페인",
    type: "배송형",
    status: "신청",
    deadline: "2024-01-15",
    remainingDays: 3,
    statusMessage:
      "이 캠페인은 특별한 조건이 있습니다. 자세한 내용을 확인해주세요.",
    applicants: 45,
    recruits: 10,
    submissions: 0,
    selected: 0,
  },
  {
    id: "2",
    title: "화장품 브랜드 미션형 모집",
    type: "방문형",
    status: "선정",
    deadline: "2024-01-20",
    remainingDays: 8,
    statusMessage: "축하합니다! 선정되셨습니다. 콘텐츠 제작을 시작해주세요.",
    applicants: 120,
    recruits: 15,
    submissions: 5,
    selected: 15,
  },
  {
    id: "3",
    title: "홈카페 원두 추천 리뷰",
    type: "배송형",
    status: "완료",
    deadline: "2024-01-10",
    remainingDays: -2,
    statusMessage: "캠페인이 성공적으로 완료되었습니다. 수고하셨습니다!",
    applicants: 80,
    recruits: 20,
    submissions: 20,
    selected: 20,
  },
  {
    id: "4",
    title: "패션 브랜드 신상품 체험",
    type: "방문형",
    status: "취소/반려",
    deadline: "2024-01-12",
    remainingDays: 0,
    statusMessage:
      "안타깝게도 캠페인이 취소되었습니다. 다음 기회에 참여해주세요.",
    applicants: 60,
    recruits: 12,
    submissions: 0,
    selected: 0,
  },
  {
    id: "5",
    title: "게이밍 기어 리뷰 이벤트",
    type: "배송형",
    status: "신청",
    deadline: "2024-01-18",
    remainingDays: 6,
    statusMessage:
      "게이머분들을 위한 특별한 캠페인입니다. 많은 관심 부탁드립니다!",
    applicants: 95,
    recruits: 25,
    submissions: 0,
    selected: 0,
  },
  {
    id: "6",
    title: "맛집 탐방 블로그 포스팅",
    type: "방문형",
    status: "선정",
    deadline: "2024-01-25",
    remainingDays: 13,
    statusMessage:
      "맛집 전문가로 선정되셨습니다. 정성스러운 리뷰 부탁드립니다.",
    applicants: 150,
    recruits: 8,
    submissions: 2,
    selected: 8,
  },
  {
    id: "7",
    title: "스포츠 용품 미션형",
    type: "배송형",
    status: "신청",
    deadline: "2024-01-14",
    remainingDays: 2,
    statusMessage: "마감이 임박했습니다! 서둘러 신청해주세요.",
    applicants: 75,
    recruits: 15,
    submissions: 0,
    selected: 0,
  },
  {
    id: "8",
    title: "인테리어 소품 리뷰",
    type: "방문형",
    status: "완료",
    deadline: "2024-01-08",
    remainingDays: -4,
    statusMessage:
      "모든 참가자분들께 감사드립니다. 다음에도 좋은 캠페인으로 찾아뵙겠습니다.",
    applicants: 40,
    recruits: 10,
    submissions: 10,
    selected: 10,
  },
];

// 탭별 캠페인 필터링 함수
export const getCampaignsByTab = (tab: string): PartnerCampaign[] => {
  switch (tab) {
    case "전체":
      return partnerCampaigns;
    case "예정":
      return partnerCampaigns.filter((campaign) => campaign.status === "신청");
    case "신청":
      return partnerCampaigns.filter((campaign) => campaign.status === "신청");
    case "진행":
      return partnerCampaigns.filter((campaign) => campaign.status === "선정");
    case "종료":
      return partnerCampaigns.filter((campaign) => campaign.status === "완료");
    case "취소":
      return partnerCampaigns.filter(
        (campaign) => campaign.status === "취소/반려"
      );
    default:
      return partnerCampaigns;
  }
};

// 캠페인 통계 데이터
export const partnerCampaignStats = {
  전체: partnerCampaigns.length,
  예정: partnerCampaigns.filter((c) => c.status === "신청").length,
  신청: partnerCampaigns.filter((c) => c.status === "신청").length,
  진행: partnerCampaigns.filter((c) => c.status === "선정").length,
  종료: partnerCampaigns.filter((c) => c.status === "완료").length,
  취소: partnerCampaigns.filter((c) => c.status === "취소/반려").length,
};
