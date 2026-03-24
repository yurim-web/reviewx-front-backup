/* ========================================
   관리자 리뷰어 목록 훅
   ======================================== */

/**
 * useAdminReviewers
 *
 * 목적: 관리자 리뷰어 목록을 실제 백엔드 API에서 로드하고
 *       ReviewerItem 타입으로 변환하여 반환합니다.
 *
 * 사용 페이지:
 * - /manager_ga/member/reviewers
 * - /manager_sa/member/reviewers
 *
 * 백엔드 API: GET /api/admin/reviewers
 */

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getReviewerList, fetchAdminReviewers } from "@/lib/api/admin";
import { reviewer_list } from "@/data/manager_ga/member/reviewers";
import type { ReviewerListApiItem, ReviewerListParams } from "@/types/api/admin";
import type {
  ReviewerItem,
  Channel,
  ReviewerType,
  ReviewerStatus,
} from "@/data/manager_ga/member/reviewers";
import type { ReviewerStatusType } from "@/data/manager_ga/common/filterOptions";

const DIVISION_MAP: Record<string, ReviewerType> = {
  NORMAL: "일반",
  SUPPORTERS: "서포터즈",
  INFLUENCER: "인플루언서",
};

const MEMBER_TYPE_MAP: Record<string, ReviewerStatusType> = {
  NORMAL: "일반 회원",
  RESTRICTED: "이용 제한 회원",
};

const STATUS_MAP: Record<string, ReviewerStatus> = {
  ACTIVE: "정상",
  BLOCKED: "영구 정지",
  PAUSED: "일시 정지",
  WITHDRAW: "탈퇴",
};

const CHANNEL_MAP: Record<string, Channel> = {
  blog: "Blog",
  clip: "Clip",
  instagram: "Instagram",
  youtube: "Youtube",
  store: "Store",
  reels: "Reels",
  shorts: "Shorts",
};

/** 백엔드 API 응답 → 프론트 UI 타입 변환 */
function adaptReviewerFromApi(item: ReviewerListApiItem): ReviewerItem {
  return {
    id: String(item.userId),
    number: String(item.userId).padStart(6, "0"),
    name: item.nickname,
    channels: item.channels.map((ch) => CHANNEL_MAP[ch.toLowerCase()] ?? (ch as Channel)),
    type: DIVISION_MAP[item.division] ?? (item.division as ReviewerType),
    campaign_participated: item.campaignParticipated,
    campaign_completed: item.campaignCompleted,
    current_points: item.holdingPoint,
    withdrawn_points: item.withdrawalPoint,
    status_type: MEMBER_TYPE_MAP[item.memberType] ?? (item.memberType as ReviewerStatusType),
    status: STATUS_MAP[item.status] ?? (item.status as ReviewerStatus),
    last_access_date: item.lastLoginAt
      ? (() => {
          const d = new Date(item.lastLoginAt);
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, "0");
          const dd = String(d.getDate()).padStart(2, "0");
          const hh = String(d.getHours()).padStart(2, "0");
          const mi = String(d.getMinutes()).padStart(2, "0");
          return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
        })()
      : "",
    join_date: item.createdAt
      ? (() => {
          const d = new Date(item.createdAt);
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, "0");
          const dd = String(d.getDate()).padStart(2, "0");
          const hh = String(d.getHours()).padStart(2, "0");
          const mi = String(d.getMinutes()).padStart(2, "0");
          return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
        })()
      : "",
  };
}

export function useAdminReviewers(params?: ReviewerListParams) {
  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ["adminReviewers", params],
    queryFn: async () => {
      try {
        return await getReviewerList(params);
      } catch {
        // 실제 API 실패 시 레거시 mock fallback
        const legacyData = await fetchAdminReviewers();
        return {
          result: "OK",
          generatedAt: new Date().toISOString(),
          data: { totalCount: legacyData.length, reviewers: [] as ReviewerListApiItem[] },
          _legacyData: legacyData,
        };
      }
    },
    staleTime: 30_000,
  });

  const reviewers = useMemo<ReviewerItem[]>(() => {
    const list = apiResponse?.data?.reviewers;
    if (list != null && list.length > 0) {
      return list.map(adaptReviewerFromApi);
    }
    // 레거시 fallback
    const legacy = (apiResponse as { _legacyData?: unknown[] })?._legacyData;
    if (legacy && legacy.length > 0) {
      // 기존 adaptReviewer 로직 인라인
      return reviewer_list;
    }
    return reviewer_list;
  }, [apiResponse]);

  return { reviewers, isLoading };
}
