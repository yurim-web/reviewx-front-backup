/* ========================================
   인증 LocalStorage 스토리지 유틸리티
   ======================================== */

/**
 * auth/storage
 *
 * 목적: LocalStorage 기반 인증 사용자 정보·토큰 저장/조회/삭제 함수 제공
 *
 * 사용 페이지:
 * - src/lib/auth.ts (인증 메인 모듈)
 */

import { AuthUser } from "@/types/auth";

const AUTH_STORAGE_KEY = "reviewx_auth_user";
const TOKEN_STORAGE_KEY = "reviewx_auth_token";

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as AuthUser;
  } catch (_error) {
    return null;
  }
}

export function setStoredUser(user: AuthUser): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch (_error) {}
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearAuthStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  try {
    localStorage.removeItem("reviewx_auth_user_reviewer");
    localStorage.removeItem("reviewx_auth_user_partner");
  } catch (_error) {}
}
