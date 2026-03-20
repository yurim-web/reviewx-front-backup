import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPartnerNotifications,
  deleteAllPartnerNotifications,
} from "@/lib/api/partnerNotification";
import type { PartnerNotificationsResponse } from "@/types/api/partnerNotification";
import { useAuth } from "@/hooks/useAuth";

/**
 * 파트너 알림 목록 조회 (커서 기반 무한 스크롤)
 */
export function usePartnerNotifications(size: number = 20) {
  return useInfiniteQuery<PartnerNotificationsResponse>({
    queryKey: ["partnerNotifications"],
    queryFn: ({ pageParam }) =>
      getPartnerNotifications({
        cursor: pageParam as string | undefined,
        size,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 30_000,
  });
}

/**
 * 파트너 알림 유무 확인 (헤더 배지용)
 * 로그인 상태에서만 조회, 첫 페이지 items 존재 여부로 판단
 */
export function useHasPartnerNotifications(): boolean {
  const { user } = useAuth();

  const { data } = useQuery<PartnerNotificationsResponse>({
    queryKey: ["partnerNotifications", "badge"],
    queryFn: () => getPartnerNotifications({ size: 1 }),
    enabled: !!user,
    staleTime: 60_000,
    retry: false,
  });

  if (!user) return false;
  return (data?.items?.length ?? 0) > 0;
}

/**
 * 파트너 알림 전체 삭제
 */
export function useDeleteAllPartnerNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAllPartnerNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partnerNotifications"] });
    },
  });
}
