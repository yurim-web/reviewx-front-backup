/* ========================================
   🛠️ 캠페인 카드 전용 헬퍼 함수 모음
   ======================================== */

/**
 * 모듈 목적
 *
 * - `CampaignCard`가 가진 길고 복잡한 비즈니스 로직(콘텐츠 집계, 상태 문구 계산, 경로 매핑 등)을
 *   재사용 가능한 순수 함수로 분리하여 컴포넌트 코드를 간결하게 유지합니다.
 * - UI 컴포넌트는 JSX와 사용자 인터랙션 제어에 집중하고, 데이터 기반 판단은 헬퍼에 위임합니다.
 */

/* ----------------------------------------
   📦 의존성 모듈 (데이터 접근 & 타입)
   ---------------------------------------- */
import type { PartnerCampaign, PartnerStatTab } from "@/types/partner/partner";
import {
  getClosedContentsById,
  getCampaignById,
} from "@/data/partner/sharedCampaigns";
import { getVisitContentsById } from "@/data/partner/visit";
import { getDeliveryContentsById } from "@/data/partner/delivery";
import { getReporterContentsById } from "@/data/partner/reporter";
import { getPurchaseReviewContentsById } from "@/data/partner/review";
import { getMissionContentsById } from "@/data/partner/mission";

/**
 * 콘텐츠 검수/완료 건수를 표현하는 타입
 */
export interface CampaignContentCounts {
  reviewingCount: number;
  completedCount: number;
}

/* ========================================
   🔍 콘텐츠 관련 데이터 계산
   ----------------------------------------
   - 카드 상단에 노출되는 검수/제출/선정 수를 계산하는 함수들
   - 콘텐츠 단계 진입 여부 판별
*/

/**
 * 캠페인 타입별 콘텐츠 데이터를 조회하는 내부 유틸 함수
 */
function getContentsByCampaignType(
  campaignType: PartnerCampaign["campaignType"],
  id: string
) {
  switch (campaignType) {
    case "방문형":
      return getVisitContentsById(id);
    case "배송형":
      return getDeliveryContentsById(id);
    case "기자단":
      return getReporterContentsById(id);
    case "구매평":
      return getPurchaseReviewContentsById(id);
    case "미션형":
      return getMissionContentsById(id);
    default:
      return { reviewing: [], completed: [] };
  }
}

/**
 * 캠페인 진행 단계에 따른 콘텐츠 검수/완료 건수 계산
 */
export function calculateContentCounts(
  campaign: PartnerCampaign
): CampaignContentCounts {
  const id = String(campaign.id);
  const status = campaign.status as string;

  // 종료/취소 캠페인은 closed 데이터 우선 확인
  if (status === "종료" || status === "취소") {
    const closedContents = getClosedContentsById(id);
    if (closedContents) {
      return {
        reviewingCount: closedContents.reviewing?.length ?? 0,
        completedCount: closedContents.completed?.length ?? 0,
      };
    }

    const campaignData = getCampaignById(id);
    if (campaignData && (campaignData as any).contents) {
      const contents = (campaignData as any).contents;
      return {
        reviewingCount: contents.reviewing?.length ?? 0,
        completedCount: contents.completed?.length ?? 0,
      };
    }

    return { reviewingCount: 0, completedCount: 0 };
  }

  // 진행/신청 캠페인: 우선 원본 데이터 contents 확인
  const campaignData = getCampaignById(id);
  if (campaignData && (campaignData as any).contents) {
    const contents = (campaignData as any).contents;
    return {
      reviewingCount: contents.reviewing?.length ?? 0,
      completedCount: contents.completed?.length ?? 0,
    };
  }

  // 원본 데이터에 없으면 캠페인 타입별 데이터 조회
  const typeContents = getContentsByCampaignType(campaign.campaignType, id);
  return {
    reviewingCount: typeContents?.reviewing?.length ?? 0,
    completedCount: typeContents?.completed?.length ?? 0,
  };
}

/**
 * 콘텐츠 단계(검수/완료 버튼 두 개 노출 여부) 판별
 */
export function isContentStage(
  campaign: PartnerCampaign,
  reviewingCount: number,
  completedCount: number
): boolean {
  const subStatus = (campaign.subStatus ?? "") as string;
  const status = campaign.status as string;

  if (
    subStatus.includes("content_review") ||
    subStatus.includes("content_approval")
  ) {
    return true;
  }

  if (status === "종료") {
    return true;
  }

  if (status === "진행" && (reviewingCount > 0 || completedCount > 0)) {
    return true;
  }

  return false;
}

/* ========================================
   🧭 라우팅 & 타입 변환 헬퍼
   ----------------------------------------
   - 캠페인 타입을 기반으로 페이지 경로를 산출합니다.
*/

/**
 * 캠페인 타입을 URL 경로 세그먼트로 변환
 */
export function getCampaignTypePath(
  campaignType: PartnerCampaign["campaignType"]
): string {
  switch (campaignType) {
    case "배송형":
      return "delivery";
    case "방문형":
      return "visit";
    case "구매평":
      return "review";
    case "기자단":
      return "reporter";
    case "미션형":
      return "mission";
    default:
      return "delivery";
  }
}

/* ========================================
   ⏱️ 일정 관련 계산 헬퍼
   ----------------------------------------
   - 모집 시작일, 선정 발표일, 등록 마감일까지 남은 일수를 계산합니다.
*/

/**
 * 모집 시작일까지 남은 일수 계산
 */
export function calculateDaysUntilOpen(recruitmentPeriod?: string): number {
  if (!recruitmentPeriod) {
    return 0;
  }

  try {
    const separator = recruitmentPeriod.includes(" ~ ") ? " ~ " : "~";
    const startDateStr = recruitmentPeriod.split(separator)[0]?.trim();

    if (!startDateStr) {
      return 0;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(startDateStr);
    if (isNaN(startDate.getTime())) {
      return 0;
    }
    startDate.setHours(0, 0, 0, 0);

    const diffTime = startDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  } catch (error) {
    console.error(
      "[calculateDaysUntilOpen] 모집 기간 파싱 실패:",
      error,
      recruitmentPeriod
    );
    return 0;
  }
}

/**
 * 선정 발표일까지 남은 일수 계산
 */
export function calculateDaysUntilAnnouncement(announcementDate?: string): number {
  if (!announcementDate) {
    return 0;
  }

  try {
    const dateStr = announcementDate.split(" ")[0]?.trim();
    if (!dateStr) {
      return 0;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const announcementDateObj = new Date(dateStr);
    if (isNaN(announcementDateObj.getTime())) {
      return 0;
    }
    announcementDateObj.setHours(0, 0, 0, 0);

    const diffTime = announcementDateObj.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  } catch (error) {
    console.error(
      "[calculateDaysUntilAnnouncement] 선정 발표일 파싱 실패:",
      error,
      announcementDate
    );
    return 0;
  }
}

/**
 * 등록 마감일까지 남은 일수 계산
 */
export function calculateDaysUntilDeadline(registrationPeriod?: string): number {
  if (!registrationPeriod) {
    return 0;
  }

  try {
    const separator = registrationPeriod.includes(" ~ ") ? " ~ " : "~";
    const endDateStr = registrationPeriod.split(separator)[1]?.trim();
    if (!endDateStr) {
      return 0;
    }

    const dateStr = endDateStr.split(" ")[0]?.trim();
    if (!dateStr) {
      return 0;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endDate = new Date(dateStr);
    if (isNaN(endDate.getTime())) {
      return 0;
    }
    endDate.setHours(0, 0, 0, 0);

    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  } catch (error) {
    console.error(
      "[calculateDaysUntilDeadline] 등록 기간 파싱 실패:",
      error,
      registrationPeriod
    );
    return 0;
  }
}

/* ========================================
   🗣️ 카드 상태 & 버튼 문구 생성
   ----------------------------------------
   - 탭/상태에 따른 안내 문구와 기본 버튼 텍스트를 구성합니다.
*/

interface StatusTextParams {
  campaign: PartnerCampaign;
  activeTab: PartnerStatTab;
  isContentStage: boolean;
  reviewingCount: number;
  completedCount: number;
}

/**
 * 카드에 표시할 상태 문구 계산
 */
export function getStatusTextForCampaign({
  campaign,
  activeTab,
  isContentStage,
  reviewingCount,
  completedCount,
}: StatusTextParams): string {
  const status = campaign.status as string;

  if (activeTab === "종료") {
    return "캠페인이 마감되었습니다.";
  }

  if (activeTab === "예정") {
    const daysUntilOpen = calculateDaysUntilOpen(campaign.recruitmentPeriod);
    return `캠페인 오픈까지 ${daysUntilOpen}일 남았습니다.`;
  }

  if (status === "모집 중" || activeTab === "신청") {
    const daysUntilAnnouncement = calculateDaysUntilAnnouncement(
      campaign.announcementDate
    );
    return `캠페인 선정 발표까지 ${daysUntilAnnouncement}일 남았습니다.`;
  }

  if (status === "대기 중") {
    const daysUntilOpen = calculateDaysUntilOpen(campaign.recruitmentPeriod);
    return `캠페인 오픈까지 ${daysUntilOpen}일 남았습니다.`;
  }

  if (activeTab === "진행" || status === "진행") {
    if (isContentStage) {
      const daysUntilDeadline = calculateDaysUntilDeadline(
        campaign.registrationPeriod
      );
      if (reviewingCount === 0) {
        return `콘텐츠 확인 요청이 없습니다. 캠페인 마감까지 ${daysUntilDeadline}일 남았습니다.`;
      }
      return `콘텐츠 확인 요청이 ${reviewingCount}건 있습니다. 캠페인 마감까지 ${daysUntilDeadline}일 남았습니다.`;
    }
    return "캠페인 당첨자를 선정해 주세요.";
  }

  if (status === "종료") {
    return "캠페인이 마감되었습니다.";
  }

  if (campaign.statusText) {
    return campaign.statusText;
  }

  const fallbackMessages: Record<string, string> = {
    "진행 중": "캠페인 당첨자를 선정해 주세요.",
    취소: "캠페인이 취소되었습니다.",
  };

  return fallbackMessages[status] || "캠페인을 확인해 주세요.";
}

/**
 * 상태/서브상태에 따라 기본 버튼 텍스트 결정
 */
export function getPrimaryButtonText(
  campaign: PartnerCampaign,
  completedCount: number
): string {
  const subStatus = (campaign.subStatus ?? "") as string;
  const status = campaign.status as string;

  if (subStatus === "applicant_management") {
    return "신청내역 확인";
  }

  if (subStatus === "winner_selection") {
    return "당첨자 선정";
  }

  if (subStatus === "content_review") {
    return `콘텐츠 확인 완료 (${completedCount})`;
  }

  if (subStatus === "penalty") {
    return "패널티 내역 확인";
  }

  switch (status) {
    case "예정":
      return "캠페인 수정하기";
    case "신청":
      return "신청내역 확인";
    case "진행":
      return "당첨자 선정";
    case "종료":
      return `콘텐츠 확인 완료 (${completedCount})`;
    case "취소":
      return "패널티 내역 확인";
    default:
      return "캠페인 관리";
  }
}


