// 헤더
"use client";
import Link from "next/link";
import styles from "@/styles/fragments/header.module.css";
import { mockReviewerNotifications } from "@/data/notification/notificationData";
import HeaderSearch from "@/components/fragments/HeaderSearch";
import { useEffect, useState } from "react";

interface HeaderProps {
  has_notifications?: boolean;
}

export default function Header({ has_notifications }: HeaderProps) {
  // Hydration 에러 방지를 위한 마운트 상태
  const [isMounted, setIsMounted] = useState(false);
  // 알림 아이콘 상태 (마운트 전에는 기본값 사용)
  const [notificationIconSrc, setNotificationIconSrc] = useState(
    "/images/header/notification_icon.svg"
  );

  useEffect(() => {
    setIsMounted(true);
    // 마운트 후 실제 알림 데이터 확인
    const effective_has_notifications =
      has_notifications ?? mockReviewerNotifications.length > 0;
    setNotificationIconSrc(
      effective_has_notifications
        ? "/images/header/notification_ok.svg"
        : "/images/header/notification_icon.svg"
    );
  }, [has_notifications]);

  return (
    <header>
      <nav className={styles.header_container}>
        <Link href="/user">
          <h1 className={styles.header_logo}>RX.</h1>
        </Link>
        <div className={styles.menu_icon_box}>
          {/* 검색 */}
          <HeaderSearch />
          {/* 알림페이지로 연결 */}
          <Link href="/user/notification" className={styles.notification_icon}>
            <img src={notificationIconSrc} alt="bell_icon" />
          </Link>
          {/* 마이페이지로 연결 */}
          <Link href="/user/campaign_management" className={styles.user_icon}>
            <img src="/images/header/header_user.svg" alt="user" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
