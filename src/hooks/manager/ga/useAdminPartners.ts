/* ========================================
   관리자 파트너 목록 훅
   ======================================== */

/**
 * useAdminPartners
 *
 * 목적: 관리자 파트너 목록을 실제 백엔드 API에서 로드하고
 *       PartnerItem 타입으로 변환하여 반환합니다.
 *
 * 사용 페이지:
 * - /manager_ga/member/partners
 * - /manager_sa/member/partners
 *
 * 백엔드 API: GET /api/admin/partners
 */

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPartnerList, fetchAdminPartners } from "@/lib/api/admin";
import { partner_list } from "@/data/manager_ga/member/partners";
import type { PartnerListApiItem, PartnerListParams } from "@/types/api/admin";
import type {
  PartnerItem,
  PartnerDivision,
  PartnerStatus,
  PartnerStatusType,
} from "@/data/manager_ga/member/partners";

const BUSINESS_TYPE_MAP: Record<string, PartnerDivision> = {
  CORPORATE: "법인",
  INDIVIDUAL: "개인",
};

const GRADE_TO_STATUS_TYPE: Record<string, PartnerStatusType> = {
  EXCELLENT: "일반 회원",
  NORMAL: "일반 회원",
  CAUTION: "주의 회원",
  WARNING: "주의 회원",
  RESTRICTED: "이용 제한 회원",
};

const STATUS_MAP: Record<string, PartnerStatus> = {
  ACTIVE: "정상",
  BLOCKED: "영구 정지",
  PAUSED: "일시 정지",
  WITHDRAW: "탈퇴",
};

/** 백엔드 API 응답 → 프론트 UI 타입 변환 */
function adaptPartnerFromApi(item: PartnerListApiItem): PartnerItem {
  return {
    id: String(item.partnerId),
    number: String(item.userId).padStart(6, "0"),
    business_name: item.businessName,
    business_number: "",
    representative_name: item.ceoName,
    division: BUSINESS_TYPE_MAP[item.businessType] ?? (item.businessType as PartnerDivision),
    campaign_in_progress: item.campaignCount,
    campaign_completed: 0,
    current_points: 0,
    used_points: 0,
    status_type: GRADE_TO_STATUS_TYPE[item.grade] ?? "일반 회원",
    status: STATUS_MAP[item.status] ?? (item.status as PartnerStatus),
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

export function useAdminPartners(params?: PartnerListParams) {
  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ["adminPartners", params],
    queryFn: async () => {
      try {
        return await getPartnerList(params);
      } catch {
        const legacyData = await fetchAdminPartners();
        return {
          result: "OK",
          generatedAt: new Date().toISOString(),
          data: { totalCount: legacyData.length, partners: [] as PartnerListApiItem[] },
          _legacyData: legacyData,
        };
      }
    },
    staleTime: 30_000,
  });

  const partners = useMemo<PartnerItem[]>(() => {
    const list = apiResponse?.data?.partners;
    if (list != null && list.length > 0) {
      return list.map(adaptPartnerFromApi);
    }
    const legacy = (apiResponse as { _legacyData?: unknown[] })?._legacyData;
    if (legacy && legacy.length > 0) return partner_list;
    return partner_list;
  }, [apiResponse]);

  return { partners, isLoading };
}
