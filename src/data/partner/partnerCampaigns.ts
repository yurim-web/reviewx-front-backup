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

/* ========================================
   🔧 백엔드 개발자용 데이터 구조 설명
   ======================================== */

/**
 * PartnerCampaign 데이터 구조 설명
 *
 * 각 필드별 상세 설명:
 *
 * 1. id: string
 *    - 캠페인의 고유 식별자
 *    - 예시: "1", "2", "3" ...
 *
 * 2. title: string
 *    - 캠페인 제목
 *    - 예시: "나만의 향수만들기 체험 [그리디센트]"
 *
 * 3. type: "배송형" | "방문형" | "구매평" | "기자단" | "미션형"
 *    - 캠페인 유형 (5가지)
 *    - 배송형: 상품을 배송받아 리뷰 작성
 *    - 방문형: 매장 방문 후 리뷰 작성
 *    - 구매평: 구매 후 평점 및 리뷰 작성
 *    - 기자단: 기자단 활동으로 콘텐츠 제작
 *    - 미션형: 특정 미션 수행 후 콘텐츠 제작
 *
 * 4. status: "예정" | "신청" | "진행" | "종료" | "취소"
 *    - 캠페인의 주요 상태
 *    - 예정: 아직 시작되지 않은 캠페인
 *    - 신청: 사용자들이 신청하는 단계
 *    - 진행: 당첨자 선정 및 콘텐츠 검수 단계
 *    - 종료: 캠페인이 완료된 단계
 *    - 취소: 캠페인이 취소된 단계
 *
 * 5. deadline: string
 *    - 캠페인 마감일 (YYYY-MM-DD 형식)
 *    - 예시: "2024-01-15"
 *
 * 6. remainingDays: number
 *    - 현재 날짜 기준 남은 일수
 *    - 양수: 아직 남은 일수
 *    - 음수: 이미 지난 일수
 *
 * 7. statusMessage: string
 *    - 사용자에게 보여줄 상태별 안내 메시지
 *    - 예시: "캠페인 오픈까지 2일 남았습니다."
 *
 * 8. applicants: number
 *    - 현재까지 신청한 사용자 수
 *
 * 9. recruits: number
 *    - 모집하려는 총 인원 수
 *
 * 10. submissions?: number
 *     - 제출된 콘텐츠 수 (진행/종료 단계에서 사용)
 *     - optional 필드
 *
 * 11. selected?: number
 *     - 선정된 인원 수 (진행/종료 단계에서 사용)
 *     - optional 필드
 *
 * 12. brand?: string
 *     - 브랜드명 (쿠팡, 네이버쇼핑, 11번가 등)
 *     - optional 필드
 *
 * 13. brandLogo?: string
 *     - 브랜드 로고 이미지 경로
 *     - 예시: "/images/brand_logo/coupang.svg"
 *     - optional 필드
 *
 * 14. subStatus?: string
 *     - 서브 상태 (버튼 종류와 텍스트를 결정)
 *     - 가능한 값들:
 *       * "campaign_edit": "캠페인 수정하기" 버튼
 *       * "applicant_management": "신청내역 확인하기" 버튼
 *       * "winner_selection": "당첨자 선정하기" 버튼
 *       * "content_review,content_approval": "콘텐츠 검수하기" + "콘텐츠 확인하기" 버튼 (2개)
 *       * "penalty": "패널티 내역보기" 버튼
 *     - optional 필드
 *
 * 탭별 필터링:
 * - 전체: 모든 캠페인
 * - 예정: status === "예정"
 * - 신청: status === "신청"
 * - 진행: status === "진행"
 * - 종료: status === "종료"
 * - 취소: status === "취소"
 */

import type { PartnerCampaign } from "@/types/partner";

// 임시 파트너 캠페인 데이터
export const partnerCampaigns: PartnerCampaign[] = [
  {
    id: "1",
    title: "나만의 향수만들기 체험 [그리디센트]",
    type: "배송형",
    status: "예정",
    deadline: "2024-01-15",
    remainingDays: 2,
    statusMessage: "캠페인 오픈까지 2일 남았습니다.",
    applicants: 0,
    recruits: 12,
    submissions: 0,
    selected: 0,
    brand: "쿠팡",
    brandLogo: "/images/brand_logo/coupang.svg",
    subStatus: "campaign_edit", // 캠페인 수정 단계
  },
  {
    id: "2",
    title: "MATIN CANVAS MINI TOTE BAG",
    type: "방문형",
    status: "예정",
    deadline: "2024-01-17",
    remainingDays: 2,
    statusMessage: "캠페인 오픈까지 2일 남았습니다.",
    applicants: 0,
    recruits: 12,
    submissions: 0,
    selected: 0,
    brand: "쿠팡",
    brandLogo: "/images/brand_logo/coupang.svg",
    subStatus: "campaign_edit", // 캠페인 수정 단계
  },
  {
    id: "3",
    title: "화장품 브랜드 미션형 모집",
    type: "미션형",
    status: "진행",
    deadline: "2024-01-20",
    remainingDays: 8,
    statusMessage: "캠페인 당첨자를 선정해 주세요.",
    applicants: 120,
    recruits: 15,
    submissions: 0,
    selected: 0,
    brand: "네이버쇼핑",
    brandLogo: "/images/brand_logo/navershop.svg",
    subStatus: "winner_selection", // 당첨자 선정 단계
  },
  {
    id: "4",
    title: "바디 노화, 탄력 집중 케어! 듀어썸 콜라겐 앰플 바디 크림 200ml",
    type: "방문형",
    status: "종료",
    deadline: "2024-01-10",
    remainingDays: -2,
    statusMessage: "캠페인이 마감되었습니다.",
    applicants: 80,
    recruits: 20,
    submissions: 10,
    selected: 10,
    brand: "쿠팡",
    brandLogo: "/images/brand_logo/coupang.svg",
    subStatus: "content_review,content_approval", // 콘텐츠 검수 및 승인 단계 (2개 버튼)
  },
  {
    id: "5",
    title: "[서울/마포구] ImagineLand@Seoul 꿈의 정원 : 콘서트와 영화",
    type: "방문형",
    status: "종료",
    deadline: "2024-01-12",
    remainingDays: -1,
    statusMessage: "캠페인이 마감되었습니다.",
    applicants: 60,
    recruits: 12,
    submissions: 5,
    selected: 6,
    brand: "쿠팡",
    brandLogo: "/images/brand_logo/coupang.svg",
    subStatus: "content_review,content_approval", // 콘텐츠 검수 및 승인 단계 (2개 버튼)
  },
  {
    id: "6",
    title: "업사이클링 브랜드 'SALIDA' 미니백 (Tiny)",
    type: "배송형",
    status: "신청",
    deadline: "2024-01-18",
    remainingDays: 1,
    statusMessage: "캠페인 선정 발표까지 1일 남았습니다.",
    applicants: 0,
    recruits: 12,
    submissions: 0,
    selected: 0,
    brand: "쿠팡",
    brandLogo: "/images/brand_logo/coupang.svg",
    subStatus: "campaign_edit,applicant_management", // 캠페인 수정 + 신청 관리 단계 (2개 버튼)
  },
  {
    id: "7",
    title: "[닥터길라] 히알루론산 딥 세라마이드 콜라겐 마스크팩 10매",
    type: "방문형",
    status: "신청",
    deadline: "2024-01-19",
    remainingDays: 1,
    statusMessage: "캠페인 선정 발표까지 1일 남았습니다.",
    applicants: 8,
    recruits: 12,
    submissions: 0,
    selected: 0,
    brand: "쿠팡",
    brandLogo: "/images/brand_logo/coupang.svg",
    subStatus: "campaign_edit,applicant_management", // 캠페인 수정 + 신청 관리 단계 (2개 버튼)
  },
  {
    id: "8",
    title: "[26,000장 돌파]파치먼트 긴팔 상하세트 파자마 잠옷",
    type: "방문형",
    status: "신청",
    deadline: "2024-01-20",
    remainingDays: 1,
    statusMessage: "캠페인 선정 발표까지 1일 남았습니다.",
    applicants: 51,
    recruits: 2,
    submissions: 0,
    selected: 0,
    brand: "쿠팡",
    brandLogo: "/images/brand_logo/coupang.svg",
    subStatus: "campaign_edit,applicant_management", // 캠페인 수정 + 신청 관리 단계 (2개 버튼)
  },
  {
    id: "9",
    title: "[전국모집] 2박3일 영양수비별빛캠핑장 & 로컬투어",
    type: "방문형",
    status: "신청",
    deadline: "2024-01-22",
    remainingDays: 1,
    statusMessage: "캠페인 선정 발표까지 1일 남았습니다.",
    applicants: 189,
    recruits: 50,
    submissions: 0,
    selected: 0,
    brand: "쿠팡",
    brandLogo: "/images/brand_logo/coupang.svg",
    subStatus: "campaign_edit,applicant_management", // 캠페인 수정 + 신청 관리 단계 (2개 버튼)
  },
  {
    id: "10",
    title:
      "[서울/종로구] 홍콩공연예술대학교 무용학과 X 성균관대학교 무용학과 국제교류 프로그램",
    type: "방문형",
    status: "종료",
    deadline: "2024-01-14",
    remainingDays: -3,
    statusMessage: "캠페인이 마감되었습니다.",
    applicants: 40,
    recruits: 10,
    submissions: 8,
    selected: 8,
    brand: "쿠팡",
    brandLogo: "/images/brand_logo/coupang.svg",
    subStatus: "content_review,content_approval", // 콘텐츠 검수 및 승인 단계 (2개 버튼)
  },
  {
    id: "11",
    title: "[여가/기자단]여성전용 바디코치 PT필라테스 화성봉담점",
    type: "방문형",
    status: "종료",
    deadline: "2024-01-16",
    remainingDays: -5,
    statusMessage: "콘텐츠 검수 요청이 1건 있습니다. 캠페인이 마감되었습니다.",
    applicants: 35,
    recruits: 8,
    submissions: 7,
    selected: 8,
    brand: "쿠팡",
    brandLogo: "/images/brand_logo/coupang.svg",
    subStatus: "content_review,content_approval", // 콘텐츠 검수 및 승인 단계 (2개 버튼)
  },
  {
    id: "12",
    title:
      "[쿠팡와우회원만] [글래드] 플렉스앤씰 늘어나는 지퍼백 냉동대형 대용량팩, 200매",
    type: "방문형",
    status: "종료",
    deadline: "2024-01-18",
    remainingDays: -7,
    statusMessage: "캠페인이 마감되었습니다.",
    applicants: 25,
    recruits: 5,
    submissions: 2,
    selected: 2,
    brand: "쿠팡",
    brandLogo: "/images/brand_logo/coupang.svg",
    subStatus: "content_review,content_approval", // 콘텐츠 검수 및 승인 단계 (2개 버튼)
  },
  {
    id: "13",
    title: "이더스 쫀득 꿀고구마바 쿠팡 와우 체험단 모집합니다",
    type: "방문형",
    status: "종료",
    deadline: "2024-01-20",
    remainingDays: -9,
    statusMessage: "캠페인이 마감되었습니다.",
    applicants: 45,
    recruits: 12,
    submissions: 9,
    selected: 10,
    brand: "쿠팡",
    brandLogo: "/images/brand_logo/coupang.svg",
    subStatus: "content_review,content_approval", // 콘텐츠 검수 및 승인 단계 (2개 버튼)
  },
  {
    id: "14",
    title: "바디 노화, 탄력 집중 케어! 듀어썸 콜라겐 앰플 바디 크림 200ml",
    type: "방문형",
    status: "취소",
    deadline: "2024-01-15",
    remainingDays: -4,
    statusMessage: "캠페인을 취소하였습니다.",
    applicants: 52,
    recruits: 12,
    submissions: 0,
    selected: 0,
    brand: "쿠팡",
    brandLogo: "/images/brand_logo/coupang.svg",
    subStatus: "penalty", // 패널티 상태
  },
  {
    id: "15",
    title: "바디 노화, 탄력 집중 케어! 듀어썸 콜라겐 앰플 바디 크림 200ml",
    type: "방문형",
    status: "취소",
    deadline: "2024-01-17",
    remainingDays: -6,
    statusMessage: "캠페인을 삭제하였습니다.",
    applicants: 52,
    recruits: 12,
    submissions: 0,
    selected: 0,
    brand: "쿠팡",
    brandLogo: "/images/brand_logo/coupang.svg",
    subStatus: "penalty", // 패널티 상태
  },
];

// 탭별 캠페인 필터링 함수
export const getCampaignsByTab = (tab: string): PartnerCampaign[] => {
  switch (tab) {
    case "전체":
      return partnerCampaigns;
    case "예정":
      return partnerCampaigns.filter((campaign) => campaign.status === "예정");
    case "신청":
      return partnerCampaigns.filter((campaign) => campaign.status === "신청");
    case "진행":
      return partnerCampaigns.filter((campaign) => campaign.status === "진행");
    case "종료":
      return partnerCampaigns.filter((campaign) => campaign.status === "종료");
    case "취소":
      return partnerCampaigns.filter((campaign) => campaign.status === "취소");
    default:
      return partnerCampaigns;
  }
};

// 캠페인 통계 데이터
export const partnerCampaignStats = {
  전체: partnerCampaigns.length,
  예정: partnerCampaigns.filter((c) => c.status === "예정").length,
  신청: partnerCampaigns.filter((c) => c.status === "신청").length,
  진행: partnerCampaigns.filter((c) => c.status === "진행").length,
  종료: partnerCampaigns.filter((c) => c.status === "종료").length,
  취소: partnerCampaigns.filter((c) => c.status === "취소").length,
  패널티: 0, // 임시로 0으로 설정 (실제로는 패널티 데이터가 있을 때 증가)
};
