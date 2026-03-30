/* ========================================
   알림 유무 확인 훅
   ======================================== */

/**
 * useHasNotifications
 *
 * 목적: 현재 로그인된 사용자의 알림 존재 여부를 반환합니다.
 *       Header 알림 아이콘의 활성/비활성 상태 결정에 사용됩니다.
 *
 * 사용 위치:
 * - src/components/fragments/Header.tsx
 *
 * 호출 API:
 * - GET /user/notification (R-26) — 알림 페이지와 캐시 공유
 */

import { useQuery } from "@tanstack/react-query";
import { fetchNotifications } from "@/lib/api/notification";
import { useAuth } from "@/hooks/useAuth";

export function useHasNotifications(): boolean {
  const { user } = useAuth();

  const { data: apiResponse } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetchNotifications(),
    enabled: !!user && user.role === "user",
    staleTime: 30_000,
    retry: false,
  });

  if (!user) return false;

  // API 응답 기준: items가 1개 이상이면 알림 있음
  return (apiResponse?.items?.length ?? 0) > 0;
}
