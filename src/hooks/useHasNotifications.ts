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
 * 우선순위:
 * 1. API 데이터 로드 완료 → API 기준 (빈 배열이면 false)
 * 2. API 로딩 중 / 실패 (undefined) → localStorage 확인 → mock fallback
 *    (로딩 중 깜빡임 방지: mock에 데이터 있으면 active 유지)
 */

import { useQuery } from "@tanstack/react-query";
import { fetchNotifications } from "@/lib/api/notification";
import { useAuth } from "@/hooks/useAuth";

function getReviewerId(userId: string): number {
  if (userId.includes("kakao")) return 1;
  if (userId.includes("naver")) return 2;
  return 1;
}

function checkLocalStorage(userId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const stored = localStorage.getItem("notifications");
    if (!stored) return false;
    const all = JSON.parse(stored);
    return (all as { user_id: string }[]).some((n) => n.user_id === userId);
  } catch {
    return false;
  }
}

export function useHasNotifications(): boolean {
  const { user } = useAuth();
  const reviewerId = user ? getReviewerId(user.id) : 0;

  const { data: apiNotifications } = useQuery({
    queryKey: ["notifications", reviewerId],
    queryFn: () => fetchNotifications(reviewerId),
    enabled: !!user && reviewerId > 0,
    staleTime: 30_000,
    retry: false,
  });

  if (!user) return false;

  // 1. API 응답 완료 → API 기준
  if (apiNotifications != null) {
    if (apiNotifications.length > 0) return true;
    // API가 빈 배열 → localStorage도 확인 (전체 삭제 이후에도 로컬 알림이 있을 수 있음)
    return checkLocalStorage(user.id);
  }

  // 2. API 로딩 중 / 실패 (undefined) → localStorage 확인
  return checkLocalStorage(user.id);
}
