/* ========================================
   SA 관리자 목록 훅
   ======================================== */

/**
 * useSAAdminList
 *
 * 목적: SA 관리자 관리자 목록을 백엔드 API에서 로드하고
 *       AdminMemberApiItem 타입으로 변환합니다.
 *
 * 사용 페이지:
 * - /manager_sa/member/admins
 * - /manager_sa/member/admins/[id]/edit
 */

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSAAdminList } from "@/lib/api/admin";
import type { SAAdminListParams, SAAdminItem, AdminMemberApiItem } from "@/types/api/admin";

const STATUS_MAP: Record<string, string> = {
  ACTIVE: "정상",
  SUSPENDED: "일시 정지",
  PERMANENTLY_SUSPENDED: "영구 정지",
};

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

function adaptAdminItem(item: SAAdminItem): AdminMemberApiItem {
  return {
    id: String(item.id),
    number: String(item.id).padStart(6, "0"),
    name: item.name,
    phone: item.phone || "",
    report_count: item.reportCount,
    block_count: item.suspendCount,
    last_access_date: item.lastLoginAt ? formatDate(item.lastLoginAt) : "",
    join_date: item.createdAt ? formatDate(item.createdAt) : "",
    status: STATUS_MAP[item.status] ?? "정상",
  };
}

export function useSAAdminList(params?: SAAdminListParams) {
  const { data, isLoading } = useQuery({
    queryKey: ["saAdminList", params],
    queryFn: () => fetchSAAdminList(params),
    staleTime: 30_000,
  });

  const adminMembers = useMemo<AdminMemberApiItem[]>(() => {
    if (!data?.admins) return [];
    return data.admins.map(adaptAdminItem);
  }, [data]);

  return { adminMembers, isLoading };
}
