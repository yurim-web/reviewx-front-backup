/* ========================================
   Mock 인증 메인 모듈
   ======================================== */

/**
 * auth
 *
 * 목적: 개발용 Mock 인증 진입점. 로그인·로그아웃·자동 로그인·사용자 정보 업데이트·역할별 경로 제공
 *
 * 사용 페이지:
 * - 전체 앱 (인증이 필요한 모든 페이지)
 */

import { AuthUser, LoginCredentials, UserRole } from "@/types/auth";
import { findAccountByCredentials, type UnifiedAccount } from "@/data/login/unifiedAccountData";
import { mapToAuthUser } from "./auth/userMapper";
import { applyPostLoginSideEffects } from "./auth/postLoginSetup";
import {
  getStoredUser,
  getStoredUserByRole,
  setStoredUser,
  getStoredToken,
  setStoredToken,
  clearAuthStorage,
  clearAuthStorageForRole,
  getRoleFromPathname,
} from "./auth/storage";

// LocalStorage 스토리지 함수 re-export (기존 import 경로 유지)
export {
  getStoredUser,
  getStoredUserByRole,
  setStoredUser,
  getStoredToken,
  setStoredToken,
  clearAuthStorage,
  clearAuthStorageForRole,
  getRoleFromPathname,
};

// ========================================
// 로그인 처리
// ========================================

export async function authenticateUser(
  credentials: LoginCredentials,
  role?: UserRole
): Promise<AuthUser> {
  const account = findAccountByCredentials(credentials.email, credentials.password);

  if (!account) {
    throw new Error("이메일 또는 비밀번호가 일치하지 않습니다.");
  }
  if (account.isBanned) {
    throw new Error("정지되었거나 탈퇴된 계정입니다.");
  }
  // isBlocked 계정은 로그인 성공 후 프론트에서 /blocked 페이지로 분기 처리
  // (명세서 P-L4: POST 200 + user.status = 이용 제한 → 전용 화면 표시)

  const authUser = mapToAuthUser(account);

  if (role && authUser.role !== role) {
    throw new Error("해당 계정 유형으로 로그인할 수 없습니다.");
  }

  const mockToken = `mock_token_${authUser.id}_${Date.now()}`;
  setStoredUser(authUser);
  setStoredToken(mockToken, authUser.role);
  applyPostLoginSideEffects(account, authUser);

  return authUser;
}

// ========================================
// SNS 로그인 (UnifiedAccount 직접 처리)
// ========================================

export async function authenticateUnifiedAccount(account: UnifiedAccount): Promise<AuthUser> {
  const authUser = mapToAuthUser(account);

  const mockToken = `mock_token_${authUser.id}_${Date.now()}`;
  setStoredUser(authUser);
  setStoredToken(mockToken, authUser.role);
  applyPostLoginSideEffects(account, authUser);

  return authUser;
}

// ========================================
// 자동 로그인 확인
// ========================================

export function checkAutoLogin(pathname?: string): AuthUser | null {
  // pathname이 있으면 해당 역할의 유저를 로드
  if (pathname) {
    const role = getRoleFromPathname(pathname);
    const user = getStoredUserByRole(role);
    const token = getStoredToken(role);
    if (user && token) return user;
  }
  // fallback: 레거시 키에서 읽기
  const user = getStoredUser();
  const token = getStoredToken();
  if (!user || !token) return null;
  return user;
}

// ========================================
// 로그아웃
// ========================================

export function performLogout(): void {
  clearAuthStorage();
}

// ========================================
// 사용자 정보 업데이트
// ========================================

export function updateStoredUser(updates: Partial<AuthUser>): AuthUser | null {
  const currentUser = getStoredUser();
  if (!currentUser) return null;

  const updatedUser = { ...currentUser, ...updates };
  setStoredUser(updatedUser);
  return updatedUser;
}

// ========================================
// 역할별 경로
// ========================================

export function getHomePathForRole(role: UserRole): string {
  switch (role) {
    case "user":
      return "/user/campaign_management/applied";
    case "partner":
      return "/partner/campaign_management";
    case "manager_ga":
      return "/manager_ga";
    case "manager_sa":
      return "/manager_sa";
    default:
      return "/";
  }
}

export function getLoginPathForRole(role: UserRole): string {
  switch (role) {
    case "user":
      return "/user/login";
    case "partner":
      return "/partner/login";
    case "manager_ga":
    case "manager_sa":
      return "/manager/login";
    default:
      return "/";
  }
}
