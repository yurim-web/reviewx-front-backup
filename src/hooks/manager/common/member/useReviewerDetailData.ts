/* ========================================
   리뷰어 상세 데이터 로드 훅
   ======================================== */

/**
 * useReviewerDetailData
 *
 * 목적: 관리자(GA/SA) 리뷰어 상세 페이지의 localStorage 파싱·API 조회 로직을 제공합니다.
 *
 * 사용 위치:
 * - /manager_ga/member/reviewers/[id]
 * - /manager_sa/member/reviewers/[id]
 */

import { useState, useEffect } from "react";
import {
  get_reviewer_detail_by_id,
  reviewer_list,
  type ReviewerDetail,
  type Channel,
  type ChannelDetail,
  type RecentCampaign,
} from "@/data/manager_ga/member/reviewers";
import { fetchAdminReviewerDetail } from "@/lib/api/admin";
import type { AdminReviewerApiItem } from "@/types/api/admin";
import {
  format_campaign_number,
  map_brand_name_to_channel,
  type CampaignType,
} from "@/data/manager_ga/progress";
import { deliveryCampaigns } from "@/data/campaign/delivery/deliveryCampaigns";
import { visitCampaigns } from "@/data/campaign/visit/visitCampaigns";
import { reviewCampaigns } from "@/data/campaign/review/reviewCampaigns";
import { reporterCampaigns } from "@/data/campaign/reporter/reporterCampaigns";
import { missionCampaigns } from "@/data/campaign/mission/missionCampaigns";
import { getCampaignById } from "@/data/partner/sharedCampaigns";
import { StoredUserAccount, StoredChannelDetail } from "@/lib/auth/types";

interface StoredAppliedCampaign {
  campaignId: string;
  campaignType: string;
  campaignTitle?: string;
  status: string;
}

interface StoredUserCampaigns {
  userId: string;
  campaigns: StoredAppliedCampaign[];
}

interface StoredCampaignData {
  id?: string;
  partner_id?: string;
  campaignInfo?: {
    id?: string;
    title?: string;
    status?: string;
    campaignType?: string;
    brandName?: string;
    channel?: string;
    point?: number;
    points?: number;
  };
  channel?: string;
  points?: number;
  point?: number;
}

// 채널 이름 매핑 (한글 → Channel 타입)
const CHANNEL_NAME_MAP: Record<string, Channel> = {
  "네이버 블로그": "Blog",
  네이버블로그: "Blog",
  블로그: "Blog",
  Blog: "Blog",
  "네이버 클립": "Clip",
  네이버클립: "Clip",
  클립: "Clip",
  Clip: "Clip",
  인스타그램: "Instagram",
  Instagram: "Instagram",
  유튜브: "Youtube",
  Youtube: "Youtube",
  릴스: "Reels",
  Reels: "Reels",
  쇼츠: "Shorts",
  숏츠: "Shorts",
  Shorts: "Shorts",
};

// 캠페인 타입 → localStorage 키 매핑
const CAMPAIGN_TYPE_KEY_MAP: Record<string, string> = {
  delivery: "deliveryCampaigns",
  review: "reviewCampaigns",
  mission: "missionCampaigns",
  reporter: "reporterCampaigns",
  visit: "visitCampaigns",
};

// 캠페인 타입 → typePrefix 매핑
const CAMPAIGN_TYPE_PREFIX_MAP: Record<string, string> = {
  delivery: "delivery_",
  visit: "visit_",
  review: "review_",
  reporter: "reporter_",
  mission: "mission_",
};

// 영문 campaignType → 한글 CampaignType 매핑
const CAMPAIGN_TYPE_KO_MAP: Record<string, CampaignType> = {
  delivery: "배송형",
  review: "구매평",
  mission: "미션형",
  reporter: "기자단",
  visit: "방문형",
};

/** campaignId가 저장된 캠페인과 일치하는지 확인 (prefix 유무 모두 처리) */
function match_campaign_id(campId: string, storedId: string, typePrefix: string): boolean {
  if (campId === storedId) return true;
  if (!typePrefix) return false;

  if (storedId.startsWith(typePrefix)) {
    const storedWithout = storedId.replace(new RegExp(`^${typePrefix}`), "");
    if (campId === storedWithout) return true;
  }
  if (campId.startsWith(typePrefix)) {
    const campWithout = campId.replace(new RegExp(`^${typePrefix}`), "");
    if (campWithout === storedId) return true;
  }
  if (!storedId.startsWith(typePrefix) && !campId.startsWith(typePrefix)) {
    if (campId === storedId) return true;
  }
  return false;
}

/** 채널 이름 문자열을 Channel 타입으로 변환 */
function resolve_channel(channelName: string): Channel {
  const normalized = channelName.replace(/\s+/g, "");
  return CHANNEL_NAME_MAP[normalized] || CHANNEL_NAME_MAP[channelName] || "Blog";
}

/** localStorage 또는 정적 데이터에서 캠페인 포인트·채널 정보 조회 */
function getCampaignInfo(
  campaignId: string,
  campaignType: string
): { points: number; channel: Channel } {
  const defaultResult = { points: 0, channel: "Blog" as Channel };

  try {
    const campaignTypeKey = CAMPAIGN_TYPE_KEY_MAP[campaignType];
    if (!campaignTypeKey) return defaultResult;

    const typePrefix = CAMPAIGN_TYPE_PREFIX_MAP[campaignType] || "";
    const storedRaw = localStorage.getItem(campaignTypeKey);
    const allCampaigns: StoredCampaignData[] = storedRaw ? JSON.parse(storedRaw) : [];

    const staticCampaigns: StoredCampaignData[] = [
      ...deliveryCampaigns,
      ...visitCampaigns,
      ...reviewCampaigns,
      ...reporterCampaigns,
      ...missionCampaigns,
    ];

    const searchList = allCampaigns.length > 0 ? allCampaigns : staticCampaigns;
    const found = searchList.find((c: StoredCampaignData) => {
      const campId = String(c.campaignInfo?.id || c.id || "");
      return match_campaign_id(campId, String(campaignId), typePrefix);
    });

    if (found) {
      const points = found.campaignInfo?.points || found.points || 0;
      const channelName = found.campaignInfo?.channel || found.channel || "";
      const channel = channelName ? resolve_channel(channelName) : "Blog";
      return { points, channel };
    }
  } catch (_error) {
    // 조회 실패 시 기본값 반환
  }

  return defaultResult;
}

interface UseReviewerDetailDataResult {
  reviewer_detail: ReviewerDetail | null;
  is_loading: boolean;
  is_withdrawn_modal_open: boolean;
  set_is_withdrawn_modal_open: (open: boolean) => void;
}

// localStorage에서 리뷰어 상세 정보를 로드하는 함수 (특수 ID 처리)
async function fetch_from_local_storage(
  reviewer_id: string,
  mappedId: string
): Promise<ReviewerDetail | null> {
  const storedAccounts = localStorage.getItem("user_accounts");
  if (!storedAccounts) return null;

  const accounts: StoredUserAccount[] = JSON.parse(storedAccounts);
  const userAccount = accounts.find((a: StoredUserAccount) => a.id === mappedId);
  if (!userAccount) return null;

  const inputChannelNameMap: Record<string, Channel> = {
    "네이버 블로그": "Blog",
    "네이버 클립": "Clip",
    인스타그램: "Instagram",
    유튜브: "Youtube",
  };

  const connectedChannels: Channel[] = [];
  const channelDetails: ChannelDetail[] = [];

  if (userAccount.channel_details) {
    userAccount.channel_details.forEach((ch: StoredChannelDetail) => {
      const channelType = inputChannelNameMap[ch.name];
      if (channelType) {
        const isConnected = ch.status === "connected";
        if (isConnected) connectedChannels.push(channelType);

        const channelUrl = ch.url ? String(ch.url) : undefined;
        if (channelType === "Blog") {
          channelDetails.push({
            channel: channelType,
            daily_visits: isConnected ? 100 : undefined,
            total_visits: isConnected ? 10000 : undefined,
            neighbors: isConnected ? 500 : undefined,
            is_connected: isConnected,
            channel_url: channelUrl,
          });
        } else if (channelType === "Clip" || channelType === "Instagram") {
          channelDetails.push({
            channel: channelType,
            followers: isConnected ? (channelType === "Instagram" ? 5000 : 1000) : undefined,
            is_connected: isConnected,
            channel_url: channelUrl,
          });
        } else if (channelType === "Youtube") {
          channelDetails.push({
            channel: channelType,
            subscribers: isConnected ? 2000 : undefined,
            is_connected: isConnected,
            channel_url: channelUrl,
          });
        }
      }
    });
  }

  if (channelDetails.length === 0) {
    channelDetails.push(
      {
        channel: "Blog",
        daily_visits: undefined,
        total_visits: undefined,
        neighbors: undefined,
        is_connected: false,
      },
      { channel: "Clip", followers: undefined, is_connected: false },
      { channel: "Instagram", followers: undefined, is_connected: false },
      { channel: "Youtube", subscribers: undefined, is_connected: false }
    );
  }

  let campaignParticipated = 0;
  let campaignCompleted = 0;
  let recentCampaigns: RecentCampaign[] = [];

  try {
    const userAppliedRaw = localStorage.getItem("user_applied_campaigns");
    if (userAppliedRaw) {
      const allApplied: StoredUserCampaigns[] = JSON.parse(userAppliedRaw);
      const userCampaigns = allApplied.find((uc: StoredUserCampaigns) => uc.userId === mappedId);

      if (userCampaigns?.campaigns) {
        const campaigns = userCampaigns.campaigns;

        campaignParticipated = campaigns.filter(
          (c: StoredAppliedCampaign) => c.status === "대기" || c.status === "선정"
        ).length;
        campaignCompleted = campaigns.filter(
          (c: StoredAppliedCampaign) => c.status === "완료"
        ).length;

        recentCampaigns = campaigns
          .filter(
            (c: StoredAppliedCampaign) =>
              c.status === "대기" || c.status === "선정" || c.status === "완료"
          )
          .slice(0, 10)
          .map((c: StoredAppliedCampaign) => {
            const actualCampaign = getCampaignById(c.campaignId);

            if (actualCampaign) {
              const campaignType = actualCampaign.campaignInfo.campaignType;
              const campaignNumber = format_campaign_number(actualCampaign.campaignInfo.id);
              const channel = map_brand_name_to_channel(
                actualCampaign.campaignInfo.brandName || "",
                campaignType as CampaignType
              );
              const campaignInfoExt =
                actualCampaign.campaignInfo as typeof actualCampaign.campaignInfo & {
                  point?: number;
                };
              const points = campaignInfoExt.point !== undefined ? campaignInfoExt.point : 0;

              return {
                campaign_number: campaignNumber,
                partner_name: "",
                campaign_name: actualCampaign.campaignInfo.title,
                status: (c.status === "대기" || c.status === "선정"
                  ? "진행"
                  : "종료") as RecentCampaign["status"],
                type: campaignType as RecentCampaign["type"],
                channel: channel as RecentCampaign["channel"],
                points,
              };
            } else {
              const campaignInfo = getCampaignInfo(c.campaignId, c.campaignType);
              const koType = CAMPAIGN_TYPE_KO_MAP[c.campaignType] || "배송형";
              return {
                campaign_number: format_campaign_number(c.campaignId || "0"),
                partner_name: "",
                campaign_name: c.campaignTitle || "캠페인명 없음",
                status: (c.status === "대기" || c.status === "선정"
                  ? "진행"
                  : "종료") as RecentCampaign["status"],
                type: koType as RecentCampaign["type"],
                channel: campaignInfo.channel as RecentCampaign["channel"],
                points: campaignInfo.points,
              };
            }
          });
      }
    }
  } catch (_error) {
    // 캠페인 정보 로드 실패 시 기본값 유지
  }

  let statusType: "일반 회원" | "주의 회원" | "이용 제한 회원" = "일반 회원";
  try {
    const statusUpdates = localStorage.getItem("reviewer_status_type_updates");
    if (statusUpdates) {
      const updates = JSON.parse(statusUpdates);
      const statusForMappedId = updates[mappedId] || updates[reviewer_id];
      if (statusForMappedId) {
        statusType = statusForMappedId;
      } else {
        const reviewerFromList = reviewer_list.find(
          (r) => r.id === reviewer_id || r.id === mappedId
        );
        if (reviewerFromList) statusType = reviewerFromList.status_type;
      }
    } else {
      const reviewerFromList = reviewer_list.find((r) => r.id === reviewer_id || r.id === mappedId);
      if (reviewerFromList) statusType = reviewerFromList.status_type;
    }
  } catch (_error) {
    const reviewerFromList = reviewer_list.find((r) => r.id === reviewer_id || r.id === mappedId);
    if (reviewerFromList) statusType = reviewerFromList.status_type;
  }

  void connectedChannels; // connectedChannels는 channelDetails에서 파생됨

  return {
    id: reviewer_id,
    number: userAccount.number || (mappedId === "user_kakao_001" ? "000001" : "000002"),
    name: userAccount.name || "카카오유저",
    nickname: userAccount.nickname || "테스트닉네임",
    channels: connectedChannels,
    type: "일반",
    campaign_participated: campaignParticipated,
    campaign_completed: campaignCompleted,
    current_points: userAccount.current_points || 0,
    withdrawn_points: userAccount.withdrawn_points || 0,
    status_type: statusType,
    status: "정상",
    last_access_date:
      userAccount.last_access_date || new Date().toISOString().replace("T", " ").substring(0, 16),
    join_date: userAccount.join_date || "2024-04-01 10:00",
    gender: (userAccount.gender || "여성") as "남성" | "여성",
    age: userAccount.age || 30,
    email: userAccount.email || "",
    phone: userAccount.phone || "010-1111-1111",
    address: userAccount.address
      ? `${userAccount.address}${userAccount.detail_address ? " " + userAccount.detail_address : ""}`
      : "서울시 강남구 테헤란로 123",
    profile_image: userAccount.profile_image || null,
    penalty_count: 0,
    channel_details: channelDetails,
    account_info: {
      account_holder: userAccount.account_holder || userAccount.name || "",
      bank: userAccount.bank || "",
      account_number: userAccount.account_number || "",
      resident_number:
        userAccount.ssn_front && userAccount.ssn_back
          ? `${userAccount.ssn_front}-${userAccount.ssn_back}`
          : "",
    },
    recent_campaigns: recentCampaigns,
    penalty_history: [],
  };
}

// API 응답 → ReviewerDetail 변환 함수
function map_api_to_reviewer_detail(api: AdminReviewerApiItem): ReviewerDetail {
  const channel_details: ChannelDetail[] = (api.channels ?? []).map((ch) => ({
    channel: ch as Channel,
    is_connected: true,
    channel_url: "",
  }));

  return {
    id: String(api.id),
    number: api.number,
    name: api.name,
    nickname: api.nickname ?? "",
    gender: (api.gender as "남성" | "여성") ?? "남성",
    age: api.age ?? 0,
    email: api.email ?? "",
    phone: api.phone ?? "",
    address: api.address ?? "",
    profile_image: null,
    channels: (api.channels ?? []) as Channel[],
    type: api.type as ReviewerDetail["type"],
    campaign_participated: api.campaign_participated ?? 0,
    campaign_completed: api.campaign_completed ?? 0,
    current_points: api.current_points ?? 0,
    withdrawn_points: api.withdrawn_points ?? 0,
    status_type: api.status_type as ReviewerDetail["status_type"],
    status: api.status as ReviewerDetail["status"],
    penalty_count: api.penalty_count ?? 0,
    last_access_date: api.last_access_date ?? "",
    join_date: api.join_date ?? "",
    channel_details,
    account_info: {
      account_holder: api.account_holder ?? "",
      bank: api.bank ?? "",
      account_number: "",
      resident_number: "",
    },
    recent_campaigns: [] as RecentCampaign[],
    penalty_history: [],
  };
}

export function useReviewerDetailData(reviewer_id: string): UseReviewerDetailDataResult {
  const [reviewer_detail, set_reviewer_detail] = useState<ReviewerDetail | null>(null);
  const [is_loading, set_is_loading] = useState(true);
  const [is_withdrawn_modal_open, set_is_withdrawn_modal_open] = useState(false);

  useEffect(() => {
    const fetch_reviewer_detail = async () => {
      set_is_loading(true);

      // 1. mock 서버 API 먼저 시도 (숫자 ID인 경우)
      const numericId = parseInt(reviewer_id, 10);
      if (!isNaN(numericId) && numericId > 0) {
        try {
          const apiData = await fetchAdminReviewerDetail(numericId);
          if (apiData) {
            // 특수 ID(1, 2)는 localStorage로 채널/캠페인 정보 보강
            const SPECIAL_IDS = ["1", "2"];
            if (SPECIAL_IDS.includes(reviewer_id) && typeof window !== "undefined") {
              const mappedId = reviewer_id === "1" ? "user_kakao_001" : "user_naver_001";
              const localDetail = await fetch_from_local_storage(reviewer_id, mappedId);
              if (localDetail) {
                // API 기본 정보 + localStorage 채널/캠페인 정보 병합
                const merged: ReviewerDetail = {
                  ...map_api_to_reviewer_detail(apiData),
                  channel_details: localDetail.channel_details,
                  account_info: localDetail.account_info,
                  recent_campaigns: localDetail.recent_campaigns,
                  penalty_history: localDetail.penalty_history,
                };
                set_reviewer_detail(merged);
                if (merged.status === "탈퇴") set_is_withdrawn_modal_open(true);
                set_is_loading(false);
                return;
              }
            }
            const detail = map_api_to_reviewer_detail(apiData);
            set_reviewer_detail(detail);
            if (detail.status === "탈퇴") set_is_withdrawn_modal_open(true);
            set_is_loading(false);
            return;
          }
        } catch (_apiError) {
          // API 실패 시 하위 fallback으로 진행
        }
      }

      // 2. 특수 ID localStorage fallback
      const SPECIAL_IDS = ["user_kakao_001", "user_naver_001", "1", "2"];
      if (SPECIAL_IDS.includes(reviewer_id) && typeof window !== "undefined") {
        try {
          const mappedId =
            reviewer_id === "1"
              ? "user_kakao_001"
              : reviewer_id === "2"
                ? "user_naver_001"
                : reviewer_id;

          const detail = await fetch_from_local_storage(reviewer_id, mappedId);
          if (detail) {
            set_reviewer_detail(detail);
            set_is_loading(false);
            return;
          }
        } catch (_error) {
          // 로드 실패 시 정적 데이터 사용
        }
      }

      // 3. 최종 fallback: 정적 데이터
      const detail = get_reviewer_detail_by_id(reviewer_id);
      set_reviewer_detail(detail);

      if (detail && detail.status === "탈퇴") {
        set_is_withdrawn_modal_open(true);
      }

      set_is_loading(false);
    };

    fetch_reviewer_detail();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetch_reviewer_detail();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [reviewer_id]);

  return {
    reviewer_detail,
    is_loading,
    is_withdrawn_modal_open,
    set_is_withdrawn_modal_open,
  };
}
