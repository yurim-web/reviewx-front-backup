// 헤더
import Link from 'next/link';
import styles from '@/styles/fragments/header.module.css';

export default function Header() {
  return (
    <header>
      <nav className={styles.header_container}>
        <Link href="/">
          <h1 className={styles.header_logo}>RX.</h1>
        </Link>
        <div className={styles.menu_icon_box}>
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
