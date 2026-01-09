/* ========================================
   🔔 파트너 알림 페이지
   ======================================== */

/**
 * 파트너 알림 페이지
 *
 * 목적: 파트너 단에서 사용되는 알림 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/notification
 *
 * 주요 기능:
 * - 파트너 전용 헤더 표시
 * - 알림 목록 표시
 *
 */

"use client";

import React from "react";
import styles from "@/styles/user/notification/notification.module.css";
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";
import NotificationList from "@/components/notification/NotificationList";
import PageTitle from "@/components/fragments/PageTitle";
// 알림 목업 데이터 (향후 API로 대체)
import { mockPartnerNotifications } from "@/data/notification/notificationData";

export default function PartnerNotificationPage() {
  /**
   * 알림 목록 상태
   * 향후 API 연동 시 useState와 useEffect를 사용하여 서버에서 데이터를 가져올 수 있습니다.
   *
   * 예시:
   * const [notifications, setNotifications] = useState<NotificationItem[]>([]);
   *
   * useEffect(() => {
   *   // API 호출
   *   fetchPartnerNotifications().then(setNotifications);
   * }, []);
   */
  const notifications = mockPartnerNotifications;

  /**
   * 알림 클릭 핸들러 (향후 구현)
   * 알림 클릭 시 상세 페이지로 이동하거나 모달을 열 수 있습니다.
   *
   * @param notification - 클릭된 알림 아이템
   */
  const handle_notification_click = (
    notification: (typeof mockPartnerNotifications)[0]
  ) => {
    // TODO: 알림 상세 페이지로 이동 또는 모달 열기
    // 예시: router.push(`/partner/notification/${notification.id}`)
  };

  return (
    <div className={styles.notification_container}>
      {/* 파트너 전용 서브헤더 */}
      <PartnerSubHeader />

      {/* 메인 콘텐츠 영역 */}
      <main className={styles.main_content}>
        <PageTitle title="알림" />

        {/* 알림 목록 컴포넌트 */}
        <NotificationList
          notifications={notifications}
          on_notification_click={handle_notification_click}
        />
      </main>
    </div>
  );
}
