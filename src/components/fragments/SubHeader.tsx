/**
 * 서브헤더 컴포넌트
 * 캠페인 상세 페이지 등에서 사용되는 헤더
 * - 뒤로가기 버튼
 * - 가이드북 링크
 * - 마이페이지 링크
 * - 항상 상단에 고정됨 (position: fixed)
 */

"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import styles from "../../styles/fragments/sub_header.module.css";

export default function SubHeader() {
  const router = useRouter();
  const pathname = usePathname();

  // 뒤로가기 함수
  const handleGoBack = () => {
    // 파트너 캠페인 생성 페이지에서는 홈으로 이동
    if (pathname?.startsWith("/partner/campaign/create")) {
      router.push("/partner");
    } else {
      router.back();
    }
  };

  return (
    // 항상 fixed 클래스 적용
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
          <Link href="/user/mypage" className={styles.user_icon}>
            <img src="/images/header/header_user.svg" alt="user" />
          </Link>
        </div>
      </div>
    </div>
  );
}
