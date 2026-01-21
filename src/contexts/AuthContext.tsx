'use client';

/**
 * 인증 상태 전역 관리 Context
 * LocalStorage 기반 세션 관리
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthUser, AuthContextType, LoginCredentials, UserRole } from '@/types/auth';
import {
  authenticateUser,
  checkAutoLogin,
  performLogout,
  updateStoredUser,
  getHomePathForRole,
} from '@/lib/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 자동 로그인 체크 (초기 로드 시)
  useEffect(() => {
    const storedUser = checkAutoLogin();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  // 로그인 함수
  const login = useCallback(
    async (credentials: LoginCredentials, role: UserRole) => {
      try {
        setIsLoading(true);

        // 인증 처리
        const authUser = await authenticateUser(credentials, role);

        // 상태 업데이트
        setUser(authUser);

        // 역할별 홈으로 리다이렉트
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

  // 로그아웃 함수
  const logout = useCallback(() => {
    performLogout();
    setUser(null);
    router.push('/');
  }, [router]);

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
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
