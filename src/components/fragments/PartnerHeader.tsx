/* ========================================
   🏢 파트너 전용 헤더 컴포넌트
   ======================================== */

/**
 * 파트너 전용 헤더 컴포넌트
 *
 * 목적: 파트너 페이지에서만 사용되는 헤더로, "새로운 캠페인 등록" 버튼이 포함됩니다.
 *
 * 사용 페이지:
 * - /partner (파트너 메인 페이지)
 *
 * 주요 기능:
 * - RX. 로고 (홈으로 이동)
 * - 새로운 캠페인 등록 버튼
 * - 가이드 아이콘 (외부 링크)
 * - 사용자 아이콘 (마이페이지로 이동)
 */

"use client";

import Link from "next/link";
import styles from "@/styles/fragments/header.module.css";
import { mockPartnerNotifications } from "@/data/notification/notificationData";
import HeaderSearch from "@/components/fragments/HeaderSearch";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

export default function PartnerHeader() {
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [notificationIconSrc, setNotificationIconSrc] = useState(
    "/images/header/notification_icon.svg"
  );

  /**
   * 클라이언트 마운트 확인 및 알림 아이콘 업데이트
   *
   * 설명:
   * - Hydration 에러를 방지하기 위해 클라이언트 마운트 후에만 알림 아이콘을 업데이트합니다.
   * - 서버 사이드 렌더링과 클라이언트 사이드 렌더링의 일치를 보장합니다.
   * - isMounted가 true가 된 후에만 알림 아이콘을 변경하여 hydration mismatch를 방지합니다.
   */
  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 마운트 전(isMobile=null)에는 아이콘 영역을 숨김 처리
  const iconVisibility = isMobile === null ? { visibility: "hidden" as const } : {};

  /**
   * 알림 아이콘: 비로그인 → 무조건 비활성(알림 X), 로그인 시 알림 1개 이상이면 활성
   */
  useEffect(() => {
    if (!isMounted || isMobile === null) return;

    if (!user) {
      setNotificationIconSrc(
        isMobile
          ? "/images/header/mobile/mo_notification_icon.svg"
          : "/images/header/notification_icon.svg"
      );
      return;
    }

    const has_notifications = mockPartnerNotifications.length > 0;
    if (isMobile) {
      setNotificationIconSrc(
        has_notifications
          ? "/images/header/mobile/mo_notification_ok.svg"
          : "/images/header/mobile/mo_notification_icon.svg"
      );
    } else {
      setNotificationIconSrc(
        has_notifications
          ? "/images/header/notification_ok.svg"
          : "/images/header/notification_icon.svg"
      );
    }
  }, [user, isMounted, isMobile]);

  // 로고 이미지 경로 (모바일/PC 구분)
  const logoSrc = isMobile
    ? "/images/header/mobile/mo_header_vx_logo.svg"
    : "/images/header/vx_header_logo.svg";

  // 검색 아이콘 경로 (모바일/PC 구분)
  const searchIconSrc = isMobile
    ? "/images/header/mobile/mo_search.svg"
    : "/images/header/header_search.svg";

  // 사용자 아이콘 경로 (모바일/PC 구분)
  const userIconSrc = isMobile
    ? "/images/header/mobile/mo_user.svg"
    : "/images/header/header_user.svg";

  return (
    <header className={styles.header_root}>
      <nav className={styles.header_container}>
        <Link href="/partner" className={styles.header_logo} style={iconVisibility}>
          <img src={logoSrc} alt="VX 로고" />
        </Link>
        <div className={styles.menu_icon_box} style={iconVisibility}>
          {/* 새로운 캠페인 등록: 로그인한 상태에서만 표시, PC에서는 버튼, 모바일에서는 아이콘 */}
          {user &&
            (isMobile ? (
              <Link
                href="/partner/campaign/create"
                className={styles.notification_icon}
                aria-label="새 캠페인 등록"
              >
                <img src="/images/header/mobile/mo_partner_campaign.svg" alt="새 캠페인 등록" />
              </Link>
            ) : (
              <Link href="/partner/campaign/create" className={styles.new_campaign_button}>
                새 캠페인 등록
              </Link>
            ))}

          {/* 검색창 - 파트너 전용 검색 결과 페이지로 이동 */}
          <HeaderSearch searchIconSrc={searchIconSrc} search_path="/partner/search" />

          {/* 알림페이지로 연결 */}
          {user && (
            <Link
              href="/partner/notification"
              className={styles.notification_icon}
              aria-label="알림"
            >
              <img src={notificationIconSrc} alt="알림" />
            </Link>
          )}

          {/* 가이드로 연결 - PC에서만 표시 */}
          {isMobile === false && (
            <a
              href="https://markx.dev/guide_book"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.bookmark_icon}
              aria-label="가이드북"
            >
              <img src="/images/header/header_book.svg" alt="가이드북" />
            </a>
          )}

          {/* 마이페이지로 연결 */}
          <Link
            href="/partner/campaign_management"
            className={styles.user_icon}
            aria-label="마이페이지"
          >
            <img src={userIconSrc} alt="사용자" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
