// 헤더
"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import styles from "@/styles/fragments/header.module.css";
import { mockReviewerNotifications } from "@/data/notification/notificationData";
import HeaderSearch from "@/components/fragments/HeaderSearch";
import { useEffect, useState, MouseEvent } from "react";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  has_notifications?: boolean;
}

export default function Header({ has_notifications }: HeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Hydration 에러 방지를 위한 마운트 상태
  const [isMounted, setIsMounted] = useState(false);
  // 모바일 여부 감지
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    logout();
  };

  // 로고 이미지 경로 (모바일/PC 구분)
  const getLogoSrc = () => {
    if (!isMounted) {
      return "/images/header/vx_header_logo.svg";
    }
    return isMobile
      ? "/images/header/mobile/mo_header_vx_logo.svg"
      : "/images/header/vx_header_logo.svg";
  };

  // 검색 아이콘 경로 (모바일/PC 구분)
  const getSearchIconSrc = () => {
    // Hydration mismatch 방지:
    // - 서버/클라이언트 첫 렌더에서는 항상 동일한 아이콘을 사용
    // - 마운트 이후에만 모바일 아이콘으로 전환
    if (!isMounted) {
      return "/images/header/header_search.svg";
    }

    return isMobile
      ? "/images/header/mobile/mo_search.svg"
      : "/images/header/header_search.svg";
  };

  // 알림 아이콘: 비로그인 시 항상 비활성(알림 X), 로그인 시 알림 1개 이상이면 활성
  const getNotificationIconSrc = () => {
    if (!isMounted) {
      return "/images/header/notification_icon.svg";
    }

    // 비로그인 → 무조건 알림 비활성 아이콘
    if (!user) {
      return isMobile
        ? "/images/header/mobile/mo_notification_icon.svg"
        : "/images/header/notification_icon.svg";
    }

    // 로그인 상태: 알림 페이지에 알림이 1개라도 있으면 활성 아이콘
    const effective_has_notifications =
      has_notifications ?? mockReviewerNotifications.length > 0;

    if (isMobile) {
      return effective_has_notifications
        ? "/images/header/mobile/mo_notification_ok.svg"
        : "/images/header/mobile/mo_notification_icon.svg";
    }
    return effective_has_notifications
      ? "/images/header/notification_ok.svg"
      : "/images/header/notification_icon.svg";
  };

  // 사용자 아이콘 경로 (모바일/PC 구분)
  const getUserIconSrc = () => {
    return isMobile
      ? "/images/header/mobile/mo_user.svg"
      : "/images/header/header_user.svg";
  };

  // 알림 아이콘 클릭 핸들러
  const handleNotificationClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // 관리자 로그인 페이지에서는 알림 버튼 클릭 시 현재 페이지에 머무름
    if (pathname === "/manager/login") {
      event.preventDefault();
      return;
    }
    // 로그인하지 않은 상태에서는 알림 페이지로 이동하지 않음
    if (!user) {
      event.preventDefault();
      router.push("/user/login");
      return;
    }
    // 로그인된 상태에서는 기본 링크 동작으로 /user/notification 이동
  };

  // 사용자 아이콘 클릭 핸들러
  const handleUserIconClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // 관리자 로그인 페이지에서는 사용자 아이콘 클릭 시 현재 페이지에 머무름
    if (pathname === "/manager/login") {
      event.preventDefault();
      return;
    }
    // 기본 링크 동작으로 /user/campaign_management 이동
  };

  return (
    <header>
      <nav className={styles.header_container}>
        <Link href="/user" className={styles.header_logo}>
          <img src={getLogoSrc()} alt="VX 로고" />
        </Link>
        <div className={styles.menu_icon_box}>
          {/* 검색 */}
          <HeaderSearch searchIconSrc={getSearchIconSrc()} />
          {/* 알림 아이콘 (로그인 상태에 따라 동작) */}
          <Link
            href="/user/notification"
            className={styles.notification_icon}
            onClick={handleNotificationClick}
            aria-label="알림"
          >
            <img src={getNotificationIconSrc()} alt="bell_icon" />
          </Link>
          {/* 마이페이지로 연결 */}
          <Link
            href="/user/campaign_management"
            className={styles.user_icon}
            onClick={handleUserIconClick}
          >
            <img src={getUserIconSrc()} alt="user" />
          </Link>
          {/* 로그인된 사용자 정보 및 로그아웃 영역은 디자인 요구에 따라 숨김 처리 */}
        </div>
      </nav>
    </header>
  );
}
