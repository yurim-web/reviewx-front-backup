"use client";

import React, { useState } from "react";
import styles from "@/styles/user/notification/notification.module.css";
import Toast from "@/components/common/toast/Toast";
import Loading from "@/app/loading";
import {
  useAdminNotifications,
  useReadAdminNotification,
  useReadAllAdminNotifications,
  useDeleteAdminNotification,
  useDeleteAllAdminNotifications,
} from "@/hooks/manager/ga/useAdminNotifications";
import type { AdminNotificationParams, AdminNotificationItem } from "@/types/api/notification";

/** 카테고리별 라벨/색상 매핑 */
const CATEGORY_MAP: Record<string, { label: string; color: string }> = {
  OPERATION: { label: "운영", color: "blue" },
  INQUIRY: { label: "문의", color: "orange" },
};

/** 카테고리 색상 → CSS 클래스 */
function getLabelClassName(color: string): string {
  switch (color) {
    case "blue":
      return styles.notification_label_blue;
    case "red":
      return styles.notification_label_red;
    case "green":
      return styles.notification_label_green;
    case "orange":
      return styles.notification_label_orange;
    default:
      return styles.notification_label_blue;
  }
}

/** sentAt → 표시용 날짜 포맷 */
function formatSentAt(sentAt: string): string {
  const date = new Date(sentAt);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d} ${h}:${min}`;
}

type CategoryFilter = "ALL" | "OPERATION" | "INQUIRY";
type ReadFilter = "ALL" | "READ" | "UNREAD";

export default function ManagerSANotificationPage() {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("ALL");
  const [readFilter, setReadFilter] = useState<ReadFilter>("ALL");
  const [toastMessage, setToastMessage] = useState("");
  const [isToastOpen, setIsToastOpen] = useState(false);

  // 쿼리 파라미터 구성
  const params: AdminNotificationParams = {};
  if (categoryFilter !== "ALL") params.category = categoryFilter;
  if (readFilter === "READ") params.isRead = true;
  if (readFilter === "UNREAD") params.isRead = false;

  const { data: response, isLoading, isError } = useAdminNotifications(params);
  const readMutation = useReadAdminNotification();
  const readAllMutation = useReadAllAdminNotifications();
  const deleteMutation = useDeleteAdminNotification();
  const deleteAllMutation = useDeleteAllAdminNotifications();

  const notifications = response?.data?.notifications ?? [];
  const unreadCount = response?.data?.unreadCount ?? 0;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setIsToastOpen(true);
  };

  /** mutation 에러 핸들러 */
  const handleMutationError = (error: unknown) => {
    const status = (error as { response?: { status?: number } })?.response?.status;
    if (status === 404) {
      showToast("알림을 찾을 수 없습니다.");
    } else if (status === 403) {
      showToast("접근 권한이 없습니다.");
    } else {
      showToast("오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  /** 알림 클릭 → 읽음 처리 */
  const handleNotificationClick = (notification: AdminNotificationItem) => {
    if (!notification.isRead) {
      readMutation.mutate(notification.notificationId, { onError: handleMutationError });
    }
  };

  /** 전체 읽음 */
  const handleReadAll = () => {
    readAllMutation.mutate(undefined, {
      onSuccess: () => showToast("모든 알림을 읽음 처리했습니다."),
      onError: handleMutationError,
    });
  };

  /** 개별 삭제 */
  const handleDelete = (e: React.MouseEvent, notificationId: number) => {
    e.stopPropagation();
    deleteMutation.mutate(notificationId, {
      onSuccess: () => showToast("삭제되었습니다."),
      onError: handleMutationError,
    });
  };

  /** 전체 삭제 */
  const handleDeleteAll = () => {
    deleteAllMutation.mutate(undefined, {
      onSuccess: () => showToast("삭제되었습니다."),
      onError: handleMutationError,
    });
  };

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <div className={`${styles.notification_container} ${styles.has_sidebar}`}>
        <main className={styles.main_content}>
          <div className={styles.manager_notification_header}>
            <h1 className={styles.notification_title}>알림</h1>
          </div>
          <div className={styles.empty_state}>
            <p className={styles.empty_text}>알림을 불러오는 중 오류가 발생했습니다.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`${styles.notification_container} ${styles.has_sidebar}`}>
      <main className={styles.main_content}>
        {/* 헤더 */}
        <div className={styles.manager_notification_header}>
          <h1 className={styles.notification_title}>
            알림
            {unreadCount > 0 && (
              <span style={{ color: "#ff2626", fontSize: "16px", marginLeft: "8px" }}>
                ({unreadCount})
              </span>
            )}
          </h1>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button type="button" className={styles.delete_all_button} onClick={handleReadAll}>
              전체 읽음
            </button>
            <button type="button" className={styles.delete_all_button} onClick={handleDeleteAll}>
              전체 삭제
            </button>
          </div>
        </div>

        {/* 필터 */}
        <div style={{ display: "flex", gap: "8px", padding: "0 40px 16px 40px", flexWrap: "wrap" }}>
          {/* 카테고리 필터 */}
          {(["ALL", "OPERATION", "INQUIRY"] as CategoryFilter[]).map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setCategoryFilter(val)}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                border: categoryFilter === val ? "1px solid #2b7fff" : "1px solid #e5e5e5",
                background: categoryFilter === val ? "#2b7fff" : "#fff",
                color: categoryFilter === val ? "#fff" : "#666",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {val === "ALL" ? "전체" : val === "OPERATION" ? "운영" : "문의"}
            </button>
          ))}
          <div style={{ width: "1px", height: "24px", background: "#e5e5e5", margin: "0 4px" }} />
          {/* 읽음 필터 */}
          {(["ALL", "UNREAD", "READ"] as ReadFilter[]).map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setReadFilter(val)}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                border: readFilter === val ? "1px solid #2b7fff" : "1px solid #e5e5e5",
                background: readFilter === val ? "#2b7fff" : "#fff",
                color: readFilter === val ? "#fff" : "#666",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {val === "ALL" ? "전체" : val === "UNREAD" ? "안읽음" : "읽음"}
            </button>
          ))}
        </div>

        {/* 알림 목록 */}
        <section className={styles.notification_list}>
          {notifications.length > 0 ? (
            notifications.map((n) => {
              const cat = CATEGORY_MAP[n.category] || CATEGORY_MAP.OPERATION;
              return (
                <div
                  key={n.notificationId}
                  className={styles.notification_item}
                  onClick={() => handleNotificationClick(n)}
                  style={{
                    cursor: "pointer",
                    opacity: n.isRead ? 0.6 : 1,
                  }}
                >
                  <div className={styles.notification_content}>
                    <div className={styles.notification_left}>
                      <p className={`${styles.notification_label} ${getLabelClassName(cat.color)}`}>
                        {cat.label}
                      </p>
                      <p
                        className={styles.notification_message}
                        style={{ fontWeight: n.isRead ? 400 : 600 }}
                      >
                        {n.title}
                      </p>
                      <p style={{ color: "#666", fontSize: "14px", margin: 0, lineHeight: "20px" }}>
                        {n.message}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: "8px",
                        flexShrink: 0,
                      }}
                    >
                      <p className={styles.notification_time}>{formatSentAt(n.sentAt)}</p>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, n.notificationId)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#999",
                          fontSize: "12px",
                          cursor: "pointer",
                          padding: 0,
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.empty_state}>
              <p className={styles.empty_text}>알림이 없습니다.</p>
            </div>
          )}
        </section>
      </main>

      <Toast
        message={toastMessage}
        isOpen={isToastOpen}
        duration={1500}
        onClose={() => setIsToastOpen(false)}
      />
    </div>
  );
}
