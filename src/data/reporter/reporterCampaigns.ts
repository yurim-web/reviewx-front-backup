/**
 * 기자단 캠페인 데이터 타입 정의
 */
interface ReporterCampaignData {
  id: string; // 캠페인 고유 식별자
  title: string; // 캠페인 제목
  category: string; // 캠페인 카테고리 (기자단)
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
    announcement: string; // 선정 발표 일
    registrationPeriod: string; // 등록 기간
  };
  campaign_detail_image: string; // 캠페인 상세 이미지 경로
  channel: string; // 채널 정보 (블로그, 인스타그램, 유튜브 등)
}

/**
 * 기자단 캠페인 데이터
 * 기자단 페이지에서 사용되는 전용 데이터
 */
export const reporterCampaigns: ReporterCampaignData[] = [
  {
    id: "reporter_1",
    title: "테크 기자단",
    category: "기자단",
    categoryIcon: "/images/brand_logo/youtube.svg",
    image: "/images/main/campaign_img/eximg_1.png",
    subcategory: "디지털",
    points: 80000,
    description: "최신 IT 기술 소식 기자단 모집",
    recruitment: {
      current: 45,
      total: 3,
    },
    schedule: "",
    dayCount: "D-5",
    detailedSchedule: {
      // 모집기간 사직일
      applicationStart: "2025-01-28",
      // 모집기간 마감일
      applicationEnd: "2025-02-12",
      // 선정 발표일
      announcement: "2025-02-14",
      // 등록 기간
      registrationPeriod: "2025-02-14 ~ 2025-02-17",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "유튜브",
  },
  {
    id: "reporter_2",
    title: "뷰티 기자단",
    category: "기자단",
    categoryIcon: "/images/brand_logo/insta.svg",
    image: "/images/main/campaign_img/eximg_2.png",
    subcategory: "뷰티",
    points: 75000,
    description: "뷰티 트렌드 리포팅 기자단",
    recruitment: {
      current: 78,
      total: 5,
    },
    schedule: "",
    dayCount: "D-3",
    detailedSchedule: {
      applicationStart: "2025-01-30",
      applicationEnd: "2025-02-14",
      announcement: "2025-02-16",
      registrationPeriod: "2025-02-16 ~ 2025-02-19",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "인스타그램",
  },
  {
    id: "reporter_3",
    title: "패션 기자단",
    category: "기자단",
    categoryIcon: "/images/brand_logo/naverblog.svg",
    image: "/images/main/campaign_img/eximg_3.png",
    subcategory: "패션",
    points: 70000,
    description: "패션 트렌드 리포팅 기자단",
    recruitment: {
      current: 56,
      total: 4,
    },
    schedule: "",
    dayCount: "긴급",
    detailedSchedule: {
      applicationStart: "2025-01-25",
      applicationEnd: "2025-02-10",
      announcement: "2025-02-12",
      registrationPeriod: "2025-02-12 ~ 2025-02-15",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "블로그",
  },
  {
    id: "reporter_4",
    title: "푸드 기자단",
    category: "기자단",
    categoryIcon: "/images/brand_logo/naverblog.svg",
    image: "/images/main/campaign_img/eximg_4.png",
    subcategory: "식품",
    points: 65000,
    description: "맛집 및 식품 리포팅 기자단",
    recruitment: {
      current: 89,
      total: 6,
    },
    schedule: "",
    dayCount: "D-7",
    detailedSchedule: {
      applicationStart: "2025-01-26",
      applicationEnd: "2025-02-11",
      announcement: "2025-02-13",
      registrationPeriod: "2025-02-13 ~ 2025-02-16",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "블로그",
  },
  {
    id: "reporter_5",
    title: "여행 기자단",
    category: "기자단",
    categoryIcon: "/images/brand_logo/youtube.svg",
    image: "/images/main/campaign_img/eximg_5.png",
    subcategory: "여행",
    points: 90000,
    description: "국내외 여행지 리포팅 기자단",
    recruitment: {
      current: 34,
      total: 2,
    },
    schedule: "",
    dayCount: "D-6",
    detailedSchedule: {
      applicationStart: "2025-01-27",
      applicationEnd: "2025-02-12",
      announcement: "2025-02-14",
      registrationPeriod: "2025-02-14 ~ 2025-02-17",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "유튜브",
  },
  {
    id: "reporter_6",
    title: "라이프스타일 기자단",
    category: "기자단",
    categoryIcon: "/images/brand_logo/insta.svg",
    image: "/images/main/campaign_img/eximg_6.png",
    subcategory: "생활",
    points: 60000,
    description: "라이프스타일 트렌드 리포팅 기자단",
    recruitment: {
      current: 67,
      total: 8,
    },
    schedule: "",
    dayCount: "D-4",
    detailedSchedule: {
      applicationStart: "2025-01-29",
      applicationEnd: "2025-02-13",
      announcement: "2025-02-15",
      registrationPeriod: "2025-02-15 ~ 2025-02-18",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "인스타그램",
  },
  {
    id: "reporter_7",
    title: "게임 기자단",
    category: "기자단",
    categoryIcon: "/images/brand_logo/youtube.svg",
    image: "/images/main/campaign_img/eximg_7.png",
    subcategory: "게임",
    points: 70000,
    description: "게임 리뷰 및 소식 리포팅 기자단",
    recruitment: {
      current: 45,
      total: 5,
    },
    schedule: "",
    dayCount: "D-2",
    detailedSchedule: {
      applicationStart: "2025-01-31",
      applicationEnd: "2025-02-15",
      announcement: "2025-02-17",
      registrationPeriod: "2025-02-17 ~ 2025-02-20",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "유튜브",
  },
  {
    id: "reporter_8",
    title: "건강 기자단",
    category: "기자단",
    categoryIcon: "/images/brand_logo/naverblog.svg",
    image: "/images/main/campaign_img/eximg_8.png",
    subcategory: "건강",
    points: 65000,
    description: "건강 및 웰빙 정보 리포팅 기자단",
    recruitment: {
      current: 78,
      total: 6,
    },
    schedule: "",
    dayCount: "D-8",
    detailedSchedule: {
      applicationStart: "2025-01-24",
      applicationEnd: "2025-02-09",
      announcement: "2025-02-11",
      registrationPeriod: "2025-02-11 ~ 2025-02-14",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "블로그",
  },
  {
    id: "reporter_9",
    title: "문화 기자단",
    category: "기자단",
    categoryIcon: "/images/brand_logo/insta.svg",
    image: "/images/main/campaign_img/eximg_9.png",
    subcategory: "문화",
    points: 60000,
    description: "문화 예술 전시회 리포팅 기자단",
    recruitment: {
      current: 56,
      total: 7,
    },
    schedule: "",
    dayCount: "D-1",
    detailedSchedule: {
      applicationStart: "2025-02-01",
      applicationEnd: "2025-02-16",
      announcement: "2025-02-18",
      registrationPeriod: "2025-02-18 ~ 2025-02-21",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "인스타그램",
  },
  {
    id: "reporter_10",
    title: "스포츠 기자단",
    category: "기자단",
    categoryIcon: "/images/brand_logo/youtube.svg",
    image: "/images/main/campaign_img/eximg_10.png",
    subcategory: "스포츠",
    points: 75000,
    description: "스포츠 이벤트 리포팅 기자단",
    recruitment: {
      current: 34,
      total: 3,
    },
    schedule: "",
    dayCount: "D-9",
    detailedSchedule: {
      applicationStart: "2025-01-23",
      applicationEnd: "2025-02-08",
      announcement: "2025-02-10",
      registrationPeriod: "2025-02-10 ~ 2025-02-13",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "유튜브",
  },
  {
    id: "reporter_11",
    title: "반려동물 기자단",
    category: "기자단",
    categoryIcon: "/images/brand_logo/naverblog.svg",
    image: "/images/main/campaign_img/eximg_11.png",
    subcategory: "반려동물",
    points: 65000,
    description: "반려동물 케어 정보 리포팅 기자단",
    recruitment: {
      current: 67,
      total: 5,
    },
    schedule: "",
    dayCount: "D-6",
    detailedSchedule: {
      applicationStart: "2025-01-27",
      applicationEnd: "2025-02-12",
      announcement: "2025-02-14",
      registrationPeriod: "2025-02-14 ~ 2025-02-17",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "블로그",
  },
  {
    id: "reporter_12",
    title: "자동차 기자단",
    category: "기자단",
    categoryIcon: "/images/brand_logo/youtube.svg",
    image: "/images/main/campaign_img/eximg_12.png",
    subcategory: "자동차",
    points: 85000,
    description: "자동차 신차 소식 리포팅 기자단",
    recruitment: {
      current: 23,
      total: 2,
    },
    schedule: "",
    dayCount: "긴급",
    detailedSchedule: {
      applicationStart: "2025-01-25",
      applicationEnd: "2025-02-10",
      announcement: "2025-02-12",
      registrationPeriod: "2025-02-12 ~ 2025-02-15",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "유튜브",
  },
  {
    id: "reporter_13",
    title: "부동산 기자단",
    category: "기자단",
    categoryIcon: "/images/brand_logo/naverblog.svg",
    image: "/images/main/campaign_img/eximg_13.png",
    subcategory: "부동산",
    points: 80000,
    description: "부동산 시장 동향 리포팅 기자단",
    recruitment: {
      current: 45,
      total: 3,
    },
    schedule: "",
    dayCount: "D-4",
    detailedSchedule: {
      applicationStart: "2025-01-29",
      applicationEnd: "2025-02-13",
      announcement: "2025-02-15",
      registrationPeriod: "2025-02-15 ~ 2025-02-18",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "블로그",
  },
  {
    id: "reporter_14",
    title: "음악 기자단",
    category: "기자단",
    categoryIcon: "/images/brand_logo/insta.svg",
    image: "/images/main/campaign_img/eximg_1.png",
    subcategory: "문화",
    points: 65000,
    description: "음악 콘서트 및 앨범 리포팅 기자단",
    recruitment: {
      current: 56,
      total: 6,
    },
    schedule: "",
    dayCount: "D-7",
    detailedSchedule: {
      applicationStart: "2025-01-26",
      applicationEnd: "2025-02-11",
      announcement: "2025-02-13",
      registrationPeriod: "2025-02-13 ~ 2025-02-16",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "인스타그램",
  },
  {
    id: "reporter_15",
    title: "영화 기자단",
    category: "기자단",
    categoryIcon: "/images/brand_logo/youtube.svg",
    image: "/images/main/campaign_img/eximg_2.png",
    subcategory: "문화",
    points: 70000,
    description: "영화 리뷰 및 영화관 체험 기자단",
    recruitment: {
      current: 67,
      total: 5,
    },
    schedule: "",
    dayCount: "D-5",
    detailedSchedule: {
      applicationStart: "2025-01-28",
      applicationEnd: "2025-02-12",
      announcement: "2025-02-14",
      registrationPeriod: "2025-02-14 ~ 2025-02-17",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "유튜브",
  },
  {
    id: "reporter_16",
    title: "금융 기자단",
    category: "기자단",
    categoryIcon: "/images/brand_logo/naverblog.svg",
    image: "/images/main/campaign_img/eximg_3.png",
    subcategory: "금융",
    points: 75000,
    description: "금융 상품 및 투자 정보 리포팅 기자단",
    recruitment: {
      current: 34,
      total: 4,
    },
    schedule: "",
    dayCount: "D-3",
    detailedSchedule: {
      applicationStart: "2025-01-30",
      applicationEnd: "2025-02-14",
      announcement: "2025-02-16",
      registrationPeriod: "2025-02-16 ~ 2025-02-19",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "블로그",
  },
];
