/* ========================================
   SA 리뷰어 목록 훅
   ======================================== */

/**
 * useSAReviewerList
 *
 * 목적: SA 관리자 리뷰어 목록을 백엔드 API에서 로드하고
 *       ReviewerItem 타입으로 변환합니다.
 *
 * 사용 페이지:
 * - /manager_sa/member/reviewers
 */

import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSAReviewerStats, fetchSAReviewerList, restrictSAReviewers } from "@/lib/api/admin";
import type {
  SAReviewerListParams,
  SAReviewerItem,
  SAReviewerRestrictRequest,
} from "@/types/api/admin";
import type {
  ReviewerItem,
  Channel,
  ReviewerType,
  ReviewerStatus,
} from "@/data/manager_ga/member/reviewers";
import type { ReviewerStatusType } from "@/data/manager_ga/common/filterOptions";
import type { MemberStats } from "@/components/manager/common/member/stats/MemberStatsSection";

const CHANNEL_TYPE_MAP: Record<string, Channel> = {
  NAVER_BLOG: "Blog",
  NAVER_CLIP: "Clip",
  INSTAGRAM: "Instagram",
  YOUTUBE: "Youtube",
};

const REVIEWER_TYPE_MAP: Record<string, ReviewerType> = {
  NORMAL: "일반",
  SUPPORTER: "서포터즈",
  INFLUENCER: "인플루언서",
};

const MEMBER_GRADE_MAP: Record<string, ReviewerStatusType> = {
  EXCELLENT: "일반 회원",
  NORMAL: "일반 회원",
  CAUTION: "주의 회원",
  WARNING: "주의 회원",
  RESTRICTED: "이용 제한 회원",
};

const MEMBER_STATUS_MAP: Record<string, ReviewerStatus> = {
  ACTIVE: "정상",
  PAUSED: "일시 정지",
  BLOCKED: "영구 정지",
  WITHDRAW: "탈퇴",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day} ${h}:${min}`;
}

function adaptReviewerItem(item: SAReviewerItem, index: number): ReviewerItem {
  return {
    id: item.reviewerId ? String(item.reviewerId) : item.reviewerNumber,
    number: String(index + 1).padStart(6, "0"),
    name: item.name,
    channels: item.channels.map((ch) => CHANNEL_TYPE_MAP[ch.channelType] ?? ("Blog" as Channel)),
    type: REVIEWER_TYPE_MAP[item.reviewerType] ?? ("일반" as ReviewerType),
    campaign_participated: item.campaignParticipationCount,
    campaign_completed: item.campaignCompletionCount,
    current_points: item.retainedPoint,
    withdrawn_points: item.withdrawalPoint,
    status_type: MEMBER_GRADE_MAP[item.memberGrade] ?? ("일반 회원" as ReviewerStatusType),
    status: MEMBER_STATUS_MAP[item.memberStatus] ?? ("정상" as ReviewerStatus),
    last_access_date: item.lastAccessedAt ? formatDate(item.lastAccessedAt) : "",
    join_date: item.joinedAt ? formatDate(item.joinedAt) : "",
  };
}

/** SA 리뷰어 통계 (API 기반) */
export function useSAReviewerStats() {
  const { data, isLoading } = useQuery({
    queryKey: ["saReviewerStats"],
    queryFn: fetchSAReviewerStats,
    staleTime: 30_000,
  });

  const stats = useMemo<MemberStats>(() => {
    if (!data) return { total_members: 0, monthly_active: 0, monthly_new: 0, dormant: 0 };
    return {
      total_members: data.totalCount,
      monthly_active: data.monthlyActiveCount,
      monthly_new: data.monthlyNewCount,
      dormant: data.dormantCount,
    };
  }, [data]);

  return { stats, isLoading };
}

/** SA 리뷰어 목록 (서버사이드 필터) */
export function useSAReviewerList(params?: SAReviewerListParams) {
  const { data: listData, isLoading } = useQuery({
    queryKey: ["saReviewerList", params],
    queryFn: () => fetchSAReviewerList(params),
    staleTime: 30_000,
  });

  const reviewers = useMemo<ReviewerItem[]>(() => {
    if (!listData?.reviewers) return [];
    return listData.reviewers.map(adaptReviewerItem);
  }, [listData]);

  return { reviewers, isLoading };
}

/** SA 리뷰어 이용 제한 */
export function useSAReviewerRestrict() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: SAReviewerRestrictRequest) => restrictSAReviewers(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saReviewerList"] });
      queryClient.invalidateQueries({ queryKey: ["saReviewerStats"] });
    },
  });
}
