/**
 * 배송형 캠페인 데이터 타입 정의
 */
interface DeliveryCampaignData {
  id: string; // 캠페인 고유 식별자
  title: string; // 캠페인 제목
  category: string; // 캠페인 카테고리 (배송형)
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
 * 배송형 캠페인 데이터
 * 배송형 페이지에서 사용되는 전용 데이터
 */
export const deliveryCampaigns: DeliveryCampaignData[] = [
  {
    id: "delivery_1",
    title: "세르프 (박신혜리프팅)",
    category: "배송형",
    categoryIcon: "/images/brand_logo/navershop.svg",
    image: "/images/main/campaign_img/eximg_9.png",
    subcategory: "뷰티",
    points: 30000,
    description: "박신혜 리프팅 세르프 제품 체험단 모집",
    recruitment: {
      current: 607,
      total: 2,
    },
    schedule: "",
    dayCount: "마감",
    detailedSchedule: {
      // 모집기간 시작일일
      applicationStart: "2025-01-18",
      // 모집기간 마감일
      applicationEnd: "2025-02-08",
      // 선정 발표일
      announcement: "2025-02-10",
      // 구매 기간
      purchasePeriod: "2025-02-10 ~ 2025-02-13",
      // 등록 기간
      registrationPeriod: "2025-02-13 ~ 2025-02-20",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "네이버쇼핑",
  },
  {
    id: "delivery_2",
    title: "닥터뮬 뮬차 붓기차",
    category: "배송형",
    categoryIcon: "/images/brand_logo/navershop.svg",
    image: "/images/main/campaign_img/eximg_10.png",
    subcategory: "생활",
    points: 25000,
    description: "붓기 완화에 도움되는 뮬차 체험단 모집",
    recruitment: {
      current: 106,
      total: 10,
    },
    schedule: "",
    dayCount: "긴급",
    detailedSchedule: {
      applicationStart: "2025-01-16",
      applicationEnd: "2025-02-06",
      announcement: "2025-02-08",
      purchasePeriod: "2025-02-08 ~ 2025-02-11",
      registrationPeriod: "2025-02-11 ~ 2025-02-18",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "네이버쇼핑",
  },
  {
    id: "delivery_3",
    title: "가죽 여권 케이스+네임택 실체험단 모집",
    category: "배송형",
    categoryIcon: "/images/brand_logo/insta.svg",
    image: "/images/main/campaign_img/eximg_13.png",
    subcategory: "액세서리",
    points: 20000,
    description: "고급스러운 가죽 여권 케이스와 네임택 체험단",
    recruitment: {
      current: 89,
      total: 15,
    },
    schedule: "",
    dayCount: "D-3",
    detailedSchedule: {
      applicationStart: "2025-01-19",
      applicationEnd: "2025-02-09",
      announcement: "2025-02-11",
      purchasePeriod: "2025-02-11 ~ 2025-02-14",
      registrationPeriod: "2025-02-14 ~ 2025-02-21",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "인스타그램",
  },
  {
    id: "delivery_4",
    title: "프리미엄 비타민C 세럼",
    category: "배송형",
    categoryIcon: "/images/brand_logo/naverblog.svg",
    image: "/images/main/campaign_img/eximg_2.png",
    subcategory: "뷰티",
    points: 35000,
    description: "고농도 비타민C로 피부 탄력 개선 체험단",
    recruitment: {
      current: 234,
      total: 8,
    },
    schedule: "1/25 (화) 10:00\n모집 오픈",
    dayCount: "",
    detailedSchedule: {
      applicationStart: "2025-01-25",
      applicationEnd: "2025-02-15",
      announcement: "2025-02-17",
      purchasePeriod: "2025-02-17 ~ 2025-02-20",
      registrationPeriod: "2025-02-20 ~ 2025-02-27",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "블로그",
  },
  {
    id: "delivery_5",
    title: "유기농 아기용 세제",
    category: "배송형",
    categoryIcon: "/images/brand_logo/oliveyoung.svg",
    image: "/images/main/campaign_img/eximg_4.png",
    subcategory: "생활",
    points: 18000,
    description: "아기 피부에 안전한 유기농 세제 체험단",
    recruitment: {
      current: 156,
      total: 20,
    },
    schedule: "",
    dayCount: "D-7",
    detailedSchedule: {
      applicationStart: "2025-01-20",
      applicationEnd: "2025-02-10",
      announcement: "2025-02-12",
      purchasePeriod: "2025-02-12 ~ 2025-02-15",
      registrationPeriod: "2025-02-15 ~ 2025-02-22",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "올리브영",
  },
  {
    id: "delivery_6",
    title: "프리미엄 강아지 사료",
    category: "배송형",
    categoryIcon: "/images/brand_logo/coupang.svg",
    image: "/images/main/campaign_img/eximg_5.png",
    subcategory: "반려동물",
    points: 28000,
    description: "영양 균형이 완벽한 프리미엄 강아지 사료 체험단",
    recruitment: {
      current: 78,
      total: 12,
    },
    schedule: "",
    dayCount: "D-5",
    detailedSchedule: {
      applicationStart: "2025-01-22",
      applicationEnd: "2025-02-12",
      announcement: "2025-02-14",
      purchasePeriod: "2025-02-14 ~ 2025-02-17",
      registrationPeriod: "2025-02-17 ~ 2025-02-24",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "쿠팡",
  },
  {
    id: "delivery_7",
    title: "유튜브 크리에이터 키트",
    category: "배송형",
    categoryIcon: "/images/brand_logo/youtube.svg",
    image: "/images/main/campaign_img/eximg_6.png",
    subcategory: "기타",
    points: 40000,
    description: "유튜브 영상 제작에 필요한 크리에이터 키트 체험단",
    recruitment: {
      current: 345,
      total: 5,
    },
    schedule: "",
    dayCount: "D-2",
    detailedSchedule: {
      applicationStart: "2025-01-23",
      applicationEnd: "2025-02-13",
      announcement: "2025-02-15",
      purchasePeriod: "2025-02-15 ~ 2025-02-18",
      registrationPeriod: "2025-02-18 ~ 2025-02-25",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "유튜브",
  },
  {
    id: "delivery_8",
    title: "프리미엄 홈트레이닝 용품 세트",
    category: "배송형",
    categoryIcon: "/images/brand_logo/naverblog.svg",
    image: "/images/main/campaign_img/eximg_7.png",
    subcategory: "생활",
    points: 32000,
    description: "집에서 하는 홈트레이닝에 필요한 용품 세트 체험단",
    recruitment: {
      current: 198,
      total: 10,
    },
    schedule: "",
    dayCount: "D-4",
    detailedSchedule: {
      applicationStart: "2025-01-21",
      applicationEnd: "2025-02-11",
      announcement: "2025-02-13",
      purchasePeriod: "2025-02-13 ~ 2025-02-16",
      registrationPeriod: "2025-02-16 ~ 2025-02-23",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "블로그",
  },
  {
    id: "delivery_9",
    title: "프리미엄 스킨케어 세트",
    category: "배송형",
    categoryIcon: "/images/brand_logo/oliveyoung.svg",
    image: "/images/main/campaign_img/eximg_1.png",
    subcategory: "뷰티",
    points: 45000,
    description: "모든 피부 타입에 맞는 프리미엄 스킨케어 세트 체험단",
    recruitment: {
      current: 289,
      total: 8,
    },
    schedule: "",
    dayCount: "D-1",
    detailedSchedule: {
      applicationStart: "2025-01-24",
      applicationEnd: "2025-02-14",
      announcement: "2025-02-16",
      purchasePeriod: "2025-02-16 ~ 2025-02-19",
      registrationPeriod: "2025-02-19 ~ 2025-02-26",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "올리브영",
  },
  {
    id: "delivery_10",
    title: "유기농 과일 주스 세트",
    category: "배송형",
    categoryIcon: "/images/brand_logo/coupang.svg",
    image: "/images/main/campaign_img/eximg_3.png",
    subcategory: "식품",
    points: 22000,
    description: "신선한 과일로 만든 유기농 주스 세트 체험단",
    recruitment: {
      current: 134,
      total: 25,
    },
    schedule: "",
    dayCount: "D-8",
    detailedSchedule: {
      applicationStart: "2025-01-17",
      applicationEnd: "2025-02-07",
      announcement: "2025-02-09",
      purchasePeriod: "2025-02-09 ~ 2025-02-12",
      registrationPeriod: "2025-02-12 ~ 2025-02-19",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "쿠팡",
  },
  {
    id: "delivery_11",
    title: "스마트 워치 프로",
    category: "배송형",
    categoryIcon: "/images/brand_logo/navershop.svg",
    image: "/images/main/campaign_img/eximg_8.png",
    subcategory: "디지털",
    points: 55000,
    description: "건강 관리와 스타일을 동시에 잡는 스마트 워치 체험단",
    recruitment: {
      current: 456,
      total: 6,
    },
    schedule: "",
    dayCount: "긴급",
    detailedSchedule: {
      applicationStart: "2025-01-15",
      applicationEnd: "2025-02-05",
      announcement: "2025-02-07",
      purchasePeriod: "2025-02-07 ~ 2025-02-10",
      registrationPeriod: "2025-02-10 ~ 2025-02-17",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "네이버쇼핑",
  },
  {
    id: "delivery_12",
    title: "프리미엄 향수 컬렉션",
    category: "배송형",
    categoryIcon: "/images/brand_logo/insta.svg",
    image: "/images/main/campaign_img/eximg_11.png",
    subcategory: "뷰티",
    points: 38000,
    description: "세계적인 브랜드의 프리미엄 향수 컬렉션 체험단",
    recruitment: {
      current: 167,
      total: 12,
    },
    schedule: "",
    dayCount: "D-6",
    detailedSchedule: {
      applicationStart: "2025-01-18",
      applicationEnd: "2025-02-08",
      announcement: "2025-02-10",
      purchasePeriod: "2025-02-10 ~ 2025-02-13",
      registrationPeriod: "2025-02-13 ~ 2025-02-20",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "인스타그램",
  },
  {
    id: "delivery_13",
    title: "홈카페 원두 세트",
    category: "배송형",
    categoryIcon: "/images/brand_logo/naverblog.svg",
    image: "/images/main/campaign_img/eximg_12.png",
    subcategory: "식품",
    points: 26000,
    description: "집에서 즐기는 프리미엄 원두 커피 세트 체험단",
    recruitment: {
      current: 203,
      total: 18,
    },
    schedule: "",
    dayCount: "D-9",
    detailedSchedule: {
      applicationStart: "2025-01-16",
      applicationEnd: "2025-02-06",
      announcement: "2025-02-08",
      purchasePeriod: "2025-02-08 ~ 2025-02-11",
      registrationPeriod: "2025-02-11 ~ 2025-02-18",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "블로그",
  },
  {
    id: "delivery_14",
    title: "프리미엄 베개 세트",
    category: "배송형",
    categoryIcon: "/images/brand_logo/youtube.svg",
    image: "/images/main/campaign_img/eximg_4.png",
    subcategory: "생활",
    points: 42000,
    description: "수면의 질을 높여주는 프리미엄 베개 세트 체험단",
    recruitment: {
      current: 312,
      total: 7,
    },
    schedule: "",
    dayCount: "D-3",
    detailedSchedule: {
      applicationStart: "2025-01-22",
      applicationEnd: "2025-02-12",
      announcement: "2025-02-14",
      purchasePeriod: "2025-02-14 ~ 2025-02-17",
      registrationPeriod: "2025-02-17 ~ 2025-02-24",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "유튜브",
  },
  {
    id: "delivery_15",
    title: "고양이 사료 전문 브랜드",
    category: "배송형",
    categoryIcon: "/images/brand_logo/coupang.svg",
    image: "/images/main/campaign_img/eximg_5.png",
    subcategory: "반려동물",
    points: 31000,
    description: "고양이 건강을 위한 전문 영양 사료 체험단",
    recruitment: {
      current: 145,
      total: 14,
    },
    schedule: "",
    dayCount: "D-7",
    detailedSchedule: {
      applicationStart: "2025-01-19",
      applicationEnd: "2025-02-09",
      announcement: "2025-02-11",
      purchasePeriod: "2025-02-11 ~ 2025-02-14",
      registrationPeriod: "2025-02-14 ~ 2025-02-21",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "쿠팡",
  },
  {
    id: "delivery_16",
    title: "프리미엄 운동화 컬렉션",
    category: "배송형",
    categoryIcon: "/images/brand_logo/navershop.svg",
    image: "/images/main/campaign_img/eximg_7.png",
    subcategory: "패션",
    points: 48000,
    description: "편안함과 스타일을 겸비한 프리미엄 운동화 체험단",
    recruitment: {
      current: 278,
      total: 9,
    },
    schedule: "",
    dayCount: "D-5",
    detailedSchedule: {
      applicationStart: "2025-01-20",
      applicationEnd: "2025-02-10",
      announcement: "2025-02-12",
      purchasePeriod: "2025-02-12 ~ 2025-02-15",
      registrationPeriod: "2025-02-15 ~ 2025-02-22",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "네이버쇼핑",
  },
];
