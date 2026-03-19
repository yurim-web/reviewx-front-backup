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

import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import styles from "@/styles/user/notification/notification.module.css";
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";
import PageTitle from "@/components/fragments/PageTitle";
import NotificationList from "@/components/notification/NotificationList";
import Toast from "@/components/common/toast/Toast";
import Loading from "@/app/loading";
import { withPartnerAuth } from "@/components/auth/withAuth";
import { fetchPartnerNotifications } from "@/lib/api/notification";
import type { NotificationApiItem } from "@/types/api/notification";
import {
  mockPartnerNotifications,
  type NotificationItem,
  type NotificationCategory,
} from "@/data/notification/notificationData";

/** API 응답 → NotificationItem 변환 */
function mapApiToNotificationItem(api: NotificationApiItem): NotificationItem {
  return {
    id: api.id,
    category: (api.type || "A_P1") as NotificationCategory,
    time: api.created_at,
    campaign_id: api.campaign_id,
    campaign_name: api.campaign_name,
  };
}

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

  const [deletedIds, setDeletedIds] = useState<Set<number | string>>(new Set());
  const [is_delete_toast_open, set_is_delete_toast_open] = useState(false);

  const {
    data: apiData,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["partnerNotifications"],
    queryFn: fetchPartnerNotifications,
    retry: false,
    staleTime: 30_000,
  });

  const notifications = useMemo<NotificationItem[]>(() => {
    if (apiData != null) {
      return apiData.map(mapApiToNotificationItem).filter((n) => !deletedIds.has(n.id));
    }
    if (isError) {
      return mockPartnerNotifications.filter((n) => !deletedIds.has(n.id));
    }
    return [];
  }, [apiData, isError, deletedIds]);

  const handle_delete_all_click = () => {
    const allIds = new Set(notifications.map((n) => n.id));
    setDeletedIds(allIds);
    set_is_delete_toast_open(true);
  };

  const handle_notification_click = (_notification: NotificationItem) => {
    // TODO: 알림 상세 페이지로 이동 또는 모달 열기
  };

  if (isLoading) {
    return <Loading />;
  }

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
