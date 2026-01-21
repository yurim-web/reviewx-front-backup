/**
 * 인증 관련 유틸리티 함수
 * LocalStorage를 사용한 세션 관리
 */

import { AuthUser, LoginCredentials, UserRole } from '@/types/auth';
import { findAccountByCredentials, type UnifiedAccount } from '@/data/login/unifiedAccountData';

/**
 * UnifiedAccount를 AuthUser로 변환
 */
function mapToAuthUser(account: UnifiedAccount): AuthUser {
  // userType을 role로 매핑
  let role: UserRole;
  switch (account.userType) {
    case 'admin_sa':
      role = 'manager_sa';
      break;
    case 'admin_ga':
      role = 'manager_ga';
      break;
    case 'partner':
      role = 'partner';
      break;
    case 'user':
      role = 'user';
      break;
    default:
      throw new Error('Unknown user type');
  }

  // 기본 사용자 정보
  const authUser: AuthUser = {
    id: account.email, // 이메일을 ID로 사용
    email: account.email,
    name: account.email.split('@')[0], // 이메일에서 이름 추출 (임시)
    role,
  };

  // 역할별 추가 정보
  if (role === 'user') {
    authUser.grade = 'gold'; // 기본값
    authUser.channels = [];
  } else if (role === 'partner') {
    authUser.business_name = '테스트 사업자'; // 기본값
    authUser.business_number = '123-45-67890';
    authUser.approval_status = 'approved';
  } else if (role.startsWith('manager')) {
    authUser.admin_level = role === 'manager_sa' ? 'SA' : 'GA';
    authUser.permissions = ['all'];
  }

  return authUser;
}

const AUTH_STORAGE_KEY = 'reviewx_auth_user';
const TOKEN_STORAGE_KEY = 'reviewx_auth_token';

/**
 * LocalStorage에서 사용자 정보 조회
 */
export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;

    return JSON.parse(stored) as AuthUser;
  } catch (error) {
    console.error('Failed to parse stored user:', error);
    return null;
  }
}

/**
 * LocalStorage에 사용자 정보 저장
 */
export function setStoredUser(user: AuthUser): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to store user:', error);
  }
}

/**
 * LocalStorage에서 토큰 조회
 */
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;

  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

/**
 * LocalStorage에 토큰 저장
 */
export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

/**
 * LocalStorage에서 인증 정보 삭제
 */
export function clearAuthStorage(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

/**
 * 로그인 처리 (Mock 데이터 사용)
 */
export async function authenticateUser(
  credentials: LoginCredentials,
  role?: UserRole
): Promise<AuthUser> {
  // Mock 데이터에서 사용자 찾기
  const account = findAccountByCredentials(credentials.email, credentials.password);

  if (!account) {
    throw new Error('이메일 또는 비밀번호가 일치하지 않습니다.');
  }

  // 차단된 계정 확인
  if (account.isBlocked) {
    throw new Error('이용이 제한된 계정입니다.');
  }

  // 정지/탈퇴 계정 확인
  if (account.isBanned) {
    throw new Error('정지되었거나 탈퇴된 계정입니다.');
  }

  // AuthUser 객체 생성 (매핑 함수 사용)
  const authUser = mapToAuthUser(account);

  // 역할 검증
  // role 파라미터가 전달된 경우에만 검증을 수행합니다.
  // (소셜 로그인 / 자동 로그인 등에서는 role을 생략하고 사용할 수 있도록 하기 위함입니다.)
  if (role && authUser.role !== role) {
    throw new Error('해당 계정 유형으로 로그인할 수 없습니다.');
  }

  // Mock 토큰 생성 (실제 JWT 대신)
  const mockToken = `mock_token_${authUser.id}_${Date.now()}`;

  // LocalStorage에 저장
  setStoredUser(authUser);
  setStoredToken(mockToken);

  return authUser;
}

/**
 * 자동 로그인 체크 (페이지 로드 시)
 */
export function checkAutoLogin(): AuthUser | null {
  const user = getStoredUser();
  const token = getStoredToken();

  if (!user || !token) {
    return null;
  }

  // 토큰 유효성 검증 (실제로는 서버에 요청)
  // 여기서는 간단히 존재 여부만 확인
  return user;
}

/**
 * 로그아웃 처리
 */
export function performLogout(): void {
  clearAuthStorage();
}

/**
 * 사용자 정보 업데이트
 */
export function updateStoredUser(updates: Partial<AuthUser>): AuthUser | null {
  const currentUser = getStoredUser();

  if (!currentUser) {
    return null;
  }

  const updatedUser = { ...currentUser, ...updates };
  setStoredUser(updatedUser);

  return updatedUser;
}

/**
 * 역할별 홈 경로 반환
 */
export function getHomePathForRole(role: UserRole): string {
  switch (role) {
    case 'user':
      return '/user/campaign_management/applied';
    case 'partner':
      return '/partner/campaign_management';
    case 'manager_ga':
      return '/manager_ga';
    case 'manager_sa':
      return '/manager_sa';
    default:
      return '/';
  }
}

/**
 * 역할별 로그인 경로 반환
 */
export function getLoginPathForRole(role: UserRole): string {
  switch (role) {
    case 'user':
      return '/user/login';
    case 'partner':
      return '/partner/login';
    case 'manager_ga':
    case 'manager_sa':
      return '/manager/login';
    default:
      return '/';
  }
}
