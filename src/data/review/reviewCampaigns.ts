/**
 * 구매평 캠페인 데이터 타입 정의
 */
interface ReviewCampaignData {
  id: string; // 캠페인 고유 식별자
  title: string; // 캠페인 제목
  category: string; // 캠페인 카테고리 (구매평)
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
    announcement: string; // 선정 발표일
    purchasePeriod: string; // 구매 기간
    registrationPeriod: string; // 등록 기간
  };
  campaign_detail_image: string; // 캠페인 상세 이미지 경로
  channel: string; // 채널 정보 (블로그, 인스타그램, 유튜브 등)
}

/**
 * 구매평 캠페인 데이터
 * 구매평 페이지에서 사용되는 전용 데이터
 */
export const reviewCampaigns: ReviewCampaignData[] = [
  {
    id: "review_1",
    title: "스마트폰 구매평 리뷰",
    category: "구매평",
    categoryIcon: "/images/brand_logo/navershop.svg",
    image: "/images/main/campaign_img/eximg_1.png",
    subcategory: "디지털",
    points: 45000,
    description: "최신 스마트폰 구매 후 상세 리뷰 작성",
    recruitment: {
      current: 234,
      total: 8,
    },
    schedule: "",
    dayCount: "D-5",
    detailedSchedule: {
      // 모집기간 시작일
      applicationStart: "2025-01-28",
      // 모집기간 마감일
      applicationEnd: "2025-02-12",
      // 선정 발표일
      announcement: "2025-02-14",
      // 구매 기간
      purchasePeriod: "2025-02-14 ~ 2025-02-17",
      // 등록 기간
      registrationPeriod: "2025-02-17 ~ 2025-02-24",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "네이버쇼핑",
  },
  {
    id: "review_2",
    title: "화장품 구매평 리뷰",
    category: "구매평",
    categoryIcon: "/images/brand_logo/oliveyoung.svg",
    image: "/images/main/campaign_img/eximg_2.png",
    subcategory: "뷰티",
    points: 32000,
    description: "프리미엄 화장품 구매 후 사용 리뷰",
    recruitment: {
      current: 156,
      total: 12,
    },
    schedule: "",
    dayCount: "D-3",
    detailedSchedule: {
      applicationStart: "2025-01-30",
      applicationEnd: "2025-02-14",
      announcement: "2025-02-16",
      purchasePeriod: "2025-02-16 ~ 2025-02-19",
      registrationPeriod: "2025-02-19 ~ 2025-02-26",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "올리브영",
  },
  {
    id: "review_3",
    title: "가전제품 구매평 리뷰",
    category: "구매평",
    categoryIcon: "/images/brand_logo/coupang.svg",
    image: "/images/main/campaign_img/eximg_3.png",
    subcategory: "생활",
    points: 38000,
    description: "주방 가전제품 구매 후 사용 리뷰",
    recruitment: {
      current: 89,
      total: 6,
    },
    schedule: "",
    dayCount: "긴급",
    detailedSchedule: {
      applicationStart: "2025-01-25",
      applicationEnd: "2025-02-10",
      announcement: "2025-02-12",
      purchasePeriod: "2025-02-12 ~ 2025-02-15",
      registrationPeriod: "2025-02-15 ~ 2025-02-22",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "쿠팡",
  },
  {
    id: "review_4",
    title: "의류 구매평 리뷰",
    category: "구매평",
    categoryIcon: "/images/brand_logo/insta.svg",
    image: "/images/main/campaign_img/eximg_4.png",
    subcategory: "패션",
    points: 28000,
    description: "패션 의류 구매 후 착용 리뷰",
    recruitment: {
      current: 178,
      total: 15,
    },
    schedule: "",
    dayCount: "D-7",
    detailedSchedule: {
      applicationStart: "2025-01-26",
      applicationEnd: "2025-02-11",
      announcement: "2025-02-13",
      purchasePeriod: "2025-02-13 ~ 2025-02-16",
      registrationPeriod: "2025-02-16 ~ 2025-02-23",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "인스타그램",
  },
  {
    id: "review_5",
    title: "식품 구매평 리뷰",
    category: "구매평",
    categoryIcon: "/images/brand_logo/naverblog.svg",
    image: "/images/main/campaign_img/eximg_5.png",
    subcategory: "식품",
    points: 22000,
    description: "프리미엄 식품 구매 후 맛 리뷰",
    recruitment: {
      current: 145,
      total: 18,
    },
    schedule: "",
    dayCount: "D-6",
    detailedSchedule: {
      applicationStart: "2025-01-27",
      applicationEnd: "2025-02-12",
      announcement: "2025-02-14",
      purchasePeriod: "2025-02-14 ~ 2025-02-17",
      registrationPeriod: "2025-02-17 ~ 2025-02-24",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "블로그",
  },
  {
    id: "review_6",
    title: "책 구매평 리뷰",
    category: "구매평",
    categoryIcon: "/images/brand_logo/navershop.svg",
    image: "/images/main/campaign_img/eximg_6.png",
    subcategory: "문화",
    points: 18000,
    description: "베스트셀러 도서 구매 후 독서 리뷰",
    recruitment: {
      current: 98,
      total: 20,
    },
    schedule: "",
    dayCount: "D-4",
    detailedSchedule: {
      applicationStart: "2025-01-29",
      applicationEnd: "2025-02-13",
      announcement: "2025-02-15",
      purchasePeriod: "2025-02-15 ~ 2025-02-18",
      registrationPeriod: "2025-02-18 ~ 2025-02-25",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "네이버쇼핑",
  },
  {
    id: "review_7",
    title: "운동화 구매평 리뷰",
    category: "구매평",
    categoryIcon: "/images/brand_logo/youtube.svg",
    image: "/images/main/campaign_img/eximg_7.png",
    subcategory: "패션",
    points: 35000,
    description: "프리미엄 운동화 구매 후 착용 리뷰 영상",
    recruitment: {
      current: 67,
      total: 5,
    },
    schedule: "",
    dayCount: "D-2",
    detailedSchedule: {
      applicationStart: "2025-01-31",
      applicationEnd: "2025-02-15",
      announcement: "2025-02-17",
      purchasePeriod: "2025-02-17 ~ 2025-02-20",
      registrationPeriod: "2025-02-20 ~ 2025-02-27",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "유튜브",
  },
  {
    id: "review_8",
    title: "반려동물 용품 구매평 리뷰",
    category: "구매평",
    categoryIcon: "/images/brand_logo/coupang.svg",
    image: "/images/main/campaign_img/eximg_8.png",
    subcategory: "반려동물",
    points: 26000,
    description: "반려동물 용품 구매 후 사용 리뷰",
    recruitment: {
      current: 123,
      total: 10,
    },
    schedule: "",
    dayCount: "D-8",
    detailedSchedule: {
      applicationStart: "2025-01-24",
      applicationEnd: "2025-02-09",
      announcement: "2025-02-11",
      purchasePeriod: "2025-02-11 ~ 2025-02-14",
      registrationPeriod: "2025-02-14 ~ 2025-02-21",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "쿠팡",
  },
  {
    id: "review_9",
    title: "자동차 용품 구매평 리뷰",
    category: "구매평",
    categoryIcon: "/images/brand_logo/navershop.svg",
    image: "/images/main/campaign_img/eximg_9.png",
    subcategory: "자동차",
    points: 42000,
    description: "자동차 액세서리 구매 후 설치 리뷰",
    recruitment: {
      current: 45,
      total: 4,
    },
    schedule: "",
    dayCount: "D-1",
    detailedSchedule: {
      applicationStart: "2025-02-01",
      applicationEnd: "2025-02-16",
      announcement: "2025-02-18",
      purchasePeriod: "2025-02-18 ~ 2025-02-21",
      registrationPeriod: "2025-02-21 ~ 2025-02-28",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "네이버쇼핑",
  },
  {
    id: "review_10",
    title: "홈데코 구매평 리뷰",
    category: "구매평",
    categoryIcon: "/images/brand_logo/naverblog.svg",
    image: "/images/main/campaign_img/eximg_10.png",
    subcategory: "생활",
    points: 30000,
    description: "홈데코 제품 구매 후 인테리어 리뷰",
    recruitment: {
      current: 167,
      total: 12,
    },
    schedule: "",
    dayCount: "D-9",
    detailedSchedule: {
      applicationStart: "2025-01-23",
      applicationEnd: "2025-02-08",
      announcement: "2025-02-10",
      purchasePeriod: "2025-02-10 ~ 2025-02-13",
      registrationPeriod: "2025-02-13 ~ 2025-02-20",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "블로그",
  },
  {
    id: "review_11",
    title: "건강기능식품 구매평 리뷰",
    category: "구매평",
    categoryIcon: "/images/brand_logo/oliveyoung.svg",
    image: "/images/main/campaign_img/eximg_11.png",
    subcategory: "건강",
    points: 33000,
    description: "건강기능식품 구매 후 복용 리뷰",
    recruitment: {
      current: 134,
      total: 9,
    },
    schedule: "",
    dayCount: "D-6",
    detailedSchedule: {
      applicationStart: "2025-01-27",
      applicationEnd: "2025-02-12",
      announcement: "2025-02-14",
      purchasePeriod: "2025-02-14 ~ 2025-02-17",
      registrationPeriod: "2025-02-17 ~ 2025-02-24",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "올리브영",
  },
  {
    id: "review_12",
    title: "게임 구매평 리뷰",
    category: "구매평",
    categoryIcon: "/images/brand_logo/youtube.svg",
    image: "/images/main/campaign_img/eximg_12.png",
    subcategory: "게임",
    points: 25000,
    description: "최신 게임 구매 후 플레이 리뷰 영상",
    recruitment: {
      current: 89,
      total: 7,
    },
    schedule: "",
    dayCount: "긴급",
    detailedSchedule: {
      applicationStart: "2025-01-25",
      applicationEnd: "2025-02-10",
      announcement: "2025-02-12",
      purchasePeriod: "2025-02-12 ~ 2025-02-15",
      registrationPeriod: "2025-02-15 ~ 2025-02-22",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "유튜브",
  },
  {
    id: "review_13",
    title: "여행용품 구매평 리뷰",
    category: "구매평",
    categoryIcon: "/images/brand_logo/insta.svg",
    image: "/images/main/campaign_img/eximg_13.png",
    subcategory: "여행",
    points: 29000,
    description: "여행용품 구매 후 사용 리뷰",
    recruitment: {
      current: 112,
      total: 8,
    },
    schedule: "",
    dayCount: "D-4",
    detailedSchedule: {
      applicationStart: "2025-01-29",
      applicationEnd: "2025-02-13",
      announcement: "2025-02-15",
      purchasePeriod: "2025-02-15 ~ 2025-02-18",
      registrationPeriod: "2025-02-18 ~ 2025-02-25",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "인스타그램",
  },
  {
    id: "review_14",
    title: "스포츠 용품 구매평 리뷰",
    category: "구매평",
    categoryIcon: "/images/brand_logo/navershop.svg",
    image: "/images/main/campaign_img/eximg_1.png",
    subcategory: "스포츠",
    points: 36000,
    description: "스포츠 용품 구매 후 운동 리뷰",
    recruitment: {
      current: 78,
      total: 6,
    },
    schedule: "",
    dayCount: "D-7",
    detailedSchedule: {
      applicationStart: "2025-01-26",
      applicationEnd: "2025-02-11",
      announcement: "2025-02-13",
      purchasePeriod: "2025-02-13 ~ 2025-02-16",
      registrationPeriod: "2025-02-16 ~ 2025-02-23",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "네이버쇼핑",
  },
  {
    id: "review_15",
    title: "악세서리 구매평 리뷰",
    category: "구매평",
    categoryIcon: "/images/brand_logo/naverblog.svg",
    image: "/images/main/campaign_img/eximg_2.png",
    subcategory: "액세서리",
    points: 24000,
    description: "프리미엄 액세서리 구매 후 스타일링 리뷰",
    recruitment: {
      current: 156,
      total: 14,
    },
    schedule: "",
    dayCount: "D-5",
    detailedSchedule: {
      applicationStart: "2025-01-28",
      applicationEnd: "2025-02-12",
      announcement: "2025-02-14",
      purchasePeriod: "2025-02-14 ~ 2025-02-17",
      registrationPeriod: "2025-02-17 ~ 2025-02-24",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "블로그",
  },
  {
    id: "review_16",
    title: "음향기기 구매평 리뷰",
    category: "구매평",
    categoryIcon: "/images/brand_logo/youtube.svg",
    image: "/images/main/campaign_img/eximg_3.png",
    subcategory: "디지털",
    points: 48000,
    description: "프리미엄 음향기기 구매 후 음질 리뷰 영상",
    recruitment: {
      current: 34,
      total: 3,
    },
    schedule: "",
    dayCount: "D-3",
    detailedSchedule: {
      applicationStart: "2025-01-30",
      applicationEnd: "2025-02-14",
      announcement: "2025-02-16",
      purchasePeriod: "2025-02-16 ~ 2025-02-19",
      registrationPeriod: "2025-02-19 ~ 2025-02-26",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "유튜브",
  },
];
