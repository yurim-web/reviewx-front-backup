/* ========================================
   🛒 구매평 캠페인 데이터 타입 정의
   ======================================== */

/**
 * 구매평 캠페인 데이터 타입 정의
 *
 * 이 파일에서 사용하는 모든 구매평 캠페인 데이터의 타입을 정의합니다.
 * 공통 타입은 sharedCampaigns.ts에서 import하여 사용합니다.
 */

import type { CampaignWithContents } from "./sharedCampaigns";
import type { CampaignWithApplicants } from "./campaign_application/delivery_applicants";
import type { ContentByTab } from "./sharedCampaigns";
import { CampaignFormData } from "@/types/user/user";
import { calculateCampaignStatus, calculateDaysLeft } from "./delivery";

/**
 * 구매평 캠페인 통합 데이터 구조
 *
 * 구매평 캠페인의 모든 상태(종료/취소/진행/예정/신청)를 하나의 구조로 통일합니다.
 * - 종료/취소 캠페인: campaignInfo + contents (필수)
 * - 진행/예정/신청 캠페인: campaignInfo + applicantData (필수) + contents (선택)
 */
export interface ReviewCampaignDataItem {
  campaignInfo: {
    id: string; // 캠페인 고유 식별자
    title: string; // 캠페인 제목
    image: string; // 메인 캠페인 이미지 경로
    status: "진행 중" | "대기 중" | "모집 중" | "종료" | "취소"; // 캠페인 상태 (모든 상태 포함)
    campaignType: "구매평"; // 캠페인 타입 (구매평 고정)
    category: string; // 캠페인 카테고리 (식품, 뷰티, 생활 등)
    brandName: string; // 브랜드명 (플랫폼명)
    recruitmentPeriod: string; // 모집 기간 (예: "2024-01-15 ~ 2024-01-22")
    announcementDate: string; // 선정 발표일 (예: "2024-01-22")
    purchasePeriod?: string; // 구매 기간 (예: "2024-01-23 ~ 2024-01-25", 선택사항 - 진행/예정/신청에만 있음)
    registrationPeriod: string; // 등록 기간 (예: "2024-01-24 ~ 2024-02-01")
    recruitedCount: number; // 현재 모집된 인원 수 (자동 계산됨)
    totalCount: number; // 총 모집 인원 수
    daysLeft: number; // 남은 일수 (양수면 남은 일수, 음수면 지난 일수)
    statusText?: string; // 상태 텍스트 (예: "캠페인 콘텐츠를 검수해 주세요.", 선택사항)
    partnerName?: string; // 파트너명 (예: "(주)구매평마케팅")
  };
  // 신청자 데이터 (선택사항 - 진행/예정/신청 캠페인에만 있음)
  applicantData?: {
    applicants: Array<{
      id: string; // 신청자 고유 식별자
      Id: string; // 신청자 내부 ID
      nickname: string; // 신청자 닉네임
      userType: "리뷰어" | "인플루언서"; // 사용자 타입
      profileImage: string; // 프로필 이미지 경로
      memberType: "모범 회원" | "주의 회원" | "경고 회원" | "이용 제한"; // 회원 타입
      memo: string; // 메모
      selectionStatus: "미선택" | "선정하기" | "이용제한 계정"; // 선정 상태
      channel: string; // 채널 정보
    }>;
    selectedApplicants: Array<{
      id: string; // 선정된 신청자 고유 식별자
      Id: string; // 선정된 신청자 내부 ID
      nickname: string; // 신청자 닉네임
      userType: "리뷰어" | "인플루언서"; // 사용자 타입
      profileImage: string; // 프로필 이미지 경로
      memberType: "모범 회원" | "주의 회원" | "경고 회원" | "이용 제한"; // 회원 타입
      memo: string; // 메모
      selectionStatus: "선정하기"; // 선정 상태 (선정된 신청자는 "선정하기" 고정)
      channel: string; // 채널 정보
    }>;
  };
  // 콘텐츠 데이터 (선택사항 - 종료/취소 캠페인에는 필수, 진행/예정/신청 캠페인에는 선택)
  contents?: {
    reviewing: Array<{
      id: string; // 콘텐츠 고유 식별자
      createdAt: string; // 생성일시 (ISO 8601 형식)
      status: "검수"; // 콘텐츠 상태
      userType: "리뷰어" | "인플루언서"; // 사용자 타입
      nickname: string; // 작성자 닉네임
      channelId: string; // 채널 식별자
      channel: string; // 채널명
      actionType?: string | number; // 액션 타입 (구매평 타입: "1"~"4" 또는 숫자)
      updatedAt?: string; // 수정일시 (선택사항)
      isRejected?: boolean; // 거절 여부 (선택사항)
      isLate?: boolean; // 지연 여부 (선택사항)
      thumbnailSrc?: string; // 썸네일 이미지 경로 (선택사항)
    }>;
    completed: Array<{
      id: string; // 콘텐츠 고유 식별자
      createdAt: string; // 생성일시 (ISO 8601 형식)
      status: "완료"; // 콘텐츠 상태
      userType: "리뷰어" | "인플루언서"; // 사용자 타입
      nickname: string; // 작성자 닉네임
      channelId: string; // 채널 식별자
      channel: string; // 채널명
      actionType?: string | number; // 액션 타입 (구매평 타입: "1"~"4" 또는 숫자)
      updatedAt?: string; // 수정일시 (선택사항)
      isLate?: boolean; // 지연 여부 (선택사항)
      thumbnailSrc?: string; // 썸네일 이미지 경로 (선택사항)
      receiptImages?: string[]; // 구매 영수증 이미지 목록 (선택사항)
    }>;
  };
}

/**
 * 구매평 캠페인 종료/취소 데이터 타입
 *
 * 종료되거나 취소된 구매평 캠페인의 데이터 구조입니다.
 * ReviewCampaignDataItem[] 타입을 사용하여 통일된 구조로 관리합니다.
 */
export type ReviewClosedCampaignData = ReviewCampaignDataItem[];

/**
 * 구매평 캠페인 진행/예정/신청 데이터 타입
 *
 * 진행 중, 예정, 신청 중인 구매평 캠페인의 데이터 구조입니다.
 * ReviewCampaignDataItem[] 타입을 사용하여 통일된 구조로 관리합니다.
 */
export type ReviewCampaignData = ReviewCampaignDataItem[];

/* ========================================
   🛒 구매평 캠페인 (종료/취소) 데이터 - contents 포함
   - 카테고리별 분리: campaignInfo + contents 함께 보관
   - ReviewCampaignDataItem 인터페이스로 통일된 구조 사용
   ======================================== */

export const reviewClosedCampaigns: ReviewCampaignDataItem[] = [
  {
    campaignInfo: {
      id: "903",
      title: "[종료] 구매평 캠페인 - 영수증/링크/이미지",
      image: "/images/main/campaign_img/eximg_3.png",
      status: "종료",
      campaignType: "구매평",
      category: "식품",
      brandName: "",
      partnerName: "(주)구매평마케팅",
      recruitmentPeriod: "2024-03-01 ~ 2024-03-07",
      announcementDate: "2024-03-07",
      registrationPeriod: "2024-03-09 ~ 2024-03-15",
      recruitedCount: 8,
      totalCount: 8,
      daysLeft: -20,
      statusText: "캠페인 콘텐츠를 검수해 주세요.",
    },
    contents: {
      reviewing: [
        {
          id: "903-r-1",
          createdAt: "2025-11-02T10:00:00.000Z",
          status: "검수",
          userType: "인플루언서",
          nickname: "구매-1",
          channelId: "review_user_903_1",
          channel: "",
          actionType: "1",
        },
        {
          id: "903-r-2",
          createdAt: "2025-11-02T10:10:00.000Z",
          status: "검수",
          userType: "인플루언서",
          nickname: "구매-2",
          channelId: "review_user_903_2",
          channel: "",
          actionType: "2",
          updatedAt: "2025-11-02T10:25:00.000Z",
        },
        {
          id: "903-r-3",
          createdAt: "2025-11-02T10:20:00.000Z",
          status: "검수",
          userType: "인플루언서",
          nickname: "구매-3",
          channelId: "review_user_903_3",
          channel: "",
          actionType: "3",
          isRejected: true,
        },
        {
          id: "903-r-4",
          createdAt: "2025-11-02T10:30:00.000Z",
          status: "검수",
          userType: "인플루언서",
          nickname: "구매-4",
          channelId: "review_user_903_4",
          channel: "",
          actionType: "4",
          isLate: true,
        },
        {
          id: "903-r-5",
          createdAt: "2025-11-02T10:40:00.000Z",
          status: "검수",
          userType: "인플루언서",
          nickname: "구매-5(검수)",
          channelId: "review_user_903_5",
          channel: "",
          actionType: "2",
        },
        {
          id: "903-r-6",
          createdAt: "2025-11-02T10:50:00.000Z",
          status: "검수",
          userType: "인플루언서",
          nickname: "구매-6(검수)",
          channelId: "review_user_903_6",
          channel: "",
          actionType: "1",
          isRejected: true,
        },
      ],
      completed: [
        {
          id: "903-c-1",
          createdAt: "2025-11-01T19:00:00.000Z",
          status: "완료",
          userType: "인플루언서",
          nickname: "구매-5",
          channelId: "review_user_903_c1",
          channel: "",
          actionType: "2",
        },
        {
          id: "903-c-2",
          createdAt: "2025-11-01T19:20:00.000Z",
          status: "완료",
          userType: "인플루언서",
          nickname: "구매-6",
          channelId: "review_user_903_c2",
          channel: "",
          actionType: "1",
          updatedAt: "2025-11-01T19:40:00.000Z",
        },
        {
          id: "903-c-3",
          createdAt: "2025-11-01T19:35:00.000Z",
          status: "완료",
          userType: "인플루언서",
          nickname: "구매-7",
          channelId: "review_user_903_c3",
          channel: "",
          actionType: "5",
          isLate: true,
        },
        {
          id: "903-c-4",
          createdAt: "2025-11-01T19:50:00.000Z",
          status: "완료",
          userType: "인플루언서",
          nickname: "구매-8",
          channelId: "review_user_903_c4",
          channel: "인스타그램",
          actionType: "4",
        },
        {
          id: "903-c-5",
          createdAt: "2025-11-01T20:05:00.000Z",
          status: "완료",
          userType: "인플루언서",
          nickname: "구매-9",
          channelId: "review_user_903_c5",
          channel: "인스타그램",
          actionType: "2",
        },
      ],
    },
  },
];

/* ========================================
   🛒 구매평 (예정/신청/진행) info+신청자 데이터
   - sharedCampaigns.ts 병합용
   - ReviewCampaignDataItem 인터페이스로 통일된 구조 사용
   ======================================== */
export const reviewCampaigns: ReviewCampaignDataItem[] = [
  // 진행 중 - 콘텐츠 있음 (2버튼 표시)
  {
    campaignInfo: {
      id: "18",
      title: "프리미엄 화장품 구매평 작성 캠페인",
      image: "/images/main/campaign_img/eximg_5.png",
      status: "진행 중",
      campaignType: "구매평",
      category: "식품",
      brandName: "",
      partnerName: "(주)구매평마케팅",
      recruitmentPeriod: "2024-01-15 ~ 2024-01-22",
      announcementDate: "2024-01-22",
      purchasePeriod: "2024-01-23 ~ 2024-01-25",
      registrationPeriod: "2024-01-24 ~ 2024-02-01",
      recruitedCount: 0, // 자동 계산됨 (applicantData.applicants.length)
      totalCount: 15,
      daysLeft: 3,
      statusText: "캠페인 콘텐츠를 검수해 주세요.",
    },
    applicantData: {
      applicants: [
        {
          id: "app_18_1",
          Id: "reviewer_18_001",
          nickname: "구매평전문가1",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          memo: "화장품 구매평 작성에 특화된 리뷰어입니다.",
          selectionStatus: "미선택",
          channel: "기본",
        },
        {
          id: "app_18_2",
          Id: "reviewer_18_002",
          nickname: "뷰티구매평러",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          memo: "뷰티 제품 구매평을 자주 작성합니다.",
          selectionStatus: "미선택",
          channel: "기본",
        },
        {
          id: "app_18_3",
          Id: "reviewer_18_003",
          nickname: "스킨케어구매평전문가",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          memo: "스킨케어 제품 구매평 전문가입니다.",
          selectionStatus: "미선택",
          channel: "기본",
        },
        {
          id: "app_18_4",
          Id: "reviewer_18_004",
          nickname: "구매평마스터",
          userType: "인플루언서",
          profileImage: "",
          memberType: "모범 회원",
          memo: "다양한 제품의 구매평 작성 경험이 풍부합니다.",
          selectionStatus: "미선택",
          channel: "기본",
        },
        {
          id: "app_18_5",
          Id: "reviewer_18_005",
          nickname: "제한된구매평계정",
          userType: "리뷰어",
          profileImage: "",
          memberType: "이용 제한",
          memo: "이용 제한 계정입니다.",
          selectionStatus: "이용제한 계정",
          channel: "기본",
        },
        {
          id: "app_18_6",
          Id: "reviewer_18_006",
          nickname: "신규구매평러",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          memo: "구매평 작성이 처음이지만 열정이 넘칩니다.",
          selectionStatus: "미선택",
          channel: "기본",
        },
      ],
      selectedApplicants: [
        {
          id: "sel_18_1",
          Id: "selected_18_001",
          nickname: "선정된구매평전문가1",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          memo: "이미 선정된 우수 구매평 작성자입니다.",
          selectionStatus: "선정하기",
          channel: "기본",
        },
        {
          id: "sel_18_2",
          Id: "selected_18_002",
          nickname: "프로구매평러",
          userType: "인플루언서",
          profileImage: "",
          memberType: "모범 회원",
          memo: "구매평 작성 경험이 풍부한 전문가입니다.",
          selectionStatus: "선정하기",
          channel: "기본",
        },
      ],
    },
    // 콘텐츠 데이터: 각 캠페인 정보 아래에 콘텐츠 목록 포함
    // 설명: deliveryClosedCampaigns와 동일한 형태로, campaignInfo 아래에 contents를 포함합니다.
    contents: {
      reviewing: [
        {
          id: "pr-r-1",
          createdAt: "2025-01-15T14:00:00.000Z",
          status: "검수",
          userType: "리뷰어",
          nickname: "구매평리뷰어1",
          channelId: "review_user_001",
          channel: "",
          actionType: 1,
        },
        {
          id: "pr-r-2",
          createdAt: "2025-01-15T14:30:00.000Z",
          status: "검수",
          userType: "인플루언서",
          nickname: "구매평인플루언서1",
          channelId: "review_user_002",
          channel: "",
          actionType: 1,
          updatedAt: "2025-01-15T15:00:00.000Z",
        },
        {
          id: "pr-r-3",
          createdAt: "2025-01-15T15:15:00.000Z",
          status: "검수",
          userType: "리뷰어",
          nickname: "구매평리뷰어2",
          channelId: "review_user_003",
          channel: "",
          actionType: 2,
          thumbnailSrc: "/images/test_img/eximg3.png",
          isRejected: true,
        },
        {
          id: "pr-r-4",
          createdAt: "2025-01-15T15:45:00.000Z",
          status: "검수",
          userType: "인플루언서",
          nickname: "구매평인플루언서2",
          channelId: "review_user_004",
          channel: "",
          actionType: 1,
          isLate: true,
        },
      ],
      completed: [
        {
          id: "pr-c-1",
          createdAt: "2025-01-12T10:00:00.000Z",
          status: "완료",
          userType: "리뷰어",
          nickname: "구매평완료리뷰어1",
          channelId: "review_user_005",
          channel: "",
          actionType: 1,
          receiptImages: [
            "/images/test_img/eximg.png",
            "/images/test_img/eximg.png",
          
          ],
        },
        {
          id: "pr-c-2",
          createdAt: "2025-01-12T11:00:00.000Z",
          status: "완료",
          userType: "인플루언서",
          nickname: "구매평완료인플루언서1",
          channelId: "review_user_006",
          channel: "",
          actionType: 1,
          updatedAt: "2025-01-12T12:00:00.000Z",
          receiptImages: [
            "/images/test_img/eximg3.png",
          ],
        },
        {
          id: "pr-c-3",
          createdAt: "2025-01-12T12:30:00.000Z",
          status: "완료",
          userType: "리뷰어",
          nickname: "구매평완료리뷰어2",
          channelId: "review_user_007",
          channel: "네이버블로그",
          actionType: 2,
          isLate: true,
          thumbnailSrc: "/images/test_img/eximg3.png",
        },
      ],
    },
  },
  // 진행 중(콘텐츠 없음 표시용)
  {
    campaignInfo: {
      id: "964",
      title: "[진행] 구매평 캠페인 진행",
      image: "/images/main/campaign_img/eximg_5.png",
      status: "진행 중" as const,
      campaignType: "구매평",
      category: "식품",
      brandName: "",
      partnerName: "(주)구매평마케팅",
      recruitmentPeriod: "2025-10-22 ~ 2025-11-02",
      announcementDate: "2025-11-02",
      purchasePeriod: "2025-11-03 ~ 2025-11-05",
      registrationPeriod: "2025-11-04 ~ 2025-11-12",
      recruitedCount: 0, // 자동 계산됨 (applicantData.applicants.length)
      totalCount: 10,
      daysLeft: 4,
      statusText: "캠페인 당첨자를 선정해 주세요.",
    },
    applicantData: { applicants: [], selectedApplicants: [] },
  },
  // 예정(대기 중)
  {
    campaignInfo: {
      id: "953",
      title: "[예정] 구매평 샘플 캠페인",
      image: "/images/main/campaign_img/eximg_5.png",
      status: "대기 중" as const,
      campaignType: "구매평",
      category: "식품",
      brandName: "",
      partnerName: "(주)구매평마케팅",
      recruitmentPeriod: "2025-11-05 ~ 2025-11-12",
      announcementDate: "2025-11-12",
      purchasePeriod: "2025-11-13 ~ 2025-11-15",
      registrationPeriod: "2025-11-14 ~ 2025-11-22",
      recruitedCount: 0, // 자동 계산됨 (applicantData.applicants.length)
      totalCount: 6,
      daysLeft: 7,
    },
    applicantData: { applicants: [], selectedApplicants: [] },
  },
  // 신청(모집 중)
  {
    campaignInfo: {
      id: "973",
      title: "[신청] 구매평 샘플 캠페인",
      image: "/images/main/campaign_img/eximg_5.png",
      status: "모집 중" as const,
      campaignType: "구매평",
      category: "식품",
      brandName: "기본",
      partnerName: "(주)구매평마케팅",
      recruitmentPeriod: "2025-11-03 ~ 2025-11-13",
      announcementDate: "2025-11-13",
      purchasePeriod: "2025-11-14 ~ 2025-11-16",
      registrationPeriod: "2025-11-15 ~ 2025-11-23",
      recruitedCount: 0, // 자동 계산됨 (applicantData.applicants.length)
      totalCount: 8,
      daysLeft: 11,
    },
    applicantData: {
      applicants: [
        {
          id: "app_973_basic_001",
          Id: "basic_973_001",
          nickname: "구매평러A",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          memo: "구매 후기 경험 다수",
          selectionStatus: "미선택",
          channel: "기본",
        },
        {
          id: "app_973_basic_002",
          Id: "basic_973_002",
          nickname: "성실리뷰B",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          memo: "사진 포함 상세 후기",
          selectionStatus: "미선택",
          channel: "기본",
        },
      ],
      selectedApplicants: [
        {
          id: "sel_973_basic_001",
          Id: "basic_sel_973_001",
          nickname: "선정구매평C",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          memo: "브랜드 톤 적합",
          selectionStatus: "선정하기",
          channel: "기본",
        },
      ],
    },
  },
];

/* ========================================
   📊 신청자 수 자동 계산 로직
   - 각 캠페인의 recruitedCount를 applicantData.applicants 배열 길이로 자동 설정
   - 데이터 일관성을 유지하기 위해 배열 정의 직후 실행됩니다
   ======================================== */

/**
 * reviewCampaigns 배열의 각 캠페인에 대해 recruitedCount를 자동 계산합니다
 *
 * 설명:
 * - 각 캠페인의 applicantData.applicants 배열의 길이를 계산하여
 *   campaignInfo.recruitedCount에 자동으로 설정합니다.
 * - 이렇게 하면 신청자 데이터를 추가/제거할 때마다 수동으로 숫자를 맞출 필요가 없습니다.

 */
reviewCampaigns.forEach((campaign) => {
  // 각 캠페인의 신청자 배열 길이를 계산하여 recruitedCount에 설정
  // 설명: applicantData.applicants가 undefined일 수 있으므로 옵셔널 체이닝(?.)과 널 병합 연산자(??)를 사용
  // applicants가 없으면 빈 배열([])로 간주하고, 그 길이는 0이 됩니다
  campaign.campaignInfo.recruitedCount =
    campaign.applicantData?.applicants?.length ?? 0;
});

/* ========================================
   🛒 구매평 콘텐츠 조회 함수
   - 진행 중인 캠페인의 콘텐츠 데이터를 조회합니다
   ======================================== */

/**
 * 구매평 캠페인의 콘텐츠 데이터를 조회하는 함수
 *
 * 설명:
 * - 캠페인 ID를 받아서 해당 캠페인의 콘텐츠(검수 중/완료)를 반환합니다.
 * - 종료/취소된 캠페인은 getClosedContentsById 함수를 사용합니다.
 * - 진행 중인 캠페인은 reviewCampaigns 배열에서 해당 ID를 찾아 contents를 반환합니다.
 * - 각 캠페인 데이터가 campaignInfo 아래에 contents를 포함하는 구조입니다.
 *
 * 반환 타입: ContentByTab
 * - reviewing: 검수 중인 콘텐츠 배열
 * - completed: 완료된 콘텐츠 배열
 *
 * @param campaignId - 조회할 캠페인의 ID
 * @returns 검수 중/완료된 콘텐츠를 담은 객체
 */
export function getPurchaseReviewContentsById(
  campaignId: string
): ContentByTab {
  // 종료/취소 탭 데이터(구매평): 903 매핑
  // 설명: 종료/취소된 캠페인은 reviewClosedCampaigns를 직접 참조 (순환 참조 방지)
  if (campaignId === "903") {
    const closedCampaign = reviewClosedCampaigns.find(
      (c) => c.campaignInfo.id === campaignId
    );
    if (closedCampaign?.contents) {
      return closedCampaign.contents;
    }
    return { reviewing: [], completed: [] };
  }

  // 진행 중인 캠페인의 콘텐츠 조회
  // 설명: reviewCampaigns 배열에서 해당 ID의 캠페인을 찾아서 contents를 반환합니다.
  // find() 메서드: 배열에서 조건에 맞는 첫 번째 요소를 반환합니다.
  const campaign = reviewCampaigns.find(
    (c) => c.campaignInfo.id === campaignId
  );

  // 캠페인을 찾았고 contents가 있으면 반환
  // 옵셔널 체이닝(?.)과 널 병합 연산자(??)를 사용해 안전하게 값을 가져옵니다.
  if (campaign?.contents) {
    return campaign.contents;
  }

  // 콘텐츠가 없는 경우 빈 배열 반환
  // 설명: 진행 중이지만 아직 콘텐츠가 업로드되지 않은 경우입니다.
  return { reviewing: [], completed: [] };
}

/* ========================================
   🛒 구매평 캠페인 등록 함수
   - 폼 데이터를 CampaignWithApplicants 형태로 변환
   ======================================== */

/**
 * 새 구매평 캠페인 ID 생성
 *
 * @returns 새로운 캠페인 ID (기존 ID 중 최대값 + 1)
 */
function generateNewReviewCampaignId(): string {
  // 기존 캠페인 ID 중 최대값 찾기
  const existingIds = reviewCampaigns
    .map((c) => parseInt(c.campaignInfo.id))
    .filter((id) => !isNaN(id));
  const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 900;

  return String(maxId + 1);
}

/**
 * 폼 데이터를 ReviewCampaignDataItem 형태로 변환하여 새 구매평 캠페인 생성
 *
 * 설명:
 * - 구매평 캠페인 등록 폼에서 입력한 데이터를 reviewCampaigns 구조에 맞게 변환합니다.
 * - 새 캠페인 ID를 자동 생성합니다.
 * - ReviewCampaignDataItem 인터페이스를 사용하여 통일된 구조로 생성합니다.
 *
 * @param formData - 폼에서 입력받은 캠페인 데이터
 * @param imageUrl - 업로드된 이미지 URL (첫 번째 이미지 사용)
 * @returns 새로 생성된 ReviewCampaignDataItem 객체 (CampaignWithApplicants와 호환됨)
 */
export function createReviewCampaign(
  formData: CampaignFormData,
  imageUrl: string = "/images/main/campaign_img/eximg_5.png"
): ReviewCampaignDataItem {
  // 새 캠페인 ID 생성
  const newId = generateNewReviewCampaignId();

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

  // 플랫폼명 정규화 (공백 제거하여 로고 매핑 일치시키기)
  const normalizedBrandName = formData.platform
    ? formData.platform.replace(/\s+/g, "")
    : "기본";

  return {
    campaignInfo: {
      id: newId,
      title: formData.title,
      image: imageUrl,
      status: campaignStatus,
      campaignType: "구매평",
      category: formData.category || "기타",
      brandName: normalizedBrandName,
      recruitmentPeriod: formData.recruitmentPeriod,
      announcementDate: formData.announcementDate,
      registrationPeriod: formData.registrationPeriod,
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
 * 설명:
 * - 기존 구매평 캠페인을 수정합니다.
 * - 캠페인 ID는 유지하고, 나머지 정보만 업데이트합니다.
 * - 신청자 데이터는 유지합니다.
 * - ReviewCampaignDataItem 인터페이스를 사용하여 통일된 구조로 반환합니다.
 *
 * @param campaignId - 수정할 캠페인 ID
 * @param formData - 폼에서 입력받은 캠페인 데이터
 * @param imageUrl - 업로드된 이미지 URL
 * @returns 수정된 ReviewCampaignDataItem 객체 (CampaignWithApplicants와 호환됨)
 */
export function updateReviewCampaign(
  campaignId: string,
  formData: CampaignFormData,
  imageUrl: string = "/images/main/campaign_img/eximg_5.png"
): ReviewCampaignDataItem {
  // 기존 캠페인 데이터 찾기
  const existingCampaign = reviewCampaigns.find(
    (c) => c.campaignInfo.id === campaignId
  );

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

  // 플랫폼명 정규화 (공백 제거하여 로고 매핑 일치시키기)
  const normalizedBrandName = formData.platform
    ? formData.platform.replace(/\s+/g, "")
    : "기본";

  return {
    campaignInfo: {
      id: campaignId, // 기존 ID 유지
      title: formData.title,
      image: imageUrl,
      status: campaignStatus,
      campaignType: "구매평",
      category: formData.category || "기타",
      brandName: normalizedBrandName,
      recruitmentPeriod: formData.recruitmentPeriod,
      announcementDate: formData.announcementDate,
      registrationPeriod: formData.registrationPeriod,
      purchasePeriod: formData.purchasePeriod || "",
      recruitedCount: existingApplicantData?.applicants?.length ?? 0, // 자동 계산 (applicantData.applicants.length)
      totalCount: totalCount,
      daysLeft: daysLeft,
    },
    applicantData: existingApplicantData, // 기존 신청자 데이터 유지
  };
}

/**
 * 새 구매평 캠페인을 reviewCampaigns 배열에 추가
 *
 * 설명:
 * - ReviewCampaignDataItem 인터페이스를 사용하여 통일된 구조로 캠페인을 생성합니다.
 *
 * @param formData - 폼에서 입력받은 캠페인 데이터
 * @param imageUrl - 업로드된 이미지 URL
 * @returns 새로 생성된 ReviewCampaignDataItem 객체 (CampaignWithApplicants와 호환됨)
 */
export function addReviewCampaign(
  formData: CampaignFormData,
  imageUrl: string = "/images/main/campaign_img/eximg_5.png"
): ReviewCampaignDataItem {
  return createReviewCampaign(formData, imageUrl);
}
