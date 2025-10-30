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
} from "./utils/campaignHelpers";
import type {
  CampaignWithApplicants,
  AllApplicant,
} from "./campaign_application/delivery_applicants";
import type { ContentByTab } from "./campaign_contents/types";
// 타입별 분리 데이터(배송형/기자단/미션형)
import { deliveryCampaigns } from "./delivery";
import { reporterCampaigns } from "./reporter";
import { missionCampaigns } from "./mission";
import { visitCampaigns } from "./visit";
import { reviewCampaigns } from "./review";
// 종료/취소 데이터(콘텐츠 구조) 소스
import { visitClosedCampaigns } from "./visit";
import { reviewClosedCampaigns } from "./review";
import { missionClosedCampaigns } from "./mission";
import { deliveryClosedCampaigns } from "./delivery";

// 타입을 재export (신청내역/관리에서 공통 사용)
export type { CampaignWithApplicants, AllApplicant };

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

export const closedCampaigns: CampaignWithContents[] = [
  ...visitClosedCampaigns,
  ...missionClosedCampaigns,
  ...deliveryClosedCampaigns,
  ...reviewClosedCampaigns,
];

export function getClosedContentsById(
  campaignId: string
): ContentByTab | undefined {
  const found = closedCampaigns.find((c) => c.campaignInfo.id === campaignId);
  return found?.contents;
}

/**
 * 공용 캠페인 데이터 (기본 정보 + 신청자 데이터)
 *
 * 설명:
 * - 화면에서 보여줄 모든 더미 캠페인 데이터를 한 곳에 모아둔 배열입니다.
 * - 각 요소는 `campaignInfo`(상단 카드 정보)와 `applicantData`(신청/선정자 목록)로 구성됩니다.
 * - 종료/취소 캠페인은 `closedCampaigns`에 별도 분리되어 있으며, 최소 정보만 여기로 병합합니다.
 */
export const sharedCampaigns: CampaignWithApplicants[] = [
  // 타입 분리된 카테고리 병합
  ...reporterCampaigns,
  ...deliveryCampaigns,
  ...missionCampaigns,
  ...visitCampaigns,
  ...reviewCampaigns,
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

/**
 * 관리 페이지용 PartnerCampaign 데이터로 변환
 *
 * 반환: PartnerCampaign[]
 * - 카드 리스트/통계 산출에 맞춘 구조로 매핑합니다.
 * - 상태값(모집 중/진행 중 등)을 관리 페이지 탭과 일치하도록 변환합니다.
 */
export const convertToPartnerCampaigns = (): PartnerCampaign[] => {
  return sharedCampaigns.map((campaign) => ({
    id: campaign.campaignInfo.id,
    title: campaign.campaignInfo.title,
    image: campaign.campaignInfo.image,
    type: campaign.campaignInfo.category as
      | "배송형"
      | "방문형"
      | "구매평"
      | "기자단"
      | "미션형",
    status:
      campaign.campaignInfo.status === "진행 중"
        ? "진행"
        : campaign.campaignInfo.status === "모집 중"
        ? "신청"
        : campaign.campaignInfo.status === "대기 중"
        ? "예정"
        : campaign.campaignInfo.status === "마감"
        ? "취소"
        : (campaign.campaignInfo.status as "예정" | "진행" | "종료" | "취소"),
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
    subStatus: getSubStatus(
      campaign.campaignInfo.status,
      campaign.applicantData.applicants.length,
      campaign.applicantData.selectedApplicants.length
    ),
  }));
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
 */
export const getCampaignById = (id: string): CampaignWithApplicants | null => {
  return (
    sharedCampaigns.find((campaign) => campaign.campaignInfo.id === id) || null
  );
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
