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

import type {
  PartnerCampaign,
  PartnerCampaignStats,
} from "@/types/partner/partner";
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
// /data/campaign 데이터를 직접 사용 (변환 없이)
import {
  deliveryCampaigns as campaignDeliveryCampaigns,
  deliveryCampaignsExtended,
  deliveryClosedCampaignsExtended,
} from "@/data/campaign/delivery/deliveryCampaigns";
import {
  missionCampaigns as campaignMissionCampaigns,
  missionCampaignsExtended,
} from "@/data/campaign/mission/missionCampaigns";
import {
  reviewCampaigns as campaignReviewCampaigns,
  reviewCampaignsExtended,
} from "@/data/campaign/review/reviewCampaigns";
import {
  visitCampaigns as campaignVisitCampaigns,
  visitCampaignsExtended,
} from "@/data/campaign/visit/visitCampaigns";
import {
  reporterCampaigns as campaignReporterCampaigns,
  reporterCampaignsExtended,
} from "@/data/campaign/reporter/reporterCampaigns";

// 타입별 분리 데이터(배송형/기자단/미션형) - localStorage에서만 사용
// import { deliveryCampaigns } from "./delivery";
// import { reporterCampaigns } from "./reporter";
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
 */
export interface ContentItem {
  /** 콘텐츠 고유 식별자 */
  id: string;
  /** 콘텐츠 생성일시 (ISO 8601 형식, 예: "2025-01-15T10:00:00.000Z") */
  createdAt: string;
  /** 콘텐츠 상태 ("검수" | "검수중" | "완료") */
  status: "검수" | "검수중" | "완료";
  /** 사용자 타입 ("리뷰어" | "인플루언서") */
  userType: "리뷰어" | "인플루언서";
  /** 작성자 닉네임 */
  nickname: string;
  /** 채널 식별자 (블로그 ID, 인스타그램 ID 등) */
  channelId: string;
  /** 채널명 (예: "네이버블로그", "인스타그램") */
  channel: string;
  /** 프로필 이미지 URL (선택사항) */
  profileImage?: string;
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
  /** 등록 기한 연장 요청 사유 (대기 탭 전용, 선택사항) */
  extension_request_reason?: string;
  /** 연장 승인 여부 (대기 탭 전용, 선택사항) */
  isExtensionApproved?: boolean;
  /** 연장된 기한 날짜 (대기 탭 전용, 선택사항) */
  extendedDeadline?: string;
  /** 반려 사유 (대기 탭 전용, 선택사항) */
  reject_reason?: string;
  /** 신고 처리 여부 (대기 탭 전용, 선택사항) */
  isReported?: boolean;
  /** 신고 처리된 날짜/시간 (대기 탭 전용, 선택사항) */
  reportedDate?: string;
}

/**
 * ContentByTab 타입
 *
 * 설명:
 * - 캠페인 콘텐츠를 탭별로 분류한 구조입니다.
 * - "대기" 탭, "검수" 탭, "완료" 탭으로 나뉩니다.
 *
 */
export type ContentByTab = {
  /** 대기 중인 콘텐츠 목록 (콘텐츠 미등록 상태) */
  waiting: ContentItem[];
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
    campaignType: "배송형" | "방문형" | "구매평" | "기자단" | "미션형";
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

/* ========================================
   🚪 종료/취소 캠페인 데이터 통합 (getClosedCampaigns)
   ----------------------------------------
   사용 위치
   - `CampaignCard`/콘텐츠 관련 헬퍼: 종료·취소 캠페인의 검수/완료 건수를 표시할 때 호출
   - `campaign_contents` 모듈: 종료된 캠페인 상세 화면에서 콘텐츠 탭 렌더링

   역할 요약
   - 각 타입(`delivery`, `mission`, `visit`, `review`)의 종료 캠페인 데이터를 동적 import로 모음
   - 순환 참조를 피하기 위해 `require`를 활용한 런타임 로딩과 try/catch 보호 로직을 적용
   - 동적 import/require 패턴으로 대형 데이터 파일 사이의 의존을 안전하게 해소하기
   - 일부 모듈 로드 실패 시에도 빈 배열을 반환해 UI가 깨지지 않도록 방어 코드 작성하기
*/
export function getClosedCampaigns(): CampaignWithContents[] {
  // 순환 참조를 피하기 위해 동적 import 사용
  let deliveryClosed: CampaignWithContents[] = [];
  let missionClosed: CampaignWithContents[] = [];
  let visitClosed: CampaignWithContents[] = [];
  let reviewClosed: CampaignWithContents[] = [];

  try {
    // /data/campaign/delivery/deliveryCampaigns.ts의 deliveryClosedCampaignsExtended 사용
    const closedExtended = deliveryClosedCampaignsExtended || [];
    // DeliveryCampaignDataExtended를 CampaignWithContents로 변환
    deliveryClosed = closedExtended.map((item) => {
      // detailedSchedule이 없는 경우를 대비한 기본값 설정
      const applicationStart = item.detailedSchedule?.applicationStart || "";
      const applicationEnd = item.detailedSchedule?.applicationEnd || "";
      const announcement = item.detailedSchedule?.announcement || "";
      const registrationPeriod =
        item.detailedSchedule?.registrationPeriod || "";

      // recruitment가 없는 경우를 대비한 기본값 설정
      const recruitmentCurrent = item.recruitment?.current || 0;
      const recruitmentTotal = item.recruitment?.total || 0;

      return {
        campaignInfo: {
          id: item.id,
          title: item.title,
          image: item.image,
          status: item.status || "종료",
          campaignType: "배송형" as const,
          category: item.subcategory || "",
          brandName: item.brandName || "",
          recruitmentPeriod:
            applicationStart && applicationEnd
              ? `${applicationStart} ~ ${applicationEnd}`
              : "",
          announcementDate: announcement,
          registrationPeriod: registrationPeriod,
          recruitedCount: recruitmentCurrent,
          totalCount: recruitmentTotal,
          daysLeft: 0,
          statusText: item.statusText,
        },
        contents: item.contents
          ? {
              waiting: (item.contents as any).waiting || [],
              reviewing: item.contents.reviewing || [],
              completed: item.contents.completed || [],
            }
          : { waiting: [], reviewing: [], completed: [] },
      };
    });
  } catch (error) {
    console.error("deliveryClosedCampaignsExtended 로드 실패:", error);
  }

  // missionClosedCampaigns, visitClosedCampaigns, reviewClosedCampaigns는
  // /data/campaign으로 통합되었으므로 현재는 빈 배열로 처리
  // 필요시 /data/campaign에서 closed campaigns를 export하여 사용
  missionClosed = [];
  visitClosed = [];
  reviewClosed = [];

  return [...visitClosed, ...missionClosed, ...deliveryClosed, ...reviewClosed];
}

// 하위 호환성을 위해 상수로도 export (내부적으로 함수 호출)
export const closedCampaigns: CampaignWithContents[] = getClosedCampaigns();

export function getClosedContentsById(
  campaignId: string
): ContentByTab | undefined {
  const found = closedCampaigns.find((c) => c.campaignInfo.id === campaignId);
  return found?.contents;
}

/* ========================================
   💾 localStorage 캠페인 병합 (getStoredCampaigns)
   ----------------------------------------
   사용 위치
   - `getSharedCampaigns` 내부: 사용자가 새로 등록한 캠페인을 정적 데이터와 합칠 때

   역할 요약
   - 각 타입(배송/방문/구매평/기자단/미션형)별로 저장된 캠페인을 불러오고, 공통 로직으로 병합합니다.
   - 불러온 캠페인의 상태(`status`, `daysLeft`)를 현재 날짜 기준으로 다시 계산해 최신 정보로 유지합니다.
   - localStorage CRUD 흐름 이해: 문자열 직렬화/역직렬화(JSON.parse/stringify)
   - 함수 분해 전략: 타입별 세부 처리는 `getStoredDeliveryCampaigns` 등 하위 함수에 위임하여 중복 제거
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

/* ----------------------------------------
   💾 타입별 localStorage 로더 (getStoredDeliveryCampaigns 등)
   ----------------------------------------
   사용 위치
   - `getStoredCampaigns`에서 호출하여 타입별 데이터를 수집

   역할 요약
   - 각 타입별 localStorage 키에서 캠페인을 꺼낸 뒤 상태를 재계산합니다.
   - 동적 import로 `calculateCampaignStatus`, `calculateDaysLeft`를 불러와 순환 참조 없이 로직을 공유합니다.
   - 재사용 가능한 로직 패턴: try/catch + JSON 파싱 + map으로 안전하게 데이터 변환하기
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
      announcementDate?: string,
      registrationPeriod?: string
    ) => "대기 중" | "모집 중" | "진행 중" | "종료" = () => "대기 중";
    let calculateDaysLeft: (dateString: string) => number = () => 0;

    try {
      // /data/campaign/delivery/utils.ts에서 가져오기
      const deliveryUtils = require("@/data/campaign/delivery/utils");
      calculateCampaignStatus = deliveryUtils.calculateCampaignStatus;
      calculateDaysLeft = deliveryUtils.calculateDaysLeft;
    } catch (error) {
      console.error("헬퍼 함수 로드 실패:", error);
    }

    return campaigns.map((campaign) => {
      // registrationPeriod를 전달하여 등록 기간 종료일 체크가 정확하게 이루어지도록 함
      const calculatedStatus = calculateCampaignStatus(
        campaign.campaignInfo.recruitmentPeriod,
        campaign.campaignInfo.announcementDate,
        campaign.campaignInfo.registrationPeriod
      );

      // calculateCampaignStatus는 "대기 중" | "모집 중" | "진행 중" | "종료"를 반환
      // "종료" 상태를 "마감"으로 변환 (UI 표시용)
      let updatedStatus: string = calculatedStatus;
      if (calculatedStatus === "종료") {
        updatedStatus = "마감";
      }

      // daysLeft도 재계산
      let daysLeft = 0;
      if (campaign.campaignInfo.announcementDate) {
        daysLeft =
          calculateDaysLeft(
            campaign.campaignInfo.announcementDate.split(" ")[0]
          ) || 0;
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
      announcementDate?: string,
      registrationPeriod?: string
    ) => "대기 중" | "모집 중" | "진행 중" | "종료" = () => "대기 중";

    try {
      const deliveryUtils = require("@/data/campaign/delivery/utils");
      calculateCampaignStatus = deliveryUtils.calculateCampaignStatus;
    } catch (error) {
      console.error("calculateCampaignStatus 함수 로드 실패:", error);
    }

    return campaigns.map((campaign) => {
      // registrationPeriod를 전달하여 등록 기간 종료일 체크가 정확하게 이루어지도록 함
      const calculatedStatus = calculateCampaignStatus(
        campaign.campaignInfo.recruitmentPeriod,
        campaign.campaignInfo.announcementDate,
        campaign.campaignInfo.registrationPeriod
      );

      // calculateCampaignStatus는 "대기 중" | "모집 중" | "진행 중" | "종료"를 반환
      // "종료" 상태를 "마감"으로 변환 (UI 표시용)
      let updatedStatus: string = calculatedStatus;
      if (calculatedStatus === "종료") {
        updatedStatus = "마감";
      }

      let daysLeft = 0;
      if (campaign.campaignInfo.announcementDate) {
        try {
          const deliveryUtils = require("@/data/campaign/delivery/utils");
          daysLeft =
            deliveryUtils.calculateDaysLeft(
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
      announcementDate?: string,
      registrationPeriod?: string
    ) => "대기 중" | "모집 중" | "진행 중" | "종료" = () => "대기 중";

    try {
      const deliveryUtils = require("@/data/campaign/delivery/utils");
      calculateCampaignStatus = deliveryUtils.calculateCampaignStatus;
    } catch (error) {
      console.error("calculateCampaignStatus 함수 로드 실패:", error);
    }

    return campaigns.map((campaign) => {
      // registrationPeriod를 전달하여 등록 기간 종료일 체크가 정확하게 이루어지도록 함
      const calculatedStatus = calculateCampaignStatus(
        campaign.campaignInfo.recruitmentPeriod,
        campaign.campaignInfo.announcementDate,
        campaign.campaignInfo.registrationPeriod
      );

      // calculateCampaignStatus는 "대기 중" | "모집 중" | "진행 중" | "종료"를 반환
      // "종료" 상태를 "마감"으로 변환 (UI 표시용)
      let updatedStatus: string = calculatedStatus;
      if (calculatedStatus === "종료") {
        updatedStatus = "마감";
      }

      let daysLeft = 0;
      if (campaign.campaignInfo.announcementDate) {
        try {
          const deliveryUtils = require("@/data/campaign/delivery/utils");
          daysLeft =
            deliveryUtils.calculateDaysLeft(
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
      announcementDate?: string,
      registrationPeriod?: string
    ) => "대기 중" | "모집 중" | "진행 중" | "종료" = () => "대기 중";

    try {
      const deliveryUtils = require("@/data/campaign/delivery/utils");
      calculateCampaignStatus = deliveryUtils.calculateCampaignStatus;
    } catch (error) {
      console.error("calculateCampaignStatus 함수 로드 실패:", error);
    }

    return campaigns.map((campaign) => {
      // registrationPeriod를 전달하여 등록 기간 종료일 체크가 정확하게 이루어지도록 함
      const calculatedStatus = calculateCampaignStatus(
        campaign.campaignInfo.recruitmentPeriod,
        campaign.campaignInfo.announcementDate,
        campaign.campaignInfo.registrationPeriod
      );

      // calculateCampaignStatus는 "대기 중" | "모집 중" | "진행 중" | "종료"를 반환
      // "종료" 상태를 "마감"으로 변환 (UI 표시용)
      let updatedStatus: string = calculatedStatus;
      if (calculatedStatus === "종료") {
        updatedStatus = "마감";
      }

      let daysLeft = 0;
      if (campaign.campaignInfo.announcementDate) {
        try {
          const deliveryUtils = require("@/data/campaign/delivery/utils");
          daysLeft =
            deliveryUtils.calculateDaysLeft(
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
      announcementDate?: string,
      registrationPeriod?: string
    ) => "대기 중" | "모집 중" | "진행 중" | "종료" = () => "대기 중";

    try {
      const deliveryUtils = require("@/data/campaign/delivery/utils");
      calculateCampaignStatus = deliveryUtils.calculateCampaignStatus;
    } catch (error) {
      console.error("calculateCampaignStatus 함수 로드 실패:", error);
    }

    return campaigns.map((campaign) => {
      // registrationPeriod를 전달하여 등록 기간 종료일 체크가 정확하게 이루어지도록 함
      const calculatedStatus = calculateCampaignStatus(
        campaign.campaignInfo.recruitmentPeriod,
        campaign.campaignInfo.announcementDate,
        campaign.campaignInfo.registrationPeriod
      );

      // calculateCampaignStatus는 "대기 중" | "모집 중" | "진행 중" | "종료"를 반환
      // "종료" 상태를 "마감"으로 변환 (UI 표시용)
      let updatedStatus: string = calculatedStatus;
      if (calculatedStatus === "종료") {
        updatedStatus = "마감";
      }

      let daysLeft = 0;
      if (campaign.campaignInfo.announcementDate) {
        try {
          const deliveryUtils = require("@/data/campaign/delivery/utils");
          daysLeft =
            deliveryUtils.calculateDaysLeft(
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

/* ========================================
   🔄 /data/campaign 데이터를 CampaignWithApplicants 형식으로 변환
   ----------------------------------------
   역할 요약
   - /data/campaign의 데이터를 /data/partner 형식으로 변환합니다.
   - 사용자가 보는 캠페인 목록과 파트너 관리 페이지의 캠페인 목록을 동기화합니다.
   - 같은 데이터 소스를 사용하므로 변환만 수행합니다.
*/
function convertCampaignDataToPartnerFormat(
  campaign: any
): CampaignWithApplicants {
  // 날짜 형식 변환: "2025-12-15" → "2025-12-15 ~ 2025-12-30"
  const formatRecruitmentPeriod = (start: string, end: string): string => {
    return `${start} ~ ${end}`;
  };

  // daysLeft 계산
  let calculateDaysLeft: (announcementDate: string) => number = () => 0;
  try {
    // /data/campaign/delivery/utils.ts에서 가져오기
    const deliveryUtils = require("@/data/campaign/delivery/utils");
    calculateDaysLeft = deliveryUtils.calculateDaysLeft;
  } catch (error) {
    console.error("calculateDaysLeft 함수 로드 실패:", error);
  }

  // 날짜 기반 상태 계산 (CampaignInfo 형식에 맞게)
  const calculateStatus = (
    applicationStart: string,
    applicationEnd: string,
    announcement: string,
    registrationPeriod?: string
  ): "대기 중" | "모집 중" | "선정 중" | "구매 중" | "등록 중" | "마감" => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(applicationStart);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(applicationEnd);
    endDate.setHours(0, 0, 0, 0);
    const announcementDate = new Date(announcement);
    announcementDate.setHours(0, 0, 0, 0);

    if (today < startDate) {
      return "대기 중";
    } else if (today >= startDate && today <= endDate) {
      return "모집 중";
    } else if (today > endDate && today < announcementDate) {
      return "선정 중";
    } else if (today >= announcementDate) {
      // 등록 기간이 있으면 "등록 중", 없으면 "마감"
      if (registrationPeriod) {
        const regPeriod = registrationPeriod.split(" ~ ");
        if (regPeriod.length === 2) {
          const regStart = new Date(regPeriod[0].trim());
          const regEnd = new Date(regPeriod[1].trim());
          regStart.setHours(0, 0, 0, 0);
          regEnd.setHours(0, 0, 0, 0);
          if (today >= regStart && today <= regEnd) {
            return "등록 중";
          }
        }
      }
      return "마감";
    }
    return "마감";
  };

  // detailedSchedule이 없는 경우를 대비한 기본값 설정
  const applicationStart = campaign.detailedSchedule?.applicationStart || "";
  const applicationEnd = campaign.detailedSchedule?.applicationEnd || "";
  const announcement = campaign.detailedSchedule?.announcement || "";

  const recruitmentPeriod =
    applicationStart && applicationEnd
      ? formatRecruitmentPeriod(applicationStart, applicationEnd)
      : "";

  const registrationPeriod =
    campaign.detailedSchedule?.registrationPeriod ||
    campaign.detailedSchedule?.purchasePeriod ||
    "";

  // 캠페인 타입 확인
  const campaignType = campaign.category as
    | "배송형"
    | "방문형"
    | "구매평"
    | "기자단"
    | "미션형";

  // 구매 기간 (구매평 캠페인에만 있음)
  const purchasePeriod =
    campaignType === "구매평"
      ? campaign.detailedSchedule?.purchasePeriod || ""
      : undefined;

  const status =
    applicationStart && applicationEnd && announcement
      ? calculateStatus(
          applicationStart,
          applicationEnd,
          announcement,
          registrationPeriod
        )
      : "대기 중";

  const daysLeft = announcement ? calculateDaysLeft(announcement) || 0 : 0;

  // recruitment가 없는 경우를 대비한 기본값 설정
  const recruitmentCurrent = campaign.recruitment?.current || 0;
  const recruitmentTotal = campaign.recruitment?.total || 0;

  return {
    campaignInfo: {
      id: campaign.id,
      title: campaign.title,
      image: campaign.image,
      status: status,
      campaignType: campaignType,
      category: campaign.subcategory || "",
      brandName: campaign.channel || "",
      recruitmentPeriod: recruitmentPeriod,
      announcementDate: announcement,
      purchasePeriod: purchasePeriod,
      registrationPeriod: registrationPeriod,
      recruitedCount: recruitmentCurrent,
      totalCount: recruitmentTotal,
      daysLeft: daysLeft,
    },
    applicantData: {
      applicants: [],
      selectedApplicants: [],
    },
  };
}

/* ========================================
   🌐 전체 캠페인 집계 (getSharedCampaigns)
   ----------------------------------------
   사용 위치
   - `convertToPartnerCampaigns`, `getCampaignById`, `CampaignFilterBar` 계산 로직 등 대부분의 파트너 페이지 데이터 진입점

   역할 요약
   - 타입별 정적 데이터 + /data/campaign 데이터 + 종료/취소 데이터 + localStorage 데이터를 모두 합쳐 단일 소스로 제공합니다.
   - 삭제된 캠페인 ID를 필터링하고, 순환 참조를 피하기 위해 필요한 데이터는 동적으로 import합니다.
   - 대용량 데이터 병합 패턴: spread 연산자와 map/filter를 활용해 일관된 구조 유지하기
   - 상태 추적: 삭제 ID 로그 남기기, 실패 시 콘솔 경고로 디버깅 돕기
*/
/**
 * 확장 데이터의 상태를 CampaignWithApplicants 상태로 변환하는 함수
 */
function convertExtendedStatusToCampaignStatus(
  status?: "진행 중" | "대기 중" | "모집 중" | "종료" | "취소" | "긴급",
  announcementDate?: string,
  registrationPeriod?: string
): "대기 중" | "모집 중" | "선정 중" | "구매 중" | "등록 중" | "마감" {
  if (!status) return "대기 중";

  // 상태 매핑
  switch (status) {
    case "대기 중":
      return "대기 중";
    case "모집 중":
      return "모집 중";
    case "진행 중":
      // 진행 중은 날짜를 확인하여 더 정확한 상태로 변환
      // Extended 데이터에서 "진행 중"으로 설정된 경우, 등록 기간이 있으면 "등록 중", 없으면 "마감"
      if (registrationPeriod) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const regPeriod = registrationPeriod.split(" ~ ");
        if (regPeriod.length === 2) {
          const regStart = new Date(regPeriod[0].trim());
          const regEnd = new Date(regPeriod[1].trim());
          regStart.setHours(0, 0, 0, 0);
          regEnd.setHours(0, 0, 0, 0);
          if (today >= regStart && today <= regEnd) {
            return "등록 중";
          } else if (today > regEnd) {
            return "마감";
          }
        }
      }
      // 등록 기간이 없거나 날짜 체크가 실패한 경우, announcementDate 확인
      if (announcementDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const announcement = new Date(announcementDate);
        announcement.setHours(0, 0, 0, 0);

        if (today >= announcement) {
          return "등록 중"; // announcement 이후면 등록 중으로 처리
        } else {
          return "선정 중";
        }
      }
      return "등록 중"; // 기본값으로 등록 중 반환
    case "종료":
      return "마감";
    case "취소":
      return "마감";
    case "긴급":
      return "모집 중"; // 긴급은 모집 중으로 처리
    default:
      return "대기 중";
  }
}

/**
 * Extended 캠페인 데이터를 CampaignWithApplicants로 변환하는 함수
 * 배송형, 기자단, 미션형, 구매평, 방문형 모두 처리
 */
function convertExtendedToCampaignWithApplicants(
  extended: any
): CampaignWithApplicants {
  // daysLeft 계산
  let calculateDaysLeft: (announcementDate: string) => number = () => 0;
  try {
    const deliveryUtils = require("@/data/campaign/delivery/utils");
    calculateDaysLeft = deliveryUtils.calculateDaysLeft;
  } catch (error) {
    console.error("calculateDaysLeft 함수 로드 실패:", error);
  }

  const daysLeft = extended.detailedSchedule?.announcement
    ? calculateDaysLeft(extended.detailedSchedule.announcement)
    : 0;

  // detailedSchedule이 없는 경우를 대비한 기본값 설정
  const applicationStart = extended.detailedSchedule?.applicationStart || "";
  const applicationEnd = extended.detailedSchedule?.applicationEnd || "";
  const announcement = extended.detailedSchedule?.announcement || "";
  const registrationPeriod =
    extended.detailedSchedule?.registrationPeriod ||
    extended.detailedSchedule?.purchasePeriod ||
    "";

  // 날짜 기반 상태 계산 함수 (convertCampaignDataToPartnerFormat와 동일한 로직)
  const calculateStatusFromDates = (
    applicationStart: string,
    applicationEnd: string,
    announcement: string,
    registrationPeriod?: string
  ): "대기 중" | "모집 중" | "선정 중" | "구매 중" | "등록 중" | "마감" => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!applicationStart || !applicationEnd || !announcement) {
      return "대기 중";
    }

    const startDate = new Date(applicationStart);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(applicationEnd);
    endDate.setHours(0, 0, 0, 0);
    const announcementDate = new Date(announcement);
    announcementDate.setHours(0, 0, 0, 0);

    if (today < startDate) {
      return "대기 중";
    } else if (today >= startDate && today <= endDate) {
      return "모집 중";
    } else if (today > endDate && today < announcementDate) {
      return "선정 중";
    } else if (today >= announcementDate) {
      // 등록 기간이 있으면 "등록 중", 없으면 "마감"
      if (registrationPeriod) {
        const regPeriod = registrationPeriod.split(" ~ ");
        if (regPeriod.length === 2) {
          const regStart = new Date(regPeriod[0].trim());
          const regEnd = new Date(regPeriod[1].trim());
          regStart.setHours(0, 0, 0, 0);
          regEnd.setHours(0, 0, 0, 0);
          if (today >= regStart && today <= regEnd) {
            return "등록 중";
          }
        }
      }
      return "마감";
    }
    return "마감";
  };

  // 취소 상태는 그대로 유지 (변환하지 않음)
  // 날짜 기반 계산을 우선 적용 (status 필드가 없거나 날짜 정보가 있으면 날짜 기반 계산 사용)
  const finalStatus:
    | "대기 중"
    | "모집 중"
    | "선정 중"
    | "구매 중"
    | "등록 중"
    | "마감"
    | "취소" =
    extended.status === "취소"
      ? "취소"
      : applicationStart && applicationEnd && announcement
      ? calculateStatusFromDates(
          applicationStart,
          applicationEnd,
          announcement,
          registrationPeriod
        )
      : convertExtendedStatusToCampaignStatus(
          extended.status,
          extended.detailedSchedule?.announcement,
          registrationPeriod
        );

  // category를 기반으로 campaignType 결정
  const getCampaignType = (
    category: string
  ): "배송형" | "방문형" | "구매평" | "기자단" | "미션형" => {
    if (category === "배송형") return "배송형";
    if (category === "방문형") return "방문형";
    if (category === "구매평") return "구매평";
    if (category === "기자단") return "기자단";
    if (category === "미션형") return "미션형";
    return "배송형"; // 기본값
  };

  // 캠페인 타입 확인
  const campaignType = getCampaignType(extended.category || "");

  // 구매 기간 (구매평 캠페인에만 있음)
  const purchasePeriod =
    campaignType === "구매평"
      ? extended.detailedSchedule?.purchasePeriod || ""
      : undefined;

  // recruitment가 없는 경우를 대비한 기본값 설정
  const recruitmentCurrent = extended.recruitment?.current || 0;
  const recruitmentTotal = extended.recruitment?.total || 0;

  return {
    campaignInfo: {
      id: extended.id,
      title: extended.title,
      image: extended.image,
      status: finalStatus,
      campaignType: campaignType,
      category: extended.subcategory || "",
      brandName: extended.brandName || extended.channel || "",
      recruitmentPeriod:
        applicationStart && applicationEnd
          ? `${applicationStart} ~ ${applicationEnd}`
          : "",
      announcementDate: announcement,
      purchasePeriod: purchasePeriod,
      registrationPeriod: registrationPeriod,
      recruitedCount: recruitmentCurrent,
      totalCount: recruitmentTotal,
      daysLeft: daysLeft,
      statusText: extended.statusText,
    },
    applicantData: extended.applicantData || {
      applicants: [],
      selectedApplicants: [],
    },
    contents: extended.contents,
  };
}

export function getSharedCampaigns(): CampaignWithApplicants[] {
  // /data/campaign/delivery/deliveryCampaigns.ts의 확장 데이터 사용
  const campaignDeliveryList = (deliveryCampaignsExtended || []).map(
    convertExtendedToCampaignWithApplicants
  );

  // 모든 타입은 확장 데이터 사용 (신청자 데이터 포함)
  const campaignMissionList = (missionCampaignsExtended || []).map(
    convertExtendedToCampaignWithApplicants
  );
  const campaignReviewList = (reviewCampaignsExtended || []).map(
    convertExtendedToCampaignWithApplicants
  );
  const campaignVisitList = (visitCampaignsExtended || []).map(
    convertExtendedToCampaignWithApplicants
  );
  const campaignReporterList = (reporterCampaignsExtended || []).map(
    convertExtendedToCampaignWithApplicants
  );

  // 삭제된 캠페인 ID 목록 가져오기
  const deletedCampaignIds = getDeletedCampaignIds();

  // 모든 캠페인을 병합
  // /data/campaign 데이터만 사용 (같은 데이터 소스)
  const allCampaigns = [
    // /data/campaign 데이터 (사용자가 보는 캠페인 목록과 동일한 데이터)
    ...campaignDeliveryList,
    ...campaignMissionList,
    ...campaignReviewList,
    ...campaignVisitList,
    ...campaignReporterList,
    // localStorage에서 불러온 새로 등록된 캠페인 (모든 타입, 매번 최신 데이터 반영)
    ...getStoredCampaigns(),
    // 종료/취소 데이터 (콘텐츠 전용 구조) → 관리 페이지 목록 노출을 위해 최소 정보 병합
    // 취소 상태는 원본을 유지하여 convertToPartnerCampaigns에서 취소 탭으로 분류할 수 있도록 함
    ...closedCampaigns.map((c) => ({
      campaignInfo: {
        ...c.campaignInfo,
        status: (c.campaignInfo.status === "취소"
          ? "취소"
          : c.campaignInfo.status === "종료"
          ? "마감"
          : c.campaignInfo.status === "대기 중"
          ? "대기 중"
          : c.campaignInfo.status === "모집 중"
          ? "모집 중"
          : "마감") as
          | "대기 중"
          | "모집 중"
          | "선정 중"
          | "구매 중"
          | "등록 중"
          | "마감"
          | "취소",
      },
      applicantData: { applicants: [], selectedApplicants: [] },
    })),
  ];

  // 삭제된 캠페인 ID 목록에 있는 캠페인을 필터링하여 제외
  // ID가 없거나 undefined인 캠페인도 필터링
  //
  // 중요: ID 타입 불일치 방지를 위해 문자열로 변환하여 비교
  const filteredCampaigns = allCampaigns.filter((campaign) => {
    // ID가 없거나 undefined인 캠페인 제외
    if (!campaign.campaignInfo.id || campaign.campaignInfo.id === undefined) {
      console.warn(
        `[getSharedCampaigns] ID가 없는 캠페인 필터링: 제목=${
          campaign.campaignInfo.title || "제목 없음"
        }`
      );
      return false;
    }

    const campaignId = String(campaign.campaignInfo.id);
    const isDeleted = deletedCampaignIds.includes(campaignId);
    if (isDeleted) {
      console.log(
        `[getSharedCampaigns] 삭제된 캠페인 필터링: ID=${campaignId}, 제목=${campaign.campaignInfo.title}`
      );
    }
    return !isDeleted;
  });

  if (deletedCampaignIds.length > 0) {
    console.log(
      `[getSharedCampaigns] 삭제된 캠페인 ID 목록:`,
      deletedCampaignIds
    );
    console.log(
      `[getSharedCampaigns] 필터링 전 캠페인 수: ${allCampaigns.length}, 필터링 후: ${filteredCampaigns.length}`
    );
  }

  return filteredCampaigns;
}

/**
 * 공용 캠페인 데이터 (하위 호환성을 위해 상수로도 export)
 *
 * 주의: 이 상수는 모듈 로드 시 한 번만 생성되므로, localStorage의 새 캠페인은 반영되지 않을 수 있습니다.
 * 가능하면 getSharedCampaigns() 함수를 사용하세요.
 */
export const sharedCampaigns: CampaignWithApplicants[] = getSharedCampaigns();

/* ========================================
   📋 관리용 데이터 매핑 (convertToPartnerCampaigns)
   ----------------------------------------
   사용 위치
   - `CampaignCard`, `CampaignFilterBar`, `CampaignList`, `getCampaignsByTab`, `getCampaignStats`

   역할 요약
   - `getSharedCampaigns`에서 만든 원시 데이터를 파트너 관리 UI에 맞는 `PartnerCampaign` 구조로 변환합니다.
   - 날짜 기반으로 탭 상태를 재계산하고, 신청/선정/모집 인원 수, 서브 상태, 브랜드 로고 등을 채웁니다.
   - 중복 제거(Map) 패턴: 같은 ID가 여러 소스에 있을 때 최신 데이터만 남기기
   - 도메인 규칙 반영: 날짜 계산 + 상태 매핑을 통해 UI 탭과 데이터를 동기화하는 단계 이해
*/
export const convertToPartnerCampaigns = (): PartnerCampaign[] => {
  const sharedCampaigns = getSharedCampaigns();

  // ID가 없거나 undefined인 캠페인 필터링
  const validCampaigns = sharedCampaigns.filter((campaign) => {
    if (!campaign.campaignInfo.id || campaign.campaignInfo.id === undefined) {
      console.warn(
        `[convertToPartnerCampaigns] ID가 없는 캠페인 필터링: 제목=${
          campaign.campaignInfo.title || "제목 없음"
        }`
      );
      return false;
    }
    return true;
  });

  // 중복 제거: 같은 id를 가진 캠페인 중 마지막 것만 유지
  // (localStorage의 캠페인이 나중에 오므로 우선순위를 가짐)
  const uniqueCampaignsMap = new Map<string, (typeof validCampaigns)[0]>();
  for (const campaign of validCampaigns) {
    uniqueCampaignsMap.set(campaign.campaignInfo.id, campaign);
  }
  const uniqueCampaigns = Array.from(uniqueCampaignsMap.values());

  // 취소된 캠페인 ID 목록 가져오기
  const cancelledCampaignIds = getCancelledCampaignIds();

  return uniqueCampaigns.map((campaign) => {
    // 날짜 기반으로 탭(상태) 계산
    // 사용자 요구사항에 따라 날짜 기반 계산을 우선 적용:
    // - 예정: 모집기간이 오늘 날짜 전일 때
    // - 신청: 모집기간에 오늘 날짜가 존재할 때
    // - 진행: 등록기간에 오늘 날짜가 존재할 때
    // - 종료: 등록기간까지 다 지났을 때
    let calculatedTab: "예정" | "신청" | "진행" | "종료" | "취소" = "예정";

    // 디버깅: mission_11 확인
    if (campaign.campaignInfo.id === "mission_11") {
      console.log("[convertToPartnerCampaigns] mission_11 발견:", {
        id: campaign.campaignInfo.id,
        title: campaign.campaignInfo.title,
        recruitmentPeriod: campaign.campaignInfo.recruitmentPeriod,
        status: campaign.campaignInfo.status,
      });
    }

    const campaignIdStr = String(campaign.campaignInfo.id);

    // 취소된 캠페인 ID 목록에 있으면 취소 상태로 설정
    if (cancelledCampaignIds.includes(campaignIdStr)) {
      calculatedTab = "취소";
    }
    // 취소 상태는 Extended 데이터에서 직접 설정된 경우에만 적용
    else if (campaign.campaignInfo.status === "취소") {
      calculatedTab = "취소";
    } else if (campaign.campaignInfo.statusText?.includes("연장 요청")) {
      // 연장 요청은 subStatus로 처리되므로 여기서는 진행 탭으로 설정
      calculatedTab = "진행";
    } else {
      // 날짜 기반 탭 분류 규칙 우선 적용
      // 선정 발표일을 고려하여 더 정확한 탭 분류
      const tab = getPartnerTabByDates(
        campaign.campaignInfo.recruitmentPeriod,
        campaign.campaignInfo.registrationPeriod,
        undefined, // todayInput (기본값 사용)
        campaign.campaignInfo.announcementDate // 선정 발표일 추가
      );

      if (tab !== "전체") {
        // 날짜 기반 계산 결과를 우선 사용
        calculatedTab = tab;
      } else {
        // 날짜 정보가 전혀 없거나 파싱 실패한 경우에만 Extended 데이터의 status를 보조로 사용
        // 단, 모집 기간 정보가 있는 경우는 날짜 기반으로 다시 한 번 확인
        const recruitmentPeriod = campaign.campaignInfo.recruitmentPeriod;
        const registrationPeriod = campaign.campaignInfo.registrationPeriod;

        // 모집 기간 정보가 있으면 날짜 기반으로 다시 계산 시도
        if (recruitmentPeriod || registrationPeriod) {
          // 날짜 파싱을 다시 시도하여 더 정확한 판단
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // 모집 기간 파싱
          if (recruitmentPeriod) {
            const recruitParts = recruitmentPeriod
              .split("~")
              .map((s) => s.trim());
            if (recruitParts.length === 2) {
              const recruitStartStr = recruitParts[0].split(" ")[0];
              const recruitEndStr = recruitParts[1].split(" ")[0];
              const recruitStart = new Date(recruitStartStr);
              const recruitEnd = new Date(recruitEndStr);

              if (
                !isNaN(recruitStart.getTime()) &&
                !isNaN(recruitEnd.getTime())
              ) {
                recruitStart.setHours(0, 0, 0, 0);
                recruitEnd.setHours(0, 0, 0, 0);

                // 모집 시작 전
                if (today < recruitStart) {
                  calculatedTab = "예정";
                }
                // 모집 기간 내
                else if (today >= recruitStart && today <= recruitEnd) {
                  calculatedTab = "신청";
                }
                // 모집 종료 후
                else if (today > recruitEnd) {
                  // 등록 기간 확인
                  if (registrationPeriod) {
                    const regParts = registrationPeriod
                      .split("~")
                      .map((s) => s.trim());
                    if (regParts.length === 2) {
                      const regStartStr = regParts[0].split(" ")[0];
                      const regEndStr = regParts[1].split(" ")[0];
                      const regStart = new Date(regStartStr);
                      const regEnd = new Date(regEndStr);

                      if (
                        !isNaN(regStart.getTime()) &&
                        !isNaN(regEnd.getTime())
                      ) {
                        regStart.setHours(0, 0, 0, 0);
                        regEnd.setHours(0, 0, 0, 0);

                        // 등록 시작 전 → 예정 탭
                        if (today < regStart) {
                          calculatedTab = "예정";
                        }
                        // 등록 기간 내
                        else if (today >= regStart && today <= regEnd) {
                          calculatedTab = "진행";
                        }
                        // 등록 종료 후
                        else if (today > regEnd) {
                          calculatedTab = "종료";
                        }
                      } else {
                        calculatedTab = "종료";
                      }
                    } else {
                      calculatedTab = "종료";
                    }
                  } else {
                    calculatedTab = "종료";
                  }
                }
              }
            }
          }
        }

        // 날짜 정보가 전혀 없거나 파싱이 실패한 경우에만 Extended 데이터의 status 사용
        if (calculatedTab === "예정") {
          const status = campaign.campaignInfo.status;

          if (status === "대기 중") {
            calculatedTab = "예정";
          } else if (status === "모집 중" || status === "선정 중") {
            // 날짜 정보가 없어도 status가 "모집 중"이면 신청 탭으로 분류
            // 하지만 날짜 정보가 있으면 날짜 기반 계산이 우선이므로 여기서는 날짜 정보가 없는 경우만 처리
            calculatedTab = "신청";
          } else if (status === "등록 중" || status === "구매 중") {
            calculatedTab = "진행";
          } else if (status === "마감") {
            calculatedTab = "종료";
          } else {
            // 기본값: 예정
            calculatedTab = "예정";
          }
        }
      }
    }

    // calculatedTab을 PartnerCampaign의 status로 매핑
    const calculatedStatus:
      | "대기 중"
      | "모집 중"
      | "진행 중"
      | "종료"
      | "취소" =
      calculatedTab === "예정"
        ? "대기 중"
        : calculatedTab === "신청"
        ? "모집 중"
        : calculatedTab === "진행"
        ? "진행 중"
        : calculatedTab === "종료"
        ? "종료"
        : "취소";

    const applicantsCount = campaign.applicantData?.applicants?.length ?? 0;
    const selectedCount =
      campaign.applicantData?.selectedApplicants?.length ?? 0;
    const recruitsCount = campaign.campaignInfo.totalCount ?? 0;

    // 탭별 daysLeft 재계산
    // 예정 = 예정일(모집 시작일) 카운트
    // 신청 = 신청일(모집 종료일 또는 선정 발표일) 카운트
    // 진행 = 등록기간 종료일 카운트
    let calculatedDaysLeft = campaign.campaignInfo.daysLeft;

    let calculateDaysLeft: (dateString: string) => number = () => 0;
    try {
      const deliveryUtils = require("@/data/campaign/delivery/utils");
      calculateDaysLeft = deliveryUtils.calculateDaysLeft;
    } catch (error) {
      console.error("calculateDaysLeft 함수 로드 실패:", error);
    }

    if (calculatedTab === "예정") {
      // 예정 탭: 모집 시작일까지의 카운트
      const recruitmentPeriod = campaign.campaignInfo.recruitmentPeriod;
      if (recruitmentPeriod) {
        const recruitParts = recruitmentPeriod.split("~").map((s) => s.trim());
        if (recruitParts.length === 2) {
          const recruitStartStr = recruitParts[0].split(" ")[0];
          if (recruitStartStr) {
            calculatedDaysLeft = calculateDaysLeft(recruitStartStr);
          }
        }
      }
    } else if (calculatedTab === "신청") {
      // 신청 탭: 모집 종료일 또는 선정 발표일까지의 카운트
      const recruitmentPeriod = campaign.campaignInfo.recruitmentPeriod;
      const announcementDate = campaign.campaignInfo.announcementDate;

      // 선정 발표일이 있으면 선정 발표일까지, 없으면 모집 종료일까지
      if (announcementDate) {
        const announcementDateStr = announcementDate.split(" ")[0];
        if (announcementDateStr) {
          calculatedDaysLeft = calculateDaysLeft(announcementDateStr);
        }
      } else if (recruitmentPeriod) {
        const recruitParts = recruitmentPeriod.split("~").map((s) => s.trim());
        if (recruitParts.length === 2) {
          const recruitEndStr = recruitParts[1].split(" ")[0];
          if (recruitEndStr) {
            calculatedDaysLeft = calculateDaysLeft(recruitEndStr);
          }
        }
      }
    } else if (calculatedTab === "진행") {
      // 진행 탭: 등록기간 종료일까지의 카운트
      const registrationPeriod = campaign.campaignInfo.registrationPeriod;
      if (registrationPeriod) {
        const regParts = registrationPeriod.split("~").map((s) => s.trim());
        if (regParts.length === 2) {
          const regEndStr = regParts[1].split(" ")[0];
          if (regEndStr) {
            calculatedDaysLeft = calculateDaysLeft(regEndStr);
          }
        }
      }
    }
    // 종료/취소 탭은 daysLeft를 그대로 사용 (0 또는 음수)

    return {
      id: campaign.campaignInfo.id,
      title: campaign.campaignInfo.title,
      image: campaign.campaignInfo.image,
      campaignType: campaign.campaignInfo.campaignType as
        | "배송형"
        | "방문형"
        | "구매평"
        | "기자단"
        | "미션형",
      status: calculatedStatus,
      category: campaign.campaignInfo.category || "",
      brandName: campaign.campaignInfo.brandName || "",
      recruitmentPeriod: campaign.campaignInfo.recruitmentPeriod,
      announcementDate: campaign.campaignInfo.announcementDate,
      registrationPeriod: campaign.campaignInfo.registrationPeriod,
      recruitedCount: applicantsCount,
      totalCount: campaign.campaignInfo.totalCount,
      applicants: applicantsCount,
      recruits: recruitsCount,
      selected: selectedCount,
      daysLeft: calculatedDaysLeft,
      statusText:
        campaign.campaignInfo.statusText ||
        getStatusMessage(
          calculatedTab, // 탭 이름("예정", "신청", "진행", "종료", "취소")을 전달
          calculatedDaysLeft
        ),
      brandLogo: getBrandLogo(
        campaign.campaignInfo.brandName || "기본",
        campaign.campaignInfo.campaignType
      ),
      subStatus: (() => {
        const baseSubStatus = getSubStatus(
          calculatedTab,
          applicantsCount,
          selectedCount
        );

        // 연장 요청한 리뷰어가 있는지 확인
        // contents.waiting에 extension_request_reason이 있는 항목이 있는지 확인
        const hasExtensionRequest =
          campaign.contents?.waiting?.some(
            (item) => item.extension_request_reason
          ) || false;

        // 등록 기간이 끝났는지 확인
        const registrationPeriod = campaign.campaignInfo.registrationPeriod;
        let isRegistrationPeriodEnded = false;
        if (registrationPeriod) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const regParts = registrationPeriod.split("~").map((s) => s.trim());
          if (regParts.length === 2) {
            const regEndStr = regParts[1].split(" ")[0];
            const regEnd = new Date(regEndStr);
            if (!isNaN(regEnd.getTime())) {
              regEnd.setHours(0, 0, 0, 0);
              isRegistrationPeriodEnded = today > regEnd;
            }
          }
        }

        // 연장 요청 탭에 표시될 캠페인들에 extension_request 추가
        // ✅ 조건: 등록 기간이 끝났고 연장 요청한 리뷰어가 있는 경우만
        if (isRegistrationPeriodEnded && hasExtensionRequest) {
          return `${baseSubStatus},extension_request`;
        }
        return baseSubStatus;
      })(),
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

/* ========================================
   🔎 단일 캠페인 조회 (getCampaignById)
   ----------------------------------------
   사용 위치
   - 신청내역 상세 페이지, 관리 모달(`CampaignManagementModal`), 카드 액션 등 캠페인 상세 정보가 필요할 때

   역할 요약
   - localStorage에 저장된 최신 캠페인을 우선 탐색한 뒤, 정적 데이터에서 동일 ID를 찾습니다.
   - 디버깅을 위해 로그를 남겨 어떤 소스에서 데이터를 가져왔는지 확인할 수 있도록 설계했습니다.
   - 검색 우선순위 전략: 사용자 생성 데이터(localStorage)를 공식 데이터보다 우선시하기
   - 배열 `find`와 조건 로그를 활용해 디버깅 친화적인 데이터 탐색 구현하기
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
        applicantsCount: campaign.applicantData?.applicants?.length ?? 0,
      });
    }
    return matches;
  });

  if (!found) {
    console.warn(`[getCampaignById] 캠페인을 찾을 수 없습니다: ${id}`);
  }

  return found || null;
};

/* ========================================
   🗂️ 탭별 캠페인 필터 (getCampaignsByTab)
   ----------------------------------------
   사용 위치
   - `/partner/campaign_management` 페이지 탭 전환 시 목록 데이터를 공급

   역할 요약
   - `convertToPartnerCampaigns` 결과에서 탭 조건에 맞는 캠페인만 필터링합니다.
   - `switch` 문으로 상태별 분기를 명시해 가독성을 높였습니다.
   - 필터링 체인 구성: 가공된 데이터를 뷰 요구사항에 맞춰 재사용하는 방법
*/
export const getCampaignsByTab = (tab: string): PartnerCampaign[] => {
  const partnerCampaigns = convertToPartnerCampaigns();

  switch (tab) {
    case "전체":
      /**
       * 전체 탭: 모든 캠페인 표시
       *
       * 정렬: 최신순 (초기 페이지 로드 시)
       * - 모집 시작일(recruitmentPeriod의 시작일) 기준으로 정렬 (최신순: 내림차순)
       * - 모집 시작일이 같거나 없으면 id 기준으로 정렬
       */
      /**
       * 전체 탭: 모든 캠페인 표시 (연장 요청 탭 전용 캠페인 제외)
       *
       * 제외 조건:
       * - "등록 기한 연장 요청" 버튼이 있는 캠페인은 연장 요청 탭에서만 표시
       */
      return [...partnerCampaigns]
        .filter(
          (campaign) => !campaign.subStatus?.includes("extension_request")
        )
        .sort((a, b) => {
          // 모집 시작일 추출
          const getRecruitmentStartDate = (period: string): number => {
            if (!period) return 0;
            const parts = period.split("~").map((s) => s.trim());
            if (parts.length >= 1) {
              const startStr = parts[0].split(" ")[0];
              const date = new Date(startStr);
              return isNaN(date.getTime()) ? 0 : date.getTime();
            }
            return 0;
          };

          const aDate = getRecruitmentStartDate(a.recruitmentPeriod);
          const bDate = getRecruitmentStartDate(b.recruitmentPeriod);

          if (aDate !== bDate) {
            return bDate - aDate; // 최신순 (내림차순)
          }

          // 모집 시작일이 같거나 없으면 id 기준으로 정렬
          return b.id.localeCompare(a.id);
        });
    case "예정":
      /**
       * 예정 탭: 모집 기간이 시작되지 않은 캠페인
       *
       * 필터링 조건:
       * - 상태가 "대기 중"인 캠페인
       * - 모집 시작일이 오늘 날짜보다 미래인 캠페인
       *
       * 제외 조건:
       * - "등록 기한 연장 요청" 버튼이 있는 캠페인은 연장 요청 탭으로 이동
       */
      return partnerCampaigns.filter(
        (campaign) =>
          campaign.status === "대기 중" &&
          !campaign.subStatus?.includes("extension_request")
      );
    case "신청":
      /**
       * 신청 탭: 모집 기간 중이며 신청 중인 캠페인 (모집 중)
       *
       * 필터링 조건:
       * - 상태가 "모집 중"인 캠페인
       * - 선정 발표일 이전인 캠페인
       */
      return partnerCampaigns.filter((campaign) => {
        // "등록 기한 연장 요청" 버튼이 있는 캠페인은 연장 요청 탭으로 이동
        if (campaign.subStatus?.includes("extension_request")) {
          return false;
        }

        // 캠페인 상태가 '모집 중'이어야 함
        if (campaign.status !== "모집 중") {
          return false;
        }

        // 선정 발표일 이전이어야 함
        if (campaign.announcementDate) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const announcementDateStr = campaign.announcementDate
            .split(" ")[0]
            ?.trim();
          if (announcementDateStr) {
            const announcementDate = new Date(announcementDateStr);
            if (!isNaN(announcementDate.getTime())) {
              announcementDate.setHours(0, 0, 0, 0);
              // 선정 발표일 이전인 경우만 포함
              return today < announcementDate;
            }
          }
        }

        // 선정 발표일 정보가 없으면 상태만 확인
        return true;
      });
    case "진행":
      /**
       * 진행 탭 필터링
       *
       * 포함되는 상태:
       * - "선정 중": 모집 기간은 지났고, 선정 발표일은 아직 안 지난 캠페인
       *   → 버튼 1개: "당첨자 선정"
       * - "등록 중": 선정 발표일은 지났고, 등록 기간인 캠페인
       *   → 버튼 2개: "콘텐츠 확인", "콘텐츠 확인 완료"
       * - "진행 중": 기존 진행 중 상태 (하위 호환성)
       *
       * 제외 조건:
       * - 등록 기간이 끝났고 연장 요청한 리뷰어가 있는 캠페인은 연장 요청 탭으로 이동
       */
      return partnerCampaigns.filter((campaign) => {
        // "등록 기한 연장 요청" 버튼이 있는 캠페인은 진행 탭에서 제외
        // subStatus에 extension_request가 포함되어 있으면 연장 요청 탭으로 이동
        if (campaign.subStatus?.includes("extension_request")) {
          return false;
        }

        // 선정 중 상태는 항상 진행 탭에 포함
        if (campaign.status === "선정 중") {
          return true;
        }

        // 등록 중 또는 진행 중 상태인 경우
        if (campaign.status === "등록 중" || campaign.status === "진행 중") {
          // 등록 기간이 아직 끝나지 않았거나, 연장 요청한 리뷰어가 없으면 진행 탭에 포함
          return true;
        }

        return false;
      });
    case "종료":
      /**
       * 종료 탭: 등록 기간까지 지난 캠페인들 (마감)
       *
       * 필터링 조건:
       * - 상태가 "종료" 또는 "마감"인 캠페인
       * - 등록 기간 종료일이 오늘 날짜보다 과거인 캠페인
       *
       * 제외 조건:
       * - "등록 기한 연장 요청" 버튼이 있는 캠페인은 연장 요청 탭으로 이동
       */
      return partnerCampaigns.filter(
        (campaign) =>
          (campaign.status === "종료" || campaign.status === "마감") &&
          !campaign.subStatus?.includes("extension_request")
      );
    case "취소":
      /**
       * 취소 탭: 취소된 캠페인
       *
       * 제외 조건:
       * - "등록 기한 연장 요청" 버튼이 있는 캠페인은 연장 요청 탭으로 이동
       */
      return partnerCampaigns.filter(
        (campaign) =>
          campaign.status === "취소" &&
          !campaign.subStatus?.includes("extension_request")
      );
    case "연장 요청":
      /**
       * 연장 요청 탭 필터링
       *
       * 포함되는 조건:
       * - 등록 기간이 끝났고
       * - 연장 요청한 리뷰어가 있는 캠페인
       *   (contents.waiting에 extension_request_reason이 있는 항목이 있는 경우)
       *
       * 주의:
       * - 등록 기간이 아직 끝나지 않았는데 연장 요청한 리뷰어가 있는 캠페인은 진행 탭에 표시됨
       * - 등록 기간이 끝나야만 연장 요청 탭으로 이동
       */
      return partnerCampaigns.filter((campaign) => {
        // subStatus에 extension_request가 포함되어 있어야 함
        if (!campaign.subStatus?.includes("extension_request")) {
          return false;
        }

        // 등록 기간이 끝났는지 확인
        const registrationPeriod = campaign.registrationPeriod;
        if (registrationPeriod) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const regParts = registrationPeriod.split("~").map((s) => s.trim());
          if (regParts.length === 2) {
            const regEndStr = regParts[1].split(" ")[0];
            const regEnd = new Date(regEndStr);
            if (!isNaN(regEnd.getTime())) {
              regEnd.setHours(0, 0, 0, 0);
              // 등록 기간이 끝났는지 확인
              return today > regEnd;
            }
          }
        }

        // 등록 기간 정보가 없으면 subStatus만 확인
        return true;
      });
    default:
      return partnerCampaigns;
  }
};

/* ========================================
   📈 캠페인 통계 집계 (getCampaignStats)
   ----------------------------------------
   사용 위치
   - 관리 대시보드 상단 통계 위젯, 탭별 배지 숫자 등에 사용

   역할 요약
   - `convertToPartnerCampaigns` 결과를 기반으로 상태별 개수를 계산해 간단한 통계 객체를 반환합니다.
   - 파생 데이터 만들기: 이미 가공된 배열을 활용해 통계 값을 산출하는 방법
*/
export const getCampaignStats = () => {
  // getCampaignsByTab을 재사용하여 통계 계산
  // 이렇게 하면 필터링 로직과 통계 계산 로직이 항상 일치합니다
  const 전체 = getCampaignsByTab("전체").length;
  const 예정 = getCampaignsByTab("예정").length;
  const 신청 = getCampaignsByTab("신청").length;
  const 진행 = getCampaignsByTab("진행").length;
  const 종료 = getCampaignsByTab("종료").length;
  const 취소 = getCampaignsByTab("취소").length;
  const 연장요청 = getCampaignsByTab("연장 요청").length;

  return {
    전체,
    예정,
    신청,
    진행,
    종료,
    취소,
    "연장 요청": 연장요청,
    패널티: 0,
  };
};

/**
 * 정적 데이터만으로 초기 통계 계산 (빠른 렌더링용)
 *
 * 설명:
 * - localStorage를 제외한 정적 데이터만으로 통계를 계산합니다.
 * - 초기 렌더링 시 깜빡임을 방지하기 위해 사용됩니다.
 * - localStorage 데이터는 나중에 업데이트됩니다.
 */
export const getInitialCampaignStats = (): PartnerCampaignStats => {
  // 정적 데이터만 사용 (localStorage 제외)
  // /data/campaign 데이터를 변환하여 사용 (같은 데이터 소스)
  const campaignDeliveryList = (campaignDeliveryCampaigns || []).map(
    convertCampaignDataToPartnerFormat
  );
  const campaignMissionList = (campaignMissionCampaigns || []).map(
    convertCampaignDataToPartnerFormat
  );
  const campaignReviewList = (campaignReviewCampaigns || []).map(
    convertCampaignDataToPartnerFormat
  );
  const campaignVisitList = (campaignVisitCampaigns || []).map(
    convertCampaignDataToPartnerFormat
  );
  const campaignReporterList = (campaignReporterCampaigns || []).map(
    convertCampaignDataToPartnerFormat
  );

  // 정적 데이터만 병합 (localStorage 제외)
  // /data/campaign 데이터만 사용 (같은 데이터 소스)
  const staticCampaigns = [
    ...campaignDeliveryList,
    ...campaignMissionList,
    ...campaignReviewList,
    ...campaignVisitList,
    ...campaignReporterList,
    // 종료/취소 데이터
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

  // convertToPartnerCampaigns와 동일한 로직으로 변환
  const uniqueCampaignsMap = new Map<string, (typeof staticCampaigns)[0]>();
  for (const campaign of staticCampaigns) {
    uniqueCampaignsMap.set(campaign.campaignInfo.id, campaign);
  }
  const uniqueCampaigns = Array.from(uniqueCampaignsMap.values());

  const partnerCampaigns = uniqueCampaigns.map((campaign) => {
    let calculatedTab: "예정" | "신청" | "진행" | "종료" | "취소" = "예정";

    // Extended 데이터의 status를 우선 사용
    const status = campaign.campaignInfo.status;

    if (status === "취소" || status === "마감") {
      calculatedTab = "취소";
    } else if (status === "대기 중") {
      calculatedTab = "예정";
    } else if (status === "모집 중" || status === "선정 중") {
      calculatedTab = "신청";
    } else if (status === "등록 중" || status === "구매 중") {
      calculatedTab = "진행";
    } else if (status === "종료") {
      calculatedTab = "종료";
    } else {
      // 상태가 명확하지 않으면 날짜 기반 탭 분류 규칙 적용
      const tab = getPartnerTabByDates(
        campaign.campaignInfo.recruitmentPeriod,
        campaign.campaignInfo.registrationPeriod
      );

      if (tab !== "전체") {
        calculatedTab = tab;
      } else {
        // 탭 판단이 어렵다면 기본값으로 예정 반환
        calculatedTab = "예정";
      }
    }

    // calculatedTab을 PartnerCampaign의 status로 매핑
    const calculatedStatus:
      | "대기 중"
      | "모집 중"
      | "진행 중"
      | "종료"
      | "취소" =
      calculatedTab === "예정"
        ? "대기 중"
        : calculatedTab === "신청"
        ? "모집 중"
        : calculatedTab === "진행"
        ? "진행 중"
        : calculatedTab === "종료"
        ? "종료"
        : "취소";

    return {
      id: campaign.campaignInfo.id,
      status: calculatedStatus,
      subStatus: (() => {
        // 연장 요청 탭을 위한 subStatus 추가
        if (
          campaign.campaignInfo.id === "delivery_2" ||
          campaign.campaignInfo.id === "mission_2" ||
          campaign.campaignInfo.id === "reporter_2" ||
          campaign.campaignInfo.id === "review_2" ||
          campaign.campaignInfo.id === "visit_2" ||
          campaign.campaignInfo.statusText?.includes("연장 요청")
        ) {
          return "extension_request";
        }
        return undefined;
      })(),
    };
  });

  return {
    전체: partnerCampaigns.length,
    예정: partnerCampaigns.filter((c) => c.status === "대기 중").length,
    신청: partnerCampaigns.filter((c) => c.status === "모집 중").length,
    진행: partnerCampaigns.filter((c) => c.status === "진행 중").length,
    종료: partnerCampaigns.filter((c) => c.status === "종료").length,
    취소: partnerCampaigns.filter((c) => c.status === "취소").length,
    "연장 요청": partnerCampaigns.filter(
      (c) => c.subStatus?.includes("extension_request") || false
    ).length,
    패널티: 0,
  };
};

/* ----------------------------------------
   🧾 삭제 ID 관리 (getDeletedCampaignIds / addDeletedCampaignId)
   ----------------------------------------
   사용 위치
   - `getSharedCampaigns`: 삭제된 캠페인을 최종 목록에서 제외
   - `deleteCampaign`: 삭제 실행 시 목록에 ID 추가

   역할 요약
   - localStorage에 저장된 삭제 ID 배열을 가져오고, 필요 시 문자열로 정규화합니다.
   - 중복 없이 ID를 추가해 정적 데이터에 있는 캠페인도 숨길 수 있도록 지원합니다.
   - 상태 추적을 위한 별도 저장소 설계: 실제 데이터 삭제 + 숨김 처리를 분리하는 이유 이해하기
*/
function getDeletedCampaignIds(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem("deletedCampaignIds");
    if (!stored) {
      console.log("[getDeletedCampaignIds] 삭제 목록이 없음");
      return [];
    }

    const deletedIds: string[] = JSON.parse(stored);
    const result = Array.isArray(deletedIds)
      ? deletedIds.map((id) => String(id))
      : [];
    console.log(`[getDeletedCampaignIds] 삭제된 캠페인 ID 목록:`, result);
    return result;
  } catch (error) {
    console.error("삭제된 캠페인 ID 목록 불러오기 실패:", error);
    return [];
  }
}

/**
 * 삭제된 캠페인 ID 목록에 추가하는 함수
 *
 * @param campaignId - 삭제할 캠페인 ID (문자열로 변환됨)
 */
function addDeletedCampaignId(campaignId: string): void {
  if (typeof window === "undefined") return;

  try {
    const deletedIds = getDeletedCampaignIds();
    // ID를 문자열로 확실히 변환하여 비교
    const campaignIdStr = String(campaignId);

    if (!deletedIds.includes(campaignIdStr)) {
      deletedIds.push(campaignIdStr);
      localStorage.setItem("deletedCampaignIds", JSON.stringify(deletedIds));
      console.log(
        `[addDeletedCampaignId] 삭제 목록에 추가됨: ID=${campaignIdStr}, 현재 삭제 목록:`,
        deletedIds
      );
    } else {
      console.log(
        `[addDeletedCampaignId] 이미 삭제 목록에 있음: ID=${campaignIdStr}`
      );
    }
  } catch (error) {
    console.error("삭제된 캠페인 ID 추가 실패:", error);
  }
}

/* ----------------------------------------
   🧾 취소 ID 관리 (getCancelledCampaignIds / addCancelledCampaignId)
   ----------------------------------------
   사용 위치
   - `convertToPartnerCampaigns`: 취소된 캠페인의 상태를 "취소"로 변경
   - `cancelCampaign`: 취소 실행 시 목록에 ID 추가

   역할 요약
   - localStorage에 저장된 취소 ID 배열을 가져오고, 필요 시 문자열로 정규화합니다.
   - 중복 없이 ID를 추가해 정적 데이터에 있는 캠페인도 취소 처리할 수 있도록 지원합니다.
*/
function getCancelledCampaignIds(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem("cancelledCampaignIds");
    if (!stored) {
      console.log("[getCancelledCampaignIds] 취소 목록이 없음");
      return [];
    }

    const cancelledIds: string[] = JSON.parse(stored);
    const result = Array.isArray(cancelledIds)
      ? cancelledIds.map((id) => String(id))
      : [];
    console.log(`[getCancelledCampaignIds] 취소된 캠페인 ID 목록:`, result);
    return result;
  } catch (error) {
    console.error("취소된 캠페인 ID 목록 불러오기 실패:", error);
    return [];
  }
}

/**
 * 취소된 캠페인 ID 목록에 추가하는 함수
 *
 * @param campaignId - 취소할 캠페인 ID (문자열로 변환됨)
 */
function addCancelledCampaignId(campaignId: string): void {
  if (typeof window === "undefined") return;

  try {
    const cancelledIds = getCancelledCampaignIds();
    // ID를 문자열로 확실히 변환하여 비교
    const campaignIdStr = String(campaignId);

    if (!cancelledIds.includes(campaignIdStr)) {
      cancelledIds.push(campaignIdStr);
      localStorage.setItem(
        "cancelledCampaignIds",
        JSON.stringify(cancelledIds)
      );
      console.log(
        `[addCancelledCampaignId] 취소 목록에 추가됨: ID=${campaignIdStr}, 현재 취소 목록:`,
        cancelledIds
      );
    } else {
      console.log(
        `[addCancelledCampaignId] 이미 취소 목록에 있음: ID=${campaignIdStr}`
      );
    }
  } catch (error) {
    console.error("취소된 캠페인 ID 추가 실패:", error);
  }
}

/**
 * 취소된 캠페인 ID 목록에서 제거하는 함수 (테스트/개발용)
 *
 * @param campaignId - 취소 해제할 캠페인 ID
 */
export function removeCancelledCampaignId(campaignId: string): void {
  if (typeof window === "undefined") return;

  try {
    const cancelledIds = getCancelledCampaignIds();
    const campaignIdStr = String(campaignId);
    const filteredIds = cancelledIds.filter((id) => id !== campaignIdStr);

    if (filteredIds.length < cancelledIds.length) {
      localStorage.setItem("cancelledCampaignIds", JSON.stringify(filteredIds));
      console.log(
        `[removeCancelledCampaignId] 취소 목록에서 제거됨: ID=${campaignIdStr}`
      );
    }
  } catch (error) {
    console.error("취소된 캠페인 ID 제거 실패:", error);
  }
}

/* ========================================
   🗑️ 캠페인 삭제 처리 (deleteCampaign)
   ----------------------------------------
   사용 위치
   - `CampaignCard` 삭제 버튼: 파트너가 등록한 캠페인을 목록에서 제거할 때 호출

   역할 요약
   - 캠페인 타입에 따라 올바른 localStorage 키를 찾아 해당 캠페인을 제거합니다.
   - 정적 더미 데이터에 포함된 캠페인까지 숨길 수 있도록 삭제 ID 목록을 별도로 관리합니다.
   - 브라우저 전용 로직 보호: SSR/빌드 환경에서 `window`가 없는 경우 early return 처리
   - 데이터 일관성 유지: localStorage 실제 삭제 + 삭제 ID 기록을 함께 수행하는 이유 이해하기
*/
export function deleteCampaign(
  campaignId: string,
  campaignType: "배송형" | "방문형" | "구매평" | "기자단" | "미션형"
): boolean {
  if (typeof window === "undefined") {
    console.error("localStorage는 브라우저 환경에서만 사용할 수 있습니다.");
    return false;
  }

  try {
    // 캠페인 타입에 따라 localStorage 키 결정
    let storageKey: string;
    switch (campaignType) {
      case "배송형":
        storageKey = "deliveryCampaigns";
        break;
      case "방문형":
        storageKey = "visitCampaigns";
        break;
      case "구매평":
        storageKey = "reviewCampaigns";
        break;
      case "기자단":
        storageKey = "reporterCampaigns";
        break;
      case "미션형":
        storageKey = "missionCampaigns";
        break;
      default:
        console.error(`알 수 없는 캠페인 타입: ${campaignType}`);
        return false;
    }

    // 1. localStorage에서 해당 타입의 캠페인 배열 불러오기
    const stored = localStorage.getItem(storageKey);
    let deletedFromLocalStorage = false;

    if (stored) {
      const campaigns: CampaignWithApplicants[] = JSON.parse(stored);
      if (Array.isArray(campaigns)) {
        // 삭제할 캠페인을 제외한 나머지 캠페인만 필터링
        const filteredCampaigns = campaigns.filter(
          (campaign) => campaign.campaignInfo.id !== campaignId
        );

        // 삭제 전후 개수 비교하여 실제로 삭제되었는지 확인
        if (filteredCampaigns.length < campaigns.length) {
          // 필터링된 배열을 다시 localStorage에 저장
          localStorage.setItem(storageKey, JSON.stringify(filteredCampaigns));
          deletedFromLocalStorage = true;
          console.log(
            `localStorage에서 캠페인 삭제 완료: ID=${campaignId}, 타입=${campaignType}, 남은 캠페인 수=${filteredCampaigns.length}`
          );
        }
      }
    }

    // 2. 삭제된 캠페인 ID 목록에 추가 (정적 데이터에 있는 캠페인도 제외하기 위해)
    // 이렇게 하면 localStorage에 없는 정적 데이터의 캠페인도 목록에서 제외됩니다
    addDeletedCampaignId(campaignId);

    console.log(
      `캠페인 삭제 처리 완료: ID=${campaignId}, 타입=${campaignType}, localStorage에서 삭제=${deletedFromLocalStorage}, 삭제 목록에 추가됨`
    );
    return true;
  } catch (error) {
    console.error("캠페인 삭제 중 오류 발생:", error);
    return false;
  }
}

/* ========================================
   ❌ 캠페인 취소 처리 (cancelCampaign)
   ----------------------------------------
   사용 위치
   - `CampaignManagementModal` 취소 버튼: 파트너가 신청 중인 캠페인을 취소할 때 호출

   역할 요약
   - 캠페인을 완전히 삭제하지 않고 상태를 "취소"로 변경합니다.
   - 취소된 캠페인 ID 목록에 추가하여 convertToPartnerCampaigns에서 취소 탭에 표시되도록 합니다.
   - 브라우저 전용 로직 보호: SSR/빌드 환경에서 `window`가 없는 경우 early return 처리
   - 이미 취소된 캠페인인지 확인하여 중복 취소를 방지합니다.

   반환값:
   - { success: true }: 취소 성공
   - { success: false, error: "ALREADY_CANCELLED" }: 이미 취소된 캠페인
   - { success: false, error: "SERVER_ERROR" }: 서버 오류 (일반 오류)
*/
export function cancelCampaign(
  campaignId: string,
  campaignType: "배송형" | "방문형" | "구매평" | "기자단" | "미션형"
): { success: boolean; error?: string } {
  if (typeof window === "undefined") {
    console.error("localStorage는 브라우저 환경에서만 사용할 수 있습니다.");
    return { success: false, error: "SERVER_ERROR" };
  }

  try {
    // 이미 취소된 캠페인인지 확인
    const cancelledIds = getCancelledCampaignIds();
    const campaignIdStr = String(campaignId);

    if (cancelledIds.includes(campaignIdStr)) {
      console.log(
        `[cancelCampaign] 이미 취소된 캠페인: ID=${campaignIdStr}, 타입=${campaignType}`
      );
      return { success: false, error: "ALREADY_CANCELLED" };
    }

    // 캠페인 타입에 따라 localStorage 키 결정
    let storageKey: string;
    switch (campaignType) {
      case "배송형":
        storageKey = "deliveryCampaigns";
        break;
      case "방문형":
        storageKey = "visitCampaigns";
        break;
      case "구매평":
        storageKey = "reviewCampaigns";
        break;
      case "기자단":
        storageKey = "reporterCampaigns";
        break;
      case "미션형":
        storageKey = "missionCampaigns";
        break;
      default:
        console.error(`알 수 없는 캠페인 타입: ${campaignType}`);
        return { success: false, error: "SERVER_ERROR" };
    }

    // localStorage에서 해당 타입의 캠페인 배열 불러오기 (있는 경우 상태 업데이트)
    const stored = localStorage.getItem(storageKey);
    let updatedInLocalStorage = false;

    if (stored) {
      const campaigns: CampaignWithApplicants[] = JSON.parse(stored);
      if (Array.isArray(campaigns)) {
        // 취소할 캠페인을 찾아서 상태를 "취소"로 변경
        const updatedCampaigns = campaigns.map((campaign) => {
          if (campaign.campaignInfo.id === campaignId) {
            updatedInLocalStorage = true;
            return {
              ...campaign,
              campaignInfo: {
                ...campaign.campaignInfo,
                status: "취소" as const,
              },
            };
          }
          return campaign;
        });

        // 변경된 배열을 다시 localStorage에 저장
        localStorage.setItem(storageKey, JSON.stringify(updatedCampaigns));
        console.log(
          `localStorage에서 캠페인 상태를 취소로 변경 완료: ID=${campaignId}, 타입=${campaignType}`
        );
      }
    }

    // 취소된 캠페인 ID 목록에 추가 (정적 데이터에 있는 캠페인도 취소 처리하기 위해)
    addCancelledCampaignId(campaignIdStr);

    console.log(
      `캠페인 취소 처리 완료: ID=${campaignId}, 타입=${campaignType}, localStorage 업데이트=${updatedInLocalStorage}, 취소 목록에 추가됨`
    );
    return { success: true };
  } catch (error) {
    console.error("캠페인 취소 중 오류 발생:", error);
    return { success: false, error: "SERVER_ERROR" };
  }
}
