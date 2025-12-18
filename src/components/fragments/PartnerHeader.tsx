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

import Link from "next/link";
import styles from "@/styles/fragments/header.module.css";
import { mockPartnerNotifications } from "@/data/notification/notificationData";
import HeaderSearch from "@/components/fragments/HeaderSearch";

export default function PartnerHeader() {
  const has_notifications = mockPartnerNotifications.length > 0;
  const notification_icon_src = has_notifications
    ? "/images/header/notification_ok.svg"
    : "/images/header/notification_icon.svg";

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
            새로운 캠페인 등록
          </Link>

          {/* 검색창 - 파트너 전용 검색 결과 페이지로 이동 */}
          <HeaderSearch search_path="/partner/search" />

          {/* 알림페이지로 연결 */}
          <Link href="/partner/notification">
            <img src={notification_icon_src} alt="notification" />
          </Link>

          {/* 가이드로 연결 */}
          <a
            href="https://markx.dev/guide_book"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/images/header/header_book.svg" alt="book" />
          </a>

          {/* 마이페이지로 연결 */}
          <Link href="/partner/campaign_management">
            <img src="/images/header/header_user.svg" alt="user" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
