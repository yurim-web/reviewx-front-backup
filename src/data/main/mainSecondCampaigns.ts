/**
 * 캠페인 데이터 타입 정의
 */
interface CampaignData {
  id: string; // 캠페인 고유 식별자
  title: string; // 캠페인 제목
  category: string; // 캠페인 카테고리 (기자단, 구매평, 배송형, 방문형, 체험단 등)
  categoryIcon: string; // 카테고리 아이콘
  image: string; // 메인 제품 이미지 경로
  subcategory: string; // 세부 카테고리 (생활, 뷰티, 식품 등)
  points: number; // 지급 포인트 (숫자)
  description: string; // 제품 설명 및 제공 내역
  recruitment: {
    current: number; // 현재 지원자 수
    total: number; // 총 모집 인원
  };
  schedule: string; // 날짜/시간 형식 일정 (예: "1/25 (화) 10:00\n모집 오픈")
  dayCount: string; // 남은 일수 형식 (예: "D-6")
  detailedSchedule: {
    applicationStart: string; // 신청 시작일시
    applicationEnd: string; // 신청 마감일
    announcement: string; // 당첨 발표일
    purchasePeriod: string; // 구매 기간
  };
  campaign_detail_image: string; // 캠페인 상세 이미지 경로
}

/**
 * 캠페인 데이터 (두 번째 섹션)
 * 메인 페이지와 상세 페이지에서 모두 사용
 */
export const mockCampaigns_2: CampaignData[] = [
  {
    id: "9", // 캠페인 고유 ID (라우팅에 사용됨)
    title: "테디곰실버목걸이",
    category: "기자단",
    categoryIcon: "/images/brand_logo/naverblog.svg", // 카테고리 아이콘
    image: "/images/main/campaign_img/eximg_2.png",
    subcategory: "액세서리",
    points: 45000, // 지급 포인트 (숫자만)
    description: "테디곰실버목걸이",
    recruitment: {
      current: 1000, // 현재 신청자 수
      total: 4, // 총 모집 인원
    },
    schedule: "1/25 (화) 10:00\n모집 오픈", // 날짜/시간 형식 일정
    dayCount: "", // 이 캠페인은 schedule 사용
    detailedSchedule: {
      applicationStart: "2025-01-25", // 신청 시작일시
      applicationEnd: "2025-02-14", // 신청 마감일
      announcement: "2025-02-16", // 당첨 발표일
      purchasePeriod: "2025-02-16 ~ 2025-02-18", // 구매 기간
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png", // 캠페인 상세 이미지
  },
  {
    id: "10",
    title: "어린이집 생일축하스티커 생일답례스티커",
    category: "구매평",
    categoryIcon: "/images/brand_logo/todayhouse.svg", // 카테고리 아이콘
    image: "/images/main/campaign_img/eximg_10.png",
    subcategory: "생활",
    points: 18000, // 지급 포인트 (숫자만)
    description: "어린이집 생일축하스티커 생일답례스티커",
    recruitment: {
      current: 10,
      total: 50,
    },
    schedule: "1/25 (화) 10:00\n모집 오픈", // 날짜/시간 형식 일정
    dayCount: "", // 이 캠페인은 schedule 사용
    detailedSchedule: {
      applicationStart: "2025-01-25", // 신청 시작일시
      applicationEnd: "2025-02-14", // 신청 마감일
      announcement: "2025-02-16", // 당첨 발표일
      purchasePeriod: "2025-02-16 ~ 2025-02-18", // 구매 기간
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png", // 캠페인 상세 이미지
  },
  {
    id: "11",
    title: "세르프 (박신혜리프팅)",
    category: "배송형",
    categoryIcon: "/images/brand_logo/navershop.svg", // 카테고리 아이콘
    image: "/images/main/campaign_img/eximg_9.png",
    subcategory: "식품",
    points: 30000, // 지급 포인트 (숫자만)
    description: "설명 부분 입니다",
    recruitment: {
      current: 607,
      total: 2,
    },
    schedule: "", // 이 캠페인은 dayCount 사용
    dayCount: "마감", // 남은 일수 형식
    detailedSchedule: {
      applicationStart: "2025-01-18", // 신청 시작일시
      applicationEnd: "2025-02-08", // 신청 마감일
      announcement: "2025-02-10", // 당첨 발표일
      purchasePeriod: "2025-02-10 ~ 2025-02-13", // 구매 기간
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png", // 캠페인 상세 이미지
  },
  {
    id: "12",
    title: "닥터뮬 뮬차 붓기차",
    category: "배송형",
    categoryIcon: "/images/brand_logo/navershop.svg", // 카테고리 아이콘
    image: "/images/main/campaign_img/eximg_10.png",
    subcategory: "생활",
    points: 25000, // 지급 포인트 (숫자만)
    description: "설명 부분 입니다",
    recruitment: {
      current: 106,
      total: 10,
    },
    schedule: "", // 이 캠페인은 dayCount 사용
    dayCount: "긴급", // 남은 일수 형식
    detailedSchedule: {
      applicationStart: "2025-01-16", // 신청 시작일시
      applicationEnd: "2025-02-06", // 신청 마감일
      announcement: "2025-02-08", // 당첨 발표일
      purchasePeriod: "2025-02-08 ~ 2025-02-11", // 구매 기간
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png", // 캠페인 상세 이미지
  },
  {
    id: "13",
    title: "와우 프린트 유아 남아 반팔셔츠 여름 키즈 반팔셔츠",
    category: "기자단",
    categoryIcon: "/images/brand_logo/naverblog.svg", // 카테고리 아이콘
    image: "/images/main/campaign_img/eximg_11.png",
    subcategory: "반려동물",
    points: 40000, // 지급 포인트 (숫자만)
    description: "[마이펫닥터] 시그니처 눈&눈물 2.0 강아지 눈물 영양제",
    recruitment: {
      current: 1000,
      total: 4,
    },
    schedule: "1/25 (화) 10:00\n모집 오픈", // 이 캠페인은 dayCount 사용
    dayCount: "", // 남은 일수 형식
    detailedSchedule: {
      applicationStart: "2025-01-22", // 신청 시작일시
      applicationEnd: "2025-02-12", // 신청 마감일
      announcement: "2025-02-14", // 당첨 발표일
      purchasePeriod: "2025-02-14 ~ 2025-02-17", // 구매 기간
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png", // 캠페인 상세 이미지
  },
  {
    id: "14",
    title: "[냉동] 간장갈비찜 750g x 1봉",
    category: "구매평",
    categoryIcon: "/images/brand_logo/insta.svg", // 카테고리 아이콘
    image: "/images/main/campaign_img/eximg_12.png",
    subcategory: "뷰티",
    points: 35000, // 지급 포인트 (숫자만)
    description:
      "덱스판테놀 50,000ppm 민감성피부도 아기도 사용할수 있는 순한 보습 피부진정 로션",
    recruitment: {
      current: 106,
      total: 10,
    },
    schedule: "", // 이 캠페인은 dayCount 사용
    dayCount: "", // 남은 일수 형식
    detailedSchedule: {
      applicationStart: "2025-01-21", // 신청 시작일시
      applicationEnd: "2025-02-11", // 신청 마감일
      announcement: "2025-02-13", // 당첨 발표일
      purchasePeriod: "2025-02-13 ~ 2025-02-16", // 구매 기간
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png", // 캠페인 상세 이미지
  },
  {
    id: "15",
    title: "가죽 여권 케이스+네임택 실체험단 모집",
    category: "배송형",
    categoryIcon: "/images/brand_logo/insta.svg", // 카테고리 아이콘
    image: "/images/main/campaign_img/eximg_13.png",
    subcategory: "반려동물",
    points: 20000, // 지급 포인트 (숫자만)
    description: "[경기/김포] 고양이 미용 예쁘게 해드립니다!",
    recruitment: {
      current: 106,
      total: 10,
    },
    schedule: "", // 이 캠페인은 dayCount 사용
    dayCount: "", // 남은 일수 형식
    detailedSchedule: {
      applicationStart: "2025-01-19", // 신청 시작일시
      applicationEnd: "2025-02-09", // 신청 마감일
      announcement: "2025-02-11", // 당첨 발표일
      purchasePeriod: "2025-02-11 ~ 2025-02-14", // 구매 기간
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png", // 캠페인 상세 이미지
  },
  {
    id: "16",
    title: "독도사랑_광복 80주년 기념 독도 강치_한국이 키링_ 1차 체험단모집",
    category: "체험단",
    categoryIcon: "/images/brand_logo/insta.svg", // 카테고리 아이콘
    image: "/images/main/campaign_img/eximg_13.png",
    subcategory: "기타",
    points: 15000, // 지급 포인트 (숫자만)
    description: "설명 부분 입니다",
    recruitment: {
      current: 106,
      total: 10,
    },
    schedule: "", // 이 캠페인은 dayCount 사용
    dayCount: "", // 남은 일수 형식
    detailedSchedule: {
      applicationStart: "2025-01-24", // 신청 시작일시
      applicationEnd: "2025-02-15", // 신청 마감일
      announcement: "2025-02-17", // 당첨 발표일
      purchasePeriod: "2025-02-17 ~ 2025-02-20", // 구매 기간
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png", // 캠페인 상세 이미지
  },
];



