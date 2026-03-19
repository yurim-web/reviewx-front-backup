/* ========================================
   🔔 SA 관리자 알림 페이지
   ======================================== */

/**
 * SA 관리자 알림 페이지
 *
 * 목적: SA 관리자 단에서 사용되는 알림 페이지입니다.
 *
 * 사용 페이지:
 * - /manager_sa/notification
 */

"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import styles from "@/styles/user/notification/notification.module.css";
import NotificationList from "@/components/notification/NotificationList";
import Toast from "@/components/common/toast/Toast";
import Loading from "@/app/loading";
import { fetchAdminNotifications } from "@/lib/api/notification";
import { mockManagerSANotifications } from "@/data/notification/notificationData";

export default function ManagerSANotificationPage() {
  const [notifications, setNotifications] = useState(mockManagerSANotifications);
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

  const handle_notification_click = (_notification: (typeof mockManagerSANotifications)[0]) => {
    // TODO: 알림 상세 페이지로 이동 또는 모달 열기
  };

  if (isLoading) return <Loading />;

  /** 전체 삭제 버튼 클릭 → 바로 삭제 후 토스트만 표시 */
  const handle_delete_all_click = () => {
    setNotifications([]);
    set_is_delete_toast_open(true);
  };

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
