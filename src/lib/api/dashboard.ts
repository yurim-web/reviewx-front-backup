/* ========================================
   대시보드 API 함수
   ======================================== */

/**
 * dashboard API
 *
 * 목적: 대시보드 + 검색 API 함수 (apiClient → json-server or 실제 백엔드)
 *
 * 사용 페이지:
 * - /user (대시보드 메인)
 * - /search (캠페인 검색)
 *
 * API:
 * - 20번: GET /reviewer/dashboard
 * - 21번: GET /reviewer/search?keyword=xxx
 */

import { apiClient } from "@/lib/api/client";
import type { DashboardApiResponse, SearchApiResponse, SearchApiItem } from "@/types/api/dashboard";

/** 대시보드 조회 */
export const fetchDashboard = () =>
  apiClient.get<DashboardApiResponse>("/reviewer/dashboard").then((res) => res.data);

/** 캠페인 검색 (keyword 기준) */
export const fetchSearch = (keyword: string): Promise<SearchApiItem[]> =>
  apiClient
    .get<SearchApiResponse | SearchApiItem[]>("/reviewer/search", {
      params: { keyword },
    })
    .then((res) => {
      const data = res.data;
      if (Array.isArray(data)) return data;
      return data.items ?? [];
    });
