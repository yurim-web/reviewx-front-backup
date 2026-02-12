/* ========================================
   🔔 SA 관리자 알림 페이지
   ======================================== */

/**
 * SA 관리자 알림 페이지
 *
 * 목적: SA 관리자 단에서 사용되는 알림 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_sa/notification
 *
 * 주요 기능:
 * - SA 관리자 전용 헤더 표시
 * - 사이드바 메뉴 표시
 * - 알림 목록 표시
 *
 */

"use client";

import React, { useState } from "react";
import styles from "@/styles/user/notification/notification.module.css";
import ManagerGAHeader from "@/components/manager/ga/common/ManagerGAHeader";
import SidebarMenuSA from "@/components/manager/sa/common/SidebarMenu";
import NotificationList from "@/components/notification/NotificationList";
import BaseModal from "@/components/common/modal/BaseModal";
// 관리자 페이지 레이아웃 스타일 (사이드바가 있을 때 사용)
import "@/styles/manager_ga/layout.css";
// 알림 목업 데이터 (향후 API로 대체)
import { mockManagerSANotifications } from "@/data/notification/notificationData";

export default function ManagerSANotificationPage() {
  const [notifications, setNotifications] = useState(mockManagerSANotifications);
  const [is_delete_modal_open, set_is_delete_modal_open] = useState(false);

  /**
   * 알림 클릭 핸들러 (향후 구현)
   */
  const handle_notification_click = (
    notification: (typeof mockManagerSANotifications)[0]
  ) => {
    // TODO: 알림 상세 페이지로 이동 또는 모달 열기
  };

  return (
    <div
      className={`${styles.notification_container} ${styles.has_sidebar}`.trim()}
    >
      {/* SA 관리자 헤더 */}
      <ManagerGAHeader managerType="sa" />

      {/* SA 사이드바 메뉴 */}
      <SidebarMenuSA />

      {/* 메인 콘텐츠 영역 */}
      <main className={styles.main_content}>
        {/* 관리자 알림 제목 + 전체 삭제 (관리자 스타일 유지) */}
        <div className={styles.manager_notification_header}>
          <h1 className={styles.notification_title}>알림</h1>
          <button
            type="button"
            className={styles.delete_all_button}
            onClick={() => set_is_delete_modal_open(true)}
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

      {/* 전체 삭제 확인 모달 */}
      <BaseModal
        is_open={is_delete_modal_open}
        on_close={() => set_is_delete_modal_open(false)}
        message="삭제되었습니다."
        buttons={["확인"]}
        on_confirm={() => {
          setNotifications([]);
          set_is_delete_modal_open(false);
        }}
      />
    </div>
  );
}
