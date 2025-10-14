"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../../styles/fragments/sub_header.module.css";

export default function SubHeader() {
  const router = useRouter();

  // 뒤로가기 함수
  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className={styles.gradient_bar}>
      <div className={styles.header_controls}>
        <button className={styles.back_button} onClick={handleGoBack}>
          <img src="/images/header/header_arrow_back.svg" alt="뒤로가기" />
        </button>
        <div className={styles.right_icons}>
          <a
            href="https://markx.dev/guide_book"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.bookmark_icon}
          >
            <img src="/images/header/header_book.svg" alt="book" />
          </a>
          <Link href="/mypage" className={styles.user_icon}>
            <img src="/images/header/header_user.svg" alt="user" />
          </Link>
        </div>
      </div>
    </div>
  );
}
