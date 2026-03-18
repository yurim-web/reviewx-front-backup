/* ========================================
   axios 공통 API 클라이언트
   ======================================== */

/**
 * apiClient
 *
 * 목적: 모든 API 호출에서 공통으로 사용하는 axios 인스턴스.
 *       - 요청 인터셉터: localStorage 토큰 자동 주입
 *       - 응답 인터셉터: 401 시 로그인 페이지로 이동
 *
 * 사용 페이지:
 * - 모든 API 훅 (hooks/campaign/*, hooks/user/*, hooks/partner/*)
 */

import axios from "axios";
import { getStoredToken } from "@/lib/auth";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// 요청 인터셉터: Bearer 토큰 자동 주입
apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터: 401 → 경로별 로그인 페이지 이동
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const pathname = window.location.pathname;
      if (pathname.startsWith("/partner")) {
        window.location.href = "/partner/login";
      } else if (pathname.startsWith("/manager_sa") || pathname.startsWith("/manager_ga")) {
        window.location.href = "/manager/login";
      } else {
        window.location.href = "/user/login";
      }
    }
    return Promise.reject(error);
  }
);
