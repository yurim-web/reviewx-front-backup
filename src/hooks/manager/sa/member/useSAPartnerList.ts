/* ========================================
   SA 파트너 목록 훅
   ======================================== */

/**
 * useSAPartnerList
 *
 * 목적: SA 관리자 파트너 목록을 백엔드 API에서 로드하고
 *       PartnerItem 타입으로 변환합니다.
 *
 * 사용 페이지:
 * - /manager_sa/member/partners
 */

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSAPartnerStats, fetchSAPartnerList } from "@/lib/api/admin";
import type { SAPartnerListParams, SAPartnerItem } from "@/types/api/admin";
import type {
  PartnerItem,
  PartnerDivision,
  PartnerStatus,
  PartnerStatusType,
} from "@/data/manager_ga/member/partners";
import type { MemberStats } from "@/components/manager/common/member/stats/MemberStatsSection";

const ENTITY_TYPE_MAP: Record<string, PartnerDivision> = {
  CORPORATE: "법인",
  INDIVIDUAL: "개인",
};

const PARTNER_TYPE_MAP: Record<string, PartnerStatusType> = {
  NORMAL: "일반 회원",
  CAUTION: "주의 회원",
  RESTRICTED: "이용 제한 회원",
};

const MEMBER_STATUS_MAP: Record<string, PartnerStatus> = {
  ACTIVE: "정상",
  SUSPENDED: "일시 정지",
  PENDING: "영구 정지",
  WITHDRAWN: "탈퇴",
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

function adaptPartnerItem(item: SAPartnerItem): PartnerItem {
  return {
    id: String(item.id),
    number: item.number || String(item.id).padStart(6, "0"),
    business_name: item.companyName,
    business_number: item.businessRegistrationNumber || "",
    representative_name: item.representativeName,
    division: ENTITY_TYPE_MAP[item.entityType] ?? ("개인" as PartnerDivision),
    campaign_in_progress: item.campaignCount,
    campaign_completed: item.campaignCompleted ?? 0,
    current_points: item.pointBalance ?? 0,
    used_points: 0,
    status_type: PARTNER_TYPE_MAP[item.partnerType] ?? ("일반 회원" as PartnerStatusType),
    status: MEMBER_STATUS_MAP[item.memberStatus] ?? ("정상" as PartnerStatus),
    last_access_date: item.lastLoginAt ? formatDate(item.lastLoginAt) : "",
    join_date: item.createdAt ? formatDate(item.createdAt) : "",
  };
}

/** SA 파트너 통계 (API 기반) */
export function useSAPartnerStats() {
  const { data, isLoading } = useQuery({
    queryKey: ["saPartnerStats"],
    queryFn: fetchSAPartnerStats,
    staleTime: 30_000,
  });

  const stats = useMemo<MemberStats>(() => {
    if (!data?.partnerStats)
      return { total_members: 0, monthly_active: 0, monthly_new: 0, dormant: 0 };
    return {
      total_members: data.partnerStats.totalCount,
      monthly_active: data.partnerStats.monthlyActiveCount,
      monthly_new: data.partnerStats.monthlyNewCount,
      dormant: data.partnerStats.dormantCount,
    };
  }, [data]);

  return { stats, isLoading };
}

/** SA 파트너 목록 (서버사이드 필터) */
export function useSAPartnerList(params?: SAPartnerListParams) {
  const { data: listData, isLoading } = useQuery({
    queryKey: ["saPartnerList", params],
    queryFn: () => fetchSAPartnerList(params),
    staleTime: 30_000,
  });

  const partners = useMemo<PartnerItem[]>(() => {
    if (!listData?.partners) return [];
    return listData.partners.map(adaptPartnerItem);
  }, [listData]);

  return { partners, isLoading };
}
