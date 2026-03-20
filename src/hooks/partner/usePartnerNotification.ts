import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPartnerNotifications,
  deleteAllPartnerNotifications,
} from "@/lib/api/partnerNotification";
import type { PartnerNotificationsResponse } from "@/types/api/partnerNotification";

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
