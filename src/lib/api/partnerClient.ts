import axios from "axios";

/**
 * 파트너 전용 axios 인스턴스
 * - withCredentials: true → 세션 쿠키(JSESSIONID / REMEMBER_ME) 자동 포함
 * - 리뷰어 apiClient(Bearer Token)와 별도로 관리
 */
export const partnerApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// 401 응답 → 세션 만료 → 로그인 페이지 리다이렉트 (로그인 페이지 자체에서는 스킵)
partnerApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const isLoginPage = window.location.pathname === "/partner/login";
      if (!isLoginPage) {
        window.location.href = "/partner/login";
      }
    }
    return Promise.reject(error);
  }
);
