/* ========================================
   🔧 GA 관리자 헤더 컴포넌트
   ======================================== */

/**
 * GA 관리자 헤더 컴포넌트
 *
 * 목적: GA 관리자 페이지에서 사용되는 헤더로, 로고와 가이드/마이페이지 버튼이 포함됩니다.
 *
 * 사용 페이지:
 * - /manager_ga (GA 관리자 페이지)
 *
 * 주요 기능:
 * - 로고 표시 (일반 헤더와 동일한 "RX." 로고)
 * - 가이드 버튼 (외부 링크)
 * - 마이페이지 버튼
 *
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/styles/manager_ga/layout/header.module.css";
import { mockManagerGANotifications } from "@/data/notification/notificationData";

interface ManagerGAHeaderProps {
  managerType?: "ga" | "sa";
}

export default function ManagerGAHeader({
  managerType,
}: ManagerGAHeaderProps = {}) {
  const pathname = usePathname();

  // managerType이 prop으로 전달되지 않으면 경로에서 자동 감지
  const detectedType =
    managerType || (pathname?.includes("/manager_sa") ? "sa" : "ga");
  const homePath = detectedType === "sa" ? "/manager_sa" : "/manager_ga";
  const notificationPath =
    detectedType === "sa"
      ? "/manager_sa/notification"
      : "/manager_ga/notification";

  const has_notifications = mockManagerGANotifications.length > 0;
  const notification_icon_src = has_notifications
    ? "/images/header/notification_ok.svg"
    : "/images/header/notification_icon.svg";

  return (
    <header className={styles.header}>
      <div className={styles.header_container}>
        {/* 로고 - 일반 헤더와 동일한 "RX." 로고 */}
        <Link href={homePath}>
          <h1 className={styles.header_logo}>RX.</h1>
        </Link>

        {/* 우측 버튼 영역 - 가이드와 마이페이지 버튼 */}
        <div className={styles.menu_icon_box}>
          {/* 알림페이지로 연결 - 내부 링크 (manager 타입에 따라 파라미터 설정) */}
          <Link href={notificationPath}>
            <img src={notification_icon_src} alt="bell_icon" />
          </Link>

          {/* 마이페이지로 연결 - 호버 시 로그아웃 버튼 표시 */}
          <div className={styles.user_menu_container}>
            <Link href="">
              <img src="/images/header/header_user.svg" alt="user" />
            </Link>
            {/* 호버 시 표시되는 로그아웃 버튼 */}
            <button className={styles.logout_button}>로그아웃</button>
          </div>
        </div>
      </div>
    </header>
  );
}
