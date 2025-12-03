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

import type { PartnerCampaign } from "@/types/partner/partner";
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
   - 서버가 아닌 로컬 저장소를 사용하는 개발용·학습용 환경에서 데이터 일관성을 유지하는 방법
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

/* ========================================
   🌐 전체 캠페인 집계 (getSharedCampaigns)
   ----------------------------------------
   사용 위치
   - `convertToPartnerCampaigns`, `getCampaignById`, `CampaignFilterBar` 계산 로직 등 대부분의 파트너 페이지 데이터 진입점

   역할 요약
   - 타입별 정적 데이터 + 종료/취소 데이터 + localStorage 데이터를 모두 합쳐 단일 소스로 제공합니다.
   - 삭제된 캠페인 ID를 필터링하고, 순환 참조를 피하기 위해 필요한 데이터는 동적으로 import합니다.
   - 대용량 데이터 병합 패턴: spread 연산자와 map/filter를 활용해 일관된 구조 유지하기
   - 상태 추적: 삭제 ID 로그 남기기, 실패 시 콘솔 경고로 디버깅 돕기
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

  // 삭제된 캠페인 ID 목록 가져오기
  const deletedCampaignIds = getDeletedCampaignIds();

  // 모든 캠페인을 병합
  const allCampaigns = [
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

  // 삭제된 캠페인 ID 목록에 있는 캠페인을 필터링하여 제외
  // 
  // 중요: ID 타입 불일치 방지를 위해 문자열로 변환하여 비교
  const filteredCampaigns = allCampaigns.filter((campaign) => {
    const campaignId = String(campaign.campaignInfo.id);
    const isDeleted = deletedCampaignIds.includes(campaignId);
    if (isDeleted) {
      console.log(`[getSharedCampaigns] 삭제된 캠페인 필터링: ID=${campaignId}, 제목=${campaign.campaignInfo.title}`);
    }
    return !isDeleted;
  });

  if (deletedCampaignIds.length > 0) {
    console.log(`[getSharedCampaigns] 삭제된 캠페인 ID 목록:`, deletedCampaignIds);
    console.log(`[getSharedCampaigns] 필터링 전 캠페인 수: ${allCampaigns.length}, 필터링 후: ${filteredCampaigns.length}`);
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
  
  // 중복 제거: 같은 id를 가진 캠페인 중 마지막 것만 유지
  // (localStorage의 캠페인이 나중에 오므로 우선순위를 가짐)
  const uniqueCampaignsMap = new Map<string, typeof sharedCampaigns[0]>();
  for (const campaign of sharedCampaigns) {
    uniqueCampaignsMap.set(campaign.campaignInfo.id, campaign);
  }
  const uniqueCampaigns = Array.from(uniqueCampaignsMap.values());
  
  return uniqueCampaigns.map((campaign) => {
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

    const applicantsCount = campaign.applicantData.applicants.length;
    const selectedCount = campaign.applicantData.selectedApplicants.length;
    const recruitsCount = campaign.campaignInfo.totalCount ?? 0;

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
      status: calculatedTab,
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
      daysLeft: campaign.campaignInfo.daysLeft,
      statusText:
        campaign.campaignInfo.statusText ||
        getStatusMessage(
          campaign.campaignInfo.status,
          campaign.campaignInfo.daysLeft
        ),
      brandLogo: getBrandLogo(
        campaign.campaignInfo.brandName || "기본",
        campaign.campaignInfo.campaignType
      ),
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
    const result = Array.isArray(deletedIds) ? deletedIds.map(id => String(id)) : [];
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
      console.log(`[addDeletedCampaignId] 삭제 목록에 추가됨: ID=${campaignIdStr}, 현재 삭제 목록:`, deletedIds);
    } else {
      console.log(`[addDeletedCampaignId] 이미 삭제 목록에 있음: ID=${campaignIdStr}`);
    }
  } catch (error) {
    console.error("삭제된 캠페인 ID 추가 실패:", error);
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
