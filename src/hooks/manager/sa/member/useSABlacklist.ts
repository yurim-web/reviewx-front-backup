/* ========================================
   SA 이용 제한 내역 훅
   ======================================== */

/**
 * useSABlacklist
 *
 * 목적: SA 이용 제한 목록을 백엔드 API에서 로드하고
 *       AdminBlacklistApiItem 타입으로 변환합니다.
 *
 * 사용 페이지:
 * - /manager_sa/member/blacklist
 *
 * 백엔드 API: GET /api/admin-sa/member/blacklist
 */

import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSABlacklist, deleteSABlacklistItem } from "@/lib/api/admin";
import type { AdminBlacklistApiItem, SABlacklistParams, SABlacklistItem } from "@/types/api/admin";

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day} ${h}:${min}`;
}

/** SA 백엔드 응답 → UI 타입 변환 */
function adaptSABlacklistItem(item: SABlacklistItem): AdminBlacklistApiItem {
  return {
    id: item.id,
    name: item.name,
    user_id: item.userId,
    division: item.division,
    current_points: item.currentPoints,
    ip_address: item.ipAddress,
    block_code: item.blockCode,
    block_reason: item.blockReason,
    registered_date: item.registeredDate ? formatDate(item.registeredDate) : "",
    registered_by: item.registeredBy,
    status: "BLOCKED",
  };
}

export function useSABlacklist(params?: SABlacklistParams) {
  const { data, isLoading } = useQuery({
    queryKey: ["saBlacklist", params],
    queryFn: () => fetchSABlacklist(params),
    staleTime: 30_000,
  });

  const blacklist = useMemo<AdminBlacklistApiItem[]>(() => {
    if (!data?.blacklist) return [];
    return data.blacklist.map(adaptSABlacklistItem);
  }, [data]);

  return { blacklist, isLoading };
}

/** SA 이용 제한 해제 뮤테이션 */
export function useSAUnblockUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSABlacklistItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saBlacklist"] });
    },
  });
}
