/* ========================================
   관리자 차단(이용제한) 목록 훅
   ======================================== */

/**
 * useAdminBlacklist
 *
 * 목적: 관리자 이용제한 목록을 실제 백엔드 API에서 조회하고
 *       AdminBlacklistApiItem 타입으로 변환하여 반환합니다.
 *
 * 사용 페이지:
 * - /manager_ga/member/blacklist
 * - /manager_sa/member/blacklist
 *
 * 백엔드 API: GET /api/admin/users/blocked
 */

import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBlockedList, unblockUser, fetchAdminBlacklist } from "@/lib/api/admin";
import type { AdminBlacklistApiItem, BlockedItem, BlockedListParams } from "@/types/api/admin";

/** 백엔드 API 응답 → 기존 UI 타입 변환 */
function adaptBlockedItem(item: BlockedItem): AdminBlacklistApiItem {
  const divisionMap: Record<string, string> = {
    reviewer: "리뷰어",
    partner: "파트너",
    admin: "관리자",
  };

  return {
    id: String(item.blockId),
    name: item.businessName ?? item.name,
    user_id: item.id,
    division: divisionMap[item.division] ?? item.division,
    current_points: item.point,
    ip_address: item.ip,
    block_code: item.blockCode,
    block_reason: item.blockReason,
    registered_date: item.createdAt
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
    registered_by: item.createdBy,
    status: "BLOCKED",
  };
}

export function useAdminBlacklist(params?: BlockedListParams) {
  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ["adminBlacklist", params],
    queryFn: async () => {
      try {
        const response = await getBlockedList(params);
        return response;
      } catch {
        // 실제 API 실패 시 레거시 mock fallback
        const legacyData = await fetchAdminBlacklist();
        return {
          result: "OK" as const,
          generatedAt: new Date().toISOString(),
          data: { totalCount: legacyData.length, blockedList: [] as BlockedItem[] },
          _legacyData: legacyData,
        };
      }
    },
    staleTime: 1000 * 30,
    retry: false,
  });

  const blacklist = useMemo<AdminBlacklistApiItem[]>(() => {
    // 새 API 응답이 있으면 변환
    const blockedList = apiResponse?.data?.blockedList;
    if (blockedList != null && blockedList.length > 0) {
      return blockedList.map(adaptBlockedItem);
    }
    // 레거시 fallback
    const legacy = (apiResponse as { _legacyData?: AdminBlacklistApiItem[] })?._legacyData;
    if (legacy && legacy.length > 0) return legacy;
    return [];
  }, [apiResponse]);

  return { blacklist, isLoading };
}

/** 이용 제한 해제 뮤테이션 */
export function useUnblockUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => unblockUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBlacklist"] });
    },
  });
}
