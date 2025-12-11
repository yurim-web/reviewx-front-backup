/* ========================================
   🔧 GA 관리자 헤더 컴포넌트
   ======================================== */

/**
 * GA 관리자 헤더 컴포넌트
 *
 * 목적: GA 관리자 페이지에서 사용되는 헤더로, 로고와 가이드/마이페이지 버튼이 포함됩니다.
 *
 * 사용 페이지:
 * - /manager_ga (GA 관리자 페이지)
 *
 * 주요 기능:
 * - 로고 표시 (일반 헤더와 동일한 "RX." 로고)
 * - 가이드 버튼 (외부 링크)
 * - 마이페이지 버튼
 *
 */

import Link from "next/link";
import styles from "@/styles/manager_ga/layout/header.module.css";

export default function ManagerGAHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.header_container}>
        {/* 로고 - 일반 헤더와 동일한 "RX." 로고 */}
        <Link href="/manager_ga">
          <h1 className={styles.header_logo}>RX.</h1>
        </Link>

        {/* 우측 버튼 영역 - 가이드와 마이페이지 버튼 */}
        <div className={styles.menu_icon_box}>
          {/* 알림페이지로 연결 - 내부 링크  */}
          <Link href="/notification">
            <img src="/images/icons/bell.svg" alt="bell" />
          </Link>

          {/* 가이드로 연결 - 외부 링크 */}
          <a
            href="https://markx.dev/guide_book"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/images/header/header_book.svg" alt="book" />
          </a>
          {/* 마이페이지로 연결 */}
          <Link href="">
            <img src="/images/header/header_user.svg" alt="user" />
          </Link>
        </div>
      </div>
    </header>
  );
}
