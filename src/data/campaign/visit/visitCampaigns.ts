// 방문형 페이지 임시 목업 데이터!

import type { CampaignFormData } from "@/types/user/user";
import type {
  ContentByTab,
  CampaignWithApplicants,
} from "@/data/partner/sharedCampaigns";
import { calculateDaysLeft, calculateCampaignStatus } from "../delivery/utils";

interface VisitCampaignData {
  id: string; // 캠페인 고유 식별자
  title: string; // 캠페인 제목
  category: string; // 캠페인 카테고리 (방문형)
  image: string; // 메인 캠페인 이미지 경로
  subcategory: string; // 카테고리 정보 (예: 여가, 기타, 식품 등)
  region: string; // 지역 정보 (예: 서울 강남/서초, 경기 성남/분당 등)
  points: number; // 지급 포인트
  description: string; // 캠페인 설명 및 제공 내역
  recruitment: { current: number; total: number }; // 모집 정보 (현재 지원자 수 / 총 모집 인원)
  schedule: string; // 일정 정보 (현재 사용하지 않음)
  dayCount: string; // 남은 일수 (예: D-5, 긴급 등)
  detailedSchedule: {
    applicationStart: string; // 신청 시작일
    applicationEnd: string; // 신청 마감일
    announcement: string; // 선정 발표일
    purchasePeriod: string; // 등록 기간
  };
  campaign_detail_image: string; // 캠페인 상세 이미지 경로
  channel: string; // 채널 정보 (블로그, 인스타그램, 유튜브 등)
  keyword: string; // 캠페인 키워드
  guidelineTexts: string[]; // 페이지별 상세 가이드 문구 목록
  requirements: string[]; // 캠페인별 요구사항 코드 목록 (예: ["keyword", "store_info", "text_1000", "photo_8", "video_visit"])

  // 방문형 캠페인 추가 필드들
  visitAddress?: string; // 방문 주소 (선택사항)
  addressGuide?: string; // 주소 상세 안내 (선택사항)
  visitLink?: string; // 방문 링크 (선택사항)
}

export const visitCampaigns: VisitCampaignData[] = [
  // visit_1: 예정 탭
  {
    id: "visit_1",
    title: "식당 방문 리뷰",
    category: "방문형",
    image: "/images/main/campaign_img/eximg_8.png",
    subcategory: "식품",
    region: "서울 > 강남구",
    points: 22000,
    description: "식당 방문 후 블로그 리뷰 작성",
    recruitment: { current: 67, total: 6 },
    schedule: "",
    dayCount: "D-5",
    detailedSchedule: {
      // 모집 중 - 현재 날짜 기준 (2025-12-20 ~ 2026-01-06)
      applicationStart: "2025-12-20",
      applicationEnd: "2026-01-06",
      announcement: "2026-01-08",
      purchasePeriod: "2026-01-10 ~ 2026-01-17",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "네이버 블로그",
    keyword: "#맛집추천 #강남식당 #방문후기 #솔직리뷰",
    guidelineTexts: [
      "식당 방문형 캠페인 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★방문 전 반드시 매장 영업시간 및 휴무일을 확인해주세요!! 매장 방문 불가시에는 1:1문의로 제보 부탁드립니다!! 방문 가능한 시간대에 맞춰 캠페인을 신청해주세요★",
      "★제공된 혜택을 모두 활용하여 작성해주세요 - 매장 방문 체험 필수 - 실제 방문 사진 및 영상 필수 - 매장 분위기 및 서비스 체험 내용 포함<br />★방문 리뷰는 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★<br />★방문 시 실제 체험하는 모습 사진 필수 첨부해주세요★<br />★방문 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★식당 방문형 캠페인 입니다★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [방문형]으로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 당첨당일 매장 방문 해주세요<br /> 3. 기간 내 방문 및 리뷰 작성 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★방문 리뷰 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 방문하여 경험한 매장의 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 매장 방문 불가 및 방문 착오할 경우 : 페이백 미지급 및 선정취소 <br /> - 방문 리뷰 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 매장 정보는 정확하게 기재해주세요 (주소, 영업시간, 연락처, 주차 가능 여부)<br />- 제공받은 혜택으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 혜택 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 혜택 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 방문형의 경우 지도와 함께 매장 주소,영업시간,주차유무등을 기재해주세요. <br />- 방문형 캠페인의 경우 매장 정보를 꼭 넣어주세요",
    ],
    visitAddress: "서울특별시 강남구 테헤란로 123",
    addressGuide: "강남역 2번 출구에서 도보 5분, 코엑스 맞은편 건물 3층",
    visitLink: "https://naver.me/ABC123",
    requirements: [
      "text_1800",
      "photo_12",
      "video_1_150",
      "product_link",
      "keyword",
    ],
  },
  // visit_2: 연장요청 탭
  {
    id: "visit_2",
    title: "카페 방문 체험",
    category: "방문형",
    image: "/images/main/campaign_img/eximg_9.png",
    subcategory: "식품",
    region: "서울 > 마포구",
    points: 18000,
    description: "신규 오픈 카페 방문 후 인스타그램 리뷰",
    recruitment: { current: 89, total: 8 },
    schedule: "",
    dayCount: "긴급",
    detailedSchedule: {
      // 모집 중 - 현재 날짜 기준 (2025-12-19 ~ 2026-01-05)
      applicationStart: "2025-12-19",
      applicationEnd: "2026-01-05",
      announcement: "2026-01-07",
      purchasePeriod: "2026-01-08 ~ 2026-01-25",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "인스타그램",
    keyword: "#홍대카페 #신상카페 #카페투어 #디저트맛집",
    guidelineTexts: [
      "카페 방문형 캠페인 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★방문 전 반드시 매장 영업시간 및 휴무일을 확인해주세요!! 매장 방문 불가시에는 1:1문의로 제보 부탁드립니다!! 방문 가능한 시간대에 맞춰 캠페인을 신청해주세요★",
      "★제공된 혜택을 모두 활용하여 작성해주세요 - 카페 방문 체험 필수 - 실제 방문 사진 및 영상 필수 - 카페 분위기 및 음료 체험 내용 포함<br />★방문 리뷰는 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★<br />★방문 시 실제 체험하는 모습 사진 필수 첨부해주세요★<br />★방문 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★카페 방문형 캠페인 입니다★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [방문형]으로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 당첨당일 매장 방문 해주세요<br /> 3. 기간 내 방문 및 리뷰 작성 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★방문 리뷰 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 방문하여 경험한 카페의 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 매장 방문 불가 및 방문 착오할 경우 : 페이백 미지급 및 선정취소 <br /> - 방문 리뷰 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 매장 정보는 정확하게 기재해주세요 (주소, 영업시간, 연락처, 주차 가능 여부)<br />- 제공받은 혜택으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 혜택 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 혜택 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 방문형의 경우 지도와 함께 매장 주소,영업시간,주차유무등을 기재해주세요. <br />- 방문형 캠페인의 경우 매장 정보를 꼭 넣어주세요",
    ],
    visitAddress: "강원 양양군 현북면 법수치길 59 부라보 캠프펜션&캠핑장",
    addressGuide:
      "양양 ic → 양양 시내 방향: '한남초등학교' 경유지를 찍고, 59번 국도를 타고 오시면 편하게 오실수있습니다.",
    visitLink: "https://naver.me/FZ8eTORF",
    requirements: [
      "text_1200",
      "photo_10",
      "video_120",
      "product_link",
      "keyword",
    ],
  },
  // visit_3: 신청 탭
  {
    id: "visit_3",
    title: "뷰티샵 방문 체험",
    category: "방문형",
    image: "/images/main/campaign_img/eximg_10.png",
    subcategory: "뷰티",
    region: "서울 > 강남구",
    points: 35000,
    description: "뷰티샵 방문 후 체험 리뷰 작성",
    recruitment: { current: 45, total: 4 },
    schedule: "",
    dayCount: "D-3",
    detailedSchedule: {
      // 모집 중 - 현재 날짜 기준 (2025-12-21 ~ 2026-01-08)
      applicationStart: "2025-12-21",
      applicationEnd: "2026-01-08",
      announcement: "2026-01-10",
      purchasePeriod: "2026-01-13 ~ 2026-01-20",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "인스타그램",
    keyword: "#뷰티샵추천 #압구정네일샵 #미용실후기 #뷰티체험",
    guidelineTexts: [
      "뷰티샵 방문형 캠페인 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★방문 전 반드시 매장 영업시간 및 휴무일을 확인해주세요!! 매장 방문 불가시에는 1:1문의로 제보 부탁드립니다!! 방문 가능한 시간대에 맞춰 캠페인을 신청해주세요★",
      "★제공된 혜택을 모두 활용하여 작성해주세요 - 뷰티샵 방문 체험 필수 - 실제 방문 사진 및 영상 필수 - 뷰티샵 분위기 및 서비스 체험 내용 포함<br />★방문 리뷰는 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★<br />★방문 시 실제 체험하는 모습 사진 필수 첨부해주세요★<br />★방문 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★뷰티샵 방문형 캠페인 입니다★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [방문형]으로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 당첨당일 매장 방문 해주세요<br /> 3. 기간 내 방문 및 리뷰 작성 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★방문 리뷰 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 방문하여 경험한 뷰티샵의 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 매장 방문 불가 및 방문 착오할 경우 : 페이백 미지급 및 선정취소 <br /> - 방문 리뷰 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 매장 정보는 정확하게 기재해주세요 (주소, 영업시간, 연락처, 주차 가능 여부)<br />- 제공받은 혜택으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 혜택 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 혜택 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 방문형의 경우 지도와 함께 매장 주소,영업시간,주차유무등을 기재해주세요. <br />- 방문형 캠페인의 경우 매장 정보를 꼭 넣어주세요",
    ],
    visitAddress: "서울특별시 강남구 압구정로 456",
    addressGuide: "압구정역 1번 출구에서 도보 3분, 갤러리아 백화점 근처",
    visitLink: "https://naver.me/DEF456",
    requirements: [
      "text_1234",
      "photo_1",
      "video_120",
      "product_link",
      "keyword",
    ],
  },
  // visit_4: 예정 탭
  {
    id: "visit_4",
    title: "헬스장 방문 체험",
    category: "방문형",
    image: "/images/main/campaign_img/eximg_11.png",
    subcategory: "여가",
    region: "서울 > 송파구",
    points: 28000,
    description: "헬스장 방문 후 유튜브 리뷰 영상 제작",
    recruitment: { current: 123, total: 10 },
    schedule: "",
    dayCount: "D-7",
    detailedSchedule: {
      // 모집 중 - 현재 날짜 기준 (2025-12-22 ~ 2026-01-10)
      applicationStart: "2025-12-22",
      applicationEnd: "2026-01-10",
      announcement: "2026-01-12",
      purchasePeriod: "2026-01-15 ~ 2026-01-22",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "유튜브",
    keyword: "#헬스장추천 #피트니스센터 #송파헬스장 #운동브이로그",
    guidelineTexts: [
      "헬스장 방문형 캠페인 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★방문 전 반드시 매장 영업시간 및 휴무일을 확인해주세요!! 매장 방문 불가시에는 1:1문의로 제보 부탁드립니다!! 방문 가능한 시간대에 맞춰 캠페인을 신청해주세요★",
      "★제공된 혜택을 모두 활용하여 작성해주세요 - 헬스장 방문 체험 필수 - 실제 방문 사진 및 영상 필수 - 헬스장 시설 및 운동 체험 내용 포함<br />★방문 리뷰는 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★<br />★방문 시 실제 체험하는 모습 사진 필수 첨부해주세요★<br />★방문 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★헬스장 방문형 캠페인 입니다★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [방문형]으로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 당첨당일 매장 방문 해주세요<br /> 3. 기간 내 방문 및 리뷰 작성 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★방문 리뷰 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 방문하여 경험한 헬스장의 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 매장 방문 불가 및 방문 착오할 경우 : 페이백 미지급 및 선정취소 <br /> - 방문 리뷰 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 매장 정보는 정확하게 기재해주세요 (주소, 영업시간, 연락처, 주차 가능 여부)<br />- 제공받은 혜택으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 혜택 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 혜택 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 방문형의 경우 지도와 함께 매장 주소,영업시간,주차유무등을 기재해주세요. <br />- 방문형 캠페인의 경우 매장 정보를 꼭 넣어주세요",
    ],
    visitAddress: "서울특별시 강동구 천호대로 789",
    addressGuide: "천호역 3번 출구에서 도보 7분, 롯데마트 옆 건물 2층",
    visitLink: "https://naver.me/GHI789",
    requirements: [
      "text_2000",
      "photo_10",
      "video_120",
      "product_link",
      "keyword",
    ],
  },
  // visit_5: 종료 탭
  {
    id: "visit_5",
    title: "쇼핑몰 방문 리뷰",
    category: "방문형",
    image: "/images/main/campaign_img/eximg_12.png",
    subcategory: "식품",
    region: "서울 > 중구",
    points: 25000,
    description: "쇼핑몰 방문 후 쇼핑 리뷰 작성",
    recruitment: { current: 156, total: 12 },
    schedule: "",
    dayCount: "D-6",
    detailedSchedule: {
      // 종료 탭 - purchasePeriod가 과거
      applicationStart: "2025-11-01",
      applicationEnd: "2025-11-15",
      announcement: "2025-11-17",
      purchasePeriod: "2025-11-20 ~ 2025-11-27",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "네이버 블로그",
    keyword: "#명동쇼핑몰 #쇼핑투어 #명동쇼핑추천 #패션쇼핑",
    guidelineTexts: [
      "헬스장 방문형 캠페인 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★방문 전 반드시 매장 영업시간 및 휴무일을 확인해주세요!! 매장 방문 불가시에는 1:1문의로 제보 부탁드립니다!! 방문 가능한 시간대에 맞춰 캠페인을 신청해주세요★",
      "★제공된 혜택을 모두 활용하여 작성해주세요 - 헬스장 방문 체험 필수 - 실제 방문 사진 및 영상 필수 - 헬스장 시설 및 운동 체험 내용 포함<br />★방문 리뷰는 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★<br />★방문 시 실제 체험하는 모습 사진 필수 첨부해주세요★<br />★방문 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★헬스장 방문형 캠페인 입니다★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [방문형]으로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 당첨당일 매장 방문 해주세요<br /> 3. 기간 내 방문 및 리뷰 작성 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★방문 리뷰 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 방문하여 경험한 헬스장의 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 매장 방문 불가 및 방문 착오할 경우 : 페이백 미지급 및 선정취소 <br /> - 방문 리뷰 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 매장 정보는 정확하게 기재해주세요 (주소, 영업시간, 연락처, 주차 가능 여부)<br />- 제공받은 혜택으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 혜택 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 혜택 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 방문형의 경우 지도와 함께 매장 주소,영업시간,주차유무등을 기재해주세요. <br />- 방문형 캠페인의 경우 매장 정보를 꼭 넣어주세요",
    ],
    visitAddress: "서울특별시 중구 명동길 321",
    addressGuide: "명동역 6번 출구에서 도보 4분, 명동성당 근처 쇼핑센터",
    visitLink: "https://naver.me/JKL321",
    requirements: [
      "text_1000",
      "photo_10",
      "video_120",
      "product_link",
      "keyword",
    ],
  },
  // visit_6: 신청 탭
  {
    id: "visit_6",
    title: "미술관 방문 체험",
    category: "방문형",
    image: "/images/main/campaign_img/eximg_13.png",
    subcategory: "문화",
    region: "서울 > 종로구",
    points: 20000,
    description: "미술관 방문 후 전시 리뷰 작성",
    recruitment: { current: 78, total: 15 },
    schedule: "",
    dayCount: "D-4",
    detailedSchedule: {
      // 모집 중 - 현재 날짜 기준 (2025-12-23 ~ 2026-01-10)
      applicationStart: "2025-12-23",
      applicationEnd: "2026-01-10",
      announcement: "2026-01-12",
      purchasePeriod: "2026-01-15 ~ 2026-01-22",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "네이버 블로그",
    keyword: "#미술관추천 #전시후기 #예술체험 #문화생활",
    guidelineTexts: [
      "헬스장 방문형 캠페인 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★방문 전 반드시 매장 영업시간 및 휴무일을 확인해주세요!! 매장 방문 불가시에는 1:1문의로 제보 부탁드립니다!! 방문 가능한 시간대에 맞춰 캠페인을 신청해주세요★",
      "★제공된 혜택을 모두 활용하여 작성해주세요 - 헬스장 방문 체험 필수 - 실제 방문 사진 및 영상 필수 - 헬스장 시설 및 운동 체험 내용 포함<br />★방문 리뷰는 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★<br />★방문 시 실제 체험하는 모습 사진 필수 첨부해주세요★<br />★방문 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★헬스장 방문형 캠페인 입니다★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [방문형]으로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 당첨당일 매장 방문 해주세요<br /> 3. 기간 내 방문 및 리뷰 작성 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★방문 리뷰 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 방문하여 경험한 헬스장의 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 매장 방문 불가 및 방문 착오할 경우 : 페이백 미지급 및 선정취소 <br /> - 방문 리뷰 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 매장 정보는 정확하게 기재해주세요 (주소, 영업시간, 연락처, 주차 가능 여부)<br />- 제공받은 혜택으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 혜택 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 혜택 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 방문형의 경우 지도와 함께 매장 주소,영업시간,주차유무등을 기재해주세요. <br />- 방문형 캠페인의 경우 매장 정보를 꼭 넣어주세요",
    ],
    visitAddress: "서울특별시 종로구 세종대로 654",
    addressGuide: "광화문역 2번 출구에서 도보 6분, 국립중앙박물관 옆",
    visitLink: "https://naver.me/MNO654",
    requirements: [
      "text_2500",
      "photo_10",
      "video_120",
      "product_link",
      "keyword",
    ],
  },
  // visit_7: 진행 탭
  {
    id: "visit_7",
    title: "스파 방문 체험",
    category: "방문형",
    image: "/images/main/campaign_img/eximg_1.png",
    subcategory: "여가",
    region: "서울 > 용산구",
    points: 42000,
    description: "프리미엄 스파 방문 후 체험 리뷰",
    recruitment: { current: 34, total: 3 },
    schedule: "",
    dayCount: "D-2",
    detailedSchedule: {
      // 진행 탭 - applicationEnd가 과거, purchasePeriod가 미래 (announcement <= 오늘 <= purchasePeriod 끝)
      applicationStart: "2025-11-15",
      applicationEnd: "2025-11-30",
      announcement: "2025-12-02",
      purchasePeriod: "2025-12-05 ~ 2025-12-20",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "인스타그램",
    keyword: "#프리미엄스파 #한남동스파 #힐링스파 #마사지체험",
    guidelineTexts: [
      "헬스장 방문형 캠페인 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★방문 전 반드시 매장 영업시간 및 휴무일을 확인해주세요!! 매장 방문 불가시에는 1:1문의로 제보 부탁드립니다!! 방문 가능한 시간대에 맞춰 캠페인을 신청해주세요★",
      "★제공된 혜택을 모두 활용하여 작성해주세요 - 헬스장 방문 체험 필수 - 실제 방문 사진 및 영상 필수 - 헬스장 시설 및 운동 체험 내용 포함<br />★방문 리뷰는 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★<br />★방문 시 실제 체험하는 모습 사진 필수 첨부해주세요★<br />★방문 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★헬스장 방문형 캠페인 입니다★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [방문형]으로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 당첨당일 매장 방문 해주세요<br /> 3. 기간 내 방문 및 리뷰 작성 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★방문 리뷰 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 방문하여 경험한 헬스장의 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 매장 방문 불가 및 방문 착오할 경우 : 페이백 미지급 및 선정취소 <br /> - 방문 리뷰 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 매장 정보는 정확하게 기재해주세요 (주소, 영업시간, 연락처, 주차 가능 여부)<br />- 제공받은 혜택으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 혜택 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 혜택 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 방문형의 경우 지도와 함께 매장 주소,영업시간,주차유무등을 기재해주세요. <br />- 방문형 캠페인의 경우 매장 정보를 꼭 넣어주세요",
    ],
    visitAddress: "서울특별시 용산구 이태원로 987",
    addressGuide: "이태원역 1번 출구에서 도보 8분, 한남동 힐탑빌딩 5층",
    visitLink: "https://naver.me/PQR987",
    requirements: [
      "text_3000",
      "photo_10",
      "video_120",
      "product_link",
      "keyword",
    ],
  },
  // visit_8: 종료 탭
  {
    id: "visit_8",
    title: "반려동물 카페 방문",
    category: "방문형",
    image: "/images/main/campaign_img/eximg_2.png",
    subcategory: "기타",
    region: "경기 > 성남시",
    points: 26000,
    description: "반려동물 카페 방문 후 체험 리뷰",
    recruitment: { current: 112, total: 9 },
    schedule: "",
    dayCount: "D-8",
    detailedSchedule: {
      // 종료 탭 - purchasePeriod가 과거
      applicationStart: "2025-11-10",
      applicationEnd: "2025-11-25",
      announcement: "2025-11-27",
      purchasePeriod: "2025-11-30 ~ 2025-12-07",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "유튜브",
    keyword: "#반려동물카페 #펫카페 #강아지카페 #분당카페",
    guidelineTexts: [
      "헬스장 방문형 캠페인 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★방문 전 반드시 매장 영업시간 및 휴무일을 확인해주세요!! 매장 방문 불가시에는 1:1문의로 제보 부탁드립니다!! 방문 가능한 시간대에 맞춰 캠페인을 신청해주세요★",
      "★제공된 혜택을 모두 활용하여 작성해주세요 - 헬스장 방문 체험 필수 - 실제 방문 사진 및 영상 필수 - 헬스장 시설 및 운동 체험 내용 포함<br />★방문 리뷰는 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★<br />★방문 시 실제 체험하는 모습 사진 필수 첨부해주세요★<br />★방문 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★헬스장 방문형 캠페인 입니다★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [방문형]으로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 당첨당일 매장 방문 해주세요<br /> 3. 기간 내 방문 및 리뷰 작성 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★방문 리뷰 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 방문하여 경험한 헬스장의 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 매장 방문 불가 및 방문 착오할 경우 : 페이백 미지급 및 선정취소 <br /> - 방문 리뷰 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 매장 정보는 정확하게 기재해주세요 (주소, 영업시간, 연락처, 주차 가능 여부)<br />- 제공받은 혜택으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 혜택 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 혜택 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 방문형의 경우 지도와 함께 매장 주소,영업시간,주차유무등을 기재해주세요. <br />- 방문형 캠페인의 경우 매장 정보를 꼭 넣어주세요",
    ],
    visitAddress: "경기도 성남시 분당구 판교역로 147",
    addressGuide: "분당선 판교역 2번 출구에서 도보 5분, 판교테크노밸리 내",
    visitLink: "https://naver.me/STU147",
    requirements: [
      "text_600",
      "photo_10",
      "video_120",
      "product_link",
      "keyword",
    ],
  },
  // visit_9: 진행 탭
  {
    id: "visit_9",
    title: "놀이공원 방문 체험",
    category: "방문형",
    image: "/images/main/campaign_img/eximg_3.png",
    subcategory: "여가",
    region: "경기 > 용인시",
    points: 38000,
    description: "놀이공원 방문 후 체험 영상 제작",
    recruitment: { current: 67, total: 5 },
    schedule: "",
    dayCount: "D-1",
    detailedSchedule: {
      // 진행 탭 - applicationEnd가 과거, purchasePeriod가 미래 (announcement <= 오늘 <= purchasePeriod 끝)
      applicationStart: "2025-11-20",
      applicationEnd: "2025-12-05",
      announcement: "2025-12-07",
      purchasePeriod: "2025-12-08 ~ 2025-12-25",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "유튜브",
    keyword: "#놀이공원후기 #테마파크 #용인놀이공원 #가족나들이",
    guidelineTexts: [
      "헬스장 방문형 캠페인 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★방문 전 반드시 매장 영업시간 및 휴무일을 확인해주세요!! 매장 방문 불가시에는 1:1문의로 제보 부탁드립니다!! 방문 가능한 시간대에 맞춰 캠페인을 신청해주세요★",
      "★제공된 혜택을 모두 활용하여 작성해주세요 - 헬스장 방문 체험 필수 - 실제 방문 사진 및 영상 필수 - 헬스장 시설 및 운동 체험 내용 포함<br />★방문 리뷰는 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★<br />★방문 시 실제 체험하는 모습 사진 필수 첨부해주세요★<br />★방문 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★헬스장 방문형 캠페인 입니다★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [방문형]으로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 당첨당일 매장 방문 해주세요<br /> 3. 기간 내 방문 및 리뷰 작성 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★방문 리뷰 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 방문하여 경험한 헬스장의 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 매장 방문 불가 및 방문 착오할 경우 : 페이백 미지급 및 선정취소 <br /> - 방문 리뷰 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 매장 정보는 정확하게 기재해주세요 (주소, 영업시간, 연락처, 주차 가능 여부)<br />- 제공받은 혜택으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 혜택 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 혜택 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 방문형의 경우 지도와 함께 매장 주소,영업시간,주차유무등을 기재해주세요. <br />- 방문형 캠페인의 경우 매장 정보를 꼭 넣어주세요",
    ],
    visitAddress: "경기도 용인시 기흥구 에버랜드로 199",
    addressGuide: "분당선 기흥역에서 셔틀버스 이용, 에버랜드 정문 근처",
    visitLink: "https://naver.me/VWX199",
    requirements: [
      "text_1800",
      "photo_10",
      "video_120",
      "product_link",
      "keyword",
    ],
  },
  // visit_10: 취소 탭
  {
    id: "visit_10",
    title: "도서관 방문 체험",
    category: "방문형",
    image: "/images/main/campaign_img/eximg_4.png",
    subcategory: "패션",
    region: "서울 > 동대문구",
    points: 16000,
    description: "신규 도서관 방문 후 시설 리뷰",
    recruitment: { current: 89, total: 20 },
    schedule: "",
    dayCount: "D-9",
    detailedSchedule: {
      // 취소 탭 - status가 "취소"로 설정됨
      applicationStart: "2025-11-05",
      applicationEnd: "2025-11-20",
      announcement: "2025-11-22",
      purchasePeriod: "2025-11-25 ~ 2025-12-02",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "네이버 블로그",
    keyword: "#도서관추천 #독서공간 #공공도서관 #문화시설후기",
    guidelineTexts: [
      "헬스장 방문형 캠페인 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★방문 전 반드시 매장 영업시간 및 휴무일을 확인해주세요!! 매장 방문 불가시에는 1:1문의로 제보 부탁드립니다!! 방문 가능한 시간대에 맞춰 캠페인을 신청해주세요★",
      "★제공된 혜택을 모두 활용하여 작성해주세요 - 헬스장 방문 체험 필수 - 실제 방문 사진 및 영상 필수 - 헬스장 시설 및 운동 체험 내용 포함<br />★방문 리뷰는 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★<br />★방문 시 실제 체험하는 모습 사진 필수 첨부해주세요★<br />★방문 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★헬스장 방문형 캠페인 입니다★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [방문형]으로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 당첨당일 매장 방문 해주세요<br /> 3. 기간 내 방문 및 리뷰 작성 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★방문 리뷰 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 방문하여 경험한 헬스장의 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 매장 방문 불가 및 방문 착오할 경우 : 페이백 미지급 및 선정취소 <br /> - 방문 리뷰 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 매장 정보는 정확하게 기재해주세요 (주소, 영업시간, 연락처, 주차 가능 여부)<br />- 제공받은 혜택으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 혜택 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 혜택 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 방문형의 경우 지도와 함께 매장 주소,영업시간,주차유무등을 기재해주세요. <br />- 방문형 캠페인의 경우 매장 정보를 꼭 넣어주세요",
    ],
    visitAddress: "서울특별시 성동구 왕십리로 258",
    addressGuide: "동대문역사문화공원역 3번 출구에서 도보 10분, 성동구청 근처",
    visitLink: "https://naver.me/YZA258",
    requirements: [
      "text_1500",
      "photo_10",
      "video_120",
      "product_link",
      "keyword",
    ],
  },
  {
    id: "visit_11",
    title: "[강남/서초] 통큰 한우 돼지갈비 체험단",
    category: "방문형",
    image: "/images/main/campaign_img/eximg_5.png",
    subcategory: "식품",
    region: "서울 > 강남/서초",
    points: 40000,
    description: "프리미엄 한우 돼지갈비 전문점 방문 체험단 모집 예정",
    recruitment: { current: 0, total: 4 },
    schedule: "1/15 (목) 10:00\n모집 오픈",
    dayCount: "",
    detailedSchedule: {
      // 오픈 예정 - 현재 날짜보다 미래 (2026-01-15 ~ 2026-02-05)
      applicationStart: "2026-01-15",
      applicationEnd: "2026-02-05",
      announcement: "2026-02-07",
      purchasePeriod: "2026-02-07 ~ 2026-02-20",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "네이버 블로그",
    keyword: "#한우돼지갈비 #강남맛집 #서초맛집 #식당체험 #맛집리뷰",
    guidelineTexts: [
      "방문형 캠페인 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★방문 전 반드시 매장 영업시간 및 휴무일을 확인해주세요!! 매장 방문 불가시에는 1:1문의로 제보 부탁드립니다!! 방문 가능한 시간대에 맞춰 캠페인을 신청해주세요★",
      "★제공된 혜택을 모두 활용하여 작성해주세요 - 식당 방문 체험 필수 - 실제 방문 사진 및 영상 필수 - 음식 맛과 서비스 내용 포함<br />★방문 리뷰는 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★<br />★방문 시 실제 체험하는 모습 사진 필수 첨부해주세요★<br />★방문 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★식당 방문형 캠페인 입니다★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [방문형]으로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 당첨당일 매장 방문 해주세요<br /> 3. 기간 내 방문 및 리뷰 작성 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★방문 리뷰 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 방문하여 경험한 식당의 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 매장 방문 불가 및 방문 착오할 경우 : 페이백 미지급 및 선정취소 <br /> - 방문 리뷰 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 매장 정보는 정확하게 기재해주세요 (주소, 영업시간, 연락처, 주차 가능 여부)<br />- 제공받은 혜택으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 혜택 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 혜택 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 방문형의 경우 지도와 함께 매장 주소,영업시간,주차유무등을 기재해주세요. <br />- 방문형 캠페인의 경우 매장 정보를 꼭 넣어주세요",
    ],
    visitAddress: "서울특별시 강남구 테헤란로 123",
    addressGuide: "강남역 2번 출구에서 도보 5분, 강남대로 근처",
    visitLink: "https://naver.me/ABC123",
    requirements: [
      "text_1500",
      "photo_10",
      "video_120",
      "store_info",
      "keyword",
    ],
  },
  // visit_12: 마감임박 캠페인 (홈 메인페이지용)
  {
    id: "visit_12",
    title: "[마감임박] 프리미엄 스테이크하우스 방문 체험",
    category: "방문형",
    image: "/images/main/campaign_img/eximg_1.png",
    subcategory: "식품",
    region: "서울 > 강남구",
    points: 45000,
    description: "프리미엄 스테이크하우스 방문 후 블로그 리뷰 작성",
    recruitment: { current: 3, total: 5 }, // 신청자 수 적게 설정
    schedule: "",
    dayCount: "마감임박",
    detailedSchedule: {
      // 마감임박 - 현재 날짜(2025-12-30) 기준으로 2일 후 마감 (2025-12-28 ~ 2026-01-01)
      applicationStart: "2025-12-28",
      applicationEnd: "2026-01-01",
      announcement: "2026-01-03",
      purchasePeriod: "2026-01-03 ~ 2026-01-10",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "네이버 블로그",
    keyword: "#스테이크하우스 #강남맛집 #프리미엄식당 #고급레스토랑 #맛집리뷰",
    guidelineTexts: [
      "프리미엄 스테이크하우스 방문형 캠페인 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★방문 전 반드시 매장 영업시간 및 휴무일을 확인해주세요!! 매장 방문 불가시에는 1:1문의로 제보 부탁드립니다!! 방문 가능한 시간대에 맞춰 캠페인을 신청해주세요★",
      "★제공된 혜택을 모두 활용하여 작성해주세요 - 스테이크하우스 방문 체험 필수 - 실제 방문 사진 및 영상 필수 - 음식 맛과 서비스 내용 포함<br />★방문 리뷰는 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★<br />★방문 시 실제 체험하는 모습 사진 필수 첨부해주세요★<br />★방문 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★프리미엄 스테이크하우스 방문형 캠페인 입니다★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [방문형]으로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 당첨당일 매장 방문 해주세요<br /> 3. 기간 내 방문 및 리뷰 작성 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★방문 리뷰 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 방문하여 경험한 스테이크하우스의 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 매장 방문 불가 및 방문 착오할 경우 : 페이백 미지급 및 선정취소 <br /> - 방문 리뷰 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 매장 정보는 정확하게 기재해주세요 (주소, 영업시간, 연락처, 주차 가능 여부)<br />- 제공받은 혜택으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 혜택 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 혜택 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 방문형의 경우 지도와 함께 매장 주소,영업시간,주차유무등을 기재해주세요. <br />- 방문형 캠페인의 경우 매장 정보를 꼭 넣어주세요",
    ],
    visitAddress: "서울특별시 강남구 테헤란로 789",
    addressGuide: "강남역 3번 출구에서 도보 7분, 코엑스 근처 프리미엄 빌딩 2층",
    visitLink: "https://naver.me/XYZ789",
    requirements: [
      "text_2000",
      "photo_12",
      "video_1_150",
      "product_link",
      "keyword",
    ],
  },
  // visit_13: 마감임박 - 네이버 클립 채널
  {
    id: "visit_13",
    title: "[마감임박] 프리미엄 카페 방문 체험",
    category: "방문형",
    image: "/images/main/campaign_img/eximg_8.png",
    subcategory: "식품",
    region: "서울 > 강남구",
    points: 35000,
    description: "프리미엄 카페 방문 후 네이버 클립 리뷰 작성",
    recruitment: { current: 2, total: 5 }, // 신청자 수 적게 설정
    schedule: "",
    dayCount: "마감임박",
    detailedSchedule: {
      // 마감임박 - 현재 날짜(2025-12-30) 기준으로 2일 후 마감 (2025-12-28 ~ 2026-01-01)
      applicationStart: "2025-12-28",
      applicationEnd: "2026-01-01",
      announcement: "2026-01-03",
      purchasePeriod: "2026-01-03 ~ 2026-01-10",
    },
    campaign_detail_image: "/images/campaign_detail/exdetail_1.png",
    channel: "네이버 클립",
    keyword: "#프리미엄카페 #강남카페 #네이버클립 #카페리뷰 #맛집추천",
    guidelineTexts: [
      "프리미엄 카페 방문형 캠페인 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
      "★★방문 전 반드시 매장 영업시간 및 휴무일을 확인해주세요!! 매장 방문 불가시에는 1:1문의로 제보 부탁드립니다!! 방문 가능한 시간대에 맞춰 캠페인을 신청해주세요★",
      "★제공된 혜택을 모두 활용하여 작성해주세요 - 카페 방문 체험 필수 - 실제 방문 사진 및 영상 필수 - 음료 맛과 분위기 내용 포함<br />★방문 리뷰는 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★<br />★방문 시 실제 체험하는 모습 사진 필수 첨부해주세요★<br />★네이버 클립 리뷰 작성 시 별점은 5점으로 등록해주세요★",
      "★프리미엄 카페 방문형 캠페인 입니다★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [방문형]으로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 당첨당일 매장 방문 해주세요<br /> 3. 기간 내 방문 및 리뷰 작성 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★방문 리뷰 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 방문하여 경험한 카페의 특장점에 대하여 작성해주세요]",
      "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 매장 방문 불가 및 방문 착오할 경우 : 페이백 미지급 및 선정취소 <br /> - 방문 리뷰 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 매장 정보는 정확하게 기재해주세요 (주소, 영업시간, 연락처, 주차 가능 여부)<br />- 제공받은 혜택으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 혜택 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 혜택 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 방문형의 경우 지도와 함께 매장 주소,영업시간,주차유무등을 기재해주세요. <br />- 방문형 캠페인의 경우 매장 정보를 꼭 넣어주세요",
    ],
    visitAddress: "서울특별시 강남구 테헤란로 456",
    addressGuide: "강남역 1번 출구에서 도보 3분, 프리미엄 카페 거리",
    visitLink: "https://naver.me/CLIP456",
    requirements: [
      "text_2000",
      "photo_12",
      "video_1_150",
      "product_link",
      "keyword",
    ],
  },
];

/**
 * 방문형 캠페인 확장 타입 정의 (파트너 관리용)
 */
export interface VisitCampaignDataExtended {
  // 기존 VisitCampaignData의 모든 필드 포함
  id: string;
  title: string;
  category: string;
  image: string;
  subcategory: string;
  region: string;
  points: number;
  description: string;
  recruitment: { current: number; total: number };
  schedule: string;
  dayCount: string;
  detailedSchedule: {
    applicationStart: string;
    applicationEnd: string;
    announcement: string;
    purchasePeriod: string;
  };
  campaign_detail_image: string;
  channel: string;
  keyword: string;
  guidelineTexts: string[];
  requirements: string[];
  visitAddress?: string;
  addressGuide?: string;
  visitLink?: string;

  // 파트너 관리용 추가 필드
  status?: "진행 중" | "대기 중" | "모집 중" | "종료" | "취소" | "긴급";
  brandName?: string;
  partnerName?: string;
  statusText?: string;

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
 * 방문형 캠페인 확장 데이터 (파트너 관리용) - 신청자 데이터 포함
 *
 * 설명:
 * - 파트너 관리 페이지에서 사용하는 방문형 캠페인 데이터입니다.
 * - 신청자 데이터와 종료/취소 데이터를 포함합니다.
 * - 각 캠페인마다 직접 예시 신청자 데이터를 포함합니다.
 */
export const visitCampaignsExtended: VisitCampaignDataExtended[] = [
  // visit_1: 식당 방문 리뷰 - 예정 탭
  {
    ...visitCampaigns[0],
    status: "모집 중" as const,
    detailedSchedule: {
      ...visitCampaigns[0].detailedSchedule,
      // 신청 탭 - 현재 날짜가 모집 기간 내
      applicationStart: "2025-12-14",
      applicationEnd: "2026-01-04",
      announcement: "2026-01-06",
      purchasePeriod: "2026-01-08 ~ 2026-01-15",
    },
    brandName: "네이버 블로그",
    partnerName: "(주)방문마케팅",
    applicantData: {
      applicants: [
        {
          id: "app_visit_1_네이버블로그_001",
          Id: "reviewer_visit_1_001",
          nickname: "식당방문리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 150,
          totalVisits: 450000,
          neighbors: 1100,
          memo: "식당 방문 리뷰 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버 블로그",
          registrationDate: "2025-12-15",
        },
        {
          id: "app_visit_1_네이버블로그_002",
          Id: "reviewer_visit_1_002",
          nickname: "맛집전문가B",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 180,
          totalVisits: 580000,
          neighbors: 1500,
          memo: "상세한 맛집 후기 작성 능력이 뛰어납니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버 블로그",
          registrationDate: "2025-12-16",
        },
        {
          id: "app_visit_1_네이버블로그_003",
          Id: "reviewer_visit_1_003",
          nickname: "식당인플루언서C",
          userType: "인플루언서" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 220,
          totalVisits: 720000,
          neighbors: 2000,
          memo: "사진 퀄리티가 우수하고 팔로워 수가 많습니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버 블로그",
          registrationDate: "2025-12-17",
        },
        {
          id: "app_visit_1_네이버블로그_004",
          Id: "reviewer_visit_1_004",
          nickname: "방문퀸D",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "주의 회원" as const,
          dailyVisits: 95,
          totalVisits: 280000,
          neighbors: 700,
          memo: "가독성 좋은 후기를 작성합니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버 블로그",
          registrationDate: "2025-12-18",
        },
        {
          id: "app_visit_1_네이버블로그_005",
          Id: "reviewer_visit_1_005",
          nickname: "식당마스터E",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 200,
          totalVisits: 650000,
          neighbors: 1800,
          memo: "고품질 방문 리뷰 전문가입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버 블로그",
          registrationDate: "2025-12-19",
        },
      ],
      selectedApplicants: [],
    },
  },
  // visit_2: 카페 방문 체험 - 연장요청 탭
  {
    ...visitCampaigns[1],
    status: "진행 중" as const,
    statusText: "연장 요청",
    brandName: "인스타그램",
    partnerName: "(주)방문마케팅",
    applicantData: {
      applicants: [
        {
          id: "app_visit_2_인스타그램_001",
          Id: "reviewer_visit_2_001",
          nickname: "카페방문리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 120,
          totalVisits: 400000,
          neighbors: 900,
          memo: "카페 방문 리뷰 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "인스타그램",
          registrationDate: "2025-12-18",
        },
        {
          id: "app_visit_2_인스타그램_002",
          Id: "reviewer_visit_2_002",
          nickname: "카페리뷰어B",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 160,
          totalVisits: 500000,
          neighbors: 1200,
          memo: "카페 리뷰를 자주 작성합니다.",
          selectionStatus: "미선택" as const,
          channel: "인스타그램",
          registrationDate: "2025-12-19",
        },
        {
          id: "app_visit_2_인스타그램_003",
          Id: "reviewer_visit_2_003",
          nickname: "카페인플루언서C",
          userType: "인플루언서" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 250,
          totalVisits: 750000,
          neighbors: 2200,
          memo: "카페 전문 인플루언서입니다.",
          selectionStatus: "미선택" as const,
          channel: "인스타그램",
          registrationDate: "2025-12-20",
        },
      ],
      selectedApplicants: [
        {
          id: "sel_visit_2_인스타그램_001",
          Id: "selected_visit_2_001",
          nickname: "선정된카페방문리뷰어1",
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
          id: "content_visit_2_waiting_001",
          createdAt: "2025-12-20T10:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "부자마님영",
          channelId: "insta_001",
          channel: "인스타그램",
          profileImage: "/images/test_img/eximg.png",
        },
        {
          id: "content_visit_2_waiting_002",
          createdAt: "2025-12-21T11:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "람",
          channelId: "insta_002",
          channel: "인스타그램",
          profileImage: "/images/test_img/eximg3.png",
        },
        {
          id: "content_visit_2_waiting_003",
          createdAt: "2025-12-22T12:00:00.000Z",
          status: "검수" as const,
          userType: "인플루언서" as const,
          nickname: "김덮밥",
          channelId: "insta_003",
          channel: "인스타그램",
          profileImage: "/images/test_img/eximg.png",
        },
      ],
      reviewing: [
        {
          id: "content_visit_2_reviewing_001",
          createdAt: "2025-12-18T09:00:00.000Z",
          status: "검수중" as const,
          userType: "리뷰어" as const,
          nickname: "초보꾼임선생",
          channelId: "insta_004",
          channel: "인스타그램",
          updatedAt: "2025-12-19T10:00:00.000Z",
          isRejected: false,
          isLate: false,
          profileImage: "/images/test_img/eximg3.png",
        },
        {
          id: "content_visit_2_reviewing_002",
          createdAt: "2025-12-19T10:00:00.000Z",
          status: "검수중" as const,
          userType: "인플루언서" as const,
          nickname: "카페리뷰어A",
          channelId: "insta_005",
          channel: "인스타그램",
          updatedAt: "2025-12-20T11:00:00.000Z",
          isRejected: false,
          isLate: false,
          profileImage: "/images/test_img/eximg.png",
        },
      ],
      completed: [
        {
          id: "content_visit_2_completed_001",
          createdAt: "2025-12-15T08:00:00.000Z",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "카페전문가B",
          channelId: "insta_006",
          channel: "인스타그램",
          updatedAt: "2025-12-16T09:00:00.000Z",
          isLate: false,
          profileImage: "/images/test_img/eximg3.png",
        },
        {
          id: "content_visit_2_completed_002",
          createdAt: "2025-12-16T09:00:00.000Z",
          status: "완료" as const,
          userType: "인플루언서" as const,
          nickname: "카페인플루언서C",
          channelId: "insta_007",
          channel: "인스타그램",
          updatedAt: "2025-12-17T10:00:00.000Z",
          isLate: false,
          profileImage: "/images/test_img/eximg.png",
        },
        {
          id: "content_visit_2_completed_003",
          createdAt: "2025-12-17T10:00:00.000Z",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "카페리뷰어D",
          channelId: "insta_008",
          channel: "인스타그램",
          updatedAt: "2025-12-18T11:00:00.000Z",
          isLate: false,
          profileImage: "/images/test_img/eximg3.png",
        },
        {
          id: "content_visit_2_completed_004",
          createdAt: "2025-12-18T11:00:00.000Z",
          status: "완료" as const,
          userType: "인플루언서" as const,
          nickname: "카페인플루언서E",
          channelId: "insta_009",
          channel: "인스타그램",
          updatedAt: "2025-12-19T12:00:00.000Z",
          isLate: false,
          profileImage: "/images/test_img/eximg.png",
        },
        {
          id: "content_visit_2_completed_005",
          createdAt: "2025-12-19T12:00:00.000Z",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "카페리뷰어F",
          channelId: "insta_010",
          channel: "인스타그램",
          updatedAt: "2025-12-20T13:00:00.000Z",
          isLate: false,
          profileImage: "/images/test_img/eximg3.png",
        },
        {
          id: "content_visit_2_completed_006",
          createdAt: "2025-12-20T13:00:00.000Z",
          status: "완료" as const,
          userType: "인플루언서" as const,
          nickname: "카페인플루언서G",
          channelId: "insta_011",
          channel: "인스타그램",
          updatedAt: "2025-12-21T14:00:00.000Z",
          isLate: false,
          profileImage: "/images/test_img/eximg.png",
        },
        {
          id: "content_visit_2_completed_007",
          createdAt: "2025-12-21T14:00:00.000Z",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "카페리뷰어H",
          channelId: "insta_012",
          channel: "인스타그램",
          updatedAt: "2025-12-22T15:00:00.000Z",
          isLate: false,
          profileImage: "/images/test_img/eximg3.png",
        },
        {
          id: "content_visit_2_completed_008",
          createdAt: "2025-12-22T15:00:00.000Z",
          status: "완료" as const,
          userType: "인플루언서" as const,
          nickname: "카페인플루언서I",
          channelId: "insta_013",
          channel: "인스타그램",
          updatedAt: "2025-12-23T16:00:00.000Z",
          isLate: false,
          profileImage: "/images/test_img/eximg.png",
        },
      ],
    },
  },
  // visit_3: 뷰티샵 방문 체험 - 신청 탭
  {
    ...visitCampaigns[2],
    status: "모집 중" as const,
    brandName: "인스타그램",
    partnerName: "(주)방문마케팅",
    applicantData: {
      applicants: [
        {
          id: "app_visit_3_인스타그램_001",
          Id: "reviewer_visit_3_001",
          nickname: "뷰티샵방문리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 140,
          totalVisits: 420000,
          neighbors: 1000,
          memo: "뷰티샵 방문 리뷰 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "인스타그램",
          registrationDate: "2025-12-20",
        },
        {
          id: "app_visit_3_인스타그램_002",
          Id: "reviewer_visit_3_002",
          nickname: "뷰티인플루언서B",
          userType: "인플루언서" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 280,
          totalVisits: 850000,
          neighbors: 2500,
          memo: "뷰티샵 전문 인플루언서입니다.",
          selectionStatus: "미선택" as const,
          channel: "인스타그램",
          registrationDate: "2025-12-21",
        },
        {
          id: "app_visit_3_인스타그램_003",
          Id: "reviewer_visit_3_003",
          nickname: "뷰티리뷰어C",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 110,
          totalVisits: 350000,
          neighbors: 800,
          memo: "뷰티샵 리뷰를 자주 작성합니다.",
          selectionStatus: "미선택" as const,
          channel: "인스타그램",
          registrationDate: "2025-12-22",
        },
      ],
      selectedApplicants: [
        {
          id: "sel_visit_3_인스타그램_001",
          Id: "selected_visit_3_001",
          nickname: "선정된뷰티샵방문리뷰어1",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 350,
          totalVisits: 1000000,
          neighbors: 3200,
          memo: "이미 선정된 우수 리뷰어입니다.",
          selectionStatus: "선정하기" as const,
          channel: "인스타그램",
          registrationDate: "2025-12-20",
        },
      ],
    },
  },
  // visit_4: 헬스장 방문 체험 - 예정 탭
  {
    ...visitCampaigns[3],
    status: "대기 중" as const,
    detailedSchedule: {
      ...visitCampaigns[3].detailedSchedule,
      // 모집 중 - 현재 날짜 기준 (2025-12-22 ~ 2026-01-10)
      applicationStart: "2025-12-22",
      applicationEnd: "2026-01-10",
      announcement: "2026-01-12",
      purchasePeriod: "2026-01-15 ~ 2026-01-22",
    },
    brandName: "유튜브",
    partnerName: "(주)방문마케팅",
    applicantData: {
      applicants: [
        {
          id: "app_visit_4_유튜브_001",
          Id: "reviewer_visit_4_001",
          nickname: "헬스장방문리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 130,
          totalVisits: 380000,
          neighbors: 950,
          memo: "헬스장 방문 리뷰 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "유튜브",
          registrationDate: "2025-12-25",
        },
        {
          id: "app_visit_4_유튜브_002",
          Id: "reviewer_visit_4_002",
          nickname: "운동전문가B",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 170,
          totalVisits: 520000,
          neighbors: 1300,
          memo: "헬스장 리뷰를 많이 작성합니다.",
          selectionStatus: "미선택" as const,
          channel: "유튜브",
          registrationDate: "2025-12-26",
        },
      ],
      selectedApplicants: [],
    },
  },
  // visit_5: 쇼핑몰 방문 리뷰 - 종료 탭
  {
    ...visitCampaigns[4],
    status: "종료" as const,
    brandName: "네이버 블로그",
    partnerName: "(주)방문마케팅",
    applicantData: {
      applicants: [
        {
          id: "app_visit_5_네이버블로그_001",
          Id: "reviewer_visit_5_001",
          nickname: "쇼핑몰방문리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 100,
          totalVisits: 300000,
          neighbors: 750,
          memo: "쇼핑몰 방문 리뷰 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버 블로그",
          registrationDate: "2025-12-10",
        },
      ],
      selectedApplicants: [],
    },
    contents: {
      waiting: [
        {
          id: "content_visit_5_waiting_001",
          createdAt: "2025-11-24T10:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "쇼핑몰대기리뷰어A",
          channelId: "blog_005",
          channel: "네이버 블로그",
          profileImage: "/images/test_img/eximg.png",
        },
      ],
      reviewing: [
        {
          id: "content_visit_5_001",
          createdAt: "2025-11-20T10:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "쇼핑몰방문리뷰어A",
          channelId: "blog_001",
          channel: "네이버 블로그",
          updatedAt: "2025-11-25T10:00:00.000Z",
          isRejected: false,
          isLate: false,
          profileImage: "/images/test_img/eximg3.png",
        },
        {
          id: "content_visit_5_002",
          createdAt: "2025-11-21T11:00:00.000Z",
          status: "검수중" as const,
          userType: "인플루언서" as const,
          nickname: "쇼핑몰인플루언서B",
          channelId: "blog_002",
          channel: "네이버 블로그",
          updatedAt: "2025-11-26T11:00:00.000Z",
          isRejected: false,
          isLate: false,
          profileImage: "/images/test_img/eximg.png",
        },
      ],
      completed: [
        {
          id: "content_visit_5_003",
          createdAt: "2025-11-22T12:00:00.000Z",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "쇼핑몰리뷰어C",
          channelId: "blog_003",
          channel: "네이버 블로그",
          updatedAt: "2025-11-27T12:00:00.000Z",
          isLate: false,
          profileImage: "/images/test_img/eximg3.png",
        },
        {
          id: "content_visit_5_004",
          createdAt: "2025-11-23T13:00:00.000Z",
          status: "완료" as const,
          userType: "인플루언서" as const,
          nickname: "쇼핑몰인플루언서D",
          channelId: "blog_004",
          channel: "네이버 블로그",
          updatedAt: "2025-11-28T13:00:00.000Z",
          isLate: false,
          profileImage: "/images/test_img/eximg.png",
        },
      ],
    },
  },
  // visit_6: 미술관 방문 체험 - 진행 탭
  {
    ...visitCampaigns[5],
    status: "진행 중" as const,
    brandName: "네이버 블로그",
    partnerName: "(주)방문마케팅",
    applicantData: {
      applicants: [
        {
          id: "app_visit_6_네이버블로그_001",
          Id: "reviewer_visit_6_001",
          nickname: "미술관방문리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 160,
          totalVisits: 480000,
          neighbors: 1100,
          memo: "미술관 방문 리뷰 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버 블로그",
          registrationDate: "2025-12-19",
        },
        {
          id: "app_visit_6_네이버블로그_002",
          Id: "reviewer_visit_6_002",
          nickname: "문화인플루언서B",
          userType: "인플루언서" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 240,
          totalVisits: 720000,
          neighbors: 1900,
          memo: "문화 전문 인플루언서입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버 블로그",
          registrationDate: "2025-12-20",
        },
        {
          id: "app_visit_6_네이버블로그_003",
          Id: "reviewer_visit_6_003",
          nickname: "미술관전문가C",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 190,
          totalVisits: 570000,
          neighbors: 1400,
          memo: "미술관 리뷰를 자주 작성합니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버 블로그",
          registrationDate: "2025-12-21",
        },
      ],
      selectedApplicants: [
        {
          id: "sel_visit_6_네이버블로그_001",
          Id: "selected_visit_6_001",
          nickname: "선정된미술관방문리뷰어1",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 310,
          totalVisits: 930000,
          neighbors: 2600,
          memo: "이미 선정된 우수 리뷰어입니다.",
          selectionStatus: "선정하기" as const,
          channel: "네이버 블로그",
          registrationDate: "2025-12-19",
        },
      ],
    },
    contents: {
      waiting: [
        {
          id: "content_visit_6_waiting_001",
          createdAt: "2025-12-20T10:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "미술관방문리뷰어A",
          channelId: "blog_036",
          channel: "네이버 블로그",
          profileImage: "/images/test_img/eximg.png",
        },
        {
          id: "content_visit_6_waiting_002",
          createdAt: "2025-12-21T11:00:00.000Z",
          status: "검수" as const,
          userType: "인플루언서" as const,
          nickname: "문화인플루언서B",
          channelId: "blog_037",
          channel: "네이버 블로그",
          profileImage: "/images/test_img/eximg3.png",
        },
      ],
      reviewing: [
        {
          id: "content_visit_6_reviewing_001",
          createdAt: "2025-12-19T09:00:00.000Z",
          status: "검수중" as const,
          userType: "리뷰어" as const,
          nickname: "미술관전문가C",
          channelId: "blog_038",
          channel: "네이버 블로그",
          updatedAt: "2025-12-20T10:00:00.000Z",
          isRejected: false,
          isLate: false,
          profileImage: "/images/test_img/eximg.png",
        },
      ],
      completed: [
        {
          id: "content_visit_6_completed_001",
          createdAt: "2025-12-18T08:00:00.000Z",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "선정된미술관방문리뷰어1",
          channelId: "blog_039",
          channel: "네이버 블로그",
          updatedAt: "2025-12-19T09:00:00.000Z",
          isLate: false,
          profileImage: "/images/test_img/eximg3.png",
        },
        {
          id: "content_visit_6_completed_002",
          createdAt: "2025-12-18T08:00:00.000Z",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "지각제출리뷰어",
          channelId: "blog_040",
          channel: "네이버 블로그",
          updatedAt: "2025-12-22T17:37:00.000Z",
          isLate: true,
          profileImage: "/images/test_img/eximg.png",
        },
      ],
    },
  },
  // visit_7: 스파 방문 체험 - 진행 탭
  {
    ...visitCampaigns[6],
    status: "진행 중" as const,
    brandName: "인스타그램",
    partnerName: "(주)방문마케팅",
    applicantData: {
      applicants: [
        {
          id: "app_visit_7_인스타그램_001",
          Id: "reviewer_visit_7_001",
          nickname: "스파방문리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 280,
          totalVisits: 840000,
          neighbors: 2300,
          memo: "스파 방문 리뷰 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "인스타그램",
          registrationDate: "2025-12-28",
        },
        {
          id: "app_visit_7_인스타그램_002",
          Id: "reviewer_visit_7_002",
          nickname: "힐링인플루언서B",
          userType: "인플루언서" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 320,
          totalVisits: 960000,
          neighbors: 2700,
          memo: "힐링 전문 인플루언서입니다.",
          selectionStatus: "미선택" as const,
          channel: "인스타그램",
          registrationDate: "2025-12-29",
        },
      ],
      selectedApplicants: [],
    },
    contents: {
      waiting: [
        {
          id: "content_visit_7_waiting_001",
          createdAt: "2025-12-28T10:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "스파방문리뷰어A",
          channelId: "insta_014",
          channel: "인스타그램",
          profileImage: "/images/test_img/eximg.png",
        },
        {
          id: "content_visit_7_waiting_002",
          createdAt: "2025-12-29T11:00:00.000Z",
          status: "검수" as const,
          userType: "인플루언서" as const,
          nickname: "힐링인플루언서B",
          channelId: "insta_015",
          channel: "인스타그램",
          profileImage: "/images/test_img/eximg3.png",
        },
      ],
      reviewing: [
        {
          id: "content_visit_7_reviewing_001",
          createdAt: "2025-12-26T09:00:00.000Z",
          status: "검수중" as const,
          userType: "리뷰어" as const,
          nickname: "스파리뷰어C",
          channelId: "insta_016",
          channel: "인스타그램",
          updatedAt: "2025-12-27T10:00:00.000Z",
          isRejected: false,
          isLate: false,
          profileImage: "/images/test_img/eximg.png",
        },
      ],
      completed: [
        {
          id: "content_visit_7_completed_001",
          createdAt: "2025-12-24T08:00:00.000Z",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "스파전문가D",
          channelId: "insta_017",
          channel: "인스타그램",
          updatedAt: "2025-12-25T09:00:00.000Z",
          isLate: false,
          profileImage: "/images/test_img/eximg3.png",
        },
        {
          id: "content_visit_7_completed_002",
          createdAt: "2025-12-25T09:00:00.000Z",
          status: "완료" as const,
          userType: "인플루언서" as const,
          nickname: "스파인플루언서E",
          channelId: "insta_018",
          channel: "인스타그램",
          updatedAt: "2025-12-26T10:00:00.000Z",
          isLate: false,
          profileImage: "/images/test_img/eximg.png",
        },
      ],
    },
  },
  // visit_8: 반려동물 카페 방문 - 종료 탭
  {
    ...visitCampaigns[7],
    status: "종료" as const,
    brandName: "유튜브",
    partnerName: "(주)방문마케팅",
    applicantData: {
      applicants: [
        {
          id: "app_visit_8_유튜브_001",
          Id: "reviewer_visit_8_001",
          nickname: "반려동물카페방문리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 150,
          totalVisits: 450000,
          neighbors: 1100,
          memo: "반려동물 카페 방문 리뷰 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "유튜브",
          registrationDate: "2025-12-12",
        },
      ],
      selectedApplicants: [],
    },
    contents: {
      waiting: [],
      reviewing: [
        {
          id: "content_visit_8_001",
          createdAt: "2025-11-30T10:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "반려동물카페방문리뷰어A",
          channelId: "youtube_001",
          channel: "유튜브",
          updatedAt: "2025-12-05T10:00:00.000Z",
          isRejected: false,
          isLate: false,
          profileImage: "/images/test_img/eximg.png",
        },
      ],
      completed: [
        {
          id: "content_visit_8_002",
          createdAt: "2025-12-01T11:00:00.000Z",
          status: "완료" as const,
          userType: "인플루언서" as const,
          nickname: "반려동물인플루언서B",
          channelId: "youtube_002",
          channel: "유튜브",
          updatedAt: "2025-12-07T11:00:00.000Z",
          isLate: false,
          profileImage: "/images/test_img/eximg3.png",
        },
        {
          id: "content_visit_8_003",
          createdAt: "2025-12-02T12:00:00.000Z",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "반려동물리뷰어C",
          channelId: "youtube_003",
          channel: "유튜브",
          updatedAt: "2025-12-07T12:00:00.000Z",
          isLate: false,
          profileImage: "/images/test_img/eximg.png",
        },
      ],
    },
  },
  // visit_9: 놀이공원 방문 체험 - 진행 탭
  {
    ...visitCampaigns[8],
    status: "진행 중" as const,
    brandName: "유튜브",
    partnerName: "(주)방문마케팅",
    applicantData: {
      applicants: [
        {
          id: "app_visit_9_유튜브_001",
          Id: "reviewer_visit_9_001",
          nickname: "놀이공원방문리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 180,
          totalVisits: 540000,
          neighbors: 1500,
          memo: "놀이공원 방문 리뷰 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "유튜브",
          registrationDate: "2025-12-30",
        },
        {
          id: "app_visit_9_유튜브_002",
          Id: "reviewer_visit_9_002",
          nickname: "테마파크인플루언서B",
          userType: "인플루언서" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 260,
          totalVisits: 780000,
          neighbors: 2100,
          memo: "테마파크 전문 인플루언서입니다.",
          selectionStatus: "미선택" as const,
          channel: "유튜브",
          registrationDate: "2025-12-31",
        },
      ],
      selectedApplicants: [],
    },
    contents: {
      waiting: [
        {
          id: "content_visit_9_waiting_001",
          createdAt: "2025-12-30T10:00:00.000Z",
          status: "검수" as const,
          userType: "리뷰어" as const,
          nickname: "놀이공원방문리뷰어A",
          channelId: "youtube_014",
          channel: "유튜브",
          profileImage: "/images/test_img/eximg.png",
        },
      ],
      reviewing: [
        {
          id: "content_visit_9_reviewing_001",
          createdAt: "2025-12-28T09:00:00.000Z",
          status: "검수중" as const,
          userType: "인플루언서" as const,
          nickname: "테마파크인플루언서B",
          channelId: "youtube_015",
          channel: "유튜브",
          updatedAt: "2025-12-29T10:00:00.000Z",
          isRejected: false,
          isLate: false,
          profileImage: "/images/test_img/eximg3.png",
        },
      ],
      completed: [
        {
          id: "content_visit_9_completed_001",
          createdAt: "2025-12-26T08:00:00.000Z",
          status: "완료" as const,
          userType: "리뷰어" as const,
          nickname: "놀이공원리뷰어C",
          channelId: "youtube_016",
          channel: "유튜브",
          updatedAt: "2025-12-27T09:00:00.000Z",
          isLate: false,
          profileImage: "/images/test_img/eximg.png",
        },
        {
          id: "content_visit_9_completed_002",
          createdAt: "2025-12-27T09:00:00.000Z",
          status: "완료" as const,
          userType: "인플루언서" as const,
          nickname: "테마파크인플루언서D",
          channelId: "youtube_017",
          channel: "유튜브",
          updatedAt: "2025-12-28T10:00:00.000Z",
          isLate: false,
          profileImage: "/images/test_img/eximg3.png",
        },
      ],
    },
  },
  // visit_10: 도서관 방문 체험 - 취소 탭
  {
    ...visitCampaigns[9],
    status: "취소" as const,
    statusText: "캠페인을 취소하였습니다.",
    brandName: "네이버 블로그",
    partnerName: "(주)방문마케팅",
    applicantData: {
      applicants: [
        {
          id: "app_visit_10_네이버블로그_001",
          Id: "reviewer_visit_10_001",
          nickname: "도서관방문리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 140,
          totalVisits: 420000,
          neighbors: 1000,
          memo: "도서관 방문 리뷰 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버 블로그",
          registrationDate: "2025-12-08",
        },
      ],
      selectedApplicants: [],
    },
  },
  // visit_12: 프리미엄 스테이크하우스 방문 체험 - 마감임박 (신청 탭)
  {
    ...visitCampaigns[11],
    status: "모집 중" as const,
    brandName: "네이버 블로그",
    partnerName: "(주)방문마케팅",
    applicantData: {
      applicants: [
        {
          id: "app_visit_12_네이버블로그_001",
          Id: "reviewer_visit_12_001",
          nickname: "스테이크방문리뷰어A",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 200,
          totalVisits: 600000,
          neighbors: 1800,
          memo: "프리미엄 식당 방문 리뷰 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버 블로그",
          registrationDate: "2025-12-20",
        },
        {
          id: "app_visit_12_네이버블로그_002",
          Id: "reviewer_visit_12_002",
          nickname: "고급맛집인플루언서B",
          userType: "인플루언서" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 300,
          totalVisits: 900000,
          neighbors: 3000,
          memo: "프리미엄 레스토랑 전문 인플루언서입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버 블로그",
          registrationDate: "2025-12-21",
        },
        {
          id: "app_visit_12_네이버블로그_003",
          Id: "reviewer_visit_12_003",
          nickname: "스테이크리뷰어C",
          userType: "리뷰어" as const,
          profileImage: "",
          memberType: "모범 회원" as const,
          dailyVisits: 150,
          totalVisits: 450000,
          neighbors: 1200,
          memo: "스테이크 전문 리뷰어입니다.",
          selectionStatus: "미선택" as const,
          channel: "네이버 블로그",
          registrationDate: "2025-12-21",
        },
      ],
      selectedApplicants: [],
    },
  },
  // visit_13: 프리미엄 카페 방문 체험 - 마감임박 (네이버 클립)
  {
    ...visitCampaigns[12],
    status: "모집 중" as const,
    brandName: "네이버 클립",
    partnerName: "(주)방문마케팅",
  },
];

/**
 * 방문형 캠페인의 콘텐츠 데이터를 조회하는 함수
 *
 * 설명:
 * - 캠페인 ID를 받아서 해당 캠페인의 콘텐츠(검수 중/완료)를 반환합니다.
 * - 종료/취소된 캠페인과 진행 중인 캠페인 모두 지원합니다.
 *
 * @param campaignId - 조회할 캠페인의 ID
 * @returns 검수 중/완료된 콘텐츠를 담은 객체
 */
export function getVisitContentsById(campaignId: string): ContentByTab {
  // 진행 중인 캠페인에서 찾기
  const campaign = visitCampaignsExtended.find((c) => c.id === campaignId);
  if (campaign?.contents) {
    return campaign.contents;
  }

  // 콘텐츠가 없는 경우 빈 배열 반환
  return { waiting: [], reviewing: [], completed: [] };
}

/**
 * 방문형 캠페인 헬퍼 함수들
 */

/**
 * 새 캠페인 ID 생성
 *
 * @returns 새로운 캠페인 ID (visit_X 형식)
 */
function generateNewVisitCampaignId(): string {
  // 기존 캠페인 ID 중 최대값 찾기
  const existingIds = visitCampaignsExtended
    .map((c) => {
      const match = c.id.match(/visit_(\d+)/);
      return match ? parseInt(match[1]) : 0;
    })
    .filter((id) => id > 0);
  const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 10;

  return `visit_${maxId + 1}`;
}

/**
 * 폼 데이터를 CampaignWithApplicants 형태로 변환하여 새 캠페인 생성
 *
 * @param formData - 폼에서 입력받은 캠페인 데이터
 * @param imageUrl - 업로드된 이미지 URL
 * @returns 새로 생성된 CampaignWithApplicants 객체
 */
export function createVisitCampaign(
  formData: CampaignFormData,
  imageUrl: string = "/images/main/campaign_img/eximg_3.png"
): CampaignWithApplicants {
  // 새 캠페인 ID 생성
  const newId = generateNewVisitCampaignId();

  // 선정 날짜까지 남은 일수 계산
  const daysLeft = formData.announcementDate
    ? calculateDaysLeft(formData.announcementDate.split(" ")[0])
    : 0;

  // 모집 인원을 숫자로 변환
  const totalCount = Number(formData.recruitmentCount) || 0;

  // 캠페인 상태 결정 함수 호출
  const campaignStatus = calculateCampaignStatus(
    formData.recruitmentPeriod,
    formData.announcementDate
  );

  // 플랫폼명 정규화
  const normalizedBrandName = formData.platform
    ? formData.platform.replace(/\s+/g, "")
    : "네이버블로그";

  return {
    campaignInfo: {
      id: newId,
      title: formData.title,
      image: imageUrl,
      status:
        campaignStatus === "대기 중"
          ? "대기 중"
          : campaignStatus === "모집 중"
          ? "모집 중"
          : "등록 중",
      campaignType: "방문형",
      category: formData.category || "기타",
      brandName: normalizedBrandName,
      recruitmentPeriod: formData.recruitmentPeriod || "",
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
 * 방문형 캠페인 수정
 *
 * @param campaignId - 수정할 캠페인 ID
 * @param formData - 폼에서 입력받은 캠페인 데이터
 * @param imageUrl - 업로드된 이미지 URL
 * @returns 수정된 CampaignWithApplicants 객체
 */
export function updateVisitCampaign(
  campaignId: string,
  formData: CampaignFormData,
  imageUrl: string = "/images/main/campaign_img/eximg_3.png"
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
  const campaignStatus = calculateCampaignStatus(
    formData.recruitmentPeriod,
    formData.announcementDate
  );

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
        campaignStatus === "대기 중"
          ? "대기 중"
          : campaignStatus === "모집 중"
          ? "모집 중"
          : "등록 중",
      campaignType: "방문형",
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
 * 새 방문형 캠페인 추가
 *
 * @param formData - 폼에서 입력받은 캠페인 데이터
 * @param imageUrl - 업로드된 이미지 URL
 * @returns 새로 생성된 CampaignWithApplicants 객체
 */
export function addVisitCampaign(
  formData: CampaignFormData,
  imageUrl: string = "/images/main/campaign_img/eximg_3.png"
): CampaignWithApplicants {
  return createVisitCampaign(formData, imageUrl);
}
