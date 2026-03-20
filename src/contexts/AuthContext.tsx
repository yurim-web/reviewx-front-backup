"use client";

/**
 * 인증 상태 전역 관리 Context
 * - 파트너: 실제 API (세션 쿠키 기반)
 * - 그 외(리뷰어/관리자): LocalStorage 기반 Mock
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { AuthUser, AuthContextType, LoginCredentials, UserRole } from "@/types/auth";
import {
  authenticateUser,
  checkAutoLogin,
  performLogout,
  updateStoredUser,
  getHomePathForRole,
  clearAuthStorageForRole,
} from "@/lib/auth";
import { partnerLogin, getPartnerSession, partnerLogout } from "@/lib/api/partnerAuth";
import type { PartnerSessionAuthenticated } from "@/types/api/partnerAuth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // 자동 로그인 체크 (초기 로드 시 및 경로 변경 시)
  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      // 파트너 경로: GET /partner/session으로 세션 확인
      if (pathname?.startsWith("/partner")) {
        try {
          const session = await getPartnerSession();
          if (cancelled) return;
          if (session.result === "AUTHENTICATED") {
            setUser(mapPartnerSessionToAuthUser(session));
          } else {
            setUser(null);
          }
        } catch {
          if (!cancelled) setUser(null);
        }
      } else {
        // 그 외: 기존 localStorage 기반
        const storedUser = checkAutoLogin(pathname);
        if (!cancelled) {
          setUser(storedUser || null);
        }
      }
      if (!cancelled) setIsLoading(false);
    };

    checkAuth();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  // 파트너 세션 응답 → AuthUser 변환
  const mapPartnerSessionToAuthUser = (session: PartnerSessionAuthenticated): AuthUser => ({
    id: String(session.user.userId),
    email: session.user.email,
    name: session.user.name,
    role: "partner",
    status: session.user.status === "BLOCKED" ? "BLOCKED" : "ACTIVE",
    phone: session.user.phoneNum,
    address: session.user.address,
    detail_address: session.user.addressDetail,
    postal_code: String(session.user.postNumber),
    business_name: session.partner.businessName,
    business_number: session.partner.businessNumber,
    representative_name: session.partner.ceoName,
  });

  // 로그인 함수
  const login = useCallback(
    async (credentials: LoginCredentials, role: UserRole) => {
      try {
        setIsLoading(true);

        // ============ 파트너: 실제 API ============
        if (role === "partner") {
          const response = await partnerLogin({
            email: credentials.email,
            password: credentials.password,
          });

          const { user: loginUser, partner } = response.data;

          // 이용 제한 상태 → 차단 페이지
          if (loginUser.status === "BLOCKED") {
            router.push("/partner/blocked");
            return;
          }

          // AuthUser로 변환 & 상태 업데이트
          const authUser: AuthUser = {
            id: String(loginUser.userId),
            email: loginUser.email,
            name: loginUser.name,
            role: "partner",
            status: "ACTIVE",
            phone: loginUser.phoneNum,
            business_name: partner.businessName,
            business_number: partner.businessNumber,
            representative_name: partner.ceoName,
          };

          setUser(authUser);
          router.push(response.data.next.redirectPath || "/partner/campaign_management");
          return;
        }

        // ============ 그 외(리뷰어/관리자): 기존 Mock ============
        const authUser = await authenticateUser(credentials, role);

        // 이용 제한 상태 → 해당 역할 localStorage 정리 후 차단 페이지로 리다이렉트
        if (authUser.status === "BLOCKED") {
          clearAuthStorageForRole(authUser.role);
          const blockedPath = role === "user" ? "/user/blocked" : "/partner/login";
          router.push(blockedPath);
          return;
        }

        // 정상 상태 → 상태 업데이트 후 역할별 홈으로 리다이렉트
        setUser(authUser);
        const homePath = getHomePathForRole(role);
        router.push(homePath);
      } catch (error) {
        setIsLoading(false);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  // 로그아웃 함수 — 현재 역할만 클리어 (다른 역할 로그인 유지)
  const logout = useCallback(async () => {
    if (user?.role === "partner") {
      // 파트너: 서버 세션 무효화 API 호출
      try {
        await partnerLogout();
      } catch {
        /* 세션 이미 만료된 경우 무시 */
      }
    } else if (user) {
      clearAuthStorageForRole(user.role);
    }
    performLogout();
    setUser(null);
    router.push("/");
  }, [router, user]);

  // 사용자 정보 업데이트 함수
  const updateUser = useCallback((updates: Partial<AuthUser>) => {
    const updatedUser = updateStoredUser(updates);
    if (updatedUser) {
      setUser(updatedUser);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// useAuth hook (편리한 사용을 위해)
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
