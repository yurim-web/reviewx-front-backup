/* ========================================
   파트너 알림 페이지
   ======================================== */

/**
 * PartnerNotificationPage
 *
 * 목적: 파트너 전용 알림 목록 표시 (커서 기반 무한 스크롤, 전체 삭제)
 *
 * 사용 페이지:
 * - /partner/notification
 */

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { mapPartnerNotificationToItem } from "@/data/notification/notificationData";

function PartnerNotificationPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePartnerNotifications();

  const deleteMutation = useDeleteAllPartnerNotifications();

  // 모든 페이지 알림 병합
  const notifications = (data?.pages ?? []).flatMap((page) =>
    page.items.map((item) => {
      const raw = item as unknown as { createdAt?: string };
      return mapPartnerNotificationToItem({
        notificationHistoryId: item.notificationHistoryId,
        campaignId: item.campaignId,
        userId: 0,
        type: item.type,
        message: item.message,
        createdAt: item.sentAt ?? raw.createdAt ?? "",
      });
    })
  );

  // IntersectionObserver — 스크롤 하단 감지 시 다음 페이지 로드
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const element = observerRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver]);

  const handleDeleteAll = async () => {
    await deleteMutation.mutateAsync();
    setShowDeleteToast(true);
  };

  if (isLoading) return <Loading />;

  return (
    <div className={`${styles.notification_container} ${isMobile ? styles.mobile : ""}`}>
      {!isMobile && <PartnerSubHeader />}

      {isMobile ? (
        <PageTitle
          title="알림"
          right_content={
            <button className={styles.delete_all_button} onClick={handleDeleteAll}>
              전체 삭제
            </button>
          }
        />
      ) : (
        <div className={styles.notification_header}>
          <h1 className={styles.notification_header_title}>알림</h1>
          <button className={styles.delete_all_button} onClick={handleDeleteAll}>
            전체 삭제
          </button>
        </div>
      )}

      <main className={styles.main_content}>
        <NotificationList notifications={notifications} on_notification_click={() => {}} />
        {/* 무한 스크롤 감지 영역 */}
        <div ref={observerRef} style={{ height: 1 }} />
        {isFetchingNextPage && <Loading />}
      </main>

      <Toast
        message="삭제되었습니다."
        isOpen={showDeleteToast}
        duration={1500}
        onClose={() => setShowDeleteToast(false)}
      />
    </div>
  );
}

export default withPartnerAuth(PartnerNotificationPage);
