/* ========================================
   배송형 캠페인 데이터
   ======================================== */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * deliveryCampaigns
 *
 * 목적: 배송형 캠페인 목업 데이터 및 타입 정의
 *
 * 사용 페이지:
 * - /campaign/delivery (배송형 캠페인 목록)
 * - /campaign/delivery/[id] (배송형 캠페인 상세)
 */

import type { CampaignFormData } from "@/types/domain/user";
import type { ContentByTab } from "@/data/partner/sharedCampaigns";
import { calculateDaysLeft, calculateCampaignStatus } from "./deliveryUtils";

export interface DeliveryCampaignData {
  id: string; // 캠페인 고유 식별자
  title: string; // 캠페인 제목
  category: string; // 캠페인 카테고리 (배송형)
  image: string; // 메인 제품 이미지 경로
  subcategory: string; // 세부 카테고리 (생활, 뷰티, 식품 등)
  points: number; // 지급 포인트 (숫자)
  description: string; // 제품 설명 및 제공 내역
  recruitment: {
    current: number; // 현재 지원자 수
    total: number; // 총 모집 인원
  };
  /**
   * 캠페인 오픈 예정일 안내 텍스트
   *
   * - 아직 신청 시작일(applicationStart) 전일 때만 사용
   * - 예시: "12/25 (목) 10:00\n모집 오픈"
   * - 실제 화면에서는:
   *   - 오늘 < applicationStart 인 경우: 이 필드를 사용해 "모집 오픈 예정"을 노출
   *   - 오늘 >= applicationStart 인 경우: 이 필드는 무시되고, dayCount 기준으로 상태를 표시
   */
  schedule: string;
  /**
   * 남은 일수 / 상태 텍스트
   *
   * - 오늘 날짜와 신청 마감일(applicationEnd)을 기준으로 계산한 결과를 표현
   * - 예시 값:
   *   - "D-5"   : 신청 마감일까지 5일 남은 경우
   *   - "마감임박": 마감 직전 등, 임박 상태를 표시하고 싶을 때
   *   - "긴급"   : 긴급 캠페인인 경우
   *
   * - 동작 개념 정리:
   *   1) 오늘 < applicationStart
   *      - 아직 오픈 전 상태 → 상단에는 dayCount 대신 schedule(모집 오픈 예정 텍스트) 사용
   *   2) applicationStart <= 오늘 <= applicationEnd
   *      - 모집 진행 중 상태 → 남은 일수 계산해서 "D-?" 형태로 dayCount에 반영
   *   3) 오늘 > applicationEnd
   *      - 모집 종료 상태 → "마감임박" 또는 "마감" 등의 텍스트를 dayCount에 설정
   */
  dayCount: string;
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
  channel: string; // 채널 정보 (블로그, 인스타그램, 유튜브 등)
  keyword: string; // 캠페인 키워드
  promotionLink?: string; // 홍보링크 (선택사항)
  requirements: string[]; // 캠페인별 요구사항 코드 목록
  guidelineTexts: string[]; // 페이지별 상세 가이드 문구 목록
  // 참여/제출 옵션
  adultOnly?: boolean; // 만 19세 이상 참여 허용
  allowReParticipation?: boolean; // 이전 참여자 재참여 허용
  allowLateSubmission?: boolean; // 지각 제출 허용
  // 문의 담당자 정보
  contactPhone?: string; // 문의 담당자 휴대폰 번호
  partnerName?: string; // 파트너사 이름
}

/**
 * 배송형 캠페인 데이터
 * 배송형 페이지에서 사용되는 전용 데이터
 */
export const deliveryCampaigns: DeliveryCampaignData[] = [
  {
    id: "961",
    title: "세르프 (박신혜리프팅)",
    category: "배송형",
    image: "/images/main/campaign_img/eximg_9.png",
    subcategory: "뷰티",
    points: 30000,
    description: "박신혜 리프팅 세르프 제품 미션형 모집",
    recruitment: {
      current: 607,
      total: 2,
    },
    schedule: "",
    dayCount: "테스트",
    registeredAt: "2025-12-15T09:30:00.000Z", // 등록 시간
    detailedSchedule: {
      // 예정 탭용 - 모집 시작을 넉넉히 미래로 (2026-06-01 ~)
      applicationStart: "2026-06-01",
      applicationEnd: "2026-06-30",
      announcement: "2026-07-02",
      purchasePeriod: "2026-07-02 ~ 2026-07-05",
      registrationPeriod: "2026-07-05 ~ 2026-07-25",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "네이버블로그",
    keyword: "#세르프 #박신혜리프팅 #뷰티 #스킨케어 #리프팅크림",
    promotionLink:
      "https://smartstore.naver.com/example-store/products/1234564565656565656565656565656565664545454545454545456456",
    requirements: ["text_2000", "photo_15", "video_1_180", "product_link", "keyword"],
    guidelineTexts: [
      "배송형 캠페인 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★안내된 가격과 주문 가격이 상이한 경우 임의 주문하지 마시고, 꼭 1:1문의로 제보 부탁드립니다!! 네이버 멤버십 계정이시면 가격이 낮은 경우가 간혹 발생하여 안내드린 가격과 다를 경우, [ 멤버십이 아닌 네이버 계정으로 고지된 금액에 맞게 구매 ] 부탁드립니다★",
      "★제공된 제품을 모두 활용하여 작성해주세요 - 간단한 문구나 이름 인쇄 가능 - 우리 아이 이름 세 글자도 예쁘게 인쇄 가능 - 브랜드 로고, 간단한 디자인도 인쇄 가능<br />★구매평은 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★<br />★구매평 작성 시 실제 제품을 사용하시는 모습 사진 필수 첨부해주세요★<br />★구매평 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★구매평 작성 / 페이백 캠페인 입니다 (블로그 리뷰 작성 x)★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [선구매]로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 선구매 해주세요<br /> 3. 기간 내 리뷰 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★구매평 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 경험한 제품 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 구매처 착오 및 제품 잘못 구매할 경우 : 페이백 미지급 및 선정취소 <br /> - 구매평 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 공정배너의 경우 리뷰등록화면 내에 코드를 복사하여 등록 부탁드립니다.(스크린샷 불가) <br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 체험형의 경우 지도와 함께 매장 주소,영업시간,주차유무등을 기재해주세요. <br />- 배송형 캠페인의 경우 구매링크를 꼭 넣어주세요",
    ],
    contactPhone: "010-1234-5678",
    partnerName: "레더리아",
  },
  {
    id: "962",
    title: "닥터뮬 뮬차 붓기차",
    category: "배송형",
    image: "/images/main/campaign_img/eximg_10.png",
    subcategory: "생활",
    points: 25000,
    description: "붓기 완화에 도움되는 뮬차 미션형 모집",
    recruitment: {
      current: 106,
      total: 10,
    },
    schedule: "",
    dayCount: "", // 자동 계산됨
    isUrgent: true, // 긴급 캠페인
    registeredAt: "2026-01-11T14:20:00.000Z", // 등록 시간
    detailedSchedule: {
      // 항상 신청 내역 테스트가 가능하도록, 현재 날짜(2026-02-26) 기준으로 모집 진행 중 상태로 유지
      applicationStart: "2026-02-01",
      applicationEnd: "2026-03-31",
      announcement: "2026-04-02",
      purchasePeriod: "2026-04-02 ~ 2026-04-10",
      registrationPeriod: "2026-04-10 ~ 2026-04-30",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "네이버블로그",
    keyword: "#키워드예시 #예시1 #예시2 #예시3 #예시4",
    promotionLink: "https://smartstore.naver.com/example-store/products/123456",
    requirements: ["text_1200", "photo_8", "video_2_240", "product_link", "keyword"],
    guidelineTexts: [
      "배송형 캠페인 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★안내된 가격과 주문 가격이 상이한 경우 임의 주문하지 마시고, 꼭 1:1문의로 제보 부탁드립니다!! 네이버 멤버십 계정이시면 가격이 낮은 경우가 간혹 발생하여 안내드린 가격과 다를 경우, [ 멤버십이 아닌 네이버 계정으로 고지된 금액에 맞게 구매 ] 부탁드립니다★",
      "★제공된 제품을 모두 활용하여 작성해주세요 - 간단한 문구나 이름 인쇄 가능 - 우리 아이 이름 세 글자도 예쁘게 인쇄 가능 - 브랜드 로고, 간단한 디자인도 인쇄 가능<br />★구매평은 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★<br />★구매평 작성 시 실제 제품을 사용하시는 모습 사진 필수 첨부해주세요★<br />★구매평 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★구매평 작성 / 페이백 캠페인 입니다 (블로그 리뷰 작성 x)★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [선구매]로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 선구매 해주세요<br /> 3. 기간 내 리뷰 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★구매평 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 경험한 제품 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 구매처 착오 및 제품 잘못 구매할 경우 : 페이백 미지급 및 선정취소 <br /> - 구매평 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 공정배너의 경우 리뷰등록화면 내에 코드를 복사하여 등록 부탁드립니다.(스크린샷 불가) <br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 체험형의 경우 지도와 함께 매장 주소,영업시간,주차유무등을 기재해주세요. <br />- 배송형 캠페인의 경우 구매링크를 꼭 넣어주세요",
    ],
    contactPhone: "010-2345-6789",
    partnerName: "ABC쇼핑몰",
  },
  {
    id: "963",
    title: "가죽 여권 케이스+네임택 실미션형 모집",
    category: "배송형",
    image: "/images/main/campaign_img/eximg_13.png",
    subcategory: "패션",
    points: 20000,
    description: "고급스러운 가죽 여권 케이스와 네임택 미션형",
    recruitment: {
      current: 89,
      total: 15,
    },
    schedule: "",
    dayCount: "마감임박",
    registeredAt: "2025-12-20T11:15:00.000Z", // 등록 시간
    detailedSchedule: {
      // 진행 중 - 등록 기간 중 (연장 요청 테스트용)
      applicationStart: "2025-12-10",
      applicationEnd: "2025-12-25",
      announcement: "2025-12-27",
      purchasePeriod: "2025-12-27 ~ 2025-12-30",
      registrationPeriod: "2025-12-20 ~ 2026-01-10",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "인스타그램",
    keyword: "#키워드예시 #예시1 #예시2 #예시3 #예시4",
    promotionLink: "https://smartstore.naver.com/example-store/products/123456",
    requirements: ["text_1500", "photo_10", "video_120", "product_link", "keyword"],
    guidelineTexts: [
      "배송형 캠페인 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★안내된 가격과 주문 가격이 상이한 경우 임의 주문하지 마시고, 꼭 1:1문의로 제보 부탁드립니다!! 네이버 멤버십 계정이시면 가격이 낮은 경우가 간혹 발생하여 안내드린 가격과 다를 경우, [ 멤버십이 아닌 네이버 계정으로 고지된 금액에 맞게 구매 ] 부탁드립니다★",
      "★제공된 제품을 모두 활용하여 작성해주세요 - 간단한 문구나 이름 인쇄 가능 - 우리 아이 이름 세 글자도 예쁘게 인쇄 가능 - 브랜드 로고, 간단한 디자인도 인쇄 가능<br />★구매평은 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★<br />★구매평 작성 시 실제 제품을 사용하시는 모습 사진 필수 첨부해주세요★<br />★구매평 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★구매평 작성 / 페이백 캠페인 입니다 (블로그 리뷰 작성 x)★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [선구매]로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 선구매 해주세요<br /> 3. 기간 내 리뷰 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★구매평 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 경험한 제품 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 구매처 착오 및 제품 잘못 구매할 경우 : 페이백 미지급 및 선정취소 <br /> - 구매평 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 공정배너의 경우 리뷰등록화면 내에 코드를 복사하여 등록 부탁드립니다.(스크린샷 불가) <br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 체험형의 경우 지도와 함께 매장 주소,영업시간,주차유무등을 기재해주세요. <br />- 배송형 캠페인의 경우 구매링크를 꼭 넣어주세요",
    ],
    contactPhone: "010-3456-7890",
    partnerName: "에코라이프",
  },
  {
    id: "964",
    title: "프리미엄 비타민C 세럼",
    category: "배송형",
    image: "/images/main/campaign_img/eximg_2.png",
    subcategory: "뷰티",
    points: 35000,
    description: "고농도 비타민C로 피부 탄력 개선 미션형",
    recruitment: {
      current: 234,
      total: 8,
    },
    schedule: "12/25 (화) 10:00\n모집 오픈",
    dayCount: "",
    registeredAt: "2025-12-21T16:45:00.000Z", // 등록 시간
    detailedSchedule: {
      // 마감 - 모집 종료
      applicationStart: "2024-12-10",
      applicationEnd: "2024-12-25",
      announcement: "2024-12-27",
      purchasePeriod: "2024-12-27 ~ 2024-12-30",
      registrationPeriod: "2024-12-30 ~ 2025-01-15",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "네이버블로그",
    keyword: "#키워드예시 #예시1 #예시2 #예시3 #예시4",
    promotionLink: "https://smartstore.naver.com/example-store/products/123456",
    requirements: ["text_1500", "photo_10", "video_120", "product_link", "keyword"],
    guidelineTexts: [
      "배송형 캠페인 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★안내된 가격과 주문 가격이 상이한 경우 임의 주문하지 마시고, 꼭 1:1문의로 제보 부탁드립니다!! 네이버 멤버십 계정이시면 가격이 낮은 경우가 간혹 발생하여 안내드린 가격과 다를 경우, [ 멤버십이 아닌 네이버 계정으로 고지된 금액에 맞게 구매 ] 부탁드립니다★",
      "★제공된 제품을 모두 활용하여 작성해주세요 - 간단한 문구나 이름 인쇄 가능 - 우리 아이 이름 세 글자도 예쁘게 인쇄 가능 - 브랜드 로고, 간단한 디자인도 인쇄 가능<br />★구매평은 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★<br />★구매평 작성 시 실제 제품을 사용하시는 모습 사진 필수 첨부해주세요★<br />★구매평 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★구매평 작성 / 페이백 캠페인 입니다 (블로그 리뷰 작성 x)★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [선구매]로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 선구매 해주세요<br /> 3. 기간 내 리뷰 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★구매평 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 경험한 제품 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 구매처 착오 및 제품 잘못 구매할 경우 : 페이백 미지급 및 선정취소 <br /> - 구매평 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 공정배너의 경우 리뷰등록화면 내에 코드를 복사하여 등록 부탁드립니다.(스크린샷 불가) <br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 체험형의 경우 지도와 함께 매장 주소,영업시간,주차유무등을 기재해주세요. <br />- 배송형 캠페인의 경우 구매링크를 꼭 넣어주세요",
    ],
    contactPhone: "010-4567-8901",
    partnerName: "세르프코리아",
  },
  {
    id: "965",
    title: "유기농 아기용 세제",
    category: "배송형",
    image: "/images/main/campaign_img/eximg_4.png",
    subcategory: "생활",
    points: 18000,
    description: "아기 피부에 안전한 유기농 세제 미션형",
    recruitment: {
      current: 156,
      total: 20,
    },
    schedule: "",
    dayCount: "마감임박",
    registeredAt: "2026-01-10T10:00:00.000Z", // 등록 시간
    detailedSchedule: {
      // 마감 - 모집 종료
      applicationStart: "2024-12-15",
      applicationEnd: "2024-12-30",
      announcement: "2025-01-02",
      purchasePeriod: "2025-01-02 ~ 2025-01-05",
      registrationPeriod: "2025-01-05 ~ 2025-01-20",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "인스타그램",
    keyword: "#키워드예시 #예시1 #예시2 #예시3 #예시4",
    promotionLink: "https://smartstore.naver.com/example-store/products/123456",
    requirements: ["text_1500", "photo_10", "video_120", "product_link", "keyword"],
    guidelineTexts: [
      "배송형 캠페인 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★안내된 가격과 주문 가격이 상이한 경우 임의 주문하지 마시고, 꼭 1:1문의로 제보 부탁드립니다!! 네이버 멤버십 계정이시면 가격이 낮은 경우가 간혹 발생하여 안내드린 가격과 다를 경우, [ 멤버십이 아닌 네이버 계정으로 고지된 금액에 맞게 구매 ] 부탁드립니다★",
      "★제공된 제품을 모두 활용하여 작성해주세요 - 간단한 문구나 이름 인쇄 가능 - 우리 아이 이름 세 글자도 예쁘게 인쇄 가능 - 브랜드 로고, 간단한 디자인도 인쇄 가능<br />★구매평은 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★<br />★구매평 작성 시 실제 제품을 사용하시는 모습 사진 필수 첨부해주세요★<br />★구매평 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★구매평 작성 / 페이백 캠페인 입니다 (블로그 리뷰 작성 x)★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [선구매]로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 선구매 해주세요<br /> 3. 기간 내 리뷰 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★구매평 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 경험한 제품 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 구매처 착오 및 제품 잘못 구매할 경우 : 페이백 미지급 및 선정취소 <br /> - 구매평 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 공정배너의 경우 리뷰등록화면 내에 코드를 복사하여 등록 부탁드립니다.(스크린샷 불가) <br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 체험형의 경우 지도와 함께 매장 주소,영업시간,주차유무등을 기재해주세요. <br />- 배송형 캠페인의 경우 구매링크를 꼭 넣어주세요",
    ],
    contactPhone: "010-5678-9012",
    partnerName: "테크솔루션",
  },
  {
    id: "966",
    title: "프리미엄 강아지 사료",
    category: "배송형",
    image: "/images/main/campaign_img/eximg_5.png",
    subcategory: "반려동물",
    points: 28000,
    description: "영양 균형이 완벽한 프리미엄 강아지 사료 미션형",
    recruitment: {
      current: 78,
      total: 12,
    },
    schedule: "",
    dayCount: "D-5",
    registeredAt: "2026-01-08T13:30:00.000Z", // 등록 시간
    detailedSchedule: {
      // 모집 중 - 현재 날짜 기준 모집 진행 중 (오늘 날짜 포함)
      applicationStart: "2026-01-15",
      applicationEnd: "2026-02-05",
      announcement: "2026-02-07",
      purchasePeriod: "2026-02-07 ~ 2026-02-10",
      registrationPeriod: "2026-02-10 ~ 2026-02-20",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "유튜브",
    keyword: "#키워드예시 #예시1 #예시2 #예시3 #예시4",
    promotionLink: "https://smartstore.naver.com/example-store/products/123456",
    requirements: ["text_1500", "photo_10", "video_120", "product_link", "keyword"],
    guidelineTexts: [
      "배송형 캠페인 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★안내된 가격과 주문 가격이 상이한 경우 임의 주문하지 마시고, 꼭 1:1문의로 제보 부탁드립니다!! 네이버 멤버십 계정이시면 가격이 낮은 경우가 간혹 발생하여 안내드린 가격과 다를 경우, [ 멤버십이 아닌 네이버 계정으로 고지된 금액에 맞게 구매 ] 부탁드립니다★",
      "★제공된 제품을 모두 활용하여 작성해주세요 - 간단한 문구나 이름 인쇄 가능 - 우리 아이 이름 세 글자도 예쁘게 인쇄 가능 - 브랜드 로고, 간단한 디자인도 인쇄 가능<br />★구매평은 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★<br />★구매평 작성 시 실제 제품을 사용하시는 모습 사진 필수 첨부해주세요★<br />★구매평 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★구매평 작성 / 페이백 캠페인 입니다 (블로그 리뷰 작성 x)★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [선구매]로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 선구매 해주세요<br /> 3. 기간 내 리뷰 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★구매평 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 경험한 제품 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 구매처 착오 및 제품 잘못 구매할 경우 : 페이백 미지급 및 선정취소 <br /> - 구매평 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 공정배너의 경우 리뷰등록화면 내에 코드를 복사하여 등록 부탁드립니다.(스크린샷 불가) <br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 체험형의 경우 지도와 함께 매장 주소,영업시간,주차유무등을 기재해주세요. <br />- 배송형 캠페인의 경우 구매링크를 꼭 넣어주세요",
    ],
    contactPhone: "010-6789-0123",
    partnerName: "세르프코리아",
  },
  {
    id: "967",
    title: "네이버클립 크리에이터 키트",
    category: "배송형",
    image: "/images/main/campaign_img/eximg_6.png",
    subcategory: "기타",
    points: 40000,
    description: "네이버클립 영상 제작에 필요한 크리에이터 키트 미션형",
    recruitment: {
      current: 345,
      total: 5,
    },
    schedule: "",
    dayCount: "D-2",
    registeredAt: "2026-01-09T15:20:00.000Z", // 등록 시간
    detailedSchedule: {
      // 마감 - 모집 종료
      applicationStart: "2024-12-20",
      applicationEnd: "2025-01-05",
      announcement: "2025-01-07",
      purchasePeriod: "2025-01-07 ~ 2025-01-10",
      registrationPeriod: "2025-01-10 ~ 2025-01-17",
    },
    // 단일 이미지 필드도 유지 (DeliveryCampaignData 요구사항)
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    campaign_detail_images: [
      "/images/campaign_detail/exdetail_1.png",
      "/images/campaign_detail/exdetail_2.png",
      "/images/campaign_detail/exdetail_1.png",
    ],
    channel: "네이버클립",
    keyword: "#키워드예시 #예시1 #예시2 #예시3 #예시4",
    promotionLink: "https://smartstore.naver.com/example-store/products/123456",
    requirements: ["text_1500", "photo_10", "video_120", "product_link", "keyword"],
    guidelineTexts: [
      "배송형 캠페인 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★안내된 가격과 주문 가격이 상이한 경우 임의 주문하지 마시고, 꼭 1:1문의로 제보 부탁드립니다!! 네이버 멤버십 계정이시면 가격이 낮은 경우가 간혹 발생하여 안내드린 가격과 다를 경우, [ 멤버십이 아닌 네이버 계정으로 고지된 금액에 맞게 구매 ] 부탁드립니다★",
      "★제공된 제품을 모두 활용하여 작성해주세요 - 간단한 문구나 이름 인쇄 가능 - 우리 아이 이름 세 글자도 예쁘게 인쇄 가능 - 브랜드 로고, 간단한 디자인도 인쇄 가능<br />★구매평은 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★<br />★구매평 작성 시 실제 제품을 사용하시는 모습 사진 필수 첨부해주세요★<br />★구매평 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★구매평 작성 / 페이백 캠페인 입니다 (블로그 리뷰 작성 x)★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [선구매]로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 선구매 해주세요<br /> 3. 기간 내 리뷰 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★구매평 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 경험한 제품 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 구매처 착오 및 제품 잘못 구매할 경우 : 페이백 미지급 및 선정취소 <br /> - 구매평 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 공정배너의 경우 리뷰등록화면 내에 코드를 복사하여 등록 부탁드립니다.(스크린샷 불가) <br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 체험형의 경우 지도와 함께 매장 주소,영업시간,주차유무등을 기재해주세요. <br />- 배송형 캠페인의 경우 구매링크를 꼭 넣어주세요",
    ],
    contactPhone: "010-7890-1234",
    partnerName: "라이프스타일",
  },
  {
    id: "968",
    title: "프리미엄 홈트레이닝 용품 세트",
    category: "배송형",
    image: "/images/main/campaign_img/eximg_7.png",
    subcategory: "생활",
    points: 32000,
    description: "집에서 하는 홈트레이닝에 필요한 용품 세트 미션형",
    recruitment: {
      current: 198,
      total: 10,
    },
    schedule: "",
    dayCount: "마감임박",
    registeredAt: "2025-11-08T09:15:00.000Z", // 등록 시간
    detailedSchedule: {
      // 마감 - 모집 종료
      applicationStart: "2024-12-10",
      applicationEnd: "2024-12-25",
      announcement: "2024-12-27",
      purchasePeriod: "2024-12-27 ~ 2024-12-30",
      registrationPeriod: "2024-12-30 ~ 2025-01-20",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "네이버블로그",
    keyword: "#키워드예시 #예시1 #예시2 #예시3 #예시4",
    promotionLink: "https://smartstore.naver.com/example-store/products/123456",
    requirements: ["text_1500", "photo_10", "video_120", "product_link", "keyword"],
    guidelineTexts: [
      "배송형 캠페인 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★안내된 가격과 주문 가격이 상이한 경우 임의 주문하지 마시고, 꼭 1:1문의로 제보 부탁드립니다!! 네이버 멤버십 계정이시면 가격이 낮은 경우가 간혹 발생하여 안내드린 가격과 다를 경우, [ 멤버십이 아닌 네이버 계정으로 고지된 금액에 맞게 구매 ] 부탁드립니다★",
      "★제공된 제품을 모두 활용하여 작성해주세요 - 간단한 문구나 이름 인쇄 가능 - 우리 아이 이름 세 글자도 예쁘게 인쇄 가능 - 브랜드 로고, 간단한 디자인도 인쇄 가능<br />★구매평은 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★<br />★구매평 작성 시 실제 제품을 사용하시는 모습 사진 필수 첨부해주세요★<br />★구매평 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★구매평 작성 / 페이백 캠페인 입니다 (블로그 리뷰 작성 x)★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [선구매]로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 선구매 해주세요<br /> 3. 기간 내 리뷰 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★구매평 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 경험한 제품 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 구매처 착오 및 제품 잘못 구매할 경우 : 페이백 미지급 및 선정취소 <br /> - 구매평 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 공정배너의 경우 리뷰등록화면 내에 코드를 복사하여 등록 부탁드립니다.(스크린샷 불가) <br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 체험형의 경우 지도와 함께 매장 주소,영업시간,주차유무등을 기재해주세요. <br />- 배송형 캠페인의 경우 구매링크를 꼭 넣어주세요",
    ],
    contactPhone: "010-8901-2345",
    partnerName: "ABC쇼핑몰",
  },
  {
    id: "969",
    title: "프리미엄 스킨케어 세트",
    category: "배송형",
    image: "/images/main/campaign_img/eximg_1.png",
    subcategory: "뷰티",
    points: 45000,
    description: "모든 피부 타입에 맞는 프리미엄 스킨케어 세트 미션형",
    recruitment: {
      current: 289,
      total: 8,
    },
    schedule: "",
    dayCount: "D-1",
    registeredAt: "2025-12-24T10:50:00.000Z", // 등록 시간
    detailedSchedule: {
      // 마감 - 모집 종료
      applicationStart: "2024-12-20",
      applicationEnd: "2025-01-05",
      announcement: "2025-01-07",
      purchasePeriod: "2025-01-07 ~ 2025-01-10",
      registrationPeriod: "2025-01-10 ~ 2025-02-05",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "인스타그램",
    keyword: "#키워드예시 #예시1 #예시2 #예시3 #예시4",
    promotionLink: "https://smartstore.naver.com/example-store/products/123456",
    requirements: ["text_1500", "photo_10", "video_120", "product_link", "keyword"],
    guidelineTexts: [
      "배송형 캠페인 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★안내된 가격과 주문 가격이 상이한 경우 임의 주문하지 마시고, 꼭 1:1문의로 제보 부탁드립니다!! 네이버 멤버십 계정이시면 가격이 낮은 경우가 간혹 발생하여 안내드린 가격과 다를 경우, [ 멤버십이 아닌 네이버 계정으로 고지된 금액에 맞게 구매 ] 부탁드립니다★",
      "★제공된 제품을 모두 활용하여 작성해주세요 - 간단한 문구나 이름 인쇄 가능 - 우리 아이 이름 세 글자도 예쁘게 인쇄 가능 - 브랜드 로고, 간단한 디자인도 인쇄 가능<br />★구매평은 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★<br />★구매평 작성 시 실제 제품을 사용하시는 모습 사진 필수 첨부해주세요★<br />★구매평 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★구매평 작성 / 페이백 캠페인 입니다 (블로그 리뷰 작성 x)★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [선구매]로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 선구매 해주세요<br /> 3. 기간 내 리뷰 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★구매평 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 경험한 제품 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 구매처 착오 및 제품 잘못 구매할 경우 : 페이백 미지급 및 선정취소 <br /> - 구매평 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 공정배너의 경우 리뷰등록화면 내에 코드를 복사하여 등록 부탁드립니다.(스크린샷 불가) <br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 체험형의 경우 지도와 함께 매장 주소,영업시간,주차유무등을 기재해주세요. <br />- 배송형 캠페인의 경우 구매링크를 꼭 넣어주세요",
    ],
    contactPhone: "010-9012-3456",
    partnerName: "테크솔루션",
  },
  {
    id: "970",
    title: "유기농 과일 주스 세트",
    category: "배송형",
    image: "/images/main/campaign_img/eximg_3.png",
    subcategory: "식품",
    points: 22000,
    description: "신선한 과일로 만든 유기농 주스 세트 미션형",
    recruitment: {
      current: 134,
      total: 25,
    },
    schedule: "",
    dayCount: "D-8",
    registeredAt: "2025-11-03T14:00:00.000Z", // 등록 시간
    detailedSchedule: {
      // 오픈 예정 - 모집 시작 전
      applicationStart: "2026-02-08",
      applicationEnd: "2026-02-22",
      announcement: "2026-02-24",
      purchasePeriod: "2026-02-24 ~ 2026-02-27",
      registrationPeriod: "2026-02-27 ~ 2026-03-10",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "유튜브",
    keyword: "#키워드예시 #예시1 #예시2 #예시3 #예시4",
    promotionLink: "https://smartstore.naver.com/example-store/products/123456",
    requirements: ["text_1500", "photo_10", "video_120", "product_link", "keyword"],
    guidelineTexts: [
      "배송형 캠페인 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★안내된 가격과 주문 가격이 상이한 경우 임의 주문하지 마시고, 꼭 1:1문의로 제보 부탁드립니다!! 네이버 멤버십 계정이시면 가격이 낮은 경우가 간혹 발생하여 안내드린 가격과 다를 경우, [ 멤버십이 아닌 네이버 계정으로 고지된 금액에 맞게 구매 ] 부탁드립니다★",
      "★제공된 제품을 모두 활용하여 작성해주세요 - 간단한 문구나 이름 인쇄 가능 - 우리 아이 이름 세 글자도 예쁘게 인쇄 가능 - 브랜드 로고, 간단한 디자인도 인쇄 가능<br />★구매평은 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★<br />★구매평 작성 시 실제 제품을 사용하시는 모습 사진 필수 첨부해주세요★<br />★구매평 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★구매평 작성 / 페이백 캠페인 입니다 (블로그 리뷰 작성 x)★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [선구매]로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 선구매 해주세요<br /> 3. 기간 내 리뷰 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★구매평 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 경험한 제품 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 구매처 착오 및 제품 잘못 구매할 경우 : 페이백 미지급 및 선정취소 <br /> - 구매평 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 공정배너의 경우 리뷰등록화면 내에 코드를 복사하여 등록 부탁드립니다.(스크린샷 불가) <br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 체험형의 경우 지도와 함께 매장 주소,영업시간,주차유무등을 기재해주세요. <br />- 배송형 캠페인의 경우 구매링크를 꼭 넣어주세요",
    ],
    contactPhone: "010-0123-4567",
    partnerName: "레더리아",
  },
  {
    id: "972",
    title: "[마감임박] 프리미엄 스마트워치 체험단",
    category: "배송형",
    image: "/images/main/campaign_img/eximg_8.png",
    subcategory: "디지털",
    points: 50000,
    description: "최신 스마트워치 제품 체험 후 블로그 리뷰 작성",
    recruitment: {
      current: 2, // 신청자 수 적게 설정
      total: 5,
    },
    schedule: "",
    dayCount: "마감임박",
    detailedSchedule: {
      // 마감 - 모집 종료
      applicationStart: "2024-12-25",
      applicationEnd: "2025-01-10",
      announcement: "2025-01-12",
      purchasePeriod: "2025-01-12 ~ 2025-01-15",
      registrationPeriod: "2025-01-15 ~ 2025-01-22",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "네이버블로그",
    keyword: "#스마트워치 #디지털 #체험단 #블로그리뷰 #테크",
    promotionLink: "https://smartstore.naver.com/example-store/products/123456",
    requirements: ["text_2000", "photo_15", "video_1_180", "product_link", "keyword"],
    guidelineTexts: [
      "배송형 캠페인 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★안내된 가격과 주문 가격이 상이한 경우 임의 주문하지 마시고, 꼭 1:1문의로 제보 부탁드립니다!! 네이버 멤버십 계정이시면 가격이 낮은 경우가 간혹 발생하여 안내드린 가격과 다를 경우, [ 멤버십이 아닌 네이버 계정으로 고지된 금액에 맞게 구매 ] 부탁드립니다★",
      "★제공된 제품을 모두 활용하여 작성해주세요 - 간단한 문구나 이름 인쇄 가능 - 우리 아이 이름 세 글자도 예쁘게 인쇄 가능 - 브랜드 로고, 간단한 디자인도 인쇄 가능<br />★구매평은 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★<br />★구매평 작성 시 실제 제품을 사용하시는 모습 사진 필수 첨부해주세요★<br />★구매평 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★구매평 작성 / 페이백 캠페인 입니다 (블로그 리뷰 작성 x)★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [선구매]로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 선구매 해주세요<br /> 3. 기간 내 리뷰 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★구매평 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 경험한 제품 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 구매처 착오 및 제품 잘못 구매할 경우 : 페이백 미지급 및 선정취소 <br /> - 구매평 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 공정배너의 경우 리뷰등록화면 내에 코드를 복사하여 등록 부탁드립니다.(스크린샷 불가) <br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 체험형의 경우 지도와 함께 매장 주소,영업시간,주차유무등을 기재해주세요. <br />- 배송형 캠페인의 경우 구매링크를 꼭 넣어주세요",
    ],
    contactPhone: "010-0123-4567",
    partnerName: "에코라이프",
  },
  // delivery_13: 마감임박 - 네이버 클립 채널
  {
    id: "973",
    title: "[마감임박] 프리미엄 무선 이어버드 체험단",
    category: "배송형",
    image: "/images/main/campaign_img/eximg_9.png",
    subcategory: "디지털",
    points: 45000,
    description: "프리미엄 무선 이어버드 제품 체험 후 네이버 클립 리뷰 작성",
    recruitment: {
      current: 2, // 신청자 수 적게 설정
      total: 5,
    },
    schedule: "",
    dayCount: "마감임박",
    registeredAt: "2025-12-27T08:45:00.000Z", // 등록 시간
    detailedSchedule: {
      // 마감 - 모집 종료
      applicationStart: "2024-12-25",
      applicationEnd: "2025-01-10",
      announcement: "2025-01-12",
      purchasePeriod: "2025-01-12 ~ 2025-01-15",
      registrationPeriod: "2025-01-15 ~ 2025-01-22",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "클립",
    keyword: "#무선이어버드 #디지털 #체험단 #네이버클립 #테크",
    promotionLink: "https://smartstore.naver.com/example-store/products/wireless-earbuds",
    requirements: ["text_2000", "photo_15", "video_1_180", "product_link", "keyword"],
    guidelineTexts: [
      "배송형 캠페인 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★안내된 가격과 주문 가격이 상이한 경우 임의 주문하지 마시고, 꼭 1:1문의로 제보 부탁드립니다!! 네이버 멤버십 계정이시면 가격이 낮은 경우가 간혹 발생하여 안내드린 가격과 다를 경우, [ 멤버십이 아닌 네이버 계정으로 고지된 금액에 맞게 구매 ] 부탁드립니다★",
      "★제공된 제품을 모두 활용하여 작성해주세요 - 무선 이어버드의 모든 기능을 체험해보세요 - 음질, 배터리, 착용감, 연결성 등 다양한 측면에서 리뷰 작성 - 실제 사용 모습과 후기를 솔직하게 작성<br />★리뷰는 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★<br />★리뷰 작성 시 실제 제품을 사용하시는 모습 사진 필수 첨부해주세요★<br />★네이버 클립 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★배송형 캠페인 입니다★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [배송형]으로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 제품 수령 후 체험 해주세요<br /> 3. 기간 내 리뷰 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★리뷰 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 경험한 제품 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 제품 수령 불가 및 제품 착오할 경우 : 페이백 미지급 및 선정취소 <br /> - 리뷰 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 공정배너의 경우 리뷰등록화면 내에 코드를 복사하여 등록 부탁드립니다.(스크린샷 불가) <br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 배송형 캠페인의 경우 구매링크를 꼭 넣어주세요",
    ],
    contactPhone: "010-1357-2468",
    partnerName: "레더리아",
  },
  // delivery_test: 배송형 테스트 (유저단 노출용)
  {
    id: "delivery_test_all_cases",
    title: "[테스트] 배송형 모든 카드 경우의 수",
    category: "배송형",
    image: "/images/main/campaign_img/eximg_3.png",
    subcategory: "생활",
    points: 25000,
    description: "테스트용 배송형 캠페인",
    recruitment: {
      current: 7,
      total: 10,
    },
    schedule: "",
    dayCount: "D-7",
    registeredAt: "2026-01-20T10:00:00.000Z",
    detailedSchedule: {
      applicationStart: "2026-02-01",
      applicationEnd: "2026-02-28",
      announcement: "2026-03-02",
      purchasePeriod: "2026-01-30 ~ 2026-02-04",
      registrationPeriod: "2026-02-04 ~ 2026-05-05",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "네이버블로그",
    keyword: "#테스트 #배송형 #체험단",
    requirements: ["text_2000", "photo_15", "video_1_180", "product_link", "keyword"],
    guidelineTexts: ["배송형 테스트 캠페인입니다.", "링크 확인 기능을 테스트할 수 있습니다."],
    partnerName: "펫프렌즈",
  },
];

/* ========================================
   🚚 배송형 캠페인 확장 타입 정의 (신청자 데이터 + 종료/취소 데이터)
   ======================================== */

/**
 * 배송형 캠페인 확장 데이터 타입
 *
 * 설명:
 * - 기존 DeliveryCampaignData 타입을 확장하여 신청자 데이터와 종료/취소 데이터를 포함합니다.
 * - 파트너 관리 페이지에서 사용하는 통합 데이터 구조입니다.
 * - 기존 DeliveryCampaignData 타입은 유지하여 사용자 페이지와의 호환성을 보장합니다.
 */
export interface DeliveryCampaignDataExtended {
  // 기존 DeliveryCampaignData의 모든 필드 포함
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
    purchasePeriod: string;
    registrationPeriod: string;
  };
  campaign_detail_image: string;
  campaign_detail_images?: string[]; // 캠페인 상세 이미지 경로 배열 (여러 이미지)
  channel: string;
  keyword: string;
  promotionLink?: string;
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
      // 채널별 스펙 차이 지원 (네이버클립 등)
      dailyVisits?: number;
      totalVisits?: number;
      neighbors?: number;
      followers?: number;
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
      dailyVisits?: number;
      totalVisits?: number;
      neighbors?: number;
      followers?: number;
      memo: string;
      selectionStatus: "선정하기";
      channel: string;
      registrationDate?: string;
    }>;
  };

  // 콘텐츠 데이터 (선택사항 - 종료/취소 캠페인에는 필수, 진행/예정/신청 캠페인에는 선택)
  contents?: {
    waiting: Array<{
      id: string;
      createdAt: string;
      status: "검수";
      userType: "리뷰어" | "인플루언서";
      nickname: string;
      channelId: string;
      channel: string;
      profileImage?: string;
      extension_request_reason?: string;
      isRejected?: boolean;
    }>;
    reviewing: Array<{
      id: string;
      createdAt: string;
      status: "검수" | "검수중";
      userType: "리뷰어" | "인플루언서";
      nickname: string;
      channelId: string;
      channel: string;
      profileImage?: string;
      updatedAt?: string;
      isRejected?: boolean;
      isLate?: boolean;
    }>;
    completed: Array<{
      id: string;
      createdAt: string;
      status: "완료";
      userType: "리뷰어" | "인플루언서";
      nickname: string;
      channelId: string;
      channel: string;
      profileImage?: string;
      updatedAt?: string;
      isLate?: boolean;
    }>;
  };
}

/**
 * 배송형 캠페인 확장 데이터 (파트너 관리용) - 신청자 데이터 포함
 *
 * 설명:
 * - 파트너 관리 페이지에서 사용하는 배송형 캠페인 데이터입니다.
 * - 신청자 데이터와 종료/취소 데이터를 포함합니다.
 * - 각 캠페인마다 직접 예시 신청자 데이터를 포함합니다.
 */
export const deliveryCampaignsExtended: DeliveryCampaignDataExtended[] = [
  // delivery_1: 세르프 (박신혜리프팅)
  {
    ...deliveryCampaigns[0],
    applicantData: {
      applicants: [
        {
          id: "app_1_네이버블로그_001",
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
          id: "app_1_네이버블로그_001_old",
          Id: "reviewer_1_001",
          nickname: "뷰티리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 150,
          totalVisits: 450000,
          neighbors: 1100,
          memo: "뷰티 제품 체험단 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-15",
        },
        {
          id: "app_1_네이버블로그_002",
          Id: "reviewer_1_002",
          nickname: "스킨케어전문가B",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
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
          id: "app_1_네이버블로그_003",
          Id: "reviewer_1_003",
          nickname: "뷰티인플루언서C",
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
          id: "app_1_네이버블로그_004",
          Id: "reviewer_1_004",
          nickname: "리뷰퀸D",
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
          id: "app_1_네이버블로그_005",
          Id: "reviewer_1_005",
          nickname: "뷰티마스터E",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
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
  // delivery_2: 닥터뮬 뮬차 붓기차
  {
    ...deliveryCampaigns[1],
    isUrgent: true, // 긴급 캠페인
    applicantData: {
      applicants: [
        {
          id: "app_2_네이버블로그_001",
          Id: "reviewer_2_001",
          nickname: "생활리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 120,
          totalVisits: 400000,
          neighbors: 900,
          memo: "생활용품 체험단 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-18",
        },
        {
          id: "app_2_네이버블로그_002",
          Id: "reviewer_2_002",
          nickname: "건강리뷰어B",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 160,
          totalVisits: 500000,
          neighbors: 1200,
          memo: "건강 제품 리뷰를 자주 작성합니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-19",
        },
        {
          id: "app_2_네이버블로그_003",
          Id: "reviewer_2_003",
          nickname: "생활인플루언서C",
          userType: "인플루언서" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 250,
          totalVisits: 750000,
          neighbors: 2200,
          memo: "생활용품 전문 인플루언서입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-20",
        },
      ],
      selectedApplicants: [
        {
          id: "sel_2_네이버블로그_001",
          Id: "selected_2_001",
          nickname: "선정된생활리뷰어1",
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
        {
          id: "content_delivery_2_waiting_001",
          createdAt: "2025-12-20T10:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "생활리뷰어A",
          channelId: "blog_014",
          channel: "네이버블로그",
          profileImage: "",
        },
        {
          id: "content_delivery_2_waiting_002",
          createdAt: "2025-12-21T11:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "건강리뷰어B",
          channelId: "blog_015",
          channel: "네이버블로그",
          profileImage: "",
        },
      ],
      reviewing: [
        {
          id: "content_delivery_2_reviewing_001",
          createdAt: "2025-12-18T09:00:00.000Z",
          status: "검수중" as const,
          userType: "인플루언서" as const,
          nickname: "생활인플루언서C",
          channelId: "blog_016",
          channel: "네이버블로그",
          updatedAt: "2025-12-19T10:00:00.000Z",
          isRejected: false,
          isLate: false,
          profileImage: "",
        },
      ],
      completed: [
        {
          id: "content_delivery_2_completed_001",
          createdAt: "2025-12-15T08:00:00.000Z",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "선정된생활리뷰어1",
          channelId: "blog_017",
          channel: "네이버블로그",
          updatedAt: "2025-12-16T09:00:00.000Z",
          isLate: false,
          profileImage: "",
        },
      ],
    },
  },
  // delivery_3: 가죽 여권 케이스+네임택
  {
    ...deliveryCampaigns[2],
    applicantData: {
      applicants: [
        {
          id: "app_3_인스타그램_001",
          Id: "reviewer_3_001",
          nickname: "패션리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          followers: 1000,
          memo: "패션 제품 체험단 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "인스타그램" as const,
          registrationDate: "2025-12-20",
        },
        {
          id: "app_3_인스타그램_002",
          Id: "reviewer_3_002",
          nickname: "패션인플루언서B",
          userType: "인플루언서" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          followers: 2500,
          memo: "패션 아이템 전문 인플루언서입니다.",
          selectionStatus: "미선택" as const,
          channel: "인스타그램" as const,
          registrationDate: "2025-12-21",
        },
        {
          id: "app_3_인스타그램_003",
          Id: "reviewer_3_003",
          nickname: "패션리뷰어C",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          followers: 800,
          memo: "패션 제품 리뷰를 자주 작성합니다.",
          selectionStatus: "미선택" as const,
          channel: "인스타그램" as const,
          registrationDate: "2025-12-22",
        },
      ],
      selectedApplicants: [
        {
          id: "sel_3_인스타그램_001",
          Id: "selected_3_001",
          nickname: "선정된패션리뷰어1",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          followers: 3200,
          memo: "이미 선정된 우수 리뷰어입니다.",
          selectionStatus: "선정하기" as const,
          channel: "인스타그램" as const,
          registrationDate: "2025-12-20",
        },
      ],
    },
  },
  // delivery_4: 프리미엄 비타민C 세럼
  {
    ...deliveryCampaigns[3],
    applicantData: {
      applicants: [
        {
          id: "app_4_네이버블로그_001",
          Id: "reviewer_4_001",
          nickname: "뷰티리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 130,
          totalVisits: 380000,
          neighbors: 950,
          memo: "비타민C 제품 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-25",
        },
        {
          id: "app_4_네이버블로그_002",
          Id: "reviewer_4_002",
          nickname: "스킨케어전문가B",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 170,
          totalVisits: 520000,
          neighbors: 1300,
          memo: "스킨케어 제품 리뷰를 많이 작성합니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-26",
        },
        {
          id: "app_4_네이버블로그_003",
          Id: "influencer_4_001",
          nickname: "뷰티인플루언서C",
          userType: "인플루언서" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 280,
          totalVisits: 840000,
          neighbors: 2100,
          memo: "뷰티 제품 전문 인플루언서입니다. 많은 팔로워를 보유하고 있습니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-27",
        },
        {
          id: "app_4_네이버블로그_004",
          Id: "influencer_4_002",
          nickname: "스킨케어인플루언서D",
          userType: "인플루언서" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 320,
          totalVisits: 960000,
          neighbors: 2400,
          memo: "스킨케어 전문 인플루언서입니다. 고품질 콘텐츠를 제작합니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-28",
        },
      ],
      selectedApplicants: [
        {
          id: "sel_4_네이버블로그_001",
          Id: "selected_influencer_4_001",
          nickname: "선정된뷰티인플루언서1",
          userType: "인플루언서" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 350,
          totalVisits: 1050000,
          neighbors: 2800,
          memo: "이미 선정된 우수 인플루언서입니다. 높은 영향력을 가지고 있습니다.",
          selectionStatus: "선정하기" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-24",
        },
        {
          id: "sel_4_네이버블로그_002",
          Id: "selected_influencer_4_002",
          nickname: "선정된스킨케어인플루언서2",
          userType: "인플루언서" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 380,
          totalVisits: 1140000,
          neighbors: 3000,
          memo: "이미 선정된 우수 인플루언서입니다. 전문적인 콘텐츠로 유명합니다.",
          selectionStatus: "선정하기" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-23",
        },
      ],
    },
  },
  // delivery_5: 유기농 아기용 세제
  {
    ...deliveryCampaigns[4],
    applicantData: {
      applicants: [
        {
          id: "app_5_인스타그램_001",
          Id: "reviewer_5_001",
          nickname: "육아리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          followers: 750,
          memo: "육아용품 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "인스타그램" as const,
          registrationDate: "2025-12-10",
        },
      ],
      selectedApplicants: [],
    },
  },
  // delivery_6: 프리미엄 강아지 사료
  {
    ...deliveryCampaigns[5],
    applicantData: {
      applicants: [
        {
          id: "app_6_유튜브_001",
          Id: "reviewer_6_001",
          nickname: "반려동물리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 160,
          totalVisits: 480000,
          neighbors: 1100,
          memo: "반려동물 제품 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "유튜브",
          registrationDate: "2025-12-19",
        },
        {
          id: "app_6_유튜브_002",
          Id: "reviewer_6_002",
          nickname: "펫인플루언서B",
          userType: "인플루언서" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 240,
          totalVisits: 720000,
          neighbors: 1900,
          memo: "반려동물 전문 인플루언서입니다.",
          selectionStatus: "미선택" as const,
          channel: "유튜브",
          registrationDate: "2025-12-20",
        },
        {
          id: "app_6_유튜브_003",
          Id: "reviewer_6_003",
          nickname: "강아지사료전문가C",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 190,
          totalVisits: 570000,
          neighbors: 1400,
          memo: "강아지 사료 리뷰를 자주 작성합니다.",
          selectionStatus: "미선택" as const,
          channel: "유튜브",
          registrationDate: "2025-12-21",
        },
      ],
      selectedApplicants: [
        {
          id: "sel_6_유튜브_001",
          Id: "selected_6_001",
          nickname: "선정된반려동물리뷰어1",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 310,
          totalVisits: 930000,
          neighbors: 2600,
          memo: "이미 선정된 우수 리뷰어입니다.",
          selectionStatus: "선정하기" as const,
          channel: "유튜브",
          registrationDate: "2025-12-19",
        },
      ],
    },
    contents: {
      waiting: [
        {
          id: "content_delivery_6_waiting_001",
          createdAt: "2025-12-20T10:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "반려동물리뷰어A",
          channelId: "youtube_028",
          channel: "유튜브",
          profileImage: "",
        },
        {
          id: "content_delivery_6_waiting_002",
          createdAt: "2025-12-21T11:00:00.000Z",
          status: "검수" as const,
          userType: "인플루언서" as const,
          nickname: "펫인플루언서B",
          channelId: "youtube_029",
          channel: "유튜브",
          profileImage: "",
        },
      ],
      reviewing: [
        {
          id: "content_delivery_6_reviewing_001",
          createdAt: "2025-12-19T09:00:00.000Z",
          status: "검수중" as const,
          userType: "리뷰어" as const,
          nickname: "강아지사료전문가C",
          channelId: "youtube_030",
          channel: "유튜브",
          updatedAt: "2025-12-20T10:00:00.000Z",
          isRejected: false,
          isLate: false,
          profileImage: "",
        },
      ],
      completed: [
        {
          id: "content_delivery_6_completed_001",
          createdAt: "2025-12-18T08:00:00.000Z",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "선정된반려동물리뷰어1",
          channelId: "youtube_031",
          channel: "유튜브",
          updatedAt: "2025-12-19T09:00:00.000Z",
          isLate: false,
          profileImage: "",
        },
      ],
    },
  },
  // delivery_7: 네이버클립 크리에이터 키트
  // 📌 네이버클립 채널:
  // - delivery_7 캠페인의 채널은 "네이버클립"입니다
  // - 네이버클립 신청자는 NaverClipApplicant 타입을 사용하며 followers 필드를 가집니다
  // - dailyVisits, totalVisits, neighbors 대신 followers를 사용합니다
  // - 네이버클립은 인플루언서가 없고 모두 리뷰어입니다
  // - 타입 단언(as any)을 사용하여 DeliveryCampaignDataExtended 타입의 제약을 우회합니다
  {
    ...deliveryCampaigns[6],
    applicantData: {
      applicants: [
        {
          id: "app_7_네이버클립_001",
          Id: "reviewer_7_001",
          nickname: "크리에이터A",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          followers: 2800,
          memo: "네이버클립 크리에이터 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버클립" as const,
          registrationDate: "2025-12-28",
        } as any,
        {
          id: "app_7_네이버클립_002",
          Id: "reviewer_7_002",
          nickname: "영상제작전문가B",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          followers: 3200,
          memo: "영상 제작 장비 리뷰를 자주 작성합니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버클립" as const,
          registrationDate: "2025-12-29",
        } as any,
        {
          id: "app_7_네이버클립_003",
          Id: "reviewer_7_003",
          nickname: "클립리뷰어C",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          followers: 3800,
          memo: "네이버클립 전문 리뷰어입니다. 다양한 영상 콘텐츠를 제작합니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버클립" as const,
          registrationDate: "2025-12-30",
        } as any,
        {
          id: "app_7_네이버클립_004",
          Id: "reviewer_7_004",
          nickname: "비디오크리에이터D",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          followers: 4200,
          memo: "고품질 영상 콘텐츠를 제작하는 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버클립" as const,
          registrationDate: "2025-12-31",
        } as any,
      ],
      selectedApplicants: [
        {
          id: "sel_7_네이버클립_001",
          Id: "selected_reviewer_7_001",
          nickname: "선정된클립리뷰어1",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          followers: 4500,
          memo: "이미 선정된 우수 리뷰어입니다. 높은 팔로워 수를 보유하고 있습니다.",
          selectionStatus: "선정하기" as const,
          channel: "네이버클립" as const,
          registrationDate: "2025-12-27",
        } as any,
        {
          id: "sel_7_네이버클립_002",
          Id: "selected_reviewer_7_002",
          nickname: "선정된비디오크리에이터2",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          followers: 5000,
          memo: "이미 선정된 우수 리뷰어입니다. 전문적인 영상 제작 능력을 보유하고 있습니다.",
          selectionStatus: "선정하기" as const,
          channel: "네이버클립" as const,
          registrationDate: "2025-12-26",
        } as any,
      ],
    },
    contents: {
      waiting: [
        {
          id: "content_delivery_7_waiting_001",
          createdAt: "2025-12-28T10:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "크리에이터A",
          channelId: "naverclip_018",
          channel: "네이버클립",
          profileImage: "",
        } as any,
      ],
      reviewing: [
        {
          id: "content_delivery_7_reviewing_001",
          createdAt: "2025-12-26T09:00:00.000Z",
          status: "검수중" as const,
          userType: "리뷰어" as const,
          nickname: "영상제작전문가B",
          channelId: "naverclip_019",
          channel: "네이버클립",
          updatedAt: "2025-12-27T10:00:00.000Z",
          isRejected: false,
          isLate: false,
          profileImage: "",
        } as any,
      ],
      completed: [
        {
          id: "content_delivery_7_completed_001",
          createdAt: "2025-12-24T08:00:00.000Z",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "네이버클립크리에이터C",
          channelId: "naverclip_020",
          channel: "네이버클립",
          updatedAt: "2025-12-25T09:00:00.000Z",
          isLate: false,
          profileImage: "",
        } as any,
      ],
    },
  },
  // delivery_8: 프리미엄 홈트레이닝 용품 세트
  {
    ...deliveryCampaigns[7],
    applicantData: {
      applicants: [
        {
          id: "app_8_네이버블로그_001",
          Id: "reviewer_8_001",
          nickname: "운동리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 150,
          totalVisits: 450000,
          neighbors: 1100,
          memo: "홈트레이닝 용품 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-12",
        },
      ],
      selectedApplicants: [
        {
          id: "sel_8_네이버블로그_001",
          Id: "selected_8_001",
          nickname: "선정된홈트리뷰어1",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 200,
          totalVisits: 600000,
          neighbors: 1500,
          memo: "이미 선정된 우수 리뷰어입니다.",
          selectionStatus: "선정하기" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-18",
        },
        {
          id: "sel_8_네이버블로그_002",
          Id: "selected_8_002",
          nickname: "선정된운동인플루언서1",
          userType: "인플루언서" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 250,
          totalVisits: 750000,
          neighbors: 2000,
          memo: "이미 선정된 우수 인플루언서입니다.",
          selectionStatus: "선정하기" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-19",
        },
      ],
    },
    contents: {
      waiting: [
        {
          id: "content_delivery_8_waiting_001",
          createdAt: "2025-12-28T10:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "선정된홈트리뷰어1",
          channelId: "naverblog_021",
          channel: "네이버블로그",
          profileImage: "",
          extension_request_reason:
            "개인 사정으로 인해 등록 기한을 3일 연장해주시면 감사하겠습니다.",
        },
        {
          id: "content_delivery_8_waiting_002",
          createdAt: "2025-12-29T14:30:00.000Z",
          status: "검수" as const,
          userType: "인플루언서" as const,
          nickname: "선정된운동인플루언서1",
          channelId: "naverblog_022",
          channel: "네이버블로그",
          profileImage: "",
          extension_request_reason:
            "촬영 일정이 지연되어 등록 기한을 5일만 연장해주시면 감사하겠습니다.",
        },
      ],
      reviewing: [],
      completed: [],
    },
  },
  // delivery_9: 프리미엄 스킨케어 세트
  {
    ...deliveryCampaigns[8],
    applicantData: {
      applicants: [
        {
          id: "app_9_인스타그램_001",
          Id: "reviewer_9_001",
          nickname: "스킨케어리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          followers: 1500,
          memo: "스킨케어 세트 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "인스타그램" as const,
          registrationDate: "2025-12-30",
        },
        {
          id: "app_9_인스타그램_002",
          Id: "reviewer_9_002",
          nickname: "뷰티인플루언서B",
          userType: "인플루언서" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          followers: 2100,
          memo: "뷰티 제품 전문 인플루언서입니다.",
          selectionStatus: "미선택" as const,
          channel: "인스타그램" as const,
          registrationDate: "2025-12-31",
        },
      ],
      selectedApplicants: [
        {
          id: "sel_9_인스타그램_001",
          Id: "selected_9_001",
          nickname: "스킨케어리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          followers: 1500,
          memo: "이미 선정된 우수 리뷰어입니다.",
          selectionStatus: "선정하기" as const,
          channel: "인스타그램" as const,
          registrationDate: "2025-12-30",
        },
        {
          id: "sel_9_인스타그램_002",
          Id: "selected_9_002",
          nickname: "뷰티인플루언서B",
          userType: "인플루언서" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          followers: 2100,
          memo: "이미 선정된 우수 인플루언서입니다.",
          selectionStatus: "선정하기" as const,
          channel: "인스타그램" as const,
          registrationDate: "2025-12-31",
        },
      ],
    },
    contents: {
      waiting: [
        {
          id: "content_delivery_9_waiting_001",
          createdAt: "2025-12-30T10:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "스킨케어리뷰어A",
          channelId: "insta_019",
          channel: "인스타그램",
          profileImage: "",
        },
        {
          id: "content_delivery_9_waiting_002",
          createdAt: "2025-12-31T11:00:00.000Z",
          status: "검수" as const,
          userType: "인플루언서" as const,
          nickname: "뷰티인플루언서B",
          channelId: "insta_020",
          channel: "인스타그램",
          profileImage: "",
          extension_request_reason:
            "개인 사정으로 인해 등록 기한을 3일 연장해주시면 감사하겠습니다.",
        },
        {
          id: "content_delivery_9_waiting_003",
          createdAt: "2025-12-29T09:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "스킨케어리뷰어E",
          channelId: "insta_023",
          channel: "인스타그램",
          profileImage: "",
          isRejected: true,
          reject_reason:
            "제품 사용 사진이 부족하고 리뷰 내용이 너무 간단합니다. 더 상세한 체험 후기를 작성해주세요.",
        },
      ],
      reviewing: [
        {
          id: "content_delivery_9_reviewing_001",
          createdAt: "2025-12-28T09:00:00.000Z",
          status: "검수중" as const,
          userType: "리뷰어" as const,
          nickname: "스킨케어전문가C",
          channelId: "insta_021",
          channel: "인스타그램",
          updatedAt: "2025-12-29T10:00:00.000Z",
          isRejected: false,
          isLate: false,
          profileImage: "",
        },
        {
          id: "content_delivery_9_reviewing_002",
          createdAt: "2025-12-27T08:00:00.000Z",
          status: "검수중" as const,
          userType: "인플루언서" as const,
          nickname: "뷰티인플루언서F",
          channelId: "insta_024",
          channel: "인스타그램",
          updatedAt: "2025-12-30T15:00:00.000Z",
          isRejected: false,
          isLate: true,
          profileImage: "",
        },
        {
          id: "content_delivery_9_reviewing_003",
          createdAt: "2025-12-26T07:00:00.000Z",
          status: "검수중" as const,
          userType: "리뷰어" as const,
          nickname: "스킨케어리뷰어G",
          channelId: "insta_025",
          channel: "인스타그램",
          updatedAt: undefined,
          isRejected: false,
          isLate: false,
          profileImage: "",
        },
      ],
      completed: [
        {
          id: "content_delivery_9_completed_001",
          createdAt: "2025-12-26T08:00:00.000Z",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "스킨케어리뷰어D",
          channelId: "insta_022",
          channel: "인스타그램",
          updatedAt: "2025-12-27T09:00:00.000Z",
          isLate: false,
          profileImage: "",
        },
        {
          id: "content_delivery_9_completed_002",
          createdAt: "2025-12-25T07:00:00.000Z",
          status: "완료" as const,
          userType: "인플루언서" as const,
          nickname: "뷰티인플루언서H",
          channelId: "insta_026",
          channel: "인스타그램",
          updatedAt: "2025-12-28T10:00:00.000Z",
          isLate: true,
          profileImage: "",
        },
        {
          id: "content_delivery_9_completed_003",
          createdAt: "2025-12-24T06:00:00.000Z",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "스킨케어리뷰어I",
          channelId: "insta_027",
          channel: "인스타그램",
          updatedAt: "2025-12-25T08:00:00.000Z",
          isLate: false,
          profileImage: "",
        },
      ],
    },
  },
  // delivery_10: 유기농 과일 주스 세트
  {
    ...deliveryCampaigns[9],
    applicantData: {
      applicants: [
        {
          id: "app_10_유튜브_001",
          Id: "reviewer_10_001",
          nickname: "식품리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          dailyVisits: 140,
          totalVisits: 420000,
          neighbors: 1000,
          memo: "식품 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "유튜브",
          registrationDate: "2025-12-08",
        },
      ],
      selectedApplicants: [],
    },
  },
  // delivery_12: 프리미엄 스마트워치 체험단
  // 📌 인덱스 수정:
  // - delivery_12는 deliveryCampaigns 배열에서 인덱스 10에 위치합니다
  // - 이전에 deliveryCampaigns[11]을 사용했지만, 이는 delivery_13의 데이터입니다
  // - deliveryCampaigns[10]으로 수정하여 올바른 캠페인 데이터를 참조하도록 했습니다
  {
    ...deliveryCampaigns[10],
    applicantData: {
      applicants: [
        {
          id: "app_12_네이버블로그_001",
          Id: "reviewer_12_001",
          nickname: "스마트워치리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 200,
          totalVisits: 600000,
          neighbors: 1800,
          memo: "스마트워치 제품 체험단 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-20",
        },
        {
          id: "app_12_네이버블로그_002",
          Id: "reviewer_12_002",
          nickname: "테크인플루언서B",
          userType: "인플루언서" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 300,
          totalVisits: 900000,
          neighbors: 3000,
          memo: "디지털 제품 전문 인플루언서입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-21",
        },
        {
          id: "app_12_네이버블로그_003",
          Id: "reviewer_12_003",
          nickname: "웨어러블리뷰어C",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 180,
          totalVisits: 550000,
          neighbors: 1500,
          memo: "웨어러블 기기 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-22",
        },
        {
          id: "app_12_네이버블로그_004",
          Id: "reviewer_12_004",
          nickname: "스마트기기전문가D",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "주의 회원" as const,
          dailyVisits: 120,
          totalVisits: 350000,
          neighbors: 900,
          memo: "스마트 기기 리뷰를 자주 작성합니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-23",
        },
        {
          id: "app_12_네이버블로그_005",
          Id: "reviewer_12_005",
          nickname: "테크리뷰어E",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 250,
          totalVisits: 750000,
          neighbors: 2200,
          memo: "테크 제품 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-24",
        },
      ],
      selectedApplicants: [
        {
          id: "sel_12_네이버블로그_001",
          Id: "selected_12_001",
          nickname: "선정된스마트워치리뷰어1",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 350,
          totalVisits: 1000000,
          neighbors: 3200,
          memo: "이미 선정된 우수 리뷰어입니다.",
          selectionStatus: "선정하기" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-18",
        },
        {
          id: "sel_12_네이버블로그_002",
          Id: "selected_12_002",
          nickname: "선정된테크인플루언서1",
          userType: "인플루언서" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 400,
          totalVisits: 1200000,
          neighbors: 4000,
          memo: "이미 선정된 우수 인플루언서입니다.",
          selectionStatus: "선정하기" as const,
          channel: "네이버블로그",
          registrationDate: "2025-12-19",
        },
      ],
    },
    contents: {
      waiting: [
        {
          id: "content_delivery_12_waiting_001",
          createdAt: "2026-01-10T10:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "선정된스마트워치리뷰어1",
          channelId: "naverblog_031",
          channel: "네이버블로그",
          profileImage: "",
        },
        {
          id: "content_delivery_12_waiting_002",
          createdAt: "2026-01-11T11:00:00.000Z",
          status: "검수" as const,
          userType: "인플루언서" as const,
          nickname: "선정된테크인플루언서1",
          channelId: "naverblog_032",
          channel: "네이버블로그",
          profileImage: "",
        },
      ],
      reviewing: [
        {
          id: "content_delivery_12_reviewing_001",
          createdAt: "2026-01-08T09:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "스마트워치리뷰어A",
          channelId: "naverblog_033",
          channel: "네이버블로그",
          updatedAt: "2026-01-09T10:00:00.000Z",
          isRejected: false,
          isLate: false,
          profileImage: "",
        },
        {
          id: "content_delivery_12_reviewing_002",
          createdAt: "2026-01-09T14:00:00.000Z",
          status: "검수" as const,
          userType: "인플루언서" as const,
          nickname: "테크인플루언서B",
          channelId: "naverblog_034",
          channel: "네이버블로그",
          updatedAt: "2026-01-10T15:00:00.000Z",
          isRejected: false,
          isLate: false,
          profileImage: "",
        },
      ],
      completed: [
        {
          id: "content_delivery_12_completed_001",
          createdAt: "2026-01-05T08:00:00.000Z",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "웨어러블리뷰어C",
          channelId: "naverblog_035",
          channel: "네이버블로그",
          updatedAt: "2026-01-07T09:00:00.000Z",
          isLate: false,
          profileImage: "",
        },
        {
          id: "content_delivery_12_completed_002",
          createdAt: "2026-01-06T10:00:00.000Z",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "스마트기기전문가D",
          channelId: "naverblog_036",
          channel: "네이버블로그",
          updatedAt: "2026-01-08T11:00:00.000Z",
          isLate: false,
          profileImage: "",
        },
      ],
    },
  },
  // delivery_13: 프리미엄 무선 이어버드 체험단
  // 📌 인덱스 확인:
  // - delivery_13은 deliveryCampaigns 배열에서 인덱스 11에 위치합니다
  // - deliveryCampaigns[11]을 사용하는 것이 올바릅니다
  // 📌 네이버클립 채널:
  // - delivery_13 캠페인의 채널은 "클립"입니다
  // - 네이버클립 신청자는 NaverClipApplicant 타입을 사용하며 followers 필드를 가집니다
  // - dailyVisits, totalVisits, neighbors 대신 followers를 사용합니다
  // - 타입 단언(as any)을 사용하여 DeliveryCampaignDataExtended 타입의 제약을 우회합니다
  {
    ...deliveryCampaigns[11],
    applicantData: {
      applicants: [
        {
          id: "app_13_네이버클립_001",
          Id: "reviewer_13_001",
          nickname: "스마트워치리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          followers: 1800,
          memo: "스마트워치 제품 체험단 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버클립" as const,
          registrationDate: "2025-12-20",
        } as any,
        {
          id: "app_13_네이버클립_002",
          Id: "reviewer_13_002",
          nickname: "테크인플루언서B",
          userType: "인플루언서" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "모범 회원" as const,
          followers: 3000,
          memo: "디지털 제품 전문 인플루언서입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버클립" as const,
          registrationDate: "2025-12-21",
        } as any,
        {
          id: "app_13_네이버클립_004",
          Id: "reviewer_13_004",
          nickname: "이용제한리뷰어D",
          userType: "리뷰어" as const,
          profileImage: "/images/mypage/profile.svg",
          memberType: "이용 제한" as const,
          followers: 500,
          memo: "이용 제한 계정입니다.",
          selectionStatus: "이용제한 계정" as const,
          channel: "네이버클립" as const,
          registrationDate: "2025-12-23",
        } as any,
      ],
      selectedApplicants: [],
    },
  },
  // delivery_test: 모든 경우의 수 테스트 캠페인
  {
    ...deliveryCampaigns[1],
    id: "delivery_test_all_cases",
    title: "[테스트] 배송형 모든 카드 경우의 수",
    recruitment: {
      current: 7,
      total: 10,
    },
    detailedSchedule: {
      applicationStart: "2026-02-01",
      applicationEnd: "2026-02-28",
      announcement: "2026-03-02",
      purchasePeriod: "2026-01-30 ~ 2026-02-04",
      registrationPeriod: "2026-02-04 ~ 2026-05-05",
    },
    applicantData: {
      applicants: [],
      selectedApplicants: [],
    },
    contents: {
      waiting: [
        // 경우의 수 1: 콘텐츠 미등록 (기한 내)
        {
          id: "delivery_test_waiting_001",
          createdAt: "2026-02-01T10:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "콘텐츠미등록유저",
          channelId: "youtube_test_001",
          channel: "유튜브",
          profileImage: "",
          receiptImages: ["/images/test_img/eximg.png"],
        },
        // 경우의 수 2: 연장 요청됨
        {
          id: "delivery_test_waiting_002",
          createdAt: "2026-02-02T11:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "연장요청유저",
          channelId: "youtube_test_002",
          channel: "유튜브",
          profileImage: "",
          extension_request_reason: "개인 사정으로 3일 연장 요청드립니다.",
          receiptImages: ["/images/test_img/eximg.png"],
        },
        // 경우의 수 3: 반려됨
        {
          id: "delivery_test_waiting_003",
          createdAt: "2026-02-03T12:00:00.000Z",
          status: "검수" as const,
          userType: "인플루언서" as const,
          nickname: "반려당한유저",
          channelId: "youtube_test_003",
          channel: "유튜브",
          profileImage: "",
          isRejected: true,
          receiptImages: ["/images/test_img/eximg.png"],
        },
        // 경우의 수 4: 신고됨
        {
          id: "delivery_test_waiting_004",
          createdAt: "2026-02-04T13:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "신고당한유저",
          channelId: "youtube_test_004",
          channel: "유튜브",
          profileImage: "",
          isReported: true,
          reportedDate: "2026-02-04T14:30:00.000Z",
          receiptImages: ["/images/test_img/eximg.png"],
        },
      ],
      reviewing: [
        // 확인 탭 경우의 수 1: 검수 중 상태
        {
          id: "delivery_test_reviewing_001",
          createdAt: "2026-02-01T09:00:00.000Z",
          status: "검수중" as const,
          userType: "인플루언서" as const,
          nickname: "검수중유저",
          channelId: "youtube_test_005",
          channel: "유튜브",
          profileImage: "",
          receiptImages: [
            "https://via.placeholder.com/800x600/FFB6C1/FFFFFF?text=Receipt+Image+1",
            "https://via.placeholder.com/800x600/87CEEB/FFFFFF?text=Receipt+Image+2",
          ],
        },
      ],
      completed: [
        // 완료 탭 경우의 수 1: 승인 완료 상태
        {
          id: "delivery_test_completed_001",
          createdAt: "2026-01-28T08:00:00.000Z",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "승인완료유저",
          channelId: "youtube_test_006",
          channel: "유튜브",
          profileImage: "",
          updatedAt: "2026-01-29T09:00:00.000Z",
          receiptImages: [
            "https://via.placeholder.com/800x600/98FB98/FFFFFF?text=Receipt+Image+Completed",
          ],
        },
        // 완료 탭 경우의 수 2: 지각등록 승인 완료 상태
        {
          id: "delivery_test_completed_002",
          createdAt: "2026-02-04T15:00:00.000Z",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "지각제출유저",
          channelId: "youtube_test_007",
          channel: "유튜브",
          profileImage: "",
          updatedAt: "2026-02-04T16:00:00.000Z",
          isLateSubmission: true,
          receiptImages: ["/images/test_img/eximg.png"],
        },
      ],
    },
  },
];

/**
 * 배송형 캠페인 종료/취소 데이터 (파트너 관리용)
 *
 * 설명:
 * - 종료되거나 취소된 배송형 캠페인의 데이터입니다.
 * - 콘텐츠 데이터를 포함합니다.
 */
export const deliveryClosedCampaignsExtended: DeliveryCampaignDataExtended[] = [
  {
    ...deliveryCampaigns[0],
    id: "902",
    title: "[취소] 제품 배송형 체험단",
    status: "취소" as const,
    brandName: "인스타그램",
    statusText: "캠페인을 취소하였습니다.",
    contents: {
      waiting: [],
      reviewing: [
        {
          id: "902-r-1",
          createdAt: "2025-10-28T10:15:00.000Z",
          status: "검수" as const,
          channel: "인스타그램",
          userType: "인플루언서" as const,
          nickname: "참여자-1",
          channelId: "902-r-1",
          updatedAt: "2025-10-28T10:45:00.000Z",
          profileImage: "",
        },
        {
          id: "902-r-2",
          createdAt: "2025-10-28T11:30:00.000Z",
          status: "검수" as const,
          channel: "인스타그램",
          userType: "인플루언서" as const,
          nickname: "참여자-2",
          channelId: "902-r-2",
          isRejected: true,
          profileImage: "",
        },
      ],
      completed: [
        {
          id: "902-c-1",
          createdAt: "2025-10-27T18:45:00.000Z",
          status: "완료" as const,
          channel: "인스타그램",
          userType: "인플루언서" as const,
          nickname: "참여자-2",
          channelId: "902-c-1",
          updatedAt: "2025-10-27T19:10:00.000Z",
          profileImage: "",
        },
        {
          id: "902-c-2",
          createdAt: "2025-10-27T20:00:00.000Z",
          status: "완료" as const,
          channel: "인스타그램",
          userType: "인플루언서" as const,
          nickname: "참여자-3",
          channelId: "902-c-2",
          isLate: true,
          profileImage: "",
        },
        {
          id: "902-c-3",
          createdAt: "2025-10-27T21:10:00.000Z",
          status: "완료" as const,
          channel: "인스타그램",
          userType: "인플루언서" as const,
          nickname: "참여자-4",
          channelId: "902-c-3",
          profileImage: "",
        },
      ],
    },
  },
];

/* ========================================
   🚚 배송형 캠페인 헬퍼 함수들
   ======================================== */

/**
 * DeliveryCampaignDataItem 타입 정의 (하위 호환성)
 */
export interface DeliveryCampaignDataItem {
  campaignInfo: {
    id: string;
    title: string;
    image: string;
    status: "진행 중" | "대기 중" | "모집 중" | "종료" | "마감" | "취소" | "긴급";
    campaignType: "배송형";
    category: string;
    brandName: string;
    recruitmentPeriod: string;
    announcementDate: string;
    registrationPeriod: string;
    recruitedCount: number;
    totalCount: number;
    daysLeft: number;
    statusText?: string;
    partnerName?: string;
    point?: number;
    channel?: string;
  };
  applicantData?: {
    applicants: Array<{
      id: string;
      Id: string;
      nickname: string;
      userType: "리뷰어" | "인플루언서";
      profileImage: string;
      memberType: "모범 회원" | "주의 회원" | "경고 회원" | "이용 제한";
      // 채널별 스펙 차이 지원 (네이버클립 등)
      dailyVisits?: number;
      totalVisits?: number;
      neighbors?: number;
      followers?: number;
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
      dailyVisits?: number;
      totalVisits?: number;
      neighbors?: number;
      followers?: number;
      memo: string;
      selectionStatus: "선정하기";
      channel: string;
      registrationDate?: string;
    }>;
  };
  contents?: {
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
    }>;
  };
}

/**
 * 새 캠페인 ID 생성
 *
 * @returns 새로운 캠페인 ID (기존 ID 중 최대값 + 1)
 *
 * 설명:
 * - 정적 데이터와 localStorage에 저장된 캠페인 모두 확인하여 중복되지 않는 ID를 생성합니다.
 * - localStorage의 캠페인도 확인하여 새로 등록한 캠페인과 ID가 겹치지 않도록 합니다.
 */
function generateNewCampaignId(): string {
  // 기존 캠페인 ID 중 최대값 찾기
  const allCampaigns = [...deliveryCampaignsExtended, ...deliveryClosedCampaignsExtended];

  // localStorage에 저장된 캠페인도 확인
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("deliveryCampaigns");
      if (stored) {
        const storedCampaigns: Array<{ campaignInfo: { id: string } }> = JSON.parse(stored);
        if (Array.isArray(storedCampaigns)) {
          // localStorage의 캠페인들을 allCampaigns에 추가
          storedCampaigns.forEach((campaign) => {
            if (campaign.campaignInfo && campaign.campaignInfo.id) {
              // campaignInfo 구조를 맞춰서 추가
              allCampaigns.push({
                id: campaign.campaignInfo.id,
              } as any);
            }
          });
        }
      }
    } catch (_error) {}
  }

  const existingIds = allCampaigns
    .map((c) => {
      const numId = parseInt(c.id);
      return isNaN(numId) ? 0 : numId;
    })
    .filter((id) => id > 0);
  const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 960;

  return String(maxId + 1);
}

/**
 * 폼 데이터를 DeliveryCampaignDataItem 형태로 변환하여 새 캠페인 생성
 *
 * 설명:
 * - 배송형 캠페인 등록 폼에서 입력한 데이터를 deliveryCampaigns 구조에 맞게 변환합니다.
 * - 새 캠페인 ID를 자동 생성합니다.
 * - 등록 시 상태는 날짜 기반으로 자동 계산됩니다.
 *
 * @param formData - 폼에서 입력받은 캠페인 데이터
 * @param imageUrl - 업로드된 이미지 URL (첫 번째 이미지 사용)
 * @returns 새로 생성된 DeliveryCampaignDataItem 객체
 */
export function createDeliveryCampaign(
  formData: CampaignFormData,
  imageUrl: string = "/images/main/campaign_img/eximg_1.png"
): DeliveryCampaignDataItem {
  // 새 캠페인 ID 생성
  const newId = generateNewCampaignId();

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
  const finalStatus =
    calculatedStatus === "종료"
      ? "마감"
      : (calculatedStatus as DeliveryCampaignDataItem["campaignInfo"]["status"]);

  // 플랫폼명 정규화 (공백 제거하여 로고 매핑 일치시키기)
  const normalizedBrandName = formData.platform ? formData.platform.replace(/\s+/g, "") : "기본";

  // 포인트 계산 (additionalPoints를 숫자로 변환)
  const points = Number(formData.additionalPoints) || 0;

  return {
    campaignInfo: {
      id: newId,
      title: formData.title,
      image: imageUrl,
      status: finalStatus,
      campaignType: "배송형",
      category: formData.category || "기타",
      brandName: normalizedBrandName,
      recruitmentPeriod: formData.recruitmentPeriod,
      announcementDate: formData.announcementDate,
      registrationPeriod: formData.registrationPeriod,
      recruitedCount: 0,
      totalCount: totalCount,
      daysLeft: daysLeft,
      point: points,
      channel: formData.platform || "",
    },
    applicantData: {
      applicants: [],
      selectedApplicants: [],
    },
  };
}

/**
 * 배송형 캠페인 수정
 *
 * 설명:
 * - 기존 배송형 캠페인을 수정합니다.
 * - 캠페인 ID는 유지하고, 나머지 정보만 업데이트합니다.
 * - 신청자 데이터는 유지합니다.
 *
 * @param campaignId - 수정할 캠페인 ID
 * @param formData - 폼에서 입력받은 캠페인 데이터
 * @param imageUrl - 업로드된 이미지 URL
 * @returns 수정된 DeliveryCampaignDataItem 객체
 */
export function updateDeliveryCampaign(
  campaignId: string,
  formData: CampaignFormData,
  imageUrl: string = "/images/main/campaign_img/eximg_1.png"
): DeliveryCampaignDataItem {
  // 기존 캠페인 데이터 찾기
  const allCampaigns = [...deliveryCampaignsExtended, ...deliveryClosedCampaignsExtended];
  const existingCampaign = allCampaigns.find((c) => c.id === campaignId);

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
  const finalStatus =
    calculatedStatus === "종료"
      ? "마감"
      : (calculatedStatus as DeliveryCampaignDataItem["campaignInfo"]["status"]);

  // 플랫폼명 정규화
  const normalizedBrandName = formData.platform ? formData.platform.replace(/\s+/g, "") : "기본";

  return {
    campaignInfo: {
      id: campaignId,
      title: formData.title,
      image: imageUrl,
      status: finalStatus,
      campaignType: "배송형",
      category: formData.category || "기타",
      brandName: normalizedBrandName,
      recruitmentPeriod: formData.recruitmentPeriod,
      announcementDate: formData.announcementDate,
      registrationPeriod: formData.registrationPeriod,
      recruitedCount: existingApplicantData?.applicants?.length ?? 0,
      totalCount: totalCount,
      daysLeft: daysLeft,
    },
    applicantData: existingApplicantData,
  };
}

/**
 * 새 배송형 캠페인을 deliveryCampaigns 배열에 추가
 *
 * 설명:
 * - 실제 프로덕션 환경에서는 API를 통해 서버에 저장해야 합니다.
 * - 현재는 클라이언트 사이드 더미 데이터 구조이므로,
 *   이 함수는 변환된 데이터를 반환만 합니다.
 *
 * @param formData - 폼에서 입력받은 캠페인 데이터
 * @param imageUrl - 업로드된 이미지 URL
 * @returns 새로 생성된 DeliveryCampaignDataItem 객체
 */
export function addDeliveryCampaign(
  formData: CampaignFormData,
  imageUrl: string = "/images/main/campaign_img/eximg_1.png"
): DeliveryCampaignDataItem {
  return createDeliveryCampaign(formData, imageUrl);
}

/**
 * 배송형 캠페인의 콘텐츠 데이터를 조회하는 함수
 *
 * 설명:
 * - 캠페인 ID를 받아서 해당 캠페인의 콘텐츠(검수 중/완료)를 반환합니다.
 * - 종료/취소된 캠페인과 진행 중인 캠페인 모두 지원합니다.
 *
 * @param campaignId - 조회할 캠페인의 ID
 * @returns 검수 중/완료된 콘텐츠를 담은 객체
 */
export function getDeliveryContentsById(campaignId: string): ContentByTab {
  // 종료/취소 캠페인에서 찾기
  const closedCampaign = deliveryClosedCampaignsExtended.find((c) => c.id === campaignId);
  if (closedCampaign?.contents) {
    return closedCampaign.contents;
  }

  // 진행 중인 캠페인에서 찾기
  const campaign = deliveryCampaignsExtended.find((c) => c.id === campaignId);
  if (campaign?.contents) {
    return campaign.contents;
  }

  // 콘텐츠가 없는 경우 빈 배열 반환
  return { waiting: [], reviewing: [], completed: [] };
}
