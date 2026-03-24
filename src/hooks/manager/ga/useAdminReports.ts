/* ========================================
   관리자 신고 내역 훅
   ======================================== */

/**
 * useAdminReports
 *
 * 목적: 관리자 신고 내역을 실제 백엔드 API에서 로드하고
 *       ReportedCampaignItem 타입으로 변환하여 반환합니다.
 *
 * 사용 페이지:
 * - /manager_ga/campaign/reported
 * - /manager_sa/campaign/reported
 *
 * 백엔드 API:
 * - GET /api/admin/reports/codes  → 신고 코드 목록
 * - GET /api/admin/reports/stats  → 신고 통계
 * - GET /api/admin/reports        → 신고 내역 목록
 */

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getReportCodes, getReportStats, getReportList } from "@/lib/api/admin";
import type {
  ReportCodeApiItem,
  ReportStatApiItem,
  ReportListApiItem,
  ReportListParams,
  ReportStatsParams,
} from "@/types/api/admin";
import type {
  ReportedCampaignItem,
  ReportCodeInfo,
  ReportCategory,
} from "@/data/manager_ga/reported";
import type { ReportCode } from "@/data/manager_ga/common/filterOptions";

// ── 백엔드 → 프론트 매핑 ──

// 백엔드 targetType 한국어("리뷰어") 또는 영어("REVIEWER") 모두 대응
const TARGET_TYPE_MAP: Record<string, ReportCategory> = {
  REVIEWER: "리뷰어",
  PARTNER: "파트너",
  SYSTEM: "시스템",
  ETC: "기타",
  리뷰어: "리뷰어",
  파트너: "파트너",
  시스템: "시스템",
  기타: "기타",
};

/** 백엔드 ReportCodeApiItem → 프론트 ReportCodeInfo */
function adaptReportCode(item: ReportCodeApiItem): ReportCodeInfo {
  return {
    code: item.code as ReportCode,
    category: TARGET_TYPE_MAP[item.targetType] ?? "기타",
    reason: item.label,
  };
}

/** 백엔드 ReportListApiItem → 프론트 ReportedCampaignItem */
function adaptReport(item: ReportListApiItem): ReportedCampaignItem {
  // processedAt: ISO 8601 → "yyyy-MM-dd HH:mm" 형식
  const date = new Date(item.processedAt);
  const pad = (n: number) => String(n).padStart(2, "0");
  const processed_date = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;

  return {
    id: item.reportNumber,
    campaign_number: item.reportNumber,
    campaign_name: item.campaignTitle,
    report_code: item.reportCode as ReportCode,
    report_reason: item.reportCodeLabel,
    inspector: item.inspector,
    target: item.targetName,
    target_user_id: item.targetUserId,
    processed_date,
    report_count: item.reportCount,
  };
}

/** 백엔드 ReportStatApiItem → 프론트용 { code, count } */
function adaptStat(item: ReportStatApiItem): { code: ReportCode; count: number } {
  return {
    code: item.code as ReportCode,
    count: item.count,
  };
}

// ── 메인 훅 ──

export function useAdminReports(params?: ReportListParams) {
  // 신고 코드 목록 조회 (한 번만)
  const { data: codesData } = useQuery({
    queryKey: ["adminReportCodes"],
    queryFn: getReportCodes,
    staleTime: Infinity, // 코드 목록은 고정 — 재요청 불필요
  });

  // 신고 통계 조회
  const statsParams: ReportStatsParams | undefined =
    params?.startDate || params?.endDate
      ? { startDate: params?.startDate, endDate: params?.endDate }
      : undefined;

  const { data: statsData } = useQuery({
    queryKey: ["adminReportStats", statsParams],
    queryFn: () => getReportStats(statsParams),
    staleTime: 30_000,
  });

  // 신고 내역 목록 조회
  const {
    data: reportsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["adminReports", params],
    queryFn: () => getReportList(params),
    staleTime: 30_000,
  });

  // 백엔드 → 프론트 변환
  const reportCodes = useMemo<ReportCodeInfo[]>(() => {
    if (codesData && codesData.length > 0) {
      return codesData.map(adaptReportCode);
    }
    return [];
  }, [codesData]);

  const reportStats = useMemo(() => {
    if (statsData && statsData.length > 0) {
      return statsData.map(adaptStat);
    }
    return [];
  }, [statsData]);

  const reports = useMemo<ReportedCampaignItem[]>(() => {
    if (reportsData && reportsData.length > 0) {
      return reportsData.map(adaptReport);
    }
    return [];
  }, [reportsData]);

  return {
    reportCodes,
    reportStats,
    reports,
    isLoading,
    isError,
  };
}
