/* ========================================
   🔔 알림 목록 컴포넌트 (공통)
   ======================================== */

/**
 * 알림 목록 컴포넌트 (공통)
 *
 * 목적: 유저/파트너/관리자 단에서 모두 사용할 수 있는 알림 목록 컴포넌트입니다.
 *
 * 사용 위치:
 * - /user/notification
 * - /partner/notification
 * - /manager_ga/notification
 * - /manager_sa/notification
 *
 * 주요 기능:
 * - 알림 목록 표시 (라벨, 내용, 시간)
 * - 알림 타입별 색상 구분
 * - 빈 상태 처리
 *
 */

"use client";

import React from "react";
import styles from "@/styles/user/notification/notification.module.css";
import type { NotificationItem, NotificationColor } from "@/data/notification/notificationData";
import {
  format_notification_message,
  get_notification_template,
} from "@/data/notification/notificationData";

// 확장된 알림 아이템 타입 (직접 message와 _source 필드를 포함할 수 있음)
type ExtendedNotificationItem = NotificationItem & {
  message?: string;
  _source?: string;
};

/**
 * NotificationList Props 타입
 */
export interface NotificationListProps {
  /** 알림 목록 데이터 */
  notifications: NotificationItem[];
  /** 알림 클릭 핸들러 (선택적) */
  on_notification_click?: (notification: NotificationItem) => void;
}

/**
 * 알림 목록 컴포넌트
 *
 * @param props - NotificationListProps
 * @returns JSX.Element
 */
export default function NotificationList({
  notifications,
  on_notification_click,
}: NotificationListProps) {
  /**
   * 알림 라벨 색상 클래스 결정 함수
   *
   * CSS 모듈 주의사항:
   * - CSS 모듈은 클래스명을 해시화하므로 .class1.class2 같은 결합 선택자는 작동하지 않음
   * - 따라서 별도의 클래스명을 사용해야 함
   *
   * @param color - 알림 색상 ("blue" | "red" | "green" | "orange")
   * @returns CSS 클래스명
   */
  const getLabelClassName = (color: NotificationColor): string => {
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
        return styles.notification_label_red;
    }
  };

  return (
    <section className={styles.notification_list}>
      {/* 
        조건부 렌더링: 알림이 있을 때와 없을 때를 구분
        - notifications.length > 0: 알림이 있는 경우 목록 렌더링
        - 그 외: 빈 상태 메시지 표시
      */}
      {notifications.length > 0 ? (
        /**
         * map 함수를 사용한 리스트 렌더링
         * - 배열의 각 요소를 React 컴포넌트로 변환
         * - key prop: React가 각 요소를 구분하기 위한 고유 식별자 (필수)
         * - key는 배열의 인덱스가 아닌 고유한 id를 사용하는 것이 권장됨
         */
        notifications.map((notification) => {
          const extNotification = notification as ExtendedNotificationItem;
          // 카테고리에 해당하는 템플릿 가져오기
          const template = get_notification_template(notification.category);

          // 메시지 결정: 직접 전달된 message가 있으면 사용, 없으면 템플릿 사용
          const message =
            extNotification.message ||
            format_notification_message(template.message_template, notification.message_params);

          // 고유한 키 생성: 출처와 id를 조합하여 중복 방지
          const uniqueKey = extNotification._source
            ? `${extNotification._source}-${notification.id}`
            : `default-${notification.id}`;

          return (
            <div
              key={uniqueKey}
              className={styles.notification_item}
              onClick={() => on_notification_click?.(notification)}
              style={{ cursor: on_notification_click ? "pointer" : "default" }}
            >
              {/* 알림 아이템 내부 레이아웃 */}
              <div className={styles.notification_content}>
                {/* 왼쪽 영역: 라벨 + 내용 */}
                <div className={styles.notification_left}>
                  {/* 
                    알림 라벨
                    - 동적 클래스명: getLabelClassName 함수로 색상에 맞는 CSS 클래스 적용
                    - 템플릿 리터럴: `${styles.notification_label} ${getLabelClassName(...)}`
                    - trim(): 공백 제거
                    - CSS 모듈에서는 클래스 결합 선택자가 작동하지 않으므로 별도 클래스 사용
                  */}
                  <p
                    className={`${
                      styles.notification_label
                    } ${getLabelClassName(template.color)}`.trim()}
                  >
                    {template.label}
                  </p>

                  {/* 알림 내용 - 템플릿에서 변수 치환된 메시지 */}
                  <p className={styles.notification_message}>{message}</p>

                  {/* 하단 캠페인 안내 (일반 텍스트) */}
                  {template.has_campaign_link && notification.campaign_name && (
                    <p className={styles.notification_campaign_name}>
                      {notification.campaign_name}
                    </p>
                  )}
                </div>

                {/* 오른쪽 영역: 시간 */}
                <p className={styles.notification_time}>{notification.time}</p>
              </div>
            </div>
          );
        })
      ) : (
        /**
         * 빈 상태 메시지
         * 알림이 없을 때 사용자에게 안내 메시지를 표시합니다.
         */
        <div className={styles.empty_state}>
          <p className={styles.empty_text}>알림이 없습니다.</p>
        </div>
      )}
    </section>
  );
}
