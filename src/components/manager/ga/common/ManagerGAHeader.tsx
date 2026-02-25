/* ========================================
   GA
   ======================================== */

/**
 * GA 관리자 헤더 컴포넌트
 *
 * 목적: GA 관리자 페이지에서 사용되는 헤더로, 로고와 가이드/마이페이지 버튼이 포함됩니다.
 *
 * 사용 페이지:
 * - /manager_ga (GA 관리자 페이지)
 *
 */

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import styles from "@/styles/manager_ga/layout/header.module.css";
import { mockManagerGANotifications } from "@/data/notification/notificationData";
import { performLogout } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";

interface ManagerGAHeaderProps {
  managerType?: "ga" | "sa";
}

export default function ManagerGAHeader({ managerType }: ManagerGAHeaderProps = {}) {
  const pathname = usePathname();
  const _router = useRouter();
  const { isAuthenticated } = useAuth();
  const [is_logout_menu_open, setIsLogoutMenuOpen] = useState(false);
  const user_menu_ref = useRef<HTMLDivElement>(null);

  // managerType이 prop으로 전달되지 않으면 경로에서 자동 감지
  const detectedType = managerType || (pathname?.includes("/manager_sa") ? "sa" : "ga");
  const homePath = detectedType === "sa" ? "/manager_sa" : "/manager_ga";
  const notificationPath =
    detectedType === "sa" ? "/manager_sa/notification" : "/manager_ga/notification";

  // 비로그인 → 무조건 비활성 아이콘 / 로그인 + 알림 1개 이상 → 활성 아이콘
  const has_notifications = isAuthenticated && mockManagerGANotifications.length > 0;
  // 📌 관리자 헤더 전용 흰색 알림 아이콘 사용
  const notification_icon_src = has_notifications
    ? "/images/header/manager/notification_ok_white.svg"
    : "/images/header/manager/notification_icon_white.svg";

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handle_click_outside = (event: MouseEvent) => {
      if (user_menu_ref.current && !user_menu_ref.current.contains(event.target as Node)) {
        setIsLogoutMenuOpen(false);
      }
    };

    if (is_logout_menu_open) {
      document.addEventListener("mousedown", handle_click_outside);
    }

    return () => {
      document.removeEventListener("mousedown", handle_click_outside);
    };
  }, [is_logout_menu_open]);

  // 사용자 메뉴 아이콘 클릭 핸들러
  const handle_user_icon_click = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLogoutMenuOpen(!is_logout_menu_open);
  };

  // 로그아웃 버튼 클릭 핸들러
  const handle_logout_click = () => {
    // LocalStorage에 저장된 인증 정보 제거
    performLogout();
    setIsLogoutMenuOpen(false);
    // 관리자 공용 로그인 페이지로 이동 (새로고침 포함)
    window.location.href = "/manager/login";
  };

  return (
    <header className={styles.header}>
      <div className={styles.header_container}>
        {/* 로고 - 관리자 헤더 전용 로고 이미지 */}
        <Link href={homePath} className={styles.header_logo}>
          <img src="/images/header/manager/admin_header_logo.svg" alt="VX로고" />
        </Link>

        {/* 우측 버튼 영역 - 가이드와 마이페이지 버튼 */}
        <div className={styles.menu_icon_box}>
          {/* 알림페이지로 연결 - 내부 링크 (manager 타입에 따라 파라미터 설정) */}
          <Link href={notificationPath}>
            <img src={notification_icon_src} alt="bell_icon" />
          </Link>

          {/* 마이페이지로 연결 - 클릭 시 로그아웃 버튼 표시 */}
          <div ref={user_menu_ref} className={styles.user_menu_container}>
            <button
              type="button"
              onClick={handle_user_icon_click}
              className={styles.user_icon_button}
            >
              {/* 📌 관리자 헤더 전용 흰색 사용자 아이콘 */}
              <img src="/images/header/manager/header_user_white.svg" alt="user" />
            </button>
            {/* 클릭 시 표시되는 로그아웃 버튼 */}
            {is_logout_menu_open && (
              <button type="button" className={styles.logout_button} onClick={handle_logout_click}>
                로그아웃
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
