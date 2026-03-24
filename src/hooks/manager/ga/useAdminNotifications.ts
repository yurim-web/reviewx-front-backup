import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAdminNotifications,
  readAdminNotification,
  readAllAdminNotifications,
  deleteAdminNotification,
  deleteAllAdminNotifications,
} from "@/lib/api/notification";
import type { AdminNotificationParams } from "@/types/api/notification";

const QUERY_KEY = "adminNotifications";

/** 관리자 알림 목록 조회 */
export function useAdminNotifications(params?: AdminNotificationParams) {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => fetchAdminNotifications(params),
    staleTime: 30_000,
  });
}

/** 개별 알림 읽음 처리 */
export function useReadAdminNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: readAdminNotification,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
}

/** 전체 알림 읽음 처리 */
export function useReadAllAdminNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: readAllAdminNotifications,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
}

/** 개별 알림 삭제 */
export function useDeleteAdminNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminNotification,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
}

/** 전체 알림 삭제 */
export function useDeleteAllAdminNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAllAdminNotifications,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
}
