/* ========================================
   🔔 GA 관리자 알림 페이지
   ======================================== */

/**
 * GA 관리자 알림 페이지
 *
 * 목적: GA 관리자 단에서 사용되는 알림 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_ga/notification
 *
 * 주요 기능:
 * - GA 관리자 전용 헤더 표시
 * - 사이드바 메뉴 표시
 * - 알림 목록 표시
 *
 */

"use client";

import React from "react";
import styles from "@/styles/user/notification/notification.module.css";
import ManagerGAHeader from "@/components/manager/ga/common/ManagerGAHeader";
import SidebarMenuGA from "@/components/manager/ga/common/SidebarMenu";
import NotificationList from "@/components/notification/NotificationList";
import ManagerPageTitle from "@/components/manager/common/fragments/ManagerPageTitle";
// 관리자 페이지 레이아웃 스타일 (사이드바가 있을 때 사용)
import "@/styles/manager_ga/layout.css";
// 알림 목업 데이터 (향후 API로 대체)
import { mockManagerGANotifications } from "@/data/notification/notificationData";

export default function ManagerGANotificationPage() {
  /**
   * 알림 목록 상태
   * 향후 API 연동 시 useState와 useEffect를 사용하여 서버에서 데이터를 가져올 수 있습니다.
   *
   * 예시:
   * const [notifications, setNotifications] = useState<NotificationItem[]>([]);
   *
   * useEffect(() => {
   *   // API 호출
   *   fetchManagerGANotifications().then(setNotifications);
   * }, []);
   */
  const notifications = mockManagerGANotifications;

  /**
   * 알림 클릭 핸들러 (향후 구현)
   * 알림 클릭 시 상세 페이지로 이동하거나 모달을 열 수 있습니다.
   *
   * @param notification - 클릭된 알림 아이템
   */
  const handle_notification_click = (
    notification: (typeof mockManagerGANotifications)[0]
  ) => {
    // TODO: 알림 상세 페이지로 이동 또는 모달 열기
    // 예시: router.push(`/manager_ga/notification/${notification.id}`)
  };

  return (
    <div
      className={`${styles.notification_container} ${styles.has_sidebar}`.trim()}
    >
      {/* GA 관리자 헤더 */}
      <ManagerGAHeader managerType="ga" />

      {/* GA 사이드바 메뉴 */}
      <SidebarMenuGA />

      {/* 메인 콘텐츠 영역 */}
      <main className={styles.main_content}>
        <h1 className={styles.notification_title}>알림</h1>

        {/* 알림 목록 컴포넌트 */}
        <NotificationList
          notifications={notifications}
          on_notification_click={handle_notification_click}
        />
      </main>
    </div>
  );
}
