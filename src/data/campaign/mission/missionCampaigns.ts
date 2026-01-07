/**
 * 미션형 캠페인 데이터 타입 정의
 */

import type { CampaignFormData } from "@/types/user/user";
import type {
  ContentByTab,
  CampaignWithApplicants,
} from "@/data/partner/sharedCampaigns";
import { calculateDaysLeft, calculateCampaignStatus } from "../delivery/utils";

export interface MissionCampaignData {
  id: string; // 캠페인 고유 식별자
  title: string; // 캠페인 제목
  category: string; // 캠페인 카테고리 (미션형)
  image: string; // 메인 제품 이미지 경로
  subcategory: string; // 세부 카테고리 (생활, 뷰티, 식품 등)
  channel: string; // 채널 (미션형은 빈 문자열 또는 기본값 사용)
  points: number; // 지급 포인트 (숫자)
  description: string; // 제품 설명 및 제공 내역
  recruitment: {
    current: number; // 현재 지원자 수
    total: number; // 총 모집 인원
  };
  schedule: string; // 날짜/시간 형식 일정 (예: "1/25 (화) 10:00\n모집 오픈")
  dayCount: string; // 남은 일수 형식 (예: "D-6")
  isUrgent?: boolean; // 긴급 캠페인 여부 (기본값: false)
  registeredAt?: string; // 캠페인 등록 시간 (ISO 8601 형식: "2025-01-15T10:30:00")
  detailedSchedule: {
    applicationStart: string; // 신청 시작일시
    applicationEnd: string; // 신청 마감일
    announcement: string; // 선정 발표일
    registrationPeriod: string; // 등록 기간
  };
  campaign_detail_image: string; // 캠페인 상세 이미지 경로 (첫 번째 이미지, 하위 호환성)
  campaign_detail_images?: string[]; // 캠페인 상세 이미지 경로 배열 (여러 이미지)
  keyword: string; // 캠페인 키워드
  productLink?: string; // 홍보링크 (선택적)
  requirements: string[]; // 캠페인별 요구사항 코드 목록
  guidelineTexts: string[]; // 유의사항 텍스트 목록
  contentType?: "link" | "image" | "both"; // 콘텐츠 타입 (링크만, 이미지만, 링크+이미지)
  brandName?: string; // 브랜드명 (선택적)
  // 참여/제출 옵션
  adultOnly?: boolean; // 만 19세 이상 참여 허용
  allowReParticipation?: boolean; // 이전 참여자 재참여 허용
  allowLateSubmission?: boolean; // 지각 제출 허용
  // 문의 담당자 정보
  contactPhone?: string; // 문의 담당자 휴대폰 번호
}

/**
 * 미션형 캠페인 데이터
 * 미션형 페이지에서 사용되는 전용 데이터
 */
export const missionCampaigns: MissionCampaignData[] = [
  // mission_1: 예정 탭
  {
    id: "mission_1",
    title: "스킨케어 미션형",
    category: "미션형",
    image: "/images/main/campaign_img/eximg_1.png",
    subcategory: "뷰티",
    channel: "", // 미션형은 채널 없음
    points: 50000,
    description: "프리미엄 스킨케어 제품 미션형 모집",
    recruitment: {
      current: 289,
      total: 5,
    },
    schedule: "",
    dayCount: "D-5",
    registeredAt: "2025-12-15T09:30:00.000Z", // 등록 시간
    detailedSchedule: {
      // 선정 중 - 모집 기간 종료 후, 선정 발표 전
      // 모집 기간: 2025-09-02 ~ 2025-09-14 (종료됨)
      // 선정 발표: 2025-09-16 (아직 안 지남)
      // 등록 기간: 2025-09-22 ~ 2025-09-30 (아직 시작 안 함)
      applicationStart: "2025-09-02",
      applicationEnd: "2025-09-14",
      announcement: "2025-09-16",
      registrationPeriod: "2025-09-22 ~ 2025-09-30",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    keyword: "#스킨케어체험 #뷰티미션형 #화장품체험 #올리브영 #솔직후기",
    productLink: "https://example.com/skincare-product",
    requirements: [
      "text_2000",
      "photo_15",
      "video_1_180",
      "product_link",
      "keyword",
    ],
    guidelineTexts: [
      "미션형 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★제품 수령 후 충분한 체험 기간을 가지고 솔직한 후기를 작성해주세요!!★",
      "★제공된 제품을 모두 활용하여 작성해주세요 - 스킨케어 제품의 모든 단계를 체험해보세요 - 사용감, 효과, 향, 질감 등 다양한 측면에서 리뷰 작성 - 실제 사용 전후 비교 사진과 체험 과정을 상세히 기록<br />★미션형 리뷰는 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★<br />★미션형 작성 시 실제 제품을 사용하시는 모습과 변화 과정 사진 필수 첨부해주세요★<br />★체험 결과에 대한 솔직한 평가를 부탁드립니다★",
      "★미션형 작성 / 무료 체험 캠페인 입니다 (구매 없이 체험 후 리뷰 작성)★ <br /> 1. 본 캠페인은 [무료 체험]으로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정 후 제품 수령 후 최소 1주일 이상 체험 진행해주세요<br /> 3. 기간 내 리뷰 작성 및 등록 불가할 경우 다음 캠페인 참여 제한<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★미션형 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 체험한 제품 특장점과 개선점에 대하여 솔직하게 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 제품 미수령 및 체험 불가할 경우 : 다음 캠페인 참여 제한 <br /> - 미션형 리뷰 작성 불가할 경우 : 다음 캠페인 참여 제한 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 공정배너의 경우 리뷰등록화면 내에 코드를 복사하여 등록 부탁드립니다.(스크린샷 불가) <br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 다음 캠페인 참여가 제한됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 미션형의 경우 체험 과정과 결과를 상세히 기록해주세요 - 사용 전후 비교 사진은 필수입니다",
    ],
    contentType: "both" as const, // 링크 + 이미지
  },
  {
    id: "mission_2",
    title: "헬스케어 미션형",
    category: "미션형",
    image: "/images/main/campaign_img/eximg_2.png",
    subcategory: "뷰티",
    points: 45000,
    description: "건강 관리 제품 미션형 모집",
    recruitment: {
      current: 156,
      total: 8,
    },
    schedule: "",
    dayCount: "",
    isUrgent: true, // 긴급 캠페인
    registeredAt: "2025-12-17T14:20:00.000Z", // 등록 시간
    detailedSchedule: {
      // 모집 중 - 현재 날짜 기준 (2025-12-19 ~ 2026-01-05)
      applicationStart: "2025-12-19",
      applicationEnd: "2026-01-05",
      announcement: "2026-01-07",
      registrationPeriod: "2026-01-08 ~ 2026-01-25",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    keyword: "#헬스케어체험 #건강관리 #미션형 #유튜브 #솔직후기",
    productLink: "https://example.com/healthcare-product",
    requirements: [
      "text_1800",
      "photo_12",
      "video_2_240",
      "product_link",
      "keyword",
    ],
    guidelineTexts: [
      "미션형 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★제품 수령 후 충분한 체험 기간을 가지고 솔직한 후기를 작성해주세요!!★",
      "★제공된 제품을 모두 활용하여 작성해주세요 - 건강관리 제품의 모든 기능을 체험해보세요 - 사용법, 효과, 편의성 등 다양한 측면에서 리뷰 작성 - 실제 사용 과정과 체험 결과를 상세히 기록<br />★미션형 리뷰는 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★<br />★미션형 작성 시 실제 제품을 사용하시는 모습과 변화 과정 사진 필수 첨부해주세요★<br />★체험 결과에 대한 솔직한 평가를 부탁드립니다★",
      "★미션형 작성 / 무료 체험 캠페인 입니다 (구매 없이 체험 후 리뷰 작성)★ <br /> 1. 본 캠페인은 [무료 체험]으로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정 후 제품 수령 후 최소 2주일 이상 체험 진행해주세요<br /> 3. 기간 내 리뷰 작성 및 등록 불가할 경우 다음 캠페인 참여 제한<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★미션형 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 체험한 제품 특장점과 개선점에 대하여 솔직하게 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 제품 미수령 및 체험 불가할 경우 : 다음 캠페인 참여 제한 <br /> - 미션형 리뷰 작성 불가할 경우 : 다음 캠페인 참여 제한 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 공정배너의 경우 리뷰등록화면 내에 코드를 복사하여 등록 부탁드립니다.(스크린샷 불가) <br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 다음 캠페인 참여가 제한됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 미션형의 경우 체험 과정과 결과를 상세히 기록해주세요 - 건강 관련 제품은 개인차가 있을 수 있으니 객관적으로 작성해주세요",
    ],
    contentType: "image" as const, // 이미지만
    channel: "", // 미션형은 채널 없음
  },
  {
    id: "mission_3",
    title: "홈데코 미션형",
    category: "미션형",
    image: "/images/main/campaign_img/eximg_3.png",
    subcategory: "생활",
    channel: "", // 미션형은 채널 없음
    points: 38000,
    description: "인테리어 홈데코 제품 미션형",
    recruitment: {
      current: 89,
      total: 6,
    },
    schedule: "",
    dayCount: "D-3",
    registeredAt: "2025-12-19T11:15:00.000Z", // 등록 시간
    detailedSchedule: {
      // 모집 중 - 현재 날짜 기준 (2025-12-21 ~ 2026-01-08)
      applicationStart: "2025-12-21",
      applicationEnd: "2026-01-08",
      announcement: "2026-01-10",
      registrationPeriod: "2026-01-13 ~ 2026-01-20",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    keyword: "#홈데코체험 #인테리어 #미션형 #블로그 #홈스타일링",
    requirements: [
      "text_1200",
      "photo_20",
      "video_90",
      "product_link",
      "keyword",
    ],
    guidelineTexts: [
      "미션형 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★제품을 실제 홈 인테리어에 적용하여 체험해주세요!!★",
      "★홈데코 제품의 특성과 실제 사용 효과를 상세히 기록해주세요★",
    ],
    contentType: "link" as const, // 링크만
  },
  {
    id: "mission_4",
    title: "패션 미션형",
    category: "미션형",
    image: "/images/main/campaign_img/eximg_4.png",
    subcategory: "패션",
    points: 42000,
    description: "프리미엄 패션 브랜드 미션형",
    recruitment: {
      current: 178,
      total: 10,
    },
    schedule: "",
    dayCount: "D-7",
    registeredAt: "2025-12-20T13:30:00.000Z", // 등록 시간
    detailedSchedule: {
      // 모집 중 - 현재 날짜 기준 (2025-12-22 ~ 2026-01-10)
      applicationStart: "2025-12-22",
      applicationEnd: "2026-01-10",
      announcement: "2026-01-12",
      registrationPeriod: "2026-01-15 ~ 2026-01-22",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    keyword: "#패션체험 #OOTD #스타일링 #인스타그램 #패션리뷰",
    requirements: [
      "text_800",
      "photo_8",
      "video_1_60",
      "product_link",
      "keyword",
    ],
    guidelineTexts: [
      "미션형 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★실제 착용 모습과 스타일링 과정을 자세히 보여주세요!!★",
      "★다양한 코디 방법과 패션 아이템의 특징을 상세히 기록해주세요★",
    ],
    contentType: "link" as const, // 링크만
    channel: "", // 미션형은 채널 없음
  },
  {
    id: "mission_5",
    title: "식품 미션형",
    category: "미션형",
    image: "/images/main/campaign_img/eximg_5.png",
    subcategory: "식품",
    points: 32000,
    description: "유기농 식품 브랜드 미션형",
    recruitment: {
      current: 145,
      total: 15,
    },
    schedule: "",
    dayCount: "D-6",
    registeredAt: "2025-10-28T10:00:00.000Z", // 등록 시간
    detailedSchedule: {
      // 종료 탭 - registrationPeriod가 과거
      applicationStart: "2025-11-01",
      applicationEnd: "2025-11-15",
      announcement: "2025-11-17",
      registrationPeriod: "2025-11-20 ~ 2025-11-27",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    keyword: "#식품체험 #건강식품 #유기농 #쿠팡 #맛후기",
    requirements: [
      "text_1000",
      "photo_6",
      "video_3_120",
      "product_link",
      "keyword",
    ],
    guidelineTexts: [
      "미션형 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★실제 섭취 과정과 맛, 효과를 상세히 기록해주세요!!★",
      "★식품의 특징과 조리 과정을 자세히 보여주세요★",
    ],
    contentType: "both" as const, // 링크 + 이미지
    channel: "", // 미션형은 채널 없음
  },
  {
    id: "mission_6",
    title: "디지털 미션형",
    category: "미션형",
    image: "/images/main/campaign_img/eximg_6.png",
    subcategory: "디지털",
    channel: "", // 미션형은 채널 없음
    points: 55000,
    description: "최신 디지털 기기 미션형",
    recruitment: {
      current: 98,
      total: 4,
    },
    schedule: "",
    dayCount: "D-4",
    registeredAt: "2025-12-22T13:30:00.000Z", // 등록 시간
    detailedSchedule: {
      // 모집 중 - 현재 날짜 기준 (2025-12-24 ~ 2026-01-11)
      applicationStart: "2025-12-24",
      applicationEnd: "2026-01-11",
      announcement: "2026-01-13",
      registrationPeriod: "2026-01-16 ~ 2026-01-23",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    keyword: "#디지털체험 #최신기술 #가전제품 #네이버쇼핑 #테크리뷰",
    requirements: [
      "text_2500",
      "photo_25",
      "video_2_300",
      "product_link",
      "keyword",
    ],
    guidelineTexts: [
      "미션형 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★기기의 기능과 성능을 상세히 테스트하고 기록해주세요!!★",
      "★실제 사용 환경에서의 성능과 장단점을 객관적으로 평가해주세요★",
    ],
    contentType: "image" as const, // 이미지만
  },
  {
    id: "mission_12",
    title: "이미지 전용 미션형",
    category: "미션형",
    image: "/images/main/campaign_img/eximg_7.png",
    subcategory: "뷰티",
    channel: "", // 미션형은 채널 없음
    points: 40000,
    description: "이미지만 업로드하는 미션형 캠페인",
    recruitment: {
      current: 120,
      total: 5,
    },
    schedule: "",
    dayCount: "D-5",
    registeredAt: "2025-12-18T10:00:00.000Z", // 등록 시간
    detailedSchedule: {
      // 모집 중 - 현재 날짜 기준 (2025-12-20 ~ 2026-01-06)
      applicationStart: "2025-12-20",
      applicationEnd: "2026-01-06",
      announcement: "2026-01-08",
      registrationPeriod: "2026-01-10 ~ 2026-01-17",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    keyword: "#이미지미션 #뷰티체험 #이미지전용 #인스타그램 #솔직후기",
    requirements: ["text_1500", "photo_15", "keyword"],
    guidelineTexts: [
      "미션형 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★이미지만 업로드하는 미션형 캠페인입니다!!★",
      "★이미지를 통해 제품의 특징을 잘 보여주세요★",
    ],
    contentType: "image" as const, // 이미지만
  },
  {
    id: "mission_7",
    title: "반려동물 미션형",
    category: "미션형",
    image: "/images/main/campaign_img/eximg_7.png",
    subcategory: "반려동물",
    points: 35000,
    description: "반려동물 용품 미션형",
    recruitment: {
      current: 67,
      total: 8,
    },
    schedule: "",
    dayCount: "D-2",
    registeredAt: "2025-11-10T09:15:00.000Z", // 등록 시간
    detailedSchedule: {
      // 진행 탭 - applicationEnd가 과거, registrationPeriod가 미래 (announcement <= 오늘 <= registrationPeriod 끝)
      applicationStart: "2025-11-15",
      applicationEnd: "2025-11-30",
      announcement: "2025-12-02",
      registrationPeriod: "2025-12-05 ~ 2025-12-20",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    keyword: "#반려동물체험 #펫케어 #펫용품 #블로그 #반려동물리뷰",
    requirements: [
      "text_1300",
      "photo_18",
      "video_150",
      "product_link",
      "keyword",
    ],
    guidelineTexts: [
      "미션형 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★반려동물의 실제 사용 모습과 반응을 자세히 기록해주세요!!★",
      "★제품 사용 전후 반려동물의 변화를 관찰하고 기록해주세요★",
    ],
    contentType: "link" as const, // 링크만
    channel: "", // 미션형은 채널 없음
  },
  {
    id: "mission_8",
    title: "스포츠 미션형",
    category: "미션형",
    image: "/images/main/campaign_img/eximg_8.png",
    subcategory: "여가",
    points: 40000,
    description: "스포츠 용품 미션형",
    recruitment: {
      current: 123,
      total: 7,
    },
    schedule: "",
    dayCount: "D-8",
    registeredAt: "2025-11-05T14:00:00.000Z", // 등록 시간
    detailedSchedule: {
      // 종료 탭 - registrationPeriod가 과거
      applicationStart: "2025-11-10",
      applicationEnd: "2025-11-25",
      announcement: "2025-11-27",
      registrationPeriod: "2025-11-30 ~ 2025-12-07",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    keyword: "#스포츠체험 #운동용품 #피트니스 #유튜브 #운동리뷰",
    requirements: [
      "text_1600",
      "photo_14",
      "video_1_200",
      "product_link",
      "keyword",
    ],
    guidelineTexts: [
      "미션형 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★실제 운동 시 사용 모습과 성능을 자세히 보여주세요!!★",
      "★운동 효과와 제품의 기능성을 객관적으로 평가해주세요★",
    ],
    contentType: "image" as const, // 이미지만
    channel: "", // 미션형은 채널 없음
  },
  {
    id: "mission_9",
    title: "뷰티 미션형",
    category: "미션형",
    image: "/images/main/campaign_img/eximg_9.png",
    subcategory: "뷰티",
    points: 48000,
    description: "프리미엄 뷰티 브랜드 미션형",
    recruitment: {
      current: 45,
      total: 3,
    },
    schedule: "",
    dayCount: "D-1",
    registeredAt: "2025-11-15T10:50:00.000Z", // 등록 시간
    detailedSchedule: {
      // 진행 탭 - applicationEnd가 과거, registrationPeriod가 미래 (announcement <= 오늘 <= registrationPeriod 끝)
      applicationStart: "2025-11-20",
      applicationEnd: "2025-12-05",
      announcement: "2025-12-07",
      registrationPeriod: "2025-12-08 ~ 2025-12-25",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    keyword: "#뷰티체험 #화장품리뷰 #올리브영 #뷰티블로거 #메이크업",
    requirements: [
      "text_2200",
      "photo_22",
      "video_180",
      "product_link",
      "keyword",
    ],
    guidelineTexts: [
      "미션형 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★사용 전후 비교와 실제 발색, 지속력을 상세히 기록해주세요!!★",
      "★메이크업 과정과 최종 결과를 단계별로 보여주세요★",
    ],
    contentType: "both" as const, // 링크 + 이미지
    channel: "", // 미션형은 채널 없음
  },
  {
    id: "mission_10",
    title: "여행 미션형",
    category: "미션형",
    image: "/images/main/campaign_img/eximg_10.png",
    subcategory: "여행",
    points: 60000,
    description: "프리미엄 여행 서비스 미션형",
    recruitment: {
      current: 167,
      total: 2,
    },
    schedule: "",
    dayCount: "D-9",
    registeredAt: "2025-11-01T08:00:00.000Z", // 등록 시간
    detailedSchedule: {
      // 취소 탭 - status가 "취소"로 설정됨
      applicationStart: "2025-11-05",
      applicationEnd: "2025-11-20",
      announcement: "2025-11-22",
      registrationPeriod: "2025-11-25 ~ 2025-12-02",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    keyword: "#여행체험 #트래블로그 #여행리뷰 #인스타그램 #여행스타그램",
    requirements: [
      "text_3000",
      "photo_30",
      "video_3_360",
      "product_link",
      "keyword",
    ],
    guidelineTexts: [
      "미션형 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★여행 전 과정과 서비스 경험을 자세히 기록해주세요!!★",
      "★여행지의 특색과 서비스의 장단점을 솔직하게 리뷰해주세요★",
    ],
    contentType: "link" as const, // 링크만
    channel: "", // 미션형은 채널 없음
  },
  {
    id: "mission_11",
    title: "프리미엄 스킨케어 세트 미션형",
    category: "미션형",
    image: "/images/main/campaign_img/eximg_1.png",
    subcategory: "뷰티",
    channel: "", // 미션형은 채널 없음
    points: 55000,
    description:
      "모든 피부 타입에 맞는 프리미엄 스킨케어 세트 미션형 모집 예정",
    recruitment: {
      current: 0,
      total: 8,
    },
    schedule: "1/15 (목) 10:00\n모집 오픈",
    dayCount: "",
    registeredAt: "2026-01-10T12:00:00.000Z", // 등록 시간
    detailedSchedule: {
      // 오픈 예정 - 현재 날짜보다 미래 (2026-01-15 ~ 2026-02-05)
      applicationStart: "2026-01-15",
      applicationEnd: "2026-02-05",
      announcement: "2026-02-07",
      registrationPeriod: "2026-02-10 ~ 2026-02-24",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    keyword: "#스킨케어미션 #뷰티체험 #프리미엄스킨케어 #미션형 #솔직후기",
    productLink: "https://example.com/premium-skincare-set",
    requirements: [
      "text_2500",
      "photo_25",
      "video_2_300",
      "product_link",
      "keyword",
    ],
    guidelineTexts: [
      "미션형 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★제품 수령 후 충분한 체험 기간을 가지고 솔직한 후기를 작성해주세요!!★",
      "★제공된 제품을 모두 활용하여 작성해주세요 - 스킨케어 제품의 모든 단계를 체험해보세요 - 사용감, 효과, 향, 질감 등 다양한 측면에서 리뷰 작성 - 실제 사용 전후 비교 사진과 체험 과정을 상세히 기록<br />★미션형 리뷰는 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★<br />★미션형 작성 시 실제 제품을 사용하시는 모습과 변화 과정 사진 필수 첨부해주세요★<br />★체험 결과에 대한 솔직한 평가를 부탁드립니다★",
      "★미션형 작성 / 무료 체험 캠페인 입니다 (구매 없이 체험 후 리뷰 작성)★ <br /> 1. 본 캠페인은 [무료 체험]으로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정 후 제품 수령 후 최소 2주일 이상 체험 진행해주세요<br /> 3. 기간 내 리뷰 작성 및 등록 불가할 경우 다음 캠페인 참여 제한<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★미션형 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 체험한 제품 특장점과 개선점에 대하여 솔직하게 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 제품 미수령 및 체험 불가할 경우 : 다음 캠페인 참여 제한 <br /> - 미션형 리뷰 작성 불가할 경우 : 다음 캠페인 참여 제한 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 공정배너의 경우 리뷰등록화면 내에 코드를 복사하여 등록 부탁드립니다.(스크린샷 불가) <br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 다음 캠페인 참여가 제한됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 미션형의 경우 체험 과정과 결과를 상세히 기록해주세요 - 사용 전후 비교 사진은 필수입니다",
    ],
    contentType: "both" as const, // 링크 + 이미지
    brandName: "프리미엄 스킨케어", // 브랜드명 추가
    // 참여/제출 옵션
    adultOnly: false, // 만 19세 이상 참여 허용
    allowReParticipation: false, // 이전 참여자 재참여 허용
    allowLateSubmission: false, // 지각 제출 허용
    // 문의 담당자 정보
    contactPhone: "010-1234-5678", // 문의 담당자 휴대폰 번호
  },
];

/**
 * 미션형 캠페인 확장 타입 정의 (파트너 관리용)
 */
export interface MissionCampaignDataExtended {
  // 기존 MissionCampaignData의 모든 필드 포함
  id: string;
  title: string;
  category: string;
  image: string;
  subcategory: string;
  points: number;
  description: string;
  recruitment: {
    current: number;
    total: number;
  };
  schedule: string;
  dayCount: string;
  isUrgent?: boolean; // 긴급 캠페인 여부 (기본값: false)
  registeredAt?: string; // 캠페인 등록 시간 (ISO 8601 형식: "2025-01-15T10:30:00")
  detailedSchedule: {
    applicationStart: string;
    applicationEnd: string;
    announcement: string;
    registrationPeriod: string;
  };
  campaign_detail_image: string;
  keyword: string;
  productLink?: string;
  requirements: string[];
  guidelineTexts: string[];
  contentType?: "link" | "image" | "both"; // 콘텐츠 타입 (링크만, 이미지만, 링크+이미지)

  // 파트너 관리용 추가 필드
  status?: "진행 중" | "대기 중" | "모집 중" | "종료" | "취소" | "긴급";
  brandName?: string;
  partnerName?: string;
  statusText?: string;

  // 참여/제출 옵션
  adultOnly?: boolean; // 만 19세 이상 참여 허용
  allowReParticipation?: boolean; // 이전 참여자 재참여 허용
  allowLateSubmission?: boolean; // 지각 제출 허용
  // 문의 담당자 정보
  contactPhone?: string; // 문의 담당자 휴대폰 번호

  // 신청자 데이터 (선택사항 - 진행/예정/신청 캠페인에만 있음)
  applicantData?: {
    applicants: Array<{
      id: string;
      Id: string;
      nickname: string;
      userType: "리뷰어" | "인플루언서";
      profileImage: string;
      memberType: "모범 회원" | "주의 회원" | "경고 회원" | "이용 제한";
      dailyVisits: number;
      totalVisits: number;
      neighbors: number;
      memo: string;
      selectionStatus: "미선택" | "선정하기" | "이용제한 계정";
      channel: string;
      registrationDate?: string;
    }>;
    selectedApplicants: Array<{
      id: string;
      Id: string;
      nickname: string;
      userType: "리뷰어" | "인플루언서";
      profileImage: string;
      memberType: "모범 회원" | "주의 회원" | "경고 회원" | "이용 제한";
      dailyVisits: number;
      totalVisits: number;
      neighbors: number;
      memo: string;
      selectionStatus: "선정하기";
      channel: string;
      registrationDate?: string;
    }>;
  };

  // 콘텐츠 데이터 (선택사항 - 종료/취소 캠페인에는 필수, 진행/예정/신청 캠페인에는 선택)
  contents?: {
    waiting?: Array<{
      id: string;
      createdAt: string;
      status: "검수" | "검수중";
      userType: "리뷰어" | "인플루언서";
      nickname: string;
      channelId: string;
      channel: string;
      profileImage?: string;
      actionType?: number;
      extension_request_reason?: string;
      isExtensionApproved?: boolean;
      extendedDeadline?: string;
      isRejected?: boolean;
      reject_reason?: string;
      isReported?: boolean;
      reportedDate?: string;
    }>;
    reviewing?: Array<{
      id: string;
      createdAt: string;
      status: "검수" | "검수중";
      userType: "리뷰어" | "인플루언서";
      nickname: string;
      channelId: string;
      channel: string;
      updatedAt?: string;
      isRejected?: boolean;
      isLate?: boolean;
      profileImage?: string;
      actionType?: number;
    }>;
    completed?: Array<{
      id: string;
      createdAt: string;
      status: "완료";
      userType: "리뷰어" | "인플루언서";
      nickname: string;
      channelId: string;
      channel: string;
      updatedAt?: string;
      isLate?: boolean;
      profileImage?: string;
      actionType?: number;
    }>;
  };
}

/**
 * 미션형 캠페인 확장 데이터 (파트너 관리용) - 신청자 데이터 포함
 *
 * 설명:
 * - 파트너 관리 페이지에서 사용하는 미션형 캠페인 데이터입니다.
 * - 신청자 데이터와 종료/취소 데이터를 포함합니다.
 * - 각 캠페인마다 직접 예시 신청자 데이터를 포함합니다.
 */
export const missionCampaignsExtended: MissionCampaignDataExtended[] = [
  // mission_1: 스킨케어 미션형
  {
    ...missionCampaigns[0],
    applicantData: {
      applicants: [
        {
          id: "app_mission_1_네이버블로그_001",
          Id: "reviewer_mission_1_001",
          nickname: "스킨케어리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 150,
          totalVisits: 450000,
          neighbors: 1100,
          memo: "스킨케어 제품 체험단 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-15",
        },
        {
          id: "app_mission_1_네이버블로그_002",
          Id: "reviewer_mission_1_002",
          nickname: "뷰티전문가B",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 180,
          totalVisits: 580000,
          neighbors: 1500,
          memo: "상세한 사용 후기 작성 능력이 뛰어납니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-16",
        },
        {
          id: "app_mission_1_네이버블로그_003",
          Id: "reviewer_mission_1_003",
          nickname: "뷰티인플루언서C",
          userType: "인플루언서" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 220,
          totalVisits: 720000,
          neighbors: 2000,
          memo: "사진 퀄리티가 우수하고 팔로워 수가 많습니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-17",
        },
        {
          id: "app_mission_1_네이버블로그_004",
          Id: "reviewer_mission_1_004",
          nickname: "리뷰퀸D",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "주의 회원" as const,
          dailyVisits: 95,
          totalVisits: 280000,
          neighbors: 700,
          memo: "가독성 좋은 후기를 작성합니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-18",
        },
        {
          id: "app_mission_1_네이버블로그_005",
          Id: "reviewer_mission_1_005",
          nickname: "뷰티마스터E",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 200,
          totalVisits: 650000,
          neighbors: 1800,
          memo: "고품질 리뷰 전문가입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-19",
        },
      ],
      selectedApplicants: [],
    },
  },
  // mission_2: 헬스케어 미션형
  {
    ...missionCampaigns[1],
    isUrgent: true, // 긴급 캠페인
    applicantData: {
      applicants: [
        {
          id: "app_mission_2_유튜브_001",
          Id: "reviewer_mission_2_001",
          nickname: "헬스케어리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 120,
          totalVisits: 400000,
          neighbors: 900,
          memo: "헬스케어 제품 체험단 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "유튜브",
          registrationDate: "2025-12-18",
        },
        {
          id: "app_mission_2_유튜브_002",
          Id: "reviewer_mission_2_002",
          nickname: "건강리뷰어B",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 160,
          totalVisits: 500000,
          neighbors: 1200,
          memo: "건강 제품 리뷰를 자주 작성합니다.",
          selectionStatus: "미선택" as const,
          channel: "유튜브",
          registrationDate: "2025-12-19",
        },
        {
          id: "app_mission_2_유튜브_003",
          Id: "reviewer_mission_2_003",
          nickname: "건강인플루언서C",
          userType: "인플루언서" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 250,
          totalVisits: 750000,
          neighbors: 2200,
          memo: "건강 제품 전문 인플루언서입니다.",
          selectionStatus: "미선택" as const,
          channel: "유튜브",
          registrationDate: "2025-12-20",
        },
      ],
      selectedApplicants: [
        {
          id: "sel_mission_2_유튜브_001",
          Id: "selected_mission_2_001",
          nickname: "선정된헬스케어리뷰어1",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 320,
          totalVisits: 950000,
          neighbors: 2800,
          memo: "이미 선정된 우수 리뷰어입니다.",
          selectionStatus: "선정하기" as const,
          channel: "유튜브",
          registrationDate: "2025-12-18",
        },
      ],
    },
    contents: {
      waiting: [
        {
          id: "content_mission_2_waiting_001",
          createdAt: "2025-12-20T10:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "헬스케어리뷰어A",
          channelId: "youtube_021",
          channel: "유튜브",
          profileImage: "/images/test_img/eximg.png",
          actionType: 3, // 이미지만 (contentType: "image")
        },
        {
          id: "content_mission_2_waiting_002",
          createdAt: "2025-12-21T11:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "건강리뷰어B",
          channelId: "youtube_022",
          channel: "유튜브",
          profileImage: "/images/test_img/eximg3.png",
          actionType: 3, // 이미지만 (contentType: "image")
        },
      ],
      reviewing: [
        {
          id: "content_mission_2_reviewing_001",
          createdAt: "2025-12-18T09:00:00.000Z",
          status: "검수중" as const,
          userType: "인플루언서" as const,
          nickname: "건강인플루언서C",
          channelId: "youtube_023",
          channel: "유튜브",
          updatedAt: "2025-12-19T10:00:00.000Z",
          isRejected: false,
          isLate: false,
          profileImage: "/images/test_img/eximg.png",
          actionType: 3, // 이미지만 (contentType: "image")
        },
      ],
      completed: [
        {
          id: "content_mission_2_completed_001",
          createdAt: "2025-12-15T08:00:00.000Z",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "선정된헬스케어리뷰어1",
          channelId: "youtube_024",
          channel: "유튜브",
          updatedAt: "2025-12-16T09:00:00.000Z",
          isLate: false,
          profileImage: "/images/test_img/eximg3.png",
          actionType: 3, // 이미지만 (contentType: "image")
        },
      ],
    },
  },
  // mission_3: 홈데코 미션형
  {
    ...missionCampaigns[2],
    applicantData: {
      applicants: [
        {
          id: "app_mission_3_네이버블로그_001",
          Id: "reviewer_mission_3_001",
          nickname: "홈데코리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 140,
          totalVisits: 420000,
          neighbors: 1000,
          memo: "홈데코 제품 체험단 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-20",
        },
        {
          id: "app_mission_3_네이버블로그_002",
          Id: "reviewer_mission_3_002",
          nickname: "인테리어인플루언서B",
          userType: "인플루언서" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 280,
          totalVisits: 850000,
          neighbors: 2500,
          memo: "인테리어 아이템 전문 인플루언서입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-21",
        },
        {
          id: "app_mission_3_네이버블로그_003",
          Id: "reviewer_mission_3_003",
          nickname: "홈데코리뷰어C",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 110,
          totalVisits: 350000,
          neighbors: 800,
          memo: "홈데코 제품 리뷰를 자주 작성합니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-22",
        },
      ],
      selectedApplicants: [
        {
          id: "sel_mission_3_네이버블로그_001",
          Id: "selected_mission_3_001",
          nickname: "선정된홈데코리뷰어1",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 350,
          totalVisits: 1000000,
          neighbors: 3200,
          memo: "이미 선정된 우수 리뷰어입니다.",
          selectionStatus: "선정하기" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-20",
        },
      ],
    },
    contents: {
      waiting: [
        {
          id: "content_mission_3_waiting_001",
          createdAt: "2025-12-25T10:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "홈데코리뷰어A",
          channelId: "blog_025",
          channel: "네이버블로그",
          profileImage: "/images/test_img/eximg.png",
          actionType: 4, // 링크만
        },
        {
          id: "content_mission_3_waiting_002",
          createdAt: "2025-12-26T11:00:00.000Z",
          status: "검수" as const,
          userType: "인플루언서" as const,
          nickname: "인테리어인플루언서B",
          channelId: "blog_026",
          channel: "네이버블로그",
          profileImage: "/images/test_img/eximg3.png",
          actionType: 4, // 링크만
        },
      ],
      reviewing: [
        {
          id: "content_mission_3_reviewing_001",
          createdAt: "2025-12-24T09:00:00.000Z",
          status: "검수중" as const,
          userType: "리뷰어" as const,
          nickname: "홈데코리뷰어C",
          channelId: "blog_027",
          channel: "네이버블로그",
          updatedAt: "2025-12-25T10:00:00.000Z",
          isRejected: false,
          isLate: false,
          profileImage: "/images/test_img/eximg.png",
          actionType: 4, // 링크만
        },
      ],
      completed: [
        {
          id: "content_mission_3_completed_001",
          createdAt: "2025-12-23T08:00:00.000Z",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "선정된홈데코리뷰어1",
          channelId: "blog_028",
          channel: "네이버블로그",
          updatedAt: "2025-12-24T09:00:00.000Z",
          isLate: false,
          profileImage: "/images/test_img/eximg3.png",
          actionType: 4, // 링크만
        },
      ],
    },
  },
  // mission_4: 패션 미션형
  {
    ...missionCampaigns[3],
    applicantData: {
      applicants: [
        {
          id: "app_mission_4_인스타그램_001",
          Id: "reviewer_mission_4_001",
          nickname: "패션리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 130,
          totalVisits: 380000,
          neighbors: 950,
          memo: "패션 제품 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "인스타그램",
          registrationDate: "2025-12-25",
        },
        {
          id: "app_mission_4_인스타그램_002",
          Id: "reviewer_mission_4_002",
          nickname: "스타일링전문가B",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 170,
          totalVisits: 520000,
          neighbors: 1300,
          memo: "패션 스타일링 리뷰를 많이 작성합니다.",
          selectionStatus: "미선택" as const,
          channel: "인스타그램",
          registrationDate: "2025-12-26",
        },
      ],
      selectedApplicants: [],
    },
  },
  // mission_5: 식품 미션형
  {
    ...missionCampaigns[4],
    applicantData: {
      applicants: [
        {
          id: "app_mission_5_쿠팡_001",
          Id: "reviewer_mission_5_001",
          nickname: "식품리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 100,
          totalVisits: 300000,
          neighbors: 750,
          memo: "식품 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "쿠팡",
          registrationDate: "2025-12-10",
        },
      ],
      selectedApplicants: [],
    },
  },
  // mission_6: 디지털 미션형
  {
    ...missionCampaigns[5],
    applicantData: {
      applicants: [
        {
          id: "app_mission_6_네이버쇼핑_001",
          Id: "reviewer_mission_6_001",
          nickname: "디지털리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 160,
          totalVisits: 480000,
          neighbors: 1100,
          memo: "디지털 제품 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버쇼핑",
          registrationDate: "2025-12-19",
        },
        {
          id: "app_mission_6_네이버쇼핑_002",
          Id: "reviewer_mission_6_002",
          nickname: "테크인플루언서B",
          userType: "인플루언서" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 240,
          totalVisits: 720000,
          neighbors: 1900,
          memo: "테크 제품 전문 인플루언서입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버쇼핑",
          registrationDate: "2025-12-20",
        },
        {
          id: "app_mission_6_네이버쇼핑_003",
          Id: "reviewer_mission_6_003",
          nickname: "디지털전문가C",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 190,
          totalVisits: 570000,
          neighbors: 1400,
          memo: "디지털 기기 리뷰를 자주 작성합니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버쇼핑",
          registrationDate: "2025-12-21",
        },
      ],
      selectedApplicants: [
        {
          id: "sel_mission_6_네이버쇼핑_001",
          Id: "selected_mission_6_001",
          nickname: "선정된디지털리뷰어1",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 310,
          totalVisits: 930000,
          neighbors: 2600,
          memo: "이미 선정된 우수 리뷰어입니다.",
          selectionStatus: "선정하기" as const,
          channel: "네이버쇼핑",
          registrationDate: "2025-12-19",
        },
      ],
    },
    contents: {
      waiting: [
        {
          id: "content_mission_6_waiting_001",
          createdAt: "2025-12-20T10:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "디지털리뷰어A",
          channelId: "shopping_001",
          channel: "네이버쇼핑",
          profileImage: "/images/test_img/eximg.png",
          actionType: 2,
        },
        {
          id: "content_mission_6_waiting_002",
          createdAt: "2025-12-21T11:00:00.000Z",
          status: "검수" as const,
          userType: "인플루언서" as const,
          nickname: "테크인플루언서B",
          channelId: "shopping_002",
          channel: "네이버쇼핑",
          profileImage: "/images/test_img/eximg3.png",
          actionType: 3,
        },
      ],
      reviewing: [
        {
          id: "content_mission_6_reviewing_001",
          createdAt: "2025-12-19T09:00:00.000Z",
          status: "검수중" as const,
          userType: "리뷰어" as const,
          nickname: "디지털전문가C",
          channelId: "shopping_003",
          channel: "네이버쇼핑",
          updatedAt: "2025-12-20T10:00:00.000Z",
          isRejected: false,
          isLate: false,
          profileImage: "/images/test_img/eximg.png",
          actionType: 2,
        },
      ],
      completed: [
        {
          id: "content_mission_6_completed_001",
          createdAt: "2025-12-18T08:00:00.000Z",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "선정된디지털리뷰어1",
          channelId: "shopping_004",
          channel: "네이버쇼핑",
          updatedAt: "2025-12-19T09:00:00.000Z",
          isLate: false,
          profileImage: "/images/test_img/eximg3.png",
          actionType: 2,
        },
        {
          id: "content_mission_6_completed_002",
          createdAt: "2025-12-18T10:00:00.000Z",
          status: "완료" as const,
          userType: "인플루언서" as const,
          nickname: "지각제출디지털인플루언서",
          channelId: "shopping_005",
          channel: "네이버쇼핑",
          updatedAt: "2025-12-21T17:37:00.000Z",
          isLate: true,
          profileImage: "/images/test_img/eximg.png",
          actionType: 2,
        },
      ],
    },
  },
  // mission_7: 반려동물 미션형
  {
    ...missionCampaigns[6],
    applicantData: {
      applicants: [
        {
          id: "app_mission_7_네이버블로그_001",
          Id: "reviewer_mission_7_001",
          nickname: "반려동물리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 280,
          totalVisits: 840000,
          neighbors: 2300,
          memo: "반려동물 용품 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-28",
        },
        {
          id: "app_mission_7_네이버블로그_002",
          Id: "reviewer_mission_7_002",
          nickname: "펫인플루언서B",
          userType: "인플루언서" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 320,
          totalVisits: 960000,
          neighbors: 2700,
          memo: "반려동물 전문 인플루언서입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-29",
        },
      ],
      selectedApplicants: [],
    },
    contents: {
      waiting: [
        {
          id: "content_mission_7_waiting_001",
          createdAt: "2025-12-28T10:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "반려동물리뷰어A",
          channelId: "blog_018",
          channel: "네이버블로그",
          profileImage: "/images/test_img/eximg.png",
          actionType: 4, // 링크만 (contentType: "link")
        },
      ],
      reviewing: [
        {
          id: "content_mission_7_reviewing_001",
          createdAt: "2025-12-26T09:00:00.000Z",
          status: "검수중" as const,
          userType: "인플루언서" as const,
          nickname: "펫인플루언서B",
          channelId: "blog_019",
          channel: "네이버블로그",
          updatedAt: "2025-12-27T10:00:00.000Z",
          isRejected: false,
          isLate: false,
          profileImage: "/images/test_img/eximg3.png",
          actionType: 4, // 링크만 (contentType: "link")
        },
      ],
      completed: [
        {
          id: "content_mission_7_completed_001",
          createdAt: "2025-12-24T08:00:00.000Z",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "반려동물전문가C",
          channelId: "blog_020",
          channel: "네이버블로그",
          updatedAt: "2025-12-25T09:00:00.000Z",
          isLate: false,
          profileImage: "/images/test_img/eximg.png",
          actionType: 4, // 링크만 (contentType: "link")
        },
      ],
    },
  },
  // mission_8: 스포츠 미션형
  {
    ...missionCampaigns[7],
    applicantData: {
      applicants: [
        {
          id: "app_mission_8_유튜브_001",
          Id: "reviewer_mission_8_001",
          nickname: "스포츠리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 150,
          totalVisits: 450000,
          neighbors: 1100,
          memo: "스포츠 용품 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "유튜브",
          registrationDate: "2025-12-12",
        },
      ],
      selectedApplicants: [],
    },
  },
  // mission_9: 뷰티 미션형
  {
    ...missionCampaigns[8],
    applicantData: {
      applicants: [
        {
          id: "app_mission_9_올리브영_001",
          Id: "reviewer_mission_9_001",
          nickname: "뷰티리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 180,
          totalVisits: 540000,
          neighbors: 1500,
          memo: "뷰티 제품 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "올리브영",
          registrationDate: "2025-12-30",
        },
        {
          id: "app_mission_9_올리브영_002",
          Id: "reviewer_mission_9_002",
          nickname: "뷰티인플루언서B",
          userType: "인플루언서" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 260,
          totalVisits: 780000,
          neighbors: 2100,
          memo: "뷰티 제품 전문 인플루언서입니다.",
          selectionStatus: "미선택" as const,
          channel: "올리브영",
          registrationDate: "2025-12-31",
        },
      ],
      selectedApplicants: [],
    },
    contents: {
      waiting: [
        // 1. 콘텐츠 미등록 (이미지+링크)
        {
          id: "content_mission_9_waiting_001",
          createdAt: "2025-12-30T10:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "뷰티리뷰어A",
          channelId: "olive_001",
          channel: "올리브영",
          profileImage: "/images/test_img/eximg.png",
          actionType: 2, // 이미지+링크 (contentType: "both")
        },
        // 2. 등록 기한 연장 요청 (이미지+링크)
        {
          id: "content_mission_9_waiting_002",
          createdAt: "2025-12-31T11:00:00.000Z",
          status: "검수" as const,
          userType: "인플루언서" as const,
          nickname: "뷰티인플루언서B",
          channelId: "olive_002",
          channel: "올리브영",
          profileImage: "/images/test_img/eximg3.png",
          actionType: 2, // 이미지+링크 (contentType: "both")
          extension_request_reason:
            "개인 사정으로 인해 등록 기한을 연장해주시면 감사하겠습니다.",
        },
        // 3. 연장 승인 후 아직 등록 안함 (이미지+링크)
        {
          id: "content_mission_9_waiting_003",
          createdAt: "2025-12-29T09:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "뷰티리뷰어C",
          channelId: "olive_003",
          channel: "올리브영",
          profileImage: "/images/test_img/eximg.png",
          actionType: 2, // 이미지+링크 (contentType: "both")
          isExtensionApproved: true,
          extendedDeadline: "2026-01-20",
        },
        // 4. 반려 처리 (이미지+링크)
        {
          id: "content_mission_9_waiting_004",
          createdAt: "2025-12-28T08:00:00.000Z",
          status: "검수" as const,
          userType: "인플루언서" as const,
          nickname: "뷰티인플루언서D",
          channelId: "olive_004",
          channel: "올리브영",
          profileImage: "/images/test_img/eximg3.png",
          actionType: 2, // 이미지+링크 (contentType: "both")
          isRejected: true,
          reject_reason:
            "제품 사용 사진이 부족하고 리뷰 내용이 너무 간단합니다. 더 상세한 체험 후기를 작성해주세요.",
        },
        // 5. 신고 처리 (이미지+링크)
        {
          id: "content_mission_9_waiting_005",
          createdAt: "2025-12-27T07:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "뷰티리뷰어E",
          channelId: "olive_005",
          channel: "올리브영",
          profileImage: "/images/test_img/eximg.png",
          actionType: 2, // 이미지+링크 (contentType: "both")
          isReported: true,
          reportedDate: "2025-12-27 14:30",
        },
      ],
      reviewing: [
        // 1. 최초 등록 (이미지+링크)
        {
          id: "content_mission_9_reviewing_001",
          createdAt: "2025-12-28T09:00:00.000Z",
          status: "검수중" as const,
          userType: "리뷰어" as const,
          nickname: "뷰티전문가F",
          channelId: "olive_006",
          channel: "올리브영",
          updatedAt: undefined, // 최초 등록
          isRejected: false,
          isLate: false,
          profileImage: "/images/test_img/eximg.png",
          actionType: 2, // 이미지+링크 (contentType: "both")
        },
        // 2. 수정 (이미지+링크)
        {
          id: "content_mission_9_reviewing_002",
          createdAt: "2025-12-27T08:00:00.000Z",
          status: "검수중" as const,
          userType: "인플루언서" as const,
          nickname: "뷰티인플루언서G",
          channelId: "olive_007",
          channel: "올리브영",
          updatedAt: "2025-12-29T10:00:00.000Z", // 수정됨
          isRejected: false,
          isLate: false,
          profileImage: "/images/test_img/eximg3.png",
          actionType: 2, // 이미지+링크 (contentType: "both")
        },
        // 3. 지각 등록 (이미지+링크)
        {
          id: "content_mission_9_reviewing_003",
          createdAt: "2025-12-26T07:00:00.000Z",
          status: "검수중" as const,
          userType: "리뷰어" as const,
          nickname: "뷰티리뷰어H",
          channelId: "olive_008",
          channel: "올리브영",
          updatedAt: "2025-12-30T11:00:00.000Z", // 지각 등록
          isRejected: false,
          isLate: true, // 지각 등록
          profileImage: "/images/test_img/eximg.png",
          actionType: 2, // 이미지+링크 (contentType: "both")
        },
      ],
      completed: [
        // 1. 확인 완료 (이미지+링크)
        {
          id: "content_mission_9_completed_001",
          createdAt: "2025-12-26T08:00:00.000Z",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "뷰티리뷰어I",
          channelId: "olive_009",
          channel: "올리브영",
          updatedAt: "2025-12-27T09:00:00.000Z",
          isLate: false,
          profileImage: "/images/test_img/eximg3.png",
          actionType: 2, // 이미지+링크 (contentType: "both")
        },
        // 2. 확인 완료 (이미지+링크)
        {
          id: "content_mission_9_completed_002",
          createdAt: "2025-12-25T07:00:00.000Z",
          status: "완료" as const,
          userType: "인플루언서" as const,
          nickname: "뷰티인플루언서J",
          channelId: "olive_010",
          channel: "올리브영",
          updatedAt: "2025-12-26T08:00:00.000Z",
          isLate: false,
          profileImage: "/images/test_img/eximg.png",
          actionType: 2, // 이미지+링크 (contentType: "both")
        },
        // 3. 확인 완료 (이미지+링크)
        {
          id: "content_mission_9_completed_003",
          createdAt: "2025-12-24T06:00:00.000Z",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "뷰티리뷰어K",
          channelId: "olive_011",
          channel: "올리브영",
          updatedAt: "2025-12-25T07:00:00.000Z",
          isLate: false,
          profileImage: "/images/test_img/eximg3.png",
          actionType: 2, // 이미지+링크 (contentType: "both")
        },
      ],
    },
  },
  // mission_10: 여행 미션형
  {
    ...missionCampaigns[9],
    applicantData: {
      applicants: [
        {
          id: "app_mission_10_인스타그램_001",
          Id: "reviewer_mission_10_001",
          nickname: "여행리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 140,
          totalVisits: 420000,
          neighbors: 1000,
          memo: "여행 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "인스타그램",
          registrationDate: "2025-12-08",
        },
      ],
      selectedApplicants: [],
    },
  },
  // mission_11: 프리미엄 스킨케어 세트 미션형
  {
    ...missionCampaigns[11],
    applicantData: {
      applicants: [],
      selectedApplicants: [],
    },
  },
];

/**
 * 미션형 캠페인의 콘텐츠 데이터를 조회하는 함수
 *
 * 설명:
 * - 캠페인 ID를 받아서 해당 캠페인의 콘텐츠(검수 중/완료)를 반환합니다.
 * - 종료/취소된 캠페인과 진행 중인 캠페인 모두 지원합니다.
 *
 * @param campaignId - 조회할 캠페인의 ID
 * @returns 검수 중/완료된 콘텐츠를 담은 객체
 */
export function getMissionContentsById(campaignId: string): ContentByTab {
  // 진행 중인 캠페인에서 찾기
  const campaign = missionCampaignsExtended.find((c) => c.id === campaignId);
  if (campaign?.contents) {
    return {
      waiting: campaign.contents.waiting || [],
      reviewing: campaign.contents.reviewing || [],
      completed: campaign.contents.completed || [],
    };
  }

  // 콘텐츠가 없는 경우 빈 배열 반환
  return { waiting: [], reviewing: [], completed: [] };
}

/**
 * 미션형 캠페인 헬퍼 함수들
 */

/**
 * 새 캠페인 ID 생성
 *
 * @returns 새로운 캠페인 ID (mission_X 형식)
 */
function generateNewMissionCampaignId(): string {
  // 기존 캠페인 ID 중 최대값 찾기
  const allCampaigns = [...missionCampaignsExtended];

  // localStorage에 저장된 캠페인도 확인
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("missionCampaigns");
      if (stored) {
        const storedCampaigns: Array<{ campaignInfo: { id: string } }> =
          JSON.parse(stored);
        if (Array.isArray(storedCampaigns)) {
          storedCampaigns.forEach((campaign) => {
            if (campaign.campaignInfo && campaign.campaignInfo.id) {
              allCampaigns.push({
                id: campaign.campaignInfo.id,
              } as any);
            }
          });
        }
      }
    } catch (error) {
      console.error("localStorage에서 미션형 캠페인 ID 확인 실패:", error);
    }
  }

  const existingIds = allCampaigns
    .map((c) => {
      const match = c.id.match(/mission_(\d+)/);
      return match ? parseInt(match[1]) : 0;
    })
    .filter((id) => id > 0);
  const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 10;

  return `mission_${maxId + 1}`;
}

/**
 * 폼 데이터를 CampaignWithApplicants 형태로 변환하여 새 캠페인 생성
 *
 * @param formData - 폼에서 입력받은 캠페인 데이터
 * @param imageUrl - 업로드된 이미지 URL
 * @returns 새로 생성된 CampaignWithApplicants 객체
 */
export function createMissionCampaign(
  formData: CampaignFormData,
  imageUrl: string = "/images/main/campaign_img/eximg_4.png"
): CampaignWithApplicants {
  // 새 캠페인 ID 생성
  const newId = generateNewMissionCampaignId();

  // 선정 날짜까지 남은 일수 계산
  const daysLeft = formData.announcementDate
    ? calculateDaysLeft(formData.announcementDate.split(" ")[0])
    : 0;

  // 모집 인원을 숫자로 변환
  const totalCount = Number(formData.recruitmentCount) || 0;

  // 캠페인 상태 결정 함수 호출
  // registrationPeriod를 전달하여 등록 기간 종료일 체크가 정확하게 이루어지도록 함
  const calculatedStatus = calculateCampaignStatus(
    formData.recruitmentPeriod,
    formData.announcementDate,
    formData.registrationPeriod
  );

  // calculateCampaignStatus는 "대기 중" | "모집 중" | "진행 중" | "종료"를 반환
  // "종료" 상태를 "마감"으로 변환 (UI 표시용)
  let finalStatus: string = calculatedStatus;
  if (calculatedStatus === "종료") {
    finalStatus = "마감";
  } else if (calculatedStatus === "진행 중") {
    // 미션형 캠페인의 경우 "진행 중" 상태를 "등록 중"으로 표시
    finalStatus = "등록 중";
  }

  // 플랫폼명 정규화
  const normalizedBrandName = formData.platform
    ? formData.platform.replace(/\s+/g, "")
    : "네이버블로그";

  // 날짜 파싱
  const recruitmentPeriod = formData.recruitmentPeriod || "";
  const [applicationStart, applicationEnd] = recruitmentPeriod
    .split(" ~ ")
    .map((d) => d.trim());

  return {
    campaignInfo: {
      id: newId,
      title: formData.title,
      image: imageUrl,
      status:
        finalStatus === "대기 중"
          ? "대기 중"
          : finalStatus === "모집 중"
          ? "모집 중"
          : finalStatus === "마감"
          ? "마감"
          : "등록 중",
      campaignType: "미션형",
      category: formData.category || "기타",
      brandName: normalizedBrandName,
      recruitmentPeriod: recruitmentPeriod,
      announcementDate: formData.announcementDate || "",
      registrationPeriod: formData.registrationPeriod || "",
      recruitedCount: 0,
      totalCount: totalCount,
      daysLeft: daysLeft,
    },
    applicantData: {
      applicants: [],
      selectedApplicants: [],
    },
  };
}

/**
 * 미션형 캠페인 수정
 *
 * @param campaignId - 수정할 캠페인 ID
 * @param formData - 폼에서 입력받은 캠페인 데이터
 * @param imageUrl - 업로드된 이미지 URL
 * @returns 수정된 CampaignWithApplicants 객체
 */
export function updateMissionCampaign(
  campaignId: string,
  formData: CampaignFormData,
  imageUrl: string = "/images/main/campaign_img/eximg_4.png"
): CampaignWithApplicants {
  // 기존 캠페인 데이터 찾기 (sharedCampaigns에서)
  const { getCampaignById } = require("@/data/partner/sharedCampaigns");
  const existingCampaign = getCampaignById(campaignId);

  // 기존 신청자 데이터 유지
  const existingApplicantData = existingCampaign?.applicantData || {
    applicants: [],
    selectedApplicants: [],
  };

  // 선정 날짜까지 남은 일수 계산
  const daysLeft = formData.announcementDate
    ? calculateDaysLeft(formData.announcementDate.split(" ")[0])
    : 0;

  // 모집 인원을 숫자로 변환
  const totalCount = Number(formData.recruitmentCount) || 0;

  // 캠페인 상태 결정 함수 호출
  // registrationPeriod를 전달하여 등록 기간 종료일 체크가 정확하게 이루어지도록 함
  const calculatedStatus = calculateCampaignStatus(
    formData.recruitmentPeriod,
    formData.announcementDate,
    formData.registrationPeriod
  );

  // calculateCampaignStatus는 "대기 중" | "모집 중" | "진행 중" | "종료"를 반환
  // "종료" 상태를 "마감"으로 변환 (UI 표시용)
  let finalStatus: string = calculatedStatus;
  if (calculatedStatus === "종료") {
    finalStatus = "마감";
  } else if (calculatedStatus === "진행 중") {
    // 미션형 캠페인의 경우 "진행 중" 상태를 "등록 중"으로 표시
    finalStatus = "등록 중";
  }

  // 플랫폼명 정규화
  const normalizedBrandName = formData.platform
    ? formData.platform.replace(/\s+/g, "")
    : "네이버블로그";

  return {
    campaignInfo: {
      id: campaignId,
      title: formData.title,
      image: imageUrl,
      status:
        finalStatus === "대기 중"
          ? "대기 중"
          : finalStatus === "모집 중"
          ? "모집 중"
          : finalStatus === "마감"
          ? "마감"
          : "등록 중",
      campaignType: "미션형",
      category: formData.category || "기타",
      brandName: normalizedBrandName,
      recruitmentPeriod: formData.recruitmentPeriod || "",
      announcementDate: formData.announcementDate || "",
      registrationPeriod: formData.registrationPeriod || "",
      recruitedCount: existingApplicantData?.applicants?.length ?? 0,
      totalCount: totalCount,
      daysLeft: daysLeft,
    },
    applicantData: existingApplicantData,
  };
}

/**
 * 새 미션형 캠페인 추가
 *
 * @param formData - 폼에서 입력받은 캠페인 데이터
 * @param imageUrl - 업로드된 이미지 URL
 * @returns 새로 생성된 CampaignWithApplicants 객체
 */
export function addMissionCampaign(
  formData: CampaignFormData,
  imageUrl: string = "/images/main/campaign_img/eximg_4.png"
): CampaignWithApplicants {
  return createMissionCampaign(formData, imageUrl);
}
