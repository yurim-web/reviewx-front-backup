/* ========================================
   📊 SA 관리자 진행 현황 목업 데이터
   ======================================== */

/**
 * SA 관리자 진행 현황 목업 데이터
 *
 * 목적: SA 관리자 진행 현황 페이지에서 사용하는 임시 목업 데이터입니다.
 *
 * 사용 페이지:
 * - /manager_sa/campaign/progress (진행 현황 페이지)
 *
 * 주요 기능:
 * - 캠페인 통계 데이터
 * - 캠페인 목록 데이터 (각 캠페인 타입별 데이터에서 자동 생성)
 *
 */

// 각 캠페인 타입별 데이터 import
import { deliveryCampaignsExtended, type DeliveryCampaignDataExtended } from "@/data/campaign/delivery/deliveryCampaigns";
import { missionCampaignsExtended as missionCampaigns } from "@/data/campaign/mission/missionCampaigns";
import { reporterCampaignsExtended as reporterCampaigns } from "@/data/campaign/reporter/reporterCampaigns";
import { reviewCampaignsExtended as reviewCampaigns } from "@/data/campaign/review/reviewCampaigns";
import { visitCampaignsExtended as visitCampaigns } from "@/data/campaign/visit/visitCampaigns";
import type { DeliveryCampaignDataItem } from "@/data/campaign/delivery/deliveryCampaigns";

/**
 * DeliveryCampaignDataExtended를 DeliveryCampaignDataItem으로 변환
 */
function convertExtendedToItem(extended: DeliveryCampaignDataExtended): DeliveryCampaignDataItem {
  return {
    campaignInfo: {
      id: extended.id,
      title: extended.title,
      image: extended.image,
      status: extended.status || "대기 중",
      campaignType: "배송형",
      category: extended.subcategory || "",
      brandName: extended.brandName || extended.channel || "",
      recruitmentPeriod: `${extended.detailedSchedule.applicationStart} ~ ${extended.detailedSchedule.applicationEnd}`,
      announcementDate: extended.detailedSchedule.announcement,
      registrationPeriod: extended.detailedSchedule.registrationPeriod,
      recruitedCount: extended.recruitment.current || 0,
      totalCount: extended.recruitment.total || 0,
      daysLeft: 0,
      statusText: extended.statusText,
      partnerName: extended.partnerName,
      point: extended.points,
    },
    applicantData: extended.applicantData,
    contents: extended.contents,
  };
}

// deliveryCampaignsExtended를 DeliveryCampaignDataItem 형식으로 변환
const deliveryCampaigns: DeliveryCampaignDataItem[] = deliveryCampaignsExtended.map(convertExtendedToItem);
import type { MissionCampaignDataExtended as MissionCampaignDataItem } from "@/data/campaign/mission/missionCampaigns";
import type { ReporterCampaignDataExtended as ReporterCampaignDataItem } from "@/data/campaign/reporter/reporterCampaigns";
import type { ReviewCampaignDataExtended as ReviewCampaignDataItem } from "@/data/campaign/review/reviewCampaigns";
import type { VisitCampaignDataExtended as VisitCampaignDataItem } from "@/data/campaign/visit/visitCampaigns";

// 공통 필터 옵션에서 import (manager_ga와 manager_sa 공통)
import type {
  CampaignStatus,
  CampaignType,
  Channel,
} from "@/data/manager/common/filterOptions";

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
 * - 취소된 캠페인은 원본 데이터에서 직접 확인합니다
 * - 숫자를 천 단위로 포맷팅하여 반환합니다
 *
 */
export function calculate_stat_card_values() {
  // 오픈 예정 캠페인 (status가 '예정'인 것)
  const open_scheduled_count = campaign_list.filter(
    (campaign) => campaign.status === "예정"
  ).length;

  // 진행 중인 캠페인 (status가 '진행'인 것)
  const in_progress_count = campaign_list.filter(
    (campaign) => campaign.status === "진행"
  ).length;

  // 신청 중인 캠페인 (status가 '신청'인 것)
  const applying_count = campaign_list.filter(
    (campaign) => campaign.status === "신청"
  ).length;

  // 전체 캠페인
  const total_count = campaign_list.length;

  // 종료된 캠페인 (status가 '종료'인 것)
  const ended_count = campaign_list.filter(
    (campaign) => campaign.status === "종료"
  ).length;

  // 취소된 캠페인 (status가 '취소'인 것)
  const cancelled_count = campaign_list.filter(
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
function map_brand_name_to_channel(
  brandName: string,
  campaignType: CampaignType
): Channel {
  // 미션형은 brandName이 빈 문자열이므로 'Mission'으로 변환
  if (campaignType === "미션형" && !brandName) {
    return "Mission";
  }

  // 브랜드명 매핑
  const brand_map: Record<string, Channel> = {
    네이버블로그: "Blog",
    인스타그램: "Instagram",
    네이버클립: "Clip",
    유튜브: "Youtube",
    릴스: "Reels",
    쇼츠: "Shorts",
    스토어: "Store",
    기본: "Store", // 기본값은 Store로 설정
  };

  return brand_map[brandName] || "Store";
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
  status: "진행 중" | "대기 중" | "모집 중" | "종료" | "취소" | "긴급"
): CampaignStatus {
  const status_map: Record<
    "진행 중" | "대기 중" | "모집 중" | "종료" | "취소" | "긴급",
    CampaignStatus
  > = {
    "대기 중": "예정",
    "모집 중": "신청",
    "진행 중": "진행",
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
function parse_recruitment_start_date(
  recruitmentPeriod: string | undefined
): Date | undefined {
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

  return {
    id: campaignInfo.id,
    campaign_number: format_campaign_number(campaignInfo.id),
    partner_name: campaignInfo.partnerName ?? "", // 파트너명 (데이터가 없으면 빈 문자열)
    campaign_name: campaignInfo.title,
    type: "배송형",
    channel: map_brand_name_to_channel(campaignInfo.brandName, "배송형"),
    status: map_status_to_progress_status(campaignInfo.status),
    recruit_count: campaignInfo.totalCount,
    apply_count: applicantData?.applicants?.length ?? 0,
    point: campaignInfo.point ?? 0, // 지급 포인트 (데이터에 없으면 0)
    detail_campaign_id: campaignInfo.id,
    created_at: parse_recruitment_start_date(campaignInfo.recruitmentPeriod),
  };
}

/**
 * 미션형 캠페인 데이터를 CampaignProgressItem으로 변환
 *
 * @param campaign - 미션형 캠페인 데이터
 * @returns CampaignProgressItem
 */
function convert_mission_to_progress_item(
  campaign: MissionCampaignDataItem
): CampaignProgressItem {
  const { campaignInfo, applicantData } = campaign;

  return {
    id: campaignInfo.id,
    campaign_number: format_campaign_number(campaignInfo.id),
    partner_name: campaignInfo.partnerName ?? "", // 파트너명 (데이터가 없으면 빈 문자열)
    campaign_name: campaignInfo.title,
    type: "미션형",
    channel: map_brand_name_to_channel(campaignInfo.brandName, "미션형"),
    status: map_status_to_progress_status(campaignInfo.status),
    recruit_count: campaignInfo.totalCount,
    apply_count: applicantData?.applicants?.length ?? 0,
    point: campaignInfo.point ?? 0, // 지급 포인트 (데이터에 없으면 0)
    detail_campaign_id: campaignInfo.id,
    created_at: parse_recruitment_start_date(campaignInfo.recruitmentPeriod),
  };
}

/**
 * 기자단 캠페인 데이터를 CampaignProgressItem으로 변환
 *
 * @param campaign - 기자단 캠페인 데이터
 * @returns CampaignProgressItem
 */
function convert_reporter_to_progress_item(
  campaign: ReporterCampaignDataItem
): CampaignProgressItem {
  const { campaignInfo, applicantData } = campaign;

  return {
    id: campaignInfo.id,
    campaign_number: format_campaign_number(campaignInfo.id),
    partner_name: campaignInfo.partnerName ?? "", // 파트너명 (데이터가 없으면 빈 문자열)
    campaign_name: campaignInfo.title,
    type: "기자단",
    channel: map_brand_name_to_channel(campaignInfo.brandName, "기자단"),
    status: map_status_to_progress_status(campaignInfo.status),
    recruit_count: campaignInfo.totalCount,
    apply_count: applicantData?.applicants?.length ?? 0,
    point: campaignInfo.point ?? 0, // 지급 포인트 (데이터에 없으면 0)
    detail_campaign_id: campaignInfo.id,
    created_at: parse_recruitment_start_date(campaignInfo.recruitmentPeriod),
  };
}

/**
 * 구매평 캠페인 데이터를 CampaignProgressItem으로 변환
 *
 * @param campaign - 구매평 캠페인 데이터
 * @returns CampaignProgressItem
 */
function convert_review_to_progress_item(
  campaign: ReviewCampaignDataItem
): CampaignProgressItem {
  const { campaignInfo, applicantData } = campaign;

  return {
    id: campaignInfo.id,
    campaign_number: format_campaign_number(campaignInfo.id),
    partner_name: campaignInfo.partnerName ?? "", // 파트너명 (데이터가 없으면 빈 문자열)
    campaign_name: campaignInfo.title,
    type: "구매평",
    channel: map_brand_name_to_channel(campaignInfo.brandName, "구매평"),
    status: map_status_to_progress_status(campaignInfo.status),
    recruit_count: campaignInfo.totalCount,
    apply_count: applicantData?.applicants?.length ?? 0,
    point: campaignInfo.point ?? 0, // 지급 포인트 (데이터에 없으면 0)
    detail_campaign_id: campaignInfo.id,
    created_at: parse_recruitment_start_date(campaignInfo.recruitmentPeriod),
  };
}

/**
 * 방문형 캠페인 데이터를 CampaignProgressItem으로 변환
 *
 * @param campaign - 방문형 캠페인 데이터
 * @returns CampaignProgressItem
 */
function convert_visit_to_progress_item(
  campaign: VisitCampaignDataItem
): CampaignProgressItem {
  const { campaignInfo, applicantData } = campaign;

  return {
    id: campaignInfo.id,
    campaign_number: format_campaign_number(campaignInfo.id),
    partner_name: campaignInfo.partnerName ?? "", // 파트너명 (데이터가 없으면 빈 문자열)
    campaign_name: campaignInfo.title,
    type: "방문형",
    channel: map_brand_name_to_channel(campaignInfo.brandName, "방문형"),
    status: map_status_to_progress_status(campaignInfo.status),
    recruit_count: campaignInfo.totalCount,
    apply_count: applicantData?.applicants?.length ?? 0,
    point: campaignInfo.point ?? 0, // 지급 포인트 (데이터에 없으면 0)
    detail_campaign_id: campaignInfo.id,
    created_at: parse_recruitment_start_date(campaignInfo.recruitmentPeriod),
  };
}

/* ========================================
   📋 캠페인 목록 데이터 (자동 생성)
   ======================================== */

/**
 * 각 캠페인 타입별 데이터를 CampaignProgressItem으로 변환하여 통합
 *
 * 설명:
 * - 배송형, 미션형, 기자단, 구매평, 방문형 캠페인 데이터를 모두 가져와서
 *   CampaignProgressItem 형태로 변환하여 하나의 배열로 통합합니다.
 * - 이렇게 하면 각 캠페인 타입별 데이터를 수정하면 자동으로 진행 현황 목록이 업데이트됩니다.
 * - '긴급' 상태는 원본 데이터에 없으므로 직접 추가합니다.
 */
export const campaign_list: CampaignProgressItem[] = [
  // 배송형 캠페인 변환
  ...deliveryCampaigns.map(convert_delivery_to_progress_item),
  // 미션형 캠페인 변환
  ...missionCampaigns.map(convert_mission_to_progress_item),
  // 기자단 캠페인 변환
  ...reporterCampaigns.map(convert_reporter_to_progress_item),
  // 구매평 캠페인 변환
  ...reviewCampaigns.map(convert_review_to_progress_item),
  // 방문형 캠페인 변환
  ...visitCampaigns.map(convert_visit_to_progress_item),
];
