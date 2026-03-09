/* ========================================
   파트너 캠페인 목록 훅
   ======================================== */

/**
 * usePartnerCampaigns
 *
 * 목적: 파트너 캠페인 목록을 mock API(json-server)에서 로드하고
 *       PartnerCampaign 타입으로 변환하여 반환합니다.
 *
 * 사용 페이지:
 * - /partner/campaign_management (파트너 캠페인 관리)
 *
 * 전략: DB(json-server) 데이터만 사용
 */

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { fetchPartnerCampaigns } from "@/lib/api/partner";
import { getBrandLogo } from "@/data/partner/utils/campaignHelpers";
import type { PartnerCampaignApiItem } from "@/types/api/partner";
import type { PartnerCampaign } from "@/types/domain/partner";

// ----------------------------------------
// 파트너 ID 매핑 (mock 전용)
// ----------------------------------------
function getPartnerId(userId: string): number {
  if (userId === "partner_test_001") return 1;
  if (userId === "partner_test_002") return 2;
  return 1;
}

// ----------------------------------------
// 날짜 포맷 유틸
// ----------------------------------------
function formatDate(iso: string): string {
  return iso.slice(0, 10); // "2026-02-20"
}

function formatPeriod(startIso: string, endIso: string): string {
  return `${formatDate(startIso)} ~ ${formatDate(endIso)}`;
}

function calcDaysLeft(targetIso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(targetIso);
  target.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

// ----------------------------------------
// API type → 캠페인 유형 (한글)
// ----------------------------------------
const CAMPAIGN_TYPE_MAP: Record<string, PartnerCampaign["campaignType"]> = {
  DELIVERY: "배송형",
  VISIT: "방문형",
  PURCHASE: "구매평",
  PURCHASE_REVIEW: "구매평",
  REPORTER: "기자단",
  MISSION: "미션형",
};

// ----------------------------------------
// API status → 캠페인 상태 (한글)
// ----------------------------------------
const STATUS_MAP: Record<string, PartnerCampaign["status"]> = {
  SCHEDULED: "대기 중",
  approved: "대기 중",
  RECRUITING: "모집 중",
  SELECTED: "선정 중",
  REGISTERING: "등록 중",
  IN_PROGRESS: "진행 중",
  REVIEW: "진행 중",
  COMPLETED: "종료",
  CLOSED: "종료",
  CANCELLED: "취소",
};

// ----------------------------------------
// API status → 탭 이름 (subStatus 계산용)
// ----------------------------------------
const STATUS_TO_TAB: Record<string, string> = {
  SCHEDULED: "예정",
  approved: "예정",
  RECRUITING: "신청",
  SELECTED: "진행",
  REGISTERING: "진행",
  IN_PROGRESS: "진행",
  REVIEW: "진행",
  COMPLETED: "종료",
  CLOSED: "종료",
  CANCELLED: "취소",
};

// ----------------------------------------
// 플랫폼명 정규화
// ----------------------------------------
const PLATFORM_MAP: Record<string, string> = {
  NAVER_BLOG: "네이버블로그",
  NAVER_CLIP: "클립",
  INSTAGRAM: "인스타그램",
  INSTAGRAM_REELS: "릴스",
  REELS: "릴스",
  YOUTUBE: "유튜브",
  YOUTUBE_SHORTS: "쇼츠",
  TIKTOK: "틱톡",
  COUPANG: "쿠팡",
};

// ----------------------------------------
// subStatus 계산 (버튼 종류 결정)
// ----------------------------------------
function computeSubStatus(tab: string, selectedCount: number): string {
  switch (tab) {
    case "예정":
      return "campaign_edit,campaign_delete";
    case "신청":
      return "campaign_edit,applicant_management";
    case "진행":
      return selectedCount > 0 ? "content_review,content_approval" : "winner_selection";
    case "종료":
      return "content_review,content_approval";
    case "취소":
      return "penalty";
    default:
      return "";
  }
}

// ----------------------------------------
// 날짜 기반 실제 탭 결정
// mock DB의 status가 날짜와 맞지 않을 때 보정
// ----------------------------------------
function resolveTab(dbStatus: string, recruitStartAt: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const recruitStart = new Date(recruitStartAt);
  recruitStart.setHours(0, 0, 0, 0);

  // RECRUITING이지만 모집 시작일이 오늘 이후면 → 예정
  if (dbStatus === "RECRUITING" && recruitStart > today) {
    return "예정";
  }

  return STATUS_TO_TAB[dbStatus] ?? "예정";
}

// ----------------------------------------
// API 아이템 → PartnerCampaign 어댑터
// ----------------------------------------
function adaptToCampaign(item: PartnerCampaignApiItem): PartnerCampaign | null {
  // content, recruitStartAt 등 필수 필드 누락 시 스킵
  const contentStart = item.content?.contentStartAt;
  const contentEnd = item.content?.contentEndAt;
  const recruitStart = item.recruitStartAt;
  const recruitEnd = item.recruitEndAt;

  if (!contentStart || !contentEnd || !recruitStart || !recruitEnd) return null;

  const announcementDate = formatDate(contentStart);
  const campaignType = CAMPAIGN_TYPE_MAP[item.type] ?? "배송형";
  const brandName =
    PLATFORM_MAP[item.requiredPlatform?.channelName] ?? item.requiredPlatform?.channelName ?? "";
  const tab = resolveTab(item.status, recruitStart);
  const selectedCount = item.selectedCount ?? 0;

  return {
    id: String(item.id),
    title: item.title,
    image: item.thumbnailUrl,
    status:
      tab === "예정" && STATUS_MAP[item.status] === "모집 중"
        ? "대기 중" // 날짜 보정으로 예정으로 변경된 경우
        : (STATUS_MAP[item.status] ?? "대기 중"),
    campaignType,
    category: typeof item.category?.categoryName === "string" ? item.category.categoryName : "",
    brandName,
    brandLogo: getBrandLogo(brandName, campaignType),
    recruitmentPeriod: formatPeriod(recruitStart, recruitEnd),
    announcementDate,
    registrationPeriod: formatPeriod(contentStart, contentEnd),
    recruitedCount: item.appliedCount ?? 0,
    totalCount: item.recruitLimit ?? 0,
    applicants: item.appliedCount ?? 0,
    recruits: item.recruitLimit ?? 0,
    selected: selectedCount,
    daysLeft: calcDaysLeft(announcementDate),
    subStatus: computeSubStatus(tab, selectedCount),
    extensionRequested: item.extensionRequested === true,
  };
}

// ----------------------------------------
// 탭별 필터링
// ----------------------------------------
function filterByTab(campaigns: PartnerCampaign[], tab: string): PartnerCampaign[] {
  switch (tab) {
    case "전체":
      return [...campaigns].sort((a, b) => {
        const aDate = a.recruitmentPeriod?.split("~")[0]?.trim() ?? "";
        const bDate = b.recruitmentPeriod?.split("~")[0]?.trim() ?? "";
        if (aDate !== bDate) return bDate.localeCompare(aDate);
        return b.id.localeCompare(a.id);
      });
    case "예정":
      return campaigns.filter((c) => c.status === "대기 중");
    case "신청":
      return campaigns.filter((c) => c.status === "모집 중");
    case "진행":
      return campaigns.filter((c) => ["선정 중", "등록 중", "진행 중"].includes(c.status));
    case "종료":
      return campaigns.filter((c) => ["종료", "마감"].includes(c.status));
    case "취소":
      return campaigns.filter((c) => c.status === "취소");
    case "연장 요청":
      return campaigns.filter((c) => c.extensionRequested === true);
    default:
      return campaigns;
  }
}

// ----------------------------------------
// 탭별 캠페인 수 계산
// ----------------------------------------
function computeStats(campaigns: PartnerCampaign[]) {
  const tabs = ["전체", "예정", "신청", "진행", "종료", "취소", "연장 요청"] as const;
  const stats: Record<string, number> = { 패널티: 0 };
  for (const t of tabs) {
    stats[t] = filterByTab(campaigns, t).length;
  }
  return stats;
}

// ========================================
// 메인 훅
// ========================================
export function usePartnerCampaigns(tab: string) {
  const { user } = useAuth();
  const partnerId = user ? getPartnerId(user.id) : 0;

  const { data: apiCampaigns, isLoading } = useQuery({
    queryKey: ["partnerCampaigns", partnerId],
    queryFn: () => fetchPartnerCampaigns(partnerId),
    enabled: partnerId > 0,
    staleTime: 30_000,
  });

  const allCampaigns = useMemo<PartnerCampaign[]>(() => {
    if (apiCampaigns != null) {
      return apiCampaigns.map(adaptToCampaign).filter((c): c is PartnerCampaign => c !== null);
    }
    return [];
  }, [apiCampaigns]);

  const campaigns = useMemo(() => filterByTab(allCampaigns, tab), [allCampaigns, tab]);

  const stats = useMemo(() => computeStats(allCampaigns), [allCampaigns]);

  return { campaigns, stats, isLoading };
}
