/* ========================================
   파트너 알림 페이지
   ======================================== */

/**
 * PartnerNotificationPage
 *
 * 목적: 파트너 전용 알림 목록 표시 (API 연결, 정적 데이터 fallback)
 *
 * 사용 페이지:
 * - /partner/notification
 */

"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import styles from "@/styles/user/notification/notification.module.css";
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";
import PageTitle from "@/components/fragments/PageTitle";
import NotificationList from "@/components/notification/NotificationList";
import Toast from "@/components/common/toast/Toast";
import { withPartnerAuth } from "@/components/auth/withAuth";
import { fetchPartnerNotifications } from "@/lib/api/notification";
import {
  mockPartnerNotifications,
  mapPartnerNotificationToItem,
} from "@/data/notification/notificationData";

function PartnerNotificationPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const [notifications, setNotifications] = useState(mockPartnerNotifications);
  const [is_delete_toast_open, set_is_delete_toast_open] = useState(false);

  const { data: apiData } = useQuery({
    queryKey: ["partnerNotifications"],
    queryFn: () => fetchPartnerNotifications(),
    retry: false,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (apiData && apiData.items.length > 0) {
      setNotifications(apiData.items.map(mapPartnerNotificationToItem));
    }
  }, [apiData]);

  const handle_delete_all_click = () => {
    setNotifications([]);
    set_is_delete_toast_open(true);
  };

  const handle_notification_click = (_notification: (typeof mockPartnerNotifications)[0]) => {
    // TODO: 알림 상세 페이지로 이동 또는 모달 열기
  };

  return (
    <div className={`${styles.notification_container} ${isMobile ? styles.mobile : ""}`}>
      {!isMobile && <PartnerSubHeader />}

      {isMobile ? (
        <PageTitle
          title="알림"
          right_content={
            <button className={styles.delete_all_button} onClick={handle_delete_all_click}>
              전체 삭제
            </button>
          }
        />
      ) : (
        <div className={styles.notification_header}>
          <h1 className={styles.notification_header_title}>알림</h1>
          <button className={styles.delete_all_button} onClick={handle_delete_all_click}>
            전체 삭제
          </button>
        </div>
      )}

      <main className={styles.main_content}>
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

export default withPartnerAuth(PartnerNotificationPage);
