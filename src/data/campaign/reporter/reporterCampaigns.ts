/**
 * 기자단 캠페인 데이터 타입 정의
 */

import type { CampaignFormData } from "@/types/domain/user";
import type {
  ContentByTab,
  CampaignWithApplicants,
} from "@/data/partner/sharedCampaigns";
import { calculateDaysLeft, calculateCampaignStatus } from "../delivery/utils";

export interface ReporterCampaignData {
  id: string; // 캠페인 고유 식별자
  title: string; // 캠페인 제목
  category: string; // 캠페인 카테고리 (기자단)
  image: string; // 메인 캠페인 이미지 경로
  subcategory: string; // 세부 카테고리 (생활, 뷰티, 제품 등)
  points: number; // 지급 포인트(포인트)
  description: string; // 제품 설명 및 제공 영역
  recruitment: {
    current: number; // 현재 지원자 수
    total: number; // 총 모집 인원
  };
  schedule: string; // 날짜/시간 형식 일정 (예: "1/25 (월) 10:00\n모집 오픈")
  dayCount: string; // 남은 일수 형식 (예: "D-6")
  isUrgent?: boolean; // 긴급 캠페인 여부 (기본값: false)
  registeredAt?: string; // 캠페인 등록 시간 (ISO 8601 형식: "2025-01-15T10:30:00")
  detailedSchedule: {
    applicationStart: string; // 신청 시작일시
    applicationEnd: string; // 신청 마감일시
    announcement: string; // 선정 발표일시
    registrationPeriod: string; // 등록 기간
  };
  campaign_detail_image: string; // 캠페인 상세 이미지 경로 (첫 번째 이미지, 하위 호환성)
  campaign_detail_images?: string[]; // 캠페인 상세 이미지 경로 배열 (여러 이미지)
  channel: string; // 채널 정보 (블로그, 인스타그램, 유튜브 등)
  keyword: string; // 캠페인 키워드
  productLink?: string; // 제품링크 (선택)
  requirements: string[]; // 캠페인별 필수사항 코드 목록
  guidelineTexts: string[]; // 유의사항 텍스트 목록
  // 참여/제출 옵션
  adultOnly?: boolean; // 만 19세 이상 참여 허용
  allowReParticipation?: boolean; // 이전 참여자 재참여 허용
  allowLateSubmission?: boolean; // 지각 제출 허용
  // 문의 담당자 정보
  contactPhone?: string; // 문의 담당자 휴대폰 번호
}

/**
 * 기자단 캠페인 데이터
 * 기자단 페이지에서 사용되는 전용 데이터
 */
export const reporterCampaigns: ReporterCampaignData[] = [
  // reporter_1: 예정 탭 - 모집 기간 시작 전
  {
    id: "3001",
    title: "테크 기자단",
    category: "기자단",
    image: "/images/main/campaign_img/eximg_1.png",
    subcategory: "IT/기술",
    points: 80000,
    description: "최신 IT 기술 리뷰 기자단 모집",
    recruitment: {
      current: 45,
      total: 3,
    },
    schedule: "",
    dayCount: "D-5",
    registeredAt: "2025-12-15T09:30:00.000Z", // 등록 시간
    detailedSchedule: {
      // 모집 중 - 현재 모집 진행 중
      applicationStart: "2026-01-22",
      applicationEnd: "2026-02-08",
      announcement: "2026-02-10",
      registrationPeriod: "2026-02-12 ~ 2026-02-19",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "유튜브",
    keyword: "#테크기자단 #IT리뷰 #기술리포팅 #유튜브 #전문리뷰",
    productLink: "https://example.com/tech-product",
    requirements: [
      "text_3000",
      "photo_25",
      "video_2_600",
      "product_link",
      "keyword",
    ],
    guidelineTexts: [
      "기자단 캠페인 작성시 아래의 내용을 참고하여 작성 진행해 주세요.",
      "★기자단 활동의 전문적이고 객관적인 각도로 작성해주세요!! IT 기술 분야에서는 깊이있는 지식과 경험을 바탕으로 작성해주세요.",
      "★제공된 기자단 활동을 모두 활용하여 작성해주세요 - 전문적인 IT 리포팅 내용 - 최신 기술 트렌드 분석 포함 - 쉽게 이해할 기술 정보 제공 - 객관적이고 정확한 정보 전달<br />★기자단 리포팅은 전문적이고 객관적인 요청대로 작성 부탁드립니다★<br />★활동적인 실제 제품 경험하는 모습과 기술 테스트 과정 진 수 첨부해주세요★<br />★기자단 활동의 정확하고 객관적인 정보를 전문적으로 작성해주세요★",
      "★기자단 캠페인입니다★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [기자단]으로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 기자단 활동 시작해주세요<br /> 3. 기간 내 리포팅 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★기자단 리포팅 작성 시에는 전문적이고 객관적인 정보를 작성해주세요<br /> ★ [본인이 직접 경험하고 분석한 IT 기술 제품에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 기자단에게 있는 점 주의 부탁드립니다 <br /> - 활동 불가 및 활동 착오의 경우 : 페이백 미지급 및 선정취소 <br /> - 리포팅 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 전문적인 장비로 촬영해주세요 (4K 화상 권장) - 성의없는 리포팅은 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 기자단 활동 정보를 정확하게 기재해주세요 (기술 스펙, 테스트 환경, 사용 시간 등<br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리포팅 등록기간 내 리포팅 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리포팅 등록기간 필수로 지켜주시기 바랍니다. <br />- 기자단의 경우 기술 분석과 함께 관련 정보, 참고 자료, 비교 분석 등을 기재해주세요. <br />- 기자단 캠페인의 경우 전문적인 IT 리포팅을 작성해주세요",
    ],
  },
  // reporter_2: 연장요청 탭
  {
    id: "3002",
    title: "뷰티 기자단",
    category: "기자단",
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
    registeredAt: "2026-01-08T11:15:00.000Z", // 등록 시간
    detailedSchedule: {
      // 오픈 예정 - 모집 시작 전
      applicationStart: "2026-02-10",
      applicationEnd: "2026-02-24",
      announcement: "2026-02-26",
      registrationPeriod: "2026-02-28 ~ 2026-03-15",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "인스타그램",
    keyword: "#뷰티기자단 #트렌드리뷰 #뷰티트렌드 #인스타그램 #전문리뷰",
    productLink: "https://example.com/beauty-product",
    requirements: [
      "text_2000",
      "photo_15",
      "video_report",
      "product_link",
      "keyword",
    ],
    guidelineTexts: [
      "기자단 캠페인 작성시 아래의 내용을 참고하여 작성 진행해 주세요.",
      "★기자단 활동의 전문적이고 객관적인 각도로 작성해주세요!! 뷰티 분야에서는 깊이있는 지식과 경험을 바탕으로 작성해주세요.",
      "★제공된 기자단 활동을 모두 활용하여 작성해주세요 - 전문적인 뷰티 리포팅 내용 - 최신 뷰티 트렌드 분석 포함 - 쉽게 이해할 뷰티 정보 제공 - 객관적이고 정확한 제품 분석<br />★기자단 리포팅은 전문적이고 객관적인 요청대로 작성 부탁드립니다★<br />★활동적인 실제 제품 경험하는 모습과 제품 테스트 과정 진 수 첨부해주세요★<br />★기자단 활동의 정확하고 객관적인 정보를 전문적으로 작성해주세요★",
      "★기자단 캠페인입니다★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [기자단]으로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 기자단 활동 시작해주세요<br /> 3. 기간 내 리포팅 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★기자단 리포팅 작성 시에는 전문적이고 객관적인 정보를 작성해주세요<br /> ★ [본인이 직접 경험하고 분석한 뷰티 제품에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 기자단에게 있는 점 주의 부탁드립니다 <br /> - 활동 불가 및 활동 착오의 경우 : 페이백 미지급 및 선정취소 <br /> - 리포팅 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 전문적인 장비로 촬영해주세요 (고화질 권장) - 성의없는 리포팅은 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 기자단 활동 정보를 정확하게 기재해주세요 (제품 성분, 사용 후 효과 등<br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리포팅 등록기간 내 리포팅 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리포팅 등록기간 필수로 지켜주시기 바랍니다. <br />- 기자단의 경우 뷰티 분석과 함께 관련 정보, 참고 자료, 비교 분석 등을 기재해주세요. <br />- 기자단 캠페인의 경우 전문적인 뷰티 리포팅을 작성해주세요",
    ],
  },
  // reporter_3: 신청 탭
  {
    id: "3003",
    title: "패션 기자단",
    category: "기자단",
    image: "/images/main/campaign_img/eximg_3.png",
    subcategory: "패션",
    points: 70000,
    description: "패션 트렌드 리포팅 기자단",
    recruitment: {
      current: 56,
      total: 4,
    },
    schedule: "",
    dayCount: "",
    isUrgent: true, // 긴급 캠페인
    registeredAt: "2026-01-06T13:45:00.000Z", // 등록 시간
    detailedSchedule: {
      // 모집 중 - 현재 모집 진행 중
      applicationStart: "2026-01-04",
      applicationEnd: "2026-01-17",
      announcement: "2026-01-19",
      registrationPeriod: "2026-01-21 ~ 2026-01-28",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "네이버블로그",
    keyword: "#패션기자단 #패션트렌드 #패션리뷰 #블로그 #전문리뷰",
    requirements: [
      "text_1500",
      "photo_12",
      "video_report",
      "product_link",
      "keyword",
    ],
    guidelineTexts: [
      "기자단 캠페인 작성시 아래의 내용을 참고하여 작성 진행해 주세요.",
      "★기자단 활동의 전문적이고 객관적인 각도로 작성해주세요!! 패션 분야에서는 깊이있는 지식과 경험을 바탕으로 작성해주세요.",
      "★제공된 기자단 활동을 모두 활용하여 작성해주세요 - 전문적인 패션 리포팅 내용 - 최신 패션 트렌드 분석 포함 - 쉽게 이해할 패션 정보 제공 - 객관적이고 정확한 제품 분석<br />★기자단 리포팅은 전문적이고 객관적인 요청대로 작성 부탁드립니다★<br />★활동적인 실제 제품 경험하는 모습과 제품 테스트 과정 진 수 첨부해주세요★<br />★기자단 활동의 정확하고 객관적인 정보를 전문적으로 작성해주세요★",
      "★기자단 캠페인입니다★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [기자단]으로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 기자단 활동 시작해주세요<br /> 3. 기간 내 리포팅 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★기자단 리포팅 작성 시에는 전문적이고 객관적인 정보를 작성해주세요<br /> ★ [본인이 직접 경험하고 분석한 패션 제품에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 기자단에게 있는 점 주의 부탁드립니다 <br /> - 활동 불가 및 활동 착오의 경우 : 페이백 미지급 및 선정취소 <br /> - 리포팅 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 전문적인 장비로 촬영해주세요 (고화질 권장) - 성의없는 리포팅은 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 기자단 활동 정보를 정확하게 기재해주세요 (제품 재질, 사이즈, 착용 후기 등<br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리포팅 등록기간 내 리포팅 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리포팅 등록기간 필수로 지켜주시기 바랍니다. <br />- 기자단의 경우 패션 분석과 함께 관련 정보, 참고 자료, 비교 분석 등을 기재해주세요. <br />- 기자단 캠페인의 경우 전문적인 패션 리포팅을 작성해주세요",
    ],
  },
  // reporter_4: 예정 탭
  {
    id: "3004",
    title: "푸드 기자단",
    category: "기자단",
    image: "/images/main/campaign_img/eximg_4.png",
    subcategory: "제품",
    points: 65000,
    description: "맛집 및 제품 리포팅 기자단",
    recruitment: {
      current: 89,
      total: 6,
    },
    schedule: "",
    dayCount: "D-7",
    registeredAt: "2026-01-09T13:30:00.000Z", // 등록 시간
    detailedSchedule: {
      // 모집 중 - 현재 날짜 기준 (2026-01-11 ~ 2026-01-24)
      applicationStart: "2026-01-11",
      applicationEnd: "2026-01-24",
      announcement: "2026-01-26",
      registrationPeriod: "2026-01-29 ~ 2026-02-06",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "네이버블로그",
    keyword: "#푸드기자단 #맛집리뷰 #제품리뷰 #블로그 #전문리뷰",
    requirements: [
      "text_1800",
      "photo_15",
      "video_report",
      "product_link",
      "keyword",
    ],
    guidelineTexts: [
      "기자단 캠페인 작성시 아래의 내용을 참고하여 작성 진행해 주세요.",
      "★기자단 활동의 전문적이고 객관적인 각도로 작성해주세요!! 푸드 분야에서는 깊이있는 지식과 경험을 바탕으로 작성해주세요.",
      "★제공된 기자단 활동을 모두 활용하여 작성해주세요 - 전문적인 푸드 리포팅 내용 - 최신 푸드 트렌드 분석 포함 - 쉽게 이해할 푸드 정보 제공 - 객관적이고 정확한 맛 분석<br />★기자단 리포팅은 전문적이고 객관적인 요청대로 작성 부탁드립니다★<br />★활동적인 실제 제품 경험하는 모습과 식사 체험 과정 진 수 첨부해주세요★<br />★기자단 활동의 정확하고 객관적인 정보를 전문적으로 작성해주세요★",
      "★기자단 캠페인입니다★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [기자단]으로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 기자단 활동 시작해주세요<br /> 3. 기간 내 리포팅 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★기자단 리포팅 작성 시에는 전문적이고 객관적인 정보를 작성해주세요<br /> ★ [본인이 직접 경험하고 분석한 푸드에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 기자단에게 있는 점 주의 부탁드립니다 <br /> - 활동 불가 및 활동 착오의 경우 : 페이백 미지급 및 선정취소 <br /> - 리포팅 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 전문적인 장비로 촬영해주세요 (고화질 권장) - 성의없는 리포팅은 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 기자단 활동 정보를 정확하게 기재해주세요 (식사 가격, 조리 방법, 맛 평가 등<br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리포팅 등록기간 내 리포팅 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리포팅 등록기간 필수로 지켜주시기 바랍니다. <br />- 기자단의 경우 푸드 분석과 함께 관련 정보, 참고 자료, 비교 분석 등을 기재해주세요. <br />- 기자단 캠페인의 경우 전문적인 푸드 리포팅을 작성해주세요",
    ],
  },
  // reporter_5: 종료 탭
  {
    id: "3005",
    title: "여행 기자단",
    category: "기자단",
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
    registeredAt: "2025-10-28T10:00:00.000Z", // 등록 시간
    detailedSchedule: {
      // 종료 탭 - registrationPeriod가 과거
      applicationStart: "2026-01-25",
      applicationEnd: "2026-02-10",
      announcement: "2025-11-17",
      registrationPeriod: "2025-11-20 ~ 2026-02-27",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "유튜브",
    keyword: "#여행기자단 #여행리뷰 #여행정보 #유튜브 #전문리뷰",
    requirements: [
      "text_2000",
      "photo_20",
      "video_report",
      "product_link",
      "keyword",
    ],
    guidelineTexts: [
      "기자단 캠페인 작성시 아래의 내용을 참고하여 작성 진행해 주세요.",
      "★기자단 활동의 전문적이고 객관적인 각도로 작성해주세요!! 여행 분야에서는 깊이있는 지식과 경험을 바탕으로 작성해주세요.",
      "★제공된 기자단 활동을 모두 활용하여 작성해주세요 - 전문적인 여행 리포팅 내용 - 최신 여행 트렌드 분석 포함 - 쉽게 이해할 여행 정보 제공 - 객관적이고 정확한 여행지 분석<br />★기자단 리포팅은 전문적이고 객관적인 요청대로 작성 부탁드립니다★<br />★활동적인 실제 제품 경험하는 모습과 여행 체험 과정 진 수 첨부해주세요★<br />★기자단 활동의 정확하고 객관적인 정보를 전문적으로 작성해주세요★",
      "★기자단 캠페인입니다★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [기자단]으로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 기자단 활동 시작해주세요<br /> 3. 기간 내 리포팅 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★기자단 리포팅 작성 시에는 전문적이고 객관적인 정보를 작성해주세요<br /> ★ [본인이 직접 경험하고 분석한 여행지에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 기자단에게 있는 점 주의 부탁드립니다 <br /> - 활동 불가 및 활동 착오의 경우 : 페이백 미지급 및 선정취소 <br /> - 리포팅 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 전문적인 장비로 촬영해주세요 (4K 화상 권장) - 성의없는 리포팅은 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 기자단 활동 정보를 정확하게 기재해주세요 (여행 일정, 교통편, 숙박 등<br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리포팅 등록기간 내 리포팅 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리포팅 등록기간 필수로 지켜주시기 바랍니다. <br />- 기자단의 경우 여행 분석과 함께 관련 정보, 참고 자료, 비교 분석 등을 기재해주세요. <br />- 기자단 캠페인의 경우 전문적인 여행 리포팅을 작성해주세요",
    ],
  },
  // reporter_6: 신청 탭
  {
    id: "3006",
    title: "라이프스타일 기자단",
    category: "기자단",
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
    registeredAt: "2026-01-07T15:20:00.000Z", // 등록 시간
    detailedSchedule: {
      // 모집 중 - 현재 날짜 기준 (2026-01-09 ~ 2026-01-25)
      applicationStart: "2026-01-09",
      applicationEnd: "2026-01-25",
      announcement: "2026-01-27",
      registrationPeriod: "2026-01-30 ~ 2026-02-07",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "인스타그램",
    keyword:
      "#라이프스타일기자단 #생활리뷰 #라이프트렌드 #인스타그램 #전문리뷰",
    requirements: [
      "text_1600",
      "photo_18",
      "video_report",
      "product_link",
      "keyword",
    ],
    guidelineTexts: [
      "기자단 캠페인 작성시 아래의 내용을 참고하여 작성 진행해 주세요.",
      "★기자단 활동의 전문적이고 객관적인 각도로 작성해주세요!! 라이프스타일 분야에서는 깊이있는 지식과 경험을 바탕으로 작성해주세요.",
      "★제공된 기자단 활동을 모두 활용하여 작성해주세요 - 전문적인 라이프스타일 리포팅 내용 - 최신 라이프스타일 트렌드 분석 포함 - 쉽게 이해할 생활 정보 제공 - 객관적이고 정확한 제품 분석<br />★기자단 리포팅은 전문적이고 객관적인 요청대로 작성 부탁드립니다★<br />★활동적인 실제 제품 경험하는 모습과 제품 테스트 과정 진 수 첨부해주세요★<br />★기자단 활동의 정확하고 객관적인 정보를 전문적으로 작성해주세요★",
      "★기자단 캠페인입니다★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [기자단]으로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 기자단 활동 시작해주세요<br /> 3. 기간 내 리포팅 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★기자단 리포팅 작성 시에는 전문적이고 객관적인 정보를 작성해주세요<br /> ★ [본인이 직접 경험하고 분석한 라이프스타일 제품에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 기자단에게 있는 점 주의 부탁드립니다 <br /> - 활동 불가 및 활동 착오의 경우 : 페이백 미지급 및 선정취소 <br /> - 리포팅 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 전문적인 장비로 촬영해주세요 (고화질 권장) - 성의없는 리포팅은 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 기자단 활동 정보를 정확하게 기재해주세요 (제품 기능, 사용 후 효과 등<br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리포팅 등록기간 내 리포팅 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리포팅 등록기간 필수로 지켜주시기 바랍니다. <br />- 기자단의 경우 라이프스타일 분석과 함께 관련 정보, 참고 자료, 비교 분석 등을 기재해주세요. <br />- 기자단 캠페인의 경우 전문적인 라이프스타일 리포팅을 작성해주세요",
    ],
  },
  // reporter_7: 진행 탭
  {
    id: "3007",
    title: "게임 기자단",
    category: "기자단",
    image: "/images/main/campaign_img/eximg_7.png",
    subcategory: "디지털",
    points: 70000,
    description: "게임 리뷰 및 플레이 리포팅 기자단",
    recruitment: {
      current: 45,
      total: 5,
    },
    schedule: "",
    dayCount: "D-2",
    registeredAt: "2025-11-10T09:15:00.000Z", // 등록 시간
    detailedSchedule: {
      // 진행 탭 - applicationEnd가 과거, registrationPeriod가 미래
      applicationStart: "2026-01-18",
      applicationEnd: "2026-02-05",
      announcement: "2025-12-02",
      registrationPeriod: "2025-12-05 ~ 2025-12-20",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "유튜브",
    keyword: "#게임기자단 #게임리뷰 #게임플레이 #유튜브 #전문리뷰",
    requirements: [
      "text_1700",
      "photo_16",
      "video_report",
      "product_link",
      "keyword",
    ],
    guidelineTexts: [
      "기자단 캠페인 작성시 아래의 내용을 참고하여 작성 진행해 주세요.",
      "★기자단 활동의 전문적이고 객관적인 각도로 작성해주세요!! 게임 분야에서는 깊이있는 지식과 경험을 바탕으로 작성해주세요.",
      "★제공된 기자단 활동을 모두 활용하여 작성해주세요 - 전문적인 게임 리포팅 내용 - 최신 게임 트렌드 분석 포함 - 쉽게 이해할 게임 정보 제공 - 객관적이고 정확한 게임 분석<br />★기자단 리포팅은 전문적이고 객관적인 요청대로 작성 부탁드립니다★<br />★활동적인 실제 제품 경험하는 모습과 게임 플레이 과정 진 수 첨부해주세요★<br />★기자단 활동의 정확하고 객관적인 정보를 전문적으로 작성해주세요★",
      "★기자단 캠페인입니다★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [기자단]으로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 기자단 활동 시작해주세요<br /> 3. 기간 내 리포팅 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★기자단 리포팅 작성 시에는 전문적이고 객관적인 정보를 작성해주세요<br /> ★ [본인이 직접 경험하고 분석한 게임에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 기자단에게 있는 점 주의 부탁드립니다 <br /> - 활동 불가 및 활동 착오의 경우 : 페이백 미지급 및 선정취소 <br /> - 리포팅 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 전문적인 장비로 촬영해주세요 (4K 화상 권장) - 성의없는 리포팅은 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 기자단 활동 정보를 정확하게 기재해주세요 (게임 스펙, 플레이 시간, 장르 등<br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리포팅 등록기간 내 리포팅 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리포팅 등록기간 필수로 지켜주시기 바랍니다. <br />- 기자단의 경우 게임 분석과 함께 관련 정보, 참고 자료, 비교 분석 등을 기재해주세요. <br />- 기자단 캠페인의 경우 전문적인 게임 리포팅을 작성해주세요",
    ],
  },
  // reporter_8: 종료 탭
  {
    id: "3008",
    title: "건강 기자단",
    category: "기자단",
    image: "/images/main/campaign_img/eximg_8.png",
    subcategory: "뷰티",
    points: 65000,
    description: "건강 및 케어 정보 리포팅 기자단",
    recruitment: {
      current: 78,
      total: 6,
    },
    schedule: "",
    dayCount: "D-8",
    registeredAt: "2025-11-05T14:00:00.000Z", // 등록 시간
    detailedSchedule: {
      // 종료 탭 - registrationPeriod가 과거
      applicationStart: "2026-02-08",
      applicationEnd: "2026-02-23",
      announcement: "2025-11-27",
      registrationPeriod: "2025-11-30 ~ 2025-12-07",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "네이버블로그",
    keyword: "#건강기자단 #건강정보 #케어리뷰 #블로그 #전문리뷰",
    requirements: [
      "text_1600",
      "photo_14",
      "video_report",
      "product_link",
      "keyword",
    ],
    guidelineTexts: [
      "기자단 캠페인 작성시 아래의 내용을 참고하여 작성 진행해 주세요.",
      "★기자단 활동의 전문적이고 객관적인 각도로 작성해주세요!! 건강 분야에서는 깊이있는 지식과 경험을 바탕으로 작성해주세요.",
      "★제공된 기자단 활동을 모두 활용하여 작성해주세요 - 전문적인 건강 리포팅 내용 - 최신 건강 트렌드 분석 포함 - 쉽게 이해할 건강 정보 제공 - 객관적이고 정확한 건강 분석<br />★기자단 리포팅은 전문적이고 객관적인 요청대로 작성 부탁드립니다★<br />★활동적인 실제 제품 경험하는 모습과 건강 관리 과정 진 수 첨부해주세요★<br />★기자단 활동의 정확하고 객관적인 정보를 전문적으로 작성해주세요★",
      "★기자단 캠페인입니다★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [기자단]으로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 기자단 활동 시작해주세요<br /> 3. 기간 내 리포팅 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★기자단 리포팅 작성 시에는 전문적이고 객관적인 정보를 작성해주세요<br /> ★ [본인이 직접 경험하고 분석한 건강 정보에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 기자단에게 있는 점 주의 부탁드립니다 <br /> - 활동 불가 및 활동 착오의 경우 : 페이백 미지급 및 선정취소 <br /> - 리포팅 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 전문적인 장비로 촬영해주세요 (고화질 권장) - 성의없는 리포팅은 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 기자단 활동 정보를 정확하게 기재해주세요 (건강 정보, 효과, 주의사항 등<br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리포팅 등록기간 내 리포팅 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리포팅 등록기간 필수로 지켜주시기 바랍니다. <br />- 기자단의 경우 건강 분석과 함께 관련 정보, 참고 자료, 비교 분석 등을 기재해주세요. <br />- 기자단 캠페인의 경우 전문적인 건강 리포팅을 작성해주세요",
    ],
  },
  // reporter_9: 진행 탭
  {
    id: "3009",
    title: "문화 기자단",
    category: "기자단",
    image: "/images/main/campaign_img/eximg_9.png",
    subcategory: "문화",
    points: 60000,
    description: "문화 예술 전시 리포팅 기자단",
    recruitment: {
      current: 56,
      total: 7,
    },
    schedule: "",
    dayCount: "D-1",
    registeredAt: "2025-11-15T10:50:00.000Z", // 등록 시간
    detailedSchedule: {
      // 진행 탭 - applicationEnd가 과거, registrationPeriod가 미래
      applicationStart: "2025-12-25",
      applicationEnd: "2026-01-15",
      announcement: "2025-12-07",
      registrationPeriod: "2025-12-08 ~ 2026-01-29",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "인스타그램",
    keyword: "#문화기자단 #예술리뷰 #전시리뷰 #인스타그램 #전문리뷰",
    requirements: [
      "text_1500",
      "photo_13",
      "video_report",
      "product_link",
      "keyword",
    ],
    guidelineTexts: [
      "기자단 캠페인 작성시 아래의 내용을 참고하여 작성 진행해 주세요.",
      "★기자단 활동의 전문적이고 객관적인 각도로 작성해주세요!! 문화 분야에서는 깊이있는 지식과 경험을 바탕으로 작성해주세요.",
      "★제공된 기자단 활동을 모두 활용하여 작성해주세요 - 전문적인 문화 리포팅 내용 - 최신 문화 트렌드 분석 포함 - 쉽게 이해할 문화 정보 제공 - 객관적이고 정확한 예술 분석<br />★기자단 리포팅은 전문적이고 객관적인 요청대로 작성 부탁드립니다★<br />★활동적인 실제 제품 경험하는 모습과 전시 체험 과정 진 수 첨부해주세요★<br />★기자단 활동의 정확하고 객관적인 정보를 전문적으로 작성해주세요★",
      "★기자단 캠페인입니다★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [기자단]으로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 기자단 활동 시작해주세요<br /> 3. 기간 내 리포팅 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★기자단 리포팅 작성 시에는 전문적이고 객관적인 정보를 작성해주세요<br /> ★ [본인이 직접 경험하고 분석한 문화 콘텐츠에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 기자단에게 있는 점 주의 부탁드립니다 <br /> - 활동 불가 및 활동 착오의 경우 : 페이백 미지급 및 선정취소 <br /> - 리포팅 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 전문적인 장비로 촬영해주세요 (고화질 권장) - 성의없는 리포팅은 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 기자단 활동 정보를 정확하게 기재해주세요 (전시 정보, 작품, 제품 설명 등<br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리포팅 등록기간 내 리포팅 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리포팅 등록기간 필수로 지켜주시기 바랍니다. <br />- 기자단의 경우 문화 분석과 함께 관련 정보, 참고 자료, 비교 분석 등을 기재해주세요. <br />- 기자단 캠페인의 경우 전문적인 문화 리포팅을 작성해주세요",
    ],
  },
  // reporter_10: 취소 탭
  {
    id: "3010",
    title: "스포츠 기자단",
    category: "기자단",
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
    registeredAt: "2025-11-01T08:00:00.000Z", // 등록 시간
    detailedSchedule: {
      // 취소 탭 - status가 "취소"로 설정됨
      applicationStart: "2026-02-12",
      applicationEnd: "2026-02-27",
      announcement: "2025-11-22",
      registrationPeriod: "2025-11-25 ~ 2025-12-02",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "유튜브",
    keyword: "#스포츠기자단 #스포츠리뷰 #스포츠이벤트 #유튜브 #전문리뷰",
    requirements: [
      "text_1900",
      "photo_17",
      "video_report",
      "product_link",
      "keyword",
    ],
    guidelineTexts: [
      "기자단 캠페인 작성시 아래의 내용을 참고하여 작성 진행해 주세요.",
      "★기자단 활동의 전문적이고 객관적인 각도로 작성해주세요!! 스포츠 분야에서는 깊이있는 지식과 경험을 바탕으로 작성해주세요.",
      "★제공된 기자단 활동을 모두 활용하여 작성해주세요 - 전문적인 스포츠 리포팅 내용 - 최신 스포츠 트렌드 분석 포함 - 쉽게 이해할 스포츠 정보 제공 - 객관적이고 정확한 스포츠 분석<br />★기자단 리포팅은 전문적이고 객관적인 요청대로 작성 부탁드립니다★<br />★활동적인 실제 제품 경험하는 모습과 스포츠 이벤트 체험 과정 진 수 첨부해주세요★<br />★기자단 활동의 정확하고 객관적인 정보를 전문적으로 작성해주세요★",
      "★기자단 캠페인입니다★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [기자단]으로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 기자단 활동 시작해주세요<br /> 3. 기간 내 리포팅 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★기자단 리포팅 작성 시에는 전문적이고 객관적인 정보를 작성해주세요<br /> ★ [본인이 직접 경험하고 분석한 스포츠 이벤트에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 기자단에게 있는 점 주의 부탁드립니다 <br /> - 활동 불가 및 활동 착오의 경우 : 페이백 미지급 및 선정취소 <br /> - 리포팅 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 전문적인 장비로 촬영해주세요 (4K 화상 권장) - 성의없는 리포팅은 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 기자단 활동 정보를 정확하게 기재해주세요 (경기 정보, 선수, 경기 결과 등<br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리포팅 등록기간 내 리포팅 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리포팅 등록기간 필수로 지켜주시기 바랍니다. <br />- 기자단의 경우 스포츠 분석과 함께 관련 정보, 참고 자료, 비교 분석 등을 기재해주세요. <br />- 기자단 캠페인의 경우 전문적인 스포츠 리포팅을 작성해주세요",
    ],
  },
  {
    id: "3011",
    title: "뷰티 트렌드 기자단",
    category: "기자단",
    image: "/images/main/campaign_img/eximg_1.png",
    subcategory: "뷰티",
    points: 60000,
    description: "2026 뷰티 트렌드 전문 리포팅 기자단 모집 예정",
    recruitment: {
      current: 0,
      total: 5,
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
    channel: "네이버블로그",
    keyword: "#뷰티트렌드 #뷰티기자단 #2026뷰티 #뷰티리포팅 #전문리뷰",
    productLink: "https://blog.naver.com/example-beauty-trend",
    requirements: [
      "text_2500",
      "photo_20",
      "video_report",
      "product_link",
      "keyword",
    ],
    guidelineTexts: [
      "기자단 캠페인 작성시 아래의 내용을 참고하여 작성 진행해 주세요.",
      "★기자단 활동의 전문적이고 객관적인 각도로 작성해주세요!! 뷰티 분야에서는 최신 트렌드와 전문적인 분석을 바탕으로 작성해주세요.",
      "★제공된 기자단 활동을 모두 활용하여 작성해주세요 - 전문적인 뷰티 트렌드 리포팅 내용 - 최신 뷰티 트렌드 분석 포함 - 쉽게 이해할 뷰티 정보 제공 - 객관적이고 정확한 뷰티 분석<br />★기자단 리포팅은 전문적이고 객관적인 요청대로 작성 부탁드립니다★<br />★활동적인 실제 제품 경험하는 모습과 뷰티 이벤트 체험 과정 진 수 첨부해주세요★<br />★기자단 활동의 정확하고 객관적인 정보를 전문적으로 작성해주세요★",
      "★기자단 캠페인입니다★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [기자단]으로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 기자단 활동 시작해주세요<br /> 3. 기간 내 리포팅 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★기자단 리포팅 작성 시에는 전문적이고 객관적인 정보를 작성해주세요<br /> ★ [본인이 직접 경험하고 분석한 뷰티 트렌드에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 기자단에게 있는 점 주의 부탁드립니다 <br /> - 활동 불가 및 활동 착오의 경우 : 페이백 미지급 및 선정취소 <br /> - 리포팅 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 전문적인 장비로 촬영해주세요 (4K 화상 권장) - 성의없는 리포팅은 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 기자단 활동 정보를 정확하게 기재해주세요 (트렌드 정보, 제품 분석, 시장 동향 등<br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리포팅 등록기간 내 리포팅 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리포팅 등록기간 필수로 지켜주시기 바랍니다. <br />- 기자단의 경우 뷰티 트렌드 분석과 함께 관련 정보, 참고 자료, 비교 분석 등을 기재해주세요. <br />- 기자단 캠페인의 경우 전문적인 뷰티 리포팅을 작성해주세요",
    ],
  },
  // reporter_12: 마감임박 - 네이버 클립 채널
  {
    id: "3012",
    title: "[마감임박] 디지털 기자단",
    category: "기자단",
    image: "/images/main/campaign_img/eximg_1.png",
    subcategory: "IT/기술",
    points: 85000,
    description: "최신 디지털 제품 리뷰 기자단 모집 - 네이버 클립",
    recruitment: {
      current: 2, // 신청자 수 적게 설정
      total: 5,
    },
    schedule: "",
    dayCount: "마감임박",
    registeredAt: "2026-01-11T11:30:00.000Z", // 등록 시간
    detailedSchedule: {
      // 모집 중 - 현재 날짜 기준 (2026-01-13 ~ 2026-01-26)
      applicationStart: "2026-01-13",
      applicationEnd: "2026-01-26",
      announcement: "2026-01-28",
      registrationPeriod: "2026-01-31 ~ 2026-02-08",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "클립",
    keyword: "#디지털기자단 #IT리뷰 #기술리포팅 #네이버클립 #전문리뷰",
    productLink: "https://example.com/digital-product",
    requirements: [
      "text_3000",
      "photo_25",
      "video_2_600",
      "product_link",
      "keyword",
    ],
    guidelineTexts: [
      "기자단 캠페인 작성시 아래의 내용을 참고하여 작성 진행해 주세요.",
      "★기자단 활동의 전문적이고 객관적인 각도로 작성해주세요!! IT 기술 분야에서는 깊이있는 지식과 경험을 바탕으로 작성해주세요.",
      "★제공된 기자단 활동을 모두 활용하여 작성해주세요 - 전문적인 IT 리포팅 내용 - 최신 기술 트렌드 분석 포함 - 쉽게 이해할 기술 정보 제공 - 객관적이고 정확한 정보 전달<br />★기자단 리포팅은 전문적이고 객관적인 요청대로 작성 부탁드립니다★<br />★활동적인 실제 제품 경험하는 모습과 기술 테스트 과정 진 수 첨부해주세요★<br />★기자단 활동의 정확하고 객관적인 정보를 전문적으로 작성해주세요★",
      "★기자단 캠페인입니다★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [기자단]으로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 기자단 활동 시작해주세요<br /> 3. 기간 내 리포팅 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★기자단 리포팅 작성 시에는 전문적이고 객관적인 정보를 작성해주세요<br /> ★ [본인이 직접 경험하고 분석한 IT 기술 제품에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 기자단에게 있는 점 주의 부탁드립니다 <br /> - 활동 불가 및 활동 착오의 경우 : 페이백 미지급 및 선정취소 <br /> - 리포팅 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 전문적인 장비로 촬영해주세요 (4K 화상 권장) - 성의없는 리포팅은 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 기자단 활동 정보를 정확하게 기재해주세요 (기술 스펙, 테스트 환경, 사용 시간 등<br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리포팅 등록기간 내 리포팅 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리포팅 등록기간 필수로 지켜주시기 바랍니다. <br />- 기자단의 경우 기술 분석과 함께 관련 정보, 참고 자료, 비교 분석 등을 기재해주세요. <br />- 기자단 캠페인의 경우 전문적인 IT 리포팅을 작성해주세요",
    ],
  },
];

/* ========================================
   📝 기자단 캠페인 확장 타입 정의 (신청자 데이터 + 종료/취소 데이터)
   ======================================== */

/**
 * 기자단 캠페인 확장 데이터 타입
 *
 * 설명:
 * - 기존 ReporterCampaignData 타입을 확장하여 신청자 데이터와 종료/취소 데이터를 포함합니다.
 * - 파트너 관리 페이지에서 사용하는 통합 데이터 구조입니다.
 * - 기존 ReporterCampaignData 타입은 유지하여 사용자 페이지와의 호환성을 보장합니다.
 */
export interface ReporterCampaignDataExtended {
  // 기존 ReporterCampaignData의 모든 필드 포함
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
  campaign_detail_images?: string[]; // 캠페인 상세 이미지 경로 배열 (여러 이미지)
  channel: string;
  keyword: string;
  productLink?: string;
  requirements: string[];
  guidelineTexts: string[];

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
  contents?: ContentByTab;
}

/**
 * 기자단 캠페인 확장 데이터 (파트너 관리용) - 신청자 데이터 포함
 *
 * 설명:
 * - 파트너 관리 페이지에서 사용하는 기자단 캠페인 데이터입니다.
 * - 신청자 데이터와 종료/취소 데이터를 포함합니다.
 * - 각 캠페인마다 직접 예시 신청자 데이터를 포함합니다.
 */
export const reporterCampaignsExtended: ReporterCampaignDataExtended[] = [
  // reporter_1: 테크 기자단
  {
    ...reporterCampaigns[0],
    applicantData: {
      applicants: [
        {
          id: "app_reporter_1_유튜브_001",
          Id: "reviewer_reporter_1_001",
          nickname: "테크기자단리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 150,
          totalVisits: 450000,
          neighbors: 1100,
          memo: "IT 기술 제품 전문 기자단 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "유튜브",
          registrationDate: "2025-12-15",
        },
        {
          id: "app_reporter_1_유튜브_002",
          Id: "reviewer_reporter_1_002",
          nickname: "테크전문가B",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 180,
          totalVisits: 580000,
          neighbors: 1500,
          memo: "상세한 기술 리포팅 작성 능력이 뛰어납니다.",
          selectionStatus: "미선택" as const,
          channel: "유튜브",
          registrationDate: "2025-12-16",
        },
        {
          id: "app_reporter_1_유튜브_003",
          Id: "reviewer_reporter_1_003",
          nickname: "테크인플루언서C",
          userType: "인플루언서" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 220,
          totalVisits: 720000,
          neighbors: 2000,
          memo: "사진 퀄리티가 우수하고 팔로워 수가 많습니다.",
          selectionStatus: "미선택" as const,
          channel: "유튜브",
          registrationDate: "2025-12-17",
        },
        {
          id: "app_reporter_1_유튜브_004",
          Id: "reviewer_reporter_1_004",
          nickname: "기자단퀸D",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "주의 회원" as const,
          dailyVisits: 95,
          totalVisits: 280000,
          neighbors: 700,
          memo: "가독성 좋은 후기를 작성합니다.",
          selectionStatus: "미선택" as const,
          channel: "유튜브",
          registrationDate: "2025-12-18",
        },
        {
          id: "app_reporter_1_유튜브_005",
          Id: "reviewer_reporter_1_005",
          nickname: "테크마스터E",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 200,
          totalVisits: 650000,
          neighbors: 1800,
          memo: "고품질 기자단 리포팅 전문가입니다.",
          selectionStatus: "미선택" as const,
          channel: "유튜브",
          registrationDate: "2025-12-19",
        },
      ],
      selectedApplicants: [],
    },
  },
  // reporter_2: 뷰티 기자단
  {
    ...reporterCampaigns[1],
    applicantData: {
      applicants: [
        {
          id: "app_reporter_2_인스타그램_001",
          Id: "reviewer_reporter_2_001",
          nickname: "뷰티기자단리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 120,
          totalVisits: 400000,
          neighbors: 900,
          memo: "뷰티 트렌드 리포팅 전문 기자단 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "인스타그램",
          registrationDate: "2025-12-18",
        },
        {
          id: "app_reporter_2_인스타그램_002",
          Id: "reviewer_reporter_2_002",
          nickname: "뷰티리뷰어B",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 160,
          totalVisits: 500000,
          neighbors: 1200,
          memo: "뷰티 제품 리뷰를 자주 작성합니다.",
          selectionStatus: "미선택" as const,
          channel: "인스타그램",
          registrationDate: "2025-12-19",
        },
        {
          id: "app_reporter_2_인스타그램_003",
          Id: "reviewer_reporter_2_003",
          nickname: "뷰티인플루언서C",
          userType: "인플루언서" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 250,
          totalVisits: 750000,
          neighbors: 2200,
          memo: "뷰티 전문 인플루언서입니다.",
          selectionStatus: "미선택" as const,
          channel: "인스타그램",
          registrationDate: "2025-12-20",
        },
      ],
      selectedApplicants: [
        {
          id: "sel_reporter_2_인스타그램_001",
          Id: "selected_reporter_2_001",
          nickname: "선정된뷰티기자단리뷰어1",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 320,
          totalVisits: 950000,
          neighbors: 2800,
          memo: "이미 선정된 우수 리뷰어입니다.",
          selectionStatus: "선정하기" as const,
          channel: "인스타그램",
          registrationDate: "2025-12-18",
        },
      ],
    },
    contents: {
      waiting: [
        {
          id: "content_reporter_2_waiting_001",
          createdAt: "2025-12-20T10:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "뷰티기자단리뷰어A",
          channelId: "insta_023",
          channel: "인스타그램",
          profileImage: "",
        },
        {
          id: "content_reporter_2_waiting_002",
          createdAt: "2025-12-21T11:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "뷰티리뷰어B",
          channelId: "insta_024",
          channel: "인스타그램",
          profileImage: "",
        },
      ],
      reviewing: [
        {
          id: "content_reporter_2_reviewing_001",
          createdAt: "2025-12-18T09:00:00.000Z",
          status: "검수중" as const,
          userType: "인플루언서" as const,
          nickname: "뷰티인플루언서C",
          channelId: "insta_025",
          channel: "인스타그램",
          updatedAt: "2025-12-19T10:00:00.000Z",
          isRejected: false,
          isLate: false,
          profileImage: "",
        },
      ],
      completed: [
        {
          id: "content_reporter_2_completed_001",
          createdAt: "2025-12-15T08:00:00.000Z",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "선정된뷰티기자단리뷰어1",
          channelId: "insta_026",
          channel: "인스타그램",
          updatedAt: "2025-12-16T09:00:00.000Z",
          isLate: false,
          profileImage: "",
        },
      ],
    },
  },
  // reporter_3: 패션 기자단
  {
    ...reporterCampaigns[2],
    isUrgent: true, // 긴급 캠페인
    applicantData: {
      applicants: [
        {
          id: "app_reporter_3_네이버블로그_001",
          Id: "reviewer_reporter_3_001",
          nickname: "패션기자단리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 140,
          totalVisits: 420000,
          neighbors: 1000,
          memo: "패션 트렌드 리포팅 전문 기자단 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-20",
        },
        {
          id: "app_reporter_3_네이버블로그_002",
          Id: "reviewer_reporter_3_002",
          nickname: "패션인플루언서B",
          userType: "인플루언서" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 280,
          totalVisits: 850000,
          neighbors: 2500,
          memo: "패션 아이템 전문 인플루언서입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-21",
        },
        {
          id: "app_reporter_3_네이버블로그_003",
          Id: "reviewer_reporter_3_003",
          nickname: "패션리뷰어C",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 110,
          totalVisits: 350000,
          neighbors: 800,
          memo: "패션 제품 리뷰를 자주 작성합니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-22",
        },
      ],
      selectedApplicants: [
        {
          id: "sel_reporter_3_네이버블로그_001",
          Id: "selected_reporter_3_001",
          nickname: "선정된패션기자단리뷰어1",
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
  },
  // reporter_4: 푸드 기자단
  {
    ...reporterCampaigns[3],
    applicantData: {
      applicants: [
        {
          id: "app_reporter_4_네이버블로그_001",
          Id: "reviewer_reporter_4_001",
          nickname: "푸드기자단리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 130,
          totalVisits: 380000,
          neighbors: 950,
          memo: "맛집 및 제품 리포팅 전문 기자단 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-25",
        },
        {
          id: "app_reporter_4_네이버블로그_002",
          Id: "reviewer_reporter_4_002",
          nickname: "푸드전문가B",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 170,
          totalVisits: 520000,
          neighbors: 1300,
          memo: "푸드 리뷰를 많이 작성합니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-26",
        },
      ],
      selectedApplicants: [],
    },
  },
  // reporter_5: 여행 기자단
  {
    ...reporterCampaigns[4],
    applicantData: {
      applicants: [
        {
          id: "app_reporter_5_유튜브_001",
          Id: "reviewer_reporter_5_001",
          nickname: "여행기자단리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 100,
          totalVisits: 300000,
          neighbors: 750,
          memo: "여행 전문 기자단 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "유튜브",
          registrationDate: "2025-12-10",
        },
      ],
      selectedApplicants: [],
    },
    contents: {
      waiting: [],
      reviewing: [
        {
          id: "content_reporter_5_001",
          createdAt: "2025-11-20",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "여행기자단리뷰어A",
          channelId: "youtube_001",
          channel: "유튜브",
          updatedAt: "2025-11-25",
          isRejected: false,
          isLate: false,
        },
        {
          id: "content_reporter_5_002",
          createdAt: "2025-11-21",
          status: "검수중" as const,
          userType: "인플루언서" as const,
          nickname: "여행인플루언서B",
          channelId: "youtube_002",
          channel: "유튜브",
          updatedAt: "2025-11-26",
          isRejected: false,
          isLate: false,
        },
      ],
      completed: [
        {
          id: "content_reporter_5_003",
          createdAt: "2025-11-22",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "여행리뷰어C",
          channelId: "youtube_003",
          channel: "유튜브",
          updatedAt: "2025-11-27",
          isLate: false,
        },
        {
          id: "content_reporter_5_004",
          createdAt: "2025-11-23",
          status: "완료" as const,
          userType: "인플루언서" as const,
          nickname: "여행인플루언서D",
          channelId: "youtube_004",
          channel: "유튜브",
          updatedAt: "2025-11-28",
          isLate: false,
        },
      ],
    },
  },
  // reporter_6: 라이프스타일 기자단
  {
    ...reporterCampaigns[5],
    applicantData: {
      applicants: [
        {
          id: "app_reporter_6_인스타그램_001",
          Id: "reviewer_reporter_6_001",
          nickname: "라이프스타일기자단리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 160,
          totalVisits: 480000,
          neighbors: 1100,
          memo: "라이프스타일 트렌드 리포팅 전문 기자단 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "인스타그램",
          registrationDate: "2025-12-19",
        },
        {
          id: "app_reporter_6_인스타그램_002",
          Id: "reviewer_reporter_6_002",
          nickname: "라이프인플루언서B",
          userType: "인플루언서" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 240,
          totalVisits: 720000,
          neighbors: 1900,
          memo: "라이프스타일 전문 인플루언서입니다.",
          selectionStatus: "미선택" as const,
          channel: "인스타그램",
          registrationDate: "2025-12-20",
        },
        {
          id: "app_reporter_6_인스타그램_003",
          Id: "reviewer_reporter_6_003",
          nickname: "라이프전문가C",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 190,
          totalVisits: 570000,
          neighbors: 1400,
          memo: "라이프스타일 리뷰를 자주 작성합니다.",
          selectionStatus: "미선택" as const,
          channel: "인스타그램",
          registrationDate: "2025-12-21",
        },
      ],
      selectedApplicants: [
        {
          id: "sel_reporter_6_인스타그램_001",
          Id: "selected_reporter_6_001",
          nickname: "선정된라이프스타일기자단리뷰어1",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 310,
          totalVisits: 930000,
          neighbors: 2600,
          memo: "이미 선정된 우수 리뷰어입니다.",
          selectionStatus: "선정하기" as const,
          channel: "인스타그램",
          registrationDate: "2025-12-19",
        },
      ],
    },
  },
  // reporter_7: 게임 기자단
  {
    ...reporterCampaigns[6],
    applicantData: {
      applicants: [
        {
          id: "app_reporter_7_유튜브_001",
          Id: "reviewer_reporter_7_001",
          nickname: "게임기자단리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 280,
          totalVisits: 840000,
          neighbors: 2300,
          memo: "게임 리뷰 및 플레이 리포팅 전문 기자단 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "유튜브",
          registrationDate: "2025-12-28",
        },
        {
          id: "app_reporter_7_유튜브_002",
          Id: "reviewer_reporter_7_002",
          nickname: "게임인플루언서B",
          userType: "인플루언서" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 320,
          totalVisits: 960000,
          neighbors: 2700,
          memo: "게임 전문 인플루언서입니다.",
          selectionStatus: "미선택" as const,
          channel: "유튜브",
          registrationDate: "2025-12-29",
        },
      ],
      selectedApplicants: [],
    },
    contents: {
      waiting: [
        {
          id: "content_reporter_7_waiting_001",
          createdAt: "2025-12-28T10:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "게임기자단리뷰어A",
          channelId: "youtube_025",
          channel: "유튜브",
          profileImage: "",
        },
      ],
      reviewing: [
        {
          id: "content_reporter_7_reviewing_001",
          createdAt: "2025-12-26T09:00:00.000Z",
          status: "검수중" as const,
          userType: "인플루언서" as const,
          nickname: "게임인플루언서B",
          channelId: "youtube_026",
          channel: "유튜브",
          updatedAt: "2025-12-27T10:00:00.000Z",
          isRejected: false,
          isLate: false,
          profileImage: "",
        },
      ],
      completed: [
        {
          id: "content_reporter_7_completed_001",
          createdAt: "2025-12-24T08:00:00.000Z",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "게임전문가C",
          channelId: "youtube_027",
          channel: "유튜브",
          updatedAt: "2025-12-25T09:00:00.000Z",
          isLate: false,
          profileImage: "",
        },
      ],
    },
  },
  // reporter_8: 건강 기자단
  {
    ...reporterCampaigns[7],
    applicantData: {
      applicants: [
        {
          id: "app_reporter_8_네이버블로그_001",
          Id: "reviewer_reporter_8_001",
          nickname: "건강기자단리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 150,
          totalVisits: 450000,
          neighbors: 1100,
          memo: "건강 및 케어 정보 리포팅 전문 기자단 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-12",
        },
      ],
      selectedApplicants: [],
    },
    contents: {
      waiting: [],
      reviewing: [
        {
          id: "content_reporter_8_001",
          createdAt: "2025-11-30T10:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "건강기자단리뷰어A",
          channelId: "blog_001",
          channel: "네이버블로그",
          updatedAt: "2025-12-05T10:00:00.000Z",
          isRejected: false,
          isLate: false,
          profileImage: "",
        },
      ],
      completed: [
        {
          id: "content_reporter_8_002",
          createdAt: "2025-12-01T11:00:00.000Z",
          status: "완료" as const,
          userType: "인플루언서" as const,
          nickname: "건강인플루언서B",
          channelId: "blog_002",
          channel: "네이버블로그",
          updatedAt: "2025-12-07T11:00:00.000Z",
          isLate: false,
          profileImage: "",
        },
        {
          id: "content_reporter_8_003",
          createdAt: "2025-12-02T12:00:00.000Z",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "건강리뷰어C",
          channelId: "blog_003",
          channel: "네이버블로그",
          updatedAt: "2025-12-07T12:00:00.000Z",
          isLate: false,
          profileImage: "",
        },
      ],
    },
  },
  // reporter_9: 문화 기자단
  {
    ...reporterCampaigns[8],
    applicantData: {
      applicants: [
        {
          id: "app_reporter_9_인스타그램_001",
          Id: "reviewer_reporter_9_001",
          nickname: "문화기자단리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 180,
          totalVisits: 540000,
          neighbors: 1500,
          memo: "문화 예술 전시 리포팅 전문 기자단 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "인스타그램",
          registrationDate: "2025-12-30",
        },
        {
          id: "app_reporter_9_인스타그램_002",
          Id: "reviewer_reporter_9_002",
          nickname: "문화인플루언서B",
          userType: "인플루언서" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 260,
          totalVisits: 780000,
          neighbors: 2100,
          memo: "문화 전문 인플루언서입니다.",
          selectionStatus: "미선택" as const,
          channel: "인스타그램",
          registrationDate: "2025-12-31",
        },
      ],
      selectedApplicants: [],
    },
    contents: {
      waiting: [
        {
          id: "content_reporter_9_waiting_001",
          createdAt: "2025-12-30T10:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "문화기자단리뷰어A",
          channelId: "insta_027",
          channel: "인스타그램",
          profileImage: "",
        },
        {
          id: "content_reporter_9_waiting_002",
          createdAt: "2025-12-31T11:00:00.000Z",
          status: "검수" as const,
          userType: "인플루언서" as const,
          nickname: "문화인플루언서B",
          channelId: "insta_028",
          channel: "인스타그램",
          profileImage: "",
        },
      ],
      reviewing: [
        {
          id: "content_reporter_9_reviewing_001",
          createdAt: "2025-12-28T09:00:00.000Z",
          status: "검수중" as const,
          userType: "리뷰어" as const,
          nickname: "문화전문가C",
          channelId: "insta_029",
          channel: "인스타그램",
          updatedAt: "2025-12-29T10:00:00.000Z",
          isRejected: false,
          isLate: false,
          profileImage: "",
        },
      ],
      completed: [
        {
          id: "content_reporter_9_completed_001",
          createdAt: "2025-12-26T08:00:00.000Z",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "문화리뷰어D",
          channelId: "insta_030",
          channel: "인스타그램",
          updatedAt: "2025-12-27T09:00:00.000Z",
          isLate: false,
          profileImage: "",
        },
      ],
    },
  },
  // reporter_10: 스포츠 기자단
  {
    ...reporterCampaigns[9],
    applicantData: {
      applicants: [
        {
          id: "app_reporter_10_유튜브_001",
          Id: "reviewer_reporter_10_001",
          nickname: "스포츠기자단리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 140,
          totalVisits: 420000,
          neighbors: 1000,
          memo: "스포츠 이벤트 리포팅 전문 기자단 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "유튜브",
          registrationDate: "2025-12-08",
        },
      ],
      selectedApplicants: [],
    },
  },
  // reporter_11: 뷰티 트렌드 기자단
  {
    ...reporterCampaigns[10],
    applicantData: {
      applicants: [],
      selectedApplicants: [],
    },
  },
  // reporter_12: 디지털 기자단 (네이버 클립 채널)
  {
    ...reporterCampaigns[11],
    // guidelineTexts 명시적으로 포함 (스프레드 연산자로 인한 누락 방지)
    guidelineTexts: reporterCampaigns[11].guidelineTexts || [],
    applicantData: {
      applicants: [
        {
          id: "app_reporter_12_네이버클립_001",
          Id: "reviewer_reporter_12_001",
          nickname: "디지털기자단리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          followers: 2500,
          memo: "디지털 트렌드 및 IT 제품 리포팅 전문 기자단 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버클립" as const,
          registrationDate: "2026-01-13",
        } as any,
        {
          id: "app_reporter_12_네이버클립_002",
          Id: "reviewer_reporter_12_002",
          nickname: "디지털인플루언서B",
          userType: "인플루언서" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          followers: 3800,
          memo: "디지털 제품 리뷰 전문 인플루언서입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버클립" as const,
          registrationDate: "2026-01-14",
        } as any,
        {
          id: "app_reporter_12_네이버클립_003",
          Id: "reviewer_reporter_12_003",
          nickname: "IT전문기자단C",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          followers: 3200,
          memo: "IT 기술 분석 및 제품 리포팅 전문가입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버클립" as const,
          registrationDate: "2026-01-15",
        } as any,
        {
          id: "app_reporter_12_네이버클립_004",
          Id: "reviewer_reporter_12_004",
          nickname: "테크리포터D",
          userType: "인플루언서" as const,
          profileImage: "",
          memberType: "주의 회원" as const,
          followers: 1900,
          memo: "기술 제품 리뷰 전문 인플루언서입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버클립" as const,
          registrationDate: "2026-01-16",
        } as any,
      ],
      selectedApplicants: [
        {
          id: "sel_reporter_12_네이버클립_001",
          Id: "selected_reporter_12_001",
          nickname: "디지털기자단리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          followers: 2500,
          memo: "디지털 트렌드 및 IT 제품 리포팅 전문 기자단 리뷰어입니다.",
          selectionStatus: "선정하기" as const,
          channel: "네이버클립" as const,
          registrationDate: "2026-01-13",
        } as any,
        {
          id: "sel_reporter_12_네이버클립_002",
          Id: "selected_reporter_12_002",
          nickname: "디지털인플루언서B",
          userType: "인플루언서" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          followers: 3800,
          memo: "디지털 제품 리뷰 전문 인플루언서입니다.",
          selectionStatus: "선정하기" as const,
          channel: "네이버클립" as const,
          registrationDate: "2026-01-14",
        } as any,
      ],
    },
    contents: {
      waiting: [
        {
          id: "content_reporter_12_waiting_001",
          createdAt: "2026-01-31T10:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "디지털기자단리뷰어A",
          channelId: "naverclip_021",
          channel: "네이버클립",

        },
        {
          id: "content_reporter_12_waiting_002",
          createdAt: "2026-02-01T11:00:00.000Z",
          status: "검수" as const,
          userType: "인플루언서" as const,
          nickname: "디지털인플루언서B",
          channelId: "naverclip_022",
          channel: "네이버클립",
         
        },
      ],
      reviewing: [
        {
          id: "content_reporter_12_reviewing_001",
          createdAt: "2026-01-29T09:00:00.000Z",
          status: "검수중" as const,
          userType: "리뷰어" as const,
          nickname: "IT전문기자단C",
          channelId: "naverclip_023",
          channel: "네이버클립",
          updatedAt: "2026-01-30T10:00:00.000Z",
          isRejected: false,
          isLate: false,
      
        },
        {
          id: "content_reporter_12_reviewing_002",
          createdAt: "2026-01-30T14:00:00.000Z",
          status: "검수중" as const,
          userType: "인플루언서" as const,
          nickname: "테크리포터D",
          channelId: "naverclip_024",
          channel: "네이버클립",
          updatedAt: "2026-01-31T15:00:00.000Z",
          isRejected: false,
          isLate: false,
         
        },
      ],
      completed: [
        {
          id: "content_reporter_12_completed_001",
          createdAt: "2026-01-25T08:00:00.000Z",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "디지털기자단리뷰어A",
          channelId: "naverclip_025",
          channel: "네이버클립",
          updatedAt: "2026-01-27T09:00:00.000Z",
          isLate: false,
      
        },
        {
          id: "content_reporter_12_completed_002",
          createdAt: "2026-01-26T10:00:00.000Z",
          status: "완료" as const,
          userType: "인플루언서" as const,
          nickname: "디지털인플루언서B",
          channelId: "naverclip_026",
          channel: "네이버클립",
          updatedAt: "2026-01-28T11:00:00.000Z",
          isLate: false,
   
        },
      ],
    },
  },
];

/**
 * 기자단 캠페인의 콘텐츠 데이터를 조회하는 함수
 *
 * 설명:
 * - 캠페인 ID를 받아서 해당 캠페인의 콘텐츠(검수 중/완료)를 반환합니다.
 * - 종료/취소된 캠페인과 진행 중인 캠페인 모두 지원합니다.
 *
 * @param campaignId - 조회할 캠페인의 ID
 * @returns 검수 중/완료된 콘텐츠를 담은 객체
 */
export function getReporterContentsById(campaignId: string): ContentByTab {
  // 진행 중인 캠페인에서 찾기
  const campaign = reporterCampaignsExtended.find((c) => c.id === campaignId);
  if (campaign?.contents) {
    return campaign.contents;
  }

  // 콘텐츠가 없는 경우 빈 배열 반환
  return { waiting: [], reviewing: [], completed: [] };
}

/**
 * 기자단 캠페인 헬퍼 함수들
 */

/**
 * 새 캠페인 ID 생성
 *
 * @returns 새로운 캠페인 ID (reporter_X 형식)
 */
function generateNewReporterCampaignId(): string {
  // 기존 캠페인 ID 중 최대값 찾기
  const allCampaigns = [...reporterCampaignsExtended];

  // localStorage에 저장된 캠페인도 확인
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("reporterCampaigns");
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
      console.error("localStorage에서 기자단 캠페인 ID 확인 실패:", error);
    }
  }

  // 배송형처럼 숫자만 사용 (기자단은 3000번대부터 시작)
  const existingIds = allCampaigns
    .map((c) => {
      // reporter_X 형식이면 숫자만 추출, 아니면 숫자로 직접 변환 시도
      const match = c.id.match(/reporter_(\d+)/);
      if (match) {
        return parseInt(match[1]) + 3000; // reporter_12 -> 3012
      }
      const numId = parseInt(c.id);
      return isNaN(numId) ? 0 : numId;
    })
    .filter((id) => id >= 3000 && id < 4000); // 기자단 범위: 3000-3999
  const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 3000;

  return String(maxId + 1);
}

/**
 * 폼 데이터를 CampaignWithApplicants 형태로 변환하여 새 캠페인 생성
 *
 * @param formData - 폼에서 입력받은 캠페인 데이터
 * @param imageUrl - 업로드된 이미지 URL
 * @returns 새로 생성된 CampaignWithApplicants 객체
 */
export function createReporterCampaign(
  formData: CampaignFormData,
  imageUrl: string = "/images/main/campaign_img/eximg_8.png"
): CampaignWithApplicants {
  // 새 캠페인 ID 생성
  const newId = generateNewReporterCampaignId();

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
    // 기자단 캠페인의 경우 "진행 중" 상태를 "등록 중"으로 표시
    finalStatus = "등록 중";
  }

  // 플랫폼명 정규화
  const normalizedBrandName = formData.platform
    ? formData.platform.replace(/\s+/g, "")
    : "유튜브";

  // 포인트 계산 (additionalPoints를 숫자로 변환)
  const points = Number(formData.additionalPoints) || 0;

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
      campaignType: "기자단",
      category: formData.category || "기타",
      brandName: normalizedBrandName,
      recruitmentPeriod: formData.recruitmentPeriod || "",
      announcementDate: formData.announcementDate || "",
      registrationPeriod: formData.registrationPeriod || "",
      point: points,
      channel: formData.platform || "",
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
 * 기자단 캠페인 수정
 *
 * @param campaignId - 수정할 캠페인 ID
 * @param formData - 폼에서 입력받은 캠페인 데이터
 * @param imageUrl - 업로드된 이미지 URL
 * @returns 수정된 CampaignWithApplicants 객체
 */
export function updateReporterCampaign(
  campaignId: string,
  formData: CampaignFormData,
  imageUrl: string = "/images/main/campaign_img/eximg_8.png"
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
    // 기자단 캠페인의 경우 "진행 중" 상태를 "등록 중"으로 표시
    finalStatus = "등록 중";
  }

  // 플랫폼명 정규화
  const normalizedBrandName = formData.platform
    ? formData.platform.replace(/\s+/g, "")
    : "유튜브";

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
      campaignType: "기자단",
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
 * 새 기자단 캠페인 추가
 *
 * @param formData - 폼에서 입력받은 캠페인 데이터
 * @param imageUrl - 업로드된 이미지 URL
 * @returns 새로 생성된 CampaignWithApplicants 객체
 */
export function addReporterCampaign(
  formData: CampaignFormData,
  imageUrl: string = "/images/main/campaign_img/eximg_8.png"
): CampaignWithApplicants {
  return createReporterCampaign(formData, imageUrl);
}
