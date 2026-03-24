/* ========================================
   파트너 캠페인 목록 훅
   ======================================== */

/**
 * usePartnerCampaigns
 *
 * 목적: 파트너 캠페인 관리 페이지 데이터를 실제 백엔드 API 구조로 조회
 *
 * API:
 * - 13번: GET /partner/campaign_management → stats + 전체 캠페인
 * - 14번: GET /partner/campaign_management/{status} → 탭별 캠페인
 *
 * 사용 페이지:
 * - /partner/campaign_management (파트너 캠페인 관리)
 */

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getCampaignManagementPage,
  getCampaignsByStatus,
} from "@/lib/api/partnerCampaignManagement";
import { getBrandLogo } from "@/data/partner/utils/campaignHelpers";
import type {
  CampaignManagementItem,
  CampaignStatusItem,
  CampaignManagementStats,
} from "@/types/api/partnerCampaignManagement";
import {
  TAB_TO_API_STATUS,
  CAMPAIGN_TYPE_LABEL,
  PLATFORM_LABEL,
  STATUS_LABEL,
} from "@/types/api/partnerCampaignManagement";
import type { PartnerCampaign } from "@/types/domain/partner";

// ----------------------------------------
// 날짜 포맷 유틸
// ----------------------------------------
function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  // "2026-02-20 00:00:00" → "2026-02-20"
  return dateStr.slice(0, 10);
}

function formatPeriod(start: string, end: string): string {
  return `${formatDate(start)} ~ ${formatDate(end)}`;
}

function calcDaysLeft(targetDateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(targetDateStr);
  target.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

// ----------------------------------------
// subStatus 계산 (버튼 종류 결정)
// ----------------------------------------
function computeSubStatus(status: string, tab: string, selectedCount: number = 0): string {
  switch (tab) {
    case "예정":
      return "campaign_edit,campaign_delete";
    case "신청":
      return "campaign_edit,applicant_management";
    case "진행":
      // SELECTING(선정 중): 당첨자 선정 전 → "당첨자 선정" 버튼
      // PURCHASING(진행 중): 당첨자 선정 후 → "콘텐츠 확인" 버튼
      if (status === "PURCHASING" || selectedCount > 0) {
        return "content_review,content_approval";
      }
      return "winner_selection";
    case "종료":
      return "content_review,content_approval";
    case "취소":
      return "penalty";
    case "연장 요청":
      return "extension_request";
    default:
      // 전체 탭: status에 따라 결정
      switch (status) {
        case "REGISTERING":
          return "campaign_edit,campaign_delete";
        case "RECRUITING":
          return "campaign_edit,applicant_management";
        case "SELECTING":
          return "winner_selection";
        case "PURCHASING":
          return "content_review,content_approval";
        case "CLOSED":
          return "content_review,content_approval";
        case "EMERGENCY":
          return "penalty";
        default:
          return "campaign_edit,applicant_management";
      }
  }
}

// ----------------------------------------
// status → 프론트 탭 역매핑 (전체 탭에서 사용)
// ----------------------------------------
function statusToTab(status: string): string {
  switch (status) {
    case "REGISTERING":
      return "예정";
    case "RECRUITING":
      return "신청";
    case "SELECTING":
    case "PURCHASING":
      return "진행";
    case "CLOSED":
      return "종료";
    case "EMERGENCY":
      return "취소";
    default:
      return "전체";
  }
}

// ----------------------------------------
// API 13 아이템 → PartnerCampaign 어댑터
// (API 13: `id` 필드 사용)
// ----------------------------------------
function adaptManagementItem(item: CampaignManagementItem, tab: string): PartnerCampaign {
  const campaignType = (CAMPAIGN_TYPE_LABEL[item.campaignType] ??
    "배송형") as PartnerCampaign["campaignType"];
  const brandName = PLATFORM_LABEL[item.platform] ?? item.platform ?? "";
  const currentTab = tab === "전체" ? statusToTab(item.status) : tab;
  const selectedCount = item.selectedCount ?? 0;

  return {
    id: String(item.id),
    title: item.title,
    image: item.thumbnailUrl ?? "",
    status: (STATUS_LABEL[item.status] ?? "대기 중") as PartnerCampaign["status"],
    campaignType,
    category: item.category ?? "",
    brandName,
    brandLogo: getBrandLogo(brandName, campaignType),
    recruitmentPeriod: formatPeriod(item.applicationStartDate, item.applicationEndDate),
    announcementDate: formatDate(item.campaignStartDate),
    registrationPeriod: formatPeriod(item.campaignStartDate, item.campaignEndDate),
    recruitedCount: item.currentApplicants ?? 0,
    totalCount: item.recruitCount ?? 0,
    applicants: item.currentApplicants ?? 0,
    recruits: item.recruitCount ?? 0,
    selected: selectedCount,
    daysLeft: calcDaysLeft(item.applicationEndDate),
    subStatus: computeSubStatus(item.status, currentTab, selectedCount),
    extensionRequested: item.extensionRequested ?? false,
    extensionRequestCount: item.extensionRequestCount ?? 0,
    waitingCount: item.waitingCount ?? 0,
    submittedCount: item.submittedCount ?? 0,
    approvedCount: item.approvedCount ?? 0,
  };
}

// ----------------------------------------
// API 14 아이템 → PartnerCampaign 어댑터
// (API 14: `campaignId` 필드 사용)
// ----------------------------------------
function adaptStatusItem(item: CampaignStatusItem, tab: string): PartnerCampaign {
  const campaignType = (CAMPAIGN_TYPE_LABEL[item.campaignType] ??
    "배송형") as PartnerCampaign["campaignType"];
  const brandName = PLATFORM_LABEL[item.platform] ?? item.platform ?? "";
  const currentTab = tab === "전체" ? statusToTab(item.status) : tab;
  const selectedCount = item.selectedCount ?? 0;

  return {
    id: String(item.campaignId),
    title: item.title,
    image: item.thumbnailUrl ?? "",
    status: (STATUS_LABEL[item.status] ?? "대기 중") as PartnerCampaign["status"],
    campaignType,
    category: item.category ?? "",
    brandName,
    brandLogo: getBrandLogo(brandName, campaignType),
    recruitmentPeriod: formatPeriod(item.applicationStartDate, item.applicationEndDate),
    announcementDate: formatDate(item.campaignStartDate),
    registrationPeriod: formatPeriod(item.campaignStartDate, item.campaignEndDate),
    recruitedCount: item.currentApplicants ?? 0,
    totalCount: item.recruitCount ?? 0,
    applicants: item.currentApplicants ?? 0,
    recruits: item.recruitCount ?? 0,
    selected: selectedCount,
    daysLeft: calcDaysLeft(item.applicationEndDate),
    subStatus: computeSubStatus(item.status, currentTab, selectedCount),
    extensionRequested: item.extensionRequested ?? false,
    extensionRequestCount: item.extensionRequestCount ?? 0,
    waitingCount: item.waitingCount ?? 0,
    submittedCount: item.submittedCount ?? 0,
    approvedCount: item.approvedCount ?? 0,
  };
}

// ----------------------------------------
// stats → 프론트엔드 형식 변환
// ----------------------------------------
function adaptStats(stats: CampaignManagementStats): Record<string, number> {
  return {
    전체: stats.totalCount,
    예정: stats.scheduledCount,
    신청: stats.applicationCount,
    진행: stats.ongoingCount,
    종료: stats.completedCount,
    취소: stats.canceledCount,
    "연장 요청": stats.extensionRequestCount,
    패널티: 0,
  };
}

// ========================================
// 메인 훅
// ========================================
export function usePartnerCampaigns(tab: string) {
  const apiStatus = TAB_TO_API_STATUS[tab] ?? "all";

  // API 13: stats 조회 (한 번만, 모든 탭에서 공유)
  const { data: pageData, isLoading: isStatsLoading } = useQuery({
    queryKey: ["partnerCampaignManagement"],
    queryFn: getCampaignManagementPage,
    staleTime: 30_000,
  });

  // API 14: 탭별 캠페인 조회
  // 전체 탭(all)은 API 13 응답을 사용하므로 API 14는 비전체 탭에서만 호출
  const isAllTab = tab === "전체";
  const { data: statusData, isLoading: isCampaignsLoading } = useQuery({
    queryKey: ["partnerCampaignsByStatus", apiStatus],
    queryFn: () => getCampaignsByStatus({ status: apiStatus }),
    enabled: !isAllTab,
    staleTime: 30_000,
  });

  // 캠페인 리스트 변환
  const campaigns = useMemo<PartnerCampaign[]>(() => {
    if (isAllTab) {
      // 전체 탭: API 13 응답 사용
      const items = pageData?.data?.campaigns;
      if (!items) return [];
      return items.map((item) => adaptManagementItem(item, tab));
    }
    // 개별 탭: API 14 응답 사용
    const items = statusData?.data?.campaigns;
    if (!items) return [];
    return items.map((item) => adaptStatusItem(item, tab));
  }, [isAllTab, pageData, statusData, tab]);

  // stats 변환
  const stats = useMemo<Record<string, number>>(() => {
    const apiStats = pageData?.data?.stats;
    if (!apiStats) {
      return { 전체: 0, 예정: 0, 신청: 0, 진행: 0, 종료: 0, 취소: 0, "연장 요청": 0, 패널티: 0 };
    }
    return adaptStats(apiStats);
  }, [pageData]);

  const isLoading = isStatsLoading || (!isAllTab && isCampaignsLoading);

  return { campaigns, stats, isLoading };
}
