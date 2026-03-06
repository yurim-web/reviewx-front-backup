/* ========================================
   관리자 리뷰어 목록 훅
   ======================================== */

/**
 * useAdminReviewers
 *
 * 목적: 관리자 리뷰어 목록을 mock API에서 로드하고
 *       ReviewerItem 타입으로 변환하여 반환합니다.
 *
 * 사용 페이지:
 * - /manager_ga/member/reviewers
 * - /manager_sa/member/reviewers
 */

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminReviewers } from "@/lib/api/admin";
import { reviewer_list } from "@/data/manager_ga/member/reviewers";
import type { AdminReviewerApiItem } from "@/types/api/admin";
import type {
  ReviewerItem,
  Channel,
  ReviewerType,
  ReviewerStatus,
} from "@/data/manager_ga/member/reviewers";
import type { ReviewerStatusType } from "@/data/manager_ga/common/filterOptions";

function adaptReviewer(item: AdminReviewerApiItem): ReviewerItem {
  return {
    id: String(item.id),
    number: item.number,
    name: item.name,
    channels: item.channels as Channel[],
    type: item.type as ReviewerType,
    campaign_participated: item.campaign_participated,
    campaign_completed: item.campaign_completed,
    current_points: item.current_points,
    withdrawn_points: item.withdrawn_points,
    status_type: item.status_type as ReviewerStatusType,
    status: item.status as ReviewerStatus,
    last_access_date: item.last_access_date,
    join_date: item.join_date,
  };
}

export function useAdminReviewers() {
  const { data: apiData, isLoading } = useQuery({
    queryKey: ["adminReviewers"],
    queryFn: fetchAdminReviewers,
    staleTime: 30_000,
  });

  const reviewers = useMemo<ReviewerItem[]>(() => {
    if (apiData != null && apiData.length > 0) {
      return apiData.map(adaptReviewer);
    }
    return reviewer_list;
  }, [apiData]);

  return { reviewers, isLoading };
}
