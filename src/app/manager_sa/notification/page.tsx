/* ========================================
   SA 관리자 알림 페이지
   ======================================== */

/**
 * SA 관리자 알림 페이지
 *
 * 목적: SA 관리자 단에서 사용되는 알림 페이지입니다.
 *
 * 사용 페이지:
 * - /manager_sa/notification
 *
 * API:
 * - GET /api/admin-sa/notifications → 알림 목록 조회
 * - DELETE /api/admin-sa/notifications/all → 전체 삭제
 */

"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "@/styles/user/notification/notification.module.css";
import ManagerGAHeader from "@/components/manager/ga/common/ManagerGAHeader";
import SidebarMenuSA from "@/components/manager/sa/common/SidebarMenu";
import NotificationList from "@/components/notification/NotificationList";
import Toast from "@/components/common/toast/Toast";
import Loading from "@/app/loading";
import "@/styles/manager_ga/layout.css";
import { fetchSAAdminNotifications, deleteAllSAAdminNotifications } from "@/lib/api/notification";
import { mapAdminNotificationToItem } from "@/data/notification/notificationData";

export default function ManagerSANotificationPage() {
  const [is_delete_toast_open, set_is_delete_toast_open] = useState(false);
  const queryClient = useQueryClient();

  const { data: apiData, isLoading } = useQuery({
    queryKey: ["saAdminNotifications"],
    queryFn: fetchSAAdminNotifications,
    retry: false,
    staleTime: 30_000,
  });

  const notifications = useMemo(() => {
    const items = apiData?.data?.notifications;
    if (!items || items.length === 0) return [];
    return items.map(mapAdminNotificationToItem);
  }, [apiData]);

  const handle_notification_click = () => {
    // 알림 클릭 핸들러
  };

  const handle_delete_all_click = async () => {
    try {
      await deleteAllSAAdminNotifications();
      queryClient.setQueryData(["saAdminNotifications"], null);
    } catch {
      queryClient.setQueryData(["saAdminNotifications"], null);
    }
    set_is_delete_toast_open(true);
  };

  if (isLoading) return <Loading />;

  return (
    <div className={`${styles.notification_container} ${styles.has_sidebar}`.trim()}>
      {/* SA 관리자 헤더 */}
      <ManagerGAHeader managerType="sa" />

      {/* SA 사이드바 메뉴 */}
      <SidebarMenuSA />

      {/* 메인 콘텐츠 영역 */}
      <main className={styles.main_content}>
        <div className={styles.manager_notification_header}>
          <h1 className={styles.notification_title}>알림</h1>
          <button
            type="button"
            className={styles.delete_all_button}
            onClick={handle_delete_all_click}
          >
            전체 삭제
          </button>
        </div>

        <NotificationList
          notifications={notifications}
          on_notification_click={handle_notification_click}
        />
      </main>

      <Toast
        message="삭제되었습니다."
        isOpen={is_delete_toast_open}
        duration={1500}
        onClose={() => set_is_delete_toast_open(false)}
      />
    </div>
  );
}
