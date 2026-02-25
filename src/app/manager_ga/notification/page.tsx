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

import React, { useState } from "react";
import styles from "@/styles/user/notification/notification.module.css";
import ManagerGAHeader from "@/components/manager/ga/common/ManagerGAHeader";
import SidebarMenuGA from "@/components/manager/ga/common/SidebarMenu";
import NotificationList from "@/components/notification/NotificationList";
import Toast from "@/components/common/toast/Toast";
// 관리자 페이지 레이아웃 스타일 (사이드바가 있을 때 사용)
import "@/styles/manager_ga/layout.css";
// 알림 목업 데이터 (향후 API로 대체)
import { mockManagerGANotifications } from "@/data/notification/notificationData";

export default function ManagerGANotificationPage() {
  const [notifications, setNotifications] = useState(mockManagerGANotifications);
  const [is_delete_toast_open, set_is_delete_toast_open] = useState(false);

  /**
   * 알림 클릭 핸들러 (향후 구현)
   */
  const handle_notification_click = (_notification: (typeof mockManagerGANotifications)[0]) => {
    // TODO: 알림 상세 페이지로 이동 또는 모달 열기
  };

  /** 전체 삭제 버튼 클릭 → 바로 삭제 후 토스트만 표시 */
  const handle_delete_all_click = () => {
    setNotifications([]);
    set_is_delete_toast_open(true);
  };

  return (
    <div className={`${styles.notification_container} ${styles.has_sidebar}`.trim()}>
      {/* GA 관리자 헤더 */}
      <ManagerGAHeader managerType="ga" />

      {/* GA 사이드바 메뉴 */}
      <SidebarMenuGA />

      {/* 메인 콘텐츠 영역 */}
      <main className={styles.main_content}>
        {/* 관리자 알림 제목 + 전체 삭제 (관리자 스타일 유지) */}
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

        {/* 알림 목록 컴포넌트 */}
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
