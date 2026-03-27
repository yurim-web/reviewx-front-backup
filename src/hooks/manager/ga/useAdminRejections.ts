/* ========================================
   관리자 반려 내역 훅
   ======================================== */

/**
 * useAdminRejections
 *
 * 목적: 관리자 반려 내역을 실제 백엔드 API에서 로드하고
 *       RejectedCampaignItem 타입으로 변환하여 반환합니다.
 *
 * 사용 페이지:
 * - /manager_ga/campaign/rejected
 * - /manager_sa/campaign/rejected
 *
 * 백엔드 API: GET /api/admin/campaigns/rejected
 */

import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRejectedCampaigns, updateRejectCode, reportRejectedItem } from "@/lib/api/admin";
import { rejected_campaign_list } from "@/data/manager_ga/rejected";
import type { RejectedCampaignApiItem, RejectedListParams } from "@/types/api/admin";
import type { RejectedCampaignItem, RejectCode } from "@/data/manager_ga/rejected";

/** 백엔드 API 응답 → 프론트 UI 타입 변환 */
function adaptRejection(item: RejectedCampaignApiItem): RejectedCampaignItem {
  return {
    id: String(item.rejectId),
    campaign_number: String(item.campaignId).padStart(6, "0"),
    campaign_name: item.campaignTitle,
    reject_code: (item.rejectCode ?? "R001") as RejectCode,
    reject_reason: item.rejectReason,
    inspector: item.processedBy,
    target: item.reviewerName,
    processed_date: item.processedAt
      ? (() => {
          const d = new Date(item.processedAt);
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, "0");
          const dd = String(d.getDate()).padStart(2, "0");
          const hh = String(d.getHours()).padStart(2, "0");
          const mi = String(d.getMinutes()).padStart(2, "0");
          return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
        })()
      : "",
    reject_count: 1,
  };
}

export function useAdminRejections(params?: RejectedListParams) {
  const queryClient = useQueryClient();

  const {
    data: apiResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["adminRejections", params],
    queryFn: () => getRejectedCampaigns(params),
    staleTime: 30_000,
  });

  const updateCodeMutation = useMutation({
    mutationFn: ({
      rejectId,
      body,
    }: {
      rejectId: number;
      body: { rejectCode?: string; adminMemo?: string };
    }) => updateRejectCode(rejectId, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminRejections"] }),
  });

  const reportMutation = useMutation({
    mutationFn: ({
      rejectId,
      body,
    }: {
      rejectId: number;
      body: { reportCode: string; reportReason?: string };
    }) => reportRejectedItem(rejectId, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminRejections"] }),
  });

  const rejections = useMemo<RejectedCampaignItem[]>(() => {
    const list = apiResponse?.data?.rejectList;
    if (list != null && list.length > 0) {
      return list.map(adaptRejection);
    }
    return rejected_campaign_list;
  }, [apiResponse]);

  const stats = useMemo(() => {
    return apiResponse?.data?.rejectStats ?? [];
  }, [apiResponse]);

  const pagination = useMemo(() => {
    return apiResponse?.data?.pagination ?? null;
  }, [apiResponse]);

  const updateCode = (rejectId: number, body: { rejectCode?: string; adminMemo?: string }) =>
    updateCodeMutation.mutateAsync({ rejectId, body });

  const report = (rejectId: number, body: { reportCode: string; reportReason?: string }) =>
    reportMutation.mutateAsync({ rejectId, body });

  return { rejections, stats, pagination, isLoading, isError, updateCode, report };
}
