'use client';

/**
 * 보호된 라우트를 위한 HOC (Higher-Order Component)
 * 로그인하지 않은 사용자가 접근 시 로그인 페이지로 리다이렉트
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types/auth';
import { getLoginPathForRole } from '@/lib/auth';

interface WithAuthOptions {
  /**
   * 허용되는 역할 목록
   * 지정하지 않으면 모든 로그인된 사용자 허용
   */
  allowedRoles?: UserRole[];

  /**
   * 리다이렉트할 경로 (기본값: 역할별 로그인 페이지)
   */
  redirectTo?: string;
}

/**
 * 보호된 페이지를 만들기 위한 HOC
 *
 * @param Component - 보호할 컴포넌트
 * @param options - 옵션 (허용 역할, 리다이렉트 경로)
 *
 * @example
 * ```tsx
 * // 파트너만 접근 가능
 * export default withAuth(PartnerDashboard, { allowedRoles: ['partner'] });
 *
 * // 모든 로그인된 사용자 접근 가능
 * export default withAuth(MyPage);
 * ```
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  return function ProtectedRoute(props: P) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // 로딩 중에는 체크하지 않음
      if (isLoading) return;

      // 로그인하지 않은 경우
      if (!user) {
        // 허용된 역할에 따라 적절한 로그인 페이지로 리다이렉트
        let redirectPath = options.redirectTo;

        if (!redirectPath && options.allowedRoles) {
          // 허용된 역할 중 첫 번째 역할의 로그인 페이지로 이동
          const targetRole = options.allowedRoles[0];
          redirectPath = getLoginPathForRole(targetRole);
          console.log('[withAuth] No user, redirecting:', { targetRole, redirectPath, allowedRoles: options.allowedRoles });
        }

        // 기본값은 유저 로그인 페이지 (redirectPath가 여전히 없는 경우에만)
        if (!redirectPath) {
          redirectPath = '/user/login';
          console.log('[withAuth] Using default redirect:', redirectPath);
        }

        console.log('[withAuth] Final redirect:', redirectPath);
        router.push(redirectPath);
        return;
      }

      // 허용된 역할이 지정되어 있고, 현재 사용자 역할이 포함되지 않은 경우
      if (options.allowedRoles && !options.allowedRoles.includes(user.role)) {
        // 잘못된 역할로 접근 시, 페이지가 요구하는 역할의 로그인 페이지로 리다이렉트
        // (현재 로그인된 사용자의 역할이 아니라, 이 페이지가 필요로 하는 역할의 로그인 페이지로 이동)
        const targetRole = options.allowedRoles[0];
        const loginPath = getLoginPathForRole(targetRole);
        console.log('[withAuth] Wrong role, redirecting to target role login:', { currentRole: user.role, targetRole, loginPath });
        router.push(loginPath);
        return;
      }
    }, [user, isLoading, router]);

    // 로딩 중이거나 인증되지 않은 경우 null 반환 (빈 화면)
    if (isLoading || !user) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '16px',
          color: '#666'
        }}>
          로딩 중...
        </div>
      );
    }

    // 허용된 역할 체크
    if (options.allowedRoles && !options.allowedRoles.includes(user.role)) {
      return null;
    }

    // 인증된 사용자에게 컴포넌트 표시
    return <Component {...props} />;
  };
}

/**
 * 역할별 전용 HOC
 */

// 리뷰어 전용
export function withUserAuth<P extends object>(Component: React.ComponentType<P>) {
  return withAuth(Component, { allowedRoles: ['user'] });
}

// 파트너 전용
export function withPartnerAuth<P extends object>(Component: React.ComponentType<P>) {
  return withAuth(Component, { allowedRoles: ['partner'] });
}

// 관리자 전용 (GA + SA)
export function withAdminAuth<P extends object>(Component: React.ComponentType<P>) {
  return withAuth(Component, { allowedRoles: ['manager_ga', 'manager_sa'] });
}

// GA 전용
export function withGAAuth<P extends object>(Component: React.ComponentType<P>) {
  return withAuth(Component, { allowedRoles: ['manager_ga'] });
}

// SA 전용
export function withSAAuth<P extends object>(Component: React.ComponentType<P>) {
  return withAuth(Component, { allowedRoles: ['manager_sa'] });
}
