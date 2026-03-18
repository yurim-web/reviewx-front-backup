"use client";

/**
 * 인증 상태 전역 관리 Context
 * LocalStorage 기반 세션 관리
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // 자동 로그인 체크 (초기 로드 시 및 경로 변경 시) — pathname 기반 역할별 유저 로드
  useEffect(() => {
    const storedUser = checkAutoLogin(pathname);
    if (storedUser) {
      setUser(storedUser);
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, [pathname]); // pathname 변경 시에도 재실행

  // 로그인 함수
  const login = useCallback(
    async (credentials: LoginCredentials, role: UserRole) => {
      try {
        setIsLoading(true);

        // 인증 처리
        const authUser = await authenticateUser(credentials, role);

        // 이용 제한 상태 → 해당 역할 localStorage 정리 후 차단 페이지로 리다이렉트
        if (authUser.status === "BLOCKED") {
          clearAuthStorageForRole(authUser.role);
          const blockedPath =
            role === "partner"
              ? "/partner/blocked"
              : role === "user"
                ? "/user/blocked"
                : "/partner/login";
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
  const logout = useCallback(() => {
    if (user) {
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
