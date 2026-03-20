/* ========================================
   파트너 알림 페이지
   ======================================== */

/**
 * PartnerNotificationPage
 *
 * 목적: 파트너 전용 알림 목록 표시 (실제 API 연동, 커서 기반 무한 스크롤)
 *
 * 사용 페이지:
 * - /partner/notification
 */

"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import styles from "@/styles/user/notification/notification.module.css";
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";
import PageTitle from "@/components/fragments/PageTitle";
import NotificationList from "@/components/notification/NotificationList";
import Toast from "@/components/common/toast/Toast";
import Loading from "@/app/loading";
import { withPartnerAuth } from "@/components/auth/withAuth";
import {
  usePartnerNotifications,
  useDeleteAllPartnerNotifications,
} from "@/hooks/partner/usePartnerNotification";
import type {
  PartnerNotificationItem,
  PartnerNotificationType,
} from "@/types/api/partnerNotification";
import type {
  NotificationItem,
  PartnerNotificationCategory,
} from "@/data/notification/notificationData";

/** 백엔드 type → 프론트엔드 category 코드 매핑 */
const TYPE_TO_CATEGORY: Record<PartnerNotificationType, PartnerNotificationCategory> = {
  CAMPAIGN_STATUS_CHANGED: "A_P1",
  CAMPAIGN_COMPLETED: "A_P2",
  CAMPAIGN_SUSPENDED: "A_P3",
  CONTENT_REGISTERED: "A_P4",
  CONTENT_EXTENSION_REQUESTED: "A_P5",
  ACCOUNT_SUSPENDED: "A_P6",
  ACCOUNT_BANNED: "A_P7",
};

/** API 응답 → NotificationItem 변환 (message 포함) */
function mapApiToNotificationItem(
  api: PartnerNotificationItem
): NotificationItem & { message: string; is_read: boolean } {
  return {
    id: api.notificationHistoryId,
    category: TYPE_TO_CATEGORY[api.type] ?? "A_P1",
    time: api.createdAt,
    campaign_id: api.campaignId ?? undefined,
    message: api.message,
    is_read: false,
  };
}

function PartnerNotificationPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [is_delete_toast_open, set_is_delete_toast_open] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePartnerNotifications();

  const deleteAll = useDeleteAllPartnerNotifications();

  // 무한 스크롤 — IntersectionObserver
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  // 전체 페이지 → 단일 배열
  const notifications = useMemo<NotificationItem[]>(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.items.map(mapApiToNotificationItem));
  }, [data]);

  const handle_delete_all_click = () => {
    deleteAll.mutate(undefined, {
      onSuccess: () => {
        set_is_delete_toast_open(true);
      },
    });
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

        {/* 무한 스크롤 감지 영역 */}
        <div ref={observerRef} style={{ height: 1 }} />
        {isFetchingNextPage && (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <Loading />
          </div>
        )}
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
