// 헤더
"use client";
import Link from "next/link";
import styles from "@/styles/fragments/header.module.css";
import { mockReviewerNotifications } from "@/data/notification/notificationData";
import HeaderSearch from "@/components/fragments/HeaderSearch";

interface HeaderProps {
  has_notifications?: boolean;
}

export default function Header({ has_notifications }: HeaderProps) {
  // 기본값: props가 주어지면 그 값을 사용, 아니면 목업 데이터 기준
  const effective_has_notifications =
    has_notifications ?? mockReviewerNotifications.length > 0;

  // TODO: 실제 알림 데이터 연동 후, has_notifications 값을 API/전역 상태에서 가져오도록 수정
  const notification_icon_src = effective_has_notifications
    ? "/images/header/notification_ok.svg"
    : "/images/header/notification_icon.svg";

  return (
    <header>
      <nav className={styles.header_container}>
        <Link href="/">
          <h1 className={styles.header_logo}>RX.</h1>
        </Link>
        <div className={styles.menu_icon_box}>
          {/* 검색 */}
          <HeaderSearch />
          {/* 알림페이지로 연결 */}
          <Link href="/user/notification">
            <img src={notification_icon_src} alt="bell_icon" />
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
          <Link href="/user/campaign_management">
            <img src="/images/header/header_user.svg" alt="user" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
