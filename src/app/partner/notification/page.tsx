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

import React, { useState, useEffect } from "react";
import styles from "@/styles/user/notification/notification.module.css";
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";
import PageTitle from "@/components/fragments/PageTitle";
import NotificationList from "@/components/notification/NotificationList";
import BaseModal from "@/components/common/modal/BaseModal";
import Toast from "@/components/common/toast/Toast";
import { withPartnerAuth } from "@/components/auth/withAuth";
// 알림 목업 데이터 (향후 API로 대체)
import { mockPartnerNotifications } from "@/data/notification/notificationData";

function PartnerNotificationPage() {
  // 모바일 여부 감지
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
  const [notifications, setNotifications] = useState(mockPartnerNotifications);
  const [is_delete_done_modal_open, set_is_delete_done_modal_open] = useState(false);
  const [is_delete_toast_open, set_is_delete_toast_open] = useState(false);

  /** 전체 삭제 버튼 클릭 → 바로 삭제 후 "삭제되었습니다." 모달만 표시 */
  const handle_delete_all_click = () => {
    setNotifications([]);
    set_is_delete_done_modal_open(true);
  };

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
    <div
      className={`${styles.notification_container} ${
        isMobile ? styles.mobile : ""
      }`}
    >
      {/* 파트너 전용 서브헤더 (PC 전용) - 모바일에서는 렌더링하지 않음 */}
      {!isMobile && <PartnerSubHeader />}

      {/* 알림 페이지 헤더 */}
      {/* 모바일: PageTitle (뒤로가기 + 알림 + 전체 삭제) / PC: 기존 notification_header */}
      {isMobile ? (
        <PageTitle
          title="알림"
          right_content={
            <button
              className={styles.delete_all_button}
              onClick={handle_delete_all_click}
            >
              전체 삭제
            </button>
          }
        />
      ) : (
        <div className={styles.notification_header}>
          <h1 className={styles.notification_header_title}>알림</h1>
          <button
            className={styles.delete_all_button}
            onClick={handle_delete_all_click}
          >
            전체 삭제
          </button>
        </div>
      )}

      {/* 메인 콘텐츠 영역 */}
      <main className={styles.main_content}>
        {/* 알림 목록 컴포넌트 */}
        <NotificationList
          notifications={notifications}
          on_notification_click={handle_notification_click}
        />
      </main>

      {/* 삭제 완료 모달 (삭제되었습니다. + 닫기) → 닫기 클릭 시 토스트 표시 */}
      <BaseModal
        is_open={is_delete_done_modal_open}
        on_close={() => {
          set_is_delete_done_modal_open(false);
          set_is_delete_toast_open(true);
        }}
        message="삭제되었습니다."
        buttons={["닫기"]}
      />

      <Toast
        message="삭제되었습니다."
        isOpen={is_delete_toast_open}
        duration={1500}
        onClose={() => set_is_delete_toast_open(false)}
      />
    </div>
  );
}

// 파트너 전용 페이지로 보호
export default withPartnerAuth(PartnerNotificationPage);
