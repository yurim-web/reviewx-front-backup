/* ========================================
   SA 관리자 진행 현황 데이터
   ======================================== */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * SA 관리자 진행 현황 목업 데이터
 *
 * 목적: SA 관리자 진행 현황 페이지에서 사용하는 임시 목업 데이터입니다.
 *
 * 사용 페이지:
 * - /manager_sa/campaign/progress (진행 현황 페이지)
 *
 */

// 각 캠페인 타입별 데이터 import
import {
  deliveryCampaignsExtended,
  deliveryClosedCampaignsExtended,
  type DeliveryCampaignDataExtended,
} from "@/data/campaign/delivery/deliveryCampaigns";
import { missionCampaignsExtended as missionCampaigns } from "@/data/campaign/mission/missionCampaigns";
import { reporterCampaignsExtended as reporterCampaigns } from "@/data/campaign/reporter/reporterCampaigns";
import { reviewCampaignsExtended as reviewCampaigns } from "@/data/campaign/review/reviewCampaigns";
import { visitCampaignsExtended as visitCampaigns } from "@/data/campaign/visit/visitCampaigns";
import type { DeliveryCampaignDataItem } from "@/data/campaign/delivery/deliveryCampaigns";
import { calculateCampaignStatus } from "@/data/campaign/delivery/deliveryUtils";

/**
 * DeliveryCampaignDataExtended를 DeliveryCampaignDataItem으로 변환
 *
 * 📌 상태 계산:
 * - extended.status가 "종료", "취소", "긴급"인 경우 그대로 사용
 * - 그 외의 경우 날짜 기반으로 상태를 계산 (calculateCampaignStatus 사용)
 */
function convertExtendedToItem(extended: DeliveryCampaignDataExtended): DeliveryCampaignDataItem {
  const recruitmentPeriod = `${extended.detailedSchedule.applicationStart} ~ ${extended.detailedSchedule.applicationEnd}`;
  const announcementDate = extended.detailedSchedule.announcement;
  const registrationPeriod = extended.detailedSchedule.registrationPeriod;

  // 취소, 긴급 상태는 데이터에서 직접 가져오고, 그 외는 날짜 기반으로 계산
  let calculatedStatus: "진행 중" | "대기 중" | "모집 중" | "종료" | "취소" | "긴급";

  // isUrgent가 true이면 무조건 "긴급" 상태로 설정 (최우선)
  if (extended.isUrgent === true) {
    calculatedStatus = "긴급";
  } else if (extended.status === "취소" || extended.status === "긴급") {
    calculatedStatus = extended.status;
  } else {
    // 날짜 기반으로 상태 계산 (등록 기간 종료일도 확인)
    const dateBasedStatus = calculateCampaignStatus(
      recruitmentPeriod,
      announcementDate,
      registrationPeriod
    );
    calculatedStatus = dateBasedStatus;
  }

  // 지급 포인트: extended.points를 사용
  // extended.points는 DeliveryCampaignDataExtended의 필수 필드이므로 항상 있어야 함
  // 하지만 안전을 위해 undefined나 null 체크를 수행
  const point_value = typeof extended.points === "number" ? extended.points : 0;

  return {
    campaignInfo: {
      id: extended.id,
      title: extended.title,
      image: extended.image,
      status: calculatedStatus,
      campaignType: "배송형",
      category: extended.subcategory || "",
      brandName: extended.brandName || extended.channel || "",
      recruitmentPeriod: recruitmentPeriod,
      announcementDate: announcementDate,
      registrationPeriod: extended.detailedSchedule.registrationPeriod,
      recruitedCount: extended.recruitment.current || 0,
      totalCount: extended.recruitment.total || 0,
      daysLeft: 0,
      statusText: extended.statusText,
      partnerName: extended.partnerName,
      point: point_value,
    },
    applicantData: extended.applicantData,
    contents: extended.contents,
  };
}

// deliveryCampaignsExtended를 DeliveryCampaignDataItem 형식으로 변환
const deliveryCampaigns: DeliveryCampaignDataItem[] =
  deliveryCampaignsExtended.map(convertExtendedToItem);
import type { MissionCampaignDataExtended as MissionCampaignDataItem } from "@/data/campaign/mission/missionCampaigns";
import type { ReporterCampaignDataExtended as ReporterCampaignDataItem } from "@/data/campaign/reporter/reporterCampaigns";
import type { ReviewCampaignDataExtended as ReviewCampaignDataItem } from "@/data/campaign/review/reviewCampaigns";
import type { VisitCampaignDataExtended as VisitCampaignDataItem } from "@/data/campaign/visit/visitCampaigns";

// 공통 필터 옵션에서 import (manager_ga와 manager_sa 공통)
import type { CampaignStatus, CampaignType, Channel } from "@/data/manager/common/filterOptions";

// 타입 재export (기존 코드와의 호환성을 위해)
export type { CampaignStatus, CampaignType, Channel };

// 통계 카드 데이터 타입
export interface StatCard {
  title: string; // 카드 제목
  value: string; // 통계 값
}

// 캠페인 목록 아이템 타입
export interface CampaignProgressItem {
  id: string; // 캠페인 ID
  campaign_number: string; // 캠페인 번호
  partner_name: string; // 파트너명
  campaign_name: string; // 캠페인명
  type: CampaignType; // 캠페인 유형
  channel: Channel; // 채널
  status: CampaignStatus; // 상태
  recruit_count: number; // 모집 수
  apply_count: number; // 신청 수
  point: number; // 지급 포인트
  detail_campaign_id?: string; // 상세 페이지에서 사용할 공용 캠페인 ID (옵션)
  created_at?: Date; // 캠페인 생성일 (날짜 필터링용)
}

/* ========================================
   📊 통계 카드 데이터 계산 함수
   ======================================== */

/**
 * 통계 카드 값들을 계산하는 함수
 *
 * 설명:
 * - campaign_list를 기반으로 각 상태별 캠페인 개수를 계산합니다
 * - localStorage에 저장된 새로 등록한 캠페인도 포함됩니다
 * - 함수 호출 시점에 최신 데이터를 가져오기 위해 get_campaign_list()를 호출합니다
 * - 취소된 캠페인은 원본 데이터에서 직접 확인합니다
 * - 숫자를 천 단위로 포맷팅하여 반환합니다
 *
 */
export function calculate_stat_card_values() {
  // 최신 캠페인 목록 가져오기 (localStorage 포함)
  const current_campaign_list = get_campaign_list();

  // 오픈 예정 캠페인 (status가 '예정'인 것)
  const open_scheduled_count = current_campaign_list.filter(
    (campaign) => campaign.status === "예정"
  ).length;

  // 진행 중인 캠페인 (status가 '진행'인 것)
  const in_progress_count = current_campaign_list.filter(
    (campaign) => campaign.status === "진행"
  ).length;

  // 신청 중인 캠페인 (status가 '신청'인 것)
  const applying_count = current_campaign_list.filter(
    (campaign) => campaign.status === "신청"
  ).length;

  // 전체 캠페인
  const total_count = current_campaign_list.length;

  // 종료된 캠페인 (status가 '종료'인 것)
  const ended_count = current_campaign_list.filter((campaign) => campaign.status === "종료").length;

  // 취소된 캠페인 (status가 '취소'인 것)
  const cancelled_count = current_campaign_list.filter(
    (campaign) => campaign.status === "취소"
  ).length;

  // 숫자를 천 단위로 포맷팅하는 함수
  // toLocaleString: 숫자를 지역화된 문자열로 변환합니다 (예: 1000 -> "1,000")
  const format_count = (count: number): string => {
    return `${count.toLocaleString("ko-KR")}건`;
  };

  return {
    open_scheduled: format_count(open_scheduled_count),
    in_progress: format_count(in_progress_count),
    applying: format_count(applying_count),
    total: format_count(total_count),
    ended: format_count(ended_count),
    cancelled: format_count(cancelled_count),
  };
}

/* ========================================
   🔄 데이터 변환 함수
   ======================================== */

/**
 * 브랜드명을 Channel 타입으로 변환
 *
 * 설명:
 * - 각 캠페인 데이터의 brandName을 progress.ts의 Channel 타입으로 변환합니다.
 * - 미션형은 brandName이 빈 문자열이므로 'Mission'으로 변환합니다.
 *
 * @param brandName - 브랜드명 (예: "네이버블로그", "인스타그램", "")
 * @param campaignType - 캠페인 타입 (미션형의 경우 빈 문자열을 'Mission'으로 변환)
 * @returns Channel 타입
 */
function map_brand_name_to_channel(brandName: string, campaignType: CampaignType): Channel {
  // 구매평은 항상 "Review"로 변환 (구매평 전용 아이콘)
  if (campaignType === "구매평") {
    return "Review";
  }

  // 미션형은 brandName이 빈 문자열이므로 'Mission'으로 변환
  if (campaignType === "미션형" && !brandName) {
    return "Mission";
  }

  // 공백 제거 및 정규화
  const normalizedBrandName = brandName.replace(/\s+/g, "");

  // 브랜드명 매핑
  const brand_map: Record<string, Channel> = {
    네이버블로그: "Blog",
    블로그: "Blog",
    인스타그램: "Instagram",
    네이버클립: "Clip",
    클립: "Clip",
    유튜브: "Youtube",
    릴스: "Reels",
    쇼츠: "Shorts",
    숏츠: "Shorts",
    스토어: "Store",
    기본: "Store", // 기본값은 Store로 설정
  };

  return brand_map[normalizedBrandName] || "Store";
}

/**
 * 캠페인 상태를 progress.ts의 CampaignStatus로 변환
 *
 * 설명:
 * - 각 캠페인 데이터의 status ('진행 중' | '대기 중' | '모집 중' | '종료' | '취소' | '긴급')
 *   를 progress.ts의 CampaignStatus ('예정' | '신청' | '진행' | '종료' | '취소' | '긴급')로 변환합니다.
 *
 * @param status - 캠페인 상태
 * @returns CampaignStatus 타입
 */
function map_status_to_progress_status(
  status: "진행 중" | "대기 중" | "모집 중" | "종료" | "취소" | "긴급" | "등록 중"
): CampaignStatus {
  const status_map: Record<
    "진행 중" | "대기 중" | "모집 중" | "종료" | "취소" | "긴급" | "등록 중",
    CampaignStatus
  > = {
    "대기 중": "예정",
    "모집 중": "신청",
    "진행 중": "진행",
    "등록 중": "진행", // 등록 중도 진행으로 표시
    종료: "종료",
    취소: "취소", // 취소 상태를 별도로 표시
    긴급: "긴급", // 긴급 상태를 별도로 표시
  };

  return status_map[status] || "진행";
}

/**
 * 캠페인 ID를 캠페인 번호 형식으로 변환
 *
 * 설명:
 * - 캠페인 ID를 "000001" 형식의 6자리 문자열로 변환합니다.
 *
 * @param id - 캠페인 ID (예: "961", "16")
 * @returns 캠페인 번호 (예: "000961", "000016")
 */
function format_campaign_number(id: string): string {
  const num_id = parseInt(id, 10);
  if (isNaN(num_id)) {
    return "000000";
  }
  return String(num_id).padStart(6, "0");
}

/**
 * 모집 기간 문자열에서 시작일을 Date로 파싱
 *
 * @param recruitmentPeriod - 모집 기간 문자열 (예: "2025-10-20 ~ 2025-10-30")
 * @returns Date 객체 또는 undefined
 */
function parse_recruitment_start_date(recruitmentPeriod: string | undefined): Date | undefined {
  if (!recruitmentPeriod || recruitmentPeriod.trim() === "") {
    return undefined;
  }

  const startDateStr = recruitmentPeriod.split("~")[0]?.trim();
  if (!startDateStr) {
    return undefined;
  }

  const date = new Date(startDateStr);
  return isNaN(date.getTime()) ? undefined : date;
}

/**
 * 배송형 캠페인 데이터를 CampaignProgressItem으로 변환
 *
 * @param campaign - 배송형 캠페인 데이터
 * @returns CampaignProgressItem
 */
function convert_delivery_to_progress_item(
  campaign: DeliveryCampaignDataItem
): CampaignProgressItem {
  const { campaignInfo, applicantData } = campaign;

  // 취소, 긴급 상태는 데이터에서 직접 가져오고, 그 외는 날짜 기반으로 계산
  let calculatedStatus: "진행 중" | "대기 중" | "모집 중" | "종료" | "취소" | "긴급";

  // campaign에 isUrgent 필드가 있는지 확인 (DeliveryCampaignDataItem에는 없지만, 확장된 데이터에는 있을 수 있음)
  const isUrgent = (campaign as any).isUrgent === true;

  // isUrgent가 true이면 무조건 "긴급" 상태로 설정 (최우선)
  if (isUrgent) {
    calculatedStatus = "긴급";
  } else if (campaignInfo.status === "취소" || campaignInfo.status === "긴급") {
    calculatedStatus = campaignInfo.status;
  } else {
    // 날짜 기반으로 상태 계산 (등록 기간 종료일도 확인)
    const dateBasedStatus = calculateCampaignStatus(
      campaignInfo.recruitmentPeriod,
      campaignInfo.announcementDate,
      campaignInfo.registrationPeriod
    );
    calculatedStatus = dateBasedStatus;
  }

  return {
    id: campaignInfo.id,
    campaign_number: format_campaign_number(campaignInfo.id),
    partner_name: campaignInfo.partnerName ?? "", // 파트너명 (데이터가 없으면 빈 문자열)
    campaign_name: campaignInfo.title,
    type: "배송형",
    channel: map_brand_name_to_channel(
      campaignInfo.channel || campaignInfo.brandName || "",
      "배송형"
    ),
    status: map_status_to_progress_status(calculatedStatus),
    recruit_count: campaignInfo.totalCount,
    apply_count: applicantData?.applicants?.length ?? 0,
    // 지급 포인트: campaignInfo.point 또는 campaign.point 사용
    point:
      campaignInfo.point !== undefined && campaignInfo.point !== null
        ? campaignInfo.point
        : (campaign as any).point || (campaign as any).points || 0,
    detail_campaign_id: campaignInfo.id,
    created_at: parse_recruitment_start_date(campaignInfo.recruitmentPeriod),
  };
}

/**
 * 미션형 캠페인 데이터를 CampaignProgressItem으로 변환
 *
 * @param campaign - 미션형 캠페인 데이터
 * @returns CampaignProgressItem | null
 *
 * 📌 주의:
 * - MissionCampaignDataExtended는 campaignInfo 필드가 없고 직접 필드들을 가지고 있습니다.
 * - 따라서 campaign.campaignInfo 대신 campaign의 직접 필드들을 사용합니다.
 */
function convert_mission_to_progress_item(
  campaign: MissionCampaignDataItem
): CampaignProgressItem | null {
  // campaignInfo가 없는 경우 안전하게 처리
  // MissionCampaignDataExtended는 직접 필드들을 가지고 있으므로 campaign 자체를 사용
  if (!campaign || !campaign.id) {
    return null;
  }

  const { applicantData } = campaign;

  // recruitmentPeriod 생성 (detailedSchedule에서)
  const recruitmentPeriod = campaign.detailedSchedule
    ? `${campaign.detailedSchedule.applicationStart} ~ ${campaign.detailedSchedule.applicationEnd}`
    : "";
  const announcementDate = campaign.detailedSchedule?.announcement;
  const registrationPeriod = campaign.detailedSchedule?.registrationPeriod;

  // 취소, 긴급 상태는 데이터에서 직접 가져오고, 그 외는 날짜 기반으로 계산
  let calculatedStatus: "진행 중" | "대기 중" | "모집 중" | "종료" | "취소" | "긴급";

  // isUrgent가 true이면 무조건 "긴급" 상태로 설정 (최우선)
  if (campaign.isUrgent === true) {
    calculatedStatus = "긴급";
  } else if (campaign.status === "취소" || campaign.status === "긴급") {
    calculatedStatus = campaign.status;
  } else {
    // 날짜 기반으로 상태 계산 (등록 기간 종료일도 확인)
    const dateBasedStatus = calculateCampaignStatus(
      recruitmentPeriod,
      announcementDate,
      registrationPeriod
    );
    calculatedStatus = dateBasedStatus;
  }

  return {
    id: campaign.id,
    campaign_number: format_campaign_number(campaign.id),
    partner_name: campaign.partnerName ?? "", // 파트너명 (데이터가 없으면 빈 문자열)
    campaign_name: campaign.title,
    type: "미션형",
    channel: "Mission", // 미션형은 항상 "Mission" 채널
    status: map_status_to_progress_status(calculatedStatus),
    recruit_count: campaign.recruitment?.total ?? 0,
    apply_count: applicantData?.applicants?.length ?? 0,
    point: (campaign as any).point || campaign.points || 0, // 지급 포인트 (point 또는 points 필드 사용)
    detail_campaign_id: campaign.id,
    created_at: parse_recruitment_start_date(recruitmentPeriod),
  };
}

/**
 * 기자단 캠페인 데이터를 CampaignProgressItem으로 변환
 *
 * @param campaign - 기자단 캠페인 데이터
 * @returns CampaignProgressItem | null
 *
 * 📌 주의:
 * - ReporterCampaignDataExtended는 campaignInfo 필드가 없고 직접 필드들을 가지고 있습니다.
 * - 따라서 campaign.campaignInfo 대신 campaign의 직접 필드들을 사용합니다.
 */
function convert_reporter_to_progress_item(
  campaign: ReporterCampaignDataItem
): CampaignProgressItem | null {
  // campaignInfo가 없는 경우 안전하게 처리
  // ReporterCampaignDataExtended는 직접 필드들을 가지고 있으므로 campaign 자체를 사용
  if (!campaign || !campaign.id) {
    return null;
  }

  const { applicantData } = campaign;

  // recruitmentPeriod 생성 (detailedSchedule에서)
  const recruitmentPeriod = campaign.detailedSchedule
    ? `${campaign.detailedSchedule.applicationStart} ~ ${campaign.detailedSchedule.applicationEnd}`
    : "";
  const announcementDate = campaign.detailedSchedule?.announcement;
  const registrationPeriod = campaign.detailedSchedule?.registrationPeriod;

  // 취소, 긴급, 등록 중 상태는 데이터에서 직접 가져오고, 그 외는 날짜 기반으로 계산
  let calculatedStatus: "진행 중" | "대기 중" | "모집 중" | "종료" | "취소" | "긴급" | "등록 중";

  // isUrgent가 true이면 무조건 "긴급" 상태로 설정 (최우선)
  if (campaign.isUrgent === true) {
    calculatedStatus = "긴급";
  } else if (campaign.status === "취소" || campaign.status === "긴급") {
    calculatedStatus = campaign.status as any;
  } else {
    // 날짜 기반으로 상태 계산 (등록 기간 종료일도 확인)
    const dateBasedStatus = calculateCampaignStatus(
      recruitmentPeriod,
      announcementDate,
      registrationPeriod
    );
    // "진행 중" 상태를 기자단의 경우 "등록 중"으로 변환
    if (dateBasedStatus === "진행 중") {
      calculatedStatus = "등록 중";
    } else {
      calculatedStatus = dateBasedStatus;
    }
  }

  return {
    id: campaign.id,
    campaign_number: format_campaign_number(campaign.id),
    partner_name: campaign.partnerName ?? "", // 파트너명 (데이터가 없으면 빈 문자열)
    campaign_name: campaign.title,
    type: "기자단",
    channel: map_brand_name_to_channel(
      (campaign as any).channel || campaign.brandName || "",
      "기자단"
    ),
    status: map_status_to_progress_status(calculatedStatus),
    recruit_count: campaign.recruitment?.total ?? 0,
    apply_count: applicantData?.applicants?.length ?? 0,
    point: (campaign as any).point || campaign.points || 0, // 지급 포인트 (point 또는 points 필드 사용)
    detail_campaign_id: campaign.id,
    created_at: parse_recruitment_start_date(recruitmentPeriod),
  };
}

/**
 * 구매평 캠페인 데이터를 CampaignProgressItem으로 변환
 *
 * @param campaign - 구매평 캠페인 데이터
 * @returns CampaignProgressItem | null
 *
 * 📌 주의:
 * - ReviewCampaignDataExtended는 campaignInfo 필드가 없고 직접 필드들을 가지고 있습니다.
 * - 따라서 campaign.campaignInfo 대신 campaign의 직접 필드들을 사용합니다.
 */
function convert_review_to_progress_item(
  campaign: ReviewCampaignDataItem
): CampaignProgressItem | null {
  // campaignInfo가 없는 경우 안전하게 처리
  // ReviewCampaignDataExtended는 직접 필드들을 가지고 있으므로 campaign 자체를 사용
  if (!campaign || !campaign.id) {
    return null;
  }

  const { applicantData } = campaign;

  // recruitmentPeriod 생성 (detailedSchedule에서)
  const recruitmentPeriod = campaign.detailedSchedule
    ? `${campaign.detailedSchedule.applicationStart} ~ ${campaign.detailedSchedule.applicationEnd}`
    : "";
  const announcementDate = campaign.detailedSchedule?.announcement;
  const registrationPeriod = campaign.detailedSchedule?.registrationPeriod;

  // 취소, 긴급 상태는 데이터에서 직접 가져오고, 그 외는 날짜 기반으로 계산
  let calculatedStatus: "진행 중" | "대기 중" | "모집 중" | "종료" | "취소" | "긴급";

  // isUrgent가 true이면 무조건 "긴급" 상태로 설정 (최우선)
  if (campaign.isUrgent === true) {
    calculatedStatus = "긴급";
  } else if (campaign.status === "취소" || campaign.status === "긴급") {
    calculatedStatus = campaign.status;
  } else {
    // 날짜 기반으로 상태 계산 (등록 기간 종료일도 확인)
    const dateBasedStatus = calculateCampaignStatus(
      recruitmentPeriod,
      announcementDate,
      registrationPeriod
    );
    calculatedStatus = dateBasedStatus;
  }

  return {
    id: campaign.id,
    campaign_number: format_campaign_number(campaign.id),
    partner_name: campaign.partnerName ?? "", // 파트너명 (데이터가 없으면 빈 문자열)
    campaign_name: campaign.title,
    type: "구매평",
    channel: map_brand_name_to_channel(
      (campaign as any).channel || campaign.brandName || "",
      "구매평"
    ),
    status: map_status_to_progress_status(calculatedStatus),
    recruit_count: campaign.recruitment?.total ?? 0,
    apply_count: applicantData?.applicants?.length ?? 0,
    point: (campaign as any).point || campaign.points || 0, // 지급 포인트 (point 또는 points 필드 사용)
    detail_campaign_id: campaign.id,
    created_at: parse_recruitment_start_date(recruitmentPeriod),
  };
}

/**
 * 방문형 캠페인 데이터를 CampaignProgressItem으로 변환
 *
 * @param campaign - 방문형 캠페인 데이터
 * @returns CampaignProgressItem | null
 *
 * 📌 주의:
 * - VisitCampaignDataExtended는 campaignInfo 필드가 없고 직접 필드들을 가지고 있습니다.
 * - 따라서 campaign.campaignInfo 대신 campaign의 직접 필드들을 사용합니다.
 */
function convert_visit_to_progress_item(
  campaign: VisitCampaignDataItem
): CampaignProgressItem | null {
  // campaignInfo가 없는 경우 안전하게 처리
  // VisitCampaignDataExtended는 직접 필드들을 가지고 있으므로 campaign 자체를 사용
  if (!campaign || !campaign.id) {
    return null;
  }

  const { applicantData } = campaign;

  // recruitmentPeriod 생성 (detailedSchedule에서)
  const recruitmentPeriod = campaign.detailedSchedule
    ? `${campaign.detailedSchedule.applicationStart} ~ ${campaign.detailedSchedule.applicationEnd}`
    : "";
  const announcementDate = campaign.detailedSchedule?.announcement;
  // 방문형은 purchasePeriod를 사용 (registrationPeriod가 없음)
  const registrationPeriod =
    (campaign.detailedSchedule as any)?.registrationPeriod ||
    (campaign.detailedSchedule as any)?.purchasePeriod;

  // 취소, 긴급 상태는 데이터에서 직접 가져오고, 그 외는 날짜 기반으로 계산
  let calculatedStatus: "진행 중" | "대기 중" | "모집 중" | "종료" | "취소" | "긴급";

  // isUrgent가 true이면 무조건 "긴급" 상태로 설정 (최우선)
  if (campaign.isUrgent === true) {
    calculatedStatus = "긴급";
  } else if (campaign.status === "취소" || campaign.status === "긴급") {
    calculatedStatus = campaign.status;
  } else {
    // 날짜 기반으로 상태 계산 (등록 기간 종료일도 확인)
    const dateBasedStatus = calculateCampaignStatus(
      recruitmentPeriod,
      announcementDate || "",
      registrationPeriod || ""
    );
    calculatedStatus = dateBasedStatus;
  }

  return {
    id: campaign.id,
    campaign_number: format_campaign_number(campaign.id),
    partner_name: campaign.partnerName ?? "", // 파트너명 (데이터가 없으면 빈 문자열)
    campaign_name: campaign.title,
    type: "방문형",
    channel: map_brand_name_to_channel(
      (campaign as any).channel || campaign.brandName || "",
      "방문형"
    ),
    status: map_status_to_progress_status(calculatedStatus),
    recruit_count: campaign.recruitment?.total ?? 0,
    apply_count: applicantData?.applicants?.length ?? 0,
    point: (campaign as any).point || campaign.points || 0, // 지급 포인트 (point 또는 points 필드 사용)
    detail_campaign_id: campaign.id,
    created_at: parse_recruitment_start_date(recruitmentPeriod),
  };
}

/* ========================================
   📋 캠페인 목록 데이터 (자동 생성)
   ======================================== */

/**
 * CampaignWithApplicants를 CampaignProgressItem으로 변환
 *
 * 설명:
 * - localStorage에 저장된 CampaignWithApplicants 형식의 캠페인을
 *   CampaignProgressItem으로 변환합니다.
 * - isUrgent 필드도 확인하여 "긴급" 상태로 변환합니다.
 */
function convert_campaign_with_applicants_to_progress_item(
  campaign: any
): CampaignProgressItem | null {
  if (!campaign || !campaign.campaignInfo || !campaign.campaignInfo.id) {
    return null;
  }

  const { campaignInfo, applicantData } = campaign;

  // isUrgent 필드 확인 (campaignInfo 또는 campaign 최상위에 있을 수 있음)
  const isUrgent = campaign.isUrgent === true || campaignInfo.isUrgent === true;

  // 상태 계산: localStorage 캠페인은 날짜 기반으로 상태를 재계산해야 함
  // 📌 중요: localStorage에 저장된 캠페인은 날짜가 변경될 수 있으므로 항상 재계산합니다
  let calculatedStatus: "진행 중" | "대기 중" | "모집 중" | "종료" | "취소" | "긴급";

  // isUrgent가 true이면 무조건 "긴급" 상태로 설정 (최우선)
  if (isUrgent) {
    calculatedStatus = "긴급";
  } else if (campaignInfo.status === "취소") {
    // 취소 상태는 그대로 유지
    calculatedStatus = "취소";
  } else {
    // 날짜 기반으로 상태 계산 (등록 기간 종료일도 확인)
    // localStorage 캠페인은 항상 날짜 기반으로 상태를 재계산합니다
    const dateBasedStatus = calculateCampaignStatus(
      campaignInfo.recruitmentPeriod,
      campaignInfo.announcementDate,
      campaignInfo.registrationPeriod
    );
    calculatedStatus = dateBasedStatus;
  }

  // Progress의 CampaignStatus로 변환
  // CampaignInfo의 status는 "대기 중" | "모집 중" | "진행 중" | "종료" | "취소" | "긴급"
  // Progress의 CampaignStatus는 "예정" | "신청" | "진행" | "종료" | "취소" | "긴급"
  let progressStatus: CampaignStatus;

  if (calculatedStatus === "긴급") {
    progressStatus = "긴급";
  } else if (calculatedStatus === "취소") {
    progressStatus = "취소";
  } else if (calculatedStatus === "종료") {
    progressStatus = "종료";
  } else if (calculatedStatus === "대기 중") {
    progressStatus = "예정";
  } else if (calculatedStatus === "모집 중") {
    progressStatus = "신청";
  } else if (calculatedStatus === "진행 중") {
    progressStatus = "진행";
  } else {
    // 기본값
    progressStatus = "진행";
  }

  // 캠페인 타입 확인 (미션형의 경우 채널 처리 방식이 다름)
  const campaignType = campaignInfo.campaignType as CampaignType;
  const isMissionType = campaignType === "미션형";

  // 채널 정보 추출: brandName 우선, 없으면 channel 필드 확인 (기자단 캠페인 등)
  const brandName = campaignInfo.brandName || (campaign as any).brandName || "";
  const channelField = (campaignInfo as any).channel || (campaign as any).channel || "";

  // brandName이 없고 channel 필드가 있으면 channel 필드를 brandName으로 사용
  const finalBrandName = brandName || channelField;

  // 채널 매핑: 미션형의 경우 항상 "Mission"으로 설정
  let finalChannel: Channel;
  if (isMissionType) {
    // 미션형은 항상 "Mission"으로 설정
    finalChannel = "Mission";
  } else if (finalBrandName) {
    finalChannel = map_brand_name_to_channel(finalBrandName, campaignType);
  } else {
    // brandName과 channel 필드 모두 없으면 기본값 (미션형이 아닌 경우만)
    finalChannel = "Store";
  }

  // 파트너명 추출: 여러 소스에서 시도
  let partnerName = (campaignInfo as any).partnerName || (campaign as any).partnerName || "";

  // partnerName이 없고 partner_id가 있으면 partner_accounts에서 찾기
  if (!partnerName && (campaign as any).partner_id) {
    try {
      if (typeof window !== "undefined") {
        const storedAccounts = localStorage.getItem("partner_accounts");
        if (storedAccounts) {
          const accounts = JSON.parse(storedAccounts);
          const partnerAccount = accounts.find((a: any) => a.id === (campaign as any).partner_id);
          if (partnerAccount) {
            // business_name 우선, 없으면 name 사용
            partnerName = partnerAccount.business_name || partnerAccount.name || "";
          }
        }
      }
    } catch (_error) {}
  }

  return {
    id: campaignInfo.id,
    campaign_number: format_campaign_number(campaignInfo.id),
    partner_name: partnerName,
    campaign_name: campaignInfo.title,
    type: campaignType,
    channel: finalChannel,
    status: progressStatus,
    recruit_count: campaignInfo.totalCount || 0,
    apply_count: applicantData?.applicants?.length || 0,
    // 지급 포인트: 미션형의 경우 campaign.points를 우선 확인, 그 외는 campaignInfo.point 우선
    // localStorage에 저장된 캠페인은 additionalPoints 필드를 사용할 수 있습니다
    // additionalPoints는 문자열일 수 있으므로 숫자로 변환합니다
    point: (() => {
      // 미션형의 경우 campaign.points를 우선 확인
      if (
        isMissionType &&
        (campaign as any).points !== undefined &&
        (campaign as any).points !== null
      ) {
        const pointsValue = (campaign as any).points;
        if (typeof pointsValue === "number" && pointsValue > 0) {
          return pointsValue;
        }
        if (typeof pointsValue === "string") {
          const parsed = parseInt(pointsValue.replace(/,/g, ""), 10);
          if (!isNaN(parsed) && parsed > 0) {
            return parsed;
          }
        }
      }

      // 1순위: campaignInfo.point
      if ((campaignInfo as any).point !== undefined && (campaignInfo as any).point !== null) {
        const pointValue = (campaignInfo as any).point;
        return typeof pointValue === "number" ? pointValue : Number(pointValue) || 0;
      }
      // 2순위: campaign.point
      if ((campaign as any).point !== undefined && (campaign as any).point !== null) {
        const pointValue = (campaign as any).point;
        return typeof pointValue === "number" ? pointValue : Number(pointValue) || 0;
      }
      // 3순위: campaign.points (복수형 - 정적 데이터에서 사용)
      if ((campaign as any).points !== undefined && (campaign as any).points !== null) {
        const pointsValue = (campaign as any).points;
        return typeof pointsValue === "number" ? pointsValue : Number(pointsValue) || 0;
      }
      // 4순위: campaignInfo.points (복수형)
      if ((campaignInfo as any).points !== undefined && (campaignInfo as any).points !== null) {
        const pointsValue = (campaignInfo as any).points;
        return typeof pointsValue === "number" ? pointsValue : Number(pointsValue) || 0;
      }
      // 5순위: additionalPoints (localStorage 캠페인에서 사용)
      if (
        (campaign as any).additionalPoints !== undefined &&
        (campaign as any).additionalPoints !== null
      ) {
        const additionalPointsValue = (campaign as any).additionalPoints;
        // 문자열인 경우 쉼표 제거 후 숫자로 변환
        if (typeof additionalPointsValue === "string") {
          const cleanedValue = additionalPointsValue.replace(/,/g, "");
          return parseInt(cleanedValue, 10) || 0;
        }
        return typeof additionalPointsValue === "number"
          ? additionalPointsValue
          : Number(additionalPointsValue) || 0;
      }
      return 0;
    })(),
    detail_campaign_id: campaignInfo.id,
    created_at: parse_recruitment_start_date(campaignInfo.recruitmentPeriod),
  };
}

/**
 * localStorage에서 캠페인을 가져와서 CampaignProgressItem으로 변환
 *
 * 설명:
 * - localStorage에 저장된 각 타입별 캠페인을 가져와서 CampaignProgressItem으로 변환합니다.
 * - CampaignWithApplicants 형식으로 저장된 캠페인도 처리합니다.
 * - 정적 데이터와 병합하여 통계에 포함시킵니다.
 */
function get_stored_campaigns_as_progress_items(): CampaignProgressItem[] {
  if (typeof window === "undefined") return [];

  const stored_items: CampaignProgressItem[] = [];

  try {
    // 배송형 캠페인
    const delivery_stored = localStorage.getItem("deliveryCampaigns");
    if (delivery_stored) {
      const campaigns: any[] = JSON.parse(delivery_stored);
      if (Array.isArray(campaigns)) {
        // CampaignWithApplicants 형식인지 확인
        campaigns.forEach((campaign) => {
          if (campaign.campaignInfo) {
            // CampaignWithApplicants 형식
            const converted = convert_campaign_with_applicants_to_progress_item(campaign);
            if (converted) stored_items.push(converted);
          } else if (campaign.campaignInfo?.id) {
            // DeliveryCampaignDataItem 형식 (하위 호환성)
            stored_items.push(convert_delivery_to_progress_item(campaign));
          }
        });
      }
    }

    // 미션형 캠페인
    const mission_stored = localStorage.getItem("missionCampaigns");
    if (mission_stored) {
      const campaigns: any[] = JSON.parse(mission_stored);
      if (Array.isArray(campaigns)) {
        campaigns.forEach((campaign) => {
          if (campaign.campaignInfo) {
            // CampaignWithApplicants 형식
            const converted = convert_campaign_with_applicants_to_progress_item(campaign);
            if (converted) stored_items.push(converted);
          } else if (campaign.id) {
            // MissionCampaignDataExtended 형식 (하위 호환성)
            const converted = convert_mission_to_progress_item(campaign);
            if (converted) stored_items.push(converted);
          }
        });
      }
    }

    // 기자단 캠페인
    const reporter_stored = localStorage.getItem("reporterCampaigns");
    if (reporter_stored) {
      const campaigns: any[] = JSON.parse(reporter_stored);
      if (Array.isArray(campaigns)) {
        campaigns.forEach((campaign) => {
          if (campaign.campaignInfo) {
            // CampaignWithApplicants 형식
            const converted = convert_campaign_with_applicants_to_progress_item(campaign);
            if (converted) stored_items.push(converted);
          } else if (campaign.id) {
            // ReporterCampaignDataExtended 형식 (하위 호환성)
            const converted = convert_reporter_to_progress_item(campaign);
            if (converted) stored_items.push(converted);
          }
        });
      }
    }

    // 구매평 캠페인
    const review_stored = localStorage.getItem("reviewCampaigns");
    if (review_stored) {
      const campaigns: any[] = JSON.parse(review_stored);
      if (Array.isArray(campaigns)) {
        campaigns.forEach((campaign) => {
          if (campaign.campaignInfo) {
            // CampaignWithApplicants 형식
            const converted = convert_campaign_with_applicants_to_progress_item(campaign);
            if (converted) stored_items.push(converted);
          } else if (campaign.id) {
            // ReviewCampaignDataExtended 형식 (하위 호환성)
            const converted = convert_review_to_progress_item(campaign);
            if (converted) stored_items.push(converted);
          }
        });
      }
    }

    // 방문형 캠페인
    const visit_stored = localStorage.getItem("visitCampaigns");
    if (visit_stored) {
      const campaigns: any[] = JSON.parse(visit_stored);
      if (Array.isArray(campaigns)) {
        campaigns.forEach((campaign) => {
          if (campaign.campaignInfo) {
            // CampaignWithApplicants 형식
            const converted = convert_campaign_with_applicants_to_progress_item(campaign);
            if (converted) stored_items.push(converted);
          } else if (campaign.id) {
            // VisitCampaignDataExtended 형식 (하위 호환성)
            const converted = convert_visit_to_progress_item(campaign);
            if (converted) stored_items.push(converted);
          }
        });
      }
    }
  } catch (_error) {}

  return stored_items;
}

/**
 * 각 캠페인 타입별 데이터를 CampaignProgressItem으로 변환하여 통합
 *
 * 설명:
 * - 배송형, 미션형, 기자단, 구매평, 방문형 캠페인 데이터를 모두 가져와서
 *   CampaignProgressItem 형태로 변환하여 하나의 배열로 통합합니다.
 * - localStorage에 저장된 새로 등록한 캠페인도 포함합니다.
 * - 이렇게 하면 각 캠페인 타입별 데이터를 수정하면 자동으로 진행 현황 목록이 업데이트됩니다.
 * - '긴급' 상태는 원본 데이터에 없으므로 직접 추가합니다.
 */
export function get_campaign_list(): CampaignProgressItem[] {
  // 정적 데이터 (목업 데이터)
  const static_campaigns: CampaignProgressItem[] = [
    // 배송형 캠페인 변환
    ...deliveryCampaigns.map(convert_delivery_to_progress_item),
    // 배송형 종료/취소 캠페인 변환 (deliveryClosedCampaignsExtended)
    ...deliveryClosedCampaignsExtended
      .map(convertExtendedToItem)
      .map(convert_delivery_to_progress_item),
    // 미션형 캠페인 변환 (null 값 필터링)
    ...missionCampaigns
      .map(convert_mission_to_progress_item)
      .filter((item): item is CampaignProgressItem => item !== null),
    // 기자단 캠페인 변환 (null 값 필터링)
    ...reporterCampaigns
      .map(convert_reporter_to_progress_item)
      .filter((item): item is CampaignProgressItem => item !== null),
    // 구매평 캠페인 변환 (null 값 필터링)
    ...reviewCampaigns
      .map(convert_review_to_progress_item)
      .filter((item): item is CampaignProgressItem => item !== null),
    // 방문형 캠페인 변환 (null 값 필터링)
    ...visitCampaigns
      .map(convert_visit_to_progress_item)
      .filter((item): item is CampaignProgressItem => item !== null),
  ];

  // localStorage에서 가져온 캠페인
  const stored_campaigns = get_stored_campaigns_as_progress_items();

  // 정적 데이터와 localStorage 데이터 병합
  // 중복 제거: 같은 ID가 있으면 localStorage 데이터 우선 (최신 데이터)
  const static_ids = new Set(static_campaigns.map((c) => c.id));
  const new_stored_campaigns = stored_campaigns.filter((c) => !static_ids.has(c.id));

  // localStorage에 있는 캠페인 중 정적 데이터에도 있는 것은 localStorage 버전으로 교체
  // 단, point 값이 0이거나 없는 경우 정적 데이터의 point 값을 유지
  const updated_static_campaigns = static_campaigns.map((static_campaign) => {
    const stored_campaign = stored_campaigns.find((c) => c.id === static_campaign.id);
    if (stored_campaign) {
      // localStorage 데이터가 있으면 사용하되, point가 0이거나 없으면 정적 데이터의 point 사용
      return {
        ...stored_campaign,
        point:
          stored_campaign.point && stored_campaign.point > 0
            ? stored_campaign.point
            : static_campaign.point,
      };
    }
    return static_campaign;
  });

  return [...updated_static_campaigns, ...new_stored_campaigns];
}

// campaign_list를 export (하위 호환성 유지)
// 정적 데이터만 포함하여 서버/클라이언트 간 일관성 유지
// localStorage 데이터가 필요한 경우 get_campaign_list() 함수를 사용하세요
export const campaign_list: CampaignProgressItem[] = (() => {
  // 정적 데이터만 반환 (localStorage 제외)
  const static_campaigns: CampaignProgressItem[] = [
    // 배송형 캠페인 변환
    ...deliveryCampaigns.map(convert_delivery_to_progress_item),
    // 배송형 종료/취소 캠페인 변환 (deliveryClosedCampaignsExtended)
    ...deliveryClosedCampaignsExtended
      .map(convertExtendedToItem)
      .map(convert_delivery_to_progress_item),
    // 미션형 캠페인 변환 (null 값 필터링)
    ...missionCampaigns
      .map(convert_mission_to_progress_item)
      .filter((item): item is CampaignProgressItem => item !== null),
    // 기자단 캠페인 변환 (null 값 필터링)
    ...reporterCampaigns
      .map(convert_reporter_to_progress_item)
      .filter((item): item is CampaignProgressItem => item !== null),
    // 구매평 캠페인 변환 (null 값 필터링)
    ...reviewCampaigns
      .map(convert_review_to_progress_item)
      .filter((item): item is CampaignProgressItem => item !== null),
    // 방문형 캠페인 변환 (null 값 필터링)
    ...visitCampaigns
      .map(convert_visit_to_progress_item)
      .filter((item): item is CampaignProgressItem => item !== null),
  ];
  return static_campaigns;
})();
