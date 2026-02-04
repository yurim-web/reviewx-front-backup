/**
 * 구매평 캠페인 데이터 타입 정의
 */

import type { CampaignFormData } from "@/types/domain/user";
import type {
  ContentByTab,
  CampaignWithApplicants,
} from "@/data/partner/sharedCampaigns";
import { calculateDaysLeft, calculateCampaignStatus } from "../delivery/utils";

export interface ReviewCampaignData {
  id: string; // 캠페인 고유 식별자
  title: string; // 캠페인 제목
  category: string; // 캠페인 카테고리 (구매평)
  image: string; // 메인 제품 이미지 경로
  subcategory: string; // 세부 카테고리 (생활, 뷰티, 식품 등)
  channel: string; // 채널 (구매평은 빈 문자열 또는 기본값 사용)
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
    purchasePeriod: string; // 구매 기간
    registrationPeriod: string; // 등록 기간
  };
  campaign_detail_image: string; // 캠페인 상세 이미지 경로 (첫 번째 이미지, 하위 호환성)
  campaign_detail_images?: string[]; // 캠페인 상세 이미지 경로 배열 (여러 이미지)
  keyword: string; // 캠페인 키워드
  purchaseLink?: string; // 구매 링크 (선택사항)
  requirements: string[]; // 캠페인별 요구사항 코드 목록
  guidelineTexts: string[]; // 유의사항 텍스트 목록
  contentType?: "link" | "image" | "both"; // 콘텐츠 타입 (링크만, 이미지만, 링크+이미지)
  // 참여/제출 옵션
  adultOnly?: boolean; // 만 19세 이상 참여 허용
  allowReParticipation?: boolean; // 이전 참여자 재참여 허용
  allowLateSubmission?: boolean; // 지각 제출 허용
  // 문의 담당자 정보
  contactPhone?: string; // 문의 담당자 휴대폰 번호
}

/**
 * 구매평 캠페인 데이터
 * 구매평 페이지에서 사용되는 전용 데이터
 */
export const reviewCampaigns: ReviewCampaignData[] = [
  // review_1: 예정 탭
  {
    id: "2001",
    title: "스마트폰 구매평 리뷰",
    category: "구매평",
    image: "/images/main/campaign_img/eximg_1.png",
    subcategory: "디지털",
    channel: "네이버블로그",
    points: 45000,
    description: "최신 스마트폰 구매 후 상세 리뷰 작성",
    recruitment: {
      current: 234,
      total: 8,
    },
    schedule: "",
    dayCount: "D-5",
    registeredAt: "2025-12-15T09:30:00.000Z", // 등록 시간
    detailedSchedule: {
      // 오픈 예정 - 모집 시작 전
      applicationStart: "2026-02-08",
      applicationEnd: "2026-02-22",
      announcement: "2026-02-24",
      purchasePeriod: "2026-02-24 ~ 2026-02-27",
      registrationPeriod: "2026-02-27 ~ 2026-03-10",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    keyword: "#스마트폰리뷰 #최신폰 #구매후기 #솔직리뷰 #디지털기기",
    purchaseLink:
      "https://smartstore.naver.com/example-store/products/smartphone123",
    requirements: [
      "text_2500",
      "photo_20",
      "video_2_300",
      "product_link",
      "keyword",
    ],
    guidelineTexts: [
      "구매평 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★안내된 가격과 주문 가격이 상이한 경우 임의 주문하지 마시고, 꼭 1:1문의로 제보 부탁드립니다!! 네이버 멤버십 계정이시면 가격이 낮은 경우가 간혹 발생하여 안내드린 가격과 다를 경우, [ 멤버십이 아닌 네이버 계정으로 고지된 금액에 맞게 구매 ] 부탁드립니다★",
      "★제공된 제품을 모두 활용하여 작성해주세요 - 스마트폰의 모든 기능을 체험해보세요 - 카메라, 배터리, 성능 등 다양한 측면에서 리뷰 작성 - 실제 사용 모습과 후기를 솔직하게 작성<br />★구매평은 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★<br />★구매평 작성 시 실제 제품을 사용하시는 모습 사진 필수 첨부해주세요★<br />★구매평 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★구매평 작성 / 페이백 캠페인 입니다 (블로그 리뷰 작성 x)★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [선구매]로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 선구매 해주세요<br /> 3. 기간 내 리뷰 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★구매평 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 경험한 제품 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 구매처 착오 및 제품 잘못 구매할 경우 : 페이백 미지급 및 선정취소 <br /> - 구매평 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 공정배너의 경우 리뷰등록화면 내에 코드를 복사하여 등록 부탁드립니다.(스크린샷 불가) <br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 구매평 캠페인의 경우 구매링크를 꼭 넣어주세요",
    ],
    contentType: "both" as const, // 링크 + 이미지
  },
  // review_2: 연장요청 탭
  {
    id: "2002",
    title: "화장품 구매평 리뷰",
    category: "구매평",
    image: "/images/main/campaign_img/eximg_2.png",
    subcategory: "뷰티",
    channel: "네이버블로그",
    points: 32000,
    description: "프리미엄 화장품 구매 후 사용 리뷰",
    recruitment: {
      current: 156,
      total: 12,
    },
    schedule: "",
    dayCount: "",
    isUrgent: true, // 긴급 캠페인
    registeredAt: "2026-01-08T14:20:00.000Z", // 등록 시간
    detailedSchedule: {
      // 진행 중 - 등록 기간 중
      applicationStart: "2026-01-20",
      applicationEnd: "2026-02-05",
      announcement: "2026-02-07",
      purchasePeriod: "2026-02-07 ~ 2026-02-10",
      registrationPeriod: "2026-02-10 ~ 2026-03-10",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    keyword: "#화장품리뷰 #뷰티 #스킨케어 #구매후기 #솔직리뷰",
    purchaseLink:
      "https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000123456",
    requirements: [
      "text_1500",
      "photo_10",
      "video_120",
      "product_link",
      "keyword",
    ],
    guidelineTexts: [
      "구매평 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★안내된 가격과 주문 가격이 상이한 경우 임의 주문하지 마시고, 꼭 1:1문의로 제보 부탁드립니다!!★",
      "★제공된 제품을 모두 활용하여 작성해주세요 - 화장품의 모든 기능을 체험해보세요 - 스킨케어, 메이크업 등 다양한 측면에서 리뷰 작성 - 실제 사용 모습과 후기를 솔직하게 작성<br />★구매평은 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★<br />★구매평 작성 시 실제 제품을 사용하시는 모습 사진 필수 첨부해주세요★<br />★구매평 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★구매평 작성 / 페이백 캠페인 입니다 (블로그 리뷰 작성 x)★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [선구매]로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 선구매 해주세요<br /> 3. 기간 내 리뷰 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★구매평 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 경험한 제품 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 구매처 착오 및 제품 잘못 구매할 경우 : 페이백 미지급 및 선정취소 <br /> - 구매평 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 공정배너의 경우 리뷰등록화면 내에 코드를 복사하여 등록 부탁드립니다.(스크린샷 불가) <br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 구매평 캠페인의 경우 구매링크를 꼭 넣어주세요",
    ],
    contentType: "both" as const, // 링크 + 이미지
  },
  // review_3: 신청 탭
  {
    id: "2003",
    title: "가전제품 구매평 리뷰",
    category: "구매평",
    image: "/images/main/campaign_img/eximg_3.png",
    subcategory: "생활",
    channel: "네이버블로그",
    points: 38000,
    description: "주방 가전제품 구매 후 사용 리뷰",
    recruitment: {
      current: 89,
      total: 6,
    },
    schedule: "",
    dayCount: "D-3",
    registeredAt: "2026-01-06T11:15:00.000Z", // 등록 시간
    detailedSchedule: {
      // 모집 중 - 현재 모집 진행 중
      applicationStart: "2026-01-04",
      applicationEnd: "2026-01-17",
      announcement: "2026-01-19",
      purchasePeriod: "2026-01-19 ~ 2026-01-22",
      registrationPeriod: "2026-01-22 ~ 2026-01-29",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    keyword: "#가전제품리뷰 #주방가전 #생활용품 #구매후기 #솔직리뷰",
    purchaseLink: "https://www.coupang.com/vp/products/1234567890",
    requirements: [
      "text_1500",
      "photo_10",
      "video_120",
      "product_link",
      "keyword",
    ],
    guidelineTexts: [
      "구매평 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★안내된 가격과 주문 가격이 상이한 경우 임의 주문하지 마시고, 꼭 1:1문의로 제보 부탁드립니다!!★",
      "★제공된 제품을 모두 활용하여 작성해주세요 - 가전제품의 모든 기능을 체험해보세요 - 사용법, 성능, 디자인 등 다양한 측면에서 리뷰 작성 - 실제 사용 모습과 후기를 솔직하게 작성<br />★구매평은 인위적이기 있고 최대한 자연스럽게 작성 부탁드립니다★<br />★구매평 작성 시 실제 제품을 사용하시는 모습 사진 필수 첨부해주세요★<br />★구매평 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★구매평 작성 / 페이백 캠페인 입니다 (블로그 리뷰 작성 x)★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [선구매]로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 선구매 해주세요<br /> 3. 기간 내 리뷰 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★구매평 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 경험한 제품 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 구매처 착오 및 제품 잘못 구매할 경우 : 페이백 미지급 및 선정취소 <br /> - 구매평 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 공정배너의 경우 리뷰등록화면 내에 코드를 복사하여 등록 부탁드립니다.(스크린샷 불가) <br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 구매평 캠페인의 경우 구매링크를 꼭 넣어주세요",
    ],
    contentType: "image" as const, // 이미지만
  },
  // review_4: 예정 탭
  {
    id: "2004",
    title: "의류 구매평 리뷰",
    category: "구매평",
    image: "/images/main/campaign_img/eximg_4.png",
    subcategory: "패션",
    channel: "네이버블로그",
    points: 28000,
    description: "패션 의류 구매 후 착용 리뷰",
    recruitment: {
      current: 178,
      total: 15,
    },
    schedule: "",
    dayCount: "D-7",
    registeredAt: "2026-01-09T13:30:00.000Z", // 등록 시간
    detailedSchedule: {
      // 모집 중 - 현재 날짜 기준 (2026-01-11 ~ 2026-01-24)
      applicationStart: "2026-01-11",
      applicationEnd: "2026-01-24",
      announcement: "2026-01-26",
      purchasePeriod: "2026-01-26 ~ 2026-01-29",
      registrationPeriod: "2026-01-29 ~ 2026-02-06",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    keyword: "#의류리뷰 #패션 #옷 #구매후기 #솔직리뷰",
    purchaseLink: "https://www.instagram.com/shopping/example-product",
    requirements: [
      "text_1500",
      "photo_10",
      "video_120",
      "product_link",
      "keyword",
    ],
    guidelineTexts: [
      "구매평 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★안내된 가격과 주문 가격이 상이한 경우 임의 주문하지 마시고, 꼭 1:1문의로 제보 부탁드립니다!!★",
      "★제공된 제품을 모두 활용하여 작성해주세요 - 의류의 모든 측면을 체험해보세요 - 착용감, 디자인, 소재 등 다양한 측면에서 리뷰 작성 - 실제 착용 모습과 후기를 솔직하게 작성<br />★구매평은 인위적이기 있고 최대한 자연스럽게 작성 부탁드립니다★<br />★구매평 작성 시 실제 제품을 착용하시는 모습 사진 필수 첨부해주세요★<br />★구매평 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★구매평 작성 / 페이백 캠페인 입니다 (블로그 리뷰 작성 x)★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [선구매]로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 선구매 해주세요<br /> 3. 기간 내 리뷰 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★구매평 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 경험한 제품 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 구매처 착오 및 제품 잘못 구매할 경우 : 페이백 미지급 및 선정취소 <br /> - 구매평 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 공정배너의 경우 리뷰등록화면 내에 코드를 복사하여 등록 부탁드립니다.(스크린샷 불가) <br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 구매평 캠페인의 경우 구매링크를 꼭 넣어주세요",
    ],
    contentType: "both" as const, // 링크 + 이미지
  },
  // review_5: 종료 탭
  {
    id: "2005",
    title: "식품 구매평 리뷰",
    category: "구매평",
    image: "/images/main/campaign_img/eximg_5.png",
    subcategory: "식품",
    channel: "네이버블로그",
    points: 22000,
    description: "프리미엄 식품 구매 후 맛 리뷰",
    recruitment: {
      current: 145,
      total: 18,
    },
    schedule: "",
    dayCount: "D-6",
    registeredAt: "2025-10-28T10:00:00.000Z", // 등록 시간
    detailedSchedule: {
      // 종료 탭 - registrationPeriod가 과거
      applicationStart: "2026-01-15",
      applicationEnd: "2026-01-30",
      announcement: "2025-11-17",
      purchasePeriod: "2025-11-17 ~ 2025-11-20",
      registrationPeriod: "2025-11-20 ~ 2025-11-27",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    keyword: "#식품리뷰 #음식 #구매후기 #솔직리뷰 #맛집",
    purchaseLink: "https://blog.naver.com/example-food-review",
    requirements: [
      "text_1500",
      "photo_10",
      "video_120",
      "product_link",
      "keyword",
    ],
    guidelineTexts: [
      "구매평 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★안내된 가격과 주문 가격이 상이한 경우 임의 주문하지 마시고, 꼭 1:1문의로 제보 부탁드립니다!!★",
      "★제공된 제품을 모두 활용하여 작성해주세요 - 식품의 모든 측면을 체험해보세요 - 맛, 향, 질감, 포장 등 다양한 측면에서 리뷰 작성 - 실제 섭취 모습과 후기를 솔직하게 작성<br />★구매평은 인위적이기 있고 최대한 자연스럽게 작성 부탁드립니다★<br />★구매평 작성 시 실제 제품을 섭취하시는 모습 사진 필수 첨부해주세요★<br />★구매평 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★구매평 작성 / 페이백 캠페인 입니다 (블로그 리뷰 작성 x)★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [선구매]로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 선구매 해주세요<br /> 3. 기간 내 리뷰 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★구매평 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 경험한 제품 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 구매처 착오 및 제품 잘못 구매할 경우 : 페이백 미지급 및 선정취소 <br /> - 구매평 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 공정배너의 경우 리뷰등록화면 내에 코드를 복사하여 등록 부탁드립니다.(스크린샷 불가) <br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 구매평 캠페인의 경우 구매링크를 꼭 넣어주세요",
    ],
    contentType: "image" as const, // 이미지만
  },
  // review_6: 신청 탭
  {
    id: "2006",
    title: "책 구매평 리뷰",
    category: "구매평",
    image: "/images/main/campaign_img/eximg_6.png",
    subcategory: "문화",
    channel: "네이버블로그",
    points: 18000,
    description: "베스트셀러 도서 구매 후 독서 리뷰",
    recruitment: {
      current: 98,
      total: 20,
    },
    schedule: "",
    dayCount: "D-4",
    registeredAt: "2025-12-20T15:20:00.000Z", // 등록 시간
    detailedSchedule: {
      // 구매 중 - 오늘 날짜 기준으로 구매 기간이 진행 중
      applicationStart: "2025-12-15",
      applicationEnd: "2026-01-05",
      announcement: "2026-01-07",
      purchasePeriod: "2026-01-12 ~ 2026-02-20",
      registrationPeriod: "2026-02-20 ~ 2026-03-05",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    keyword: "#책리뷰 #독서 #문화 #구매후기 #솔직리뷰",
    purchaseLink: "https://shopping.naver.com/example-book",
    requirements: [
      "text_1500",
      "photo_10",
      "video_120",
      "product_link",
      "keyword",
    ],
    guidelineTexts: [
      "구매평 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★안내된 가격과 주문 가격이 상이한 경우 임의 주문하지 마시고, 꼭 1:1문의로 제보 부탁드립니다!!★",
      "★제공된 제품을 모두 활용하여 작성해주세요 - 책의 모든 측면을 체험해보세요 - 내용, 구성, 디자인, 가독성 등 다양한 측면에서 리뷰 작성 - 실제 읽은 후기와 감상을 솔직하게 작성<br />★구매평은 인위적이기 있고 최대한 자연스럽게 작성 부탁드립니다★<br />★구매평 작성 시 실제 책을 읽으시는 모습 사진 필수 첨부해주세요★<br />★구매평 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★구매평 작성 / 페이백 캠페인 입니다 (블로그 리뷰 작성 x)★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [선구매]로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 선구매 해주세요<br /> 3. 기간 내 리뷰 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★구매평 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 경험한 제품 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 구매처 착오 및 제품 잘못 구매할 경우 : 페이백 미지급 및 선정취소 <br /> - 구매평 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 공정배너의 경우 리뷰등록화면 내에 코드를 복사하여 등록 부탁드립니다.(스크린샷 불가) <br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 구매평 캠페인의 경우 구매링크를 꼭 넣어주세요",
    ],
    contentType: "image" as const, // 이미지만
  },
  // review_7: 진행 탭 (구매 중 상태 테스트)
  {
    id: "2007",
    title: "운동화 구매평 리뷰",
    category: "구매평",
    image: "/images/main/campaign_img/eximg_7.png",
    subcategory: "패션",
    channel: "네이버블로그",
    points: 35000,
    description: "프리미엄 운동화 구매 후 착용 리뷰 영상",
    recruitment: {
      current: 67,
      total: 5,
    },
    schedule: "",
    dayCount: "D-1",
    registeredAt: "2025-12-25T10:00:00.000Z", // 등록 시간
    detailedSchedule: {
      // 진행 탭 - 구매 중 상태 (구매 기간 내, 등록 기간은 이후)
      // 모집 기간: 이미 종료 (2025-12-26 ~ 2025-12-30)
      // 선정 발표: 이미 지남 (2026-01-04)
      // 구매 기간: 오늘 날짜(2026-01-07)를 포함하도록 설정 (2026-01-05 ~ 2026-01-09)
      // 등록 기간: 구매 기간 이후 (2026-01-10 ~ 2026-01-20)
      applicationStart: "2026-01-28",
      applicationEnd: "2026-02-12",
      announcement: "2026-01-04",
      purchasePeriod: "2026-01-05 ~ 2026-01-09",
      registrationPeriod: "2026-01-10 ~ 2026-01-20",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    keyword: "#운동화리뷰 #신발 #패션 #구매후기 #솔직리뷰",
    purchaseLink: "https://www.youtube.com/watch?v=example-shoes",
    requirements: [
      "text_1500",
      "photo_10",
      "video_120",
      "product_link",
      "keyword",
    ],
    guidelineTexts: [
      "구매평 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★안내된 가격과 주문 가격이 상이한 경우 임의 주문하지 마시고, 꼭 1:1문의로 제보 부탁드립니다!!★",
      "★제공된 제품을 모두 활용하여 작성해주세요 - 운동화의 모든 측면을 체험해보세요 - 착용감, 디자인, 기능성, 내구성 등 다양한 측면에서 리뷰 작성 - 실제 착용 모습과 후기를 솔직하게 작성<br />★구매평은 인위적이기 있고 최대한 자연스럽게 작성 부탁드립니다★<br />★구매평 작성 시 실제 제품을 착용하시는 모습 사진 필수 첨부해주세요★<br />★구매평 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★구매평 작성 / 페이백 캠페인 입니다 (블로그 리뷰 작성 x)★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [선구매]로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 선구매 해주세요<br /> 3. 기간 내 리뷰 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★구매평 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 경험한 제품 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 구매처 착오 및 제품 잘못 구매할 경우 : 페이백 미지급 및 선정취소 <br /> - 구매평 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 공정배너의 경우 리뷰등록화면 내에 코드를 복사하여 등록 부탁드립니다.(스크린샷 불가) <br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 구매평 캠페인의 경우 구매링크를 꼭 넣어주세요",
    ],
    contentType: "link" as const, // 링크만
  },
  // review_8: 종료 탭
  {
    id: "2008",
    title: "반려동물 용품 구매평 리뷰",
    category: "구매평",
    image: "/images/main/campaign_img/eximg_8.png",
    subcategory: "반려동물",
    channel: "네이버블로그",
    points: 26000,
    description: "반려동물 용품 구매 후 사용 리뷰",
    recruitment: {
      current: 123,
      total: 10,
    },
    schedule: "",
    dayCount: "D-8",
    registeredAt: "2025-11-05T14:00:00.000Z", // 등록 시간
    detailedSchedule: {
      // 종료 탭 - registrationPeriod가 과거
      applicationStart: "2026-02-05",
      applicationEnd: "2026-02-20",
      announcement: "2025-11-27",
      purchasePeriod: "2025-11-27 ~ 2025-11-30",
      registrationPeriod: "2025-11-30 ~ 2025-12-07",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    keyword: "#반려동물용품 #펫용품 #구매후기 #솔직리뷰 #반려동물",
    purchaseLink: "https://www.coupang.com/vp/products/pet-supplies-123",
    requirements: [
      "text_1500",
      "photo_10",
      "video_120",
      "product_link",
      "keyword",
    ],
    guidelineTexts: [
      "구매평 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★안내된 가격과 주문 가격이 상이한 경우 임의 주문하지 마시고, 꼭 1:1문의로 제보 부탁드립니다!!★",
      "★제공된 제품을 모두 활용하여 작성해주세요 - 반려동물 용품의 모든 측면을 체험해보세요 - 사용성, 안전성, 내구성, 반려동물 반응 등 다양한 측면에서 리뷰 작성 - 실제 사용 모습과 후기를 솔직하게 작성<br />★구매평은 인위적이기 있고 최대한 자연스럽게 작성 부탁드립니다★<br />★구매평 작성 시 실제 제품을 사용하시는 모습 사진 필수 첨부해주세요★<br />★구매평 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★구매평 작성 / 페이백 캠페인 입니다 (블로그 리뷰 작성 x)★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [선구매]로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 선구매 해주세요<br /> 3. 기간 내 리뷰 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★구매평 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 경험한 제품 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 구매처 착오 및 제품 잘못 구매할 경우 : 페이백 미지급 및 선정취소 <br /> - 구매평 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 공정배너의 경우 리뷰등록화면 내에 코드를 복사하여 등록 부탁드립니다.(스크린샷 불가) <br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 구매평 캠페인의 경우 구매링크를 꼭 넣어주세요",
    ],
    contentType: "link" as const, // 링크만
  },
  // review_9: 진행 탭
  {
    id: "2009",
    title: "자동차 용품 구매평 리뷰",
    category: "구매평",
    image: "/images/main/campaign_img/eximg_9.png",
    subcategory: "자동차",
    channel: "네이버블로그",
    points: 42000,
    description: "자동차 액세서리 구매 후 설치 리뷰",
    recruitment: {
      current: 45,
      total: 4,
    },
    schedule: "",
    dayCount: "D-1",
    registeredAt: "2025-11-15T10:50:00.000Z", // 등록 시간
    detailedSchedule: {
      // 진행 탭 - applicationEnd가 과거, registrationPeriod가 미래 (announcement <= 오늘 <= registrationPeriod 끝)
      applicationStart: "2025-12-28",
      applicationEnd: "2026-01-15",
      announcement: "2025-12-07",
      purchasePeriod: "2025-12-07 ~ 2025-12-10",
      registrationPeriod: "2025-12-08 ~ 2026-01-25",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    keyword: "#자동차용품 #액세서리 #구매후기 #솔직리뷰 #자동차",
    purchaseLink: "https://shopping.naver.com/example-car-accessories",
    requirements: [
      "text_1500",
      "photo_10",
      "video_120",
      "product_link",
      "keyword",
    ],
    guidelineTexts: [
      "구매평 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★안내된 가격과 주문 가격이 상이한 경우 임의 주문하지 마시고, 꼭 1:1문의로 제보 부탁드립니다!!★",
      "★제공된 제품을 모두 활용하여 작성해주세요 - 자동차 용품의 모든 측면을 체험해보세요 - 설치성, 기능성, 내구성, 디자인 등 다양한 측면에서 리뷰 작성 - 실제 설치 및 사용 모습과 후기를 솔직하게 작성<br />★구매평은 인위적이기 있고 최대한 자연스럽게 작성 부탁드립니다★<br />★구매평 작성 시 실제 제품을 설치하시는 모습 사진 필수 첨부해주세요★<br />★구매평 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★구매평 작성 / 페이백 캠페인 입니다 (블로그 리뷰 작성 x)★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [선구매]로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 선구매 해주세요<br /> 3. 기간 내 리뷰 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★구매평 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 경험한 제품 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 구매처 착오 및 제품 잘못 구매할 경우 : 페이백 미지급 및 선정취소 <br /> - 구매평 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 공정배너의 경우 리뷰등록화면 내에 코드를 복사하여 등록 부탁드립니다.(스크린샷 불가) <br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 구매평 캠페인의 경우 구매링크를 꼭 넣어주세요",
    ],
    contentType: "both" as const, // 링크 + 이미지
  },
  // review_10: 취소 탭
  {
    id: "2010",
    title: "홈데코 구매평 리뷰",
    category: "구매평",
    image: "/images/main/campaign_img/eximg_10.png",
    subcategory: "생활",
    channel: "네이버블로그",
    points: 30000,
    description: "홈데코 제품 구매 후 인테리어 리뷰",
    recruitment: {
      current: 167,
      total: 12,
    },
    schedule: "",
    dayCount: "D-9",
    registeredAt: "2025-11-01T08:00:00.000Z", // 등록 시간
    detailedSchedule: {
      // 취소 탭 - status가 "취소"로 설정됨
      applicationStart: "2026-02-10",
      applicationEnd: "2026-02-25",
      announcement: "2025-11-22",
      purchasePeriod: "2025-11-22 ~ 2025-11-25",
      registrationPeriod: "2025-11-25 ~ 2025-12-02",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    keyword: "#홈데코 #인테리어 #구매후기 #솔직리뷰 #생활용품",
    purchaseLink: "https://blog.naver.com/example-homedeco-review",
    requirements: [
      "text_1500",
      "photo_10",
      "video_120",
      "product_link",
      "keyword",
    ],
    guidelineTexts: [
      "구매평 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★안내된 가격과 주문 가격이 상이한 경우 임의 주문하지 마시고, 꼭 1:1문의로 제보 부탁드립니다!!★",
      "★제공된 제품을 모두 활용하여 작성해주세요 - 홈데코 제품의 모든 측면을 체험해보세요 - 디자인, 품질, 사용성, 인테리어 효과 등 다양한 측면에서 리뷰 작성 - 실제 인테리어 적용 모습과 후기를 솔직하게 작성<br />★구매평은 인위적이기 있고 최대한 자연스럽게 작성 부탁드립니다★<br />★구매평 작성 시 실제 제품을 사용하시는 모습 사진 필수 첨부해주세요★<br />★구매평 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★구매평 작성 / 페이백 캠페인 입니다 (블로그 리뷰 작성 x)★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [선구매]로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 선구매 해주세요<br /> 3. 기간 내 리뷰 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★구매평 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 경험한 제품 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 구매처 착오 및 제품 잘못 구매할 경우 : 페이백 미지급 및 선정취소 <br /> - 구매평 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 공정배너의 경우 리뷰등록화면 내에 코드를 복사하여 등록 부탁드립니다.(스크린샷 불가) <br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 구매평 캠페인의 경우 구매링크를 꼭 넣어주세요",
    ],
    contentType: "link" as const, // 링크만
  },
  {
    id: "2011",
    title: "프리미엄 비타민C 세럼 구매평",
    category: "구매평",
    image: "/images/main/campaign_img/eximg_2.png",
    subcategory: "뷰티",
    channel: "배송형",
    points: 35000,
    description: "고농도 비타민C로 피부 탄력 개선 제품 구매평 모집 예정",
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
      purchasePeriod: "2026-02-07 ~ 2026-02-10",
      registrationPeriod: "2026-02-10 ~ 2026-02-17",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    keyword: "#비타민C세럼 #뷰티 #스킨케어 #구매평 #솔직후기",
    purchaseLink: "https://smartstore.naver.com/example-store/products/123456",
    requirements: [
      "text_1500",
      "photo_10",
      "video_120",
      "product_link",
      "keyword",
    ],
    guidelineTexts: [
      "구매평 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★안내된 가격과 주문 가격이 상이한 경우 임의 주문하지 마시고, 꼭 1:1문의로 제보 부탁드립니다!!★",
      "★제공된 제품을 모두 활용하여 작성해주세요 - 비타민C 세럼의 모든 측면을 체험해보세요 - 사용감, 효과, 향, 질감 등 다양한 측면에서 리뷰 작성 - 실제 사용 전후 비교 사진과 체험 과정을 상세히 기록<br />★구매평은 인위적이기 있고 최대한 자연스럽게 작성 부탁드립니다★<br />★구매평 작성 시 실제 제품을 사용하시는 모습 사진 필수 첨부해주세요★<br />★구매평 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★구매평 작성 / 페이백 캠페인 입니다 (블로그 리뷰 작성 x)★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [선구매]로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 선구매 해주세요<br /> 3. 기간 내 리뷰 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★구매평 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 경험한 제품 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 구매처 착오 및 제품 잘못 구매할 경우 : 페이백 미지급 및 선정취소 <br /> - 구매평 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 공정배너의 경우 리뷰등록화면 내에 코드를 복사하여 등록 부탁드립니다.(스크린샷 불가) <br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 구매평 캠페인의 경우 구매링크를 꼭 넣어주세요",
    ],
    contentType: "both" as const, // 링크 + 이미지
  },
  // review_12: 마감임박
  {
    id: "2012",
    title: "[마감임박] 프리미엄 무선 이어폰 구매평",
    category: "구매평",
    image: "/images/main/campaign_img/eximg_1.png",
    subcategory: "디지털",
    channel: "", // 구매평은 채널 없음
    points: 28000,
    description: "프리미엄 무선 이어폰 구매 후 상세 리뷰 작성",
    recruitment: {
      current: 3, // 신청자 수 적게 설정
      total: 5,
    },
    schedule: "",
    dayCount: "D-2",
    registeredAt: "2026-01-11T11:30:00.000Z", // 등록 시간
    detailedSchedule: {
      // 모집 중 - 현재 날짜 기준 (2026-01-13 ~ 2026-01-26)
      applicationStart: "2026-01-13",
      applicationEnd: "2026-01-26",
      announcement: "2026-01-28",
      purchasePeriod: "2026-01-28 ~ 2026-01-31",
      registrationPeriod: "2026-01-31 ~ 2026-02-08",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    keyword: "#무선이어폰 #구매평 #오디오 #디지털기기 #솔직후기",
    purchaseLink:
      "https://smartstore.naver.com/example-store/products/wireless-earphone",
    requirements: [
      "text_2000",
      "photo_15",
      "video_1_180",
      "product_link",
      "keyword",
    ],
    guidelineTexts: [
      "구매평 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★안내된 가격과 주문 가격이 상이한 경우 임의 주문하지 마시고, 꼭 1:1문의로 제보 부탁드립니다!! 네이버 멤버십 계정이시면 가격이 낮은 경우가 간혹 발생하여 안내드린 가격과 다를 경우, [ 멤버십이 아닌 네이버 계정으로 고지된 금액에 맞게 구매 ] 부탁드립니다★",
      "★제공된 제품을 모두 활용하여 작성해주세요 - 무선 이어폰의 모든 기능을 체험해보세요 - 음질, 배터리, 착용감, 연결성 등 다양한 측면에서 리뷰 작성 - 실제 사용 모습과 후기를 솔직하게 작성<br />★구매평은 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★<br />★구매평 작성 시 실제 제품을 사용하시는 모습 사진 필수 첨부해주세요★<br />★구매평 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★구매평 작성 / 페이백 캠페인 입니다 (블로그 리뷰 작성 x)★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [선구매]로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 선구매 해주세요<br /> 3. 기간 내 리뷰 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★구매평 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 경험한 제품 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 구매처 착오 및 제품 잘못 구매할 경우 : 페이백 미지급 및 선정취소 <br /> - 구매평 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 공정배너의 경우 리뷰등록화면 내에 코드를 복사하여 등록 부탁드립니다.(스크린샷 불가) <br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 구매평 캠페인의 경우 구매링크를 꼭 넣어주세요",
    ],
    contentType: "both" as const, // 링크 + 이미지
  },
  // review_13: 테스트용 구매평 캠페인 (구매 기간 지남, 등록 기간 진행 중)
  {
    id: "2013",
    title: "테스트용 구매평 리뷰 캠페인",
    category: "구매평",
    image: "/images/main/campaign_img/eximg_1.png",
    subcategory: "생활",
    channel: "네이버블로그",
    points: 30000,
    description: "테스트용 구매평 리뷰 캠페인입니다",
    recruitment: {
      current: 5,
      total: 10,
    },
    schedule: "",
    dayCount: "D-8",
    registeredAt: "2025-12-20T10:00:00.000Z",
    detailedSchedule: {
      // 구매 기간: 2026-01-01 ~ 2026-01-05 (지남)
      // 등록 기간: 2026-01-06 ~ 2026-01-15 (현재 진행 중)
      applicationStart: "2026-01-12",
      applicationEnd: "2026-01-27",
      announcement: "2026-01-05",
      purchasePeriod: "2026-01-01 ~ 2026-01-05",
      registrationPeriod: "2026-01-06 ~ 2026-01-15",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    keyword: "#테스트 #구매평 #리뷰 #생활용품",
    purchaseLink: "https://smartstore.naver.com/example-store/products/test",
    requirements: [
      "text_1500",
      "photo_10",
      "video_120",
      "product_link",
      "keyword",
    ],
    guidelineTexts: [
      "구매평 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★안내된 가격과 주문 가격이 상이한 경우 임의 주문하지 마시고, 꼭 1:1문의로 제보 부탁드립니다!!★",
      "★제공된 제품을 모두 활용하여 작성해주세요 - 실제 사용 모습과 후기를 솔직하게 작성<br />★구매평은 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★<br />★구매평 작성 시 실제 제품을 사용하시는 모습 사진 필수 첨부해주세요★<br />★구매평 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★구매평 작성 / 페이백 캠페인 입니다 (블로그 리뷰 작성 x)★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [선구매]로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 선구매 해주세요<br /> 3. 기간 내 리뷰 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★구매평 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 경험한 제품 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 구매처 착오 및 제품 잘못 구매할 경우 : 페이백 미지급 및 선정취소 <br /> - 구매평 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 공정배너의 경우 리뷰등록화면 내에 코드를 복사하여 등록 부탁드립니다.(스크린샷 불가) <br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 구매평 캠페인의 경우 구매링크를 꼭 넣어주세요",
    ],
    contentType: "both" as const, // 링크 + 이미지
  },
];

/* ========================================
   📝 구매평 캠페인 확장 타입 정의 (신청자 데이터 + 종료/취소 데이터)
   ======================================== */

/**
 * 구매평 캠페인 확장 데이터 타입
 *
 * 설명:
 * - 기존 ReviewCampaignData 타입을 확장하여 신청자 데이터와 종료/취소 데이터를 포함합니다.
 * - 파트너 관리 페이지에서 사용하는 통합 데이터 구조입니다.
 * - 기존 ReviewCampaignData 타입은 유지하여 사용자 페이지와의 호환성을 보장합니다.
 */
export interface ReviewCampaignDataExtended {
  // 기존 ReviewCampaignData의 모든 필드 포함
  id: string;
  title: string;
  category: string;
  image: string;
  subcategory: string;
  channel: string; // 채널 (네이버블로그, 네이버클립, 인스타그램 등)
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
    purchasePeriod: string;
    registrationPeriod: string;
  };
  campaign_detail_image: string;
  campaign_detail_images?: string[]; // 캠페인 상세 이미지 경로 배열 (여러 이미지)
  keyword: string;
  purchaseLink?: string;
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
      receiptImages?: string[];
      thumbnailSrc?: string;
      extension_request_reason?: string;
      isRejected?: boolean;
      reject_reason?: string;
      isReported?: boolean;
      reportedDate?: string;
    }>;
    reviewing: Array<{
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
      receiptImages?: string[];
      thumbnailSrc?: string;
    }>;
    completed: Array<{
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
      receiptImages?: string[];
      thumbnailSrc?: string;
    }>;
  };
}

/**
 * 구매평 캠페인 확장 데이터 (파트너 관리용) - 신청자 데이터 포함
 *
 * 설명:
 * - 파트너 관리 페이지에서 사용하는 구매평 캠페인 데이터입니다.
 * - 신청자 데이터와 종료/취소 데이터를 포함합니다.
 * - 각 캠페인마다 직접 예시 신청자 데이터를 포함합니다.
 */
/**
 * 구매평 캠페인 확장 데이터 (파트너 관리용) - 신청자 데이터 포함
 *
 * 설명:
 * - 파트너 관리 페이지에서 사용하는 구매평 캠페인 데이터입니다.
 * - 신청자 데이터와 종료/취소 데이터를 포함합니다.
 * - 각 캠페인마다 직접 예시 신청자 데이터를 포함합니다.
 */
export const reviewCampaignsExtended: ReviewCampaignDataExtended[] = [
  // review_1: 스마트폰 구매평 리뷰
  {
    ...reviewCampaigns[0],
    applicantData: {
      applicants: [
        {
          id: "app_review_1_네이버블로그_001",
          Id: "eunji123",
          nickname: "은지블로그",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 100,
          totalVisits: 10000,
          neighbors: 500,
          memo: "성실하게 리뷰 작성합니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-15",
        },
        {
          id: "app_review_1_네이버블로그_001_old",
          Id: "reviewer_review_1_001",
          nickname: "스마트폰구매평리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 150,
          totalVisits: 450000,
          neighbors: 1100,
          memo: "스마트폰 구매평 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-15",
        },
        {
          id: "app_review_1_네이버블로그_002",
          Id: "reviewer_review_1_002",
          nickname: "디지털전문가B",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 180,
          totalVisits: 580000,
          neighbors: 1500,
          memo: "상세한 디지털 제품 후기 작성 능력이 뛰어납니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-16",
        },
        {
          id: "app_review_1_네이버블로그_003",
          Id: "reviewer_review_1_003",
          nickname: "스마트폰인플루언서C",
          userType: "인플루언서" as const,
          profileImage: "/images/mypage/profile.svg",
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
          id: "app_review_1_네이버블로그_004",
          Id: "reviewer_review_1_004",
          nickname: "구매평퀸D",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
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
          id: "app_review_1_네이버블로그_005",
          Id: "reviewer_review_1_005",
          nickname: "스마트폰마스터E",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 200,
          totalVisits: 650000,
          neighbors: 1800,
          memo: "고품질 구매평 리뷰 전문가입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-19",
        },
      ],
      selectedApplicants: [],
    },
  },
  // review_2: 화장품 구매평 리뷰
  {
    ...reviewCampaigns[1],
    isUrgent: true, // 긴급 캠페인
    applicantData: {
      applicants: [
        {
          id: "app_review_2_네이버블로그_001",
          Id: "reviewer_review_2_001",
          nickname: "화장품구매평리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 120,
          totalVisits: 400000,
          neighbors: 900,
          memo: "뷰티 제품 구매평 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-18",
        },
        {
          id: "app_review_2_네이버블로그_002",
          Id: "reviewer_review_2_002",
          nickname: "뷰티리뷰어B",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 160,
          totalVisits: 500000,
          neighbors: 1200,
          memo: "화장품 리뷰를 자주 작성합니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-19",
        },
        {
          id: "app_review_2_네이버블로그_003",
          Id: "reviewer_review_2_003",
          nickname: "뷰티인플루언서C",
          userType: "인플루언서" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 250,
          totalVisits: 750000,
          neighbors: 2200,
          memo: "뷰티 전문 인플루언서입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-20",
        },
      ],
      selectedApplicants: [
        {
          id: "sel_review_2_네이버블로그_001",
          Id: "selected_review_2_001",
          nickname: "선정된화장품구매평리뷰어1",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 320,
          totalVisits: 950000,
          neighbors: 2800,
          memo: "이미 선정된 우수 리뷰어입니다.",
          selectionStatus: "선정하기" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-18",
        },
      ],
    },
    contents: {
      waiting: [
        // 1. 콘텐츠 미등록 (기본 케이스)
        {
          id: "content_review_2_waiting_001",
          createdAt: "2025-12-20T10:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "화장품구매평리뷰어A",
          channelId: "blog_021",
          channel: "네이버블로그",
          profileImage: "/images/test_img/eximg.png",
          actionType: 0,
          thumbnailSrc: undefined,
        },
        // 2. 등록 기한 연장 요청
        {
          id: "content_review_2_waiting_002",
          createdAt: "2025-12-21T11:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "뷰티리뷰어B",
          channelId: "blog_022",
          channel: "네이버블로그",
          profileImage: "/images/test_img/eximg3.png",
          actionType: 0,
          thumbnailSrc: undefined,
          extension_request_reason:
            "개인 사정으로 인해 등록 기한을 연장해주시면 감사하겠습니다. 3일만 더 주시면 충분히 좋은 리뷰를 작성할 수 있을 것 같습니다.",
        },
        // 3. 연장 승인 후 아직 등록 안함 (확인용 - 실제로는 extension_request_reason이 없고 연장된 상태)
        {
          id: "content_review_2_waiting_003",
          createdAt: "2025-12-19T09:00:00.000Z",
          status: "검수" as const,
          userType: "인플루언서" as const,
          nickname: "연장승인리뷰어C",
          channelId: "blog_025",
          channel: "네이버블로그",
          profileImage: "/images/test_img/eximg.png",
          actionType: 0,
          thumbnailSrc: undefined,
        },
        // 4. 반려 처리
        {
          id: "content_review_2_waiting_004",
          createdAt: "2025-12-17T08:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "반려된리뷰어D",
          channelId: "blog_026",
          channel: "네이버블로그",
          profileImage: "/images/test_img/eximg3.png",
          actionType: 0,
          thumbnailSrc: "/images/test_img/eximg.png",
          isRejected: true,
          reject_reason:
            "리뷰 내용이 요구사항에 부합하지 않습니다. 제품의 주요 기능에 대한 설명이 부족하고, 사진의 품질이 낮습니다. 수정 후 재제출 부탁드립니다.",
        },
        // 5. 신고 처리
        {
          id: "content_review_2_waiting_005",
          createdAt: "2025-12-16T07:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "신고된리뷰어E",
          channelId: "blog_027",
          channel: "네이버블로그",
          profileImage: "/images/test_img/eximg.png",
          actionType: 0,
          thumbnailSrc: "/images/test_img/eximg3.png",
          isReported: true,
          reportedDate: "2025-12-20 17:37",
        },
      ],
      reviewing: [
        // 1. 최초 등록 (updatedAt 없음)
        {
          id: "content_review_2_reviewing_001",
          createdAt: "2025-12-18T09:00:00.000Z",
          status: "검수중" as const,
          userType: "인플루언서" as const,
          nickname: "뷰티인플루언서F",
          channelId: "blog_028",
          channel: "네이버블로그",
          isRejected: false,
          isLate: false,
          profileImage: "/images/test_img/eximg.png",
          actionType: 0,
          thumbnailSrc: "/images/test_img/eximg.png",
        },
        // 2. 수정 (updatedAt 있음)
        {
          id: "content_review_2_reviewing_002",
          createdAt: "2025-12-15T08:00:00.000Z",
          status: "검수중" as const,
          userType: "리뷰어" as const,
          nickname: "수정한리뷰어G",
          channelId: "blog_029",
          channel: "네이버블로그",
          updatedAt: "2025-12-19T10:00:00.000Z",
          isRejected: false,
          isLate: false,
          profileImage: "/images/test_img/eximg3.png",
          actionType: 0,
          thumbnailSrc: "/images/test_img/eximg3.png",
        },
        // 3. 지각 등록 (isLate: true)
        {
          id: "content_review_2_reviewing_003",
          createdAt: "2025-12-14T07:00:00.000Z",
          status: "검수중" as const,
          userType: "리뷰어" as const,
          nickname: "지각등록리뷰어H",
          channelId: "blog_030",
          channel: "네이버블로그",
          updatedAt: "2025-12-20T17:37:00.000Z",
          isRejected: false,
          isLate: true,
          profileImage: "/images/test_img/eximg.png",
          actionType: 0,
          thumbnailSrc: "/images/test_img/eximg.png",
        },
      ],
      completed: [
        // 1. 확인 완료 (최초 등록)
        {
          id: "content_review_2_completed_001",
          createdAt: "2025-12-15T08:00:00.000Z",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "선정된화장품구매평리뷰어1",
          channelId: "blog_024",
          channel: "네이버블로그",
          isLate: false,
          profileImage: "/images/test_img/eximg3.png",
          actionType: 0,
          thumbnailSrc: "/images/test_img/eximg3.png",
        },
        // 2. 확인 완료 (수정 후)
        {
          id: "content_review_2_completed_002",
          createdAt: "2025-12-13T06:00:00.000Z",
          status: "완료" as const,
          userType: "인플루언서" as const,
          nickname: "수정완료리뷰어I",
          channelId: "blog_031",
          channel: "네이버블로그",
          updatedAt: "2025-12-16T09:00:00.000Z",
          isLate: false,
          profileImage: "/images/test_img/eximg.png",
          actionType: 0,
          thumbnailSrc: "/images/test_img/eximg.png",
        },
      ],
    },
  },
  // review_3: 가전제품 구매평 리뷰
  {
    ...reviewCampaigns[2],
    applicantData: {
      applicants: [
        {
          id: "app_review_3_네이버블로그_001",
          Id: "reviewer_review_3_001",
          nickname: "가전제품구매평리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 140,
          totalVisits: 420000,
          neighbors: 1000,
          memo: "가전제품 구매평 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-20",
        },
        {
          id: "app_review_3_네이버블로그_002",
          Id: "reviewer_review_3_002",
          nickname: "가전인플루언서B",
          userType: "인플루언서" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 280,
          totalVisits: 850000,
          neighbors: 2500,
          memo: "가전제품 전문 인플루언서입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-21",
        },
        {
          id: "app_review_3_네이버블로그_003",
          Id: "reviewer_review_3_003",
          nickname: "가전리뷰어C",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 110,
          totalVisits: 350000,
          neighbors: 800,
          memo: "가전제품 리뷰를 자주 작성합니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-22",
        },
      ],
      selectedApplicants: [
        {
          id: "sel_review_3_네이버블로그_001",
          Id: "selected_review_3_001",
          nickname: "선정된가전제품구매평리뷰어1",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
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
          id: "content_review_3_waiting_001",
          createdAt: "2025-12-20T10:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "가전제품구매평리뷰어A",
          channelId: "blog_025",
          channel: "네이버블로그",
          profileImage: "/images/test_img/eximg.png",
          actionType: 0,
          thumbnailSrc: "/images/test_img/eximg3.png",
        },
        {
          id: "content_review_3_waiting_002",
          createdAt: "2025-12-21T11:00:00.000Z",
          status: "검수" as const,
          userType: "인플루언서" as const,
          nickname: "가전인플루언서B",
          channelId: "blog_026",
          channel: "네이버블로그",
          profileImage: "/images/test_img/eximg3.png",
          actionType: 1,
          receiptImages: ["/images/test_img/eximg.png"],
        },
      ],
      reviewing: [
        {
          id: "content_review_3_reviewing_001",
          createdAt: "2025-12-19T09:00:00.000Z",
          status: "검수중" as const,
          userType: "리뷰어" as const,
          nickname: "가전리뷰어C",
          channelId: "blog_027",
          channel: "네이버블로그",
          updatedAt: "2025-12-20T10:00:00.000Z",
          isRejected: false,
          isLate: false,
          profileImage: "/images/test_img/eximg.png",
          actionType: 0,
          thumbnailSrc: "/images/test_img/eximg.png",
        },
      ],
      completed: [
        {
          id: "content_review_3_completed_001",
          createdAt: "2025-12-18T08:00:00.000Z",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "선정된가전제품구매평리뷰어1",
          channelId: "blog_028",
          channel: "네이버블로그",
          updatedAt: "2025-12-19T09:00:00.000Z",
          isLate: false,
          profileImage: "/images/test_img/eximg3.png",
          actionType: 0,
          thumbnailSrc: "/images/test_img/eximg3.png",
        },
      ],
    },
  },
  // review_4: 의류 구매평 리뷰
  {
    ...reviewCampaigns[3],
    applicantData: {
      applicants: [
        {
          id: "app_review_4_네이버블로그_001",
          Id: "reviewer_review_4_001",
          nickname: "의류구매평리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 130,
          totalVisits: 380000,
          neighbors: 950,
          memo: "패션 의류 구매평 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-25",
        },
        {
          id: "app_review_4_네이버블로그_002",
          Id: "reviewer_review_4_002",
          nickname: "패션전문가B",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 170,
          totalVisits: 520000,
          neighbors: 1300,
          memo: "패션 리뷰를 많이 작성합니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-26",
        },
        {
          id: "app_review_4_네이버블로그_003",
          Id: "reviewer_review_4_003",
          nickname: "스타일리스트C",
          userType: "인플루언서" as const,
          profileImage: "/images/test_img/eximg.png",
          memberType: "모범 회원" as const,
          dailyVisits: 210,
          totalVisits: 650000,
          neighbors: 1800,
          memo: "패션 스타일링 전문 인플루언서입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-27",
        },
        {
          id: "app_review_4_인스타그램_001",
          Id: "reviewer_review_4_004",
          nickname: "패션인플루언서D",
          userType: "인플루언서" as const,
          profileImage: "/images/test_img/eximg3.png",
          memberType: "모범 회원" as const,
          dailyVisits: 150,
          totalVisits: 420000,
          neighbors: 1100,
          memo: "인스타그램 패션 콘텐츠 제작자입니다.",
          selectionStatus: "미선택" as const,
          channel: "인스타그램",
          registrationDate: "2025-12-25",
        },
        {
          id: "app_review_4_네이버블로그_004",
          Id: "reviewer_review_4_005",
          nickname: "옷장리뷰어E",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 140,
          totalVisits: 410000,
          neighbors: 1050,
          memo: "의류 구매 후 상세 리뷰 작성합니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-28",
        },
        {
          id: "app_review_4_유튜브_001",
          Id: "reviewer_review_4_006",
          nickname: "패션유튜버F",
          userType: "인플루언서" as const,
          profileImage: "/images/test_img/eximg.png",
          memberType: "모범 회원" as const,
          dailyVisits: 280,
          totalVisits: 850000,
          neighbors: 2500,
          memo: "패션 유튜브 채널 운영 중입니다.",
          selectionStatus: "미선택" as const,
          channel: "유튜브",
          registrationDate: "2025-12-26",
        },
        {
          id: "app_review_4_네이버블로그_005",
          Id: "reviewer_review_4_007",
          nickname: "의류리뷰전문가G",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 120,
          totalVisits: 350000,
          neighbors: 880,
          memo: "의류 구매평 전문으로 활동 중입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-29",
        },
        {
          id: "app_review_4_인스타그램_002",
          Id: "reviewer_review_4_008",
          nickname: "스타일리스트H",
          userType: "인플루언서" as const,
          profileImage: "/images/test_img/eximg3.png",
          memberType: "모범 회원" as const,
          dailyVisits: 190,
          totalVisits: 580000,
          neighbors: 1600,
          memo: "패션 스타일링 콘텐츠 제작합니다.",
          selectionStatus: "미선택" as const,
          channel: "인스타그램",
          registrationDate: "2025-12-27",
        },
        {
          id: "app_review_4_네이버블로그_006",
          Id: "reviewer_review_4_009",
          nickname: "패션구매평리뷰어I",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 160,
          totalVisits: 480000,
          neighbors: 1200,
          memo: "패션 의류 구매평을 꾸준히 작성합니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-30",
        },
        {
          id: "app_review_4_유튜브_002",
          Id: "reviewer_review_4_010",
          nickname: "의류리뷰유튜버J",
          userType: "인플루언서" as const,
          profileImage: "/images/test_img/eximg.png",
          memberType: "모범 회원" as const,
          dailyVisits: 220,
          totalVisits: 680000,
          neighbors: 2000,
          memo: "의류 리뷰 영상 제작 전문입니다.",
          selectionStatus: "미선택" as const,
          channel: "유튜브",
          registrationDate: "2025-12-28",
        },
        {
          id: "app_review_4_네이버블로그_007",
          Id: "reviewer_review_4_011",
          nickname: "패션블로거K",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 180,
          totalVisits: 540000,
          neighbors: 1400,
          memo: "패션 블로그 운영 중입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-31",
        },
        {
          id: "app_review_4_인스타그램_003",
          Id: "reviewer_review_4_012",
          nickname: "패션인플루언서L",
          userType: "인플루언서" as const,
          profileImage: "/images/test_img/eximg3.png",
          memberType: "모범 회원" as const,
          dailyVisits: 200,
          totalVisits: 620000,
          neighbors: 1700,
          memo: "패션 인플루언서로 활동 중입니다.",
          selectionStatus: "미선택" as const,
          channel: "인스타그램",
          registrationDate: "2026-01-01",
        },
        {
          id: "app_review_4_네이버블로그_008",
          Id: "reviewer_review_4_013",
          nickname: "의류구매평전문가M",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 110,
          totalVisits: 320000,
          neighbors: 800,
          memo: "의류 구매평 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2026-01-02",
        },
        {
          id: "app_review_4_유튜브_003",
          Id: "reviewer_review_4_014",
          nickname: "패션리뷰유튜버N",
          userType: "인플루언서" as const,
          profileImage: "/images/test_img/eximg.png",
          memberType: "모범 회원" as const,
          dailyVisits: 250,
          totalVisits: 750000,
          neighbors: 2200,
          memo: "패션 리뷰 영상 전문 유튜버입니다.",
          selectionStatus: "미선택" as const,
          channel: "유튜브",
          registrationDate: "2025-12-29",
        },
        {
          id: "app_review_4_네이버블로그_009",
          Id: "reviewer_review_4_015",
          nickname: "스타일리뷰어O",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 145,
          totalVisits: 430000,
          neighbors: 1100,
          memo: "스타일링 리뷰를 작성합니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2026-01-03",
        },
        {
          id: "app_review_4_인스타그램_004",
          Id: "reviewer_review_4_016",
          nickname: "패션스타일리스트P",
          userType: "인플루언서" as const,
          profileImage: "/images/test_img/eximg3.png",
          memberType: "모범 회원" as const,
          dailyVisits: 165,
          totalVisits: 490000,
          neighbors: 1300,
          memo: "패션 스타일링 콘텐츠 제작합니다.",
          selectionStatus: "미선택" as const,
          channel: "인스타그램",
          registrationDate: "2026-01-01",
        },
        {
          id: "app_review_4_네이버블로그_010",
          Id: "reviewer_review_4_017",
          nickname: "의류구매평블로거Q",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 155,
          totalVisits: 460000,
          neighbors: 1150,
          memo: "의류 구매평 블로그 운영 중입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2026-01-04",
        },
        {
          id: "app_review_4_유튜브_004",
          Id: "reviewer_review_4_018",
          nickname: "패션유튜버R",
          userType: "인플루언서" as const,
          profileImage: "/images/test_img/eximg.png",
          memberType: "모범 회원" as const,
          dailyVisits: 230,
          totalVisits: 710000,
          neighbors: 2100,
          memo: "패션 유튜브 채널 운영 중입니다.",
          selectionStatus: "미선택" as const,
          channel: "유튜브",
          registrationDate: "2025-12-30",
        },
        {
          id: "app_review_4_네이버블로그_011",
          Id: "reviewer_review_4_019",
          nickname: "패션리뷰전문가S",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 135,
          totalVisits: 400000,
          neighbors: 1000,
          memo: "패션 리뷰 전문으로 활동 중입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2026-01-05",
        },
        {
          id: "app_review_4_인스타그램_005",
          Id: "reviewer_review_4_020",
          nickname: "의류인플루언서T",
          userType: "인플루언서" as const,
          profileImage: "/images/test_img/eximg3.png",
          memberType: "모범 회원" as const,
          dailyVisits: 175,
          totalVisits: 530000,
          neighbors: 1500,
          memo: "의류 인플루언서로 활동 중입니다.",
          selectionStatus: "미선택" as const,
          channel: "인스타그램",
          registrationDate: "2026-01-02",
        },
        {
          id: "app_review_4_네이버블로그_012",
          Id: "reviewer_review_4_021",
          nickname: "패션구매평리뷰어U",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 148,
          totalVisits: 440000,
          neighbors: 1120,
          memo: "패션 구매평 리뷰를 작성합니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2026-01-06",
        },
        {
          id: "app_review_4_유튜브_005",
          Id: "reviewer_review_4_022",
          nickname: "스타일리뷰유튜버V",
          userType: "인플루언서" as const,
          profileImage: "/images/test_img/eximg.png",
          memberType: "모범 회원" as const,
          dailyVisits: 195,
          totalVisits: 590000,
          neighbors: 1800,
          memo: "스타일링 리뷰 영상 제작합니다.",
          selectionStatus: "미선택" as const,
          channel: "유튜브",
          registrationDate: "2026-01-03",
        },
      ],
      selectedApplicants: [],
    },
  },
  // review_5: 식품 구매평 리뷰
  {
    ...reviewCampaigns[4],
    applicantData: {
      applicants: [
        {
          id: "app_review_5_네이버블로그_001",
          Id: "reviewer_review_5_001",
          nickname: "식품구매평리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 100,
          totalVisits: 300000,
          neighbors: 750,
          memo: "식품 전문 구매평 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-10",
        },
      ],
      selectedApplicants: [],
    },
    contents: {
      reviewing: [
        {
          id: "content_review_5_001",
          createdAt: "2025-11-20",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "식품구매평리뷰어A",
          channelId: "blog_001",
          channel: "네이버블로그",
          updatedAt: "2025-11-25",
          isRejected: false,
          isLate: false,
        },
        {
          id: "content_review_5_002",
          createdAt: "2025-11-21",
          status: "검수중" as const,
          userType: "인플루언서" as const,
          nickname: "식품인플루언서B",
          channelId: "blog_002",
          channel: "네이버블로그",
          updatedAt: "2025-11-26",
          isRejected: false,
          isLate: false,
        },
      ],
      completed: [
        {
          id: "content_review_5_003",
          createdAt: "2025-11-22",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "식품리뷰어C",
          channelId: "blog_003",
          channel: "네이버블로그",
          updatedAt: "2025-11-27",
          isLate: false,
        },
        {
          id: "content_review_5_004",
          createdAt: "2025-11-23",
          status: "완료" as const,
          userType: "인플루언서" as const,
          nickname: "식품인플루언서D",
          channelId: "blog_004",
          channel: "네이버블로그",
          updatedAt: "2025-11-28",
          isLate: false,
        },
      ],
    },
  },
  // review_6: 책 구매평 리뷰
  {
    ...reviewCampaigns[5],
    applicantData: {
      applicants: [
        {
          id: "app_review_6_네이버블로그_001",
          Id: "reviewer_review_6_001",
          nickname: "책구매평리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 160,
          totalVisits: 480000,
          neighbors: 1100,
          memo: "도서 구매평 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-19",
        },
        {
          id: "app_review_6_네이버블로그_002",
          Id: "reviewer_review_6_002",
          nickname: "독서인플루언서B",
          userType: "인플루언서" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 240,
          totalVisits: 720000,
          neighbors: 1900,
          memo: "독서 전문 인플루언서입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-20",
        },
        {
          id: "app_review_6_네이버블로그_003",
          Id: "reviewer_review_6_003",
          nickname: "책전문가C",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 190,
          totalVisits: 570000,
          neighbors: 1400,
          memo: "책 리뷰를 자주 작성합니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-21",
        },
      ],
      selectedApplicants: [
        {
          id: "sel_review_6_네이버블로그_001",
          Id: "selected_review_6_001",
          nickname: "선정된책구매평리뷰어1",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 310,
          totalVisits: 930000,
          neighbors: 2600,
          memo: "이미 선정된 우수 리뷰어입니다.",
          selectionStatus: "선정하기" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-19",
        },
      ],
    },
    contents: {
      waiting: [
        {
          id: "content_review_6_waiting_001",
          createdAt: "2025-12-20T10:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "책구매평리뷰어A",
          channelId: "blog_032",
          channel: "네이버블로그",
          profileImage: "/images/test_img/eximg.png",
          actionType: 0,
          thumbnailSrc: "/images/test_img/eximg3.png",
        },
        {
          id: "content_review_6_waiting_002",
          createdAt: "2025-12-21T11:00:00.000Z",
          status: "검수" as const,
          userType: "인플루언서" as const,
          nickname: "독서인플루언서B",
          channelId: "blog_033",
          channel: "네이버블로그",
          profileImage: "/images/test_img/eximg3.png",
          actionType: 1,
          receiptImages: ["/images/test_img/eximg.png"],
        },
      ],
      reviewing: [
        {
          id: "content_review_6_reviewing_001",
          createdAt: "2025-12-19T09:00:00.000Z",
          status: "검수중" as const,
          userType: "리뷰어" as const,
          nickname: "책전문가C",
          channelId: "blog_034",
          channel: "네이버블로그",
          updatedAt: "2025-12-20T10:00:00.000Z",
          isRejected: false,
          isLate: false,
          profileImage: "/images/test_img/eximg.png",
          actionType: 0,
          thumbnailSrc: "/images/test_img/eximg.png",
          receiptImages: [
            "/images/test_img/eximg.png",
            "/images/test_img/eximg3.png",
            "/images/test_img/eximg.png",
          ],
        },
      ],
      completed: [
        {
          id: "content_review_6_completed_001",
          createdAt: "2025-12-18T08:00:00.000Z",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "선정된책구매평리뷰어1",
          channelId: "blog_035",
          channel: "네이버블로그",
          updatedAt: "2025-12-19T09:00:00.000Z",
          isLate: false,
          profileImage: "/images/test_img/eximg3.png",
          actionType: 0,
          thumbnailSrc: "/images/test_img/eximg3.png",
          receiptImages: [
            "/images/test_img/eximg3.png",
            "/images/test_img/eximg.png",
            "/images/test_img/eximg3.png",
            "/images/test_img/eximg.png",
          ],
        },
      ],
    },
  },
  // review_7: 운동화 구매평 리뷰
  {
    ...reviewCampaigns[6],
    applicantData: {
      applicants: [
        {
          id: "app_review_7_네이버블로그_001",
          Id: "reviewer_review_7_001",
          nickname: "운동화구매평리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 280,
          totalVisits: 840000,
          neighbors: 2300,
          memo: "운동화 구매평 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-28",
        },
        {
          id: "app_review_7_네이버블로그_002",
          Id: "reviewer_review_7_002",
          nickname: "신발인플루언서B",
          userType: "인플루언서" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 320,
          totalVisits: 960000,
          neighbors: 2700,
          memo: "신발 전문 인플루언서입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-29",
        },
      ],
      selectedApplicants: [
        {
          id: "sel_review_7_네이버블로그_001",
          Id: "selected_review_7_001",
          nickname: "운동화구매평리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 280,
          totalVisits: 840000,
          neighbors: 2300,
          memo: "운동화 구매평 전문 리뷰어입니다.",
          selectionStatus: "선정하기" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-28",
        },
        {
          id: "sel_review_7_네이버블로그_002",
          Id: "selected_review_7_002",
          nickname: "신발인플루언서B",
          userType: "인플루언서" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 320,
          totalVisits: 960000,
          neighbors: 2700,
          memo: "신발 전문 인플루언서입니다.",
          selectionStatus: "선정하기" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-29",
        },
      ],
    },
    contents: {
      waiting: [
        {
          id: "content_review_7_waiting_001",
          createdAt: "2025-12-28T10:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "운동화구매평리뷰어A",
          channelId: "blog_025",
          channel: "네이버블로그",
          profileImage: "/images/test_img/eximg.png",
          actionType: 0,
          thumbnailSrc: "/images/test_img/eximg3.png",
        },
      ],
      reviewing: [
        {
          id: "content_review_7_reviewing_001",
          createdAt: "2025-12-26T09:00:00.000Z",
          status: "검수중" as const,
          userType: "인플루언서" as const,
          nickname: "신발인플루언서B",
          channelId: "blog_026",
          channel: "네이버블로그",
          updatedAt: "2025-12-27T10:00:00.000Z",
          isRejected: false,
          isLate: false,
          profileImage: "/images/test_img/eximg.png",
          actionType: 0,
          thumbnailSrc: "/images/test_img/eximg.png",
        },
      ],
      completed: [
        {
          id: "content_review_7_completed_001",
          createdAt: "2025-12-24T08:00:00.000Z",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "운동화전문가C",
          channelId: "blog_027",
          channel: "네이버블로그",
          updatedAt: "2025-12-25T09:00:00.000Z",
          isLate: false,
          profileImage: "/images/test_img/eximg3.png",
          actionType: 0,
          thumbnailSrc: "/images/test_img/eximg3.png",
        },
      ],
    },
  },
  // review_8: 반려동물 용품 구매평 리뷰
  {
    ...reviewCampaigns[7],
    applicantData: {
      applicants: [
        {
          id: "app_review_8_네이버블로그_001",
          Id: "reviewer_review_8_001",
          nickname: "반려동물용품구매평리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 150,
          totalVisits: 450000,
          neighbors: 1100,
          memo: "반려동물 용품 구매평 전문 리뷰어입니다.",
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
          id: "content_review_8_001",
          createdAt: "2025-11-30T10:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "반려동물용품구매평리뷰어A",
          channelId: "blog_001",
          channel: "네이버블로그",
          updatedAt: "2025-12-05T10:00:00.000Z",
          isRejected: false,
          isLate: false,
          profileImage: "/images/test_img/eximg.png",
          actionType: 1,
          receiptImages: ["/images/test_img/eximg3.png"],
        },
      ],
      completed: [
        {
          id: "content_review_8_002",
          createdAt: "2025-12-01T11:00:00.000Z",
          status: "완료" as const,
          userType: "인플루언서" as const,
          nickname: "반려동물인플루언서B",
          channelId: "blog_002",
          channel: "네이버블로그",
          updatedAt: "2025-12-07T11:00:00.000Z",
          isLate: false,
          profileImage: "/images/test_img/eximg.png",
          actionType: 1,
          receiptImages: ["/images/test_img/eximg.png"],
        },
        {
          id: "content_review_8_003",
          createdAt: "2025-12-02T12:00:00.000Z",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "반려동물리뷰어C",
          channelId: "blog_003",
          channel: "네이버블로그",
          updatedAt: "2025-12-07T12:00:00.000Z",
          isLate: false,
          profileImage: "/images/test_img/eximg3.png",
          actionType: 0,
          thumbnailSrc: "/images/test_img/eximg.png",
        },
      ],
    },
  },
  // review_9: 자동차 용품 구매평 리뷰
  {
    ...reviewCampaigns[8],
    applicantData: {
      applicants: [
        {
          id: "app_review_9_네이버블로그_001",
          Id: "reviewer_review_9_001",
          nickname: "자동차용품구매평리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 180,
          totalVisits: 540000,
          neighbors: 1500,
          memo: "자동차 용품 구매평 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-30",
        },
        {
          id: "app_review_9_네이버블로그_002",
          Id: "reviewer_review_9_002",
          nickname: "자동차인플루언서B",
          userType: "인플루언서" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 260,
          totalVisits: 780000,
          neighbors: 2100,
          memo: "자동차 전문 인플루언서입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-31",
        },
      ],
      selectedApplicants: [
        {
          id: "app_review_9_네이버블로그_001",
          Id: "reviewer_review_9_001",
          nickname: "자동차용품구매평리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 180,
          totalVisits: 540000,
          neighbors: 1500,
          memo: "자동차 용품 구매평 전문 리뷰어입니다.",
          selectionStatus: "선정하기" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-30",
        },
      ],
    },
    contents: {
      waiting: [
        // 1. 콘텐츠 미등록 (기본 케이스)
        {
          id: "content_review_9_waiting_001",
          createdAt: "2025-12-30T10:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "자동차용품구매평리뷰어A",
          channelId: "blog_028",
          channel: "네이버블로그",
          profileImage: "/images/test_img/eximg.png",
          actionType: 0,
          thumbnailSrc: undefined,
        },
        // 2. 등록 기한 연장 요청
        {
          id: "content_review_9_waiting_002",
          createdAt: "2025-12-31T11:00:00.000Z",
          status: "검수" as const,
          userType: "인플루언서" as const,
          nickname: "자동차인플루언서B",
          channelId: "blog_029",
          channel: "네이버블로그",
          profileImage: "/images/mypage/profile.svg",
          actionType: 0,
          thumbnailSrc: undefined,
          extension_request_reason:
            "제품 배송이 지연되어 아직 제품을 받지 못했습니다. 배송이 완료되는 대로 바로 리뷰를 작성하겠습니다. 3일만 연장해주시면 감사하겠습니다.",
        },
        // 3. 연장 승인 후 아직 등록 안함
        {
          id: "content_review_9_waiting_003",
          createdAt: "2025-12-29T09:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "연장승인자동차리뷰어C",
          channelId: "blog_032",
          channel: "네이버블로그",
          profileImage: "/images/test_img/eximg.png",
          actionType: 0,
          thumbnailSrc: undefined,
        },
        // 4. 반려 처리
        {
          id: "content_review_9_waiting_004",
          createdAt: "2025-12-27T08:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "반려된자동차리뷰어D",
          channelId: "blog_033",
          channel: "네이버블로그",
          profileImage: "/images/mypage/profile.svg",
          actionType: 0,
          thumbnailSrc: "/images/test_img/eximg.png",
          isRejected: true,
          reject_reason:
            "리뷰 내용이 너무 간단하고 제품의 핵심 기능에 대한 설명이 부족합니다. 또한 사진이 흐릿하고 제품의 특징을 잘 보여주지 못하고 있습니다. 더 상세한 리뷰와 고품질 사진으로 수정 후 재제출해주세요.",
        },
        // 5. 신고 처리
        {
          id: "content_review_9_waiting_005",
          createdAt: "2025-12-26T07:00:00.000Z",
          status: "검수" as const,
          userType: "인플루언서" as const,
          nickname: "신고된자동차인플루언서E",
          channelId: "blog_034",
          channel: "네이버블로그",
          profileImage: "/images/test_img/eximg.png",
          actionType: 0,
          thumbnailSrc: "/images/test_img/eximg3.png",
          isReported: true,
          reportedDate: "2025-12-30 14:25",
        },
      ],
      reviewing: [
        // 1. 최초 등록 (updatedAt 없음)
        {
          id: "content_review_9_reviewing_001",
          createdAt: "2025-12-28T09:00:00.000Z",
          status: "검수중" as const,
          userType: "리뷰어" as const,
          nickname: "자동차전문가F",
          channelId: "blog_030",
          channel: "네이버블로그",
          isRejected: false,
          isLate: false,
          profileImage: "/images/test_img/eximg.png",
          actionType: 0,
          thumbnailSrc: "/images/test_img/eximg.png",
        },
        // 2. 수정 (updatedAt 있음)
        {
          id: "content_review_9_reviewing_002",
          createdAt: "2025-12-25T08:00:00.000Z",
          status: "검수중" as const,
          userType: "인플루언서" as const,
          nickname: "수정한자동차인플루언서G",
          channelId: "blog_035",
          channel: "네이버블로그",
          updatedAt: "2025-12-29T10:00:00.000Z",
          isRejected: false,
          isLate: false,
          profileImage: "/images/test_img/eximg3.png",
          actionType: 0,
          thumbnailSrc: "/images/test_img/eximg3.png",
        },
        // 3. 지각 등록 (isLate: true)
        {
          id: "content_review_9_reviewing_003",
          createdAt: "2025-12-24T07:00:00.000Z",
          status: "검수중" as const,
          userType: "리뷰어" as const,
          nickname: "지각등록자동차리뷰어H",
          channelId: "blog_036",
          channel: "네이버블로그",
          updatedAt: "2025-12-30T14:25:00.000Z",
          isRejected: false,
          isLate: true,
          profileImage: "/images/test_img/eximg.png",
          actionType: 0,
          thumbnailSrc: "/images/test_img/eximg.png",
        },
      ],
      completed: [
        // 1. 확인 완료 (최초 등록)
        {
          id: "content_review_9_completed_001",
          createdAt: "2025-12-26T08:00:00.000Z",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "자동차리뷰어I",
          channelId: "blog_031",
          channel: "네이버블로그",
          isLate: false,
          profileImage: "/images/test_img/eximg3.png",
          actionType: 0,
          thumbnailSrc: "/images/test_img/eximg3.png",
        },
        // 2. 확인 완료 (수정 후)
        {
          id: "content_review_9_completed_002",
          createdAt: "2025-12-23T06:00:00.000Z",
          status: "완료" as const,
          userType: "인플루언서" as const,
          nickname: "수정완료자동차인플루언서J",
          channelId: "blog_037",
          channel: "네이버블로그",
          updatedAt: "2025-12-27T09:00:00.000Z",
          isLate: false,
          profileImage: "/images/test_img/eximg.png",
          actionType: 0,
          thumbnailSrc: "/images/test_img/eximg.png",
        },
      ],
    },
  },
  // review_10: 홈데코 구매평 리뷰
  {
    ...reviewCampaigns[9],
    applicantData: {
      applicants: [
        {
          id: "app_review_10_네이버블로그_001",
          Id: "reviewer_review_10_001",
          nickname: "홈데코구매평리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 140,
          totalVisits: 420000,
          neighbors: 1000,
          memo: "홈데코 제품 구매평 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-08",
        },
      ],
      selectedApplicants: [],
    },
  },
  // review_11: 프리미엄 비타민C 세럼 구매평
  {
    ...reviewCampaigns[10],
    applicantData: {
      applicants: [],
      selectedApplicants: [],
    },
  },
  // review_12: 프리미엄 무선 이어폰 구매평
  {
    ...reviewCampaigns[11],
    applicantData: {
      applicants: [],
      selectedApplicants: [],
    },
  },
  // review_13: 테스트용 구매평 캠페인 (구매 기간 지남, 등록 기간 진행 중)
  {
    ...reviewCampaigns[12],
    applicantData: {
      applicants: [
        {
          id: "app_review_13_네이버블로그_001",
          Id: "reviewer_review_13_001",
          nickname: "테스트리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "/images/test_img/eximg.png",
          memberType: "모범 회원" as const,
          dailyVisits: 200,
          totalVisits: 600000,
          neighbors: 1500,
          memo: "테스트용 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-25",
        },
        {
          id: "app_review_13_네이버블로그_002",
          Id: "reviewer_review_13_002",
          nickname: "테스트리뷰어B",
          userType: "리뷰어" as const,
          profileImage: "/images/test_img/eximg3.png",
          memberType: "모범 회원" as const,
          dailyVisits: 180,
          totalVisits: 550000,
          neighbors: 1300,
          memo: "테스트용 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-26",
        },
        {
          id: "app_review_13_네이버블로그_003",
          Id: "reviewer_review_13_003",
          nickname: "테스트인플루언서C",
          userType: "인플루언서" as const,
          profileImage: "/images/test_img/eximg.png",
          memberType: "모범 회원" as const,
          dailyVisits: 250,
          totalVisits: 750000,
          neighbors: 2000,
          memo: "테스트용 인플루언서입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-27",
        },
      ],
      selectedApplicants: [
        {
          id: "sel_review_13_네이버블로그_001",
          Id: "selected_review_13_001",
          nickname: "테스트리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "/images/test_img/eximg.png",
          memberType: "모범 회원" as const,
          dailyVisits: 200,
          totalVisits: 600000,
          neighbors: 1500,
          memo: "테스트용 리뷰어입니다.",
          selectionStatus: "선정하기" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-25",
        },
        {
          id: "sel_review_13_네이버블로그_002",
          Id: "selected_review_13_002",
          nickname: "테스트리뷰어B",
          userType: "리뷰어" as const,
          profileImage: "/images/test_img/eximg3.png",
          memberType: "모범 회원" as const,
          dailyVisits: 180,
          totalVisits: 550000,
          neighbors: 1300,
          memo: "테스트용 리뷰어입니다.",
          selectionStatus: "선정하기" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-26",
        },
        {
          id: "sel_review_13_네이버블로그_003",
          Id: "selected_review_13_003",
          nickname: "테스트인플루언서C",
          userType: "인플루언서" as const,
          profileImage: "/images/test_img/eximg.png",
          memberType: "모범 회원" as const,
          dailyVisits: 250,
          totalVisits: 750000,
          neighbors: 2000,
          memo: "테스트용 인플루언서입니다.",
          selectionStatus: "선정하기" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-27",
        },
      ],
    },
    contents: {
      waiting: [
        // 대기 탭: 콘텐츠 미등록
        {
          id: "content_review_13_waiting_001",
          createdAt: "2026-01-06T10:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "테스트리뷰어A",
          channelId: "blog_040",
          channel: "네이버블로그",
          profileImage: "/images/test_img/eximg.png",
          actionType: 0,
          thumbnailSrc: undefined,
        },
        // 대기 탭: 등록 기한 연장 요청
        {
          id: "content_review_13_waiting_002",
          createdAt: "2026-01-06T11:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "테스트리뷰어B",
          channelId: "blog_041",
          channel: "네이버블로그",
          profileImage: "/images/test_img/eximg3.png",
          actionType: 0,
          thumbnailSrc: undefined,
        },
      ],
      reviewing: [
        // 확인 탭: 최초 등록 (여러 이미지 테스트용)
        {
          id: "content_review_13_reviewing_001",
          createdAt: "2026-01-06T09:00:00.000Z",
          status: "검수중" as const,
          userType: "인플루언서" as const,
          nickname: "테스트인플루언서C",
          channelId: "blog_042",
          channel: "네이버블로그",
          isRejected: false,
          isLate: false,
          profileImage: "/images/test_img/eximg.png",
          actionType: 0,
          thumbnailSrc: "/images/test_img/eximg.png",
          // 📌 페이지네이션 테스트용: 여러 이미지 추가
          // - ReceiptPreviewModal에서 원 형태 페이지네이션 인디케이터를 확인하기 위한 데이터입니다
          receiptImages: [
            "/images/test_img/eximg.png",
            "/images/test_img/eximg3.png",
            "/images/test_img/eximg.png",
          ],
        },
        // 확인 탭: 수정 (여러 이미지 테스트용)
        {
          id: "content_review_13_reviewing_002",
          createdAt: "2026-01-05T08:00:00.000Z",
          status: "검수중" as const,
          userType: "리뷰어" as const,
          nickname: "테스트리뷰어D",
          channelId: "blog_043",
          channel: "네이버블로그",
          updatedAt: "2026-01-07T10:00:00.000Z",
          isRejected: false,
          isLate: false,
          profileImage: "/images/test_img/eximg3.png",
          actionType: 0,
          thumbnailSrc: "/images/test_img/eximg3.png",
          // 📌 페이지네이션 테스트용: 여러 이미지 추가
          // - ReceiptPreviewModal에서 원 형태 페이지네이션 인디케이터를 확인하기 위한 데이터입니다
          receiptImages: [
            "/images/test_img/eximg3.png",
            "/images/test_img/eximg.png",
            "/images/test_img/eximg3.png",
          ],
        },
      ],
      completed: [],
    },
  },
];

/**
 * 구매평 캠페인의 콘텐츠 데이터를 조회하는 함수
 *
 * 설명:
 * - 캠페인 ID를 받아서 해당 캠페인의 콘텐츠(검수 중/완료)를 반환합니다.
 * - 종료/취소된 캠페인과 진행 중인 캠페인 모두 지원합니다.
 *
 * @param campaignId - 조회할 캠페인의 ID
 * @returns 검수 중/완료된 콘텐츠를 담은 객체
 */
export function getPurchaseReviewContentsById(
  campaignId: string
): ContentByTab | undefined {
  // 진행 중인 캠페인에서 찾기
  const campaign = reviewCampaignsExtended.find((c) => c.id === campaignId);

  if (!campaign) {
    console.warn(
      `[getPurchaseReviewContentsById] 캠페인을 찾을 수 없습니다: ${campaignId}`
    );
    return undefined;
  }

  if (campaign.contents) {
    // ContentByTab 형식으로 변환 (waiting이 없을 수도 있음)
    const result: ContentByTab = {
      waiting: campaign.contents.waiting || [],
      reviewing: campaign.contents.reviewing || [],
      completed: campaign.contents.completed || [],
    };

    console.log(
      `[getPurchaseReviewContentsById] 캠페인 ${campaignId}의 콘텐츠:`,
      {
        waiting: result.waiting.length,
        reviewing: result.reviewing.length,
        completed: result.completed.length,
      }
    );

    return result;
  }

  // 콘텐츠가 없는 경우 undefined 반환
  console.warn(
    `[getPurchaseReviewContentsById] 캠페인 ${campaignId}에 콘텐츠가 없습니다.`
  );
  return undefined;
}

/**
 * 구매평 캠페인 헬퍼 함수들
 */

/**
 * 새 캠페인 ID 생성
 *
 * @returns 새로운 캠페인 ID (review_X 형식)
 */
function generateNewReviewCampaignId(): string {
  // 기존 캠페인 ID 중 최대값 찾기
  const allCampaigns = [...reviewCampaignsExtended];

  // localStorage에 저장된 캠페인도 확인
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("reviewCampaigns");
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
      console.error("localStorage에서 구매평 캠페인 ID 확인 실패:", error);
    }
  }

  // 배송형처럼 숫자만 사용 (구매평은 2000번대부터 시작)
  const existingIds = allCampaigns
    .map((c) => {
      // review_X 형식이면 숫자만 추출, 아니면 숫자로 직접 변환 시도
      const match = c.id.match(/review_(\d+)/);
      if (match) {
        return parseInt(match[1]) + 2000; // review_18 -> 2018
      }
      const numId = parseInt(c.id);
      return isNaN(numId) ? 0 : numId;
    })
    .filter((id) => id >= 2000 && id < 3000); // 구매평 범위: 2000-2999
  const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 2000;

  return String(maxId + 1);
}

/**
 * 폼 데이터를 CampaignWithApplicants 형태로 변환하여 새 캠페인 생성
 *
 * @param formData - 폼에서 입력받은 캠페인 데이터
 * @param imageUrl - 업로드된 이미지 URL
 * @returns 새로 생성된 CampaignWithApplicants 객체
 */
export function createReviewCampaign(
  formData: CampaignFormData,
  imageUrl: string = "/images/main/campaign_img/eximg_5.png"
): CampaignWithApplicants {
  // 새 캠페인 ID 생성
  const newId = generateNewReviewCampaignId();

  // 선정 날짜까지 남은 일수 계산
  const daysLeft = formData.announcementDate
    ? calculateDaysLeft(formData.announcementDate.split(" ")[0])
    : 0;

  // 모집 인원을 숫자로 변환
  const totalCount = Number(formData.recruitmentCount) || 0;

  // 캠페인 상태 결정 함수 호출
  // registrationPeriod를 전달하여 등록 기간 종료일 체크가 정확하게 이루어지도록 함
  const campaignStatus = calculateCampaignStatus(
    formData.recruitmentPeriod,
    formData.announcementDate,
    formData.registrationPeriod
  );

  // 플랫폼명 정규화
  const normalizedBrandName = formData.platform
    ? formData.platform.replace(/\s+/g, "")
    : "네이버블로그";

  // 포인트 계산 (additionalPoints를 숫자로 변환)
  const points = Number(formData.additionalPoints) || 0;

  // calculateCampaignStatus는 "대기 중" | "모집 중" | "진행 중" | "종료"를 반환
  // "종료" 상태를 "마감"으로 변환 (UI 표시용)
  let finalStatus:
    | "대기 중"
    | "모집 중"
    | "선정 중"
    | "구매 중"
    | "등록 중"
    | "마감"
    | "취소" = "대기 중";
  if (campaignStatus === "종료") {
    finalStatus = "마감";
  } else if (campaignStatus === "진행 중") {
    // 구매평 캠페인의 경우 "등록 중" 상태일 수 있음
    // 더 정확한 상태 계산을 위해 deriveCampaignStatus 사용 고려
    finalStatus = "등록 중";
  } else if (campaignStatus === "대기 중") {
    finalStatus = "대기 중";
  } else if (campaignStatus === "모집 중") {
    finalStatus = "모집 중";
  }

  return {
    campaignInfo: {
      id: newId,
      title: formData.title,
      image: imageUrl,
      status: finalStatus,
      campaignType: "구매평",
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
 * 구매평 캠페인 수정
 *
 * @param campaignId - 수정할 캠페인 ID
 * @param formData - 폼에서 입력받은 캠페인 데이터
 * @param imageUrl - 업로드된 이미지 URL
 * @returns 수정된 CampaignWithApplicants 객체
 */
export function updateReviewCampaign(
  campaignId: string,
  formData: CampaignFormData,
  imageUrl: string = "/images/main/campaign_img/eximg_5.png"
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
  const campaignStatus = calculateCampaignStatus(
    formData.recruitmentPeriod,
    formData.announcementDate,
    formData.registrationPeriod
  );

  // 플랫폼명 정규화
  const normalizedBrandName = formData.platform
    ? formData.platform.replace(/\s+/g, "")
    : "네이버블로그";

  // calculateCampaignStatus는 "대기 중" | "모집 중" | "진행 중" | "종료"를 반환
  // "종료" 상태를 "마감"으로 변환 (UI 표시용)
  let finalStatus:
    | "대기 중"
    | "모집 중"
    | "선정 중"
    | "구매 중"
    | "등록 중"
    | "마감"
    | "취소" = "대기 중";
  if (campaignStatus === "종료") {
    finalStatus = "마감";
  } else if (campaignStatus === "진행 중") {
    // 구매평 캠페인의 경우 "등록 중" 상태일 수 있음
    // 더 정확한 상태 계산을 위해 deriveCampaignStatus 사용 고려
    finalStatus = "등록 중";
  } else if (campaignStatus === "대기 중") {
    finalStatus = "대기 중";
  } else if (campaignStatus === "모집 중") {
    finalStatus = "모집 중";
  }

  return {
    campaignInfo: {
      id: campaignId,
      title: formData.title,
      image: imageUrl,
      status: finalStatus,
      campaignType: "구매평",
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
 * 새 구매평 캠페인 추가
 *
 * @param formData - 폼에서 입력받은 캠페인 데이터
 * @param imageUrl - 업로드된 이미지 URL
 * @returns 새로 생성된 CampaignWithApplicants 객체
 */
export function addReviewCampaign(
  formData: CampaignFormData,
  imageUrl: string = "/images/main/campaign_img/eximg_5.png"
): CampaignWithApplicants {
  return createReviewCampaign(formData, imageUrl);
}
