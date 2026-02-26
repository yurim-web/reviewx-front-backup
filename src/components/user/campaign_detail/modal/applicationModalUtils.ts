/* ========================================
   캠페인 신청 모달 유틸리티
   ======================================== */

/**
 * applicationModalUtils
 *
 * 목적: ApplicationModal에서 사용하는 순수 유틸 함수와 인터페이스 정의
 *
 * 사용 페이지:
 * - /user/campaign/[type]/[id] (캠페인 상세 - 신청 모달)
 */

import type { AllApplicant } from "@/data/partner/sharedCampaigns";

// ========================================
// 타입 및 인터페이스
// ========================================

export type ApplicationModalType = "delivery" | "review" | "mission" | "reporter" | "visit";

export interface StoredChannelDetail {
  name: string;
  status?: string;
  url?: string;
}

export interface StoredUserAccount {
  id?: string | number;
  email?: string;
  name?: string;
  nickname?: string;
  address?: string;
  detail_address?: string;
  postal_code?: string;
  address_details?: {
    address?: string;
    detailAddress?: string;
    postalCode?: string;
  };
  channel_details?: StoredChannelDetail[];
  user_type?: string;
  member_type?: string;
  profile_image?: string;
  daily_visits?: number | string;
  total_visits?: number | string;
  neighbors?: number | string;
}

export interface StoredApplicant {
  id?: string | number;
  userId?: string | number;
}

export interface StoredCampaign {
  id?: string | number;
  title?: string;
  image?: string;
  channel?: string;
  campaignInfo?: {
    id?: string | number;
    title?: string;
    image?: string;
    channel?: string;
    brandName?: string;
    recruitedCount?: number;
  };
  applicantData?: {
    applicants: StoredApplicant[];
    selectedApplicants: StoredApplicant[];
  };
}

export interface StoredUserCampaign {
  userId: string | number;
  campaigns: unknown[];
}

// ========================================
// 채널 유틸
// ========================================

/** 채널 이름 정규화 (소문자 + 공백 제거) */
export function normalizeChannelName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "");
}

/**
 * 캠페인 채널명으로 유저 연결 채널 URL 반환 (없으면 빈 문자열)
 * - 릴스 → 인스타그램, 쇼츠/숏츠 → 유튜브 자동 매핑
 */
export function resolveUserChannelUrl(
  channelDetails: StoredChannelDetail[],
  campaignChannelName: string
): string {
  const normalized = normalizeChannelName(campaignChannelName);

  let targetChannelName = campaignChannelName;
  if (normalized === "릴스") targetChannelName = "인스타그램";
  else if (normalized === "쇼츠" || normalized === "숏츠") targetChannelName = "유튜브";

  const normalizedTarget = normalizeChannelName(targetChannelName);

  const matched = channelDetails.find((ch) => {
    const normalizedUser = normalizeChannelName(ch.name);
    return normalizedUser.includes(normalizedTarget) || normalizedTarget.includes(normalizedUser);
  });

  return matched?.status === "connected" && matched.url ? matched.url : "";
}

// ========================================
// 타입-스토리지 키 매핑
// ========================================

/** 캠페인 타입 → localStorage 키 */
export function getStorageKey(type: ApplicationModalType): string {
  const map: Record<ApplicationModalType, string> = {
    delivery: "deliveryCampaigns",
    review: "reviewCampaigns",
    mission: "missionCampaigns",
    reporter: "reporterCampaigns",
    visit: "visitCampaigns",
  };
  return map[type];
}

/** 캠페인 타입 → ID 접두사 */
export function getTypePrefix(type: ApplicationModalType): string {
  const map: Record<ApplicationModalType, string> = {
    delivery: "delivery_",
    review: "review_",
    mission: "mission_",
    reporter: "reporter_",
    visit: "visit_",
  };
  return map[type];
}

/**
 * campaigns 배열에서 campaignId와 일치하는 인덱스 반환
 * prefix 제거/추가를 포함한 유연한 ID 매칭
 */
export function findCampaignIndex(
  campaigns: StoredCampaign[],
  campaignId: string,
  type: ApplicationModalType
): number {
  const typePrefix = getTypePrefix(type);
  return campaigns.findIndex((c) => {
    const storedId = String(c.campaignInfo?.id || c.id || "");
    const searchId = String(campaignId);

    if (storedId === searchId) return true;

    if (typePrefix) {
      if (searchId.startsWith(typePrefix)) {
        const searchIdWithoutPrefix = searchId.replace(new RegExp(`^${typePrefix}`), "");
        if (storedId === searchIdWithoutPrefix) return true;
      }
      if (storedId.startsWith(typePrefix)) {
        const storedIdWithoutPrefix = storedId.replace(new RegExp(`^${typePrefix}`), "");
        if (storedIdWithoutPrefix === searchId) return true;
      }
    }

    return false;
  });
}

// ========================================
// 신청자 데이터 빌더
// ========================================

interface BuildApplicantParams {
  userId: string | number;
  showChannel: boolean;
  channelName: string;
  campaignChannelName?: string;
  currentChannelUrl: string;
  memo: string;
  userAccount: StoredUserAccount | null;
}

/** 신청자 정보(AllApplicant) 객체 생성 */
export function buildApplicantData(params: BuildApplicantParams): AllApplicant {
  const {
    userId,
    showChannel,
    channelName,
    campaignChannelName,
    currentChannelUrl,
    memo,
    userAccount,
  } = params;

  const appliedAt = new Date().toISOString();

  const normalized_user_type = userAccount?.user_type === "인플루언서" ? "인플루언서" : "리뷰어";

  const normalized_member_type = (() => {
    const raw = String(userAccount?.member_type || "");
    if (raw === "모범 회원" || raw === "주의 회원" || raw === "경고 회원" || raw === "이용 제한") {
      return raw;
    }
    return "모범 회원";
  })();

  const normalized_channel = (() => {
    if (!showChannel) return "기본" as const;
    const raw = String(campaignChannelName || channelName || "")
      .replace(/\s+/g, "")
      .toLowerCase();
    if (raw.includes("클립")) return "네이버클립" as const;
    if (raw.includes("인스타")) return "인스타그램" as const;
    if (raw.includes("유튜브")) return "유튜브" as const;
    return "네이버블로그" as const;
  })();

  const channel_id = (() => {
    const url = String(currentChannelUrl || "");
    if (!url) return userId;
    const parts = url.split("/").filter(Boolean);
    return parts[parts.length - 1] || userId;
  })();

  const base_applicant = {
    id: String(userId),
    Id: String(channel_id),
    nickname: userAccount?.nickname || "",
    userType: normalized_user_type as "리뷰어" | "인플루언서",
    profileImage: userAccount?.profile_image || "/images/mypage/profile.svg",
    memberType: normalized_member_type as "모범 회원" | "주의 회원" | "경고 회원" | "이용 제한",
    memo,
    selectionStatus: "미선택" as const,
    registrationDate: appliedAt.split("T")[0],
  };

  if (normalized_channel === "네이버블로그") {
    return {
      ...base_applicant,
      dailyVisits: Number(userAccount?.daily_visits || 0),
      totalVisits: Number(userAccount?.total_visits || 0),
      neighbors: Number(userAccount?.neighbors || 0),
      channel: "네이버블로그",
    };
  }
  if (normalized_channel === "네이버클립") {
    return { ...base_applicant, followers: 0, channel: "네이버클립" };
  }
  if (normalized_channel === "인스타그램") {
    return { ...base_applicant, followers: 0, channel: "인스타그램" };
  }
  if (normalized_channel === "유튜브") {
    return { ...base_applicant, subscribers: 0, channel: "유튜브" };
  }
  return { ...base_applicant, channel: "기본" };
}

// ========================================
// user_applied_campaigns 업데이트 헬퍼
// ========================================

interface AddToUserAppliedParams {
  userId: string | number;
  campaignId: string;
  type: ApplicationModalType;
  campaign: StoredCampaign;
  memo: string;
  campaignChannelName?: string;
  appliedAt: string;
}

/** user_applied_campaigns localStorage에 신청 내역 추가 */
export function addToUserAppliedCampaigns(params: AddToUserAppliedParams): void {
  const { userId, campaignId, type, campaign, memo, campaignChannelName, appliedAt } = params;

  const raw = localStorage.getItem("user_applied_campaigns");
  const appliedCampaigns: StoredUserCampaign[] = raw ? JSON.parse(raw) : [];

  let userCampaigns = appliedCampaigns.find((uc) => uc.userId === userId);
  if (!userCampaigns) {
    userCampaigns = { userId, campaigns: [] };
    appliedCampaigns.push(userCampaigns);
  }

  (userCampaigns.campaigns as unknown[]).push({
    campaignId,
    campaignType: type,
    campaignTitle: campaign.campaignInfo?.title || campaign.title || "",
    campaignImage: campaign.campaignInfo?.image || campaign.image || "",
    appliedAt,
    status: "대기",
    memo,
    channel:
      campaignChannelName ||
      campaign.campaignInfo?.channel ||
      campaign.campaignInfo?.brandName ||
      campaign.channel ||
      "",
  });

  localStorage.setItem("user_applied_campaigns", JSON.stringify(appliedCampaigns));
}
