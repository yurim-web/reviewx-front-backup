/* ========================================
   🛠️ 캠페인 정보 배너 전용 헬퍼 모듈
   ======================================== */

/**
 * 📍 사용처 (사용되는 파일 및 페이지)
 *
 * 🔹 직접 사용하는 컴포넌트:
 *    - src/components/partner/campaign_application/CampaignInfoBox.tsx
 *      → deriveCampaignStatus, getStatusText 함수 사용
 *
 * 🔹 CampaignInfoBox가 사용되는 컴포넌트:
 *    - src/components/partner/campaign_application/CampaignApplicationLayout.tsx
 *      → 캠페인 신청내역 페이지 레이아웃
 *    - src/components/partner/campaign_contents/CampaignContentsLayout.tsx
 *      → 캠페인 콘텐츠 내역 페이지 레이아웃
 *
 * 🔹 캠페인 신청내역 페이지 (CampaignApplicationLayout 사용):
 *    - /partner/campaign_application/delivery/[id] (배송형)
 *    - /partner/campaign_application/visit/[id] (방문형)
 *    - /partner/campaign_application/review/[id] (구매평)
 *    - /partner/campaign_application/reporter/[id] (기자단)
 *    - /partner/campaign_application/mission/[id] (미션형)
 *
 * 🔹 캠페인 콘텐츠 내역 페이지 (CampaignContentsLayout 사용):
 *    - /partner/campaign_contents/delivery/[id] (배송형)
 *    - /partner/campaign_contents/visit/[id] (방문형)
 *    - /partner/campaign_contents/review/[id] (구매평)
 *    - /partner/campaign_contents/reporter/[id] (기자단)
 *    - /partner/campaign_contents/mission/[id] (미션형)
 *
 * 🔹 매니저 진행 중 캠페인 상세 페이지:
 *    - /manager_sa/campaign/progress/delivery/[id]
 *    - /manager_sa/campaign/progress/visit/[id]
 *    - /manager_sa/campaign/progress/review/[id]
 *    - /manager_sa/campaign/progress/reporter/[id]
 *    - /manager_sa/campaign/progress/mission/[id]
 *
 * 📌 모듈 목적
 *
 * 1. 날짜 관련 계산 함수 관리
 *    - 모집/등록/구매 기간을 문자열로 받은 뒤 Date 객체로 안전하게 변환합니다.
 *    - 남은 일수, 마감 여부 등을 계산해 UI에 필요한 숫자를 제공합니다.
 *
 * 2. 상태 추론 로직 관리
 *    - 오늘 날짜를 기준으로 캠페인이 어떤 단계(대기, 모집, 선정, 구매, 등록, 마감)에 있는지 판별합니다.
 *
 * 3. 상태별 안내 문구 생성
 *    - 파생된 상태와 횟수 정보를 바탕으로 사용자에게 보여줄 문장을 구성합니다.
 *
 */

import { getStatusMessage } from "@/data/partner/utils/campaignHelpers";

/* ========================================
   📅 날짜 계산 기초 함수
   ======================================== */

/**
 * 선정 발표일까지 남은 일수 계산
 */
export function calculateDaysUntilAnnouncement(
  announcementDate?: string
): number {
  if (!announcementDate) {
    console.log(
      "[calculateDaysUntilAnnouncement] announcementDate가 없습니다."
    );
    return 0;
  }

  console.log(
    "[calculateDaysUntilAnnouncement] announcementDate:",
    announcementDate
  );

  try {
    const dateStr = announcementDate.split(" ")[0]?.trim();
    console.log("[calculateDaysUntilAnnouncement] dateStr:", dateStr);

    if (!dateStr) {
      console.log("[calculateDaysUntilAnnouncement] dateStr가 없습니다.");
      return 0;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const announcementDateObj = new Date(dateStr);
    if (isNaN(announcementDateObj.getTime())) {
      console.log(
        "[calculateDaysUntilAnnouncement] 유효하지 않은 날짜:",
        dateStr
      );
      return 0;
    }
    announcementDateObj.setHours(0, 0, 0, 0);

    const diffTime = announcementDateObj.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    console.log(
      "[calculateDaysUntilAnnouncement] 오늘:",
      today.toISOString().split("T")[0]
    );
    console.log(
      "[calculateDaysUntilAnnouncement] 선정 발표일:",
      announcementDateObj.toISOString().split("T")[0]
    );
    console.log("[calculateDaysUntilAnnouncement] 차이 (밀리초):", diffTime);
    console.log("[calculateDaysUntilAnnouncement] 계산된 일수:", diffDays);

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
 * 선정 발표일이 지났는지 확인
 *
 * @param announcementDate - 선정 발표일 문자열 (예: "2026-01-16")
 * @returns 선정 발표일이 오늘 날짜보다 이전이면 true, 아니면 false
 */
export function isAnnouncementDatePassed(announcementDate?: string): boolean {
  if (!announcementDate) {
    return false;
  }

  try {
    const dateStr = announcementDate.split(" ")[0]?.trim();
    if (!dateStr) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const announcementDateObj = new Date(dateStr);
    if (isNaN(announcementDateObj.getTime())) {
      return false;
    }
    announcementDateObj.setHours(0, 0, 0, 0);

    // 선정 발표일이 오늘보다 이전이면 true (지났음)
    return announcementDateObj < today;
  } catch (error) {
    console.error(
      "[isAnnouncementDatePassed] 선정 발표일 파싱 실패:",
      error,
      announcementDate
    );
    return false;
  }
}

/**
 * 등록 기간 종료일이 지났는지 확인
 */
export function isRegistrationPeriodEnded(
  registrationPeriod?: string
): boolean {
  if (!registrationPeriod) {
    console.log("[isRegistrationPeriodEnded] registrationPeriod가 없습니다.");
    return false;
  }

  try {
    const separator = registrationPeriod.includes(" ~ ") ? " ~ " : "~";
    const endDateStr = registrationPeriod.split(separator)[1]?.trim();

    if (!endDateStr) {
      console.log("[isRegistrationPeriodEnded] endDateStr가 없습니다.");
      return false;
    }

    const dateStr = endDateStr.split(" ")[0]?.trim();

    if (!dateStr) {
      console.log("[isRegistrationPeriodEnded] dateStr가 없습니다.");
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endDate = new Date(dateStr);
    if (isNaN(endDate.getTime())) {
      console.log("[isRegistrationPeriodEnded] 유효하지 않은 날짜:", dateStr);
      return false;
    }
    endDate.setHours(0, 0, 0, 0);

    const isEnded = endDate < today;
    console.log(
      "[isRegistrationPeriodEnded] 등록 기간 종료일:",
      endDate.toISOString().split("T")[0]
    );
    console.log(
      "[isRegistrationPeriodEnded] 오늘:",
      today.toISOString().split("T")[0]
    );
    console.log("[isRegistrationPeriodEnded] 마감 여부:", isEnded);

    return isEnded;
  } catch (error) {
    console.error(
      "[isRegistrationPeriodEnded] 등록 기간 파싱 실패:",
      error,
      registrationPeriod
    );
    return false;
  }
}

/**
 * 등록 기간 종료일까지 남은 일수 계산
 */
export function calculateDaysUntilDeadline(
  registrationPeriod?: string
): number {
  if (!registrationPeriod) {
    console.log("[calculateDaysUntilDeadline] registrationPeriod가 없습니다.");
    return 0;
  }

  console.log(
    "[calculateDaysUntilDeadline] registrationPeriod:",
    registrationPeriod
  );

  try {
    const separator = registrationPeriod.includes(" ~ ") ? " ~ " : "~";
    const endDateStr = registrationPeriod.split(separator)[1]?.trim();

    console.log("[calculateDaysUntilDeadline] endDateStr:", endDateStr);

    if (!endDateStr) {
      console.log("[calculateDaysUntilDeadline] endDateStr가 없습니다.");
      return 0;
    }

    const dateStr = endDateStr.split(" ")[0]?.trim();

    if (!dateStr) {
      console.log("[calculateDaysUntilDeadline] dateStr가 없습니다.");
      return 0;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endDate = new Date(dateStr);
    if (isNaN(endDate.getTime())) {
      console.log("[calculateDaysUntilDeadline] 유효하지 않은 날짜:", dateStr);
      return 0;
    }
    endDate.setHours(0, 0, 0, 0);

    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    console.log(
      "[calculateDaysUntilDeadline] 오늘:",
      today.toISOString().split("T")[0]
    );
    console.log(
      "[calculateDaysUntilDeadline] 마감일:",
      endDate.toISOString().split("T")[0]
    );
    console.log("[calculateDaysUntilDeadline] 차이 (밀리초):", diffTime);
    console.log("[calculateDaysUntilDeadline] 계산된 일수:", diffDays);

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
   🧰 날짜 파싱 유틸리티
   ======================================== */

type DateRange = {
  start: Date;
  end: Date;
};

function normalizeToDateOnly(date: Date): Date {
  const normalized = new Date(date.getTime());
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

function parseDateString(dateString?: string): Date | null {
  if (!dateString) {
    return null;
  }

  const dateOnly = dateString.split(" ")[0]?.trim();
  if (!dateOnly) {
    return null;
  }

  const parsed = new Date(dateOnly);
  if (isNaN(parsed.getTime())) {
    return null;
  }

  return normalizeToDateOnly(parsed);
}

function parseDateRange(period?: string): DateRange | null {
  if (!period) {
    return null;
  }

  const separator = period.includes(" ~ ") ? " ~ " : "~";
  const [startText, endText] = period.split(separator);
  const startDate = parseDateString(startText?.trim());
  const endDate = parseDateString(endText?.trim());

  if (!startDate || !endDate) {
    return null;
  }

  return { start: startDate, end: endDate };
}

function isWithinRange(target: Date, range: DateRange): boolean {
  const time = target.getTime();
  return time >= range.start.getTime() && time <= range.end.getTime();
}

function isAfter(target: Date, compare: Date): boolean {
  return target.getTime() > compare.getTime();
}

function isBefore(target: Date, compare: Date): boolean {
  return target.getTime() < compare.getTime();
}

/* ========================================
   🛒 구매 기간 계산 (구매평 캠페인 전용)
   ======================================== */

export function calculateDaysUntilPurchaseEnd(purchasePeriod?: string): number {
  const range = parseDateRange(purchasePeriod);
  if (!range) {
    console.log(
      "[calculateDaysUntilPurchaseEnd] purchasePeriod가 유효하지 않습니다."
    );
    return 0;
  }

  const today = normalizeToDateOnly(new Date());
  const diffTime = range.end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  console.log(
    "[calculateDaysUntilPurchaseEnd] 오늘:",
    today.toISOString().split("T")[0]
  );
  console.log(
    "[calculateDaysUntilPurchaseEnd] 구매 기간 종료일:",
    range.end.toISOString().split("T")[0]
  );
  console.log("[calculateDaysUntilPurchaseEnd] 남은 일수:", diffDays);

  return diffDays > 0 ? diffDays : 0;
}

/* ========================================
   🚦 상태 판별 & 문구 생성
   ======================================== */

export type CampaignStatusValue =
  | "대기 중"
  | "모집 중"
  | "선정 중"
  | "구매 중"
  | "등록 중"
  | "마감"
  | "취소";

export interface CampaignInfoForHelper {
  status: CampaignStatusValue;
  campaignType: "배송형" | "방문형" | "구매평" | "기자단" | "미션형";
  recruitmentPeriod: string;
  announcementDate: string;
  purchasePeriod?: string;
  registrationPeriod: string;
  daysLeft: number;
  statusText?: string;
}

export function deriveCampaignStatus(
  campaignInfo: CampaignInfoForHelper
): CampaignStatusValue {
  const {
    status,
    campaignType,
    recruitmentPeriod,
    announcementDate,
    purchasePeriod,
    registrationPeriod,
  } = campaignInfo;

  const today = normalizeToDateOnly(new Date());

  // ⚠️ status가 "마감"으로 들어와도 날짜 기준으로 다시 계산합니다.
  //    (초기 더미 데이터의 status 값이 실제 일정과 맞지 않을 수 있기 때문)
  //    단, "취소"는 그대로 유지합니다.
  if (status === "취소") {
    return "취소";
  }

  const registrationRange = parseDateRange(registrationPeriod);
  const recruitmentRange = parseDateRange(recruitmentPeriod);
  const announcement = parseDateString(announcementDate);

  // 등록 기간이 시작되었고 종료일이 지났을 때만 "마감" 반환
  if (
    registrationRange &&
    registrationRange.start <= today &&
    isAfter(today, registrationRange.end)
  ) {
    console.log("[deriveCampaignStatus] 등록 기간 종료 이후 → 마감");
    return "마감";
  }

  // 구매평 캠페인의 구매 기간 체크
  if (campaignType === "구매평") {
    const purchaseRange = parseDateRange(purchasePeriod);
    if (purchaseRange && isWithinRange(today, purchaseRange)) {
      console.log("[deriveCampaignStatus] 구매 기간 내 → 구매 중");
      return "구매 중";
    }
  }

  // 등록 기간 내
  if (registrationRange && isWithinRange(today, registrationRange)) {
    console.log("[deriveCampaignStatus] 등록 기간 내 → 등록 중");
    return "등록 중";
  }

  // 모집 기간 내 (등록 기간 체크보다 먼저 확인)
  // 모집 기간 내라면 "모집 중"으로 표시해야 함
  if (recruitmentRange && isWithinRange(today, recruitmentRange)) {
    console.log("[deriveCampaignStatus] 모집 기간 내 → 모집 중");
    return "모집 중";
  }

  // 선정 발표 대기 (모집 기간 종료 후 ~ 선정 발표 전)
  if (
    recruitmentRange &&
    announcement &&
    isAfter(today, recruitmentRange.end) &&
    isBefore(today, announcement)
  ) {
    console.log("[deriveCampaignStatus] 선정 발표 대기 → 선정 중");
    return "선정 중";
  }

  // 모집 시작 전 또는 등록 기간 시작 전 → 대기 중
  if (
    (recruitmentRange && isBefore(today, recruitmentRange.start)) ||
    (registrationRange && isBefore(today, registrationRange.start))
  ) {
    console.log("[deriveCampaignStatus] 모집/등록 시작 전 → 대기 중");
    return "대기 중";
  }

  console.log("[deriveCampaignStatus] 조건 외 → 기존 상태 유지", status);
  return status;
}

export function getStatusText(
  campaignInfo: CampaignInfoForHelper,
  reviewingCount?: number,
  completedCount?: number,
  calculatedStatus?: CampaignStatusValue
): string {
  const currentStatus = calculatedStatus ?? campaignInfo.status;

  console.log(
    "[CampaignInfoBox getStatusText] 원본 상태:",
    campaignInfo.status
  );
  console.log("[CampaignInfoBox getStatusText] 계산된 상태:", currentStatus);
  console.log(
    "[CampaignInfoBox getStatusText] 선정 발표일:",
    campaignInfo.announcementDate
  );
  console.log(
    "[CampaignInfoBox getStatusText] 등록 기간:",
    campaignInfo.registrationPeriod
  );
  console.log(
    "[CampaignInfoBox getStatusText] reviewingCount:",
    reviewingCount
  );
  console.log(
    "[CampaignInfoBox getStatusText] completedCount:",
    completedCount
  );
  console.log(
    "[CampaignInfoBox getStatusText] statusText:",
    campaignInfo.statusText
  );
  console.log(
    "[CampaignInfoBox getStatusText] daysLeft:",
    campaignInfo.daysLeft
  );

  if (
    currentStatus !== "마감" &&
    isRegistrationPeriodEnded(campaignInfo.registrationPeriod)
  ) {
    console.log(
      "[CampaignInfoBox getStatusText] 등록 기간 종료: 캠페인이 마감되었습니다."
    );
    return "캠페인이 마감되었습니다.";
  }

  if (currentStatus === "마감") {
    console.log(
      "[CampaignInfoBox getStatusText] 마감 상태: 캠페인이 마감되었습니다."
    );
    return "캠페인이 마감되었습니다.";
  }

  if (
    currentStatus === "등록 중" &&
    (reviewingCount !== undefined || completedCount !== undefined)
  ) {
    const reviewCount = reviewingCount ?? 0;
    const completeCount = completedCount ?? 0;

    if (reviewCount > 0 || completeCount > 0) {
      const daysUntilDeadline = calculateDaysUntilDeadline(
        campaignInfo.registrationPeriod
      );
      if (reviewCount === 0) {
        console.log("[CampaignInfoBox getStatusText] 진행 중, 확인 요청 0건");
        return `콘텐츠 확인 요청이 없습니다. 캠페인 마감까지 ${daysUntilDeadline}일 남았습니다.`;
      }
      console.log("[CampaignInfoBox getStatusText] 진행 중, 확인 요청 있음");
      return `콘텐츠 확인 요청이 ${reviewCount}건 있습니다. 캠페인 마감까지 ${daysUntilDeadline}일 남았습니다.`;
    }

    console.log(
      "[CampaignInfoBox getStatusText] 등록/진행 단계, 콘텐츠 없음 - 당첨자 선정"
    );
    return "캠페인 당첨자를 선정해 주세요.";
  }

  if (currentStatus === "구매 중") {
    const daysUntilPurchaseEnd = calculateDaysUntilPurchaseEnd(
      campaignInfo.purchasePeriod
    );
    console.log(
      "[CampaignInfoBox getStatusText] 구매 기간 남은 일수:",
      daysUntilPurchaseEnd
    );
    return daysUntilPurchaseEnd > 0
      ? `구매 기간입니다. 구매 마감까지 ${daysUntilPurchaseEnd}일 남았습니다.`
      : "구매 기간이 곧 종료됩니다. 구매 여부를 확인해 주세요.";
  }

  if (currentStatus === "등록 중") {
    const daysUntilDeadline = calculateDaysUntilDeadline(
      campaignInfo.registrationPeriod
    );
    console.log(
      "[CampaignInfoBox getStatusText] 등록 기간 남은 일수:",
      daysUntilDeadline
    );
    return daysUntilDeadline > 0
      ? `콘텐츠 등록 기간입니다. 마감까지 ${daysUntilDeadline}일 남았습니다.`
      : "콘텐츠 등록 마감일입니다. 제출 상태를 확인해 주세요.";
  }

  if (currentStatus === "선정 중") {
    const daysUntilAnnouncement = calculateDaysUntilAnnouncement(
      campaignInfo.announcementDate
    );
    console.log(
      "[CampaignInfoBox getStatusText] 선정 발표까지 남은 일수:",
      daysUntilAnnouncement
    );
    return daysUntilAnnouncement > 0
      ? `선정 결과 발표까지 ${daysUntilAnnouncement}일 남았습니다.`
      : "오늘 선정 결과가 발표됩니다. 선정자를 확정해 주세요.";
  }

  if (currentStatus === "모집 중" || currentStatus === "대기 중") {
    const daysUntilAnnouncement = calculateDaysUntilAnnouncement(
      campaignInfo.announcementDate
    );
    console.log(
      "[CampaignInfoBox getStatusText] 계산된 남은 일수:",
      daysUntilAnnouncement
    );
    return `캠페인 선정 발표까지 ${daysUntilAnnouncement}일 남았습니다.`;
  }

  if (campaignInfo.announcementDate && campaignInfo.statusText) {
    if (campaignInfo.statusText.includes("선정 발표")) {
      const daysUntilAnnouncement = calculateDaysUntilAnnouncement(
        campaignInfo.announcementDate
      );
      console.log(
        "[CampaignInfoBox getStatusText] statusText에 선정 발표 포함, 재계산:",
        daysUntilAnnouncement
      );
      return `캠페인 선정 발표까지 ${daysUntilAnnouncement}일 남았습니다.`;
    }
  }

  if (campaignInfo.statusText) {
    console.log(
      "[CampaignInfoBox getStatusText] statusText 사용:",
      campaignInfo.statusText
    );
    return campaignInfo.statusText;
  }

  const fallbackMessage = getStatusMessage(
    currentStatus,
    campaignInfo.daysLeft
  );
  console.log(
    "[CampaignInfoBox getStatusText] fallback 메시지 사용:",
    fallbackMessage
  );
  return fallbackMessage;
}
