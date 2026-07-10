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
 * - 14번: GET /partner/campaign_management/{status} → 탭별 캠페인 (무한 스크롤)
 *
 * 사용 페이지:
 * - /partner/campaign_management (파트너 캠페인 관리)
 */

import { useMemo } from "react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
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

const PAGE_SIZE = 20;

// ----------------------------------------
// 날짜 포맷 유틸
// ----------------------------------------
function formatDate(dateStr: string): string {
  if (!dateStr) return "";
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
// 정적 fallback 데이터 (API 없을 때 사용)
// ========================================
const STATIC_PARTNER_CAMPAIGNS: PartnerCampaign[] = [
  {
    id: "961",
    title: "프리미엄 스킨케어 세트 체험단",
    image: "/images/main/campaign_img/eximg_7.png",
    status: "모집 중",
    campaignType: "배송형",
    category: "뷰티",
    brandName: "네이버 블로그",
    recruitmentPeriod: "2026-06-01 ~ 2026-07-15",
    announcementDate: "2026-07-16",
    registrationPeriod: "2026-07-17 ~ 2026-07-31",
    recruitedCount: 18,
    totalCount: 30,
    daysLeft: 5,
    applicants: 18,
    recruits: 30,
    selected: 0,
    subStatus: "campaign_edit,applicant_management",
  },
  {
    id: "4001",
    title: "스킨케어 미션형",
    image: "/images/main/campaign_img/eximg_7.png",
    status: "대기 중",
    campaignType: "미션형",
    category: "뷰티",
    brandName: "인스타그램",
    recruitmentPeriod: "2026-08-01 ~ 2026-08-20",
    announcementDate: "2026-08-21",
    registrationPeriod: "2026-08-22 ~ 2026-09-05",
    recruitedCount: 0,
    totalCount: 15,
    daysLeft: 30,
    applicants: 0,
    recruits: 15,
    selected: 0,
    subStatus: "campaign_edit,campaign_delete",
  },
  {
    id: "3001",
    title: "테크 기자단",
    image: "/images/main/campaign_img/eximg_6.png",
    status: "진행 중",
    campaignType: "기자단",
    category: "디지털",
    brandName: "릴스",
    recruitmentPeriod: "2026-03-25 ~ 2026-04-20",
    announcementDate: "2026-04-21",
    registrationPeriod: "2026-05-01 ~ 2026-07-25",
    recruitedCount: 3,
    totalCount: 3,
    daysLeft: 0,
    applicants: 3,
    recruits: 3,
    selected: 3,
    subStatus: "content_review,content_approval",
    waitingCount: 1,
    submittedCount: 1,
    approvedCount: 1,
  },
  {
    id: "4060",
    title: "자동차 시승 기자단",
    image: "/images/main/campaign_img/eximg_1.png",
    status: "종료",
    campaignType: "기자단",
    category: "여가",
    brandName: "유튜브",
    recruitmentPeriod: "2026-03-01 ~ 2026-03-30",
    announcementDate: "2026-04-01",
    registrationPeriod: "2026-04-05 ~ 2026-04-30",
    recruitedCount: 19,
    totalCount: 19,
    daysLeft: 0,
    applicants: 35,
    recruits: 19,
    selected: 19,
    subStatus: "content_review,content_approval",
    waitingCount: 0,
    submittedCount: 2,
    approvedCount: 17,
  },
  {
    id: "1001",
    title: "식당 방문 리뷰",
    image: "/images/main/campaign_img/eximg_11.png",
    status: "모집 중",
    campaignType: "방문형",
    category: "식품",
    brandName: "네이버 블로그",
    recruitmentPeriod: "2026-06-15 ~ 2026-07-20",
    announcementDate: "2026-07-21",
    registrationPeriod: "2026-07-22 ~ 2026-08-10",
    recruitedCount: 22,
    totalCount: 30,
    daysLeft: 10,
    applicants: 22,
    recruits: 30,
    selected: 0,
    subStatus: "campaign_edit,applicant_management",
  },
  {
    id: "4029",
    title: "무선이어폰 리뷰",
    image: "/images/main/campaign_img/eximg_6.png",
    status: "종료",
    campaignType: "구매평",
    category: "디지털",
    brandName: "유튜브",
    recruitmentPeriod: "2026-03-01 ~ 2026-04-12",
    announcementDate: "2026-04-13",
    registrationPeriod: "2026-04-14 ~ 2026-05-10",
    recruitedCount: 20,
    totalCount: 20,
    daysLeft: 0,
    applicants: 45,
    recruits: 20,
    selected: 20,
    subStatus: "content_review,content_approval",
    waitingCount: 0,
    submittedCount: 3,
    approvedCount: 17,
  },
  {
    id: "4026",
    title: "충전 케이블 세트 리뷰",
    image: "/images/main/campaign_img/eximg_6.png",
    status: "취소",
    campaignType: "구매평",
    category: "디지털",
    brandName: "인스타그램",
    recruitmentPeriod: "2026-03-01 ~ 2026-04-10",
    announcementDate: "2026-04-11",
    registrationPeriod: "2026-04-12 ~ 2026-05-05",
    recruitedCount: 8,
    totalCount: 10,
    daysLeft: 0,
    applicants: 12,
    recruits: 10,
    selected: 8,
    subStatus: "penalty",
  },
  {
    id: "4038",
    title: "DIY 인테리어 미션",
    image: "/images/main/campaign_img/eximg_3.png",
    status: "진행 중",
    campaignType: "미션형",
    category: "생활",
    brandName: "네이버 블로그",
    recruitmentPeriod: "2026-03-10 ~ 2026-04-13",
    announcementDate: "2026-04-14",
    registrationPeriod: "2026-04-15 ~ 2026-06-13",
    recruitedCount: 10,
    totalCount: 10,
    daysLeft: 0,
    applicants: 28,
    recruits: 10,
    selected: 10,
    subStatus: "content_review,content_approval",
    waitingCount: 3,
    submittedCount: 4,
    approvedCount: 3,
  },
  {
    id: "4032",
    title: "디톡스 주스 클렌즈",
    image: "/images/main/campaign_img/eximg_10.png",
    status: "대기 중",
    campaignType: "배송형",
    category: "식품",
    brandName: "인스타그램",
    recruitmentPeriod: "2026-08-10 ~ 2026-08-30",
    announcementDate: "2026-08-31",
    registrationPeriod: "2026-09-01 ~ 2026-09-20",
    recruitedCount: 0,
    totalCount: 20,
    daysLeft: 50,
    applicants: 0,
    recruits: 20,
    selected: 0,
    subStatus: "campaign_edit,campaign_delete",
  },
  {
    id: "4039",
    title: "천연 립밤 컬렉션",
    image: "/images/main/campaign_img/eximg_9.png",
    status: "모집 중",
    campaignType: "배송형",
    category: "뷰티",
    brandName: "네이버 블로그",
    recruitmentPeriod: "2026-06-20 ~ 2026-07-25",
    announcementDate: "2026-07-26",
    registrationPeriod: "2026-07-27 ~ 2026-08-15",
    recruitedCount: 12,
    totalCount: 25,
    daysLeft: 15,
    applicants: 12,
    recruits: 25,
    selected: 0,
    subStatus: "campaign_edit,applicant_management",
  },
  {
    id: "4040",
    title: "뷰티 트렌드 리포팅",
    image: "/images/main/campaign_img/eximg_12.png",
    status: "종료",
    campaignType: "기자단",
    category: "뷰티",
    brandName: "인스타그램",
    recruitmentPeriod: "2026-02-01 ~ 2026-03-01",
    announcementDate: "2026-03-02",
    registrationPeriod: "2026-03-03 ~ 2026-04-30",
    recruitedCount: 8,
    totalCount: 8,
    daysLeft: 0,
    applicants: 21,
    recruits: 8,
    selected: 8,
    subStatus: "content_review,content_approval",
    waitingCount: 0,
    submittedCount: 0,
    approvedCount: 8,
  },
  {
    id: "4044",
    title: "판교 IT카페 리뷰",
    image: "/images/main/campaign_img/eximg_5.png",
    status: "모집 중",
    campaignType: "방문형",
    category: "카페",
    brandName: "네이버 블로그",
    recruitmentPeriod: "2026-07-01 ~ 2026-07-31",
    announcementDate: "2026-08-01",
    registrationPeriod: "2026-08-02 ~ 2026-08-20",
    recruitedCount: 5,
    totalCount: 15,
    daysLeft: 21,
    applicants: 5,
    recruits: 15,
    selected: 0,
    subStatus: "campaign_edit,applicant_management",
  },
  {
    id: "4056",
    title: "디톡스 주스 클렌즈 기자단",
    image: "/images/main/campaign_img/eximg_10.png",
    status: "진행 중",
    campaignType: "기자단",
    category: "식품",
    brandName: "유튜브",
    recruitmentPeriod: "2026-04-01 ~ 2026-05-01",
    announcementDate: "2026-05-02",
    registrationPeriod: "2026-05-03 ~ 2026-06-30",
    recruitedCount: 6,
    totalCount: 6,
    daysLeft: 0,
    applicants: 15,
    recruits: 6,
    selected: 6,
    subStatus: "winner_selection",
  },
  {
    id: "4059",
    title: "육아 용품 기자단",
    image: "/images/main/campaign_img/eximg_2.png",
    status: "대기 중",
    campaignType: "기자단",
    category: "육아",
    brandName: "네이버 블로그",
    recruitmentPeriod: "2026-09-01 ~ 2026-09-20",
    announcementDate: "2026-09-21",
    registrationPeriod: "2026-09-22 ~ 2026-10-10",
    recruitedCount: 0,
    totalCount: 10,
    daysLeft: 70,
    applicants: 0,
    recruits: 10,
    selected: 0,
    subStatus: "campaign_edit,campaign_delete",
  },
  {
    id: "902",
    title: "[긴급] 상품 구매 체험단",
    image: "/images/main/campaign_img/eximg_9.png",
    status: "취소",
    campaignType: "배송형",
    category: "뷰티",
    brandName: "릴스",
    recruitmentPeriod: "2026-05-01 ~ 2026-06-30",
    announcementDate: "2026-07-01",
    registrationPeriod: "2026-07-02 ~ 2026-07-20",
    recruitedCount: 25,
    totalCount: 30,
    daysLeft: 0,
    applicants: 40,
    recruits: 30,
    selected: 25,
    subStatus: "penalty",
  },
];

const STATIC_STATS = {
  전체: 15,
  예정: 3,
  신청: 4,
  진행: 3,
  종료: 3,
  취소: 2,
  "연장 요청": 0,
  패널티: 0,
};

function filterStaticByTab(tab: string): PartnerCampaign[] {
  if (tab === "전체") return STATIC_PARTNER_CAMPAIGNS;
  const statusMap: Record<string, PartnerCampaign["status"][]> = {
    예정: ["대기 중"],
    신청: ["모집 중"],
    진행: ["선정 중", "진행 중"],
    종료: ["종료", "마감"],
    취소: ["취소"],
    "연장 요청": [],
  };
  const allowed = statusMap[tab] ?? [];
  return STATIC_PARTNER_CAMPAIGNS.filter((c) => allowed.includes(c.status));
}

// ========================================
// 메인 훅
// ========================================
export function usePartnerCampaigns(tab: string) {
  const apiStatus = TAB_TO_API_STATUS[tab] ?? "all";
  const isAllTab = tab === "전체";

  // API 13: stats 조회 (한 번만, 모든 탭에서 공유)
  const { data: pageData, isLoading: isStatsLoading } = useQuery({
    queryKey: ["partnerCampaignManagement"],
    queryFn: async () => {
      try {
        return await getCampaignManagementPage();
      } catch (_e) {
        return null;
      }
    },
    staleTime: 30_000,
  });

  // API 14: 탭별 캠페인 무한 스크롤 조회
  const {
    data: statusData,
    isLoading: isCampaignsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["partnerCampaignsByStatus", apiStatus],
    queryFn: async ({ pageParam }) => {
      try {
        return await getCampaignsByStatus({
          status: apiStatus,
          page: pageParam as number,
          size: PAGE_SIZE,
        });
      } catch (_e) {
        return null;
      }
    },
    getNextPageParam: (lastPage) => {
      if (lastPage?.data?.hasNext) return lastPage.data.currentPage + 1;
      return undefined;
    },
    initialPageParam: 0,
    enabled: !isAllTab,
    staleTime: 30_000,
    retry: false,
  });

  // 캠페인 리스트 변환
  const campaigns = useMemo<PartnerCampaign[]>(() => {
    if (isAllTab) {
      const items = pageData?.data?.campaigns;
      if (items && items.length > 0) return items.map((item) => adaptManagementItem(item, tab));
      return filterStaticByTab(tab);
    }
    const allItems = statusData?.pages.flatMap((page) => page?.data?.campaigns ?? []) ?? [];
    if (allItems.length > 0) return allItems.map((item) => adaptStatusItem(item, tab));
    return filterStaticByTab(tab);
  }, [isAllTab, pageData, statusData, tab]);

  // stats 변환
  const stats = useMemo<Record<string, number>>(() => {
    const apiStats = pageData?.data?.stats;
    if (apiStats) return adaptStats(apiStats);
    return STATIC_STATS;
  }, [pageData]);

  const isLoading = isStatsLoading || (!isAllTab && isCampaignsLoading);

  return {
    campaigns,
    stats,
    isLoading,
    fetchNextPage,
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
  };
}
