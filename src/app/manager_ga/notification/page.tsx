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

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import styles from "@/styles/user/notification/notification.module.css";
import NotificationList from "@/components/notification/NotificationList";
import Toast from "@/components/common/toast/Toast";
import Loading from "@/app/loading";
import { fetchAdminNotifications, deleteAllAdminNotifications } from "@/lib/api/notification";
import { mockManagerGANotifications } from "@/data/notification/notificationData";

export default function ManagerGANotificationPage() {
  const [notifications, setNotifications] = useState(mockManagerGANotifications);
  const [is_delete_toast_open, set_is_delete_toast_open] = useState(false);

  const { data: apiData, isLoading } = useQuery({
    queryKey: ["adminNotifications"],
    queryFn: fetchAdminNotifications,
    retry: false,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (apiData && apiData.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setNotifications(apiData as any);
    }
  }, [apiData]);

  const handle_notification_click = (_notification: (typeof mockManagerGANotifications)[0]) => {
    // TODO: 알림 상세 페이지로 이동 또는 모달 열기
  };

  const handle_delete_all_click = async () => {
    try {
      await deleteAllAdminNotifications();
    } catch {
      // 백엔드 미개발 시 무시하고 UI 반영
    }
    setNotifications([]);
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
