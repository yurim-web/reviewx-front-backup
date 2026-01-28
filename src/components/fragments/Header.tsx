// 헤더
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  // Hydration 에러 방지를 위한 마운트 상태
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      logout();
    }
  };

  // 알림 아이콘 결정 (클라이언트에서만 동적으로 변경)
  const getNotificationIconSrc = () => {
    if (!isMounted) {
      // 서버 렌더링 또는 첫 렌더링 시 기본 아이콘
      return "/images/header/notification_icon.svg";
    }

    if (!user) {
      return "/images/header/notification_icon.svg";
    }

    const effective_has_notifications =
      has_notifications ?? mockReviewerNotifications.length > 0;
    return effective_has_notifications
      ? "/images/header/notification_ok.svg"
      : "/images/header/notification_icon.svg";
  };

  return (
    <header>
      <nav className={styles.header_container}>
        <Link href="/user">
          <img 
            src="/images/header/header_vx_logo.svg" 
            alt="ReviewX 로고" 
            className={styles.header_logo}
          />
        </Link>
        <div className={styles.menu_icon_box}>
          {/* 검색 */}
          <HeaderSearch />
          {/* 알림페이지로 연결 */}
          <Link
            href="/user/notification"
            className={styles.notification_icon}
          >
            <img src={getNotificationIconSrc()} alt="bell_icon" />
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
