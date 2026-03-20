/* ========================================
   GA 관리자 알림 페이지
   ======================================== */

/**
 * ManagerGANotificationPage
 *
 * 목적: GA 관리자 알림 목록 표시 (API 연결, 정적 데이터 fallback)
 *
 * 사용 페이지:
 * - /manager_ga/notification
 */

"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "@/styles/user/notification/notification.module.css";
import NotificationList from "@/components/notification/NotificationList";
import Toast from "@/components/common/toast/Toast";
import Loading from "@/app/loading";
import { fetchAdminNotifications, deleteAllAdminNotifications } from "@/lib/api/notification";
import {
  mockManagerGANotifications,
  type NotificationItem,
  type NotificationCategory,
} from "@/data/notification/notificationData";
import type { NotificationApiItem } from "@/types/api/notification";

function mapApiToNotificationItem(api: NotificationApiItem): NotificationItem {
  return {
    id: api.id,
    category: (api.type || "A_A1") as NotificationCategory,
    time: api.created_at,
    campaign_id: api.campaign_id,
    campaign_name: api.campaign_name,
  };
}

export default function ManagerGANotificationPage() {
  const queryClient = useQueryClient();
  const [is_cleared, set_is_cleared] = useState(false);
  const [is_delete_toast_open, set_is_delete_toast_open] = useState(false);

  const {
    data: apiData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["adminNotifications"],
    queryFn: fetchAdminNotifications,
    retry: false,
    staleTime: 30_000,
  });

  const notifications = useMemo<NotificationItem[]>(() => {
    if (is_cleared) return [];
    if (apiData != null && apiData.length > 0) {
      return apiData.map(mapApiToNotificationItem);
    }
    if (isError || !apiData) {
      return mockManagerGANotifications;
    }
    return [];
  }, [apiData, isError, is_cleared]);

  const handle_notification_click = (_notification: NotificationItem) => {
    // TODO: 알림 상세 페이지로 이동 또는 모달 열기
  };

  const handle_delete_all_click = async () => {
    try {
      await deleteAllAdminNotifications();
    } catch {
      // 백엔드 미개발 시 무시하고 UI 반영
    }
    set_is_cleared(true);
    queryClient.invalidateQueries({ queryKey: ["adminNotifications"] });
    set_is_delete_toast_open(true);
  };

  if (isLoading) return <Loading />;

  return (
    <div className={`${styles.notification_container} ${styles.has_sidebar}`.trim()}>
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
