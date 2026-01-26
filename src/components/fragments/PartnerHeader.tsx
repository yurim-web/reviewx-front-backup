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
import { useRouter } from "next/navigation";
import styles from "@/styles/fragments/header.module.css";
import { mockPartnerNotifications } from "@/data/notification/notificationData";
import HeaderSearch from "@/components/fragments/HeaderSearch";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

export default function PartnerHeader() {
  const { user } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
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
  }, []);

  /**
   * 사용자 상태 및 알림 데이터에 따른 알림 아이콘 업데이트
   *
   * 설명:
   * - 클라이언트 마운트 후에만 실행됩니다 (isMounted 체크).
   * - 로그인 상태와 알림 데이터를 확인하여 적절한 아이콘을 표시합니다.
   */
  useEffect(() => {
    // 클라이언트 마운트 전에는 실행하지 않음 (Hydration 에러 방지)
    if (!isMounted) return;

    // 로그인 안 되어 있으면 알림 없음 아이콘
    if (!user) {
      setNotificationIconSrc("/images/header/notification_icon.svg");
      return;
    }

    // 로그인 되어 있으면 알림 데이터 확인
    const has_notifications = mockPartnerNotifications.length > 0;
    setNotificationIconSrc(
      has_notifications
        ? "/images/header/notification_ok.svg"
        : "/images/header/notification_icon.svg"
    );
  }, [user, isMounted]);

  return (
    <header>
      <nav className={styles.header_container}>
        <Link href="/partner">
          <h1 className={styles.header_logo}>RX.</h1>
        </Link>
        <div className={styles.menu_icon_box}>
          {/* 새로운 캠페인 등록 버튼 */}
          <Link
            href="/partner/campaign/create"
            className={styles.new_campaign_button}
          >
            새 캠페인 등록
          </Link>

          {/* 검색창 - 파트너 전용 검색 결과 페이지로 이동 */}
          <HeaderSearch search_path="/partner/search" />

          {/* 알림페이지로 연결 */}
          <Link
            href="/partner/notification"
            className={styles.notification_icon}
          >
            <img src={notificationIconSrc} alt="notification" />
          </Link>

          {/* 가이드로 연결 */}
          <a
            href="https://markx.dev/guide_book"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.bookmark_icon}
          >
            <img src="/images/header/header_book.svg" alt="book" />
          </a>

          {/* 마이페이지로 연결 */}
          <Link
            href="/partner/campaign_management"
            className={styles.user_icon}
          >
            <img src="/images/header/header_user.svg" alt="user" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
