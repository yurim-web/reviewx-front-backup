/* ========================================
   메인 헤더 컴포넌트
   ======================================== */

/**
 * Header
 *
 * 목적: 앱 상단 메인 헤더 (검색, 알림, 내비게이션)
 *
 * 사용 페이지:
 * - / (홈 및 리뷰어 전체 레이아웃)
 */

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/styles/fragments/header.module.css";
import { mockReviewerNotifications } from "@/data/notification/notificationData";
import HeaderSearch from "@/components/fragments/HeaderSearch";
import { MouseEvent, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  has_notifications?: boolean;
}

export default function Header({ has_notifications }: HeaderProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const _handleLogout = () => {
    logout();
  };

  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [has_mounted, set_has_mounted] = useState(false);

  useEffect(() => {
    set_has_mounted(true);
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // 알림 활성 여부 계산
  const effective_has_notifications = has_notifications ?? mockReviewerNotifications.length > 0;

  // 관리자 로그인 페이지 또는 비로그인 시 알림 비활성
  const showNotificationActive =
    user && pathname !== "/manager/login" && effective_has_notifications;

  // SSR/클라이언트 초기 렌더 시 동일하게 숨김 → 하이드레이션 불일치 방지
  const iconVisibility = !has_mounted ? { visibility: "hidden" as const } : {};

  // 사용자 아이콘 클릭 핸들러
  const handleUserIconClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/manager/login") {
      event.preventDefault();
      return;
    }
  };

  // 마운트 전: 로고/아이콘 자리를 잡되 보이지 않게, 마운트 후: isMobile에 맞는 아이콘만 표시
  const logoSrc = isMobile
    ? "/images/header/mobile/mo_header_vx_logo.svg"
    : "/images/header/vx_header_logo.svg";

  const searchIconSrc = isMobile
    ? "/images/header/mobile/mo_search.svg"
    : "/images/header/header_search.svg";

  const notificationIconSrc = isMobile
    ? showNotificationActive
      ? "/images/header/mobile/mo_notification_ok.svg"
      : "/images/header/mobile/mo_notification_icon.svg"
    : showNotificationActive
      ? "/images/header/notification_ok.svg"
      : "/images/header/notification_icon.svg";

  const userIconSrc = isMobile
    ? "/images/header/mobile/mo_user.svg"
    : "/images/header/header_user.svg";

  return (
    <header className={styles.header_root}>
      <nav className={styles.header_container}>
        <Link href="/user" className={styles.header_logo} style={iconVisibility}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt="VX 로고" />
        </Link>
        <div className={styles.menu_icon_box} style={iconVisibility}>
          <HeaderSearch searchIconSrc={searchIconSrc} />

          {user && (
            <Link href="/user/notification" className={styles.notification_icon} aria-label="알림">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={notificationIconSrc} alt="bell_icon" />
            </Link>
          )}

          <Link
            href="/user/campaign_management"
            className={styles.user_icon}
            onClick={handleUserIconClick}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={userIconSrc} alt="user" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
