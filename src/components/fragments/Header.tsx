// 헤더
"use client";
import Link from "next/link";
import styles from "@/styles/fragments/header.module.css";
import { mockReviewerNotifications } from "@/data/notification/notificationData";
import HeaderSearch from "@/components/fragments/HeaderSearch";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  has_notifications?: boolean;
}

export default function Header({ has_notifications }: HeaderProps) {
  const { user, logout } = useAuth();

  // Hydration 에러 방지를 위한 마운트 상태
  const [isMounted, setIsMounted] = useState(false);
  // 알림 아이콘 상태 (마운트 전에는 기본값 사용)
  const [notificationIconSrc, setNotificationIconSrc] = useState(
    "/images/header/notification_icon.svg"
  );

  useEffect(() => {
    setIsMounted(true);

    // 로그인 안 되어 있으면 알림 없음 아이콘
    if (!user) {
      setNotificationIconSrc("/images/header/notification_icon.svg");
      return;
    }

    // 로그인 되어 있으면 알림 데이터 확인
    const effective_has_notifications =
      has_notifications ?? mockReviewerNotifications.length > 0;
    setNotificationIconSrc(
      effective_has_notifications
        ? "/images/header/notification_ok.svg"
        : "/images/header/notification_icon.svg"
    );
  }, [has_notifications, user]);

  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      logout();
    }
  };

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
          {/* 로그인된 사용자 정보 및 로그아웃 영역은 디자인 요구에 따라 숨김 처리 */}
        </div>
      </nav>
    </header>
  );
}
