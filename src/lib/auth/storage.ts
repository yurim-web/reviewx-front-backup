/* ========================================
   인증 LocalStorage 스토리지 유틸리티
   ======================================== */

/**
 * auth/storage
 *
 * 목적: LocalStorage 기반 인증 사용자 정보·토큰 저장/조회/삭제 함수 제공
 *       역할별 독립 저장소로 동시 로그인 지원
 *
 * 사용 페이지:
 * - src/lib/auth.ts (인증 메인 모듈)
 */

import { AuthUser, UserRole } from "@/types/auth";

// 역할별 스토리지 키
function getStorageKey(role: UserRole): string {
  return `reviewx_auth_user_${role}`;
}

function getTokenKey(role: UserRole): string {
  return `reviewx_auth_token_${role}`;
}

// 레거시 키 (하위 호환용)
const LEGACY_AUTH_KEY = "reviewx_auth_user";
const LEGACY_TOKEN_KEY = "reviewx_auth_token";

// pathname에서 역할 추출
export function getRoleFromPathname(pathname: string): UserRole {
  if (pathname.startsWith("/partner")) return "partner";
  if (pathname.startsWith("/manager_sa")) return "manager_sa";
  if (pathname.startsWith("/manager_ga")) return "manager_ga";
  if (pathname.startsWith("/manager")) return "manager_ga";
  return "user";
}

// 역할별 저장
export function setStoredUser(user: AuthUser): void {
  if (typeof window === "undefined") return;
  try {
    const key = getStorageKey(user.role);
    localStorage.setItem(key, JSON.stringify(user));
    // 레거시 키에도 저장 (하위 호환)
    localStorage.setItem(LEGACY_AUTH_KEY, JSON.stringify(user));
  } catch (_error) {}
}

// 역할별 조회
export function getStoredUserByRole(role: UserRole): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const key = getStorageKey(role);
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    return JSON.parse(stored) as AuthUser;
  } catch (_error) {
    return null;
  }
}

// 기존 getStoredUser — 레거시 키에서 읽기 (fallback)
export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(LEGACY_AUTH_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as AuthUser;
  } catch (_error) {
    return null;
  }
}

export function setStoredToken(token: string, role?: UserRole): void {
  if (typeof window === "undefined") return;
  if (role) {
    localStorage.setItem(getTokenKey(role), token);
  }
  localStorage.setItem(LEGACY_TOKEN_KEY, token);
}

export function getStoredToken(role?: UserRole): string | null {
  if (typeof window === "undefined") return null;
  if (role) {
    return localStorage.getItem(getTokenKey(role));
  }
  return localStorage.getItem(LEGACY_TOKEN_KEY);
}

// 특정 역할만 클리어
export function clearAuthStorageForRole(role: UserRole): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(getStorageKey(role));
  localStorage.removeItem(getTokenKey(role));
}

// 전체 클리어
export function clearAuthStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LEGACY_AUTH_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
  const roles: UserRole[] = ["user", "partner", "manager_ga", "manager_sa"];
  for (const role of roles) {
    localStorage.removeItem(getStorageKey(role));
    localStorage.removeItem(getTokenKey(role));
  }
}
