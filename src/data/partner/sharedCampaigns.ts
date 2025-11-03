/* ========================================
   📊 공용 캠페인 데이터
   ======================================== */

/**
 * 공용 캠페인 데이터
 *
 * 목적: 관리 페이지와 신청내역 페이지에서 공통으로 사용하는 캠페인 데이터
 *
 * 사용 위치:
 * - /partner/campaign_management (관리 페이지)
 * - /partner/campaign_application (신청내역 페이지)
 *
 * 주요 기능:
 * - 캠페인 기본 정보와 신청자 데이터를 하나의 파일에서 관리
 * - 데이터 일관성 보장
 * - 중복 데이터 제거
 */

import type { PartnerCampaign } from "@/types/partner";
import {
  getStatusMessage,
  getBrandLogo,
  getSubStatus,
  getPartnerTabByDates,
} from "./utils/campaignHelpers";
import type {
  CampaignWithApplicants,
  AllApplicant,
} from "./campaign_application/delivery_applicants";
// 타입별 분리 데이터(배송형/기자단/미션형)
import { deliveryCampaigns } from "./delivery";
import { reporterCampaigns } from "./reporter";
// 리뷰형은 순환 참조 가능성이 있어 동적 로딩으로 처리
// 종료/취소 데이터(콘텐츠 구조) 소스
// 리뷰형 종료/취소 데이터도 동적 로딩으로 처리
// missionClosedCampaigns와 deliveryClosedCampaigns는 순환 참조를 피하기 위해 지연 로딩
// import { missionClosedCampaigns } from "./mission";
// import { deliveryClosedCampaigns } from "./delivery";

// 타입을 재export (신청내역/관리에서 공통 사용)
export type { CampaignWithApplicants, AllApplicant };

/* ========================================
   📦 콘텐츠 데이터 타입 정의
   - 캠페인 콘텐츠(리뷰) 데이터의 공통 타입 정의
   ======================================== */

/**
 * ContentItem 인터페이스
 *
 * 설명:
 * - 각 캠페인에 등록된 콘텐츠(리뷰)의 정보를 담는 타입입니다.
 * - 검수 중/완료된 콘텐츠 모두 이 타입을 사용합니다.
 *
 * 학습 포인트:
 * - TypeScript 인터페이스: 객체의 구조를 정의하는 방법
 * - 선택적 속성(?): 있어도 되고 없어도 되는 속성
 * - 문자열 리터럴 타입: 특정 값만 허용하는 타입 ("검수" | "완료")
 */
export interface ContentItem {
  /** 콘텐츠 고유 식별자 */
  id: string;
  /** 콘텐츠 생성일시 (ISO 8601 형식, 예: "2025-01-15T10:00:00.000Z") */
  createdAt: string;
  /** 콘텐츠 상태 ("검수" | "완료") */
  status: "검수" | "완료";
  /** 사용자 타입 ("리뷰어" | "인플루언서") */
  userType: "리뷰어" | "인플루언서";
  /** 작성자 닉네임 */
  nickname: string;
  /** 채널 식별자 (블로그 ID, 인스타그램 ID 등) */
  channelId: string;
  /** 채널명 (예: "네이버블로그", "인스타그램") */
  channel: string;
  /** 썸네일 이미지 URL (선택사항) */
  thumbnailSrc?: string;
  /** 수정일시 (선택사항, 있으면 최종 수정 시간) */
  updatedAt?: string;
  /** 거절 여부 (true면 거절된 콘텐츠) */
  isRejected?: boolean;
  /** 지연 여부 (true면 마감일을 넘긴 콘텐츠) */
  isLate?: boolean;
  /** 액션 타입 (구매평/미션형 전용, 선택사항) - 숫자 1: 구매영수증 확인, 문자열 "1"~"4": 리뷰/링크/이미지 타입 */
  actionType?: string | number;
  /** 미션 타입 (미션형 전용, 선택사항) */
  missionType?: string;
  /** 구매 영수증 이미지 목록 (구매평 영수증 흐름 전용) */
  receiptImages?: string[];
}

/**
 * ContentByTab 타입
 *
 * 설명:
 * - 캠페인 콘텐츠를 탭별로 분류한 구조입니다.
 * - "검수" 탭과 "완료" 탭으로 나뉩니다.
 *
 * 학습 포인트:
 * - 객체 타입: 중괄호로 객체의 구조를 정의합니다.
 * - 배열 타입: ContentItem[]는 ContentItem 객체들의 배열을 의미합니다.
 * - 타입 별칭(type alias): interface 대신 type으로 간단히 정의할 수 있습니다.
 */
export type ContentByTab = {
  /** 검수 중인 콘텐츠 목록 */
  reviewing: ContentItem[];
  /** 완료된 콘텐츠 목록 */
  completed: ContentItem[];
};

// 종료/취소 타입과 데이터 (기존 closedCampaigns.ts 통합)
export interface CampaignWithContents {
  campaignInfo: {
    id: string;
    title: string;
    image: string;
    status: string;
    category: string;
    brandName: string;
    recruitmentPeriod: string;
    announcementDate: string;
    registrationPeriod: string;
    recruitedCount: number;
    totalCount: number;
    daysLeft: number;
    statusText?: string;
  };
  contents: ContentByTab;
}

/**
 * 종료/취소 캠페인 통합 배열 (순환 참조 방지를 위한 함수)
 * - deliveryClosedCampaigns는 지연 로딩으로 처리
 */
export function getClosedCampaigns(): CampaignWithContents[] {
  // 순환 참조를 피하기 위해 동적 import 사용
  let deliveryClosed: CampaignWithContents[] = [];
  let missionClosed: CampaignWithContents[] = [];
  let visitClosed: CampaignWithContents[] = [];
  let reviewClosed: CampaignWithContents[] = [];

  try {
    // require를 사용하여 런타임에 모듈 로드
    const deliveryModule = require("./delivery");
    deliveryClosed = deliveryModule.deliveryClosedCampaigns || [];
  } catch (error) {
    console.error("deliveryClosedCampaigns 로드 실패:", error);
  }

  try {
    // missionClosedCampaigns도 동적 로딩으로 처리
    const missionModule = require("./mission");
    missionClosed = missionModule.missionClosedCampaigns || [];
  } catch (error) {
    console.error("missionClosedCampaigns 로드 실패:", error);
  }

  try {
    // visitClosedCampaigns도 동적 로딩으로 처리 (순환 참조 방지)
    const visitModule = require("./visit");
    visitClosed = visitModule.visitClosedCampaigns || [];
  } catch (error) {
    console.error("visitClosedCampaigns 로드 실패:", error);
  }

  try {
    const reviewModule = require("./review");
    reviewClosed = reviewModule.reviewClosedCampaigns || [];
  } catch (error) {
    console.error("reviewClosedCampaigns 로드 실패:", error);
  }

  return [
    ...visitClosed,
    ...missionClosed,
    ...deliveryClosed,
    ...reviewClosed,
  ];
}

// 하위 호환성을 위해 상수로도 export (내부적으로 함수 호출)
export const closedCampaigns: CampaignWithContents[] = getClosedCampaigns();

export function getClosedContentsById(
  campaignId: string
): ContentByTab | undefined {
  const found = closedCampaigns.find((c) => c.campaignInfo.id === campaignId);
  return found?.contents;
}

/**
 * localStorage에서 저장된 캠페인 불러오기 (모든 타입)
 *
 * 설명:
 * - 새로 등록된 캠페인이 localStorage에 저장된 경우, 이를 불러옵니다.
 * - 실제 프로덕션에서는 API를 통해 서버에서 데이터를 가져와야 합니다.
 * - 매번 불러올 때마다 현재 날짜 기준으로 캠페인 상태를 재계산합니다.
 *
 * 학습 포인트:
 * - 동적 상태 업데이트: localStorage에 저장된 데이터도 날짜에 따라 상태가 변할 수 있으므로
 *   매번 불러올 때마다 현재 날짜를 기준으로 상태를 재계산합니다.
 *
 * @returns localStorage에 저장된 CampaignWithApplicants 배열 (상태 재계산됨)
 */
function getStoredCampaigns(): CampaignWithApplicants[] {
  // 배송형 캠페인 불러오기
  const deliveryCampaigns = getStoredDeliveryCampaigns();

  // 방문형 캠페인 불러오기
  const visitCampaigns = getStoredVisitCampaigns();

  // 구매평 캠페인 불러오기
  const reviewCampaigns = getStoredReviewCampaigns();

  // 기자단 캠페인 불러오기
  const reporterCampaigns = getStoredReporterCampaigns();

  // 미션형 캠페인 불러오기
  const missionCampaigns = getStoredMissionCampaigns();

  // 모든 타입의 캠페인 병합
  return [
    ...deliveryCampaigns,
    ...visitCampaigns,
    ...reviewCampaigns,
    ...reporterCampaigns,
    ...missionCampaigns,
  ];
}

/**
 * localStorage에서 저장된 배송형 캠페인 불러오기
 *
 * @returns localStorage에 저장된 배송형 CampaignWithApplicants 배열 (상태 재계산됨)
 */
function getStoredDeliveryCampaigns(): CampaignWithApplicants[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem("deliveryCampaigns");
    if (!stored) return [];

    const campaigns: CampaignWithApplicants[] = JSON.parse(stored);
    if (!Array.isArray(campaigns)) return [];

    // 각 캠페인의 상태를 현재 날짜 기준으로 재계산
    // 동적 import를 사용하여 순환 참조 방지
    let calculateCampaignStatus: (
      recruitmentPeriod?: string,
      announcementDate?: string
    ) => "대기 중" | "모집 중" | "진행 중" = () => "대기 중";

    try {
      const deliveryModule = require("./delivery");
      calculateCampaignStatus = deliveryModule.calculateCampaignStatus;
    } catch (error) {
      console.error("calculateCampaignStatus 함수 로드 실패:", error);
    }

    return campaigns.map((campaign) => {
      // 현재 날짜 기준으로 상태 재계산
      const updatedStatus = calculateCampaignStatus(
        campaign.campaignInfo.recruitmentPeriod,
        campaign.campaignInfo.announcementDate
      );

      // daysLeft도 재계산
      let daysLeft = 0;
      if (campaign.campaignInfo.announcementDate) {
        try {
          const deliveryModule = require("./delivery");
          daysLeft =
            deliveryModule.calculateDaysLeft(
              campaign.campaignInfo.announcementDate.split(" ")[0]
            ) || 0;
        } catch (error) {
          console.error("calculateDaysLeft 함수 로드 실패:", error);
        }
      }

      return {
        ...campaign,
        campaignInfo: {
          ...campaign.campaignInfo,
          status: updatedStatus,
          daysLeft: daysLeft,
        },
      };
    });
  } catch (error) {
    console.error("localStorage에서 배송형 캠페인 불러오기 실패:", error);
    return [];
  }
}

/**
 * localStorage에서 저장된 방문형 캠페인 불러오기
 *
 * @returns localStorage에 저장된 방문형 CampaignWithApplicants 배열 (상태 재계산됨)
 */
function getStoredVisitCampaigns(): CampaignWithApplicants[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem("visitCampaigns");
    if (!stored) return [];

    const campaigns: CampaignWithApplicants[] = JSON.parse(stored);
    if (!Array.isArray(campaigns)) return [];

    let calculateCampaignStatus: (
      recruitmentPeriod?: string,
      announcementDate?: string
    ) => "대기 중" | "모집 중" | "진행 중" = () => "대기 중";

    try {
      const deliveryModule = require("./delivery");
      calculateCampaignStatus = deliveryModule.calculateCampaignStatus;
    } catch (error) {
      console.error("calculateCampaignStatus 함수 로드 실패:", error);
    }

    return campaigns.map((campaign) => {
      const updatedStatus = calculateCampaignStatus(
        campaign.campaignInfo.recruitmentPeriod,
        campaign.campaignInfo.announcementDate
      );

      let daysLeft = 0;
      if (campaign.campaignInfo.announcementDate) {
        try {
          const deliveryModule = require("./delivery");
          daysLeft =
            deliveryModule.calculateDaysLeft(
              campaign.campaignInfo.announcementDate.split(" ")[0]
            ) || 0;
        } catch (error) {
          console.error("calculateDaysLeft 함수 로드 실패:", error);
        }
      }

      return {
        ...campaign,
        campaignInfo: {
          ...campaign.campaignInfo,
          status: updatedStatus,
          daysLeft: daysLeft,
        },
      };
    });
  } catch (error) {
    console.error("localStorage에서 방문형 캠페인 불러오기 실패:", error);
    return [];
  }
}

/**
 * localStorage에서 저장된 구매평 캠페인 불러오기
 *
 * @returns localStorage에 저장된 구매평 CampaignWithApplicants 배열 (상태 재계산됨)
 */
function getStoredReviewCampaigns(): CampaignWithApplicants[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem("reviewCampaigns");
    if (!stored) return [];

    const campaigns: CampaignWithApplicants[] = JSON.parse(stored);
    if (!Array.isArray(campaigns)) return [];

    let calculateCampaignStatus: (
      recruitmentPeriod?: string,
      announcementDate?: string
    ) => "대기 중" | "모집 중" | "진행 중" = () => "대기 중";

    try {
      const deliveryModule = require("./delivery");
      calculateCampaignStatus = deliveryModule.calculateCampaignStatus;
    } catch (error) {
      console.error("calculateCampaignStatus 함수 로드 실패:", error);
    }

    return campaigns.map((campaign) => {
      const updatedStatus = calculateCampaignStatus(
        campaign.campaignInfo.recruitmentPeriod,
        campaign.campaignInfo.announcementDate
      );

      let daysLeft = 0;
      if (campaign.campaignInfo.announcementDate) {
        try {
          const deliveryModule = require("./delivery");
          daysLeft =
            deliveryModule.calculateDaysLeft(
              campaign.campaignInfo.announcementDate.split(" ")[0]
            ) || 0;
        } catch (error) {
          console.error("calculateDaysLeft 함수 로드 실패:", error);
        }
      }

      return {
        ...campaign,
        campaignInfo: {
          ...campaign.campaignInfo,
          status: updatedStatus,
          daysLeft: daysLeft,
        },
      };
    });
  } catch (error) {
    console.error("localStorage에서 구매평 캠페인 불러오기 실패:", error);
    return [];
  }
}

/**
 * localStorage에서 저장된 기자단 캠페인 불러오기
 *
 * @returns localStorage에 저장된 기자단 CampaignWithApplicants 배열 (상태 재계산됨)
 */
function getStoredReporterCampaigns(): CampaignWithApplicants[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem("reporterCampaigns");
    if (!stored) return [];

    const campaigns: CampaignWithApplicants[] = JSON.parse(stored);
    if (!Array.isArray(campaigns)) return [];

    let calculateCampaignStatus: (
      recruitmentPeriod?: string,
      announcementDate?: string
    ) => "대기 중" | "모집 중" | "진행 중" = () => "대기 중";

    try {
      const deliveryModule = require("./delivery");
      calculateCampaignStatus = deliveryModule.calculateCampaignStatus;
    } catch (error) {
      console.error("calculateCampaignStatus 함수 로드 실패:", error);
    }

    return campaigns.map((campaign) => {
      const updatedStatus = calculateCampaignStatus(
        campaign.campaignInfo.recruitmentPeriod,
        campaign.campaignInfo.announcementDate
      );

      let daysLeft = 0;
      if (campaign.campaignInfo.announcementDate) {
        try {
          const deliveryModule = require("./delivery");
          daysLeft =
            deliveryModule.calculateDaysLeft(
              campaign.campaignInfo.announcementDate.split(" ")[0]
            ) || 0;
        } catch (error) {
          console.error("calculateDaysLeft 함수 로드 실패:", error);
        }
      }

      return {
        ...campaign,
        campaignInfo: {
          ...campaign.campaignInfo,
          status: updatedStatus,
          daysLeft: daysLeft,
        },
      };
    });
  } catch (error) {
    console.error("localStorage에서 기자단 캠페인 불러오기 실패:", error);
    return [];
  }
}

/**
 * localStorage에서 저장된 미션형 캠페인 불러오기
 *
 * @returns localStorage에 저장된 미션형 CampaignWithApplicants 배열 (상태 재계산됨)
 */
function getStoredMissionCampaigns(): CampaignWithApplicants[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem("missionCampaigns");
    if (!stored) return [];

    const campaigns: CampaignWithApplicants[] = JSON.parse(stored);
    if (!Array.isArray(campaigns)) return [];

    let calculateCampaignStatus: (
      recruitmentPeriod?: string,
      announcementDate?: string
    ) => "대기 중" | "모집 중" | "진행 중" = () => "대기 중";

    try {
      const deliveryModule = require("./delivery");
      calculateCampaignStatus = deliveryModule.calculateCampaignStatus;
    } catch (error) {
      console.error("calculateCampaignStatus 함수 로드 실패:", error);
    }

    return campaigns.map((campaign) => {
      const updatedStatus = calculateCampaignStatus(
        campaign.campaignInfo.recruitmentPeriod,
        campaign.campaignInfo.announcementDate
      );

      let daysLeft = 0;
      if (campaign.campaignInfo.announcementDate) {
        try {
          const deliveryModule = require("./delivery");
          daysLeft =
            deliveryModule.calculateDaysLeft(
              campaign.campaignInfo.announcementDate.split(" ")[0]
            ) || 0;
        } catch (error) {
          console.error("calculateDaysLeft 함수 로드 실패:", error);
        }
      }

      return {
        ...campaign,
        campaignInfo: {
          ...campaign.campaignInfo,
          status: updatedStatus,
          daysLeft: daysLeft,
        },
      };
    });
  } catch (error) {
    console.error("localStorage에서 미션형 캠페인 불러오기 실패:", error);
    return [];
  }
}

/**
 * 공용 캠페인 데이터를 동적으로 가져오는 함수
 *
 * 설명:
 * - 화면에서 보여줄 모든 더미 캠페인 데이터를 한 곳에 모아둔 배열입니다.
 * - 각 요소는 `campaignInfo`(상단 카드 정보)와 `applicantData`(신청/선정자 목록)로 구성됩니다.
 * - 종료/취소 캠페인은 `closedCampaigns`에 별도 분리되어 있으며, 최소 정보만 여기로 병합합니다.
 * - localStorage에 저장된 새로 등록된 캠페인도 매번 최신 상태로 포함됩니다.
 *
 * 학습 포인트:
 * - spread operator(...): 배열을 펼쳐서 병합
 * - localStorage: 브라우저 로컬 저장소 (실제 프로덕션에서는 API 사용)
 * - 함수로 변경: 매번 최신 localStorage 데이터를 반영하기 위함
 *
 * @returns CampaignWithApplicants[] - 모든 캠페인 데이터 배열
 */
export function getSharedCampaigns(): CampaignWithApplicants[] {
  // 순환 참조 방지를 위해 방문형/미션형은 동적 로딩
  let visitList: CampaignWithApplicants[] = [];
  let missionList: CampaignWithApplicants[] = [];
  let reviewList: CampaignWithApplicants[] = [];
  try {
    const visitModule = require("./visit");
    visitList = visitModule.visitCampaigns || [];
  } catch (error) {
    console.error("visitCampaigns 로드 실패:", error);
  }

  try {
    const missionModule = require("./mission");
    missionList = missionModule.missionCampaigns || [];
  } catch (error) {
    console.error("missionCampaigns 로드 실패:", error);
  }

  try {
    const reviewModule = require("./review");
    reviewList = reviewModule.reviewCampaigns || [];
  } catch (error) {
    console.error("reviewCampaigns 로드 실패:", error);
  }

  return [
    // 타입 분리된 카테고리 병합
    ...reporterCampaigns,
    ...deliveryCampaigns,
    ...missionList,
    ...visitList,
    ...reviewList,
    // localStorage에서 불러온 새로 등록된 캠페인 (모든 타입, 매번 최신 데이터 반영)
    ...getStoredCampaigns(),
    // 종료/취소 데이터 (콘텐츠 전용 구조) → 관리 페이지 목록 노출을 위해 최소 정보 병합
    ...closedCampaigns.map((c) => ({
      campaignInfo: {
        ...c.campaignInfo,
        status: c.campaignInfo.status as
          | "진행 중"
          | "모집 중"
          | "대기 중"
          | "종료"
          | "취소",
      },
      applicantData: { applicants: [], selectedApplicants: [] },
    })),
  ];
}

/**
 * 공용 캠페인 데이터 (하위 호환성을 위해 상수로도 export)
 *
 * 주의: 이 상수는 모듈 로드 시 한 번만 생성되므로, localStorage의 새 캠페인은 반영되지 않을 수 있습니다.
 * 가능하면 getSharedCampaigns() 함수를 사용하세요.
 */
export const sharedCampaigns: CampaignWithApplicants[] = getSharedCampaigns();

/**
 * 관리 페이지용 PartnerCampaign 데이터로 변환
 *
 * 반환: PartnerCampaign[]
 * - 카드 리스트/통계 산출에 맞춘 구조로 매핑합니다.
 * - 상태값(모집 중/진행 중 등)을 관리 페이지 탭과 일치하도록 변환합니다.
 * - 매번 최신 sharedCampaigns 데이터를 사용합니다.
 */
export const convertToPartnerCampaigns = (): PartnerCampaign[] => {
  return getSharedCampaigns().map((campaign) => {
    // 날짜 기반으로 탭(상태) 계산
    // 우선 순위: 명시적으로 취소된 캠페인은 그대로 "취소"
    let calculatedTab: "예정" | "신청" | "진행" | "종료" | "취소" = "예정";

    if (
      campaign.campaignInfo.status === "취소" ||
      campaign.campaignInfo.status === "마감"
    ) {
      calculatedTab = "취소";
    } else {
      // 날짜 기반 탭 분류 규칙 적용 (예정/신청/진행/종료)
      const tab = getPartnerTabByDates(
        campaign.campaignInfo.recruitmentPeriod,
        campaign.campaignInfo.registrationPeriod
      );

      if (tab !== "전체") {
        calculatedTab = tab;
      } else {
        // 탭 판단이 어렵다면 기존 상태를 보수적으로 매핑
        calculatedTab =
          campaign.campaignInfo.status === "진행 중"
            ? "진행"
            : campaign.campaignInfo.status === "모집 중"
            ? "신청"
            : campaign.campaignInfo.status === "대기 중"
            ? "예정"
            : (campaign.campaignInfo.status as
                | "예정"
                | "진행"
                | "종료"
                | "취소");
      }
    }

    return {
      id: campaign.campaignInfo.id,
      title: campaign.campaignInfo.title,
      image: campaign.campaignInfo.image,
      type: campaign.campaignInfo.category as
        | "배송형"
        | "방문형"
        | "구매평"
        | "기자단"
        | "미션형",
      status: calculatedTab,
      deadline: campaign.campaignInfo.announcementDate,
      remainingDays: campaign.campaignInfo.daysLeft,
      statusMessage:
        campaign.campaignInfo.statusText ||
        getStatusMessage(
          campaign.campaignInfo.status,
          campaign.campaignInfo.daysLeft
        ),
      applicants: campaign.applicantData.applicants.length,
      recruits: campaign.campaignInfo.totalCount,
      submissions: 0, // 필요시 추가
      selected: campaign.applicantData.selectedApplicants.length,
      brand: campaign.campaignInfo.brandName,
      brandLogo: getBrandLogo(
        campaign.campaignInfo.brandName || "기본",
        campaign.campaignInfo.category
      ),
      // 계산된 탭(상태)을 기반으로 서브 상태 결정
      subStatus: getSubStatus(
        calculatedTab,
        campaign.applicantData.applicants.length,
        campaign.applicantData.selectedApplicants.length
      ),
    };
  });
};

/**
 * 상태별 안내 문구 생성
 * - 카드 하단/툴팁 등에 사용할 간단 메시지
 */
// ↓ 공용 헬퍼는 utils/campaignHelpers.ts로 분리

/**
 * 브랜드 로고 경로 반환
 * - 카테고리(구매평/미션형) 우선, 그 외는 브랜드명 매핑
 */
// ↑ 공용 헬퍼는 utils/campaignHelpers.ts로 분리

/**
 * 캠페인 상태 → 서브 상태 키 반환
 * - 관리 카드의 버튼/액션 표시에 사용될 간단 키워드
 */
// ↑ 공용 헬퍼는 utils/campaignHelpers.ts로 분리

/**
 * 캠페인 단건 조회 (신청내역 페이지용)
 * - 파라미터: id (문자열)
 * - 반환: CampaignWithApplicants | null
 * - 매번 최신 sharedCampaigns 데이터를 사용합니다.
 * - localStorage에 저장된 새로 등록한 캠페인을 우선 검색합니다.
 *
 * 학습 포인트:
 * - find(): 배열에서 조건에 맞는 첫 번째 요소를 찾습니다
 * - ID 매칭: 문자열 비교로 정확히 일치하는 캠페인을 찾습니다
 * - localStorage 데이터도 포함하여 검색합니다
 * - 검색 순서: localStorage → 일반 데이터 순서로 검색하여 새 캠페인 우선
 */
export const getCampaignById = (id: string): CampaignWithApplicants | null => {
  // 디버깅: ID로 찾는 과정 로그
  console.log(`[getCampaignById] 찾는 ID: "${id}"`);

  // 1. localStorage에 저장된 새 캠페인을 먼저 검색 (우선순위, 모든 타입)
  // 이렇게 하면 새로 등록한 캠페인이 ID 중복이 있어도 우선적으로 반환됩니다
  const storedCampaigns = getStoredCampaigns();
  const storedFound = storedCampaigns.find(
    (campaign) => campaign.campaignInfo.id === id
  );

  if (storedFound) {
    console.log(`[getCampaignById] localStorage에서 캠페인 찾음:`, {
      id: storedFound.campaignInfo.id,
      title: storedFound.campaignInfo.title,
      category: storedFound.campaignInfo.category,
      brandName: storedFound.campaignInfo.brandName,
      applicantsCount: storedFound.applicantData.applicants.length,
    });
    return storedFound;
  }

  // 2. localStorage에 없으면 일반 데이터에서 검색
  const allCampaigns = getSharedCampaigns();
  console.log(`[getCampaignById] 전체 캠페인 수: ${allCampaigns.length}`);

  const found = allCampaigns.find((campaign) => {
    const matches = campaign.campaignInfo.id === id;
    if (matches) {
      console.log(`[getCampaignById] 일반 데이터에서 캠페인 찾음:`, {
        id: campaign.campaignInfo.id,
        title: campaign.campaignInfo.title,
        category: campaign.campaignInfo.category,
        brandName: campaign.campaignInfo.brandName,
        applicantsCount: campaign.applicantData.applicants.length,
      });
    }
    return matches;
  });

  if (!found) {
    console.warn(`[getCampaignById] 캠페인을 찾을 수 없습니다: ${id}`);
  }

  return found || null;
};

/**
 * 관리 페이지 탭별 캠페인 필터링
 * - 파라미터: "전체/예정/신청/진행/종료/취소"
 * - 반환: PartnerCampaign[]
 */
export const getCampaignsByTab = (tab: string): PartnerCampaign[] => {
  const partnerCampaigns = convertToPartnerCampaigns();

  switch (tab) {
    case "전체":
      return partnerCampaigns;
    case "예정":
      return partnerCampaigns.filter((campaign) => campaign.status === "예정");
    case "신청":
      return partnerCampaigns.filter((campaign) => campaign.status === "신청");
    case "진행":
      return partnerCampaigns.filter((campaign) => campaign.status === "진행");
    case "종료":
      return partnerCampaigns.filter((campaign) => campaign.status === "종료");
    case "취소":
      return partnerCampaigns.filter((campaign) => campaign.status === "취소");
    default:
      return partnerCampaigns;
  }
};

/**
 * 캠페인 통계 데이터 집계
 * - 카드 리스트를 변환한 뒤, 각 상태별 개수를 계산해 반환합니다.
 */
export const getCampaignStats = () => {
  const partnerCampaigns = convertToPartnerCampaigns();

  return {
    전체: partnerCampaigns.length,
    예정: partnerCampaigns.filter((c) => c.status === "예정").length,
    신청: partnerCampaigns.filter((c) => c.status === "신청").length,
    진행: partnerCampaigns.filter((c) => c.status === "진행").length,
    종료: partnerCampaigns.filter((c) => c.status === "종료").length,
    취소: partnerCampaigns.filter((c) => c.status === "취소").length,
    패널티: 0,
  };
};
